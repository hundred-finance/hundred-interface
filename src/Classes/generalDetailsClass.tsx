import { BigNumber } from "../bigNumber"
import { CTokenInfo } from "./cTokenClass"
import {GaugeV4} from "./gaugeV4Class";

export class GeneralDetailsData{
    totalSupplyBalance: BigNumber
    totalStakeBalance: BigNumber
    totalBorrowBalance: BigNumber
    allMarketsTotalSupplyBalance: BigNumber
    allMarketsTotalStakeBalance: BigNumber
    allMarketsTotalBorrowBalance: BigNumber
    totalBorrowLimit: BigNumber
    totalBorrowLimitUsedPercent: BigNumber
    yearSupplyInterest: BigNumber
    yearStakeInterest: BigNumber
    yearBorrowInterest: BigNumber
    netApy: BigNumber
    totalSupplyHndApy: BigNumber
    totalBorrowHndApy: BigNumber
    totalLiquidity: BigNumber
    earned: BigNumber

    constructor(totalSupplyBalance: BigNumber,
                totalStakeBalance: BigNumber,
                totalBorrowBalance: BigNumber,
                allMarketsTotalSupplyBalance: BigNumber,
                allMarketsTotalStakeBalance: BigNumber,
                allMarketsTotalBorrowBalance: BigNumber,
                totalBorrowLimit: BigNumber,
                totalBorrowLimitUsedPercent: BigNumber,
                yearSupplyInterest: BigNumber,
                yearStakeInterest: BigNumber,
                yearBorrowInterest: BigNumber,
                netApy: BigNumber,
                totalSupplyHndApy: BigNumber,
                totalBorrowHndApy: BigNumber,
                totalLiquidity: BigNumber,
                earned: BigNumber){
        this.totalSupplyBalance = totalSupplyBalance
        this.totalStakeBalance = totalStakeBalance
        this.totalBorrowBalance = totalBorrowBalance
        this.allMarketsTotalSupplyBalance = allMarketsTotalSupplyBalance
        this.allMarketsTotalStakeBalance = allMarketsTotalStakeBalance
        this.allMarketsTotalBorrowBalance = allMarketsTotalBorrowBalance
        this.totalBorrowLimit = totalBorrowLimit
        this.totalBorrowLimitUsedPercent = totalBorrowLimitUsedPercent
        this.yearSupplyInterest = yearSupplyInterest
        this.yearStakeInterest = yearStakeInterest
        this.yearBorrowInterest = yearBorrowInterest
        this.netApy = netApy
        this.totalSupplyHndApy = totalSupplyHndApy
        this.totalBorrowHndApy = totalBorrowHndApy
        this.totalLiquidity = totalLiquidity
        this.earned = earned
    }
}

