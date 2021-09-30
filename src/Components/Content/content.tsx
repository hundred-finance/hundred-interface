import { ethers} from "ethers"
import { BigNumber } from "../../bigNumber"
import React, { useEffect,  useRef, useState } from "react"
import {CTOKEN_ABI, TOKEN_ABI, CETHER_ABI } from "../../abi"
import GeneralDetails from "../GeneralDetails/generalDetails"
import { Network } from "../../networks"
import { Comptroller, getComptrollerData } from "../../Classes/comptrollerClass"
import { CTokenInfo} from "../../Classes/cTokenClass"
import { GeneralDetailsData, getGeneralDetails } from "../../Classes/generalDetailsClass"
import Markets from "../Markets/markets"
import EnterMarketDialog from "../Markets/MarketsDialogs/enterMarketDialog"
import BorrowMarketDialog from "../Markets/MarketsDialogs/borrowMarketsDialog"
import SupplyMarketDialog from "../Markets/MarketsDialogs/supplyMarketDialog"
import { fetchData } from "./fetchData"

const MaxUint256 = BigNumber.from(ethers.constants.MaxUint256)

const gasLimit = "250000";
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

interface Props{
  network: Network | null,
  setSpinnerVisible: React.Dispatch<React.SetStateAction<boolean>>,
  hndPrice: number,
  address: string,
  provider: ethers.providers.Web3Provider | null,
  spinnerVisible: boolean,
  darkMode: boolean,
  toastError: (error: string) => void
}

