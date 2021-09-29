import { ethers} from "ethers"
import { BigNumber } from "../../bigNumber"
import React, { useEffect,  useRef, useState } from "react"
import {CTOKEN_ABI, TOKEN_ABI, CETHER_ABI } from "../../abi"
import GeneralDetails from "../GeneralDetails/generalDetails"
import { Network } from "../../networks"
import { Comptroller, getComptrollerData } from "../../Classes/comptrollerClass"
import { CTokenInfo, getCtokenInfo, getTokenBalances } from "../../Classes/cTokenClass"
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
  setHndPrice: React.Dispatch<React.SetStateAction<number>>,
  address: string,
  provider: ethers.providers.Web3Provider | null,
  spinnerVisible: boolean,
  darkMode: boolean
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

    const [pauseUpdate, setPauseUpdate] = useState<boolean>(false)
    const [updateCounter, setUpdateCounter] = useState<number>(0)
    const [updateHandle, setUpdateHandle] = useState<number | null>(null)

    const [hndPrice, setHndPrice] = useState<number>(0)

    const comptrollerDataRef = useRef<Comptroller | null>(null)
    const spinner = useRef<React.Dispatch<React.SetStateAction<boolean>> | null>(null)
    const updateRef = useRef<boolean | null>()
    const marketsRef = useRef<(CTokenInfo | null)[] | null | undefined>(null)
    const selectedMarketRef = useRef<CTokenInfo | null>(null)
    const provider = useRef<ethers.providers.Web3Provider | null>(null)
    const userAddress = useRef<string | null>(null)
    const network = useRef<Network | null>(null)
    const updateCounterRef = useRef<number>(0)
    const hndPriceRef = useRef<number>(0)

    provider.current = props.provider
    userAddress.current = props.address
    network.current = props.network
    comptrollerDataRef.current = comptrollerData
    marketsRef.current = marketsData
    updateRef.current = update
    spinner.current = props.setSpinnerVisible
    selectedMarketRef.current = selectedMarket
    updateCounterRef.current = updateCounter
    hndPriceRef.current = hndPrice

    useEffect(() => {
      updateCounterRef.current = updateCounter
    },[updateCounter])


    const getHndPrice = async ()  => {
      const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=hundred-finance&vs_currencies=usd"
        );
        const data = await response.json()
        const hnd = data ? data["hundred-finance"] : null
        const usd: number = hnd ? +hnd.usd : 0
       
        setHndPrice(usd)
        props.setHndPrice(usd)
    }

    const handleUpdate = async (market?: CTokenInfo, spinner?: string) : Promise<void> => {
      if(market && spinner){
        if(updateHandle) clearTimeout(updateHandle)
        setUpdate(true)
        setPauseUpdate(true)
        await updateMarket(market, spinner)
        setPauseUpdate(false)
      }
      else if(!pauseUpdate){
        if(updateCounterRef.current === 12){
          setUpdate(true)
          await dataUpdate()
        }
        else {
          setUpdate(true)
          await GetWalletBalances()
        }
      }
      setUpdateHandle(setTimeout(handleUpdate, 5000))
    }

    const GetWalletBalances = async () => {
      try {
        if(marketsRef.current && comptrollerDataRef.current && userAddress.current && marketsRef.current.length > 0 && !pauseUpdate){
          const balances = await getTokenBalances(marketsRef.current, comptrollerDataRef.current, userAddress.current)
          if(!pauseUpdate){
            if(balances){
              if(marketsData && marketsRef.current && comptrollerDataRef.current && userAddress.current && marketsData && marketsData.length > 0){
                setMarketsData(prevState => {
                  return prevState?.map(el => {
                    const b = balances.find(x => x?.symbol === el?.symbol)
                    if(b && el){
                      return{
                        ...el,
                        walletBalance: b.walletBalance
                      }
                    }
                    else{
                      return el
                    }
                  })
                })
              }
              if(selectedMarketRef.current && balances){
                const market = balances.find(x=>x?.symbol === selectedMarketRef.current?.symbol)
                if (market)
                  setSelectedMarket(market)
              }
            }
              setUpdateCounter(updateCounterRef.current + 1)
          }
        }
      } 
      catch (error) {
        console.log(error)
      }
    }

    const dataUpdate = async () => {
      try {
        if(provider.current && network.current && userAddress.current){
          if(!updateRef.current){
            if(spinner.current) spinner.current(true)
          }
          else{
            if(spinner.current) spinner.current(false)
          }

          await getHndPrice()

          let comptroller = null

          if(comptrollerData) 
            comptroller = comptrollerData
          else
          {
            comptroller = await getComptrollerData(provider.current, userAddress.current, network.current)
            setComptrollerData(comptroller)
          }

          if(provider.current && comptrollerDataRef.current){
            const markets = await Promise.all(comptrollerDataRef.current.allMarkets?.filter((a) => {
              if (a.toLowerCase() === "0xc98182014c90baa26a21e991bfec95f72bd89aed")
                 return false
              return true
                }).map(async (a) => {
                  const isNativeToken = a.toLowerCase() ===  network?.current?.token
            
              //const ctokenInfo = await getCTokenInfo.current(a, isNativeToken)
              if(provider.current && network.current && userAddress.current && comptrollerDataRef.current)
                return await getCtokenInfo(a, isNativeToken, provider.current, userAddress.current, comptrollerDataRef.current, network.current, hndPriceRef.current)
            
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
              
            if(!pauseUpdate){
              setMarketsData(markets)

              if(markets){
                const data = await getGeneralDetails(markets)
                setGeneralData(data)
              }
              if(selectedMarketRef.current && markets)
              {
                const market = markets.find(x=>x?.symbol === selectedMarketRef.current?.symbol)
                if (market)
                  setSelectedMarket(market)
              }
              setUpdateCounter(0)
            }
          }
        } 
      } catch (error) {
        dataUpdate()
        console.log(error)
      }
      finally{
        if(spinner.current) spinner.current(false)
      }
    }

    //Get Comptroller Data
    useEffect(() => {
        const getData= async () => {
          try{
            await dataUpdate()
            setUpdateHandle(setTimeout(handleUpdate, 5000))
          }
          catch(error){
            console.log("retry 1")
            console.log(error)
          }
        }
        if(provider.current && network.current && network.current.chainId && userAddress.current && userAddress.current !== ""){
            try{
              if(updateHandle) {
                setUpdate(true)
                clearTimeout(updateHandle)
                setUpdateCounter(0)
              }
              props.setSpinnerVisible(true)
              setUpdate(false)
              getData()
            }
            catch(err){
                console.log("retry 2")
                console.log(err)
            }
        }
        else{
            setComptrollerData(null)
            setMarketsData(null)
            setGeneralData(null)
            setSelectedMarket(null)
            if(updateHandle) clearTimeout(updateHandle)
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
      
      
      if(market.isNativeToken) updateMarket(market, "repay")
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

    const updateMarket = async (market : CTokenInfo, spinner: string) : Promise<void>=> {
      try {
        if(market && provider.current && userAddress.current && comptrollerDataRef.current && network.current){
          const ctokenInfo = await getCtokenInfo(market.pTokenAddress, market.isNativeToken, provider.current, userAddress.current, comptrollerDataRef.current, network.current, hndPriceRef.current) 
          if(ctokenInfo){
            switch (spinner) {
              case "supply":
                ctokenInfo.spinner = market.spinner
                ctokenInfo.supplySpinner = false
                ctokenInfo.withdrawSpinner = market.withdrawSpinner
                ctokenInfo.borrowSpinner = market.borrowSpinner
                ctokenInfo.repaySpinner = market.repaySpinner
                break;
              case "withdraw":
                ctokenInfo.spinner = market.spinner
                ctokenInfo.supplySpinner = market.supplySpinner
                ctokenInfo.withdrawSpinner = false
                ctokenInfo.borrowSpinner = market.borrowSpinner
                ctokenInfo.repaySpinner = market.repaySpinner
                break;
              case "borrow":
                ctokenInfo.spinner = market.spinner
                ctokenInfo.supplySpinner = market.supplySpinner
                ctokenInfo.withdrawSpinner = market.withdrawSpinner
                ctokenInfo.borrowSpinner = false
                ctokenInfo.repaySpinner = market.repaySpinner
                break;
              case "repay":
                ctokenInfo.spinner = market.spinner
                ctokenInfo.supplySpinner = market.supplySpinner
                ctokenInfo.withdrawSpinner = market.withdrawSpinner
                ctokenInfo.borrowSpinner = market.borrowSpinner
                ctokenInfo.repaySpinner = false
                break;
              default:
                break;
            }
            if(marketsData){
              setMarketsData(prevState => {
                return prevState?.map(el => el?.symbol === ctokenInfo.symbol ? {
                  ...el,
                  supplyApy: ctokenInfo.supplyApy,
                  borrowApy: ctokenInfo.borrowApy,
                  underlyingAllowance: ctokenInfo.underlyingAllowance,
                  walletBalance: ctokenInfo.walletBalance,
                  supplyBalanceInTokenUnit: ctokenInfo.supplyBalanceInTokenUnit,
                  supplyBalance: ctokenInfo.supplyBalance,
                  marketTotalSupply: ctokenInfo.marketTotalSupply,
                  borrowBalanceInTokenUnit: ctokenInfo.borrowBalanceInTokenUnit,
                  borrowBalance: ctokenInfo.borrowBalance,
                  marketTotalBorrowInTokenUnit: ctokenInfo.marketTotalBorrowInTokenUnit,
                  marketTotalBorrow: ctokenInfo.marketTotalBorrow,
                  isEnterMarket: ctokenInfo.isEnterMarket,
                  underlyingAmount: ctokenInfo.underlyingAmount,
                  underlyingPrice: ctokenInfo.underlyingPrice,
                  liquidity: ctokenInfo.liquidity,
                  collateralFactor: ctokenInfo.collateralFactor,
                  hndSpeed: ctokenInfo.hndSpeed,
                  spinner: ctokenInfo.spinner,
                  supplySpinner: ctokenInfo.supplySpinner,
                  withdrawSpinner: ctokenInfo.withdrawSpinner,
                  borrowSpinner: ctokenInfo.borrowSpinner,
                  repaySpinner: ctokenInfo.repaySpinner,
                  borrowHndApy: ctokenInfo.borrowHndApy,
                  hndAPR: ctokenInfo.hndAPR,
                  totalSupplyApy: ctokenInfo.totalSupplyApy
                } : el)
              })
              
              const data = await getGeneralDetails(marketsData)
              setGeneralData(data)
              
            }
            if(selectedMarketRef.current && selectedMarketRef.current.symbol === ctokenInfo.symbol){
              setSelectedMarket(ctokenInfo)
            }
          }
        }
      } catch (error) {
        
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
              await updateMarket(market, "withdraw")
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
              await updateMarket(market, "borrow")
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
              await updateMarket(market, "repay")
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
            <Markets generalData = {generalData} marketsData = {marketsData} enterMarketDialog={enterMarketDialog} 
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