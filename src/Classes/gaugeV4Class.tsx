import { Contract, Provider } from 'ethcall'
import {CTOKEN_ABI, GAUGE_V4_ABI, MINTER_ABI, TOKEN_ABI} from '../abi'
import { Network } from '../networks'
import {BigNumber} from "../bigNumber";
import {ethers} from "ethers";
import _ from "lodash";

export interface GaugeV4GeneralData {
    address : string
    lpToken: string
    minter: string
    rewardPolicyMaker: string
    totalStake: BigNumber
    weight: BigNumber
    veHndRewardRate: BigNumber
}

export class GaugeV4{
    generalData : GaugeV4GeneralData
    userStakeBalance: BigNumber
    userStakehTokenBalance: BigNumber
    userLpBalance: BigNumber
    userClaimableHnd: BigNumber
    stakeCall: (amount: string) => void
    unstakeCall: (amount: string) => void
    mintCall: () => void

    constructor(
        generalData: GaugeV4GeneralData,
        userStakeBalance: BigNumber,
        userLpBalance: BigNumber,
        userClaimableHnd: BigNumber,
        stakeCall: (amount: string) => void,
        unstakeCall: (amount: string) => void,
        mintCall: () => void
    ){
        this.generalData = generalData
        this.userStakeBalance = BigNumber.from(userStakeBalance.toString(), 18)
        this.userStakehTokenBalance = BigNumber.from(userStakeBalance.toString(), 8)
        this.userLpBalance = BigNumber.from(userLpBalance.toString(), 8)
        this.userClaimableHnd = BigNumber.from(userClaimableHnd.toString(), 18)
        this.stakeCall = stakeCall
        this.unstakeCall = unstakeCall
        this.mintCall = mintCall
    }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getGaugesData = async (provider: any, userAddress: string, network: Network, generalData: Array<GaugeV4GeneralData>): Promise<Array<GaugeV4>> => {
    const ethcallProvider = new Provider()
    await ethcallProvider.init(provider)

    if (generalData.length > 0 && network.gaugeControllerAddress) {

        if(network.multicallAddress) {
            ethcallProvider.multicallAddress = network.multicallAddress
        }

        const info = await ethcallProvider.all(
            generalData.flatMap((g) => [
                new Contract(g.address, GAUGE_V4_ABI).balanceOf(userAddress),
                new Contract(g.lpToken, CTOKEN_ABI).balanceOf(userAddress),
                new Contract(g.address, GAUGE_V4_ABI).integrate_fraction(userAddress),
                new Contract(g.minter, MINTER_ABI).minted(userAddress, g.address),
            ])
        )

        const infoChunks = _.chunk(info, 4);

        return generalData.map((g, index) => new GaugeV4(
                g,
                infoChunks[index][0],
                infoChunks[index][1],
                infoChunks[index][2].sub(infoChunks[index][3]),
                (amount: string) => stake(provider, userAddress, g.address, g.lpToken, amount),
                (amount: string) => unstake(provider, g.address, amount),
            () => mint(provider, g.address)
            )
        )
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