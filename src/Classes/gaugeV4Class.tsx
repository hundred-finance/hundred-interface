import { Contract, Provider } from 'ethcall'
import {
    BPRO_ABI,
    CTOKEN_ABI,
    GAUGE_CONTROLLER_ABI,
    GAUGE_HELPER_ABI,
    GAUGE_V4_ABI,
    GAUGE_V5_ABI,
    MINTER_ABI,
    MINTER_V2_ABI,
    REWARD_POLICY_MAKER_ABI,
    REWARD_POLICY_MAKER_V2_ABI,
    TOKEN_ABI
} from '../abi'
import { Network } from '../networks'
import {BigNumber} from "../bigNumber";
import {ethers} from "ethers";
import _, {floor} from "lodash";
import {CTokenInfo} from "./cTokenClass";
import {ExecutePayableWithExtraGasLimit, ExecuteWithExtraGasLimit} from './TransactionHelper';

export interface GaugeV4GeneralData {
    backstopGauge: boolean
    address : string
    lpToken: string
    lpTokenUnderlying: string
    lpBackstopTokenUnderlying: string | undefined
    backstopTotalSupply: BigNumber,
    backstopTotalBalance: BigNumber,
    minter: string
    rewardPolicyMaker: string
    totalStake: BigNumber
    workingTotalStake: BigNumber
    weight: BigNumber
    veHndRewardRate: BigNumber
    reward_token: string
    gaugeHelper: string | undefined
    minterIsV2: boolean
}

export class GaugeV4{
    generalData : GaugeV4GeneralData
    userStakeBalance: BigNumber
    gaugeTokenDecimals: number
    userStakedTokenBalance: ethers.BigNumber
    userLpBalance: BigNumber
    lpTokenDecimals: number
    userClaimableHnd: BigNumber
    userWorkingStakeBalance: BigNumber
    userAllowance: BigNumber
    reward_token: string
    reward_token_decimals: number
    reward_token_symbol: string
    claimable_reward: BigNumber
    token_yearly_rewards: BigNumber
    userGaugeHelperAllowance: BigNumber
    stakeCall?: (amount: string, market: CTokenInfo) => Promise<any>
    unstakeCall?: (amount: string, market: CTokenInfo, nativeTokenMarket: string|undefined) => Promise<any>
    mintCall?: () => Promise<any>
    claimRewardsCall?: () => Promise<any>
    approveCall?: (market: CTokenInfo) => Promise<any>
    approveUnstakeCall?: () => Promise<any>

