import { Call, Contract } from "ethcall"
import { ethers } from "ethers"
import { COMPTROLLER_ABI, CTOKEN_ABI, TOKEN_ABI } from "../../abi"
import { BigNumber } from "../../bigNumber"
import { Comptroller } from "../../Classes/comptrollerClass"
import { CTokenInfo } from "../../Classes/cTokenClass"
import Logos from "../../logos"
import { Network } from "../../networks"

const mantissa = 1e18

type Markets = {
    isComped: boolean,
    isListed: boolean,
    collateralFactorMantissa: ethers.BigNumber
}

type CompSupplyState = {
    block: number,
    index: ethers.BigNumber
}

type Underlying = {
    price: ethers.BigNumber
    symbol: string,
    name: string,
    decimals: number,
    totalSupply: number
    allowance: ethers.BigNumber
    walletBalance: ethers.BigNumber
    address: string,
    logo: string
}

type Token ={
    accountSnapshot: string[],
    exchangeRate: ethers.BigNumber
    totalSupply: ethers.BigNumber
    totalBorrows: ethers.BigNumber
    supplyRatePerBlock: ethers.BigNumber
    borrowRatePerBlock: ethers.BigNumber,
    cash: ethers.BigNumber,
    cTokenBalanceOfUser: ethers.BigNumber,
    markets: Markets,
    compSpeeds: ethers.BigNumber
    compSupplyState: CompSupplyState,
    compSupplierIndex: ethers.BigNumber
    underlying: Underlying,
    enteredMarkets: string[],
    tokenAddress: string,
    isNative: boolean
}

type CheckValidData ={
    name: string,
    oldData: string,
    newData: string
  }

