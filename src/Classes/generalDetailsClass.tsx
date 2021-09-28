import { BigNumber } from "../bigNumber"
import { CTokenInfo } from "./cTokenClass"

export class GeneralDetailsData{
    totalSupplyBalance: BigNumber
    totalBorrowBalance: BigNumber
    allMarketsTotalSupplyBalance: BigNumber
    allMarketsTotalBorrowBalance: BigNumber
    totalBorrowLimit: BigNumber
    totalBorrowLimitUsedPercent: BigNumber
    yearSupplyInterest: BigNumber
    yearBorrowInterest: BigNumber
    netApy: BigNumber
    totalSupplyHndApy: BigNumber
    totalBorrowHndApy: BigNumber
    totalLiquidity: BigNumber

    constructor(totalSupplyBalance: BigNumber,
                totalBorrowBalance: BigNumber,
                allMarketsTotalSupplyBalance: BigNumber,
                allMarketsTotalBorrowBalance: BigNumber,
                totalBorrowLimit: BigNumber,
                totalBorrowLimitUsedPercent: BigNumber,
                yearSupplyInterest: BigNumber,
                yearBorrowInterest: BigNumber,
                netApy: BigNumber,
                totalSupplyHndApy: BigNumber,
                totalBorrowHndApy: BigNumber,
                totalLiquidity: BigNumber){
        this.totalSupplyBalance = totalSupplyBalance
        this.totalBorrowBalance = totalBorrowBalance
        this.allMarketsTotalSupplyBalance = allMarketsTotalSupplyBalance
        this.allMarketsTotalBorrowBalance = allMarketsTotalBorrowBalance
        this.totalBorrowLimit = totalBorrowLimit
        this.totalBorrowLimitUsedPercent = totalBorrowLimitUsedPercent
        this.yearSupplyInterest = yearSupplyInterest
        this.yearBorrowInterest = yearBorrowInterest
        this.netApy = netApy
        this.totalSupplyHndApy = totalSupplyHndApy
        this.totalBorrowHndApy = totalBorrowHndApy
        this.totalLiquidity = totalLiquidity
    }
}

export const getGeneralDetails = async (marketsData: (CTokenInfo | null)[]) : Promise<GeneralDetailsData> => {
    let totalSupplyBalance = BigNumber.from("0")
    let totalBorrowBalance = BigNumber.from("0")
    let allMarketsTotalSupplyBalance = BigNumber.from("0")
    let allMarketsTotalBorrowBalance = BigNumber.from("0")
    let totalBorrowLimit = BigNumber.from("0")
    let yearSupplyInterest = BigNumber.from("0")
    let yearBorrowInterest = BigNumber.from("0")
    let yearSupplyHndRewards = BigNumber.from("0")
    const yearBorrowHndRewards = BigNumber.from("0")
    let totalLiquidity = BigNumber.from("0")
    
    marketsData.map((market) => {  
      if(market){
        totalSupplyBalance = BigNumber.parseValue((+totalSupplyBalance.toString() + +market.supplyBalance.toString()).noExponents())
        totalBorrowBalance = BigNumber.parseValue((+totalBorrowBalance.toString() + +market.borrowBalance.toString()).noExponents())
      
        if (+market?.marketTotalSupply?.toString() > 0) {
          allMarketsTotalSupplyBalance = BigNumber.parseValue((+allMarketsTotalSupplyBalance.toString() + +market.marketTotalSupply.toString()).noExponents())
        }

        if (market?.marketTotalBorrow?.gt(BigNumber.from("0"))) {
            allMarketsTotalBorrowBalance = allMarketsTotalBorrowBalance.add(market.marketTotalBorrow)
        }
        totalBorrowLimit = totalBorrowLimit.add(market.isEnterMarket ? market.supplyBalance.mul(market.collateralFactor) : BigNumber.from("0"))
        
        yearSupplyInterest = BigNumber.parseValue((+yearSupplyInterest.toString() + (+market.supplyBalance.toString() * (+market.supplyApy.toString() + +market.hndAPR.toString()))).noExponents())
        yearBorrowInterest = BigNumber.parseValue((+yearBorrowInterest.toString() + (+market.borrowBalance.toString() * +market.borrowApy.toString())).noExponents())
        yearSupplyHndRewards = BigNumber.parseValue((+yearSupplyHndRewards.toString() + +market.hndAPR.toString()).noExponents())
        if (market && market.liquidity.gt(BigNumber.from("0"))) {
            totalLiquidity = totalLiquidity.addSafe(market.liquidity)
        }
      }          
    })
    
    const totalBorrowLimitTemp: number = +totalBorrowLimit.toFixed(18)
    const totalBorrowBalanceTemp: number = +totalBorrowBalance.toFixed(18)
    const temp = (totalBorrowBalanceTemp / totalBorrowLimitTemp * 100)
    
    const totalBorrowLimitUsedPercent = totalBorrowLimit.gt(BigNumber.from(0)) ? BigNumber.parseValue(temp.toFixed(18)) : BigNumber.from("0")
    //console.log(`yearSupply: ${yearSupplyInterest.toString()}\nyrarBorrow: ${yearBorrowInterest.toString()}\ntotalSupply: ${totalSupplyBalance.toString()}`)
    const tempNetApy = +totalSupplyBalance > 0 ? (+yearSupplyInterest.toString() - +yearBorrowInterest.toString()) / +totalSupplyBalance.toString() : 0
    //const netApy = totalSupplyBalance.gt(BigNumber.from("0")) ? (yearSupplyInterest.subSafe(yearBorrowInterest)).divSafe(totalSupplyBalance) : BigNumber.from("0")
    const  netApy = BigNumber.parseValue(tempNetApy.noExponents())

    return new GeneralDetailsData(
                            totalSupplyBalance,
                            totalBorrowBalance,
                            allMarketsTotalSupplyBalance,
                            allMarketsTotalBorrowBalance,
                            totalBorrowLimit,
                            totalBorrowLimitUsedPercent,
                            yearSupplyInterest,
                            yearBorrowInterest,
                            netApy,
                            +totalSupplyBalance.toString() > 0 ? BigNumber.parseValue((+yearSupplyHndRewards.toString() / +totalSupplyBalance.toString() * 100).noExponents()) : BigNumber.from(0),
                            +totalBorrowBalance.toString() > 0 ? BigNumber.parseValue((+yearBorrowHndRewards.toString() / +totalBorrowBalance.toString()).noExponents()) : BigNumber.from(0),
                            totalLiquidity)
  }