    constructor(
        generalData: GaugeV4GeneralData,
        userStakeBalance: ethers.BigNumber,
        gaugeTokenDecimals: number,
        userLpBalance: BigNumber,
        lpTokenDecimals: number,
        userClaimableHnd: BigNumber,
        userWorkingStakeBalance: BigNumber,
        userAllowance: BigNumber,
        reward_token: string,
        reward_token_decimals: number,
        reward_token_symbol: string,
        claimable_reward: BigNumber,
        token_yearly_rewards: BigNumber,
        userGaugeHelperAllowance: BigNumber,
        stakeCall?: (amount: string, market: CTokenInfo) => Promise<void>,
        claimRewardsCall?: () => Promise<void>,
        unstakeCall?: (amount: string, market: CTokenInfo, nativeTokenMarket: string|undefined) => Promise<void>,
        mintCall?: () => Promise<void>,
        approveCall?: (market: CTokenInfo) => Promise<void>,
        approveUnstakeCall?: () => Promise<void>,
    ){
        this.generalData = generalData
        this.userStakeBalance = BigNumber.from(userStakeBalance.toString(), gaugeTokenDecimals)
        this.gaugeTokenDecimals = gaugeTokenDecimals
        this.userStakedTokenBalance = userStakeBalance
        this.userLpBalance = BigNumber.from(userLpBalance.toString(), lpTokenDecimals)
        this.lpTokenDecimals = lpTokenDecimals
        this.userClaimableHnd = BigNumber.from(userClaimableHnd.toString(), 18)
        this.userWorkingStakeBalance = userWorkingStakeBalance
        this.userAllowance = BigNumber.from(userAllowance.toString(), lpTokenDecimals)
        this.reward_token = reward_token
        this.reward_token_symbol = reward_token_symbol
        this.reward_token_decimals = reward_token_decimals
        this.claimable_reward = BigNumber.from(claimable_reward.toString(), reward_token_decimals)
        this.token_yearly_rewards = BigNumber.from(token_yearly_rewards.toString(), reward_token_decimals).mul(BigNumber.from(3600 * 24 * 365))
        this.userGaugeHelperAllowance = BigNumber.from(userGaugeHelperAllowance.toString(), gaugeTokenDecimals)
        this.stakeCall = stakeCall
        this.unstakeCall = unstakeCall
        this.mintCall = mintCall
        this.claimRewardsCall = claimRewardsCall
        this.approveCall = approveCall
        this.approveUnstakeCall = approveUnstakeCall
    }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getGaugesData = async (provider: any, userAddress: string | null | undefined, network: Network, oldData?: boolean): Promise<Array<GaugeV4>> => {
    const ethcallProvider = new Provider()
    await ethcallProvider.init(provider as ethers.providers.Provider)
    
    if(network.multicallAddress) {
        ethcallProvider.multicall = {
            address: network.multicallAddress,
            block: 0
        }
    }
    let generalData: Array<GaugeV4GeneralData> = [];

    const gaugeControllerAddress = oldData ? network.oldGauge ? network.oldGauge.gaugeControllerAddress : undefined : network.gaugeControllerAddress ? network.gaugeControllerAddress : undefined 

    if (gaugeControllerAddress) {
        const controller = gaugeControllerAddress
        const ethcallGaugeController = new Contract(controller, GAUGE_CONTROLLER_ABI)

        const [nbGauges] = await ethcallProvider.all([ethcallGaugeController.n_gauges()]) as any

        const gauges:  any[] = await ethcallProvider.all(Array.from(Array(nbGauges.toNumber()).keys()).map(i => ethcallGaugeController.gauges(i)))

        const activeGauges: string[] = [];

        let lpAndMinterAddresses: any = await ethcallProvider.all(
            gauges.flatMap((g) => [
                new Contract(g, GAUGE_V4_ABI).lp_token(),
                new Contract(g, GAUGE_V4_ABI).minter(),
                new Contract(g, GAUGE_V4_ABI).reward_policy_maker(),
                new Contract(g, GAUGE_V4_ABI).working_supply(),
                new Contract(g, GAUGE_V4_ABI).is_killed(),
                new Contract(controller, GAUGE_CONTROLLER_ABI).gauge_relative_weight(g),
                network.isMinterV2 ?
                    new Contract(network.minterAddress || '', MINTER_V2_ABI).tokens(1)
                :
                    new Contract(g, GAUGE_V4_ABI).reward_tokens(0),
            ])
        )

        lpAndMinterAddresses = _.chunk(lpAndMinterAddresses, 7)
        const activeLpAndMinterAddresses: any[][] = []

        for (let i = 0; i < lpAndMinterAddresses.length; i++) {
            if (!lpAndMinterAddresses[i][4]) {
                activeGauges.push(gauges[i]);
                activeLpAndMinterAddresses.push(lpAndMinterAddresses[i])
            }
        }

        const calls : any = []

        activeGauges.forEach((g, index) => {
            calls.push(
                network.isMinterV2 ?
                    new Contract(activeLpAndMinterAddresses[index][2], REWARD_POLICY_MAKER_V2_ABI).rate_at(floor(new Date().getTime() / 1000), network.hundredAddress)
                :
                    new Contract(activeLpAndMinterAddresses[index][2], REWARD_POLICY_MAKER_ABI).rate_at(floor(new Date().getTime() / 1000)),
                new Contract(activeLpAndMinterAddresses[index][0], CTOKEN_ABI).balanceOf(g)
            )
            if(activeLpAndMinterAddresses[index][0] && activeLpAndMinterAddresses[index][0].toLowerCase() !== network.nativeTokenMarketAddress.toLowerCase())
                calls.push(new Contract(activeLpAndMinterAddresses[index][0], CTOKEN_ABI).underlying())
        })

        const rewardsData: any[]= await ethcallProvider.all(calls)
        const rewards = activeLpAndMinterAddresses.map(g => {
            if(g[0].toLowerCase() === network.nativeTokenMarketAddress.toLowerCase()){
                const temp = rewardsData.splice(0, 2)
                temp.push("0x0")
                return temp
            }
            return rewardsData.splice(0,3)
        })

        generalData = activeLpAndMinterAddresses.map((c, index) => {
            return {
                backstopGauge: false,
                address: activeGauges[index],
                lpToken: c[0],
                lpTokenUnderlying: rewards[index][2],
                lpBackstopTokenUnderlying: undefined,
                backstopTotalSupply: BigNumber.from(0),
                backstopTotalBalance: BigNumber.from(0),
                minter: c[1],
                rewardPolicyMaker: c[2],
                weight: c[5],
                totalStake: rewards[index][1],
                workingTotalStake: c[3],
                veHndRewardRate: rewards[index][0],
                reward_token: c[6],
                gaugeHelper: network.gaugeHelper,
                minterIsV2: network.isMinterV2 === true
            }
        });

        if (generalData.length > 0) {
            const info = await ethcallProvider.all(
                generalData.flatMap((g) => userAddress ? [
                    new Contract(g.address, GAUGE_V4_ABI).balanceOf(userAddress),
                    new Contract(g.address, GAUGE_V4_ABI).decimals(),
                    new Contract(g.lpToken, CTOKEN_ABI).balanceOf(userAddress),
                    new Contract(g.lpToken, CTOKEN_ABI).decimals(),
                    network.isMinterV2 ?
                        new Contract(g.address, GAUGE_V5_ABI).claimable_tokens(userAddress, network.hundredAddress)
                    :
                        new Contract(g.address, GAUGE_V4_ABI).claimable_tokens(userAddress),
                    new Contract(g.address, GAUGE_V4_ABI).working_balances(userAddress),
                    g.gaugeHelper && g.lpTokenUnderlying !== "0x0" ?
                        new Contract(g.lpTokenUnderlying, CTOKEN_ABI).allowance(userAddress, g.gaugeHelper)
                        : new Contract(g.lpToken, CTOKEN_ABI).allowance(userAddress, g.address),
                    g.gaugeHelper ?
                        new Contract(g.address, CTOKEN_ABI).allowance(userAddress, g.gaugeHelper)
                        : new Contract(g.lpToken, CTOKEN_ABI).allowance(userAddress, g.address),
                    g.reward_token !== "0x0000000000000000000000000000000000000000" ? new Contract(g.reward_token, TOKEN_ABI).decimals() : new Contract(g.lpToken, TOKEN_ABI).decimals(),
                    g.reward_token !== "0x0000000000000000000000000000000000000000" ? new Contract(g.reward_token, TOKEN_ABI).symbol() : new Contract(g.lpToken, TOKEN_ABI).symbol(),
                    g.reward_token !== "0x0000000000000000000000000000000000000000" ?
                        (network.isMinterV2 ?
                            new Contract(g.address, GAUGE_V5_ABI).claimable_tokens(userAddress, g.reward_token)
                        :
                            new Contract(g.address, GAUGE_V4_ABI).claimable_reward(userAddress, g.reward_token)
                        )
                    :
                        new Contract(g.address, GAUGE_V4_ABI).working_balances(userAddress),
                    g.reward_token !== "0x0000000000000000000000000000000000000000" ?
                        (network.isMinterV2 ?
                            new Contract(g.rewardPolicyMaker, REWARD_POLICY_MAKER_V2_ABI).rate_at(floor(new Date().getTime() / 1000), g.reward_token)
                        :
                            new Contract(g.address, GAUGE_V4_ABI).reward_data(g.reward_token)
                        )
                    :
                        new Contract(g.address, GAUGE_V4_ABI).working_balances(userAddress),
                ] : [
                    // 0
                    new Contract(g.address, GAUGE_V4_ABI).decimals(),
                    // 2
                    new Contract(g.lpToken, CTOKEN_ABI).decimals(),
                    // 4
                    // 5
                    // 6
                    // 7
                    g.reward_token !== "0x0000000000000000000000000000000000000000" ? new Contract(g.reward_token, TOKEN_ABI).decimals() : new Contract(g.lpToken, TOKEN_ABI).decimals(),
                    g.reward_token !== "0x0000000000000000000000000000000000000000" ? new Contract(g.reward_token, TOKEN_ABI).symbol() : new Contract(g.lpToken, TOKEN_ABI).symbol(),
                ])
            )

            const infoChunks: any = userAddress ? _.chunk(info, 12) : _.chunk(info, 4);

            return generalData.map((g, index) => {
                return userAddress ? new GaugeV4(
                        g,
                        infoChunks[index][0],
                        infoChunks[index][1].toNumber(),
                        infoChunks[index][2],
                        infoChunks[index][3],
                        infoChunks[index][4],
                        infoChunks[index][5],
                        infoChunks[index][6],
                        g.reward_token,
                        infoChunks[index][8],
                        infoChunks[index][9],
                        infoChunks[index][10],
                        network.isMinterV2 ? infoChunks[index][11] : infoChunks[index][11]?.rate ? infoChunks[index][11]?.rate : BigNumber.from(0),
                        infoChunks[index][7],
                        (amount: string, market: CTokenInfo) => {
                            if (g.gaugeHelper) {
                                return(stake(provider, userAddress, g, market, amount))
                            } else {
                                return(stake(provider, userAddress, g, market, BigNumber.parseValueSafe(amount, infoChunks[index][3])._value.toString()))
                            }
                        },
                        () => claimRewards(provider, g.address),
                        (amount: string, market: CTokenInfo, nativeTokenMarket: string|undefined) => {return unstake(provider, userAddress, g, market, nativeTokenMarket, BigNumber.parseValueSafe(amount, infoChunks[index][1])._value.toString())},
                        () => {return mint(provider, g.address)},
                    (market: CTokenInfo) => {return approve(provider, g, market)},
                    () => {return approveUnstake(provider, g)},
                    )
                    : new GaugeV4(
                        g,
                        ethers.BigNumber.from("0"),
                        infoChunks[index][0].toNumber(),
                        BigNumber.from("0"),
                        infoChunks[index][1],
                        BigNumber.from("0"),
                        BigNumber.from("0"),
                        BigNumber.from("0"),
                        g.reward_token,
                        infoChunks[index][2],
                        infoChunks[index][3],
                        BigNumber.from("0"),
                        BigNumber.from("0"),
                        BigNumber.from("0")
                    )
                }
            )
        }
    }

    return []
  }

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getBackstopGaugesData = async (provider: any, userAddress: string | null | undefined, network: Network): Promise<Array<GaugeV4>> => {

    const ethcallProvider = new Provider()
    await ethcallProvider.init(provider as ethers.providers.Provider)

    if(network.multicallAddress) {
        ethcallProvider.multicall = {
            address: network.multicallAddress,
            block: 0
        }
    }

    let generalData: Array<GaugeV4GeneralData> = [];

    if (network.backstopGaugeControllerAddress) {
        const controller = network.backstopGaugeControllerAddress
        const ethcallGaugeController = new Contract(controller, GAUGE_CONTROLLER_ABI)

        const [nbGauges] = await ethcallProvider.all([ethcallGaugeController.n_gauges()]) as any

        const gauges:  any[] = await ethcallProvider.all(Array.from(Array(nbGauges.toNumber()).keys()).map(i => ethcallGaugeController.gauges(i)))
        const activeGauges: string[] = [];

        let lpAndMinterAddresses: any = await ethcallProvider.all(
            gauges.flatMap((g) => [
                new Contract(g, GAUGE_V4_ABI).lp_token(),
                new Contract(g, GAUGE_V4_ABI).minter(),
                new Contract(g, GAUGE_V4_ABI).reward_policy_maker(),
                new Contract(g, GAUGE_V4_ABI).working_supply(),
                new Contract(g, GAUGE_V4_ABI).is_killed(),
                new Contract(controller, GAUGE_CONTROLLER_ABI).gauge_relative_weight(g),
                network.isMinterV2 ?
                    new Contract(network.minterAddress || '', MINTER_V2_ABI).tokens(1)
                    :
                    new Contract(g, GAUGE_V4_ABI).reward_tokens(0),
            ])
        )

        lpAndMinterAddresses = _.chunk(lpAndMinterAddresses, 7)
        const activeLpAndMinterAddresses: any[][] = []

        for (let i = 0; i < lpAndMinterAddresses.length; i++) {
            if (!lpAndMinterAddresses[i][4]) {
                activeGauges.push(gauges[i]);
                activeLpAndMinterAddresses.push(lpAndMinterAddresses[i])
            }
        }

        let rewards: any = await ethcallProvider.all(
            activeGauges.flatMap((g, index) => [
                    network.isMinterV2 ?
                        new Contract(activeLpAndMinterAddresses[index][2], REWARD_POLICY_MAKER_V2_ABI).rate_at(floor(new Date().getTime() / 1000), network.hundredAddress)
                    :
                        new Contract(activeLpAndMinterAddresses[index][2], REWARD_POLICY_MAKER_ABI).rate_at(floor(new Date().getTime() / 1000)),
                    new Contract(activeLpAndMinterAddresses[index][0], BPRO_ABI).balanceOf(g),
                    new Contract(activeLpAndMinterAddresses[index][0], BPRO_ABI).LUSD(),
                    new Contract(activeLpAndMinterAddresses[index][0], BPRO_ABI).totalSupply(),
                ]
            )
        )

        rewards = _.chunk(rewards, 4)

        let backStopUnderlying: any = await ethcallProvider.all(
            rewards.flatMap((r: any[], index: number) => [
                new Contract(r[2], CTOKEN_ABI).underlying(),
                new Contract(r[2], TOKEN_ABI).balanceOf(activeLpAndMinterAddresses[index][0]),
            ])
        )

        backStopUnderlying = _.chunk(backStopUnderlying, 2)

        generalData = activeLpAndMinterAddresses.map((c, index) => {
            return {
                backstopGauge: true,
                address: activeGauges[index],
                lpToken: c[0],
                lpTokenUnderlying: rewards[index][2],
                lpBackstopTokenUnderlying: backStopUnderlying[index][0],
                backstopTotalSupply: rewards[index][3],
                backstopTotalBalance: backStopUnderlying[index][1],
                minter: c[1],
                rewardPolicyMaker: c[2],
                weight: c[5],
                totalStake: rewards[index][1],
                workingTotalStake: c[3],
                veHndRewardRate: rewards[index][0],
                reward_token: c[6],
                gaugeHelper: network.gaugeHelper,
                minterIsV2: network.isMinterV2 === true
            }
        });

        if (generalData.length > 0) {

            const info = await ethcallProvider.all(
                generalData.flatMap((g) => userAddress ? [
                    new Contract(g.address, GAUGE_V4_ABI).balanceOf(userAddress),
                    new Contract(g.address, GAUGE_V4_ABI).decimals(),
                    new Contract(g.lpToken, CTOKEN_ABI).balanceOf(userAddress),
                    new Contract(g.lpToken, CTOKEN_ABI).decimals(),
                    network.isMinterV2 ? new Contract(g.address, GAUGE_V5_ABI).claimable_tokens(userAddress, network.hundredAddress) : new Contract(g.address, GAUGE_V4_ABI).claimable_tokens(userAddress),
                    new Contract(g.address, GAUGE_V4_ABI).working_balances(userAddress),
                    new Contract(g.lpBackstopTokenUnderlying ? g.lpBackstopTokenUnderlying : "", CTOKEN_ABI).allowance(userAddress, g.gaugeHelper),
                    new Contract(g.address, CTOKEN_ABI).allowance(userAddress, g.gaugeHelper),
                ] : 
                [
                    new Contract(g.address, GAUGE_V4_ABI).decimals(),
                    new Contract(g.lpToken, CTOKEN_ABI).decimals()
                ]
            ))

            const infoChunks: any = userAddress ? _.chunk(info, 8) : _.chunk(info, 2);

            return generalData.map((g, index) => {
                    return userAddress ? new GaugeV4(
                        g,
                        infoChunks[index][0],
                        infoChunks[index][1],
                        infoChunks[index][2],
                        infoChunks[index][3],
                        infoChunks[index][4],
                        infoChunks[index][5],
                        infoChunks[index][6],
                        g.reward_token,
                        18,
                        "",
                        BigNumber.from(0),
                        BigNumber.from(0),
                        infoChunks[index][7],
                        (amount: string, market: CTokenInfo) => {
                            if (g.gaugeHelper) {
                                return(stake(provider, userAddress, g, market, amount))
                            } else {
                                return(stake(provider, userAddress, g, market, ethers.utils.parseUnits(amount, infoChunks[index][3]).toString()))
                            }
                        },
                        () => claimRewards(provider, g.address),
                         (amount: string, market: CTokenInfo, nativeTokenMarket: string|undefined) => {return unstake(provider, userAddress, g, market, nativeTokenMarket, ethers.utils.parseUnits(amount, infoChunks[index][1]).toString())},
                        () => {return mint(provider, g.address)},
                        (market: CTokenInfo) => {return approve(provider, g, market)},
                        () => {return approveUnstake(provider, g)},
                    ) 
                    : new GaugeV4(
                        g,
                        ethers.BigNumber.from("0"),
                        infoChunks[index][0].toNumber(),
                        BigNumber.from("0"),
                        infoChunks[index][1],
                        BigNumber.from("0"),
                        BigNumber.from("0"),
                        BigNumber.from("0"),
                        "",
                        0,
                        "",
                        BigNumber.from("0"),
                        BigNumber.from("0"),
                        BigNumber.from("0")
                    )
                }
            )
        }
    }

    return []
}

const MaxUint256 = BigNumber.from(ethers.constants.MaxUint256)

const stake = async (
    provider: any,
    userAddress: string,
    gauge: GaugeV4GeneralData,
    market: CTokenInfo,
    amount: string,
) => {
    const signer = provider.getSigner()
    if (!gauge.gaugeHelper) {
        const gaugeContract = new ethers.Contract(gauge.address, GAUGE_V4_ABI, signer)
        return await ExecuteWithExtraGasLimit(gaugeContract, "deposit", [amount], 0)
    } else if (!market.isNativeToken && !gauge.backstopGauge) {
        const gaugeHelper = new ethers.Contract(gauge.gaugeHelper, GAUGE_HELPER_ABI, signer)
        return await ExecuteWithExtraGasLimit(gaugeHelper, "depositUnderlyingToGauge", [
            market.underlying.address,
            gauge.lpToken,
            gauge.address,
            BigNumber.parseValueSafe(amount, market.underlying.decimals)._value,
            userAddress
        ], 20)
    } else if (!market.isNativeToken && gauge.backstopGauge) {
        const gaugeHelper = new ethers.Contract(gauge.gaugeHelper, GAUGE_HELPER_ABI, signer)
        return await ExecuteWithExtraGasLimit(gaugeHelper, "depositUnderlyingToBammGauge", [
            market.underlying.address,
            gauge.lpTokenUnderlying,
            gauge.lpToken,
            gauge.address,
            BigNumber.parseValueSafe(amount, market.underlying.decimals)._value,
            userAddress,
        ], 20)
    } else if (!gauge.backstopGauge) {
        const gaugeHelper = new ethers.Contract(gauge.gaugeHelper, GAUGE_HELPER_ABI, signer)
        return await ExecutePayableWithExtraGasLimit(
            gaugeHelper,
            BigNumber.parseValueSafe(amount, market.underlying.decimals)._value,
            "depositEtherToGauge",
            [
            gauge.lpToken,
            gauge.address,
            userAddress
        ], 20)
    }
}

const unstake = async (provider: any, userAddress: string, gauge: GaugeV4GeneralData, market: CTokenInfo, nativeTokenMarket: string|undefined, amount: string) => {
    const signer = provider.getSigner()
    if (!gauge.gaugeHelper) {
        const gaugeContract = new ethers.Contract(gauge.address, GAUGE_V4_ABI, signer)
        return await ExecuteWithExtraGasLimit(gaugeContract, "withdraw", [amount], 0)
    } else if (!gauge.backstopGauge) {
        const gaugeHelper = new ethers.Contract(gauge.gaugeHelper, GAUGE_HELPER_ABI, signer)
        return await ExecuteWithExtraGasLimit(gaugeHelper, "withdrawFromGaugeToUnderlying", [
            gauge.minter,
            gauge.address,
            gauge.lpToken,
            amount,
            userAddress,
            market.isNativeToken
        ], 20)
    } else {
        const gaugeHelper = new ethers.Contract(gauge.gaugeHelper, GAUGE_HELPER_ABI, signer)
        return await ExecuteWithExtraGasLimit(gaugeHelper, "withdrawFromBammGaugeToUnderlying", [
                gauge.minter,
                gauge.address,
                gauge.lpToken,
                gauge.lpTokenUnderlying,
                amount,
                userAddress,
                nativeTokenMarket,
            ], 20
        )
    }
}

const mint = async (provider: any, address: string) => {
    const signer = provider.getSigner()
    const gauge = new ethers.Contract(address, GAUGE_V4_ABI, signer)

    const minterAddress = await gauge.minter()
    const minter = new ethers.Contract(minterAddress, MINTER_ABI, signer)

    return await ExecuteWithExtraGasLimit(minter, "mint", [address], 0)
}

const claimRewards = async (provider: any, address: string) => {
    const signer = provider.getSigner()
    const gauge = new ethers.Contract(address, GAUGE_V4_ABI, signer)

    return await gauge.functions['claim_rewards()']();
    //await tx.wait()
}

const approve = async (provider: any, gauge: GaugeV4GeneralData, market: CTokenInfo) => {
    const signer = provider.getSigner()
    if (!gauge.gaugeHelper) {
        const contract = new ethers.Contract(gauge.lpToken, TOKEN_ABI, signer);
        return await ExecuteWithExtraGasLimit(contract, "approve", [gauge.address, MaxUint256._value], 0)
    } else if (!market.isNativeToken) {
        const contract = new ethers.Contract(market.underlying.address, TOKEN_ABI, signer);
        return await ExecuteWithExtraGasLimit(contract, "approve", [gauge.gaugeHelper, MaxUint256._value], 0)
    }
}

const approveUnstake = async (provider: any, gauge: GaugeV4GeneralData) => {
    const signer = provider.getSigner()
    if (gauge.gaugeHelper) {
        const contract = new ethers.Contract(gauge.address, TOKEN_ABI, signer);
        return await ExecuteWithExtraGasLimit(contract, "approve", [gauge.gaugeHelper, MaxUint256._value], 0)
    }
}


