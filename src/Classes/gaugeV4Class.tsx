import { Contract, Provider } from 'ethcall';
import { CTOKEN_ABI, GAUGE_CONTROLLER_ABI, GAUGE_V4_ABI, MINTER_ABI, REWARD_POLICY_MAKER_ABI, TOKEN_ABI } from '../abi';
import { Network } from '../networks';
import { BigNumber } from '../bigNumber';
import { ethers } from 'ethers';
import _, { floor } from 'lodash';

export interface GaugeV4GeneralData {
    address: string;
    lpToken: string;
    minter: string;
    rewardPolicyMaker: string;
    totalStake: BigNumber;
    workingTotalStake: BigNumber;
    weight: BigNumber;
    veHndRewardRate: BigNumber;
}

export class GaugeV4 {
    generalData: GaugeV4GeneralData;
    userStakeBalance: BigNumber;
    gaugeTokenDecimals: number;
    userStakedTokenBalance: BigNumber;
    userLpBalance: BigNumber;
    lpTokenDecimals: number;
    userClaimableHnd: BigNumber;
    userWorkingStakeBalance: BigNumber;
    userAllowance: BigNumber;
    stakeCall: (amount: string) => void;
    unstakeCall: (amount: string) => void;
    mintCall: () => void;
    approveCall: () => void;

