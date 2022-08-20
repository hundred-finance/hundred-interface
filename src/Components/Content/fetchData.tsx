import { Call, Contract } from "ethcall"
import { ethers } from "ethers"
import {
    BACKSTOP_MASTERCHEF_ABI,
    BACKSTOP_MASTERCHEF_ABI_V2,
    BPRO_ABI,
    BPRO_ABI_V2,
    COMPTROLLER_ABI,
    CTOKEN_ABI,
    HUNDRED_ABI,
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
    supplyRatePerBlock: ethers.BigNumber
    borrowRatePerBlock: ethers.BigNumber,
    cash: ethers.BigNumber,
    cTokenBalanceOfUser: ethers.BigNumber,
    markets: Markets,
    compSpeeds: ethers.BigNumber
    compSupplyState: CompSupplyState,
    compSupplierIndex: ethers.BigNumber
    underlying: UnderlyingType,
    enteredMarkets: string[],
    tokenAddress: string,
    isNative: boolean,
    mintPaused: boolean,
    borrowPaused: boolean,
    backstop?: BackstopType | BackstopTypeV2
}

type CheckValidData ={
    name: string,
    oldData: string,
    newData: string
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
    gaugeAddresses: string[],
}
  
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const fetchData = async(
{ allMarkets, userAddress, comptrollerData, network, marketsData, provider, hndPrice, gaugesData }: 
{ allMarkets: string[]; userAddress: string; comptrollerData: Comptroller; network: Network; marketsData: (CTokenInfo | null)[] | null | undefined; provider: any; hndPrice: number; gaugesData: GaugeV4[] }) : Promise<MarketDataType> => {
    const ethcallComptroller = new Contract(network.unitrollerAddress, COMPTROLLER_ABI)
    const calls= [ethcallComptroller.getAssetsIn(userAddress)]

    calls.push(ethcallComptroller.compAccrued(userAddress))

    const balanceContract = new Contract(network.hundredAddress, HUNDRED_ABI)
    calls.push(balanceContract.balanceOf(userAddress))

    if(network.hundredLiquidityPoolAddress) calls.push(balanceContract.balanceOf(network.hundredLiquidityPoolAddress))

    const markets = allMarkets.filter((a) => {
      if (a.toLowerCase() === "0xc98182014c90baa26a21e991bfec95f72bd89aed")
         return false
      return true
    })
  
    const nativeToken = markets.find(a => a.toLowerCase() === network.nativeTokenMarketAddress.toLowerCase())
    
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
                 comptrollerData.oracle.getUnderlyingPrice(nativeToken),
                 comptrollerData.ethcallComptroller.mintGuardianPaused(nativeToken),
                 comptrollerData.ethcallComptroller.borrowGuardianPaused(nativeToken))
    }

  const hndClaimData = (await fetchHndRewards({gaugesData}))
  const hndRewards = hndClaimData.totalHndRewards
  const gaugeAddresses = hndClaimData.gaugeAddresses

  const votingData = (await fetchVotingData({userAddress, comptrollerData, network}))
  const vehndBalance = votingData.vehndBalance
  
  const notNativeMarkets = markets.filter((a) => {
      if (a.toLowerCase() === network.nativeTokenMarketAddress.toLowerCase()) 
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
      const result: string[] = await comptrollerData.ethcallProvider.all(underlyingCalls)

      underlyingAddresses = result
    }
    else{
      marketsData.filter(x=>{
        if(x?.isNativeToken) return false
         return true
      }).map(x=> {
        if (x?.underlying.address) underlyingAddresses.push(x.underlying.address)
      })
    }

    notNativeMarkets.map(async(a, index) => {
        const hTokenContract = new Contract(a, CTOKEN_ABI)
        const underlyingAddress = underlyingAddresses[index]
        const tokenContract = new Contract(underlyingAddress, TOKEN_ABI)
        calls.push(hTokenContract.getAccountSnapshot(userAddress),
                   hTokenContract.exchangeRateStored(),
                   hTokenContract.totalSupply(),
                   hTokenContract.totalBorrows(),
                   hTokenContract.supplyRatePerBlock(),
                   hTokenContract.borrowRatePerBlock(),
                   hTokenContract.getCash(),
                   hTokenContract.balanceOf(userAddress),
                   comptrollerData.ethcallComptroller.markets(a),
                   comptrollerData.ethcallComptroller.compSpeeds(a),
                   comptrollerData.ethcallComptroller.compSupplyState(a),
                   comptrollerData.ethcallComptroller.compSupplierIndex(a, userAddress),
                   comptrollerData.oracle.getUnderlyingPrice(a),
                   comptrollerData.ethcallComptroller.mintGuardianPaused(a),
                   comptrollerData.ethcallComptroller.borrowGuardianPaused(a),
                   tokenContract.symbol(),
                   tokenContract.name(),
                   tokenContract.decimals(),
                   tokenContract.totalSupply(),
                   tokenContract.allowance(userAddress, a),
                   tokenContract.balanceOf(userAddress),
                   tokenContract.allowance(userAddress, network.gaugeHelper ? network.gaugeHelper : a))

        if(network.backstopMasterChef && comptrollerData.backstopPools.length > 0){
          const bstop = comptrollerData.backstopPools.find(x=>x.underlyingTokens.toLowerCase() === underlyingAddress.toLowerCase())
          if(bstop){
            const backstopAbi = network.backstopMasterChef.version === MasterChefVersion.v1 ? BACKSTOP_MASTERCHEF_ABI : BACKSTOP_MASTERCHEF_ABI_V2
            const backstopMasterchef = new Contract(network.backstopMasterChef.address, backstopAbi)

            calls.push(backstopMasterchef.poolInfo(bstop.poolId), 
                   backstopMasterchef.userInfo(bstop.poolId, userAddress),
                   backstopMasterchef.pendingHundred(bstop.poolId, userAddress),
                   backstopMasterchef.hundredPerSecond(),
                   backstopMasterchef.totalAllocPoint(),
                   tokenContract.allowance(userAddress, network.backstopMasterChef.address))
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

    let compareLength = network.hundredLiquidityPoolAddress ? 4 : 3
    compareLength = nativeToken ? compareLength + 15 : compareLength
    compareLength = notNativeMarkets.length > 0 ? compareLength + notNativeMarkets.length * 22 : compareLength
    compareLength = network.backstopMasterChef && network.backstopMasterChef.version === MasterChefVersion.v1 ? compareLength + comptrollerData.backstopPools.length * 12 : compareLength
    compareLength = network.backstopMasterChef && network.backstopMasterChef.collaterals ? compareLength + (comptrollerData.backstopPools.length * 11) + (comptrollerData.backstopPools.length * network.backstopMasterChef.collaterals * 3) : compareLength

    if(res && res.length === compareLength){
        
      const enteredMarkets = res[0].map((x: string)=> {return x})
      
      compAccrued = BigNumber.from(res[1], 18)
      hndBalance = BigNumber.from(res[2], 18)

      res.splice(0, 3)

      if(network.hundredLiquidityPoolAddress){
          hundredBalace = BigNumber.from(res[0], 18)
          res.splice(0, 1)
      }

        if(nativeToken){
            const native = res.splice(0, 15)
            tokens.push(await getTokenData(native, true, network, provider, userAddress, "0x0", enteredMarkets, nativeToken, null))
        }

        let i = 0

        while (res.length){
            const backstop = comptrollerData.backstopPools.find(x=> x.underlyingTokens && underlyingAddresses[i] ? x.underlyingTokens.toLowerCase() === underlyingAddresses[i].toLowerCase() : null)
            const token = backstop ? backstop.collaterals ? res.splice(0, 33 + backstop.collaterals.length * 3) : res.splice(0, 34) : res.splice(0,22)
            tokens.push(await getTokenData(token, false, network, provider, userAddress, underlyingAddresses[i], enteredMarkets, notNativeMarkets[i], backstop ? backstop : null))
            i+=1
        }
    }

    const blockProvider : ethers.providers.Web3Provider = network.blockRpc ? new ethers.providers.JsonRpcProvider(network.blockRpc) : provider
    const blockNum = await blockProvider.getBlockNumber()

    const tokensInfo = await Promise.all(tokens.map(async(t)=>{
        const tokenInfo = await getCtokenInfo(
            t, network, hndPrice, blockNum,
            gaugesData.filter(g =>
                g.generalData.lpToken.toLowerCase() === t.tokenAddress.toLowerCase() ||
                g.generalData.lpTokenUnderlying.toLowerCase() === t.tokenAddress.toLowerCase()
            )
        )
        return tokenInfo
    }))

    return {
        hndPrice: hndPrice,
        markets: tokensInfo,
        hndBalance: hndBalance,
        hundredBalace: hundredBalace,
        comAccrued: compAccrued,
        gauges: gaugesData.filter(g => !g.generalData.backstopGauge).map(g => g.generalData),
        backStopGauges: gaugesData.filter(g => g.generalData.backstopGauge).map(g => g.generalData),
        vehndBalance: vehndBalance,
        hndRewards: hndRewards,
        gaugeAddresses: gaugeAddresses
    }
  }

 const getTokenData = async(tokenData: any[], native: boolean, network: Network, provider: ethers.providers.Web3Provider, 
                            userAddress: string, underlyingAddress: string, enteredMarkets: string[], tokenAddress: string, backstop: BackstopPool | null): Promise<Token> =>{
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
        markets: {
          isListed: tokenData[8][0],
          collateralFactorMantissa: tokenData[8][1],
          isComped: tokenData[8][2]
        },
        compSpeeds: tokenData[9],
        compSupplyState: {
          index: tokenData[10][0],
          block: tokenData[10][1]
        },
        compSupplierIndex: tokenData[11],
        mintPaused: tokenData[13],
        borrowPaused: tokenData[14],
        underlying: {
            price: tokenData[12],
            symbol: native ? network.networkParams.nativeCurrency.symbol : isMaker ? ethers.utils.parseBytes32String(tokenData[15]) : tokenData[15],
            name: native ? network.networkParams.nativeCurrency.name : isMaker ? ethers.utils.parseBytes32String(tokenData[16]) : tokenData[16],
            decimals: native ? 18 : isMaker ? tokenData[17]/1 : tokenData[17],
            totalSupply: native ? 0 : tokenData[18],
            allowance: native ? ethers.constants.MaxUint256 : tokenData[19],
            gaugeHelperAllowance: native ? ethers.constants.MaxUint256 : tokenData[21],
            walletBalance: native ? await provider.getBalance(userAddress) : tokenData[20],
            address: underlyingAddress,
            logo: native ? Logos[network.networkParams.nativeCurrency.symbol] : isMaker ? Logos["MKR"] : Logos[tokenData[15]]
        },
        isNative: native,
        enteredMarkets: enteredMarkets,
        tokenAddress: tokenAddress
    }
    if(backstop){
      const poolInfo : BackstopPoolInfo = {
        accHundredPerShare: tokenData[22][0],
        lastRewardTime: tokenData[22][1],
        allocPoint: tokenData[22][2]
      }
      if(network.backstopMasterChef?.version === MasterChefVersion.v1){
        token.backstop = {
          pool : backstop,
          poolInfo :  poolInfo,
          userBalance : tokenData[23][0],
          pendingHundred: tokenData[24],
          hundredPerSecond: tokenData[25],
          totalAllocPoint: tokenData[26],
          allowance: tokenData[27],
          totalSupply : tokenData[28],
          decimals: tokenData[29],
          symbol: tokenData[30],
          underlyingBalance : tokenData[31],
          masterchefBalance : tokenData[32],
          fetchPrice: tokenData[33],
          ethBalance: await provider.getBalance(backstop.lpTokens),
        }
      }
      else if(network.backstopMasterChef?.version === MasterChefVersion.v2){
        token.backstop = {
          pool : backstop,
          poolInfo :  poolInfo,
          userBalance : tokenData[23][0],
          pendingHundred: tokenData[24],
          hundredPerSecond: tokenData[25],
          totalAllocPoint: tokenData[26],
          allowance: tokenData[27],
          totalSupply : tokenData[28],
          decimals: tokenData[29],
          symbol: tokenData[30],
          underlyingBalance : tokenData[31],
          masterchefBalance : tokenData[32],
          collaterals:[]
        }
        if(backstop.collaterals){
          tokenData.splice(0, 33)
          for(let i=0; i< backstop.collaterals?.length; i++){
            const collateral: BackstopCollaterals = {
              fetchPrice: tokenData[0],
              balance: tokenData[1],
              decimals: tokenData[2]/1
            }
            token.backstop.collaterals.push(collateral)
            tokenData.splice(0, 3)
          }
        }
      }
    }
    return token
  }

  const getCtokenInfo = async (token: Token, network: Network, hndPrice: number, blockNum: number, gauges: GaugeV4[] | undefined) : Promise<CTokenInfo> => {
      const decimals = token.underlying.decimals

      const underlying = new Underlying(token.underlying.address, token.underlying.symbol, token.underlying.name, token.underlying.logo, token.underlying.decimals,
          token.underlying.totalSupply, token.underlying.price, token.underlying.walletBalance, token.underlying.allowance, token.underlying.gaugeHelperAllowance)


      const accountSnapshot1 = BigNumber.from(token.accountSnapshot[1].toString(), 18)
      const accountSnapshot3 = BigNumber.from(token.accountSnapshot[3].toString(), decimals)
      const supplyBalanceInTokenUnit = accountSnapshot1.mul(accountSnapshot3)

      const supplyBalance = BigNumber.parseValue((+supplyBalanceInTokenUnit.toString() * +underlying.price.toString()).noExponents())

      const borrowBalanceInTokenUnit = BigNumber.from(token.accountSnapshot[2].toString(), decimals)
      const borrowBalance = borrowBalanceInTokenUnit.mul(underlying.price)

      const exchangeRateStored = BigNumber.from(token.exchangeRate, 18)

      const marketTotalSupply = BigNumber.parseValue((+BigNumber.from(token.totalSupply, decimals).toString() * +exchangeRateStored.toString() * +underlying.price.toString()).noExponents())//cTokenTotalSupply.mul(exchangeRateStored).mul(underlyingPrice)

      const cTokenTotalBorrows = BigNumber.from(token.totalBorrows, decimals)
      const marketTotalBorrowInTokenUnit = BigNumber.from(cTokenTotalBorrows._value, decimals)
      const marketTotalBorrow = cTokenTotalBorrows?.mul(underlying.price)

      const isEnterMarket = token.enteredMarkets.includes(token.tokenAddress);

      const collateralFactor = BigNumber.from(token.markets.collateralFactorMantissa.toString(), 18)

      const supplyRatePerBlock = BigNumber.from(token.supplyRatePerBlock, decimals)

      const supplyApy = BigNumber.parseValue((Math.pow((1 + supplyRatePerBlock.toNumber() / mantissa), network.blocksPerYear) - 1).noExponents())
      const borrowRatePerBlock = BigNumber.from(token.borrowRatePerBlock, 18)

      const borrowApy = BigNumber.parseValue((Math.pow((1 + borrowRatePerBlock.toNumber() / mantissa), network.blocksPerYear) - 1).noExponents())


      const cash = BigNumber.from(token.cash, decimals)

      const liquidity = cash.mul(underlying.price)

      const cTokenTVL = +marketTotalSupply.toString()

      //const speed = await comptrollerData.comptroller.compSpeeds(address)
      const hndSpeed = BigNumber.from(token.compSpeeds, 18);

      const yearlyRewards = +hndSpeed.toString() * (network.blocksPerYear ? network.blocksPerYear : 0) * hndPrice

      const hndAPR = BigNumber.parseValue(cTokenTVL > 0 ? (yearlyRewards / cTokenTVL).noExponents() : "0")

      let veHndAPR = BigNumber.from(0)
      let veHndMaxAPR = BigNumber.from(0)

      let veHndBackstopAPR = BigNumber.from(0)
      let veHndBackstopMaxAPR = BigNumber.from(0)

      const gauge = gauges?.find(g => g.generalData.lpToken.toLowerCase() === token.tokenAddress.toLowerCase())
      const backstopGauge = gauges?.find(g => g.generalData.lpTokenUnderlying.toLowerCase() === token.tokenAddress.toLowerCase())

      if (gauge && +gauge.userWorkingStakeBalance > 0) {
          veHndAPR = BigNumber.parseValue(
              ((+gauge.generalData.weight / 1e18) *
                  (+gauge.generalData.veHndRewardRate * 365 * 24 * 3600 * hndPrice / 1e18) *
                  (+gauge.userWorkingStakeBalance / +gauge.generalData.workingTotalStake)
                  / (+gauge.userStakedTokenBalance * +exchangeRateStored * +underlying.price / (10 ** underlying.decimals))).noExponents()
          )
          veHndMaxAPR = veHndAPR
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
      }

    const totalMaxSupplyApy = BigNumber.parseValue((Math.max(+hndAPR.toString(), +veHndMaxAPR.toString(), +veHndBackstopMaxAPR.toString())+ +supplyApy.toString()).noExponents())
    const totalMinSupplyApy = BigNumber.parseValue((Math.max(+hndAPR.toString(), +veHndAPR.toString(), +veHndBackstopAPR.toString())+ +supplyApy.toString()).noExponents())
    const oldTotalSupplyApy = BigNumber.parseValue((+hndAPR.toString() + +supplyApy.toString()).noExponents())
    const newTotalSupplyApy = BigNumber.parseValue((+veHndAPR.toString() + +veHndBackstopAPR.toString() + +supplyApy.toString()).noExponents())

    let accrued  = 0
    if(+token.totalSupply > 0){
      const newSupplyIndex = +token.compSupplyState.index + (blockNum - token.compSupplyState.block) * +token.compSpeeds * 1e36 / +token.totalSupply;
    
      accrued = (+newSupplyIndex - +token.compSupplierIndex) * +token.cTokenBalanceOfUser / 1e36 
    }
    
    let backstop = null

    if(token.backstop){
      if(network.backstopMasterChef?.version === MasterChefVersion.v1){
        const tokenBackstop: BackstopType = token.backstop as BackstopType
        backstop = new Backstop(tokenBackstop.pool,
                                tokenBackstop.poolInfo,
                                BigNumber.from(tokenBackstop.userBalance, tokenBackstop.decimals),
                                BigNumber.from(tokenBackstop.pendingHundred, tokenBackstop.decimals),
                                BigNumber.from(tokenBackstop.hundredPerSecond, tokenBackstop.decimals),
                                tokenBackstop.totalAllocPoint,
                                BigNumber.from(tokenBackstop.totalSupply, tokenBackstop.decimals),
                                BigNumber.from(tokenBackstop.masterchefBalance, tokenBackstop.decimals), 
                                BigNumber.from(tokenBackstop.underlyingBalance, decimals), 
                                tokenBackstop.decimals,
                                tokenBackstop.symbol, 
                                BigNumber.from(tokenBackstop.allowance, decimals),
                                BigNumber.from(tokenBackstop.ethBalance, tokenBackstop.decimals),
                                BigNumber.from(tokenBackstop.fetchPrice, decimals),
                                underlying.price, hndPrice)
      }
      else if(network.backstopMasterChef?.version === MasterChefVersion.v2){
        const tokenBackstop: BackstopTypeV2 = token.backstop as BackstopTypeV2
        backstop = new BackstopV2(tokenBackstop, underlying.decimals, underlying.price, hndPrice)
      }
    }
    
    return new CTokenInfo(
      token.tokenAddress,
      underlying,
      exchangeRateStored,
      supplyApy,
      borrowApy,
      supplyBalanceInTokenUnit,
      supplyBalance,
      marketTotalSupply,
      borrowBalanceInTokenUnit,
      borrowBalance,
      marketTotalBorrowInTokenUnit,
      marketTotalBorrow,
      isEnterMarket,
      cash,
      liquidity,
      collateralFactor,
      hndSpeed,
      token.isNative,
      hndAPR,
      veHndAPR,
      veHndMaxAPR,
      veHndBackstopAPR,
      veHndBackstopMaxAPR,
      borrowRatePerBlock,
      totalMaxSupplyApy,
      totalMinSupplyApy,
      oldTotalSupplyApy,
      newTotalSupplyApy,
      accrued,
      token.mintPaused,
      token.borrowPaused,
      backstop
    )
  }

  export const compareData = (oldMarkets: (CTokenInfo | null)[], newMarkets: CTokenInfo[]) : void =>{

    const compare: CheckValidData[] = []
    const m = oldMarkets.find(n => n?.underlying.symbol === "USDC")
    const nm = newMarkets.find(n => n.underlying.symbol === "USDC")

    
    
    let c: CheckValidData = {name: "Address", oldData: m ? m.pTokenAddress : "", newData: nm ? nm.pTokenAddress : ""}
    compare.push(c)
    c = {name: "UnderlyingAddress", oldData: m && m.underlying.address? m.underlying.address : "", newData: nm && nm.underlying.address? nm.underlying.address : "",}
    compare.push(c)
    c = {name: "Symbol", oldData: m && m.underlying.symbol? m.underlying.symbol : "", newData: nm && nm.underlying.symbol? nm.underlying.symbol : "",}
    compare.push(c)
    c = {name: "Logo", oldData: m && m.underlying.logo? m.underlying.logo : "", newData: nm && nm.underlying.logo? nm.underlying.logo : "",}
    compare.push(c)
    c = {name: "SupplyApy", oldData: m && m.supplyApy ? m.supplyApy.toString() : "", newData: nm && nm.supplyApy ? nm.supplyApy.toString() : "",}
    compare.push(c)
    c = {name: "BorrowApy", oldData: m && m.borrowApy ? m.borrowApy.toString() : "", newData: nm && nm.borrowApy ? nm.borrowApy.toString() : "",}
    compare.push(c)
    c = {name: "UnderlyingAllowance", oldData: m && m.underlying.allowance ? m.underlying.allowance.toString() : "", newData: nm && nm.underlying.allowance ? nm.underlying.allowance.toString() : "",}
    compare.push(c)
    c = {name: "WalletBalance", oldData: m && m.underlying.walletBalance ? m.underlying.walletBalance.toString() : "", newData: nm && nm.underlying.walletBalance ? nm.underlying.walletBalance.toString() : "",}
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
    c = {name: "UnderlyingAmount", oldData: m && m.cash ? m.cash.toString() : "", newData: nm && nm.cash ? nm.cash.toString() : "",}
    compare.push(c)
    c = {name: "UnderlyingPrice", oldData: m && m.underlying.price ? m.underlying.price.toString() : "", newData: nm && nm.underlying.price ? nm.underlying.price.toString() : "",}
    compare.push(c)
    c = {name: "Liquidity", oldData: m && m.liquidity ? m.liquidity.toString() : "", newData: nm && nm.liquidity ? nm.liquidity.toString() : "",}
    compare.push(c)
    c = {name: "CollateralFactor", oldData: m && m.collateralFactor ? m.collateralFactor.toString() : "", newData: nm && nm.collateralFactor ? nm.collateralFactor.toString() : "",}
    compare.push(c)
    c = {name: "HndSpeed", oldData: m && m.hndSpeed ? m.hndSpeed.toString() : "", newData: nm && nm.hndSpeed ? nm.hndSpeed.toString() : "",}
    compare.push(c)
    c = {name: "Decimals", oldData: m && m.underlying.decimals ? m.underlying.decimals.toString() : "", newData: nm && nm.underlying.decimals ? nm.underlying.decimals.toString() : "",}
    compare.push(c)
    c = {name: "IsNativeToken", oldData: m && m.isNativeToken ? m.isNativeToken.toString() : "", newData: nm && nm.isNativeToken ? nm.isNativeToken.toString() : "",}
    compare.push(c)
  }
