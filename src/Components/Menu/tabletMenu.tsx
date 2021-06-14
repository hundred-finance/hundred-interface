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
import ThemeSwitch from "../Navbar/themeSwitch"
import { Network } from "../../networks"
import NetworkButton from "../NetworkButton/networkButton"
// import SideMenuButton from "../Navbar/sideMenuButton"

interface Props{
    isTablet: boolean,
    isMobile: boolean,
    darkMode: boolean,
    show: boolean,
    setDarkMode: React.Dispatch<React.SetStateAction<boolean>>,
    address: string,
    setAddress: React.Dispatch<React.SetStateAction<string>>,
    setOpenAddress: React.Dispatch<React.SetStateAction<boolean>>
    setSideMenu: React.Dispatch<React.SetStateAction<boolean>>,
    setNetwork: React.Dispatch<React.SetStateAction<Network | null>>,
    network: Network | null,
    setOpenNetwork: React.Dispatch<React.SetStateAction<boolean>>
}

const TabletMenu: React.FC<Props> = (props: Props) => {
    const [menuOpen, setMenuOpen] = useState(false)

    return(
        ((props.isTablet || props.isMobile) && props.show) ? 
        (<>
            <Navbar isMobile={props.isMobile} isTablet={props.isTablet}>
                <NavbarLogo isMobile={props.isMobile}/>
                    <NavBarRight>
                    {props.isTablet && !props.isMobile ?
                        <>
                            <NetworkButton network = {props.network} setOpenNetwork={props.setOpenNetwork} setSideMenu={props.setSideMenu}/> 
                            <AddressButton address={props.address} setAddress={props.setAddress} setNetwork={props.setNetwork}
                            setOpenAddress={props.setOpenAddress} setSideMenu={props.setSideMenu}/>
                        </>
                    : null}
                        <NavBarButton setMenuOpen={setMenuOpen}/>
                        {props.isTablet && !props.isMobile ? 
                            <ThemeSwitch darkMode={props.darkMode} setDarkMode={props.setDarkMode}/>
                        : null}
                    </NavBarRight>
            </Navbar>
            <NavbarMobile menuOpen={menuOpen}>
            {props.isMobile ? 
                <NavBarRight className="navbar-right-content">
                    <NetworkButton network = {props.network} setOpenNetwork={props.setOpenNetwork} setSideMenu={props.setSideMenu}/> 
                    <AddressButton address={props.address} setAddress={props.setAddress} setNetwork={props.setNetwork}
                     setOpenAddress={props.setOpenAddress} setSideMenu={props.setSideMenu}/>
                    <ThemeSwitch darkMode={props.darkMode} setDarkMode={props.setDarkMode}/>
                </NavBarRight>
            : null}
            <NavBarLinks>
                 <NavbarLink link="/">Governance</NavbarLink>
                 <NavbarLink link="/">Audit</NavbarLink>
                 <NavbarLink link="/">Github</NavbarLink>
                 <NavbarLink link="https://hundred-dashboard.netlify.app/" target="_blank">Dashboard</NavbarLink>
             </NavBarLinks>
        </NavbarMobile>
        </>
        )
        : null
    )
} 

export default TabletMenu
