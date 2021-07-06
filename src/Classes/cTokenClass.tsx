import { ethers} from "ethers"
import { Contract} from 'ethcall'
import {BigNumber} from "../bigNumber"
import { CTOKEN_ABI, MKR_TOKEN_ABI, TOKEN_ABI } from "../abi"
import Logos from "../logos"
import { Network } from "../networks"
import { Comptroller } from "./comptrollerClass"
import { Call } from "ethcall/lib/call"

const blockTime = 2.1 // seconds
const mantissa = 1e18 // mantissa is the same even the underlying asset has different decimals
const blocksPerDay = (24 * 60 * 60) / blockTime
const daysPerYear = 365

export class CTokenInfo{
    pTokenAddress: string
    underlyingAddress: string | null
    symbol: string
    logoSource: string
    supplyApy: BigNumber
    borrowApy: BigNumber
    underlyingAllowance: BigNumber
    walletBalance: BigNumber
    supplyBalanceInTokenUnit: BigNumber
    supplyBalance: BigNumber
    marketTotalSupply: BigNumber
    borrowBalanceInTokenUnit: BigNumber
    borrowBalance: BigNumber
    marketTotalBorrowInTokenUnit: BigNumber
    marketTotalBorrow: BigNumber
    isEnterMarket: boolean
    underlyingAmount: BigNumber
    underlyingPrice: BigNumber
    liquidity: BigNumber
    collateralFactor: BigNumber
    pctSpeed: BigNumber
    decimals: number
    spinner: boolean
    supplySpinner: boolean
    withdrawSpinner: boolean
    borrowSpinner: boolean
    repaySpinner: boolean
    isNativeToken: boolean

    supplyPctApy: BigNumber
    borrowPctApy: BigNumber

    constructor(pTokenAddress: string,
                underlyingAddress: string | null,
                symbol: string,
                logoSource: string,
                supplyApy: BigNumber,
                borrowApy: BigNumber,
                underlyingAllowance: BigNumber,
                walletBalance: BigNumber,
                supplyBalanceInTokenUnit: BigNumber,
                supplyBalance: BigNumber,
                marketTotalSupply: BigNumber,
                borrowBalanceInTokenUnit: BigNumber,
                borrowBalance: BigNumber,
                marketTotalBorrowInTokenUnit: BigNumber,
                marketTotalBorrow: BigNumber,
                isEnterMarket: boolean,
                underlyingAmount: BigNumber,
                underlyingPrice: BigNumber,
                liquidity: BigNumber,
                collateralFactor: BigNumber,
                pctSpeed: BigNumber,
                decimals: number,
                isNativeToken: boolean){
        this.pTokenAddress= pTokenAddress
        this.underlyingAddress= underlyingAddress
        this.symbol= symbol
        this.logoSource= logoSource
        this.supplyApy= supplyApy
        this.borrowApy= borrowApy
        this.underlyingAllowance= underlyingAllowance
        this.walletBalance= walletBalance
        this.supplyBalanceInTokenUnit= supplyBalanceInTokenUnit
        this.supplyBalance= supplyBalance
        this.marketTotalSupply= marketTotalSupply
        this.borrowBalanceInTokenUnit= borrowBalanceInTokenUnit
        this.borrowBalance= borrowBalance
        this.marketTotalBorrowInTokenUnit= marketTotalBorrowInTokenUnit
        this.marketTotalBorrow= marketTotalBorrow
        this.isEnterMarket= isEnterMarket
        this.underlyingAmount= underlyingAmount
        this.underlyingPrice= underlyingPrice
        this.liquidity= liquidity
        this.collateralFactor= collateralFactor
        this.pctSpeed= pctSpeed
        this.decimals= decimals
        this.isNativeToken = isNativeToken
        this.spinner = false
        this.supplySpinner = false
        this.withdrawSpinner = false
        this.borrowSpinner = false
        this.repaySpinner = false

        this.supplyPctApy = BigNumber.from("0")
        this.borrowPctApy = BigNumber.from("0")
    }
}

class UnderlyingInfo{
      address: string
      symbol: string
      name: string
      decimals: number
      totalSupply: number
      logo: string
      price: BigNumber
      walletBalance: BigNumber
      allowance: BigNumber

