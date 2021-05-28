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
        totalSupplyBalance = totalSupplyBalance.add(market.supplyBalance)
        totalBorrowBalance = totalBorrowBalance.add(market.borrowBalance)
      
        if (market?.marketTotalSupply?.gt(BigNumber.from("0"))) {
          allMarketsTotalSupplyBalance = allMarketsTotalSupplyBalance.add(market.marketTotalSupply)
        }

        if (market?.marketTotalBorrow?.gt(BigNumber.from("0"))) {
            allMarketsTotalBorrowBalance = allMarketsTotalBorrowBalance.add(market.marketTotalBorrow)
        }
        totalBorrowLimit = totalBorrowLimit.add(market.isEnterMarket ? market.supplyBalance.mul(market.collateralFactor) : BigNumber.from("0"))
        
        yearSupplyInterest = yearSupplyInterest.add(market.supplyBalance.mul(market.supplyApy))
        yearBorrowInterest = yearBorrowInterest.add(market?.borrowBalance.mul(market.borrowApy))
        if (market && market.liquidity.gt(BigNumber.from("0"))) {
            totalLiquidity = totalLiquidity.add(market.liquidity)
        }
      }          
    })
    
    const totalBorrowLimitTemp: number = +totalBorrowLimit.toFixed(18)
    const totalBorrowBalanceTemp: number = +totalBorrowBalance.toFixed(18)
    const temp = (totalBorrowBalanceTemp / totalBorrowLimitTemp * 100)
    const totalBorrowLimitUsedPercent = totalBorrowLimitTemp > 0 ? BigNumber.parseValue(temp.toString()) : BigNumber.from("0")

    const sub = (+yearSupplyInterest.toString() - (+yearBorrowInterest.toString())) / +totalSupplyBalance.toString()
    
    const netApy = totalSupplyBalance.gt(BigNumber.from("0")) ? BigNumber.parseValue(sub.toString()) : BigNumber.from("0")
    
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
                            totalSupplyBalance.gt(BigNumber.from("0")) ? yearSupplyPctRewards?.div(totalSupplyBalance) : BigNumber.from(0),
                            totalBorrowBalance.gt(BigNumber.from("0")) ?  yearBorrowPctRewards?.div(totalBorrowBalance) : BigNumber.from(0),
                            pctPrice,
                            totalLiquidity)
  }