import { useState } from "react"
import React from "react"
import AddressButton from "../AddressButton/addressButton"
import Navbar from "../Navbar/navbar"
import NavBarButton from "../Navbar/navBarButton"
import NavbarLink from "../Navbar/navBarLink"
import NavBarLinks from "../Navbar/navBarLinks"
import NavbarLogo from "../Navbar/navbarLogo"
import NavbarMobile from "../Navbar/navbarMobile"
import NavBarRight from "../Navbar/navBarRight"
// import SideMenuButton from "../Navbar/sideMenuButton"

const TabletMenu = (props) => {
    const [menuOpen, setMenuOpen] = useState(false)

    return(
        ((props.isTablet || props.isMobile) && props.show) ? (
            <Navbar theme={props.theme} isMobile={props.isMobile} isTablet={props.isTablet}>
                <NavbarLogo isMobile={props.isMobile} theme={props.theme} darkMode={props.darkMode}/>
                <NavBarRight>
                    {props.isTablet && !props.isMobile ?
                        (<AddressButton theme={props.theme} address={props.address} setAddress={props.setAddress} 
                            provider={props.provider} setProvider={props.setProvider} setOpenAddress={props.setOpenAddress} 
                            setSideMenu={props.setSideMenu}/>)
                        : null}
                  <NavBarButton theme={props.theme} isTablet={props.isTablet} isMobile={props.isMobile} 
                    setMenuOpen={setMenuOpen}/>
                  {/* <SideMenuButton theme={props.theme} setSideMenu ={props.setSideMenu}/> */}
                </NavBarRight>
                <NavbarMobile menuOpen={menuOpen}>
                    {props.isMobile ? (
                        <NavBarRight style={{justifyContent:"flex-end"}}>
                            <AddressButton theme={props.theme} address={props.address} setAddress={props.setAddress} 
                        provider={props.provider} setProvider={props.setProvider} setOpenAddress={props.setOpenAddress} 
                        setSideMenu={props.setSideMenu}/>
                        </NavBarRight>
                    ) : null}
                    <NavBarLinks theme={props.theme}>
                        <NavbarLink link="/">Governance</NavbarLink>
                        <NavbarLink link="/">Audit</NavbarLink>
                        <NavbarLink link="/">Github</NavbarLink>
                        <NavbarLink link="https://dev.percent.finance" target="_blank">Dashboard</NavbarLink>
                    </NavBarLinks>
                </NavbarMobile>
            </Navbar>
        ) : null
    )
} 

export default TabletMenu