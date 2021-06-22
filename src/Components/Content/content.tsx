import { ethers} from "ethers"
import { BigNumber } from "../../bigNumber"
import React, { useEffect,  useRef, useState } from "react"
import {CTOKEN_ABI, TOKEN_ABI, CETHER_ABI } from "../../abi"
import GeneralDetails from "../GeneralDetails/generalDetails"
import { Network } from "../../networks"
import { Comptroller, getComptrollerData } from "../../Classes/comptrollerClass"
import { CTokenInfo, getCtokenInfo } from "../../Classes/cTokenClass"
import { GeneralDetailsData, getGeneralDetails } from "../../Classes/generalDetailsClass"
import Markets from "../Markets/markets"
import EnterMarketDialog from "../Markets/MarketsDialogs/enterMarketDialog"
import BorrowMarketDialog from "../Markets/MarketsDialogs/borrowMarketsDialog"
import SupplyMarketDialog from "../Markets/MarketsDialogs/supplyMarketDialog"

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

interface Props{
  network: Network | null,
  setSpinnerVisible: React.Dispatch<React.SetStateAction<boolean>>,
  address: string,
  provider: ethers.providers.Web3Provider | null,
  spinnerVisible: boolean,
  darkMode: boolean
}

const Content: React.FC<Props> = (props : Props) => {
    const [comptrollerData, setComptrollerData] = useState<Comptroller | null>(null)
    const [marketsData, setMarketsData] = useState<(CTokenInfo | null)[] | null>(null)
    const [generalData, setGeneralData] = useState<GeneralDetailsData | null>(null)
    const [selectedMarket, setSelectedMarket] = useState<CTokenInfo | null>(null)
    const [openEnterMarket, setOpenEnterMarket] = useState(false)
    const [openSupplyMarketDialog, setOpenSupplyDialog] = useState(false)
    const [openBorrowMarketDialog, setOpenBorrowMarketDialog] = useState(false)
    const [update, setUpdate] = useState<boolean>(false)

    const comptrollerDataRef = useRef<Comptroller | null>(null)
    const spinner = useRef<React.Dispatch<React.SetStateAction<boolean>> | null>(null)
    const updateRef = useRef<boolean | null>()
    const marketsRef = useRef<(CTokenInfo | null)[] | null>(null)
    const selectedMarketRef = useRef<CTokenInfo | null>(null)
    const provider = useRef<ethers.providers.Web3Provider | null>(null)
    const userAddress = useRef<string | null>(null)
    const network = useRef<Network | null>(null)

    provider.current = props.provider
    userAddress.current = props.address
    network.current = props.network
    comptrollerDataRef.current = comptrollerData
    marketsRef.current = marketsData
    updateRef.current = update
    spinner.current = props.setSpinnerVisible
    selectedMarketRef.current = selectedMarket

    //Get Comptroller Data
    useEffect(() => {
        const GetData = async () => {
            if(provider.current && network.current && userAddress.current){
              const comptroller =  await getComptrollerData(provider.current, userAddress.current, network.current)
              setComptrollerData(comptroller)    
            }
            
        }

        const interval = setInterval(() => {
          try{
              GetData()
              setUpdate(true)
          }
          catch(err){
              console.log(err)
          }
        }, 6000000);

        if(provider.current && network.current && network.current.chainId && userAddress.current && userAddress.current !== ""){
            try{
              setUpdate(false)
              if (spinner.current) spinner.current(true)
              GetData()
            }
            catch(err){
                console.log(err)
            }
            finally{
              if(spinner.current) spinner.current(false)
            }
        }
        else{
            try{
              setUpdate(false)
              clearInterval(interval)
            }
            catch(err){

            }
            setComptrollerData(null)
            setMarketsData(null)
        }

        return() => clearInterval(interval)

    },[props.provider])

    //GetMarkets Dara 
    useEffect(() => {
        const GetMarkets = async() =>{
          try{
            if(!updateRef.current)
              if( spinner.current ) spinner.current(true)

            if(comptrollerData && provider.current){
              const markets = await Promise.all(comptrollerData.allMarkets?.filter((a) => {
                if (a.toLowerCase() === "0xc98182014c90baa26a21e991bfec95f72bd89aed")
                   return false
                return true
                  }).map(async (a) => {
                    const isNativeToken = a.toLowerCase() ===  network?.current?.token
              
                //const ctokenInfo = await getCTokenInfo.current(a, isNativeToken)
                if(provider.current && network.current && userAddress.current)
                  return await getCtokenInfo(a, isNativeToken, provider.current, userAddress.current, comptrollerData, network.current)
              
                return null
              }))
              if(marketsRef.current){
                markets.map((m) => {
                  if(marketsRef.current && m){
                  const market = marketsRef.current.find(x => x?.symbol === m.symbol)
                  if (market){
                    m.spinner = market.spinner
                    m.supplySpinner = market.supplySpinner
                    m.withdrawSpinner = market.withdrawSpinner
                    m.borrowSpinner = market.borrowSpinner
                    m.repaySpinner = market.repaySpinner
                  }
                }
                  return true
                })
              }
              setMarketsData(markets)
              if(selectedMarketRef.current && markets)
              {
                const market = markets.find(x=>x?.symbol === selectedMarketRef.current?.symbol)
                if (market)
                  setSelectedMarket(market)
              }
            }
          }
          catch(err){
            console.log(err)
            setUpdate(true)
            if(provider.current && network.current && userAddress.current){
              const comptroller =  await getComptrollerData(provider.current, userAddress.current, network.current)
              setComptrollerData(comptroller) 
            }
          }
          finally{
            if(!updateRef.current)
            if (spinner.current) spinner.current(false)
          }
        }


        if(comptrollerData){
            GetMarkets()
        }
        else{
            //setGeneralData(null)
            setMarketsData(null)
        }
    }, [comptrollerData])

    //Get General Data
    useEffect (() => {
        const GetGeneral = async () => {
            if(!updateRef.current)
            if (spinner.current) spinner.current(true)
              if(marketsRef.current){
                const data = await getGeneralDetails(marketsRef.current)
                setGeneralData(data)
            
              }
            if(!updateRef.current)
            if (spinner.current) spinner.current(false)
        }

        if (marketsData){
            GetGeneral()
        }
        else{
            setGeneralData(null)
        }
    },[marketsData])

    const getMaxAmount = async (market: CTokenInfo) : Promise<BigNumber> => {
        if (market.isNativeToken && props.provider) {
          const gasPrice = await props.provider.getGasPrice()
          const price = BigNumber.parseValue(gasPrice.toString()).mul(BigNumber.from(gasLimit))
          const balance = market.walletBalance.sub(price)
          return balance
        }
        
      return market.walletBalance
    }

    const getMaxRepayAmount = (market: CTokenInfo) : BigNumber => {
      const maxRepayFactor = BigNumber.from("1").add(market.borrowApy); // e.g. Borrow APY = 2% => maxRepayFactor = 1.0002
      if (market.isNativeToken) {
        return market.borrowBalanceInTokenUnit//.times(maxRepayFactor).decimalPlaces(18); // Setting it to a bit larger, this makes sure the user can repay 100%.
      }
      return market.borrowBalanceInTokenUnit.mul(maxRepayFactor); // The same as ETH for now. The transaction will use -1 anyway.
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
            const comptroller =  await getComptrollerData(provider.current, userAddress.current, network.current)
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
            const comptroller =  await getComptrollerData(provider.current, userAddress.current, network.current)
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
            borrowDialog ? market.repaySpinner = true : market.supplySpinner = true
            if(selectedMarketRef.current)
              borrowDialog ? selectedMarketRef.current.repaySpinner = true : selectedMarketRef.current.supplySpinner = true
            const signer = provider.current.getSigner()
            if(market.underlyingAddress){
              const contract = new ethers.Contract(market.underlyingAddress, TOKEN_ABI, signer);
              const tx = await contract.approve(market.pTokenAddress, MaxUint256._value)
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
            if(market)
              borrowDialog ? market.repaySpinner = false : market.supplySpinner = false

            setUpdate(true)
            if(provider.current && network.current && userAddress.current){
              const comptroller = await getComptrollerData(provider.current, userAddress.current, network.current)
              setComptrollerData(comptroller)
            }
            if(selectedMarketRef.current && selectedMarketRef.current.symbol === symbol)
              borrowDialog ? selectedMarketRef.current.repaySpinner = false : selectedMarketRef.current.supplySpinner = false
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
            const am = (market.isNativeToken) ? {value: ethers.utils.parseEther(amount)} : ethers.utils.parseUnits(amount, market.decimals)
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
          }
          catch(err){
            console.log(err)
          }
          finally{
            if (spinner.current) spinner.current(false)
            market = marketsRef.current.find(x =>x?.symbol === symbol)
            if(market)
              market.supplySpinner = false

            setUpdate(true)
            if(provider.current && network.current && userAddress.current){
              const comptroller = await getComptrollerData(provider.current, userAddress.current, network.current)
              setComptrollerData(comptroller)
            }
            if(selectedMarketRef.current && selectedMarketRef.current.symbol === symbol)
              selectedMarketRef.current.supplySpinner = false
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
            const signer = provider.current.getSigner()
            const token = market.isNativeToken ? CETHER_ABI : CTOKEN_ABI
            const ctoken = new ethers.Contract(market.pTokenAddress, token, signer)

            if (selectedMarketRef.current)
              selectedMarketRef.current.withdrawSpinner = true

            market.withdrawSpinner = true

            if (max){
              const accountSnapshot = await ctoken.getAccountSnapshot(userAddress.current)
              const withdraw = ethers.BigNumber.from(accountSnapshot[1].toString())
              const tx = await ctoken.redeem(withdraw)
              if (spinner.current) spinner.current(false)
              console.log(tx)
              const receipt = await tx.wait()
              console.log(receipt)
            }
            else{
              const withdraw = ethers.utils.parseUnits(amount.toString(), market.decimals)
              const tx = await ctoken.redeemUnderlying(withdraw)
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
            market = marketsRef.current.find(x => x?.symbol === symbol)
            if(market)
              market.withdrawSpinner = false
            setUpdate(true)
            if(provider.current && network.current && userAddress.current){
              const comptroller = await getComptrollerData(provider.current, userAddress.current, network.current)
              setComptrollerData(comptroller)
            }
            if(selectedMarketRef.current && selectedMarketRef.current.symbol === symbol)
              selectedMarketRef.current.withdrawSpinner = false
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
          const am = ethers.utils.parseUnits(amount, market.decimals)
          if (selectedMarketRef.current)
            selectedMarketRef.current.borrowSpinner = true
          market.borrowSpinner = true
          const signer = provider.current.getSigner()
          const token = market.isNativeToken ? CETHER_ABI : CTOKEN_ABI
          const ctoken = new ethers.Contract(market.pTokenAddress, token, signer)
          const tx = await ctoken.borrow(am)

          if (spinner.current) spinner.current(false)

          console.log(tx)
          const receipt = await tx.wait()
          console.log(receipt)
        }
        catch(err){
          console.log(err)
        }
        finally{
          if (spinner.current) spinner.current(false)
          market = marketsRef.current.find(x => x?.symbol === symbol)
          if(market)
            market.borrowSpinner = false
          setUpdate(true)
          
          if(provider.current && network.current && userAddress.current){
            const comptroller = await getComptrollerData(provider.current, userAddress.current, network.current)
            setComptrollerData(comptroller)
          }
          
          if(selectedMarketRef.current && selectedMarketRef.current.symbol === symbol)
            selectedMarketRef.current.borrowSpinner = false
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
          const am = (market.isNativeToken) ? ({value: ethers.utils.parseEther(amount)}) : 
                   (fullRepay ? MaxUint256 : ethers.utils.parseUnits(amount, market.decimals))
          
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
        }
        catch(err){
          console.log(err)
        }
        finally{
          if (spinner.current) spinner.current(false)
          market = marketsRef.current.find(x => x?.symbol === symbol)
          if(market)
            market.repaySpinner = false

          setUpdate(true)

          if(provider.current && network.current && userAddress.current){
            const comptroller = await getComptrollerData(provider.current, userAddress.current, network.current)
            setComptrollerData(comptroller)
          }

          if(selectedMarketRef.current && selectedMarketRef.current.symbol === symbol)
            selectedMarketRef.current.repaySpinner = false
        }
      }
    }
  }
    
    return (
        <div className="content">
            <GeneralDetails generalData={generalData}/>
            <Markets generalData = {generalData} marketsData = {marketsRef.current} enterMarketDialog={enterMarketDialog} 
              supplyMarketDialog={supplyMarketDialog} borrowMarketDialog={borrowMarketDialog}/>
              <EnterMarketDialog open={openEnterMarket} market={selectedMarket} generalData={generalData} closeMarketDialog = {closeMarketDialog} 
              handleEnterMarket={handleEnterMarket} handleExitMarket={handleExitMarket}/>
            <SupplyMarketDialog open={openSupplyMarketDialog} market={selectedMarketRef.current} generalData={generalData} 
              closeSupplyMarketDialog = {closeSupplyMarketDialog} darkMode={props.darkMode} 
              handleEnable = {handleEnable} handleSupply={handleSupply} handleWithdraw={handleWithdraw} getMaxAmount={getMaxAmount} spinnerVisible={props.spinnerVisible}/>
            <BorrowMarketDialog open={openBorrowMarketDialog} market={selectedMarket} generalData={generalData} 
              closeBorrowMarketDialog={closeBorrowMarketDialog} darkMode={props.darkMode} getMaxAmount={getMaxAmount} handleEnable = {handleEnable}
              handleBorrow={handleBorrow} handleRepay={handleRepay} getMaxRepayAmount={getMaxRepayAmount} spinnerVisible={props.spinnerVisible}/> 
        </div>
    )
}

export default Content