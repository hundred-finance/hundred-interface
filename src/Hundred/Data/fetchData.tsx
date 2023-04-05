import { Call, Contract } from "ethcall"
import { ethers } from "ethers"
import {
    BACKSTOP_MASTERCHEF_ABI,
    BACKSTOP_MASTERCHEF_ABI_V2,
    BPRO_ABI,
    BPRO_ABI_V2,
    COMPTROLLER_ABI,
    CTOKEN_ABI,
    CTOKEN_V2_ABI,
    HUNDRED_ABI,
    ORACLE_ABI,
    TOKEN_ABI
} from "../../abi"
import { BigNumber } from "../../bigNumber"
import { Comptroller } from "../../Classes/comptrollerClass"
import { CTokenInfo, Underlying } from "../../Classes/cTokenClass"
import Logos from "../../logos"
import { MasterChefVersion, Network } from "../../networks"
import {GaugeV4, GaugeV4GeneralData} from "../../Classes/gaugeV4Class";
import { Backstop, BackstopCollaterals, BackstopPool, BackstopPoolInfo, BackstopType, BackstopTypeV2, BackstopV2 } from "../../Classes/backstopClass"
import { fetchVotingData } from "./fetchVotingData"
import { fetchHndRewards } from "./fetchHndRewardsData"
import { votingDataType } from "../../Components/Content/fetchVotingData"

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

type UnderlyingType = {
    price: ethers.BigNumber
    symbol: string,
    name: string,
    decimals: number,
    totalSupply: ethers.BigNumber
    allowance: ethers.BigNumber
    gaugeHelperAllowance: ethers.BigNumber
    walletBalance: ethers.BigNumber
    address: string,
    logo: string
}

type Token ={
    accountSnapshot: string[],
    exchangeRate: ethers.BigNumber
    totalSupply: ethers.BigNumber
    totalBorrows: ethers.BigNumber
    supplyRatePerSecond: ethers.BigNumber
    borrowRatePerSecond: ethers.BigNumber,
    cash: ethers.BigNumber,
    cTokenBalanceOfUser: ethers.BigNumber,
    markets: Markets,
    underlying: UnderlyingType,
    enteredMarkets: string[],
    tokenAddress: string,
    isNative: boolean,
    mintPaused: boolean,
    borrowPaused: boolean,
}

