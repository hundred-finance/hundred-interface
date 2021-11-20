import { Contract, Provider } from 'ethcall'
import {CTOKEN_ABI, GAUGE_CONTROLLER_ABI, GAUGE_V4_ABI, MINTER_ABI, TOKEN_ABI} from '../abi'
import { Network } from '../networks'
import {BigNumber} from "../bigNumber";
import {ethers} from "ethers";
import _ from "lodash";

export class GaugeV4{
    address : string
    lpToken: string
    userStakeBalance: BigNumber
    userStakehTokenBalance: BigNumber
    userLpBalance: BigNumber
    userClaimableHnd: BigNumber
    stakeCall: (amount: string) => void
    unstakeCall: (amount: string) => void
    mintCall: () => void

    constructor(
        address: string,
        lpToken: string,
        userStakeBalance: BigNumber,
        userLpBalance: BigNumber,
        userClaimableHnd: BigNumber,
        stakeCall: (amount: string) => void,
        unstakeCall: (amount: string) => void,
        mintCall: () => void
    ){
        this.address = address
        this.lpToken = lpToken
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
export const getGaugesData = async (provider: any, userAddress: string, network: Network): Promise<Array<GaugeV4>> => {
    const ethcallProvider = new Provider()
    await ethcallProvider.init(provider)

    if (network.gaugeControllerAddress) {
        if(network.multicallAddress) {
            ethcallProvider.multicallAddress = network.multicallAddress
        }
        const ethcallGaugeController = new Contract(network.gaugeControllerAddress, GAUGE_CONTROLLER_ABI)

        const [nbGauges] = await ethcallProvider.all([ethcallGaugeController.n_gauges()])
        const gauges = await ethcallProvider.all(Array.from(Array(nbGauges).keys()).map(i => ethcallGaugeController.gauges(i)))
        const gaugeLpTokens = await ethcallProvider.all(gauges.map(i => new Contract(i, GAUGE_V4_ABI).lp_token()))
        const minters = await ethcallProvider.all(gauges.map(i => new Contract(i, GAUGE_V4_ABI).minter()))

        const info = await ethcallProvider.all(
            gauges.flatMap((g, index) => [
                new Contract(g, GAUGE_V4_ABI).balanceOf(userAddress),
                new Contract(g, GAUGE_V4_ABI).integrate_fraction(userAddress),
                new Contract(gaugeLpTokens[index], CTOKEN_ABI).balanceOf(userAddress),
                new Contract(minters[index], MINTER_ABI).minted(userAddress, g)
            ])
        )

        const infoChunks = _.chunk(info, 4);

        return gauges.map((g, index) => new GaugeV4(
                g,
                gaugeLpTokens[index],
                infoChunks[index][0],
                infoChunks[index][2],
                infoChunks[index][1].sub(infoChunks[index][3]),
                (amount: string) => stake(provider, userAddress, g, gaugeLpTokens[index], amount),
                (amount: string) => unstake(provider, g, amount),
            () => mint(provider, g)
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