      constructor(address: string, symbol: string, name: string, decimals: number, totalSupply: number, logo: string, price: BigNumber, walletBalance: ethers.BigNumber, allowance: ethers.BigNumber){
        this.address = address 
        this.symbol = symbol
        this.name = name 
        this.decimals = decimals 
        this.totalSupply = totalSupply 
        this.logo = logo 
        this.price = price
        this.walletBalance = BigNumber.from(walletBalance, decimals) 
        this.allowance = BigNumber.from(allowance, decimals)
      }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getCtokenInfo = async (address : string, isNativeToken : boolean, provider: any, userAddress: string, comptrollerData: Comptroller, network: Network) : Promise<CTokenInfo>=> {
    const [markets, speed] = await comptrollerData.ethcallProvider.all([comptrollerData.ethcallComptroller.markets(address), comptrollerData.ethcallComptroller.compSpeeds(address)])
    
    const cToken = new Contract(address, CTOKEN_ABI)

    let [accountSnapshot, totalSupply, exchangeRate, totalBorrows, supplyRate, borrowRate, getCash, underlyingAddress] = ["", "", "", "", "", "", "", null]
    if (isNativeToken)
       [accountSnapshot, totalSupply, exchangeRate, totalBorrows, supplyRate, borrowRate, getCash] = await comptrollerData.ethcallProvider.all([cToken.getAccountSnapshot(userAddress), 
                                                                                                                          cToken.totalSupply(), cToken.exchangeRateStored(), cToken.totalBorrows(),
                                                                                                                          cToken.supplyRatePerBlock(), cToken.borrowRatePerBlock(), cToken.getCash()])
    else
      [accountSnapshot, totalSupply, exchangeRate, totalBorrows, supplyRate, borrowRate, getCash, underlyingAddress] = await comptrollerData.ethcallProvider.all([cToken.getAccountSnapshot(userAddress), 
        cToken.totalSupply(), cToken.exchangeRateStored(), cToken.totalBorrows(),
        cToken.supplyRatePerBlock(), cToken.borrowRatePerBlock(), cToken.getCash(), cToken.underlying()])
    
        //const ctoken = new ethers.Contract(address, CTOKEN_ABI, provider)
    //console.log(`underlyingAddress: ${underlyingAddress}\naccountSnapshot:${accountSnapshot}\ntotalSupply:${totalSupply}\nexchangeRate: ${exchangeRate}\ntotalBorrows: ${totalBorrows}\nsupplyRate: ${supplyRate}\nborrowRate:${borrowRate}\ngetCash: ${getCash}`)
    
    const underlying = await getUnderlying(underlyingAddress, address, comptrollerData, provider, userAddress, network)
    
    const decimals = underlying.decimals
    const underlyingPrice = BigNumber.from(underlying.price, 36-decimals)
  
    const accountSnapshot1 = BigNumber.from(accountSnapshot[1].toString(), 18)
    const accountSnapshot3 = BigNumber.from(accountSnapshot[3].toString(), decimals)
    const supplyBalanceInTokenUnit = accountSnapshot1.mul(accountSnapshot3)

    const supplyBalance = supplyBalanceInTokenUnit.mul(underlyingPrice)

    const borrowBalanceInTokenUnit = BigNumber.from(accountSnapshot[2].toString(), decimals)
    const borrowBalance = borrowBalanceInTokenUnit.mul(underlyingPrice)


    const cTokenTotalSupply = BigNumber.from(totalSupply, decimals)
    const exchangeRateStored = BigNumber.from(exchangeRate, 18)
    const marketTotalSupply = cTokenTotalSupply.mul(exchangeRateStored).mul(underlyingPrice)

    const cTokenTotalBorrows = BigNumber.from(totalBorrows, decimals)
    const marketTotalBorrowInTokenUnit = BigNumber.from(cTokenTotalBorrows._value, decimals)
    const marketTotalBorrow = cTokenTotalBorrows?.mul(underlyingPrice)

    const isEnterMarket = comptrollerData.enteredMarkets.includes(address);

    //const markets = await comptrollerData.comptroller.markets(address)

    const collateralFactor = BigNumber.from(markets.collateralFactorMantissa.toString(), 18)
    
    const supplyRatePerBlock = BigNumber.from(supplyRate)
    const supplyApy = BigNumber.parseValue((Math.pow((supplyRatePerBlock.toNumber() / mantissa) * blocksPerDay + 1, daysPerYear - 1) - 1).toFixed(36-decimals), 36-decimals)

    const borrowRatePerBlock = BigNumber.from(borrowRate, decimals)
    const borrowApy = BigNumber.parseValue((Math.pow((borrowRatePerBlock.toNumber() / mantissa) * blocksPerDay + 1, daysPerYear - 1) - 1).toFixed(36-decimals), 36-decimals)

    const cash = BigNumber.from(getCash, decimals) 
    const underlyingAmount = cash;

    const liquidity = underlyingAmount.mul(underlyingPrice)
    
    const underlyingAllowance = underlying.allowance
    
    //const speed = await comptrollerData.comptroller.compSpeeds(address)
    const pctSpeed = speed;

    return new CTokenInfo(
      address,
      underlyingAddress,
      underlying.symbol,
      underlying.logo,
      supplyApy,
      borrowApy,
      underlyingAllowance,
      underlying.walletBalance,
      supplyBalanceInTokenUnit,
      supplyBalance,
      marketTotalSupply,
      borrowBalanceInTokenUnit,
      borrowBalance,
      marketTotalBorrowInTokenUnit,
      marketTotalBorrow,
      isEnterMarket,
      underlyingAmount,
      underlyingPrice,
      liquidity,
      collateralFactor,
      pctSpeed,
      decimals,
      isNativeToken
    )
  }