const Content: React.FC<Props> = (props : Props) => {
    const [comptrollerData, setComptrollerData] = useState<Comptroller | null>(null)
    const [marketsData, setMarketsData] = useState<(CTokenInfo | null)[] | null | undefined>(null)
    const [generalData, setGeneralData] = useState<GeneralDetailsData | null>(null)
    const [selectedMarket, setSelectedMarket] = useState<CTokenInfo | null>(null)
    const [openEnterMarket, setOpenEnterMarket] = useState(false)
    const [openSupplyMarketDialog, setOpenSupplyDialog] = useState(false)
    const [openBorrowMarketDialog, setOpenBorrowMarketDialog] = useState(false)
    const [update, setUpdate] = useState<boolean>(false)
    const [completed, setCompleted] = useState<boolean>(false)

    const [updateErrorCounter, setUpdateErrorCounter] = useState<number>(0)
    const [updateHandle, setUpdateHandle] = useState<number | null>(null)

    const comptrollerDataRef = useRef<Comptroller | null>(null)
    const spinner = useRef<React.Dispatch<React.SetStateAction<boolean>> | null>(null)
    const updateRef = useRef<boolean | null>()
    const marketsRef = useRef<(CTokenInfo | null)[] | null | undefined>(null)
    const generalDataRef = useRef<GeneralDetailsData | null>(null)

    const selectedMarketRef = useRef<CTokenInfo | null>(null)
    const provider = useRef<ethers.providers.Web3Provider | null>(null)
    const userAddress = useRef<string | null>(null)
    const network = useRef<Network | null>(null)
    const updateErrorCounterRef = useRef<number>(0)

    const hndPriceRef = useRef<number>(0)

    provider.current = props.provider
    userAddress.current = props.address
    network.current = props.network
    comptrollerDataRef.current = comptrollerData
    marketsRef.current = marketsData
    generalDataRef.current = generalData

    hndPriceRef.current = props.hndPrice
    
    updateRef.current = update
    spinner.current = props.setSpinnerVisible
    selectedMarketRef.current = selectedMarket
    updateErrorCounterRef.current = updateErrorCounter

    useEffect(() => {
      updateErrorCounterRef.current = updateErrorCounter
    },[updateErrorCounter])

    useEffect(() => {
      hndPriceRef.current = props.hndPrice
    },[props.hndPrice])

    const updateMarkets = (markets: CTokenInfo[], cToken?: CTokenInfo, spinner?: string): void =>{
      if(marketsRef.current){
        markets.map((m) => {
          if(marketsRef.current && m){
            const market = marketsRef.current.find(x => x?.symbol === m.symbol)
            if (market){
              if(cToken && market.symbol === cToken.symbol && spinner){
                m.spinner = market.spinner
                m.supplySpinner = spinner==="supply" ? false : market.supplySpinner
                m.withdrawSpinner = spinner === "withdraw" ? false : market.withdrawSpinner
                m.borrowSpinner = spinner === "borrow" ? false : market.borrowSpinner
                m.repaySpinner = spinner === "repay" ? false : market.repaySpinner
              }
              else{
                m.spinner = market.spinner
                m.supplySpinner = market.supplySpinner
                m.withdrawSpinner = market.withdrawSpinner
                m.borrowSpinner = market.borrowSpinner
                m.repaySpinner = market.repaySpinner
              }
            }
          }
          return true
        })
      }
      const data = getGeneralDetails(markets)
      setMarketsData(markets)
      setGeneralData(data)
      if(selectedMarketRef.current && markets){
        const market = markets.find(x=>x?.symbol === selectedMarketRef.current?.symbol)
        if (market){
          setSelectedMarket(market)
        }
      }
    }

    const dataUpdate = async (cToken?: CTokenInfo, spinnerUpdate?:string) => {
      if(provider.current && network.current && userAddress.current){
        if(!comptrollerDataRef.current){
          const comptroller = await getComptrollerData(provider.current, network.current)
          setComptrollerData(comptroller)
        }
        if(provider.current && comptrollerDataRef.current){
          const markets = await fetchData(comptrollerDataRef.current.allMarkets, userAddress.current, comptrollerDataRef.current, network.current, marketsRef.current, provider.current, hndPriceRef.current)
          
          updateMarkets(markets.markets, cToken, spinnerUpdate)
        }
      }
    }

    const handleUpdate = async (market?: CTokenInfo, spinnerUpdate?: string) : Promise<void> => {
      try {
        //console.log(`Update every: ${updateErrorCounterRef.current * 10 + 10}sec`)
        if(updateHandle) clearTimeout(updateHandle)
        if(!updateRef.current){
          if(spinner.current) spinner.current(true)
        }
        
        await dataUpdate(market, spinnerUpdate)

        if(spinner.current && !updateRef.current) spinner.current(false)
        setUpdate(true)

        setUpdateErrorCounter(0) 
        setUpdateHandle(setTimeout(handleUpdate, 10000))
      } 
      catch (error) {
        setUpdateHandle(setTimeout(handleUpdate, (updateErrorCounterRef.current < 2 ? updateErrorCounterRef.current + 1 : updateErrorCounterRef.current) * 10000 + 10000))
        setUpdateErrorCounter(updateErrorCounterRef.current+1)
      }
    }

    //Get Comptroller Data
    useEffect(() => {
        const getData= async () => {
            await handleUpdate()
        }
        setComptrollerData(null)
        setMarketsData(null)
        setGeneralData(null)
        setSelectedMarket(null)
        if(updateHandle) clearTimeout(updateHandle)
        props.setSpinnerVisible(true)
        setUpdate(false)

        if(provider.current && network.current && network.current.chainId && userAddress.current && userAddress.current !== ""){
          getData()
        }

        return() => {
          if(updateHandle) clearTimeout(updateHandle)
        }

    },[props.provider])

    const getMaxAmount = async (market: CTokenInfo, func?: string) : Promise<BigNumber> => {
        if (market.isNativeToken && props.provider) {
          const gasPrice = BigNumber.from((await props.provider.getGasPrice()).toString(), 9)
          let gaslimit = BigNumber.from(gasLimit)
          if(func === "repay" && provider.current){
            const value = BigNumber.parseValueSafe(market.borrowBalanceInTokenUnit.toString(), market.decimals)
            if (value.gt(BigNumber.from("0"))){
              const am = {value: value._value} 
          
              const signer = provider.current.getSigner()
              const tokenABI = (market.isNativeToken) ? CETHER_ABI : CTOKEN_ABI
              const ctoken = new ethers.Contract(market.pTokenAddress, tokenABI, signer)
              gaslimit = BigNumber.from(await ctoken.estimateGas.repayBorrow(am)).mul(BigNumber.from("12"))
            }
          }
          else if(func === "supply" && provider.current){
            const tempPrice = BigNumber.from((gasPrice.mul(gaslimit))._value, 18)
            const tempBalance = market.walletBalance.sub(tempPrice)
            if(tempBalance.gt(BigNumber.from("0"))){
              const value = BigNumber.parseValueSafe(tempBalance.toString(), market.decimals)
              const am = {value: value._value}
              const signer = provider.current.getSigner()
              const ctoken = new ethers.Contract(market.pTokenAddress, CETHER_ABI, signer)
              gaslimit = BigNumber.from(await ctoken.estimateGas.mint(am)).mul(BigNumber.from("12"))
            }
          }
          const price = BigNumber.from((gasPrice.mul(gaslimit))._value, 18)
          const balance = market.walletBalance.gt(BigNumber.from("0")) ? market.walletBalance.sub(price) : market.walletBalance
         
          return balance
        }
        
      return market.walletBalance
    }

    const getMaxRepayAmount = async (market: CTokenInfo) : Promise<BigNumber> => {
      
      
      if(market.isNativeToken) handleUpdate(market, "repay")
      const maxRepayFactor = !market.isNativeToken ? BigNumber.parseValueSafe((1 + +market.borrowRatePerBlock.toString()).noExponents(), market.decimals) :
       BigNumber.parseValueSafe((1 + +market.borrowRatePerBlock.toString()).noExponents(), market.decimals)//BigNumber.from("1").add(market.borrowApy); // e.g. Borrow APY = 2% => maxRepayFactor = 1.0002
      const amount = BigNumber.parseValueSafe(market.borrowBalanceInTokenUnit.mulSafe(maxRepayFactor).toString(), market.decimals)
      console.log(`market.borrowRatePerBlock: ${(+market.borrowRatePerBlock.toString()).noExponents()}\n maxRepayFactor: ${maxRepayFactor.toString()}\nAmount: ${amount}\nmarket.borrowBalanceInTokenUnit: ${market.borrowBalanceInTokenUnit}`)
      
      return amount // The same as ETH for now. The transaction will use -1 anyway.
    }

    const enterMarketDialog = (market: CTokenInfo) : void => {
      setSelectedMarket(market)
      setOpenEnterMarket(true)
    }

    const closeMarketDialog = () : void => {
      if(!props.spinnerVisible){
        setOpenEnterMarket(false)
        setSelectedMarket(null)
      }
    }

    const handleEnterMarket = async(symbol: string): Promise<void> => {
      if(marketsRef.current){
        const market = marketsRef.current.find(m => m?.symbol === symbol)
        if (market && provider.current && comptrollerDataRef.current && network.current && userAddress.current){
          try{
            if (spinner.current) spinner.current(true)
            if(selectedMarketRef.current) selectedMarketRef.current.spinner = true
            const addr = [market.pTokenAddress]
            const signer = provider.current.getSigner()
            const signedComptroller = comptrollerDataRef.current.comptroller.connect(signer)
            const tx = await signedComptroller.enterMarkets(addr)
            if (spinner.current) spinner.current(false)
            setOpenEnterMarket(false)
            console.log(tx)
            const receipt = await tx.wait()
            console.log(receipt)
            if(receipt.status === 1){
              const market = marketsRef.current.find(m => m?.symbol === symbol)
              if(market)
                market.isEnterMarket = true
            }
          }
          catch (err){
            console.log(err)
          }
          finally{
            if (spinner.current) spinner.current(false)
            const market = marketsRef.current.find(x=> x?.symbol === symbol)
            if (market) market.spinner = false
            setUpdate(true)
            const comptroller =  await getComptrollerData(provider.current, network.current)
            setComptrollerData(comptroller)  
            if (selectedMarketRef.current && selectedMarketRef.current.symbol === symbol)
              selectedMarketRef.current.spinner = false
          }
        }
      }
    }

    const handleExitMarket = async (symbol: string): Promise<void> => {
      if(marketsRef.current){
        let market = marketsRef.current.find(m => m?.symbol === symbol)
        if (market && provider.current && comptrollerDataRef.current && userAddress.current && network.current){
          try{
            if(spinner.current) spinner.current(true)
            const signer = provider.current.getSigner()
            const signedComptroller = comptrollerDataRef.current.comptroller.connect(signer)
            const tx = await signedComptroller.exitMarket(market.pTokenAddress)
            market = marketsRef.current.find(m => m?.symbol === symbol)
            if (market) market.spinner = true
            console.log(tx)
            if(spinner.current) spinner.current(false)
            setOpenEnterMarket(false)
            const receipt = await tx.wait() 
            console.log(receipt)
            if(receipt.status === 1){
              const market = marketsRef.current.find(m => m?.symbol === symbol)
              if(market)
                market.isEnterMarket = false
            }
          }
          catch (err){
            console.log(err)
          }
          finally{
            if (spinner.current) spinner.current(false)
            const market = marketsRef.current.find(x=> x?.symbol === symbol)
            if (market) market.spinner = false
            setUpdate(true)
            const comptroller =  await getComptrollerData(provider.current, network.current)
            setComptrollerData(comptroller)  
            if (selectedMarketRef.current && selectedMarketRef.current.symbol === symbol)
              selectedMarketRef.current.spinner = false
          }
        }
      }
    }
    
    const supplyMarketDialog = (market: CTokenInfo) => {
      setSelectedMarket(market)
      setOpenSupplyDialog(true)
    }

    const closeSupplyMarketDialog = () =>{
      if(!props.spinnerVisible){
        setOpenSupplyDialog(false)
        setSelectedMarket(null)
      }
    }

    const handleEnable = async (symbol: string, borrowDialog: boolean): Promise<void> => {
      if (spinner.current) spinner.current(true)
      if(marketsRef.current){
        let market = marketsRef.current.find(x=> x?.symbol === symbol)
        if(market && provider.current && network.current && userAddress.current){
          try{
            const signer = provider.current.getSigner()
            if(market.underlyingAddress){
              const contract = new ethers.Contract(market.underlyingAddress, TOKEN_ABI, signer);
              const tx = await contract.approve(market.pTokenAddress, MaxUint256._value)
              if (spinner.current) spinner.current(false)
              console.log(tx)
              borrowDialog ? market.repaySpinner = true : market.supplySpinner = true
              if(selectedMarketRef.current)
                borrowDialog ? selectedMarketRef.current.repaySpinner = true : selectedMarketRef.current.supplySpinner = true
            
              const receipt = await tx.wait()
              console.log(receipt)
            }
          }
          catch(err){
            const error = err as MetamaskError
            props.toastError(`${error?.message.replace(".", "")} on Approve\n${error?.data?.message}`)
            console.log(err)

          }
          finally{
            if (spinner.current) spinner.current(false)
            market = marketsRef.current.find(x =>x?.symbol === symbol)
            if(market)
              borrowDialog ? await handleUpdate(market, "repay") : await handleUpdate(market, "supply")

            // setUpdate(true)
            // if(provider.current && network.current && userAddress.current){
            //   const comptroller = await getComptrollerData(provider.current, userAddress.current, network.current)
            //   setComptrollerData(comptroller)
            // }
            // if(selectedMarketRef.current && selectedMarketRef.current.symbol === symbol)
            //   borrowDialog ? selectedMarketRef.current.repaySpinner = false : selectedMarketRef.current.supplySpinner = false
          }
        }
      }
    }

    const handleSupply = async (symbol: string, amount: string) : Promise<void> => {
      if (marketsRef.current){
        if (spinner.current) spinner.current(true)
        let market = marketsRef.current.find(x =>x?.symbol === symbol)
        if(market && provider.current){
          try{
            setCompleted(false)
            const value = BigNumber.parseValueSafe(amount, market.decimals)
            const am = (market.isNativeToken) ? {value: value._value} : value._value
            if(selectedMarketRef.current)
              selectedMarketRef.current.supplySpinner = true
            market.supplySpinner = true
            const signer = provider.current.getSigner()
            const token = (market.isNativeToken) ? CETHER_ABI : CTOKEN_ABI
            const ctoken = new ethers.Contract(market.pTokenAddress, token, signer)
            const tx = await ctoken.mint(am)

            if (spinner.current) spinner.current(false)

            console.log(tx)
            const receipt = await tx.wait()
            console.log(receipt)
            setCompleted(true)
          }
          catch(err){
            console.log(err)
          }
          finally{
            if (spinner.current) spinner.current(false)
            market = marketsRef.current.find(x =>x?.symbol === symbol)
            if(market){
              await handleUpdate(market, "supply")
            }
              

            // if(provider.current && network.current && userAddress.current){
            //   const comptroller = await getComptrollerData(provider.current, userAddress.current, network.current)
            //   setComptrollerData(comptroller)
            // }
            // if(selectedMarketRef.current && selectedMarketRef.current.symbol === symbol)
            //   selectedMarketRef.current.supplySpinner = false
          }
        }
      }
      
    }

    const handleWithdraw = async (symbol: string, amount: string, max: boolean) : Promise<void> => {
      if(marketsRef.current){
        if (spinner.current) spinner.current(true)
        let market = marketsRef.current.find(x=>x?.symbol === symbol)
        if(market && provider.current){
          try{
            setCompleted(false)
            const signer = provider.current.getSigner()
            const token = market.isNativeToken ? CETHER_ABI : CTOKEN_ABI
            const ctoken = new ethers.Contract(market.pTokenAddress, token, signer)

            if (selectedMarketRef.current)
              selectedMarketRef.current.withdrawSpinner = true

            market.withdrawSpinner = true
            console.log(max)
            if (max){
              const accountSnapshot = await ctoken.getAccountSnapshot(userAddress.current)
              const withdraw = ethers.BigNumber.from(accountSnapshot[1].toString())
              const tx = await ctoken.redeem(withdraw)
              if (spinner.current) spinner.current(false)
              console.log(tx)
              const receipt = await tx.wait()
              console.log(receipt)
              setCompleted(true)
            }
            else{
              const withdraw = BigNumber.parseValueSafe(amount, market.decimals)
              const tx = await ctoken.redeemUnderlying(withdraw._value)
              if (spinner.current) spinner.current(false)
              console.log(tx)
              const receipt = await tx.wait()
              console.log(receipt)
            }
          }
          catch(err){
            console.log(err)
          }
          finally{
            if (spinner.current) spinner.current(false)
            market = marketsRef.current.find(x =>x?.symbol === symbol)
            if(market){
              setUpdate(true)
              await handleUpdate(market, "withdraw")
            }

            // market = marketsRef.current.find(x => x?.symbol === symbol)
            // if(market)
            //   market.withdrawSpinner = false
            // setUpdate(true)
            // if(provider.current && network.current && userAddress.current){
            //   const comptroller = await getComptrollerData(provider.current, userAddress.current, network.current)
            //   setComptrollerData(comptroller)
            // }
            // if(selectedMarketRef.current && selectedMarketRef.current.symbol === symbol)
            //   selectedMarketRef.current.withdrawSpinner = false
          }
        }
      }
    }

    const borrowMarketDialog = (market: CTokenInfo) : void => {
      setSelectedMarket(market)
      setOpenBorrowMarketDialog(true)
    }

    const closeBorrowMarketDialog = () => {
      if(!props.spinnerVisible){
        setOpenBorrowMarketDialog(false)
        setSelectedMarket(null)
      }
  }

  const handleBorrow = async (symbol: string, amount: string) => {
    if (marketsRef.current){
      if (spinner.current) spinner.current(true)
      let market = marketsRef.current.find(x => x?.symbol === symbol)
      if(market && provider.current){
        try{
          setCompleted(false)
          const value = BigNumber.parseValueSafe(amount, market.decimals)
          if (selectedMarketRef.current)
            selectedMarketRef.current.borrowSpinner = true
          market.borrowSpinner = true
          const signer = provider.current.getSigner()
          const token = market.isNativeToken ? CETHER_ABI : CTOKEN_ABI
          const ctoken = new ethers.Contract(market.pTokenAddress, token, signer)
          const tx = await ctoken.borrow(value._value)

          if (spinner.current) spinner.current(false)

          console.log(tx)
          const receipt = await tx.wait()
          console.log(receipt)
          setCompleted(true)
        }
        catch(err){
          console.log(err)
        }
        finally{
          if (spinner.current) spinner.current(false)
          market = marketsRef.current.find(x =>x?.symbol === symbol)
          if(market){
              setUpdate(true)
              await handleUpdate(market, "borrow")
          }
          // if(market)
          //   market.borrowSpinner = false
          // setUpdate(true)
          
          // if(provider.current && network.current && userAddress.current){
          //   const comptroller = await getComptrollerData(provider.current, userAddress.current, network.current)
          //   setComptrollerData(comptroller)
          // }
          
          // if(selectedMarketRef.current && selectedMarketRef.current.symbol === symbol)
          //   selectedMarketRef.current.borrowSpinner = false
        }
      }
    }
  }

  const handleRepay = async(symbol: string, amount: string, fullRepay: boolean) => {
    if(marketsRef.current){
      if (spinner.current) spinner.current(true)
      let market = marketsRef.current.find(x => x?.symbol === symbol)
      if(market && provider.current){
        try{
          setCompleted(false)
          const value = BigNumber.parseValueSafe(amount, market.decimals)
          const am = (market.isNativeToken) ? ({value: value._value}) : 
                   (fullRepay ? ethers.constants.MaxUint256 : value._value)
          if(selectedMarketRef.current)
            selectedMarketRef.current.repaySpinner = true

          market.repaySpinner = true
          const signer = provider.current.getSigner()
          const tokenABI = (market.isNativeToken) ? CETHER_ABI : CTOKEN_ABI
          const ctoken = new ethers.Contract(market.pTokenAddress, tokenABI, signer)
          
          const tx = await ctoken.repayBorrow(am)
          
          if (spinner.current) spinner.current(false)

          console.log(tx)
          const receipt = await tx.wait()
          console.log(receipt)
          setCompleted(true)
        }
        catch(err){
          console.log(err)
        }
        finally{
          if (spinner.current) spinner.current(false)
          market = marketsRef.current.find(x =>x?.symbol === symbol)
          if(market){
              setUpdate(true)
              await handleUpdate(market, "repay")
            }
          // if(market)
          //   market.repaySpinner = false

          // setUpdate(true)

          // if(provider.current && network.current && userAddress.current){
          //   const comptroller = await getComptrollerData(provider.current, userAddress.current, network.current)
          //   setComptrollerData(comptroller)
          // }

          // if(selectedMarketRef.current && selectedMarketRef.current.symbol === symbol)
          //   selectedMarketRef.current.repaySpinner = false
        }
      }
    }
  }
    
    return (
        <div className="content">
            <GeneralDetails generalData={generalData}/>
            <Markets generalData = {generalDataRef.current} marketsData = {marketsData} enterMarketDialog={enterMarketDialog} 
              supplyMarketDialog={supplyMarketDialog} borrowMarketDialog={borrowMarketDialog} darkMode={props.darkMode}/>
              <EnterMarketDialog open={openEnterMarket} market={selectedMarket} generalData={generalData} closeMarketDialog = {closeMarketDialog} 
              handleEnterMarket={handleEnterMarket} handleExitMarket={handleExitMarket}/>
            <SupplyMarketDialog completed={completed} open={openSupplyMarketDialog} market={selectedMarketRef.current} generalData={generalData} 
              closeSupplyMarketDialog = {closeSupplyMarketDialog} darkMode={props.darkMode} 
              handleEnable = {handleEnable} handleSupply={handleSupply} handleWithdraw={handleWithdraw} getMaxAmount={getMaxAmount} spinnerVisible={props.spinnerVisible}/>
            <BorrowMarketDialog completed={completed} open={openBorrowMarketDialog} market={selectedMarket} generalData={generalData} 
              closeBorrowMarketDialog={closeBorrowMarketDialog} darkMode={props.darkMode} getMaxAmount={getMaxAmount} handleEnable = {handleEnable}
              handleBorrow={handleBorrow} handleRepay={handleRepay} getMaxRepayAmount={getMaxRepayAmount} spinnerVisible={props.spinnerVisible}/> 
        </div>
    )
}

export default Content