export type MarketDataType = {
    hndPrice: number,
    hndBalance: BigNumber,
    hundredBalace: BigNumber,
    comAccrued: BigNumber,
    markets: CTokenInfo[],
    gauges: GaugeV4GeneralData[],
    backStopGauges: GaugeV4GeneralData[],
    vehndBalance: BigNumber,
    hndRewards: BigNumber,
    tokenRewards: BigNumber,
    rewardTokenSymbol: string | undefined,
    gaugeAddresses: string[],
}
  
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const fetchGeneralData = async(
  { allMarkets, comptrollerData, network, marketsData, hndPrice, gaugesData }: 
  { allMarkets: string[]; comptrollerData: Comptroller; network: Network; marketsData: CTokenInfo[] | undefined; hndPrice: number; gaugesData?: GaugeV4[] }) : Promise<MarketDataType> => {
    //const ethcallComptroller = new Contract(network.unitrollerAddress, COMPTROLLER_ABI)
    const calls= []

    //calls.push(ethcallComptroller.compAccrued(userAddress))

    const balanceContract = new Contract(network.hundredAddress, HUNDRED_ABI)
    //calls.push(balanceContract.balanceOf(userAddress))

    if(network.hundredLiquidityPoolAddress) calls.push(balanceContract.balanceOf(network.hundredLiquidityPoolAddress))

    const markets = allMarkets.filter((a) => {
      if (a.toLowerCase() === "0xc98182014c90baa26a21e991bfec95f72bd89aed")
         return false
      return true
    })
  
    const nativeToken = markets.find(a => a.toLowerCase() === network.nativeTokenMarketAddress.toLowerCase())
    
    if (nativeToken){
      const cToken = network.isMinterV2 ? new Contract(nativeToken, CTOKEN_V2_ABI) : new Contract(nativeToken, CTOKEN_ABI)
      calls.push(//cToken.getAccountSnapshot(userAddress),
                 cToken.exchangeRateStored(),
                 cToken.totalSupply(), 
                 cToken.totalBorrows(), 
                 network.isMinterV2 ? cToken.supplyRatePerSecond() : cToken.supplyRatePerBlock(),
                 network.isMinterV2 ? cToken.borrowRatePerSecond() : cToken.borrowRatePerBlock(),
                 cToken.getCash(),
                 //cToken.balanceOf(userAddress),
                 comptrollerData.ethcallComptroller.markets(nativeToken), 
                 comptrollerData.ethcallComptroller.compSpeeds(nativeToken), 
                 comptrollerData.ethcallComptroller.compSupplyState(nativeToken), 
                 //comptrollerData.ethcallComptroller.compSupplierIndex(nativeToken, userAddress),
                 comptrollerData.oracle.getUnderlyingPrice(nativeToken),
                 comptrollerData.ethcallComptroller.mintGuardianPaused(nativeToken),
                 comptrollerData.ethcallComptroller.borrowGuardianPaused(nativeToken))
    }

  const hndClaimData = gaugesData ?  (await fetchHndRewards({gaugesData})) : null
  const hndRewards = hndClaimData ? hndClaimData.totalHndRewards : null
  const gaugeAddresses = hndClaimData ? hndClaimData.gaugeAddresses : null

  const votingData : votingDataType = {vehndBalance: BigNumber.from("0")}
  const vehndBalance = votingData.vehndBalance
  
  const notNativeMarkets = markets.filter((a) => {
      if (a.toLowerCase() === network.nativeTokenMarketAddress.toLowerCase()) 
        return false
      return true  
    })

    let underlyingAddresses:string[] = []
    if (!marketsData || markets.length !== [...marketsData].length){
      const underlyingCalls: Call[] = []
      notNativeMarkets.map(x=>{
        const cToken = new Contract(x, CTOKEN_ABI)
        underlyingCalls.push(cToken.underlying())
      })
      const result: string[] = await comptrollerData.ethcallProvider.all(underlyingCalls)

      underlyingAddresses = result
    }
    else{
      [...marketsData].filter(x=>{
        if(x?.isNativeToken) return false
         return true
      }).map(x=> {
        if (x?.underlying.address) underlyingAddresses.push(x.underlying.address)
      })
    }

    notNativeMarkets.map(async(a, index) => {
        const hTokenContract = network.isMinterV2 ? new Contract(a, CTOKEN_V2_ABI) : new Contract(a, CTOKEN_ABI)
        const underlyingAddress = underlyingAddresses[index]
        const tokenContract = new Contract(underlyingAddress, TOKEN_ABI)
        calls.push(//hTokenContract.getAccountSnapshot(userAddress),
                   hTokenContract.exchangeRateStored(),
                   hTokenContract.totalSupply(),
                   hTokenContract.totalBorrows(),
                   network.isMinterV2 ? hTokenContract.supplyRatePerSecond() : hTokenContract.supplyRatePerBlock(),
                   network.isMinterV2 ? hTokenContract.borrowRatePerSecond() : hTokenContract.borrowRatePerBlock(),
                   hTokenContract.getCash(),
                   //hTokenContract.balanceOf(userAddress),
                   comptrollerData.ethcallComptroller.markets(a),
                   comptrollerData.ethcallComptroller.compSpeeds(a),
                   comptrollerData.ethcallComptroller.compSupplyState(a),
                   //comptrollerData.ethcallComptroller.compSupplierIndex(a, userAddress),
                   comptrollerData.oracle.getUnderlyingPrice(a),
                   comptrollerData.ethcallComptroller.mintGuardianPaused(a),
                   comptrollerData.ethcallComptroller.borrowGuardianPaused(a),
                   tokenContract.symbol(),
                   tokenContract.name(),
                   tokenContract.decimals(),
                   tokenContract.totalSupply(),
                   //tokenContract.allowance(userAddress, a),
                   //tokenContract.balanceOf(userAddress),
                   //tokenContract.allowance(userAddress, network.gaugeHelper ? network.gaugeHelper : a)
                   )

        if(network.backstopMasterChef && comptrollerData.backstopPools.length > 0){
          const bstop = comptrollerData.backstopPools.find(x=>x.underlyingTokens.toLowerCase() === underlyingAddress.toLowerCase())
          if(bstop){
            const backstopAbi = network.backstopMasterChef.version === MasterChefVersion.v1 ? BACKSTOP_MASTERCHEF_ABI : BACKSTOP_MASTERCHEF_ABI_V2
            const backstopMasterchef = new Contract(network.backstopMasterChef.address, backstopAbi)

            calls.push(backstopMasterchef.poolInfo(bstop.poolId), 
                   //backstopMasterchef.userInfo(bstop.poolId, userAddress),
                   //backstopMasterchef.pendingHundred(bstop.poolId, userAddress),
                   backstopMasterchef.hundredPerSecond(),
                   backstopMasterchef.totalAllocPoint(),
                   //tokenContract.allowance(userAddress, network.backstopMasterChef.address)
                   )
            const bStopContract = new Contract(bstop.lpTokens, network.backstopMasterChef.version === MasterChefVersion.v1 ? BPRO_ABI : BPRO_ABI_V2)
            calls.push(bStopContract.totalSupply(), 
                       bStopContract.decimals(), 
                       bStopContract.symbol(),
                       tokenContract.balanceOf(bstop.lpTokens),
                       bStopContract.balanceOf(network.backstopMasterChef.address))
            if(network.backstopMasterChef.version === MasterChefVersion.v1){
                calls.push(bStopContract.fetchPrice())
            }
            else if(network.backstopMasterChef.version === MasterChefVersion.v2){
              bstop.collaterals?.forEach(x => {
                const collateralContract = new Contract(x, TOKEN_ABI)
                calls.push(bStopContract.fetchPrice(x))
                calls.push(collateralContract.balanceOf(bstop.lpTokens))
                calls.push(bStopContract.collateralDecimals(x))
              })
            }
          }
        }
    })

    const res: any[] = await comptrollerData.ethcallProvider.all(calls)
    const tokens = []
    let compAccrued = BigNumber.from("0")
    let hndBalance = BigNumber.from("0")
    let hundredBalace = BigNumber.from("0")

    let compareLength = network.hundredLiquidityPoolAddress ? 1 : 0
    compareLength = nativeToken ? compareLength + 12 : compareLength
    compareLength = notNativeMarkets.length > 0 ? compareLength + notNativeMarkets.length * 16 : compareLength
    compareLength = network.backstopMasterChef && network.backstopMasterChef.version === MasterChefVersion.v1 ? compareLength + comptrollerData.backstopPools.length * 9 : compareLength
    compareLength = network.backstopMasterChef && network.backstopMasterChef.collaterals ? compareLength + (comptrollerData.backstopPools.length * 8) + (comptrollerData.backstopPools.length * network.backstopMasterChef.collaterals * 3) : compareLength
    if(res && res.length === compareLength){
        
      const enteredMarkets = [] as any[]
      
      compAccrued = BigNumber.from("0")
      hndBalance = BigNumber.from("0")

      if(network.hundredLiquidityPoolAddress){
          hundredBalace = BigNumber.from(res[0], 18)
          res.splice(0, 1)
      }

        if(nativeToken){
            const native = res.splice(0, 12)
            tokens.push(await getTokenDataGeneral(native, true, network, "0x0", enteredMarkets, nativeToken))
        }

        let i = 0

        while (res.length){
            const backstop = comptrollerData.backstopPools.find(x=> x.underlyingTokens && underlyingAddresses[i] ? x.underlyingTokens.toLowerCase() === underlyingAddresses[i].toLowerCase() : null)
            const token = backstop ? backstop.collaterals ? res.splice(0, 24 + backstop.collaterals.length * 3) : res.splice(0, 25) : res.splice(0,16)
            tokens.push(await getTokenDataGeneral(token, false, network, underlyingAddresses[i], enteredMarkets, notNativeMarkets[i]))
            i+=1
        }
    }

    // const blockProvider : ethers.providers.Web3Provider = network.blockRpc ? new ethers.providers.JsonRpcProvider(network.blockRpc) : provider
    // const blockNum = await blockProvider.getBlockNumber()

    const tokensInfo = await Promise.all(tokens.map(async(t)=>{
        const tokenInfo = await getCtokenInfo(
            t, hndPrice, 0,
            gaugesData ? gaugesData.filter(g =>
                g.generalData.lpToken.toLowerCase() === t.tokenAddress.toLowerCase() ||
                g.generalData.lpTokenUnderlying.toLowerCase() === t.tokenAddress.toLowerCase()
            ) : []
        )
        return tokenInfo
    }))
    return {
        hndPrice: hndPrice,
        markets: tokensInfo,
        hndBalance: hndBalance,
        hundredBalace: hundredBalace,
        comAccrued: compAccrued,
        gauges: gaugesData ? gaugesData.filter(g => !g.generalData.backstopGauge).map(g => g.generalData) : [],
        backStopGauges: gaugesData ? gaugesData.filter(g => g.generalData.backstopGauge).map(g => g.generalData) : [],
        vehndBalance: vehndBalance,
        hndRewards: hndRewards ? hndRewards : BigNumber.from(0),
        tokenRewards: BigNumber.from(0),
        rewardTokenSymbol: undefined,
        gaugeAddresses: gaugeAddresses ? gaugeAddresses : []
    }
}

