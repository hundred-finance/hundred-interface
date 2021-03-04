import './App.css';
import React, { useEffect, useState } from 'react';
import Navbar from './Components/Navbar/navbar';
import NavbarLogo from './Components/Navbar/navbarLogo';
import Spinner from './Components/Spinner/spinner';
import Wrapper from './Components/Wrapper/wrapper';
import {lightTheme, darkTheme} from "./theme"
import SideMenu from './Components/SideMenu/sideMenu';
import DarkSwitch from './Components/DarkSwitch/darkSwitch';
import NavBarButton from './Components/Navbar/navBarButton';
import SideMenuButton from './Components/Navbar/sideMenuButton';
import NavBarLinks from './Components/Navbar/navBarLinks';
import NavbarLink from './Components/Navbar/navBarLink';
import NavBarRight from './Components/Navbar/navBarRight';
import AddressButton from './Components/AddressButton/addressButton';
import {ethers} from "ethers"
import AccountSettings from './Components/SideMenu/accountSettings';
import Content from './Components/Wrapper/content';





const App = () =>{
  const [address, setAddress] = useState("")
  const [provider, setProvider] = useState(null)
  

  const [darkMode, setDarkMode] = useState(false)
  const [spinnerVisible, setSpinnerVisible] = useState(false)
  const [sideMenu, setSideMenu] = useState(false)
  const [theme, setTheme] = useState(lightTheme)
  const [isMobile, setIsMobile] = useState(false)
  const [openAddress, setOpenAddress] = useState(false)

  window.addEventListener('resize', ()=>{
    if (document.documentElement.clientWidth < 450)
      setIsMobile(true)
    else setIsMobile(false)
  });

  useEffect(() => {

    const connect = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          console.log(accounts)
        } catch (error) {
          if (error.code === 4001) {
            // User rejected request
          }
      
          console.log(error)
        }
      }
      try {
        
        const prov = new ethers.providers.Web3Provider(window.ethereum)
        setProvider(prov)
      }
      catch (err){
        console.log(err)
      }
    }

    const darkmode = window.localStorage.getItem("hundred-darkmode")
    const addr = window.localStorage.getItem("hundred-address")

    if(darkmode && darkmode === "dark")
      setDarkMode(true)
    else
      setDarkMode(false)

    if(addr && addr !== "")
      {
        setAddress(addr)
        connect() 
      }

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
    
  }, [address])





  if (theme){
  return (
    <div className={`App ${darkMode ? "App-dark" : ""}`} style={{backgroundColor: `${theme.background}`}}>
      <Wrapper sideMenu={sideMenu} theme={theme}>
        <Navbar theme={theme}>
          <NavbarLogo theme={theme} darkMode={darkMode}/>
          <NavBarButton theme={theme} isMobile={isMobile}/>
          <NavBarLinks theme={theme} isMobile={isMobile}>
            <NavbarLink theme={theme} link="/">Governance</NavbarLink>
            <NavbarLink theme={theme} link="/">Audit</NavbarLink>
            <NavbarLink theme={theme} link="/">Github</NavbarLink>
            <NavbarLink theme={theme} link="https://dev.percent.finance" target="_blank">Dashboard</NavbarLink>
          </NavBarLinks>
          <NavBarRight>
            <AddressButton theme={theme} address={address} setAddress={setAddress} provider={provider} setProvider={setProvider} openAddress={setOpenAddress} setSideMenu={setSideMenu}/>
            <SideMenuButton theme={theme} setSideMenu ={setSideMenu}/>
          </NavBarRight>
        </Navbar>
        <Content  address={address} provider={provider} setSpinnerVisible={setSpinnerVisible} darkMode={darkMode}>
          
        </Content>
      </Wrapper>
      
      <SideMenu open={sideMenu} theme={theme} setSideMenu={setSideMenu} setOpenAddress={setOpenAddress}>
        { openAddress ? 
          <AccountSettings address={address} setAddress={setAddress} provider={provider} setSideMenu={setSideMenu} setOpenAddress={setOpenAddress}/> :
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
