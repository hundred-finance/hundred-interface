import React, { useState, useEffect, useRef } from 'react'
import {lightTheme, darkTheme, Theme} from './theme'
import { ethers } from 'ethers'
import './App.css';
import Wrapper from './Components/Wrapper/wrapper'
import Menu from './Components/Menu/menu'
import { Network } from './networks'
import TabletMenu from './Components/Menu/tabletMenu';
import SideMenu from './Components/SideMenu/sideMenu';
import AccountSettings from './Components/SideMenu/accountSettings';
import Footer from './Components/Footer/footer';
import Spinner from './Components/Spinner/spinner';
import Content from './Components/Content/content';
import NetworksView from './Components/SideMenu/networksView';
import { COMPTROLLER_ABI , MINTER_ABI , VOTING_ESCROW_ABI, HUNDRED_ABI } from './abi';
import {ErrorBoundary} from "react-error-boundary"
import { ToastContainer, toast } from 'react-toastify'
import ReactToolTip from 'react-tooltip'
import 'react-toastify/dist/ReactToastify.css'
import HundredMenu from './Components/SideMenu/hundredMenu';
import { BigNumber } from './bigNumber';
import { AirdropType } from './Components/AirdropButton/airdropButton';
import AirdropMenu from './Components/SideMenu/airdropMenu';
import Buffer from "buffer"
import { MyUiContext } from './Types/uiContext';
import { MyGlobalContext } from './Types/globalContext';
import { useWeb3React } from '@web3-react/core';
import { GetConnector } from './Connectors/connectors';
import {ExecuteWithExtraGasLimit} from "./Classes/TransactionHelper";

declare global {
  interface Window {
    ethereum: any,
  }
}

global.Buffer = window.Buffer || Buffer.Buffer