export type MarketDataType = {
    hndPrice: number,
    markets: CTokenInfo[]
}
  
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const fetchData = async(allMarkets:string[], userAddress: string, comptrollerData: Comptroller, network: Network, marketsData: (CTokenInfo | null)[] | null | undefined, provider: any, hndPrice: number) : Promise<MarketDataType> => {
    const ethcallComptroller = new Contract(network.UNITROLLER_ADDRESS, COMPTROLLER_ABI)
    const calls= [ethcallComptroller.getAssetsIn(userAddress)]

    const markets = allMarkets.filter((a) => {
      if (a.toLowerCase() === "0xc98182014c90baa26a21e991bfec95f72bd89aed")
         return false
      return true
    })
  
    const nativeToken = markets.find(a => a.toLowerCase() === network.token.toLowerCase())
    if (nativeToken){
      const cToken = new Contract(nativeToken, CTOKEN_ABI)
      calls.push(cToken.getAccountSnapshot(userAddress),
                 cToken.exchangeRateStored(),
                 cToken.totalSupply(), 
                 cToken.totalBorrows(), 
                 cToken.supplyRatePerBlock(), 
                 cToken.borrowRatePerBlock(), 
                 cToken.getCash(),
                 cToken.balanceOf(userAddress),
                 comptrollerData.ethcallComptroller.markets(nativeToken), 
                 comptrollerData.ethcallComptroller.compSpeeds(nativeToken), 
                 comptrollerData.ethcallComptroller.compSupplyState(nativeToken), 
                 comptrollerData.ethcallComptroller.compSupplierIndex(nativeToken, userAddress),
                 comptrollerData.oracle.getUnderlyingPrice(nativeToken))
    }
    
    const notNativeMarkets = markets.filter((a) => {
      if (a.toLowerCase() === network.token.toLowerCase()) 
        return false
      return true  
    })

    let underlyingAddresses:string[] = []
    if (!marketsData || markets.length !== marketsData.length){
      const underlyingCalls: Call[] = []
      notNativeMarkets.map(x=>{
        const cToken = new Contract(x, CTOKEN_ABI)
        underlyingCalls.push(cToken.underlying())
      })
      const result = await comptrollerData.ethcallProvider.all(underlyingCalls)
      underlyingAddresses = result
    }
    else{
      marketsData.filter(x=>{
        if(x?.isNativeToken) return false
         return true
      }).map(x=> {
        if (x?.underlyingAddress) underlyingAddresses.push(x.underlyingAddress)
      })
    }

    notNativeMarkets.map((a, index) => {
        const cToken = new Contract(a, CTOKEN_ABI)
        const underlyingAddress = underlyingAddresses[index]
        const contract = new Contract(underlyingAddress, TOKEN_ABI)
        calls.push(cToken.getAccountSnapshot(userAddress),
                   cToken.exchangeRateStored(),
                   cToken.totalSupply(), 
                   cToken.totalBorrows(), 
                   cToken.supplyRatePerBlock(), 
                   cToken.borrowRatePerBlock(), 
                   cToken.getCash(),
                   cToken.balanceOf(userAddress),
                   comptrollerData.ethcallComptroller.markets(a), 
                   comptrollerData.ethcallComptroller.compSpeeds(a), 
                   comptrollerData.ethcallComptroller.compSupplyState(a), 
                   comptrollerData.ethcallComptroller.compSupplierIndex(a, userAddress),
                   comptrollerData.oracle.getUnderlyingPrice(a),
                   contract.symbol(), 
                   contract.name(),
                   contract.decimals(), 
                   contract.totalSupply(), 
                   contract.allowance(userAddress, a), 
                   contract.balanceOf(userAddress))
    })
    
    const res = await comptrollerData.ethcallProvider.all(calls)
    
    const tokens = []
    
    if(res && res.length === notNativeMarkets.length * 19 + 14){
        const enteredMarkets = res.splice(0, 1)
        
        if(nativeToken){
            const native = res.splice(0, 13)
            tokens.push(await getTokenData(native, true, network, provider, userAddress, "0x0", enteredMarkets, nativeToken))
        }

        let i = 0

        while (res.length){
            const token = res.splice(0,19)
            tokens.push(await getTokenData(token, false, network, provider, userAddress, underlyingAddresses[i], enteredMarkets, notNativeMarkets[i]))
            i+=1
        }
    }

    const tokensInfo = await Promise.all(tokens.map(async(t)=>{
        return await getCtokenInfo(t, network, hndPrice, provider)
    }))

    return {hndPrice: hndPrice, markets: tokensInfo}
  }

 const getTokenData = async(tokenData: any[], native: boolean, network: Network, provider: ethers.providers.Web3Provider, 
                            userAddress: string, underlyingAddress: string, enteredMarkets: string[], tokenAddress: string): Promise<Token> =>{
    const isMaker = underlyingAddress.toLowerCase() === "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2" ? true : false
    const token: Token = {
        accountSnapshot: tokenData[0],
        exchangeRate: tokenData[1],
        totalSupply: tokenData[2],
        totalBorrows: tokenData[3],
        supplyRatePerBlock: tokenData[4],
        borrowRatePerBlock: tokenData[5],
        cash: tokenData[6],
        cTokenBalanceOfUser: tokenData[7],
        markets: tokenData[8] as Markets,
        compSpeeds: tokenData[9],
        compSupplyState: tokenData[10] as CompSupplyState,
        compSupplierIndex: tokenData[11],
        underlying: {
            price: tokenData[12],
            symbol: native ? network.symbol : isMaker ? ethers.utils.parseBytes32String(tokenData[13]) : tokenData[13],
            name: native ? network.name : isMaker ? ethers.utils.parseBytes32String(tokenData[14]) : tokenData[14],
            decimals: native ? 18 : isMaker ? tokenData[15]/1 : tokenData[15],
            totalSupply: native ? 0 : tokenData[16],
            allowance: native ? ethers.constants.MaxUint256 : tokenData[17],
            walletBalance: native ? await provider.getBalance(userAddress) : tokenData[18],
            address: underlyingAddress,
            logo: native ? Logos[network.symbol] : isMaker ? Logos["MKR"] : Logos[tokenData[13]]
        },
        isNative: native,
        enteredMarkets: enteredMarkets,
        tokenAddress: tokenAddress
    }
    return token
  }

  const getCtokenInfo = async (token: Token, network: Network, hndPrice: number, provider: ethers.providers.Web3Provider) : Promise<CTokenInfo> => {
    
    const decimals = token.underlying.decimals
    const underlyingPrice = BigNumber.from(token.underlying.price, 36-decimals)
  
    const accountSnapshot1 = BigNumber.from(token.accountSnapshot[1].toString(), 18)
    const accountSnapshot3 = BigNumber.from(token.accountSnapshot[3].toString(), decimals)
    const supplyBalanceInTokenUnit = accountSnapshot1.mul(accountSnapshot3)

    const supplyBalance = BigNumber.parseValue((+supplyBalanceInTokenUnit.toString() * +underlyingPrice.toString()).noExponents())

    const borrowBalanceInTokenUnit = BigNumber.from(token.accountSnapshot[2].toString(), decimals)
    const borrowBalance = borrowBalanceInTokenUnit.mul(underlyingPrice)

    const exchangeRateStored = BigNumber.from(token.exchangeRate, 18)

    const marketTotalSupply = BigNumber.parseValue((+BigNumber.from(token.totalSupply, decimals).toString() * +exchangeRateStored.toString() * +underlyingPrice.toString()).noExponents())//cTokenTotalSupply.mul(exchangeRateStored).mul(underlyingPrice)

    const cTokenTotalBorrows = BigNumber.from(token.totalBorrows, decimals)
    const marketTotalBorrowInTokenUnit = BigNumber.from(cTokenTotalBorrows._value, decimals)
    const marketTotalBorrow = cTokenTotalBorrows?.mul(underlyingPrice)

    const isEnterMarket = token.enteredMarkets.includes(token.tokenAddress);

    const collateralFactor = BigNumber.from(token.markets.collateralFactorMantissa.toString(), 18)
    
    const supplyRatePerBlock = BigNumber.from(token.supplyRatePerBlock, decimals)
    
    const supplyApy = BigNumber.parseValue((Math.pow((1 + supplyRatePerBlock.toNumber() / mantissa), network.blocksPerYear) -1 ).noExponents())
    const borrowRatePerBlock = BigNumber.from(token.borrowRatePerBlock, decimals)
    
    const borrowApy = BigNumber.parseValue((Math.pow((1 + borrowRatePerBlock.toNumber() / mantissa), network.blocksPerYear) -1).noExponents())

    
    const underlyingAmount = BigNumber.from(token.cash, decimals)

    const liquidity = underlyingAmount.mul(underlyingPrice)

    const underlyingAllowance = BigNumber.from(token.underlying.allowance, decimals)
    const cTokenTVL = +marketTotalSupply.toString()
    
    //const speed = await comptrollerData.comptroller.compSpeeds(address)
    const hndSpeed = BigNumber.from(token.compSpeeds, 18);
    
    const yearlyRewards = +hndSpeed.toString() * (network.blocksPerYear ? network.blocksPerYear : 0) * hndPrice
    
    const hndAPR = BigNumber.parseValue(cTokenTVL > 0 ? (yearlyRewards / cTokenTVL).noExponents() : "0")

    const totalSupplyApy = BigNumber.parseValue((+hndAPR.toString() + +supplyApy.toString()).noExponents())
    
    const blockNum = await provider.getBlockNumber()

    // console.log(`${underlying.symbol}\nSupplyState.Index: ${supplyState.index}\nBlockNum: ${blockNum}\nSupplyState.block: ${supplyState.block}\ncompSpeed: ${compSpeed}\nTotalSupply: ${totalSupply}\nSupplierIndex: ${supplierIndex}`)
    const newSupplyIndex = +token.compSupplyState.index + (blockNum - token.compSupplyState.block) * +token.compSpeeds * 1e36 / +token.totalSupply;
    // console.log(`newSupplyIndex: ${newSupplyIndex}`)
    
    const accrued = (newSupplyIndex - +token.compSupplierIndex) * +token.cTokenBalanceOfUser / 1e36

    return new CTokenInfo(
      token.tokenAddress,
      token.underlying.address,
      token.underlying.symbol,
      token.underlying.logo,
      supplyApy,
      borrowApy,
      underlyingAllowance,
      BigNumber.from(token.underlying.walletBalance, decimals),
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
      hndSpeed,
      decimals,
      token.isNative,
      hndAPR,
      borrowRatePerBlock,
      totalSupplyApy
    )
  }

  export const compareData = (oldMarkets: (CTokenInfo | null)[], newMarkets: CTokenInfo[]) : void =>{
    console.log("\n-------------------------------------------------------------------------------------------\n")
                  
    const compare: CheckValidData[] = []
    const m = oldMarkets.find(n => n?.symbol === "USDC")
    const nm = newMarkets.find(n => n.symbol === "USDC")

    
    
    let c: CheckValidData = {name: "Address", oldData: m ? m.pTokenAddress : "", newData: nm ? nm.pTokenAddress : ""}
    compare.push(c)
    c = {name: "UnderlyingAddress", oldData: m && m.underlyingAddress? m.underlyingAddress : "", newData: nm && nm.underlyingAddress? nm.underlyingAddress : "",}
    compare.push(c)
    c = {name: "Symbol", oldData: m && m.symbol? m.symbol : "", newData: nm && nm.symbol? nm.symbol : "",}
    compare.push(c)
    c = {name: "Logo", oldData: m && m.logoSource? m.logoSource : "", newData: nm && nm.logoSource? nm.logoSource : "",}
    compare.push(c)
    c = {name: "SupplyApy", oldData: m && m.supplyApy ? m.supplyApy.toString() : "", newData: nm && nm.supplyApy ? nm.supplyApy.toString() : "",}
    compare.push(c)
    c = {name: "BorrowApy", oldData: m && m.borrowApy ? m.borrowApy.toString() : "", newData: nm && nm.borrowApy ? nm.borrowApy.toString() : "",}
    compare.push(c)
    c = {name: "UnderlyingAllowance", oldData: m && m.underlyingAllowance ? m.underlyingAllowance.toString() : "", newData: nm && nm.underlyingAllowance ? nm.underlyingAllowance.toString() : "",}
    compare.push(c)
    c = {name: "WalletBalance", oldData: m && m.walletBalance ? m.walletBalance.toString() : "", newData: nm && nm.walletBalance ? nm.walletBalance.toString() : "",}
    compare.push(c)
    c = {name: "SupplyBalanceInTokenUnit", oldData: m && m.supplyBalanceInTokenUnit ? m.supplyBalanceInTokenUnit.toString() : "", newData: nm && nm.supplyBalanceInTokenUnit ? nm.supplyBalanceInTokenUnit.toString() : "",}
    compare.push(c)
    c = {name: "SupplyBalance", oldData: m && m.supplyBalance ? m.supplyBalance.toString() : "", newData: nm && nm.supplyBalance ? nm.supplyBalance.toString() : "",}
    compare.push(c)
    c = {name: "MarketTotalSupply", oldData: m && m.marketTotalSupply ? m.marketTotalSupply.toString() : "", newData: nm && nm.marketTotalSupply ? nm.marketTotalSupply.toString() : "",}
    compare.push(c)
    c = {name: "BorrowBalanceInTokenUnit", oldData: m && m.borrowBalanceInTokenUnit ? m.borrowBalanceInTokenUnit.toString() : "", newData: nm && nm.borrowBalanceInTokenUnit ? nm.borrowBalanceInTokenUnit.toString() : "",}
    compare.push(c)
    c = {name: "BorrowBalance", oldData: m && m.borrowBalance ? m.borrowBalance.toString() : "", newData: nm && nm.borrowBalance ? nm.borrowBalance.toString() : "",}
    compare.push(c)
    c = {name: "MarketTotalBorrowInTokenUnit", oldData: m && m.marketTotalBorrowInTokenUnit ? m.marketTotalBorrowInTokenUnit.toString() : "", newData: nm && nm.marketTotalBorrowInTokenUnit ? nm.marketTotalBorrowInTokenUnit.toString() : "",}
    compare.push(c)
    c = {name: "MarketTotalBorrow", oldData: m && m.marketTotalBorrow ? m.marketTotalBorrow.toString() : "", newData: nm && nm.marketTotalBorrow ? nm.marketTotalBorrow.toString() : "",}
    compare.push(c)
    c = {name: "IsEnterMarket", oldData: m && m.isEnterMarket ? m.isEnterMarket.toString() : "", newData: nm && nm.isEnterMarket ? nm.isEnterMarket.toString() : "",}
    compare.push(c)
    c = {name: "UnderlyingAmount", oldData: m && m.underlyingAmount ? m.underlyingAmount.toString() : "", newData: nm && nm.underlyingAmount ? nm.underlyingAmount.toString() : "",}
    compare.push(c)
    c = {name: "UnderlyingPrice", oldData: m && m.underlyingPrice ? m.underlyingPrice.toString() : "", newData: nm && nm.underlyingPrice ? nm.underlyingPrice.toString() : "",}
    compare.push(c)
    c = {name: "Liquidity", oldData: m && m.liquidity ? m.liquidity.toString() : "", newData: nm && nm.liquidity ? nm.liquidity.toString() : "",}
    compare.push(c)
    c = {name: "CollateralFactor", oldData: m && m.collateralFactor ? m.collateralFactor.toString() : "", newData: nm && nm.collateralFactor ? nm.collateralFactor.toString() : "",}
    compare.push(c)
    c = {name: "HndSpeed", oldData: m && m.hndSpeed ? m.hndSpeed.toString() : "", newData: nm && nm.hndSpeed ? nm.hndSpeed.toString() : "",}
    compare.push(c)
    c = {name: "Decimals", oldData: m && m.decimals ? m.decimals.toString() : "", newData: nm && nm.decimals ? nm.decimals.toString() : "",}
    compare.push(c)
    c = {name: "IsNativeToken", oldData: m && m.isNativeToken ? m.isNativeToken.toString() : "", newData: nm && nm.isNativeToken ? nm.isNativeToken.toString() : "",}
    compare.push(c)

    console.log("\n-------------------------------------------------------------------------------------------\n")
    console.log("\n---------------------------------------Compare---------------------------------------------\n")
    console.table(compare)

    console.log("\n-------------------------------------------------------------------------------------------\n")
  }
