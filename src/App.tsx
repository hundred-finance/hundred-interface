import React, { useState, useEffect, useRef } from 'react'
import {lightTheme, darkTheme, Theme} from './theme'
import { ethers } from 'ethers'
import './App.css';
import Wrapper from './Components/Wrapper/wrapper'
import Menu from './Components/Menu/menu'
import {NETWORKS, Network} from './networks'
import TabletMenu from './Components/Menu/tabletMenu';
import SideMenu from './Components/SideMenu/sideMenu';
import AccountSettings from './Components/SideMenu/accountSettings';
import Footer from './Components/Footer/footer';
import Spinner from './Components/Spinner/spinner';
import Content from './Components/Content/content';
import NetworksView from './Components/SideMenu/networksView';
import { COMPTROLLER_ABI } from './abi';
import {ErrorBoundary} from "react-error-boundary"
import { ToastContainer, toast } from 'react-toastify'
import ReactToolTip from 'react-tooltip'
import 'react-toastify/dist/ReactToastify.css'
import HundredMenu from './Components/SideMenu/hundredMenu';
import { BigNumber } from './bigNumber';


declare global {
  interface Window {
    ethereum: any
  }
}

const App: React.FC = () => {
  const [address, setAddress] = useState<string>("")
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null)
  const [hundredBalance, setHundredBalace] = useState<BigNumber | null>(null)
  const [hndBalance, setHndBalance] = useState<BigNumber | null>(null)
  const [hndEarned, setHndEarned] = useState<BigNumber |null>(null)
  const [hndSpinner, setHndSpinner] = useState<boolean>(false)
  const [network, setNetwork] = useState<Network | null>(null)
  const [hndPrice, setHndPrice] = useState<number>(0)

  // const addressRef = useRef<string>(address)
  // const setAddressRef = useRef<React.Dispatch<React.SetStateAction<string>>>(setAddress)
  // const setProviderRef = useRef<React.Dispatch<React.SetStateAction<ethers.providers.Web3Provider | null>>>(setProvider)
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
  const [updatePrice, setUpdatePrice] = useState<number | null>(null)
  const [updateEarned, setUpdateEarned] = useState<boolean>(false)

  useEffect(() => {
    if (document.documentElement.clientWidth < 750){
      setIsMobile(true)
      setIsTablet(false)
    }
    else if (document.documentElement.clientWidth < 943){
  
      setIsTablet(true)
      setIsMobile(false)
    }
    else setIsTablet(false)

    setShow(true)

    window.addEventListener('resize', ()=>{
      if (document.documentElement.clientWidth < 750){
        setIsMobile(true)
        setIsTablet(false)
      }
      else if (document.documentElement.clientWidth < 943){
    
        setIsTablet(true)
        setIsMobile(false)
      }
      else setIsTablet(false)
    });

    const connect: () => void = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          window.ethereum.on('chainChanged', (chainId: string) => {
            const net = NETWORKS[chainId]
            if (net)
              setNetwork(net)
            else setNetwork(null)
          })
          window.ethereum.on('accountsChanged', (accounts: string[]) => {
            if(accounts && accounts.length > 0){
              setAddress(accounts[0])
            }
            else
              setAddress("")
          })
        } catch (error: any) {
          if (error.code === 4001) {
            // User rejected request
          }
      
          console.log(error)
        }
      }
    }
      
    const darkmode = window.localStorage.getItem("hundred-darkmode")
    const addr = window.localStorage.getItem("hundred-address")

    if(darkmode && darkmode === "dark")
      setDarkMode(true)
    else
      setDarkMode(false)
    
    const onLoadSetAddress = async (addr: string) : Promise<void>=>{
      if(window.ethereum){
        const accounts: string[] = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if(accounts && accounts.length > 0){
          setAddress(addr)
          connect() 
        }
      }
    }

    if(addr && addr !== "")
      onLoadSetAddress(addr)

    setSpinnerVisible(false)
  }, [])

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

  useEffect(() => {
    window.localStorage.setItem("hundred-address", address)
    if(address === ""){
      setProvider(null)
    }
    else{
      try {
        const chain = window.ethereum.chainId
        setAddress("0x87616fA850c87a78f307878f32D808dad8f4d401")
        if(networkRef.current && networkRef.current.chainId === chain){
          try{
            const prov = new ethers.providers.Web3Provider(window.ethereum)
            setProvider(prov)
          }
          catch(err){
            console.log(err)
          }
        }
        else{
            setNetwork(NETWORKS[chain]) 
        }
      }
      catch (err){
        console.log(err)
      }
    }
  }, [address])

  useEffect(() => {
    setSideMenu(false)
    if(networkRef.current)
    {
      setOpenNetwork(false)
      try{
        const prov = new ethers.providers.Web3Provider(window.ethereum)
        if(address) setSpinnerVisible(true)
        getHndPrice()
        setProvider(prov)
      }
      catch(err){
        console.log(err)
      }
    }
    else{
      setProvider(null)
      if(updatePrice) window.clearTimeout(updatePrice)
    }

  }, [network])

  const getHndPrice = async () : Promise<void>  => {
    if(updatePrice) window.clearTimeout(updatePrice)
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
      setUpdatePrice(window.setTimeout(getHndPrice, 60000))
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
    if(provider && network){
      try{
        setHndSpinner(true)
        setSpinnerVisible(true)
        const signer = provider.getSigner()
        const comptroller = new ethers.Contract(network.UNITROLLER_ADDRESS, COMPTROLLER_ABI, signer)
        const tx = await comptroller.claimComp(address)
        setSpinnerVisible(false)
        console.log(tx)
        const receipt = await tx.wait()
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
        <Content  address={address} provider={provider} network={network} setSpinnerVisible={setSpinnerVisible} 
          spinnerVisible={spinnerVisible} darkMode={darkMode} hndPrice={hndPrice} toastError={toastError} 
          setHndEarned={setHndEarned} setHndBalance={setHndBalance} setHundredBalance={setHundredBalace} updateEarned={updateEarned} setUpdateEarned={setUpdateEarned}/>
      </ErrorBoundary>
    )
  }

  const toastError = (error: string, autoClose = true) => {
    toast.error(error, {
      position: "top-right",
      autoClose: autoClose ? 10000 : false,
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
    <div className={`App scroller ${darkMode ? "App-dark" : ""}`}>
      <Wrapper sideMenu={sideMenu}>
        {!isTablet && !isMobile ? 
          <Menu isTablet={isTablet} isMobile ={isMobile} darkMode={darkMode} show={show} setDarkMode={setDarkMode} network={network} setOpenHundred={setOpenHundred}
            address={address} setAddress={setAddress} setOpenAddress={setOpenAddress} setSideMenu={setSideMenu} setNetwork={setNetwork} setOpenNetwork={setOpenNetwork}/>
          : <TabletMenu isTablet={isTablet} isMobile ={isMobile} darkMode={darkMode} show={show} setDarkMode={setDarkMode} network={network}
              address={address} setAddress={setAddress} setOpenAddress={setOpenAddress} setSideMenu={setSideMenu} setNetwork={setNetwork} 
              setOpenNetwork={setOpenNetwork} setShow={setShow} setOpenHundred={setOpenHundred}/>
        }
        <ErrorBoundary fallbackRender={errorFallback} onError={myErrorHandler}>
          <Content  address={address} provider={provider} network={network} setSpinnerVisible={setSpinnerVisible} 
            spinnerVisible={spinnerVisible} darkMode={darkMode} hndPrice={hndPrice} toastError={toastError} 
            setHndEarned={setHndEarned} setHndBalance={setHndBalance} setHundredBalance={setHundredBalace} 
            updateEarned={updateEarned} setUpdateEarned={setUpdateEarned}/>
        </ErrorBoundary>
        <ToastContainer/>
      </Wrapper>
      <Footer darkMode={darkMode} isMobile={isMobile}/>
      <SideMenu open={sideMenu} setSideMenu={setSideMenu} setOpenAddress={setOpenAddress} setOpenNetwork={setOpenNetwork}>
        { openAddress ? 
          <AccountSettings address={address} setAddress={setAddress} setSideMenu={setSideMenu} setOpenAddress={setOpenAddress}/> : 
            (openNetwork ? <NetworksView network={network}/> : openHundred ? 
            <HundredMenu provider={provider} network={network} hndBalance={hndBalance} hndEarned={hndEarned} hndSpinner={hndSpinner}
              handleCollect={handleCollect} setOpenHundred={setOpenHundred} setSideMenu={setSideMenu} address={address} hndPrice={hndPrice} hundredBalance={hundredBalance}/> : null)
        }
      </SideMenu>
      <ReactToolTip id="tooltip" effect="solid"/>
      <Spinner open={spinnerVisible} theme={theme}/>
    </div>
    : <div className="App">
      </div>
  )
}

export default App;
