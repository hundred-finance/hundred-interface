import { ethers} from "ethers"
import { BigNumber } from "../../bigNumber"
import React, { useEffect,  useRef, useState } from "react"
import GeneralDetails from "../GeneralDetails/generalDetails"
import { getComptrollerData } from "../../Classes/comptrollerClass"
import { CTokenInfo, CTokenSpinner} from "../../Classes/cTokenClass"
import { getGeneralDetails } from "../../Classes/generalDetailsClass"
import Markets from "../Markets/markets"
import EnterMarketDialog from "../Markets/MarketsDialogs/enterMarketDialog"
import BorrowMarketDialog from "../Markets/MarketsDialogs/BorrowMarketDialog/borrowMarketsDialog"
import SupplyMarketDialog from "../Markets/MarketsDialogs/SupplyMarketDialogNew/supplyMarketDialog"
import { fetchData} from "./fetchData"
import {GaugeV4, getBackstopGaugesData, getGaugesData} from "../../Classes/gaugeV4Class";
import HundredMessage from "../MessageDialog/messageDialog"
import MoonriverMessage from "../MessageDialog/moonRiverDialog"
import { useUiContext } from "../../Types/uiContext"
import { useGlobalContext } from "../../Types/globalContext"
import { useWeb3React } from "@web3-react/core"
import { useHundredDataContext } from "../../Types/hundredDataContext"

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
           setGaugesV4Data, generalData, setGeneralData, 
           selectedMarket, setSelectedMarket, marketsSpinners, setMarketsSpinners, setSelectedMarketSpinners} = useHundredDataContext()
    const { chainId, library } = useWeb3React()


    const [gMessage, setGmessage] = useState<JSX.Element>()
    const [showGMessage, setShowGMessage] = useState(false)
    const [openEnterMarket, setOpenEnterMarket] = useState(false)
    const [openSupplyMarketDialog, setOpenSupplyDialog] = useState(false)
    const [openBorrowMarketDialog, setOpenBorrowMarketDialog] = useState(false)
    const [update, setUpdate] = useState<boolean>(false)

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
      const selectedSpinner = [...marketsSpinners].find(x => x.symbol === market.underlying.symbol)
      setSelectedMarketSpinners(selectedSpinner)
      setOpenSupplyDialog(true)
    }

    const closeSupplyMarketDialog = () =>{
      if(!spinnerVisible){
        setOpenSupplyDialog(false)
        setSelectedMarket(undefined)
      }
    }

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
    return (
        <div className="content">
            <GeneralDetails/>
            <Markets
                enterMarketDialog={enterMarketDialog}
                supplyMarketDialog={supplyMarketDialog}
                borrowMarketDialog={borrowMarketDialog}
            />
            <EnterMarketDialog open={openEnterMarket} market={selectedMarket} closeMarketDialog = {closeMarketDialog} 
            />
            <SupplyMarketDialog
                open={openSupplyMarketDialog}
                closeSupplyMarketDialog={closeSupplyMarketDialog}
            />
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