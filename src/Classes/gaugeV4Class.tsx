import { Contract, Provider } from 'ethcall'
import {CTOKEN_ABI, GAUGE_CONTROLLER_ABI, GAUGE_V4_ABI, MINTER_ABI, REWARD_POLICY_MAKER_ABI, TOKEN_ABI} from '../abi'
import { Network } from '../networks'
import {BigNumber} from "../bigNumber";
import {ethers} from "ethers";
import _, {floor} from "lodash";

export interface GaugeV4GeneralData {
    address : string
    lpToken: string
    minter: string
    rewardPolicyMaker: string
    totalStake: BigNumber
    workingTotalStake: BigNumber
    weight: BigNumber
    veHndRewardRate: BigNumber
}

export class GaugeV4{
    generalData : GaugeV4GeneralData
    userStakeBalance: BigNumber
    userStakedTokenBalance: BigNumber
    userLpBalance: BigNumber
    userClaimableHnd: BigNumber
    userWorkingStakeBalance: BigNumber
    stakeCall: (amount: string) => void
    unstakeCall: (amount: string) => void
    mintCall: () => void

    constructor(
        generalData: GaugeV4GeneralData,
        userStakeBalance: BigNumber,
        userLpBalance: BigNumber,
        userClaimableHnd: BigNumber,
        userWorkingStakeBalance: BigNumber,
        stakeCall: (amount: string) => void,
        unstakeCall: (amount: string) => void,
        mintCall: () => void
    ){
        this.generalData = generalData
        this.userStakeBalance = BigNumber.from(userStakeBalance.toString(), 18)
        this.userStakedTokenBalance = userStakeBalance
        this.userLpBalance = BigNumber.from(userLpBalance.toString(), 8)
        this.userClaimableHnd = BigNumber.from(userClaimableHnd.toString(), 18)
        this.userWorkingStakeBalance = userWorkingStakeBalance
        this.stakeCall = stakeCall
        this.unstakeCall = unstakeCall
        this.mintCall = mintCall
    }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getGaugesData = async (provider: any, userAddress: string, network: Network): Promise<Array<GaugeV4>> => {
    const ethcallProvider = new Provider()
    await ethcallProvider.init(provider)

    if(network.multicallAddress) {
        ethcallProvider.multicallAddress = network.multicallAddress
    }

    let generalData: Array<GaugeV4GeneralData> = [];

    if (network.gaugeControllerAddress) {
        const controller = network.gaugeControllerAddress
        const ethcallGaugeController = new Contract(controller, GAUGE_CONTROLLER_ABI)

        const [nbGauges] = await ethcallProvider.all([ethcallGaugeController.n_gauges()])

        const gauges = await ethcallProvider.all(Array.from(Array(nbGauges.toNumber()).keys()).map(i => ethcallGaugeController.gauges(i)))

        let lpAndMinterAddresses = await ethcallProvider.all(
            gauges.flatMap((g) => [
                new Contract(g, GAUGE_V4_ABI).lp_token(),
                new Contract(g, GAUGE_V4_ABI).minter(),
                new Contract(g, GAUGE_V4_ABI).reward_policy_maker(),
                new Contract(g, GAUGE_V4_ABI).working_supply(),
                new Contract(controller, GAUGE_CONTROLLER_ABI).gauge_relative_weight(g)
            ])
        )

        lpAndMinterAddresses = _.chunk(lpAndMinterAddresses, 5)

        let rewards = await ethcallProvider.all(
            gauges.flatMap((g, index) => [
                    new Contract(lpAndMinterAddresses[index][2], REWARD_POLICY_MAKER_ABI).rate_at(floor(new Date().getTime() / 1000)),
                    new Contract(lpAndMinterAddresses[index][0], CTOKEN_ABI).balanceOf(g)
                ]
            )
        )

        rewards = _.chunk(rewards, 2)

        generalData = lpAndMinterAddresses.map((c, index) => {
            return {
                address: gauges[index],
                lpToken: c[0],
                minter: c[1],
                rewardPolicyMaker: c[2],
                weight: c[4],
                totalStake: rewards[index][1],
                workingTotalStake: c[3],
                veHndRewardRate: rewards[index][0]
            }
        });

        if (generalData.length > 0) {

            const info = await ethcallProvider.all(
                generalData.flatMap((g) => [
                    new Contract(g.address, GAUGE_V4_ABI).balanceOf(userAddress),
                    new Contract(g.lpToken, CTOKEN_ABI).balanceOf(userAddress),
                    new Contract(g.address, GAUGE_V4_ABI).claimable_tokens(userAddress),
                    new Contract(g.address, GAUGE_V4_ABI).working_balances(userAddress)
                ])
            )

            const infoChunks = _.chunk(info, 4);

            return generalData.map((g, index) => {
                return new GaugeV4(
                        g,
                        infoChunks[index][0],
                        infoChunks[index][1],
                        infoChunks[index][2],
                        infoChunks[index][3],
                        (amount: string) => stake(provider, userAddress, g.address, g.lpToken, amount),
                        (amount: string) => unstake(provider, g.address, amount),
                        () => mint(provider, g.address)
                    )
                }
            )
        }
    }

    return []
  }

const MaxUint256 = BigNumber.from(ethers.constants.MaxUint256)

const stake = async (provider: any, userAddress: string, gaugeAddress: string, lpTokenAddress: string, amount: string) => {
    const depositAmount = ethers.utils.parseUnits(amount, 8);
    const signer = provider.getSigner()
    const gauge = new ethers.Contract(gaugeAddress, GAUGE_V4_ABI, signer)

    const contract = new ethers.Contract(lpTokenAddress, TOKEN_ABI, signer);
    const approval = await contract.allowance(userAddress, gaugeAddress);
    if (approval.lt(depositAmount)) {
        const approveTx = await contract.approve(gaugeAddress, MaxUint256._value)
        await approveTx.wait();
    }
    const tx = await gauge.deposit(ethers.utils.parseUnits(amount, 8))
    await tx.wait()
}

const unstake = async (provider: any, address: string, amount: string) => {
    const signer = provider.getSigner()
    const gauge = new ethers.Contract(address, GAUGE_V4_ABI, signer)
    const tx = await gauge.withdraw(ethers.utils.parseUnits(amount, 18))
    await tx.wait()
}

const mint = async (provider: any, address: string) => {
    const signer = provider.getSigner()
    const gauge = new ethers.Contract(address, GAUGE_V4_ABI, signer)

    const minterAddress = await gauge.minter()

    const minter = new ethers.Contract(minterAddress, MINTER_ABI, signer)

    const tx = await minter.mint(address)
    await tx.wait()
}