export const getGeneralDetails = (marketsData: (CTokenInfo | null)[], gauges: GaugeV4[], compAccrued: BigNumber) : GeneralDetailsData => {
    let totalSupplyBalance = BigNumber.from("0")
    let totalStakedBalance = BigNumber.from("0")
    let totalBorrowBalance = BigNumber.from("0")
    let allMarketsTotalSupplyBalance = BigNumber.from("0")
    let allMarketsTotalStakeBalance = BigNumber.from("0")
    let allMarketsTotalBorrowBalance = BigNumber.from("0")
    let totalBorrowLimit = BigNumber.from("0")
    let yearSupplyInterest = BigNumber.from("0")
    let yearStakeInterest = BigNumber.from("0")
    let yearBorrowInterest = BigNumber.from("0")
    let yearSupplyHndRewards = BigNumber.from("0")
    const yearBorrowHndRewards = BigNumber.from("0")
    let totalLiquidity = BigNumber.from("0")
    let totalAccrued = 0
    marketsData.map((market) => {  
      if(market){
        const gauge = gauges.find(g => g.generalData.lpToken.toLowerCase() === market.pTokenAddress.toLowerCase())
        const stake = gauge ? +gauge.generalData.totalStake * +market.exchangeRate * +market.underlying.price / (10 ** market.underlying.decimals) : 0
        const userStake = gauge ? +gauge.userStakedTokenBalance * +market.exchangeRate * +market.underlying.price / (10 ** market.underlying.decimals) : 0

        const backstopGauge = gauges.find(g => g.generalData.lpTokenUnderlying.toLowerCase() === market.pTokenAddress.toLowerCase())
        let backstopStake = 0
        let userBackstopStake = 0
        if (backstopGauge) {
            const totalBalance = BigNumber.from(backstopGauge.generalData.backstopTotalBalance, 8)
            const totalSupply = BigNumber.from(backstopGauge.generalData.backstopTotalSupply, 18)

            backstopStake = +backstopGauge.generalData.totalStake * +market.exchangeRate * +market.underlying.price * +totalBalance / (+totalSupply * 1e10 * (10 ** market.underlying.decimals))
            userBackstopStake += +backstopGauge.userStakedTokenBalance * +market.exchangeRate * +market.underlying.price * +totalBalance / (+totalSupply * 1e10 * (10 ** market.underlying.decimals))
        }
        totalSupplyBalance = BigNumber.parseValue((+totalSupplyBalance.toString() + +market.supplyBalance.toString()).noExponents())
        totalBorrowBalance = BigNumber.parseValue((+totalBorrowBalance.toString() + +market.borrowBalance.toString()).noExponents())
        totalStakedBalance = BigNumber.parseValue((+totalStakedBalance.toString() + userStake + userBackstopStake).noExponents())

        allMarketsTotalStakeBalance = BigNumber.parseValue((+allMarketsTotalStakeBalance.toString() + stake + backstopStake).noExponents())

        if (+market?.marketTotalSupply?.toString() > 0) {
          allMarketsTotalSupplyBalance = BigNumber.parseValue((+allMarketsTotalSupplyBalance.toString() + +market.marketTotalSupply.toString()).noExponents())
        }

        if (market?.marketTotalBorrow?.gt(BigNumber.from("0"))) {
            allMarketsTotalBorrowBalance = allMarketsTotalBorrowBalance.add(market.marketTotalBorrow)
        }
        
        totalBorrowLimit = totalBorrowLimit.addSafe(market.isEnterMarket ? market.supplyBalance.mul(market.collateralFactor) : BigNumber.from("0"))
        
        yearSupplyInterest = BigNumber.parseValue((+yearSupplyInterest.toString() + (+market.supplyBalance.toString() * (+market.supplyApy.toString() + +market.hndAPR.toString()))).noExponents())
        yearStakeInterest =
            BigNumber.parseValue(
                (
                    +yearStakeInterest.toString()
                    + (userStake * +market.veHndAPR.toString() + userBackstopStake * +market.veHndBackstopAPR.toString())
                    + (userStake * +market.veRewardTokenAPR.toString() + userBackstopStake * +market.veRewardTokenBackstopAPR.toString())
                ).noExponents()
            )
        yearBorrowInterest = BigNumber.parseValue((+yearBorrowInterest.toString() + (+market.borrowBalance.toString() * +market.borrowApy.toString())).noExponents())
        yearSupplyHndRewards = BigNumber.parseValue((+yearSupplyHndRewards.toString() + +market.hndAPR.toString()).noExponents())
        if (market && market.liquidity.gt(BigNumber.from("0"))) {
            totalLiquidity = totalLiquidity.addSafe(market.liquidity)
        }

        totalAccrued += market.accrued
      }          
    })

    totalAccrued += +compAccrued._value
    

    const totalBorrowLimitTemp: number = +totalBorrowLimit.toString()
    const totalBorrowBalanceTemp: number = +totalBorrowBalance.toString()
    const temp = totalBorrowLimitTemp > 0 ? (totalBorrowBalanceTemp / totalBorrowLimitTemp * 100) : 0
    
    const totalBorrowLimitUsedPercent = BigNumber.parseValue(temp.noExponents())
    //console.log(`yearSupply: ${yearSupplyInterest.toString()}\nyrarBorrow: ${yearBorrowInterest.toString()}\ntotalSupply: ${totalSupplyBalance.toString()}`)
    const tempNetApy = +totalSupplyBalance.toString() + +totalStakedBalance.toString() - +totalBorrowBalance.toString() > 0 && (+totalSupplyBalance.toString()+ +totalStakedBalance.toString()) !== 0 ? 
                      (+yearSupplyInterest.toString() + +yearStakeInterest.toString() - +yearBorrowInterest.toString()) / (+totalSupplyBalance.toString()+ +totalStakedBalance.toString()) 
                      : 0
    //const netApy = totalSupplyBalance.gt(BigNumber.from("0")) ? (yearSupplyInterest.subSafe(yearBorrowInterest)).divSafe(totalSupplyBalance) : BigNumber.from("0")
    const  netApy = BigNumber.parseValue(tempNetApy.noExponents())

    return new GeneralDetailsData(
                            totalSupplyBalance,
                            totalStakedBalance,
                            totalBorrowBalance,
                            allMarketsTotalSupplyBalance,
                            allMarketsTotalStakeBalance,
                            allMarketsTotalBorrowBalance,
                            totalBorrowLimit,
                            totalBorrowLimitUsedPercent,
                            yearSupplyInterest,
                            yearStakeInterest,
                            yearBorrowInterest,
                            netApy,
                            +totalSupplyBalance.toString() > 0 ? BigNumber.parseValue((+yearSupplyHndRewards.toString() / +totalSupplyBalance.toString() * 100).noExponents()) : BigNumber.from(0),
                            +totalBorrowBalance.toString() > 0 ? BigNumber.parseValue((+yearBorrowHndRewards.toString() / +totalBorrowBalance.toString()).noExponents()) : BigNumber.from(0),
                            totalLiquidity,
                            BigNumber.parseValue((totalAccrued/1e18).noExponents()))
  }