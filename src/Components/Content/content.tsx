import { ethers} from "ethers"
import { BigNumber } from "../../bigNumber"
import React, { useEffect,  useRef, useState } from "react"
import {CTOKEN_ABI, TOKEN_ABI, CETHER_ABI, BACKSTOP_MASTERCHEF_ABI, BACKSTOP_MASTERCHEF_ABI_V2,MAXIMILLION_ABI } from "../../abi"
import GeneralDetails from "../GeneralDetails/generalDetails"
import { MasterChefVersion } from "../../networks"
import { Comptroller, getComptrollerData } from "../../Classes/comptrollerClass"
import { CTokenInfo, CTokenSpinner} from "../../Classes/cTokenClass"
import { GeneralDetailsData, getGeneralDetails } from "../../Classes/generalDetailsClass"
import Markets from "../Markets/markets"
import EnterMarketDialog from "../Markets/MarketsDialogs/enterMarketDialog"
import BorrowMarketDialog from "../Markets/MarketsDialogs/BorrowMarketDialog/borrowMarketsDialog"
// import SupplyMarketDialog from "../Markets/MarketsDialogs/supplyMarketDialog"
import { fetchData} from "./fetchData"
import {GaugeV4, getBackstopGaugesData, getGaugesData} from "../../Classes/gaugeV4Class";
import HundredMessage from "../MessageDialog/messageDialog"
import MoonriverMessage from "../MessageDialog/moonRiverDialog"
import { useUiContext } from "../../Types/uiContext"
import { useGlobalContext } from "../../Types/globalContext"
import { useWeb3React } from "@web3-react/core"
import {ExecutePayableWithExtraGasLimit, ExecuteWithExtraGasLimit} from "../../Classes/TransactionHelper";
import { useHundredDataContext } from "../../Types/hundredDataContext"
import { equal } from "assert"
import useFetchData from "../../Hundred/Data/hundredData"

const MaxUint256 = BigNumber.from(ethers.constants.MaxUint256)

//const gasLimit = "150000";
// const gasLimitSupplyDai = "535024";
// const gasLimitSupplySnx = "450000";
// const gasLimitSupplySusd = "450000";
// const gasLimitWithdrawDai = "550000";
// const gasLimitWithdrawSnx = "550000";
// const gasLimitWithdrawSusd = "550000";
// const gasLimitWithdraw = "450000";
// const gasLimitEnable = "70000";
// const gasLimitEnableDai = "66537";
// const gasLimitBorrow = "702020";
// const gasLimitBorrowDai = "729897";
// const gasLimitRepayDai = "535024";
// const gasLimitRepaySusd = "400000";
// const gasLimitEnterMarket = "112020";

type MetamaskError = {
  code: number;
  data: any;
  message: string;
};


