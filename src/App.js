import './App.css';
import React, { useEffect, useRef, useState } from 'react';
import Spinner from './Components/Spinner/spinner';
import Wrapper from './Components/Wrapper/wrapper';
import {lightTheme, darkTheme} from "./theme"
import SideMenu from './Components/SideMenu/sideMenu';
import DarkSwitch from './Components/DarkSwitch/darkSwitch';
import {ethers} from "ethers"
import AccountSettings from './Components/SideMenu/accountSettings';
import Content from './Components/Wrapper/content';
import Menu from './Components/Menu/menu';
import TabletMenu from './Components/Menu/tabletMenu'
import {NETWORKS} from './constants'





const App = () =>{
  const [address, setAddress] = useState("")
  const [provider, setProvider] = useState(null)
  const [pctBalance, setPctBalance] = useState(null)
  const [pctEarned, setPctEarned] = useState(null)
  const [pctSpinner, setPctSpinner] = useState(false)
  const [network, setNetwork] = useState(null)

  const addressRef = useRef()
  const setAddressRef = useRef(() => {})
  const setProviderRef = useRef(() => {})
  const networkRef = useRef()

  addressRef.current = address
  setAddressRef.current = setAddress
  setProviderRef.current = setProvider
  networkRef.current = network

  

  const [darkMode, setDarkMode] = useState(false)
  const [spinnerVisible, setSpinnerVisible] = useState(false)
  const [sideMenu, setSideMenu] = useState(false)
  const [theme, setTheme] = useState(lightTheme)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [show, setShow] = useState(false)
  const [openAddress, setOpenAddress] = useState(false)

  useEffect(() => {
    if (document.documentElement.clientWidth < 420){
      setIsMobile(true)
      setIsTablet(false)
    }
    else if (document.documentElement.clientWidth < 750){
  
      setIsTablet(true)
      setIsMobile(false)
    }
    else setIsTablet(false)

    setShow(true)

    window.addEventListener('resize', ()=>{
      if (document.documentElement.clientWidth < 420){
        setIsMobile(true)
        setIsTablet(false)
      }
      else if (document.documentElement.clientWidth < 750){
    
        setIsTablet(true)
        setIsMobile(false)
      }
      else setIsTablet(false)
    });

    const connect = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          window.ethereum.on('chainChanged', (chainId) => {
            const net = NETWORKS[chainId]
            if (net)
              setNetwork(net)
          })
          window.ethereum.on('accountsChanged', (accounts) => {
            if(accounts && accounts.length > 0){
              setAddress(accounts[0])
            }
            else
              setAddress("")
          })
        } catch (error) {
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
    
    const onLoadSetAddress = async (addr) =>{
      if(window.ethereum){
        var accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
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
    if(network)
    {
      try{
        const prov = new ethers.providers.Web3Provider(window.ethereum)
        setProvider(prov)
      }
      catch(err){
        console.log(err)
      }
    }
    else
      setProvider(null)

  }, [network])



  const handleCollect = async () => {
    try{
      setPctSpinner(true)
      // const signer = provider.getSigner()
      // const comptroller = new ethers.Contract(UNITROLLER_ADDRESS, COMPTROLLER_ABI, signer)
      // const tx = await comptroller.claimComp(address)
      // console.log(tx)
      // const receipt = await tx.wait()
      // console.log(receipt)
    }
    catch(err){
      console.log(err)
    }
    finally{
      setPctSpinner(false)
    }
  }



  if (theme){
  return (
    <div className={`App ${darkMode ? "App-dark" : ""}`} style={{backgroundColor: `${theme.background}`}}>
      <Wrapper sideMenu={sideMenu} theme={theme}>
        
        <Menu show={show} isTablet={isTablet} isMobile={isMobile} theme={theme} darkMode={darkMode} address={address} 
          setAddress={setAddress} setNetwork = {setNetwork} setOpenAddress={setOpenAddress} setSideMenu={setSideMenu}/>
        <TabletMenu show={show} isTablet={isTablet} isMobile={isMobile} theme={theme} darkMode={darkMode} address={address} 
          setAddress={setAddress} setNetwork = {setNetwork} setOpenAddress={setOpenAddress} 
          setSideMenu={setSideMenu}/>
        <Content  address={address} provider={provider} network={network} setSpinnerVisible={setSpinnerVisible} 
          darkMode={darkMode} spinnerVisible={spinnerVisible}>
          
        </Content>
      </Wrapper>
      
      <SideMenu open={sideMenu} theme={theme} setSideMenu={setSideMenu} setOpenAddress={setOpenAddress}>
        { openAddress ? 
          <AccountSettings address={address} setAddress={setAddress} provider={provider} setSideMenu={setSideMenu} 
            setOpenAddress={setOpenAddress} pctBalance={pctBalance} pctEarned={pctEarned} pctSpinner={pctSpinner}
            setPctBalance={setPctBalance} setPctEarned={setPctEarned} handleCollect={handleCollect}/> :
          <DarkSwitch darkMode={darkMode} setDarkMode={setDarkMode}/>
        } 
      </SideMenu>
      <Spinner open={spinnerVisible} setOpen = {setSpinnerVisible} theme={theme}/>
    </div>
  );
  }
  else{
    return <div className="App">
     
    </div>
  }
}

export default App;
