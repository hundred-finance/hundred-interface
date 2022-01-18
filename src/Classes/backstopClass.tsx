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
    underlyingTokens: string,
    collaterals?: string[]
}


export type BackstopType = {
    pool: BackstopPool,
    poolInfo: BackstopPoolInfo
    userBalance: ethers.BigNumber,
    pendingHundred: ethers.BigNumber,
    hundredPerSecond: ethers.BigNumber,
    totalAllocPoint: number,
    totalSupply: ethers.BigNumber,
    masterchefBalance: ethers.BigNumber,
    underlyingBalance: ethers.BigNumber,
    decimals: number,
    symbol: string,
    allowance: ethers.BigNumber,
    ethBalance: ethers.BigNumber,
    fetchPrice: ethers.BigNumber
  }

  export type BackstopCollaterals = {
    fetchPrice: ethers.BigNumber
    balance: ethers.BigNumber
    decimals: number
  }

  export type BackstopTypeV2 = {
    pool: BackstopPool,
    poolInfo: BackstopPoolInfo
    userBalance: ethers.BigNumber,
    pendingHundred: ethers.BigNumber,
    hundredPerSecond: ethers.BigNumber,
    totalAllocPoint: number,
    totalSupply: ethers.BigNumber,
    masterchefBalance: ethers.BigNumber,
    underlyingBalance: ethers.BigNumber,
    decimals: number,
    symbol: string,
    allowance: ethers.BigNumber,
    collaterals: BackstopCollaterals[]
  }
  
  export class Backstop{
    pool: BackstopPool
    poolInfo: BackstopPoolInfo
    userBalance: BigNumber
    pendingHundred: BigNumber
    hunderdPerSecond: BigNumber
    totalAllocPoint: number
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
  
    constructor(pool: BackstopPool, poolInfo: BackstopPoolInfo, userBalance : BigNumber, pendingHundred: BigNumber, hundredPerSecond: BigNumber, totalAllocPoint: number,
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
      this.apr = totalAllocPoint > 0 && hndPrice > 0 ? BigNumber.parseValue((+hundredPerSecond.toString() * (60 * 60 * 24 * 365) * poolInfo.allocPoint / totalAllocPoint * hndPrice / tvl).noExponents()) : BigNumber.from("0")
    }
  }

  export class BackstopV2{
    pool: BackstopPool
    poolInfo: BackstopPoolInfo
    userBalance: BigNumber
    pendingHundred: BigNumber
    hundedPerSecond: BigNumber
    totalAllocPoint: number
    totalSupply: BigNumber
    masterchefBalance: BigNumber
    underlyingBalance: BigNumber
    decimals: number
    sharePrice: BigNumber
    symbol: string
    allowance: BigNumber
    tvl: BigNumber
    apr: BigNumber
  
    constructor(backstop: BackstopTypeV2, tokenDecimals: number, tokenPrice: BigNumber, hndPrice: number){
        
      let tvl = 0

      backstop.collaterals.forEach(c => tvl += +c.balance/10**c.decimals * +c.fetchPrice/10**tokenDecimals/10**(18-c.decimals))

      tvl += +backstop.underlyingBalance/10**tokenDecimals * +tokenPrice.toString()
      console.log(tvl)
      
      this.pool = backstop.pool
      this.poolInfo = backstop.poolInfo
      this.userBalance = BigNumber.from(backstop.userBalance, backstop.decimals)
      this.pendingHundred = BigNumber.from(backstop.pendingHundred, backstop.decimals)
      this.hundedPerSecond = BigNumber.from(backstop.hundredPerSecond, backstop.decimals)
      this.totalAllocPoint = backstop.totalAllocPoint
      this.totalSupply = BigNumber.from(backstop.totalSupply, backstop.decimals)
      this.masterchefBalance = BigNumber.from(backstop.masterchefBalance, backstop.decimals)
      this.underlyingBalance = BigNumber.from(backstop.underlyingBalance, tokenDecimals)
      this.decimals = backstop.decimals
      this.sharePrice = this.totalSupply.toNumeral() > 0 ? BigNumber.parseValue((tvl/+this.totalSupply.toString()).noExponents()) : BigNumber.from("0")
      this.symbol = backstop.symbol
      this.allowance = BigNumber.from(backstop.allowance, backstop.decimals)
      this.tvl = BigNumber.parseValue(tvl.noExponents())
      this.apr = backstop.totalAllocPoint > 0 && hndPrice > 0 ? BigNumber.parseValue((+this.hundedPerSecond.toString() * (60 * 60 * 24 * 365) * backstop.poolInfo.allocPoint / backstop.totalAllocPoint * hndPrice / tvl).noExponents()) : BigNumber.from("0")
    }
  }