const App: React.FC = () => {
  const { library, activate} = useWeb3React()

  const [address, setAddress] = useState<string>("")
  const [hundredBalance, setHundredBalace] = useState<BigNumber | null>(null)
  const [hndBalance, setHndBalance] = useState<BigNumber | null>(null)
  const [hndEarned, setHndEarned] = useState<BigNumber |null>(null)
  const [vehndBalance, setVehndBalance] = useState<BigNumber | null>(null)
  const [hndRewards, setHndRewards] = useState<BigNumber | null>(null)
  const [gaugeAddresses, setGaugeAddresses] = useState<string[] | null>(null)
  const [network, setNetwork] = useState<Network | null>(null)
  const [hndPrice, setHndPrice] = useState<number>(0)
  const [hasClaimed, setHasClaimed] = useState<boolean>(false)
  const [airdrops, setAirdrops] = useState<AirdropType[]>([])
  const updatePrice = useRef<NodeJS.Timeout | null>(null)
  const [updateEarned, setUpdateEarned] = useState<boolean>(false)

  const networkRef = useRef<Network | null>(null)
 
  networkRef.current = network

  const [sideMenu, setSideMenu] = useState<boolean>(false)
  const [darkMode, setDarkMode] = useState<boolean>(false)
  const [spinnerVisible, setSpinnerVisible] = useState<boolean>(false)
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const [isTablet, setIsTablet] = useState<boolean>(false)
  const [show, setShow] = useState<boolean>(false)
  const [theme, setTheme] = useState<Theme>(lightTheme)
  const [openAddress, setOpenAddress] = useState<boolean>(false)
  const [openNetwork, setOpenNetwork] = useState<boolean>(false)
  const [openHundred, setOpenHundred] = useState<boolean>(false)
  const [openAirdrop, setOpenAirdrop] = useState<boolean>(false)
  const [hndSpinner, setHndSpinner] = useState<boolean>(false)
  const [airdropSpinner, setAirdropSpinner] = useState<boolean>(false)
  const [switchModal, setSwitchModal] = useState(false)
  

const resizeWindow = ()=>{
  if (document.documentElement.clientWidth < (!hasClaimed ? 750 : 925)){
    setIsMobile(true)
    setIsTablet(false)
  }
  else if (document.documentElement.clientWidth < (!hasClaimed ? 1064 : 1192)){

    setIsTablet(true)
    setIsMobile(false)
  }
  else setIsTablet(false)
}

  useEffect(() => {
    if (document.documentElement.clientWidth < (!hasClaimed ? 750 : 925)){
      setIsMobile(true)
      setIsTablet(false)
    }
    else if (document.documentElement.clientWidth < (!hasClaimed ? 1064 : 1192)){
  
      setIsTablet(true)
      setIsMobile(false)
    }
    else setIsTablet(false)

    window.addEventListener('resize', resizeWindow)

    setShow(true)
      
    const darkmode = window.localStorage.getItem("hundred-darkmode")
    const net = window.localStorage.getItem("hundred-network")
    const prov = window.localStorage.getItem("hundred-provider")
    
    let tempNet: Network | null = null



    if(darkmode && darkmode === "dark")
      setDarkMode(true)
    else
      setDarkMode(false)
    
    if(net)
      tempNet = JSON.parse(net) as Network

    if(prov) 
    {
      const con = GetConnector(+prov, tempNet ? tempNet.chainId : undefined)
      activate(con)
    }
    

    setSpinnerVisible(false)
    const hndPrice = getHndPrice()
    Promise.all([hndPrice])
  }, [])

  useEffect(() => {
    window.localStorage.setItem("hundred-network", JSON.stringify(network))
    
  }, [network])

  useEffect(() => {
    if(darkMode){
      window.localStorage.setItem("hundred-darkmode", "dark")
      setTheme(darkTheme)
    }
    else{
      window.localStorage.setItem("hundred-darkmode", "light")
      setTheme(lightTheme)
    }
  }, [darkMode])

  const getHndPrice = async () : Promise<void>  => {
    if(updatePrice.current) clearTimeout(updatePrice.current)
    try{
        const url =  "https://api.coingecko.com/api/v3/simple/price?ids=hundred-finance&vs_currencies=usd"
        const headers = {}
        const response = await fetch(url,
            {
                method: "GET",
                mode: 'cors',
                headers: headers
            }
          )
          const data = await response.json()
          const hnd = data ? data["hundred-finance"] : null
          const usd: number = hnd ? +hnd.usd : 0
    
          setHndPrice(usd)
    }
    catch(err){
        console.log(err)
    }
    finally{
      updatePrice.current = setTimeout(getHndPrice, 60000)
    }
  }

  // const getHndBalances = async (prv : any) : Promise<void> => {
  //   if(network && prv){
  //     try {
  //       const ethcallProvider = new Provider()
  //       await ethcallProvider.init(prv)
  //       const balanceContract = new Contract(network.HUNDRED_ADDRESS, HUNDRED_ABI)
  //       //const earnedContract = new Contract(network.UNITROLLER_ADDRESS, COMPTROLLER_ABI)
        
  //       let [balance, decimals, symbol, hndBalance] = ["", 0, "", "", null]

  //       network.HUNDRED_CONTRACT_ADDRESS ? [balance, decimals, symbol, hndBalance] = await ethcallProvider.all(
  //         [balanceContract.balanceOf(address), balanceContract.decimals(), balanceContract.symbol(), 
  //           balanceContract.balanceOf(network.HUNDRED_CONTRACT_ADDRESS)])
  //       : [balance, decimals, symbol] = await ethcallProvider.all(
  //         [balanceContract.balanceOf(address), balanceContract.decimals(), balanceContract.symbol()])
        
  //       if(hndBalance) setHundredBalace(BigNumber.from(hndBalance, 18))
  //       else setHundredBalace(null)

  //       setHndBalance(new HundredBalance(BigNumber.from(balance, decimals), symbol))
  //       //setHndEarned(new HundredBalance( earned, 18, "HND"))
  //     } catch (error) {
  //       console.log(error)
  //       setHndBalance(null)
  //       //setHndEarned(null)
  //     }
  //   }
  // }
  useEffect(() => {
    if(!updateEarned){
      setHndSpinner(false)
    }
  }, [updateEarned])

  const handleCollect = async (): Promise<void> => {
    if(library && network){
      try{
        setHndSpinner(true)
        setSpinnerVisible(true)
        const signer = library.getSigner()
        const comptroller = new ethers.Contract(network.unitrollerAddress, COMPTROLLER_ABI, signer)
        const receipt = await ExecuteWithExtraGasLimit(comptroller, "claimComp", [address], () => setSpinnerVisible(false))
        
        console.log(receipt)
        setUpdateEarned(true)
        //await getHndBalances(provider)
      }
      catch(err){
        console.log(err)
        setHndSpinner(false)
        setSpinnerVisible(false)
      }
    }
  }

  const handleClaimHnd = async (): Promise<void> => {
    if(library && network){
      try{
        setHndSpinner(true)
        setSpinnerVisible(true)

        const signer = library.getSigner()
        let mintAddress = ''
        network.lendly ? network.minterAddressLendly ? mintAddress = network.minterAddressLendly : null: null;
        network.minterAddress ? mintAddress = network.minterAddress : null; 

        const minter = new ethers.Contract(mintAddress, MINTER_ABI, signer)
        const receipt = await ExecuteWithExtraGasLimit(minter, "mint_many", [gaugeAddresses], () => setSpinnerVisible(false))
        console.log(receipt)
        setUpdateEarned(true)
      }
      
      
  catch(err){
        console.log(err)
        setHndSpinner(false)
        setSpinnerVisible(false)
      }}}

 const handleClaimLockHnd = async (): Promise<void> => {
    if(library && network && address){
      try{
        setHndSpinner(true)
        setSpinnerVisible(true)
        await handleClaimHnd()

        const signer = library.getSigner()
        if (network.votingAddress) 
        {   
        
         const votingContract = new ethers.Contract(network.votingAddress, VOTING_ESCROW_ABI, signer); 
         const balanceContract = new ethers.Contract(network.hundredAddress, HUNDRED_ABI, library)
         const rewards = await balanceContract.balanceOf(address)
         const receipt = await ExecuteWithExtraGasLimit(votingContract, "increase_amount", [rewards], () => setSpinnerVisible(false))
         
         console.log(receipt)
         setUpdateEarned(true)
        }
       
      }
      
      
  catch(err){
        console.log(err)
        setHndSpinner(false)
        setSpinnerVisible(false)
      }}}

  const myErrorHandler = (error: Error, info: {componentStack: string}) => {
    console.log(error)
    console.log(info)
    toast.error('An error has occurred, please check console log.', {
      position: "top-right",
      autoClose: 10000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      });
  }

  const errorFallback = () => {
    return(
      <ErrorBoundary fallbackRender={errorFallback} onError={myErrorHandler}>
        <Content  address={address}
          hndPrice={hndPrice}
          setHndEarned={setHndEarned} setHndBalance={setHndBalance} setHundredBalance={setHundredBalace} 
          updateEarned={updateEarned} setUpdateEarned={setUpdateEarned} setHasClaimed={setHasClaimed} 
          setVehndBalance = {setVehndBalance} setHndRewards = {setHndRewards} setGaugeAddresses ={setGaugeAddresses}/>
      </ErrorBoundary>
    )
  }

  const toastError = (error: string, autoClose = true, closeDelay = 10000) => {
    toast.error(error, {
      position: "top-right",
      autoClose: autoClose ? closeDelay : false,
      hideProgressBar: autoClose ? false : true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      icon: true
      });
  }

  const toastSuccess = (message: string, autoClose = true, closeDelay = 10000) => {
    toast.success(message, {
      position: "top-right",
      autoClose: autoClose ? closeDelay : false,
      hideProgressBar: autoClose ? false : true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      icon: true
      });
  }

  return (
    theme ?
    <MyGlobalContext.Provider value={({network, setNetwork})}>
        <MyUiContext.Provider value={({sideMenu, setSideMenu,
                                    darkMode, setDarkMode,
                                    spinnerVisible, setSpinnerVisible,
                                    isMobile, setIsMobile,
                                    isTablet, setIsTablet,
                                    show, setShow,
                                    theme, setTheme,
                                    openAddress, setOpenAddress,
                                    openNetwork, setOpenNetwork,
                                    openHundred, setOpenHundred,
                                    openAirdrop, setOpenAirdrop,
                                    hndSpinner, setHndSpinner,
                                    airdropSpinner, setAirdropSpinner,
                                    toastSuccessMessage: toastSuccess, toastErrorMessage: toastError,
                                    switchModal, setSwitchModal})}>
          <div id="app" className={`App scroller ${darkMode ? "dark-theme" : ""}`}>
            <Wrapper sideMenu={sideMenu}>
              {!isTablet && !isMobile ? 
                <Menu address={address} setAddress={setAddress} 
                      hasClaimed={hasClaimed} setHasClaimed={setHasClaimed}
                      airdrops={airdrops} setAirdrops={setAirdrops}/>
                : <TabletMenu address={address} setAddress={setAddress}
                    hasClaimed={hasClaimed} airdrops={airdrops} setAirdrops={setAirdrops}
                    setHasClaimed={setHasClaimed}/>
              }
              <ErrorBoundary fallbackRender={errorFallback} onError={myErrorHandler}>
                <Content address={address}
                  hndPrice={hndPrice} 
                  setHndEarned={setHndEarned} setHndBalance={setHndBalance} setHundredBalance={setHundredBalace} 
                  updateEarned={updateEarned} setUpdateEarned={setUpdateEarned} setHasClaimed={setHasClaimed}
                  setVehndBalance = {setVehndBalance} setHndRewards = {setHndRewards} setGaugeAddresses = {setGaugeAddresses} />
              </ErrorBoundary>
              <ToastContainer/>
            </Wrapper>
            <Footer darkMode={darkMode} isMobile={isMobile}/>
            <SideMenu open={sideMenu} setSideMenu={setSideMenu} setOpenAddress={setOpenAddress} setOpenNetwork={setOpenNetwork} setOpenHundred={setOpenHundred} setOpenAirdrop={setOpenAirdrop}>
              { openAddress ? 
                  <AccountSettings address={address} setAddress={setAddress}/> 
                  : (openNetwork ? 
                  <NetworksView/> 
                  : openHundred ? 
                  <HundredMenu hndBalance={hndBalance} hndEarned={hndEarned}
                    handleCollect={handleCollect} handleClaimHnd={handleClaimHnd} handleClaimLockHnd = {handleClaimLockHnd} address={address} hndPrice={hndPrice} hundredBalance={hundredBalance} 
                    vehndBalance={vehndBalance} hndRewards={hndRewards} /> 
                  : openAirdrop ? 
                  <AirdropMenu airdrops={airdrops} setAirdrops={setAirdrops}  address={address}/>
                  : null)
              }
            </SideMenu>
            <ReactToolTip id="tooltip" effect="solid"/>
            <Spinner/>
          </div>
        </MyUiContext.Provider>
    </MyGlobalContext.Provider>
    : <div className="App">
      </div>
  )
}

export default App;
