import { Call, Contract } from "ethcall"
import { COMPTROLLER_ABI, CTOKEN_ABI } from "../../abi"
import { Comptroller2 } from "../../Classes/comptrollerClass"
import { CTokenInfo } from "../../Classes/cTokenClass"
import { Network } from "../../networks"

export const getTokensCalls = async(allMarkets:string[], userAddress: string, comptrollerData: Comptroller2, network: Network, marketsData: CTokenInfo[] | null) : Promise<void> => {
    const ethcallComptroller = new Contract(network.UNITROLLER_ADDRESS, COMPTROLLER_ABI)
    const calls = [ethcallComptroller.getAssetsIn(userAddress)]
    
    const markets = allMarkets.filter((a) => {
      if (a.toLowerCase() === "0xc98182014c90baa26a21e991bfec95f72bd89aed")
         return false
      return true
    })
  
    const nativeToken = markets.find(a => a.toLowerCase() === network.token.toLowerCase())
    if (nativeToken){
      const cToken = new Contract(nativeToken, CTOKEN_ABI)
      calls.push([comptrollerData.ethcallComptroller.markets(nativeToken), comptrollerData.ethcallComptroller.compSpeeds(nativeToken), 
        comptrollerData.ethcallComptroller.compSupplyState(nativeToken), comptrollerData.ethcallComptroller.compSupplierIndex(nativeToken, userAddress), cToken.getAccountSnapshot(userAddress), 
        cToken.totalSupply(), cToken.exchangeRateStored(), cToken.totalBorrows(), cToken.supplyRatePerBlock(), cToken.borrowRatePerBlock(), cToken.getCash(), cToken.balanceOf(userAddress), comptrollerData.oracle.getUnderlyingPrice(nativeToken)])
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
        underlyingCalls.push(cToken.underLying())
      })
      const result = await comptrollerData.ethcallProvider.all(underlyingCalls)
      underlyingAddresses = result
    }
    else{
      marketsData.filter(x=>{
        if(x.isNativeToken) return false
         return true
      }).map(x=> {
        if (x.underlyingAddress) underlyingAddresses.push(x.underlyingAddress)
      })
    }

    nativeToken
  
    // notNativeMarkets.map((m, index) => {
  
    // })
    
    //     }).map(async (a) => {
    //       const isNativeToken = a.toLowerCase() ===  network.token
    
    //   //const ctokenInfo = await getCTokenInfo.current(a, isNativeToken)
    //   if(provider.current && network.current && userAddress.current && comptrollerDataRef.current)
    //     return await getCtokenInfo(a, isNativeToken, provider.current, userAddress.current, comptrollerDataRef.current, network.current, hndPriceRef.current)
    
    //   return null
    // }))
  }
  