import React from "react"
import Navbar from "../Navbar/navbar"
import NavbarLeft from '../Navbar/navBarLeft'
import NavbarLink from "../Navbar/navBarLink"
import NavBarLinks from "../Navbar/navBarLinks"
import NavbarLogo from "../Navbar/navbarLogo"
import NavBarRight from "../Navbar/navBarRight"
import ThemeSwitch from "../Navbar/themeSwitch"
import AirdropButton from "../AirdropButton/airdropButton"
import { useUiContext } from "../../Types/uiContext"
import HundredButton from "./HundredButton/hundredButton"
import NetworkButton from "./NetworkButton/networkButton"
import AddressButton from "./AddressButton/addressButton"

const Menu : React.FC = () => {
  const {isTablet, isMobile, show} = useUiContext()
    return(
        (!isTablet && !isMobile && show) ? (
            <Navbar isMobile={isMobile} isTablet={isTablet}>
                <NavbarLeft>
                  <NavbarLogo/>
                  <NavBarLinks>
                    <NavbarLink link="https://dashboard.hundred.finance" target="_blank">Dashboard</NavbarLink>
                    <NavbarLink link="https://app.multichain.org/#/router" target="_blank">Bridge</NavbarLink>
                    <NavbarLink link="https://docs.hundred.finance" target="_blank">Docs</NavbarLink>
                    <NavbarLink link="https://vote.hundred.finance" target="_blank">Vote</NavbarLink>
                    <NavbarLink link="https://lendly.hundred.finance" target="_blank">Lendly</NavbarLink>
                  </NavBarLinks>
                </NavbarLeft>
                <NavBarRight>
                  <AirdropButton/>
                  <HundredButton/>
                  <NetworkButton/>
                  <AddressButton/>
                  <ThemeSwitch/>
                  {/* <SideMenuButton theme={props.theme} setSideMenu ={props.setSideMenu}/> */}
                </NavBarRight>
            </Navbar>
        ) : null
    )
} 

export default Menu