export const fetchData = async(
{ allMarkets, userAddress, comptrollerData, network, marketsData, provider, hndPrice, gaugesData }: 
{ allMarkets: string[]; userAddress: string; comptrollerData: Comptroller; network: Network; marketsData: CTokenInfo[] | undefined; provider: any; hndPrice: number; gaugesData?: GaugeV4[] }) : Promise<MarketDataType> => {
    const ethcallComptroller = new Contract(network.unitrollerAddress, COMPTROLLER_ABI)
    const calls= [ethcallComptroller.getAssetsIn(userAddress)]


    //calls.push(ethcallComptroller.compAccrued(userAddress))

    //const balanceContract = new Contract(network.hundredAddress, HUNDRED_ABI)
    //calls.push(balanceContract.balanceOf(userAddress))

    //if(network.hundredLiquidityPoolAddress) calls.push(balanceContract.balanceOf(network.hundredLiquidityPoolAddress))

    const markets = allMarkets.filter((a) => {
      if (a.toLowerCase() === "0xc98182014c90baa26a21e991bfec95f72bd89aed")
         return false
      return true
    })
  
    const nativeToken = markets.find(a => a.toLowerCase() === network.nativeTokenMarketAddress.toLowerCase())
    if (nativeToken){
      const cToken = network.isMinterV2 ? new Contract(nativeToken, CTOKEN_V2_ABI) : new Contract(nativeToken, CTOKEN_ABI)
      calls.push(cToken.getAccountSnapshot(userAddress),
                 cToken.exchangeRateStored(),
                 cToken.totalSupply(), 
                 cToken.totalBorrows(),
                 network.isMinterV2 ? cToken.supplyRatePerSecond() : cToken.supplyRatePerBlock(),
                 network.isMinterV2 ? cToken.borrowRatePerSecond() : cToken.borrowRatePerBlock(),
                 cToken.getCash(),
                 cToken.balanceOf(userAddress),
                 comptrollerData.ethcallComptroller.markets(nativeToken), 
                 comptrollerData.oracle.getUnderlyingPrice(nativeToken),
                 comptrollerData.ethcallComptroller.mintGuardianPaused(nativeToken),
                 comptrollerData.ethcallComptroller.borrowGuardianPaused(nativeToken))
    }

  const hndClaimData = gaugesData ? (await fetchHndRewards({gaugesData})) : null
  const hndRewards = hndClaimData ? hndClaimData.totalHndRewards : null
  const tokenRewards = hndClaimData ? hndClaimData.secondaryTokenRewards : null
  const rewardTokenSymbol = hndClaimData ? hndClaimData.secondaryTokenSymbol : null
  const gaugeAddresses = hndClaimData ? hndClaimData.gaugeAddresses : null

  const votingData = (await fetchVotingData({userAddress, comptrollerData, network}))
  const vehndBalance = votingData.vehndBalance
  
  const notNativeMarkets = markets.filter((a) => {
      if (a.toLowerCase() === network.nativeTokenMarketAddress.toLowerCase()) 
        return false
      return true  
    })

    let underlyingAddresses:string[] = []
    if (!marketsData || markets.length !== [...marketsData].length){
      const underlyingCalls: Call[] = []
      notNativeMarkets.map(x=>{
        const cToken = new Contract(x, CTOKEN_ABI)
        underlyingCalls.push(cToken.underlying())
      })
      const result: string[] = await comptrollerData.ethcallProvider.all(underlyingCalls)
      console.log("Underlying", result)
      underlyingAddresses = result
    }
    else{
      [...marketsData].filter(x=>{
        if(x?.isNativeToken) return false
         return true
      }).map(x=> {
        if (x?.underlying.address) underlyingAddresses.push(x.underlying.address)
      })
    }

    notNativeMarkets.map(async(a, index) => {
    const hTokenContract = network.isMinterV2 ? new Contract(a, CTOKEN_V2_ABI) : new Contract(a, CTOKEN_ABI)
    const underlyingAddress = underlyingAddresses[index]
    const tokenContract = new Contract(underlyingAddress, TOKEN_ABI)

    calls.push(hTokenContract.getAccountSnapshot(userAddress),
      hTokenContract.exchangeRateStored(),
      hTokenContract.totalSupply(),
      hTokenContract.totalBorrows(),
      network.isMinterV2 ? hTokenContract.supplyRatePerSecond() : hTokenContract.supplyRatePerBlock(),
      network.isMinterV2 ? hTokenContract.borrowRatePerSecond() : hTokenContract.borrowRatePerBlock(),
      hTokenContract.getCash(),
      hTokenContract.balanceOf(userAddress),
      comptrollerData.ethcallComptroller.markets(a),
      comptrollerData.oracle.getUnderlyingPrice(a),
      comptrollerData.ethcallComptroller.mintGuardianPaused(a),
      comptrollerData.ethcallComptroller.borrowGuardianPaused(a),
      tokenContract.symbol(),
      tokenContract.name(),
      tokenContract.decimals(),
      hTokenContract.totalSupply(),
      tokenContract.allowance(userAddress, a),
      tokenContract.balanceOf(userAddress),
      tokenContract.allowance(userAddress, network.gaugeHelper ? network.gaugeHelper : a))

  })
    const res: any[] = await comptrollerData.ethcallProvider.all(calls)
    const tokens: Token[] = []
    //let compAccrued = BigNumber.from("0")
    //let hndBalance = BigNumber.from("0")
    //let hundredBalace = BigNumber.from("0")

    let compareLength = 1
    compareLength = nativeToken ? compareLength + 12 : compareLength
    compareLength = notNativeMarkets.length > 0 ? compareLength + notNativeMarkets.length * 19 : compareLength
    
    if(res && res.length === compareLength){
        
      const enteredMarkets = res[0].map((x: string)=> {return x})

      res.splice(0, 1)

        if(nativeToken){
            const native = res.splice(0, 12)
            tokens.push(await getTokenData(native, true, network, provider, userAddress, "0x0", enteredMarkets, nativeToken))
        }

        let i = 0

        while (res.length){
            
            const token = res.splice(0, 19)
            tokens.push(await getTokenData(token, false, network, provider, userAddress, underlyingAddresses[i], enteredMarkets, notNativeMarkets[i]))
            i+=1
        }
    }

    const tokensInfo = await Promise.all(tokens.map(async(t)=>{
      let rewardTokenPrice = 0
        const gauges =gaugesData ? gaugesData.filter(g =>
            g.generalData.lpToken.toLowerCase() === t.tokenAddress.toLowerCase() ||
            g.generalData.lpTokenUnderlying.toLowerCase() === t.tokenAddress.toLowerCase()
        ) : []
        for (let i = 0; i < gauges.length; i++) {
            const gauge = gauges[i];
            if (gauge && gauge.reward_token != '0x0000000000000000000000000000000000000000') {
                const rewardTokenMarket = tokens.find(t => t.underlying.address.toLowerCase() === gauge.reward_token.toLowerCase())
                if (rewardTokenMarket) {
                    rewardTokenPrice = +rewardTokenMarket.underlying.price
                }
            }
        }

        return await getCtokenInfo(t, hndPrice, rewardTokenPrice, gauges)
    }))
    return {
        hndPrice: hndPrice,
        markets: tokensInfo,
        hndBalance: BigNumber.from(0),
        hundredBalace: BigNumber.from(0),
        comAccrued: BigNumber.from(0),
        gauges: gaugesData ? gaugesData.filter(g => !g.generalData.backstopGauge).map(g => g.generalData) : [],
        backStopGauges: gaugesData ? gaugesData.filter(g => g.generalData.backstopGauge).map(g => g.generalData) : [],
        vehndBalance: vehndBalance,
        hndRewards: hndRewards ? hndRewards : BigNumber.from(0),
        tokenRewards: tokenRewards ? tokenRewards : BigNumber.from(0),
        rewardTokenSymbol: rewardTokenSymbol ? rewardTokenSymbol : "",
        gaugeAddresses: gaugeAddresses ? gaugeAddresses : []
    }
  }

 const getTokenData = async(tokenData: any[], native: boolean, network: Network, provider: ethers.providers.Web3Provider, 
                            userAddress: string, underlyingAddress: string, enteredMarkets: string[], tokenAddress: string): Promise<Token> =>{
    const isMaker = underlyingAddress.toLowerCase() === "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2"

    const [accountSnapshot,
          exchangeRate,
          totalSupply,
          totalBorrows,
          supplyRatePerSecond,
          borrowRatePerSecond,
          cash,
          cTokenBalanceOfUser,
          [
            isListed,
            collateralFactorMantissa,
            isComped
          ],
          price,
          mintPaused,
          borrowPaused,
          ...rest] = tokenData

     const [symbol, name, decimals, underlyingTotalSupply, allowance, walletBalance, gaugeHelperAllowance, ...backstopData] = rest

    
    const token: Token = {
        accountSnapshot,
        exchangeRate,
        totalSupply,
        totalBorrows,
        supplyRatePerSecond: network.isMinterV2 ? supplyRatePerSecond : Math.floor(supplyRatePerSecond * (network.blocksPerYear || 0) / (365 * 24* 3600)),
        borrowRatePerSecond: network.isMinterV2 ? borrowRatePerSecond : Math.floor(borrowRatePerSecond * (network.blocksPerYear || 0) / (365 * 24* 3600)),
        cash,
        cTokenBalanceOfUser,
        markets: {
          isListed,
          collateralFactorMantissa,
          isComped
        },
        mintPaused,
        borrowPaused,
        underlying: {
            price,
            symbol: native ? network.networkParams.nativeCurrency.symbol : isMaker ? ethers.utils.parseBytes32String(symbol) : symbol,
            name: native ? network.networkParams.nativeCurrency.name : isMaker ? ethers.utils.parseBytes32String(name) : name,
            decimals: native ? 18 : isMaker ? decimals/1 : decimals,
            totalSupply: native ? 0 : underlyingTotalSupply,
            allowance: native ? ethers.constants.MaxUint256 : allowance,
            gaugeHelperAllowance: native ? ethers.constants.MaxUint256 : gaugeHelperAllowance,
            walletBalance: native ? await provider.getBalance(userAddress) : walletBalance,
            address: underlyingAddress,
            logo: native ? Logos[network.networkParams.nativeCurrency.symbol] : isMaker ? Logos["MKR"] : Logos[symbol]
        },
        isNative: native,
        enteredMarkets: enteredMarkets,
        tokenAddress: tokenAddress
    }

    return token
  }

  const getTokenDataGeneral = async(tokenData: any[], native: boolean, network: Network, 
    underlyingAddress: string, enteredMarkets: string[], tokenAddress: string): Promise<Token> =>{
const isMaker = underlyingAddress.toLowerCase() === "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2" ? true : false

const [
      exchangeRate,
      totalSupply,
      totalBorrows,
      supplyRatePerSecond,
      borrowRatePerSecond,
      cash,
      [
        isListed,
        collateralFactorMantissa,
        isComped
      ],
      price,
      mintPaused,
      borrowPaused,
      ...rest] = tokenData

const [symbol, name, decimals, underlyingTotalSupply] = rest


const token: Token = {
      accountSnapshot: ["0", "0", "0", "0"],
      exchangeRate,
      totalSupply,
      totalBorrows,
      supplyRatePerSecond: network.isMinterV2 ? supplyRatePerSecond : Math.floor(supplyRatePerSecond * (network.blocksPerYear || 0) / (365 * 24* 3600)),
      borrowRatePerSecond: network.isMinterV2 ? borrowRatePerSecond : Math.floor(borrowRatePerSecond * (network.blocksPerYear || 0) / (365 * 24* 3600)),
      cash,
      cTokenBalanceOfUser: ethers.BigNumber.from("0"),
      markets: {
        isListed,
        collateralFactorMantissa,
        isComped
      },
      mintPaused,
      borrowPaused,
      underlying: {
        price,
        symbol: native ? network.networkParams.nativeCurrency.symbol : isMaker ? ethers.utils.parseBytes32String(symbol) : symbol,
        name: native ? network.networkParams.nativeCurrency.name : isMaker ? ethers.utils.parseBytes32String(name) : name,
        decimals: native ? 18 : isMaker ? decimals/1 : decimals,
        totalSupply: native ? 0 : underlyingTotalSupply,
        allowance: native ? ethers.constants.MaxUint256 : ethers.BigNumber.from("0"),
        gaugeHelperAllowance: native ? ethers.constants.MaxUint256 : ethers.BigNumber.from("0"),
        walletBalance: ethers.BigNumber.from("0"),
        address: underlyingAddress,
        logo: native ? Logos[network.networkParams.nativeCurrency.symbol] : isMaker ? Logos["MKR"] : Logos[symbol]
      },
      isNative: native,
      enteredMarkets: enteredMarkets,
      tokenAddress: tokenAddress
}

  return token
}

  const getCtokenInfo = async (token: Token, hndPrice: number, rewardTokenPrice: number, gauges: GaugeV4[] | undefined) : Promise<CTokenInfo> => {
      const decimals = token.underlying.decimals

      const underlying = new Underlying(token.underlying.address, token.underlying.symbol, token.underlying.name, token.underlying.logo, token.underlying.decimals,
          token.underlying.totalSupply, token.underlying.price, token.underlying.walletBalance, token.underlying.allowance, token.underlying.gaugeHelperAllowance)

      const accountSnapshot1 = BigNumber.from(token.accountSnapshot[1].toString(), 18)
      const accountSnapshot3 = BigNumber.from(token.accountSnapshot[2].toString(), decimals)
      const supplyBalanceInTokenUnit = accountSnapshot1.mul(accountSnapshot3)

      const supplyBalance = BigNumber.parseValue((+supplyBalanceInTokenUnit.toString() * +underlying.price.toString()).noExponents())

      const borrowBalanceInTokenUnit = BigNumber.from(token.accountSnapshot[1].toString(), decimals)
      const borrowBalance = borrowBalanceInTokenUnit.mul(underlying.price)

      const exchangeRateStored = BigNumber.from(token.exchangeRate, 18)

      console.log(token.underlying.symbol, +BigNumber.from(token.totalSupply, 18).toString(), +exchangeRateStored.toString(), +underlying.price.toString())

      const marketTotalSupply = BigNumber.parseValue((+BigNumber.from(token.totalSupply, 18).toString() * +exchangeRateStored.toString() * +underlying.price.toString()).noExponents())//cTokenTotalSupply.mul(exchangeRateStored).mul(underlyingPrice)
      
      const cTokenTotalBorrows = BigNumber.from(token.totalBorrows, 18)
      const marketTotalBorrowInTokenUnit = BigNumber.from(cTokenTotalBorrows._value, 18)
      const marketTotalBorrow = cTokenTotalBorrows?.mul(underlying.price)

      console.log(token.underlying.symbol, cTokenTotalBorrows.toString(), marketTotalBorrowInTokenUnit.toString(), underlying.price.toString())

      const isEnterMarket = token.enteredMarkets.includes(token.tokenAddress);

      const collateralFactor = BigNumber.from(token.markets.collateralFactorMantissa.toString(), 18)

      const supplyApy = BigNumber.parseValue((Math.pow((1 + +token.supplyRatePerSecond / mantissa), 365 * 24 * 3600) - 1).noExponents())
      const borrowRatePerBlock = BigNumber.from(token.borrowRatePerSecond, 18)

      const borrowApy = BigNumber.parseValue((Math.pow((1 + +token.borrowRatePerSecond / mantissa), 365 * 24 * 3600) - 1).noExponents())

      const cash = BigNumber.from(token.cash, 18)

      const liquidity = cash.mul(underlying.price)

      let veHndAPR = BigNumber.from(0)
      let veHndMaxAPR = BigNumber.from(0)

      let veRewardTokenAPR = BigNumber.from(0)
      let veRewardTokenMaxAPR = BigNumber.from(0)

      let veHndBackstopAPR = BigNumber.from(0)
      let veHndBackstopMaxAPR = BigNumber.from(0)

      let veRewardTokenBackstopAPR = BigNumber.from(0)
      let veRewardTokenBackstopMaxAPR = BigNumber.from(0)

      const gauge = gauges?.find(g => g.generalData.lpToken.toLowerCase() === token.tokenAddress.toLowerCase())
      const backstopGauge = gauges?.find(g => g.generalData.lpTokenUnderlying.toLowerCase() === token.tokenAddress.toLowerCase())

      let stakeBalance = BigNumber.from(0);
      if (gauge) {
          stakeBalance = BigNumber.parseValue((
              +gauge.userStakedTokenBalance
              * +exchangeRateStored
              / (10 ** underlying.decimals)
          ).noExponents());
      }

      if (gauge && +gauge.userWorkingStakeBalance > 0) {

          veHndAPR = BigNumber.parseValue(
              ((+gauge.generalData.weight / 1e18) *
                  (+gauge.generalData.veHndRewardRate * 365 * 24 * 3600 * hndPrice / 1e18) *
                  (+gauge.userWorkingStakeBalance / +gauge.generalData.workingTotalStake)
                  / (+gauge.userStakedTokenBalance * +exchangeRateStored * +underlying.price / (10 ** underlying.decimals))).noExponents()
          )
          veHndMaxAPR = veHndAPR

          veRewardTokenAPR = BigNumber.parseValue(
              ((+gauge.generalData.weight / 1e18) *
                  (+gauge.token_yearly_rewards * rewardTokenPrice / 1e18) *
                  (+gauge.userWorkingStakeBalance / +gauge.generalData.workingTotalStake)
                  / (+gauge.userStakedTokenBalance * +exchangeRateStored * +underlying.price / (10 ** underlying.decimals))).noExponents()
          )
          veRewardTokenMaxAPR = veRewardTokenAPR
      } else if (gauge && +gauge.generalData.totalStake > 0) {

          const referenceStake = 10000 * (10 ** underlying.decimals) / +exchangeRateStored

          veHndAPR = BigNumber.parseValue(
              ((+gauge.generalData.weight / 1e18) *
                  (referenceStake * 0.4 / (+gauge.generalData.workingTotalStake + referenceStake * 0.4)) *
                  (+gauge.generalData.veHndRewardRate * 365 * 24 * 3600 * hndPrice / 1e18)
                  / 10000 ).noExponents()
          )

          veHndMaxAPR = BigNumber.parseValue(
              ((+gauge.generalData.weight / 1e18) *
                  (referenceStake / (+gauge.generalData.workingTotalStake + referenceStake)) *
                  (+gauge.generalData.veHndRewardRate * 365 * 24 * 3600 * hndPrice / 1e18)
                  / 10000).noExponents()
          )

          veRewardTokenAPR = BigNumber.parseValue(
              ((+gauge.generalData.weight / 1e18) *
                  (referenceStake * 0.4 / (+gauge.generalData.workingTotalStake + referenceStake * 0.4)) *
                  (+gauge.token_yearly_rewards * rewardTokenPrice / 1e18)
                  / 10000 ).noExponents()
          )

          veRewardTokenMaxAPR = BigNumber.parseValue(
              ((+gauge.generalData.weight / 1e18) *
                  (referenceStake / (+gauge.generalData.workingTotalStake + referenceStake)) *
                  (+gauge.token_yearly_rewards * rewardTokenPrice / 1e18)
                  / 10000).noExponents()
          )
      }

      if (backstopGauge && +backstopGauge.userWorkingStakeBalance > 0) {
          const totalBalance = BigNumber.from(backstopGauge.generalData.backstopTotalBalance, 8)
          const totalSupply = BigNumber.from(backstopGauge.generalData.backstopTotalSupply, 18)

          veHndBackstopAPR = BigNumber.parseValue(
              ((+backstopGauge.generalData.weight / 1e18) *
                  (+backstopGauge.generalData.veHndRewardRate * 365 * 24 * 3600 * hndPrice / 1e18) *
                  (+backstopGauge.userWorkingStakeBalance / +backstopGauge.generalData.workingTotalStake)
                  / (+backstopGauge.userStakedTokenBalance * +exchangeRateStored * +totalBalance * +underlying.price / ((10 ** underlying.decimals) * +totalSupply * 1e10))).noExponents()
          )
          veHndBackstopMaxAPR = veHndBackstopAPR

          veRewardTokenBackstopAPR = BigNumber.parseValue(
              ((+backstopGauge.generalData.weight / 1e18) *
                  (+backstopGauge.token_yearly_rewards * rewardTokenPrice / 1e18) *
                  (+backstopGauge.userWorkingStakeBalance / +backstopGauge.generalData.workingTotalStake)
                  / (+backstopGauge.userStakedTokenBalance * +exchangeRateStored * +totalBalance * +underlying.price / ((10 ** underlying.decimals) * +totalSupply * 1e10))).noExponents()
          )
          veRewardTokenBackstopMaxAPR = veRewardTokenBackstopAPR

      } else if (backstopGauge && +backstopGauge.generalData.totalStake > 0) {

          const referenceStake = 10000 * (10 ** underlying.decimals)
          const totalBalance = BigNumber.from(backstopGauge.generalData.backstopTotalBalance, 8)
          const totalSupply = BigNumber.from(backstopGauge.generalData.backstopTotalSupply, 18)

          const workingStake = +backstopGauge.generalData.workingTotalStake * +exchangeRateStored * +totalBalance / (+totalSupply * 1e10)

          veHndBackstopAPR = BigNumber.parseValue(
              ((+backstopGauge.generalData.weight / 1e18) *
                  (referenceStake * 0.4 / (workingStake  + referenceStake * 0.4)) *
                  (+backstopGauge.generalData.veHndRewardRate * 365 * 24 * 3600 * hndPrice / 1e18)
                  / 10000 ).noExponents()
          )

          veHndBackstopMaxAPR = BigNumber.parseValue(
              ((+backstopGauge.generalData.weight / 1e18) *
                  (referenceStake / (workingStake + referenceStake)) *
                  (+backstopGauge.generalData.veHndRewardRate * 365 * 24 * 3600 * hndPrice / 1e18)
                  / 10000).noExponents()
          )

          veRewardTokenBackstopAPR = BigNumber.parseValue(
              ((+backstopGauge.generalData.weight / 1e18) *
                  (referenceStake * 0.4 / (workingStake  + referenceStake * 0.4)) *
                  (+backstopGauge.token_yearly_rewards * rewardTokenPrice / 1e18)
                  / 10000 ).noExponents()
          )

          veRewardTokenBackstopMaxAPR = BigNumber.parseValue(
              ((+backstopGauge.generalData.weight / 1e18) *
                  (referenceStake / (workingStake + referenceStake)) *
                  (+backstopGauge.token_yearly_rewards * rewardTokenPrice / 1e18)
                  / 10000).noExponents()
          )
      }

    const totalMaxSupplyApy = BigNumber.parseValue(
        (
            Math.max(+veHndMaxAPR.toString(), +veHndBackstopMaxAPR.toString())
            + +supplyApy.toString()
            + Math.max(+veRewardTokenBackstopMaxAPR.toString(), +veRewardTokenMaxAPR.toString())
        ).noExponents()
    )
    const totalMinSupplyApy = BigNumber.parseValue(
        (
            Math.max(+veHndAPR.toString(), +veHndBackstopAPR.toString())
            + +supplyApy.toString()
            + Math.max(+veRewardTokenBackstopAPR.toString(), +veRewardTokenAPR.toString())
        ).noExponents()
    )
    const oldTotalSupplyApy = BigNumber.parseValue((+supplyApy.toString()).noExponents())
    const newTotalSupplyApy = BigNumber.parseValue((+veHndAPR.toString() + +veHndBackstopAPR.toString() + +supplyApy.toString() + +veRewardTokenBackstopAPR.toString() + +veRewardTokenAPR.toString()).noExponents())

    let accrued  = 0
    if(+token.totalSupply > 0){
      //const newSupplyIndex = +token.compSupplyState.index + (blockNum - token.compSupplyState.block) * +token.compSpeeds * 1e36 / +token.totalSupply;
    
      accrued = 0
    }

    return new CTokenInfo(
      token.tokenAddress,
      underlying,
      exchangeRateStored,
      supplyApy,
      borrowApy,
      supplyBalanceInTokenUnit,
      supplyBalance,
      stakeBalance,
      marketTotalSupply,
      borrowBalanceInTokenUnit,
      borrowBalance,
      marketTotalBorrowInTokenUnit,
      marketTotalBorrow,
      isEnterMarket,
      cash,
      liquidity,
      collateralFactor,
      token.isNative,
      veHndAPR,
      veHndMaxAPR,
      veRewardTokenAPR,
      veRewardTokenMaxAPR,
      veHndBackstopAPR,
      veHndBackstopMaxAPR,
      veRewardTokenBackstopAPR,
      veRewardTokenBackstopMaxAPR,
      borrowRatePerBlock,
      totalMaxSupplyApy,
      totalMinSupplyApy,
      oldTotalSupplyApy,
      newTotalSupplyApy,
      accrued,
      token.mintPaused,
      token.borrowPaused,
    )
  }
