import { BigNumber } from "../bigNumber"


export class HundredBalance{
  balance: BigNumber
  symbol: string
  constructor(balance: string, decimals: number, symbol: string){
      this.balance = BigNumber.from(balance, decimals)
      this.symbol = symbol
  }
}