import { BigNumber } from "../bigNumber"


export class HundredBalance{
  balance: BigNumber
  symbol: string
  constructor(balance:BigNumber, symbol: string){
      this.balance = balance
      this.symbol = symbol
  }
}