  const getUnderlying = async (underlyingAddress: string | null, ptoken: string, comptrollerData: Comptroller, provider: ethers.providers.Web3Provider, userAddress: string, network: Network) => {  
    
    if (!underlyingAddress)
      return await getNativeTokenInfo(ptoken, comptrollerData, provider, userAddress, network)
    else if (underlyingAddress.toLowerCase() === "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2")
      return await getMakerInfo(underlyingAddress, ptoken, comptrollerData, userAddress)
    else 
      return await getTokenInfo(underlyingAddress, ptoken, comptrollerData, userAddress)
  }

  const getNativeTokenInfo = async (ptoken: string, comptrollerData: Comptroller, provider: ethers.providers.Web3Provider, userAddress: string, network: Network) : Promise<UnderlyingInfo> => {
    return new UnderlyingInfo(
      "0x0",
      network.symbol,
      network.name,
      18,
      0,
      Logos[network.symbol],
      await comptrollerData.oracle.getUnderlyingPrice(ptoken),
      await provider.getBalance(userAddress),
      ethers.constants.MaxUint256,
    )
  }

  const getTokenInfo = async(address: string, ptoken: string, comptrollerData: Comptroller, userAddress: string) : Promise<UnderlyingInfo> => {
    const contract = new Contract(address, TOKEN_ABI)
    const [symbol, name, decimals, totalSupply, balanceOf, allowance] = await comptrollerData.ethcallProvider.all([ contract.symbol(), contract.name(), contract.decimals(), contract.totalSupply(), contract.balanceOf(userAddress), contract.allowance(userAddress, ptoken)])
    const logo = Logos[symbol]
    let price = BigNumber.from("0")
    try{
      price = await comptrollerData.oracle.getUnderlyingPrice(ptoken)
    }
    catch(err){
      console.log(address)
      console.log(err)
    }
    const token = new UnderlyingInfo(
      address,
      symbol,
      name,
      decimals,
      totalSupply,
      logo, //`https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`,
      price,
      balanceOf,
      allowance
    )
    return token
  }

  const getMakerInfo = async (address: string, ptoken: string, comptrollerData: Comptroller, userAddress: string): Promise<UnderlyingInfo> => {
    const contract = new Contract(address, MKR_TOKEN_ABI)
    const [symbol, name, decimals, totalSupply, balanceOf, allowance] = await comptrollerData.ethcallProvider.all([ contract.symbol(), contract.name(), contract.decimals(), contract.totalSupply(), contract.balanceOf(userAddress), contract.allowance(userAddress, ptoken)])
    return new UnderlyingInfo(
      address,
      ethers.utils.parseBytes32String(symbol),
      ethers.utils.parseBytes32String(name),
      decimals/1,
      totalSupply,
      Logos["MKR"],
      await comptrollerData.oracle.getUnderlyingPrice(ptoken),
      balanceOf,
      allowance
    )
  }


  export const getTokenBalances = async (tokens: (CTokenInfo | null)[], comptrollerData: Comptroller, userAddress: string) : Promise<(CTokenInfo | null)[] | null> =>{
    if (tokens && comptrollerData){
      const calls : Call[] = tokens.map(t => {
        if(t){
          if(t.isNativeToken){
            console.log("IsNativeToken")
            const call: Call = comptrollerData.ethcallProvider.getEthBalance(userAddress)
            return call
          }
          else if(t.underlyingAddress){
            const c = t.underlyingAddress.toLowerCase() === "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2" ? 
                    new Contract(t.underlyingAddress, MKR_TOKEN_ABI) : new Contract(t.underlyingAddress, TOKEN_ABI)
            const call: Call = c.balanceOf(userAddress)
            return call
          }
        }
        const c = new Contract("", TOKEN_ABI)
            const call: Call = c.balanceOf(userAddress)
        return call
      })
      
     
        const result = await comptrollerData.ethcallProvider.all(calls)
        
        tokens.forEach((t, i) => {
          if(t){
            t.walletBalance = BigNumber.from(result[i], t.decimals)
          }
        })
        
        return tokens
      }
    
    return null
  }