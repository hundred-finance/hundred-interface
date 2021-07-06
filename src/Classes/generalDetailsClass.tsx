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
    totalSupplyPctApy: BigNumber
    totalBorrowPctApy: BigNumber
    pctPrice: number
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
                totalSupplyPctApy: BigNumber,
                totalBorrowPctApy: BigNumber,
                pctPrice: number,
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
        this.totalSupplyPctApy = totalSupplyPctApy
        this.totalBorrowPctApy = totalBorrowPctApy
        this.pctPrice = pctPrice
        this.totalLiquidity = totalLiquidity
    }
}

const getPctPrice = async () : Promise<number> => {
    const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=percent&vs_currencies=usd"
        // "https://api.coingecko.com/api/v3/simple/price?ids=compound-governance-token&vs_currencies=usd"
      );
      const data = await response.json()
      const usd: number = +data?.percent?.usd
      return usd
  }

export const getGeneralDetails = async (marketsData: (CTokenInfo | null)[]) : Promise<GeneralDetailsData> => {
    const pctPrice = await getPctPrice()
    let totalSupplyBalance = BigNumber.from("0")
    let totalBorrowBalance = BigNumber.from("0")
    let allMarketsTotalSupplyBalance = BigNumber.from("0")
    let allMarketsTotalBorrowBalance = BigNumber.from("0")
    let totalBorrowLimit = BigNumber.from("0")
    let yearSupplyInterest = BigNumber.from("0")
    let yearBorrowInterest = BigNumber.from("0")
    const yearSupplyPctRewards = BigNumber.from("0")
    const yearBorrowPctRewards = BigNumber.from("0")
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
        
        yearSupplyInterest = yearSupplyInterest.addSafe(market.supplyBalance.mulSafe(market.supplyApy))
        yearBorrowInterest = yearBorrowInterest.addSafe(market?.borrowBalance.mulSafe(market.borrowApy))
        if (market && market.liquidity.gt(BigNumber.from("0"))) {
            totalLiquidity = totalLiquidity.addSafe(market.liquidity)
        }
      }          
    })
    
    const totalBorrowLimitTemp: number = +totalBorrowLimit.toFixed(18)
    const totalBorrowBalanceTemp: number = +totalBorrowBalance.toFixed(18)
    const temp = (totalBorrowBalanceTemp / totalBorrowLimitTemp * 100)
    
    const totalBorrowLimitUsedPercent = totalBorrowLimit.gt(BigNumber.from(0)) ? BigNumber.parseValue(temp.toFixed(18)) : BigNumber.from("0")
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
                            +totalSupplyBalance.toString() > 0 ? BigNumber.parseValue((+yearSupplyPctRewards.toString() / +totalSupplyBalance.toString()).noExponents()) : BigNumber.from(0),
                            +totalBorrowBalance.toString() > 0 ? BigNumber.parseValue((+yearBorrowPctRewards.toString() / +totalBorrowBalance.toString()).noExponents()) : BigNumber.from(0),
                            pctPrice,
                            totalLiquidity)
  }