const Content: React.FC = () => {
    

    const {setSpinnerVisible, spinnerVisible, darkMode, toastErrorMessage} = useUiContext()
    const {network, address, hndPrice, setHndEarned, setHndBalance, 
           setHundredBalance, updateEarned, setUpdateEarned, 
           setVehndBalance, setHndRewards, setGaugeAddresses} = useGlobalContext()
    const {comptrollerData, setComptrollerData, marketsData, setMarketsData, 
           gaugesV4Data, setGaugesV4Data, generalData, setGeneralData, 
           selectedMarket, setSelectedMarket, marketsSpinners, setMarketsSpinners, selectedMarketSpinners, setSelectedMarketSpinners} = useHundredDataContext()
    const { chainId, library } = useWeb3React()


    const [gMessage, setGmessage] = useState<JSX.Element>()
    const [showGMessage, setShowGMessage] = useState(false)
    const [openEnterMarket, setOpenEnterMarket] = useState(false)
    const [openSupplyMarketDialog, setOpenSupplyDialog] = useState(false)
    const [openBorrowMarketDialog, setOpenBorrowMarketDialog] = useState(false)
    const [update, setUpdate] = useState<boolean>(false)
    const [completed, setCompleted] = useState<boolean>(false)

    const [showMessage, setShowMessage] = useState<boolean>(false)

    const [updateErrorCounter, setUpdateErrorCounter] = useState<number>(0)
    const updateHandle = useRef<NodeJS.Timeout | null>(null)

    const updateRef = useRef<boolean | null>()

    const userAddress = useRef<string | null>(null)
    const updateErrorCounterRef = useRef<number>(0)

    const updateEarnedRef = useRef<boolean>(false)
    const hndPriceRef = useRef<number>(0)

    userAddress.current = address

    hndPriceRef.current = hndPrice
    
    updateRef.current = update
    updateErrorCounterRef.current = updateErrorCounter
    updateEarnedRef.current = updateEarned

    const providerRef = useRef<ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider | undefined>()

    providerRef.current = library

    useEffect(() => {
      providerRef.current = library
      
    }, [library])

    useEffect(() => {
      updateErrorCounterRef.current = updateErrorCounter
    },[updateErrorCounter])

    useEffect(() => {
      hndPriceRef.current = hndPrice
    },[hndPrice])

    useEffect(() => {
      const callUpdate = async () => {
        await dataUpdate(false)
      }

      updateEarnedRef.current = updateEarned
      if(updateEarned)
        callUpdate()
    },[updateEarned])

    const updateMarkets = (markets: CTokenInfo[], gauges: GaugeV4[], hndBalance: BigNumber, hundredBalace: BigNumber, compAccrued: BigNumber, vehndBalance: BigNumber, hndRewards: BigNumber, gaugeAddresses: string[]): void =>{
      if(markets){
        const data = getGeneralDetails(markets, gauges, compAccrued)
        setMarketsData(markets)
        setGeneralData(data)
        setHndEarned(data.earned)
        setHndBalance(hndBalance)
        setHundredBalance(hundredBalace)
        setVehndBalance(vehndBalance)
        setHndRewards(hndRewards)
        setGaugeAddresses(gaugeAddresses)
        if(selectedMarket && markets && marketsSpinners){
          const selected = {...selectedMarket}
          const market = [...markets].find(x=>x?.underlying.symbol === selected.underlying.symbol)
          const marketSpinners = [...marketsSpinners].find(x => x.symbol === selected.underlying.symbol)
          if (market && marketSpinners){
            setSelectedMarketSpinners(marketSpinners)
            setSelectedMarket(market)
          }
        }
      }
    }

    const dataUpdate = async (firstUpdate: boolean) => {
      console.log("data update")
      if(library && network && userAddress.current){
        let comptroller = null
        if(comptrollerData === undefined){
          const comp = await getComptrollerData(library, network)
          console.log(comp)
          comptroller = comp
          setComptrollerData(comptroller)
        }
        console.log(comptroller)
        if(library && comptroller){
          const net = {...network}
          let gauges = await getGaugesData(library, userAddress.current, net, () => setSpinnerVisible(false))
          const backstopGauges = await getBackstopGaugesData(library, userAddress.current, net, () => setSpinnerVisible(false))

          gauges = [...gauges, ...backstopGauges]

          const markets = await fetchData({ allMarkets: [...comptroller.allMarkets], userAddress: userAddress.current, comptrollerData: comptroller, network: net, marketsData: marketsData, provider: library, hndPrice: hndPriceRef.current, gaugesData: gauges })
          const s = [...marketsSpinners]
          console.log(s.length, markets.markets.length)
          let equals = true
          if(s.length === markets.markets.length){
            console.log
            markets.markets.forEach((m) => {
              if (!s.find(s => s.symbol === m.underlying.symbol)){
                equals = false    
                return
              }
            })
          }
          else equals = false
          console.log(equals)
          if(!equals){
            const spinners = markets.markets.map(m => {
              return new CTokenSpinner(m.underlying.symbol)
            })
            console.log(spinners)
            setMarketsSpinners(spinners)
          }

          if(firstUpdate){
            const oldGauges = await getGaugesData(library, userAddress.current, net, () => setSpinnerVisible(false), true)
            if(oldGauges.length > 0){
              const oldGaugeData: { symbol: string; stakeBalance: BigNumber }[] = []
              let message = "You have "
              oldGauges.forEach(g => {
                if(+g.userStakeBalance.toString() > 0){
                  const market = markets.markets.find(m => m.pTokenAddress.toLowerCase() === g.generalData.lpToken.toLowerCase())
                  if(market){
                    const temp = {
                      symbol: `h${market.underlying.symbol}-Gauge`,
                      stakeBalance: g.userStakeBalance
                    }
                    oldGaugeData.push(temp)
                  }
                }
              })
              
                oldGaugeData.forEach((g, index) => {
                  message += g.symbol + (index + 1 === oldGaugeData.length ? " " : ", ")
                })
                if(oldGaugeData.length > 0){
                  setGmessage(gaugeMessage(message))
                  setShowGMessage(true)
                }
            }
          }
          updateMarkets(markets.markets, gauges, markets.hndBalance, markets.hundredBalace, markets.comAccrued, markets.vehndBalance, markets.hndRewards, markets.gaugeAddresses)

          setGaugesV4Data(gauges)
        }
      }
    }

    const gaugeMessage = (message: string) => {
      return (
        <div>
          <p>{message} on <a style={{color: "#2853ff"}} href="https://old.hundred.finance" target={"_blank"} rel="noreferrer">https://old.hundred.finance</a>.</p>
          <p>Please unstake from there and stake on the main site.</p>
        </div>
      )
    }

    const handleUpdate = async (market: CTokenInfo | undefined, spinnerUpdate: string | undefined, firstUpdate: boolean) : Promise<void> => {
      //await dataUpdate(market, spinnerUpdate)
      try {
        //console.log(`Update every: ${updateErrorCounterRef.current * 10 + 10}sec`)
        if(updateHandle.current) clearTimeout(updateHandle.current)
        if(!updateRef.current){
          setSpinnerVisible(true)
        }
        
        await dataUpdate(firstUpdate)

        if(!updateRef.current) setSpinnerVisible(false)
        setUpdate(true)

        setUpdateEarned(false)
        setUpdateErrorCounter(0) 
        updateHandle.current = setTimeout(handleUpdate, 10000, market, spinnerUpdate, false)
      } 
      catch (error) {
        console.log(error)
        if(marketsData)
        updateHandle.current = setTimeout(handleUpdate, (updateErrorCounterRef.current < 2 ? updateErrorCounterRef.current + 1 : updateErrorCounterRef.current) * 10000 + 10000, market, spinnerUpdate, firstUpdate)
        else{
          if(updateErrorCounterRef.current < 2)
            updateHandle.current = setTimeout(handleUpdate, (updateErrorCounterRef.current + 1) * 1000, market, spinnerUpdate, firstUpdate )
          else if (updateErrorCounterRef.current === 3)
            updateHandle.current = setTimeout(handleUpdate, 5000, market, spinnerUpdate, firstUpdate)
          else if (updateErrorCounterRef.current === 7)
          {
            if(!updateRef.current) setSpinnerVisible(false)
            const err = error as MetamaskError
            toastErrorMessage(`${err?.message.replace(".", "")} on Page Load\n${err?.data?.message}\nPlease refresh the page after a few minutes.`)
          }
          else
            updateHandle.current = setTimeout(handleUpdate, 10000, market, spinnerUpdate, firstUpdate)
        }
        setUpdateErrorCounter(updateErrorCounterRef.current+1)
      }
    }

    //Get Comptroller Data
    useEffect(() => {
        
        if(library && network && network.chainId === chainId && userAddress.current && userAddress.current !== ""){
          console.log("initialize hook")
        }
        


        
    },[library, network])

    const getMaxAmount = async (market: CTokenInfo, func?: string) : Promise<BigNumber> => {
      const m = {...market}
        if (m.isNativeToken && library) {
          const gasRemainder = BigNumber.parseValue("0.1")
          
          if(func === "repay" && library){
            const balance = m.underlying.walletBalance.subSafe(gasRemainder);
            return balance.gt(BigNumber.from("0")) ? balance : BigNumber.from("0") 
          }
          else if(func === "supply" && library){
            const balance = m.underlying.walletBalance.gt(BigNumber.from("0")) ? m.underlying.walletBalance.subSafe(gasRemainder) : m.underlying.walletBalance
          
            return balance.gt(BigNumber.from("0")) ? balance : BigNumber.from("0") 
          }
        }
        
      return m.underlying.walletBalance
    }

    const getMaxRepayAmount = async (market: CTokenInfo) : Promise<BigNumber> => {
      const m = {...market}
      if(m.isNativeToken) handleUpdate(m, "repay", false)
      const borrowAPYPerDay = m.borrowApy.div(BigNumber.from('365'));
      const maxRepayFactor = BigNumber.from("1").addSafe(borrowAPYPerDay)// e.g. Borrow APY = 2% => maxRepayFactor = 1.0002
      
      const amount = BigNumber.parseValueSafe(m.borrowBalanceInTokenUnit.mulSafe(maxRepayFactor).toString(), m.underlying.decimals)
      
      return amount // The same as ETH for now. The transaction will use -1 anyway.
    }

    const enterMarketDialog = (market: CTokenInfo) : void => {
      setSelectedMarket(market)
      setOpenEnterMarket(true)
    }

    const closeMarketDialog = () : void => {
      if(!spinnerVisible){
        console.log("Close")
        setOpenEnterMarket(false)
        setSelectedMarket(undefined)
        setSelectedMarketSpinners(undefined)
      }
    }
    
    const supplyMarketDialog = (market: CTokenInfo) => {
      setSelectedMarket(market)
      setOpenSupplyDialog(true)
    }

    const closeSupplyMarketDialog = () =>{
      if(!spinnerVisible){
        setOpenSupplyDialog(false)
        setSelectedMarket(undefined)
      }
    }

  //   const handleEnable = async (symbol: string, borrowDialog: boolean): Promise<void> => {
  //     if(marketsData){
  //       const markets = [...marketsData]
  //       let market = markets.find(x=> x?.underlying.symbol === symbol)
  //       if(market && library && network && userAddress.current){
  //         try{
  //           setSpinnerVisible(true)
  //           setCompleted(false)
  //           const signer = library.getSigner()
  //           if(market.underlying.address){
  //             const contract = new ethers.Contract(market.underlying.address, TOKEN_ABI, signer);
  //             const receipt = await ExecuteWithExtraGasLimit(
  //                 contract,
  //                 "approve",
  //                 [market.pTokenAddress, MaxUint256._value]
  //             , () => setSpinnerVisible(false))

  //             borrowDialog ? market.repaySpinner = true : market.supplySpinner = true

  //             if(selectedMarketRef.current) {
  //               borrowDialog ? selectedMarketRef.current.repaySpinner = true : selectedMarketRef.current.supplySpinner = true
  //             }
  //             console.log(receipt)
  //             market.supplySpinner = false
  //           }
  //         }
  //         catch(err){
  //           const error = err as MetamaskError
  //           toastErrorMessage(`${error?.message.replace(".", "")} on Approve\n${error?.data?.message}`)
  //           console.log(err)

  //         }
  //         finally{
  //           setSpinnerVisible(false)
  //           market = marketsRef.current.find(x =>x?.underlying.symbol === symbol)
  //           if(market){
  //             borrowDialog ? await handleUpdate(market, "repay", false) : await handleUpdate(market, "supply", false)
  //           }

  //           // setUpdate(true)
  //           // if(library && network && userAddress.current){
  //           //   const comptroller = await getComptrollerData(library, userAddress.current, network)
  //           //   setComptrollerData(comptroller)
  //           // }
  //           // if(selectedMarketRef.current && selectedMarketRef.current.symbol === symbol)
  //           //   borrowDialog ? selectedMarketRef.current.repaySpinner = false : selectedMarketRef.current.supplySpinner = false
  //         }
  //       }
  //     }
  //   }

  //   const handleSupply = async (symbol: string, amount: string) : Promise<void> => {
  //     if (marketsRef.current){
  //       setSpinnerVisible(true)
  //       let market = marketsRef.current.find(x =>x?.underlying.symbol === symbol)
  //       if(market && library){
  //         try{
  //           setCompleted(false)
  //           const value = BigNumber.parseValueSafe(amount, market.underlying.decimals)
  //           const selected = {...selectedMarket}
  //           if(selected){
  //             selected.supplySpinner = true
  //             setSelectedMarket(selected)
  //           }
  //           market.supplySpinner = true
  //           const signer = library.getSigner()
  //           const token = (market.isNativeToken) ? CETHER_ABI : CTOKEN_ABI
  //           const ctoken = new ethers.Contract(market.pTokenAddress, token, signer)
  //           const receipt = (market.isNativeToken) ?
  //               await ExecutePayableWithExtraGasLimit(ctoken, value._value, "mint", [], () => setSpinnerVisible(false)) :
  //               await ExecuteWithExtraGasLimit(ctoken, "mint", [value._value], () => setSpinnerVisible(false))
  //           // setSpinnerVisible(false)
  //           console.log(receipt)
  //           setCompleted(true)
  //           if(selectedMarketRef.current)
  //             selectedMarketRef.current.supplySpinner = false
  //         }
  //         catch(err){
  //           console.log(err)
  //         }
  //         finally{
  //           setSpinnerVisible(false)
  //           market = marketsRef.current.find(x =>x?.underlying.symbol === symbol)
  //           if(market){
  //             await handleUpdate(market, "supply", false)
  //           }
              

  //           // if(library && network && userAddress.current){
  //           //   const comptroller = await getComptrollerData(library, userAddress.current, network)
  //           //   setComptrollerData(comptroller)
  //           // }
  //           // if(selectedMarketRef.current && selectedMarketRef.current.symbol === symbol)
  //           //   selectedMarketRef.current.supplySpinner = false
  //         }
  //       }
  //     }
      
  //   }

  //   const handleWithdraw = async (symbol: string, amount: string, max: boolean) : Promise<void> => {
  //     if(marketsRef.current){
  //       setSpinnerVisible(true)
  //       let market = marketsRef.current.find(x=>x?.underlying.symbol === symbol)
  //       if(market && library){
  //         try{
  //           setCompleted(false)
  //           const signer = library.getSigner()
  //           const token = market.isNativeToken ? CETHER_ABI : CTOKEN_ABI
  //           const ctoken = new ethers.Contract(market.pTokenAddress, token, signer)

  //           if (selectedMarketRef.current)
  //             selectedMarketRef.current.withdrawSpinner = true

  //           market.withdrawSpinner = true
  //           console.log(max)
  //           if (max){
  //             const accountSnapshot = await ctoken.getAccountSnapshot(userAddress.current)
  //             const withdraw = ethers.BigNumber.from(accountSnapshot[1].toString())
  //             const receipt = await ExecuteWithExtraGasLimit(ctoken, "redeem", [withdraw], () => setSpinnerVisible(false))
  //             console.log(receipt)
  //             setCompleted(true)
  //           }
  //           else{
  //             const withdraw = BigNumber.parseValueSafe(amount, market.underlying.decimals)
  //             const receipt = await ExecuteWithExtraGasLimit(ctoken, "redeemUnderlying", [withdraw._value], () => setSpinnerVisible(false))
  //             console.log(receipt)
  //           }
  //         }
  //         catch(err){
  //           console.log(err)
  //         }
  //         finally{
  //           setSpinnerVisible(false)
  //           market = marketsRef.current.find(x =>x?.underlying.symbol === symbol)
  //           if(market){
  //             setUpdate(true)
  //             await handleUpdate(market, "withdraw", false)
  //           }

  //           // market = marketsRef.current.find(x => x?.symbol === symbol)
  //           // if(market)
  //           //   market.withdrawSpinner = false
  //           // setUpdate(true)
  //           // if(library && network && userAddress.current){
  //           //   const comptroller = await getComptrollerData(library, userAddress.current, network)
  //           //   setComptrollerData(comptroller)
  //           // }
  //           // if(selectedMarketRef.current && selectedMarketRef.current.symbol === symbol)
  //           //   selectedMarketRef.current.withdrawSpinner = false
  //         }
  //       }
  //     }
  //   }

    const borrowMarketDialog = (market: CTokenInfo) : void => {
      setSelectedMarket(market)
      const selectedSpinner = [...marketsSpinners].find(x => x.symbol === market.underlying.symbol)
      setSelectedMarketSpinners(selectedSpinner)
      setOpenBorrowMarketDialog(true)
    }

    const closeBorrowMarketDialog = () => {
      if(!spinnerVisible){
        setOpenBorrowMarketDialog(false)
        setSelectedMarket(undefined)
      }
  }

  // const handleApproveBackstop = async (symbol: string): Promise<void> => {
  //   setSpinnerVisible(true)
  //   if(marketsRef.current){
  //     let market = marketsRef.current.find(x=> x?.underlying.symbol === symbol)
  //     if(market && market.backstop && library && network && userAddress.current){
  //       try{
  //         setCompleted(false)
  //         const signer = library.getSigner()
  //         if(market.underlying.address && network.backstopMasterChef){
  //           const contract = new ethers.Contract(market.underlying.address, TOKEN_ABI, signer);
  //           const receipt = await ExecuteWithExtraGasLimit(contract, "approve", [
  //               network.backstopMasterChef.address, MaxUint256._value
  //           ], () => setSpinnerVisible(false))
            
  //           market.backstopDepositSpinner = true
  //           if(selectedMarketRef.current && selectedMarketRef.current.backstop) {
  //             selectedMarketRef.current.backstopDepositSpinner = true
  //           }
  //           console.log(receipt)
  //         market.backstopDepositSpinner = false
  //         }
  //       }
  //       catch(err){
  //         const error = err as MetamaskError
  //         toastErrorMessage(`${error?.message.replace(".", "")} on Approve\n${error?.data?.message}`)
  //         console.log(err)

  //       }
  //       finally{
  //         setSpinnerVisible(false)
  //         market = marketsRef.current.find(x =>x?.underlying.symbol === symbol)
  //         if(market && market.backstop){
  //           await handleUpdate(market, "deposit",  false)
  //         }
  //       }
  //     }
  //   }
  // }

  // const handleBackstopDeposit = async (symbol: string, amount: string) : Promise<void> => {
  //   if (marketsRef.current && network && network.backstopMasterChef){
  //     setSpinnerVisible(true)
  //     let market = marketsRef.current.find(x =>x?.underlying.symbol === symbol)
      
  //     if(market && market.backstop && library && network.backstopMasterChef){
  //       try{
  //         setCompleted(false)
  //         const value = BigNumber.parseValueSafe(amount, market.underlying.decimals)
  //         const am = value._value
  //         if(selectedMarketRef.current && selectedMarketRef.current.backstop)
  //           selectedMarketRef.current.backstopDepositSpinner = true
  //         market.backstopDepositSpinner = true

  //         const signer = library.getSigner()
  //         const backstopAbi = network.backstopMasterChef.version === MasterChefVersion.v1 ? BACKSTOP_MASTERCHEF_ABI : BACKSTOP_MASTERCHEF_ABI_V2
  //         const backstop = new ethers.Contract(network.backstopMasterChef.address, backstopAbi, signer)
  //         const receipt = await ExecuteWithExtraGasLimit(backstop, "deposit", [
  //             market.backstop.pool.poolId, am, userAddress.current
  //         ], () => setSpinnerVisible(false))
  //         console.log(receipt)
  //       }
  //       catch(err){
  //         console.log(err)
  //       }
  //       finally{
  //         setSpinnerVisible(false)
  //         market = marketsRef.current.find(x =>x?.underlying.symbol === symbol)
  //         if(market){
  //           await handleUpdate(market, "deposit", false)
  //         }
  //         setCompleted(true)
  //       }
  //     }
  //   }
  // }

  // const handleBackstopWithdraw = async (symbol: string, amount: string) : Promise<void> => {
  //   if (marketsRef.current && network && network.backstopMasterChef){
  //     setSpinnerVisible(true)
  //     let market = marketsRef.current.find(x =>x?.underlying.symbol === symbol)
      
  //     if(market && market.backstop && library && network.backstopMasterChef){
  //       try{
  //         setCompleted(false)
  //         market.backstopWithdrawSpinner = true
  //         if(selectedMarketRef.current && selectedMarketRef.current.backstop)
  //           selectedMarketRef.current.backstopWithdrawSpinner = true
  //         const value = BigNumber.parseValueSafe(amount, market.backstop.decimals)
  //         const am = value._value
  //         const signer = library.getSigner()
  //         const backstopAbi = network.backstopMasterChef.version === MasterChefVersion.v1 ? BACKSTOP_MASTERCHEF_ABI : BACKSTOP_MASTERCHEF_ABI_V2
  //         const backstop = new ethers.Contract(network.backstopMasterChef.address, backstopAbi, signer)
  //         const receipt = await ExecuteWithExtraGasLimit(backstop, "withdrawAndHarvest", [market.backstop.pool.poolId, am, userAddress.current]
  //         ,() => setSpinnerVisible(false))
          
  //         console.log(receipt)
  //       }
  //       catch(err){
  //         console.log(err)
  //       }
  //       finally{
  //         setSpinnerVisible(false)
  //         market = marketsRef.current.find(x =>x?.underlying.symbol === symbol)
  //         if(market){
  //           await handleUpdate(market, "backstopWithdraw", false)
  //           if(selectedMarketRef.current && selectedMarketRef.current.underlying.symbol === market.underlying.symbol)
  //             selectedMarketRef.current.backstopWithdrawSpinner = false
  //         }
  //         setCompleted(true)
  //       }
  //     }
  //   }
  // }

  // const handleBackstopClaim = async (symbol: string) : Promise<void> => {
  //   if (marketsRef.current && network && network.backstopMasterChef){
  //     setSpinnerVisible(true)
  //     let market = marketsRef.current.find(x =>x?.underlying.symbol === symbol)
      
  //     if(market && market.backstop && library && network.backstopMasterChef){
  //       try{
  //         setCompleted(false)
  //         market.backstopClaimSpinner = true
  //         if(selectedMarketRef.current && selectedMarketRef.current.backstop)
  //           selectedMarketRef.current.backstopClaimSpinner = true
  //         const signer = library.getSigner()
  //         const backstopAbi = network.backstopMasterChef.version === MasterChefVersion.v1 ? BACKSTOP_MASTERCHEF_ABI : BACKSTOP_MASTERCHEF_ABI_V2
  //         const backstop = new ethers.Contract(network.backstopMasterChef.address, backstopAbi, signer)
  //         const receipt = await ExecuteWithExtraGasLimit(backstop, "harvest", [
  //             market.backstop.pool.poolId, userAddress.current
  //         ], () => setSpinnerVisible(false))
  //         setSpinnerVisible(false)
  //         console.log(receipt)
  //       }
  //       catch(err){
  //         console.log(err)
  //       }
  //       finally{
  //         setSpinnerVisible(false)
  //         market = marketsRef.current.find(x =>x?.underlying.symbol === symbol)
  //         if(market){
  //           await handleUpdate(market, "backstopClaim", false)
  //         }
  //         setCompleted(true)
  //       }
  //     }
  //   }
  // }

  // const handleStake = async (symbol: string | undefined, gaugeV4: GaugeV4 | null | undefined, amount: string) => {
  //     if(marketsRef.current){
  //         setSpinnerVisible(true)
  //         let market = marketsRef.current.find(x => x?.underlying.symbol === symbol)
  //         if(market && library){
  //             try{
  //                 setCompleted(false)

  //                 if(selectedMarketRef.current)
  //                     selectedMarketRef.current.stakeSpinner = true
  //                 market.stakeSpinner = true

  //                 await gaugeV4?.stakeCall(amount, market)

  //                 setSpinnerVisible(false)

  //                 setCompleted(true)
  //             }
  //             catch(err){
  //                 console.log(err)
  //             }
  //             finally{
  //                 setSpinnerVisible(false)
  //                 market = marketsRef.current.find(x =>x?.underlying.symbol === symbol)
  //                 if(market){
  //                     setUpdate(true)
  //                     await handleUpdate(market, "stake", false)
  //                 }
  //             }
  //         }
  //     }
  // }

  // const handleApproveStake = async (symbol: string | undefined, gaugeV4: GaugeV4 | null | undefined) => {
  //     if(marketsRef.current){
  //         setSpinnerVisible(true)
  //         let market = marketsRef.current.find(x => x?.underlying.symbol === symbol)
  //         if(market && library){
  //             try{
  //               setCompleted(false)

  //                 if(selectedMarketRef.current)
  //                     selectedMarketRef.current.stakeSpinner = true

  //                 market.stakeSpinner = true

  //                 await gaugeV4?.approveCall(market)

  //                 setSpinnerVisible(false)

  //                 market.stakeSpinner = false
  //             }
  //             catch(err){
  //                 console.log(err)
  //             }
  //             finally{
  //                 setSpinnerVisible(false)
  //                 market = marketsRef.current.find(x =>x?.underlying.symbol === symbol)
  //                 if(market){
  //                     setUpdate(true)
  //                     await handleUpdate(market, "stake", false)
  //                 }
  //             }
  //         }
  //     }
  // }

  //   const handleApproveUnStake = async (symbol: string | undefined, gaugeV4: GaugeV4 | null | undefined) => {
  //       if(marketsRef.current){
  //           setSpinnerVisible(true)
  //           let market = marketsRef.current.find(x => x?.underlying.symbol === symbol)
  //           if(market && library){
  //               try{
  //                   setCompleted(false)

  //                   if(selectedMarketRef.current)
  //                       selectedMarketRef.current.unstakeSpinner = true

  //                   market.unstakeSpinner = true

  //                   await gaugeV4?.approveUnstakeCall()

  //                   setSpinnerVisible(false)

  //                   market.unstakeSpinner = false
  //               }
  //               catch(err){
  //                   console.log(err)
  //               }
  //               finally{
  //                   setSpinnerVisible(false)
  //                   market = marketsRef.current.find(x =>x?.underlying.symbol === symbol)
  //                   if(market){
  //                       setUpdate(true)
  //                       await handleUpdate(market, "unstake", false)
  //                   }
  //               }
  //           }
  //       }
  //   }

  //   const handleUnstake = async (symbol: string | undefined, gaugeV4: GaugeV4 | null | undefined, amount: string) => {
  //       if(marketsRef.current){
  //           setSpinnerVisible(true)
  //           let market = marketsRef.current.find(x => x?.underlying.symbol === symbol)
  //           const nativeTokenMarket = marketsRef.current.find(x => x?.isNativeToken)
  //           if(market && library && nativeTokenMarket){
  //               try{
  //                   setCompleted(false)

  //                   if(selectedMarketRef.current)
  //                       selectedMarketRef.current.unstakeSpinner = true

  //                   market.unstakeSpinner = true

  //                   await gaugeV4?.unstakeCall(amount, market, nativeTokenMarket?.pTokenAddress)

  //                   setSpinnerVisible(false)

  //                   setCompleted(true)
  //               }
  //               catch(err){
  //                   console.log(err)
  //               }
  //               finally{
  //                   setSpinnerVisible(false)
  //                   market = marketsRef.current.find(x =>x?.underlying.symbol === symbol)
  //                   if(market){
  //                       setUpdate(true)
  //                       await handleUpdate(market, "unstake", false)
  //                   }
  //               }
  //           }
  //       }
  //   }

  //   const handleMint = async (symbol: string | undefined, gaugeV4: GaugeV4 | null | undefined) => {
  //       if(marketsRef.current){
  //           setSpinnerVisible(true)
  //           let market = marketsRef.current.find(x => x?.underlying.symbol === symbol)
  //           if(market && library){
  //               try{
  //                   setCompleted(false)

  //                   if(selectedMarketRef.current)
  //                       selectedMarketRef.current.mintSpinner = true

  //                   market.mintSpinner = true

  //                   await gaugeV4?.mintCall()

  //                   setSpinnerVisible(false)

  //                   setCompleted(true)
  //               }
  //               catch(err){
  //                   console.log(err)
  //               }
  //               finally{
  //                   setSpinnerVisible(false)
  //                   market = marketsRef.current.find(x =>x?.underlying.symbol === symbol)
  //                   if(market){
  //                       setUpdate(true)
  //                       await handleUpdate(market, "mint", false)
  //                   }
  //               }
  //           }
  //       }
  //   }
    
    return (
        <div className="content">
            <GeneralDetails generalData={generalData}/>
            <Markets
                enterMarketDialog={enterMarketDialog}
                supplyMarketDialog={supplyMarketDialog}
                borrowMarketDialog={borrowMarketDialog}
            />
            <EnterMarketDialog open={openEnterMarket} market={selectedMarket} closeMarketDialog = {closeMarketDialog} 
            />
            {/* <SupplyMarketDialog
                completed={completed}
                open={openSupplyMarketDialog}
                market={{...selectedMarket}}
                generalData={generalData}
                closeSupplyMarketDialog={closeSupplyMarketDialog}
                handleEnable = {handleEnable}
                handleSupply={handleSupply}
                handleWithdraw={handleWithdraw}
                handleStake={handleStake}
                handleUnstake={handleUnstake}
                handleMint={handleMint}
                getMaxAmount={getMaxAmount}
                spinnerVisible={spinnerVisible}
                gaugeV4={gaugesV4Data?.find(g => g?.generalData.lpToken.toLowerCase() === selectedMarketRef.current?.pTokenAddress.toLowerCase())}
                backstopGaugeV4={gaugesV4Data?.find(g => g?.generalData.lpTokenUnderlying.toLowerCase() === selectedMarketRef.current?.pTokenAddress.toLowerCase())}
                handleApproveBackstop={handleApproveBackstop}
                handleBackstopDeposit={handleBackstopDeposit}
                handleBackstopWithdraw={handleBackstopWithdraw}
                handleBackstopClaim={handleBackstopClaim}
                handleApproveStake={handleApproveStake}
                handleApproveUnStake={handleApproveUnStake}
            /> */}
            <BorrowMarketDialog open={openBorrowMarketDialog}
              closeBorrowMarketDialog={closeBorrowMarketDialog} getMaxAmount={getMaxAmount} getMaxRepayAmount={getMaxRepayAmount}/>
            <HundredMessage isOpen={showMessage} onRequestClose={() => setShowMessage(false)} contentLabel="Info" className={`${darkMode ? "mymodal-dark" : ""}`}
              message={<MoonriverMessage/>}/>
            <HundredMessage isOpen={showGMessage} onRequestClose={() => setShowGMessage(false)} contentLabel="Info" className={`${darkMode ? "mymodal-dark" : ""}`}
              message={gMessage}/>
        </div>
    )
}

export default Content