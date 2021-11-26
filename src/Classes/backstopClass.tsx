import { ethers } from "ethers"
import { BigNumber } from "../bigNumber"

export type BackstopPoolInfo={
    accHundredPerShare:number,
    lastRewardTime: number,
    allocPoint: number
  }

export type BackstopPool={
    poolId: number,
    lpTokens: string,
    underlyingTokens: string
}


export type BackstopType = {
    pool: BackstopPool,
    poolInfo: BackstopPoolInfo
    userBalance: ethers.BigNumber,
    pendingHundred: ethers.BigNumber,
    hundredPerSecond: ethers.BigNumber,
    totalAllocPoint: ethers.BigNumber,
    totalSuplly: ethers.BigNumber,
    masterchefBalance: ethers.BigNumber,
    underlyingBalance: ethers.BigNumber,
    decimals: number,
    symbol: string,
    allowance: ethers.BigNumber,
    ethBalance: ethers.BigNumber,
    fetchPrice: ethers.BigNumber
  }
  
  export class Backstop{
    pool: BackstopPool
    poolInfo: BackstopPoolInfo
    userBalance: BigNumber
    pendingHundred: BigNumber
    hunderdPerSecond: BigNumber
    totalAllocPoint: BigNumber
    totalSupply: BigNumber
    masterchefBalance: BigNumber
    underlyingBalance: BigNumber
    decimals: number
    sharePrice: BigNumber
    symbol: string
    allowance: BigNumber
    ethBalance: BigNumber
    fetchPrice: BigNumber
    tvl: BigNumber
    userEthBalance: BigNumber
    apr: BigNumber
  
    constructor(pool: BackstopPool, poolInfo: BackstopPoolInfo, userBalance : BigNumber, pendingHundred: BigNumber, hundredPerSecond: BigNumber, totalAllocPoint: BigNumber,
        totalSupply : BigNumber, masterchefBalance: BigNumber, underlyingBalance: BigNumber, decimals: number, symbol: string, allowance: BigNumber, ethBalance: BigNumber, fetchPrice: BigNumber, tokenPrice: BigNumber, hndPrice: number){
        
      const tvl = +underlyingBalance.toString() * +tokenPrice.toString() + (+fetchPrice.toString() * +ethBalance.toString())
      
      this.pool = pool
      this.poolInfo = poolInfo
      this.userBalance = userBalance
      this.pendingHundred = pendingHundred
      this.hunderdPerSecond = hundredPerSecond
      this.totalAllocPoint = totalAllocPoint
      this.totalSupply = totalSupply
      this.masterchefBalance = masterchefBalance
      this.underlyingBalance = underlyingBalance
      this.decimals = decimals
      this.sharePrice = totalSupply.toNumeral() > 0 ? BigNumber.parseValue((tvl/+totalSupply.toString()).noExponents()) : BigNumber.from("0")
      this.symbol = symbol
      this.allowance = allowance
      this.ethBalance = ethBalance
      this.fetchPrice = fetchPrice
      this.tvl = BigNumber.parseValue(tvl.noExponents())
      this.userEthBalance = BigNumber.parseValue((+ethBalance.toString() * +userBalance.toString() / +totalSupply.toString()).noExponents())
      this.apr = BigNumber.from((+hundredPerSecond.toString() * (60 * 60 * 24 * 365) * poolInfo.allocPoint / +totalAllocPoint.toString() * hndPrice).noExponents())
      
    }
  }