    constructor(
        generalData: GaugeV4GeneralData,
        userStakeBalance: BigNumber,
        gaugeTokenDecimals: number,
        userLpBalance: BigNumber,
        lpTokenDecimals: number,
        userClaimableHnd: BigNumber,
        userWorkingStakeBalance: BigNumber,
        userAllowance: BigNumber,
        stakeCall: (amount: string) => void,
        unstakeCall: (amount: string) => void,
        mintCall: () => void,
        approveCall: () => void,
    ) {
        this.generalData = generalData;
        this.userStakeBalance = BigNumber.from(userStakeBalance.toString(), gaugeTokenDecimals);
        this.gaugeTokenDecimals = gaugeTokenDecimals;
        this.userStakedTokenBalance = userStakeBalance;
        this.userLpBalance = BigNumber.from(userLpBalance.toString(), lpTokenDecimals);
        this.lpTokenDecimals = lpTokenDecimals;
        this.userClaimableHnd = BigNumber.from(userClaimableHnd.toString(), 18);
        this.userWorkingStakeBalance = userWorkingStakeBalance;
        this.userAllowance = BigNumber.from(userAllowance.toString(), lpTokenDecimals);
        this.stakeCall = stakeCall;
        this.unstakeCall = unstakeCall;
        this.mintCall = mintCall;
        this.approveCall = approveCall;
    }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getGaugesData = async (provider: any, userAddress: string, network: Network): Promise<Array<GaugeV4>> => {
    const ethcallProvider = new Provider();
    await ethcallProvider.init(provider);

    if (network.multicallAddress) {
        ethcallProvider.multicallAddress = network.multicallAddress;
    }

    let generalData: Array<GaugeV4GeneralData> = [];

    if (network.gaugeControllerAddress) {
        const controller = network.gaugeControllerAddress;
        const ethcallGaugeController = new Contract(controller, GAUGE_CONTROLLER_ABI);

        const [nbGauges] = await ethcallProvider.all([ethcallGaugeController.n_gauges()]);

        const gauges = await ethcallProvider.all(
            Array.from(Array(nbGauges.toNumber()).keys()).map((i) => ethcallGaugeController.gauges(i)),
        );
        const activeGauges: string[] = [];

        let lpAndMinterAddresses = await ethcallProvider.all(
            gauges.flatMap((g) => [
                new Contract(g, GAUGE_V4_ABI).lp_token(),
                new Contract(g, GAUGE_V4_ABI).minter(),
                new Contract(g, GAUGE_V4_ABI).reward_policy_maker(),
                new Contract(g, GAUGE_V4_ABI).working_supply(),
                new Contract(g, GAUGE_V4_ABI).is_killed(),
                new Contract(controller, GAUGE_CONTROLLER_ABI).gauge_relative_weight(g),
            ]),
        );

        lpAndMinterAddresses = _.chunk(lpAndMinterAddresses, 6);
        const activeLpAndMinterAddresses: any[][] = [];

        for (let i = 0; i < lpAndMinterAddresses.length; i++) {
            if (!lpAndMinterAddresses[i][4]) {
                activeGauges.push(gauges[i]);
                activeLpAndMinterAddresses.push(lpAndMinterAddresses[i]);
            }
        }

        let rewards = await ethcallProvider.all(
            activeGauges.flatMap((g, index) => [
                new Contract(activeLpAndMinterAddresses[index][2], REWARD_POLICY_MAKER_ABI).rate_at(
                    floor(new Date().getTime() / 1000),
                ),
                new Contract(activeLpAndMinterAddresses[index][0], CTOKEN_ABI).balanceOf(g),
            ]),
        );

        rewards = _.chunk(rewards, 2);

        generalData = activeLpAndMinterAddresses.map((c, index) => {
            return {
                address: activeGauges[index],
                lpToken: c[0],
                minter: c[1],
                rewardPolicyMaker: c[2],
                weight: c[5],
                totalStake: rewards[index][1],
                workingTotalStake: c[3],
                veHndRewardRate: rewards[index][0],
            };
        });

        if (generalData.length > 0) {
            const info = await ethcallProvider.all(
                generalData.flatMap((g) => [
                    new Contract(g.address, GAUGE_V4_ABI).balanceOf(userAddress),
                    new Contract(g.address, GAUGE_V4_ABI).decimals(),
                    new Contract(g.lpToken, CTOKEN_ABI).balanceOf(userAddress),
                    new Contract(g.lpToken, CTOKEN_ABI).decimals(),
                    new Contract(g.address, GAUGE_V4_ABI).claimable_tokens(userAddress),
                    new Contract(g.address, GAUGE_V4_ABI).working_balances(userAddress),
                    new Contract(g.lpToken, CTOKEN_ABI).allowance(userAddress, g.address),
                ]),
            );

            const infoChunks = _.chunk(info, 7);

            return generalData.map((g, index) => {
                return new GaugeV4(
                    g,
                    infoChunks[index][0],
                    infoChunks[index][1],
                    infoChunks[index][2],
                    infoChunks[index][3],
                    infoChunks[index][4],
                    infoChunks[index][5],
                    infoChunks[index][6],
                    (amount: string) =>
                        stake(provider, g.address, ethers.utils.parseUnits(amount, infoChunks[index][3]).toString()),
                    (amount: string) =>
                        unstake(provider, g.address, ethers.utils.parseUnits(amount, infoChunks[index][1]).toString()),
                    () => mint(provider, g.address),
                    () => approve(provider, g.address, g.lpToken),
                );
            });
        }
    }

    return [];
};

const MaxUint256 = BigNumber.from(ethers.constants.MaxUint256);

const stake = async (provider: any, gaugeAddress: string, amount: string) => {
    const signer = provider.getSigner();
    const gauge = new ethers.Contract(gaugeAddress, GAUGE_V4_ABI, signer);
    const tx = await gauge.deposit(amount);
    await tx.wait();
};

const unstake = async (provider: any, address: string, amount: string) => {
    const signer = provider.getSigner();
    const gauge = new ethers.Contract(address, GAUGE_V4_ABI, signer);
    const tx = await gauge.withdraw(amount);
    await tx.wait();
};

const mint = async (provider: any, address: string) => {
    const signer = provider.getSigner();
    const gauge = new ethers.Contract(address, GAUGE_V4_ABI, signer);

    const minterAddress = await gauge.minter();

    const minter = new ethers.Contract(minterAddress, MINTER_ABI, signer);

    const tx = await minter.mint(address);
    await tx.wait();
};

const approve = async (provider: any, gaugeAddress: string, lpTokenAddress: string) => {
    const signer = provider.getSigner();
    const contract = new ethers.Contract(lpTokenAddress, TOKEN_ABI, signer);
    const approveTx = await contract.approve(gaugeAddress, MaxUint256._value);
    await approveTx.wait();
};
