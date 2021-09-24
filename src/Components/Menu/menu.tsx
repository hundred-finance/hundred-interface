import React from "react"
import { Network } from "../../networks"
import AddressButton from "../AddressButton/addressButton"
import Navbar from "../Navbar/navbar"
import NavbarLeft from '../Navbar/navBarLeft'
import NavbarLink from "../Navbar/navBarLink"
import NavBarLinks from "../Navbar/navBarLinks"
import NavbarLogo from "../Navbar/navbarLogo"
import NavBarRight from "../Navbar/navBarRight"
import ThemeSwitch from "../Navbar/themeSwitch"
import NetworkButton from "../NetworkButton/networkButton"

interface Props {
  isTablet: boolean,
  isMobile: boolean,
  darkMode: boolean,
  show: boolean,
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>,
  address: string,
  setAddress: React.Dispatch<React.SetStateAction<string>>,
  setOpenAddress: React.Dispatch<React.SetStateAction<boolean>>,
  setSideMenu: React.Dispatch<React.SetStateAction<boolean>>,
  setNetwork: React.Dispatch<React.SetStateAction<Network | null>>,
  network: Network | null,
  setOpenNetwork: React.Dispatch<React.SetStateAction<boolean>>
}

const Menu : React.FC<Props> = (props: Props) => {
    return(
        (!props.isTablet && !props.isMobile && props.show) ? (
            <Navbar isMobile={props.isMobile} isTablet={props.isTablet}>
                <NavbarLeft>
                  <NavbarLogo isMobile={props.isMobile}/>
                  <NavBarLinks>
                    <NavbarLink link="https://dashboard.hundred.finance" target="_blank">Dashboard</NavbarLink>
                    <NavbarLink link="https://anyswap.exchange/#/router" target="_blank">Bridge</NavbarLink>
                  </NavBarLinks>
                </NavbarLeft>
                <NavBarRight>
                  <NetworkButton network = {props.network} setOpenNetwork={props.setOpenNetwork} setSideMenu={props.setSideMenu}/>
                  <AddressButton address={props.address} setAddress={props.setAddress} setNetwork={props.setNetwork}
                     setOpenAddress={props.setOpenAddress} setSideMenu={props.setSideMenu}/>
                  <ThemeSwitch setDarkMode={props.setDarkMode} darkMode={props.darkMode}/>
                  {/* <SideMenuButton theme={props.theme} setSideMenu ={props.setSideMenu}/> */}
                </NavBarRight>
            </Navbar>
        ) : null
    )
} 

export default Menu