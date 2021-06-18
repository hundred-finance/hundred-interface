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
import { HundredBalance } from './Classes/hundredClass';
import Footer from './Components/Footer/footer';
import Spinner from './Components/Spinner/spinner';
import Content from './Components/Content/content';
import NetworksView from './Components/SideMenu/networksView';
import { COMPTROLLER_ABI, HUNDRED_ABI } from './abi';

declare global {
  interface Window {
    ethereum: any
  }
}

const App: React.FC = () => {
  const [address, setAddress] = useState<string>("")
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null)
  const [hndBalance, setHndBalance] = useState<HundredBalance | null>(null)
  const [hndEarned, setHndEarned] = useState<HundredBalance |null>(null)
  const [hndSpinner, setHndSpinner] = useState<boolean>(false)
  const [network, setNetwork] = useState<Network | null>(null)

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

  useEffect(() => {
    if (document.documentElement.clientWidth < 644){
      setIsMobile(true)
      setIsTablet(false)
    }
    else if (document.documentElement.clientWidth < 942){
  
      setIsTablet(true)
      setIsMobile(false)
    }
    else setIsTablet(false)

    setShow(true)

    window.addEventListener('resize', ()=>{
      if (document.documentElement.clientWidth < 644){
        setIsMobile(true)
        setIsTablet(false)
      }
      else if (document.documentElement.clientWidth < 942){
    
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
    if(networkRef.current)
    {
      setOpenNetwork(false)
      setSideMenu(false)
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

  const getHndBalance = async () : Promise<void> => {
    if(network && provider){
        try{
            const contract = new ethers.Contract(network.HUNDRED_ADDRESS, HUNDRED_ABI, provider)
            const balance = await contract.balanceOf(address)
            const decimals = await contract.decimals()
            const symbol = await contract.symbol()
            setHndBalance(new HundredBalance( balance, decimals, symbol))
        }
        catch(err){
            console.log(err)
            setHndBalance(null)
        } 
        return
    }
    setHndBalance(null)
  }

  const getHndEarned = async () : Promise<void> => {
    if(network && provider){
        try{
            const contract = new ethers.Contract(network.UNITROLLER_ADDRESS, COMPTROLLER_ABI, provider)
            const balance = await contract.compAccrued(address)
            const decimals = 18
            const symbol = "HND"
            setHndEarned(new HundredBalance( balance, decimals, symbol))
        }
        catch(err){
            console.log(err)
            setHndEarned(null)
        }
        return
    }
    setHndEarned(null)
}

  const handleCollect = async (): Promise<void> => {
    if(provider && network){
      try{
        setHndSpinner(true)
        const signer = provider.getSigner()
        const comptroller = new ethers.Contract(network.UNITROLLER_ADDRESS, COMPTROLLER_ABI, signer)
        const tx = await comptroller.claimComp(address)
        console.log(tx)
        const receipt = await tx.wait()
        console.log(receipt)
        await getHndBalance()
        await getHndEarned()
      }
      catch(err){
        console.log(err)
      }
      finally{
        setHndSpinner(false)
      }
    }
  }

  return (
    theme ? 
    <div className={`App ${darkMode ? "App-dark" : ""}`}>
      <Wrapper sideMenu={sideMenu}>
        {!isTablet && !isMobile ? 
          <Menu isTablet={isTablet} isMobile ={isMobile} darkMode={darkMode} show={show} setDarkMode={setDarkMode} network={network}
            address={address} setAddress={setAddress} setOpenAddress={setOpenAddress} setSideMenu={setSideMenu} setNetwork={setNetwork} setOpenNetwork={setOpenNetwork}/>
          : <TabletMenu isTablet={isTablet} isMobile ={isMobile} darkMode={darkMode} show={show} setDarkMode={setDarkMode} network={network}
              address={address} setAddress={setAddress} setOpenAddress={setOpenAddress} setSideMenu={setSideMenu} setNetwork={setNetwork} setOpenNetwork={setOpenNetwork}/>
        }
        <Content  address={address} provider={provider} network={network} setSpinnerVisible={setSpinnerVisible} 
          spinnerVisible={spinnerVisible} darkMode={darkMode} />
      </Wrapper>
      <Footer darkMode={darkMode} isMobile={isMobile}/>
      <SideMenu open={sideMenu} setSideMenu={setSideMenu} setOpenAddress={setOpenAddress} setOpenNetwork={setOpenNetwork}>
        { openAddress ? 
          <AccountSettings address={address} setAddress={setAddress} provider={provider} setSideMenu={setSideMenu} 
            setOpenAddress={setOpenAddress} hndBalance={hndBalance} getHndBalance={getHndBalance} getHndEarned={getHndEarned} hndEarned={hndEarned} hndSpinner={hndSpinner}
            handleCollect={handleCollect} network={network}/> : 
            (openNetwork ? <NetworksView network={network}/> : null)
        }
      </SideMenu>
      <Spinner open={spinnerVisible} theme={theme}/>
    </div>
    : <div className="App">
      </div>
  )
}

export default App;
