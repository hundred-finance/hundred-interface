import { ethers, utils, version} from "ethers"
import { Logger } from "@ethersproject/logger"

const logger = new Logger(version);

const _constructorGuard = { };

export class BigNumber {
    readonly _value : ethers.BigNumber
    readonly _decimals: number
  
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    constructor(constructorGuard: any, value: ethers.BigNumber, decimals?: number){
      if (constructorGuard !== _constructorGuard) {
        logger.throwError("cannot call constructor directly; use BigNumber.from", Logger.errors.UNSUPPORTED_OPERATION, {
            operation: "new (BigNumber)"
        });
    }
      this._value = value
      decimals ? this._decimals = decimals : this._decimals = 0
    }

    mul = (value: BigNumber) : BigNumber => {
      const res = this._value.mul(value._value)
      const decimals = res.eq(0) ? 0 : this._decimals + value._decimals
      return new BigNumber(_constructorGuard, res , decimals)
    }

    div = (value: BigNumber) : BigNumber => {
      const res = this._value.mul(value._value)
      const decimals = res.eq(0) ? 0 : this._decimals + value._decimals
      return new BigNumber(_constructorGuard, res, decimals)
    }

    sub = (value: BigNumber) : BigNumber => {
      const res = this._value.sub(value._value)
      const decimals = this._decimals > value._decimals ? this._decimals : value._decimals
      return new BigNumber(_constructorGuard, res, decimals)
    }

    add = (value: BigNumber) : BigNumber => {
      const res = this._value.add(value._value)
      const decimals = this._decimals > value._decimals ? this._decimals : value._decimals
      return new BigNumber(_constructorGuard, res, decimals)
    }

    gt = (value: BigNumber) : boolean => {
      return this._value.gt(value._value)
    }

    gte = (value: BigNumber) : boolean => {
      return this._value.gte(value._value)
    }

    lte = (value: BigNumber) : boolean => {
      return this._value.lte(value._value)
    }

    toString = () : string => {
      return ethers.utils.formatUnits(this._value, this._decimals)
    }

    toFixed = (places: number) : string => {
      const num = ethers.utils.formatUnits(this._value, this._decimals)
      const split = num.split('.')
      if(split.length === 2){
        if(split[1].length > places)
          return `${split[0]}.${split[1].substring(0, places)}`
      }
      return (+num).toFixed(2)
    }

    toRound = (places: number) : string => {
      const num = +ethers.utils.formatUnits(this._value, this._decimals)
      const rounded = Math.round((num + Number.EPSILON) * Math.pow(10, places)) / Math.pow(10, places)
      return rounded.toString()
    }

    toNumber = () : number => {
      return this._value.toNumber()
    }
  
    static minimum = (b1: BigNumber, b2: BigNumber) : BigNumber => {
      console.log(b1.toString() + " - " + b2.toString() )
      if(+b1.toString() > +b2.toString()) return b2
      return b1
    }
  
    static parseValue = (value: string, decimals?: number): BigNumber => {
      const temp = value.split(".")
      if(!decimals){
        temp.length === 2 ? decimals = temp[1].length : decimals = 0
      }
      if(temp.length === 2 && temp[1]==="")
        value = temp[0]
      const num = utils.parseUnits(value, decimals)
      return new BigNumber(_constructorGuard, num, decimals)
    }
  
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    static from = (value: any, decimals?:number) : BigNumber => {
      const eth = ethers.BigNumber.from(value)
      return new BigNumber(_constructorGuard, eth, decimals)
    }
  }