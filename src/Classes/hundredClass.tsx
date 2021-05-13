import { BigNumber } from "@ethersproject/bignumber"
import { toDecimalPlaces } from "../helpers"

export class HundredBalance{
  balance: BigNumber
  decimals: number
  symbol: string
  constructor(balance: BigNumber, decimals: number, symbol: string){
      this.balance = balance
      this.decimals = decimals
      this.symbol = symbol
  }
  toFixed(dp: number): string {
    return toDecimalPlaces(this.balance, this.decimals, dp)
  }
}