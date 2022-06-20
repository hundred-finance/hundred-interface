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
import NetworkButton from "../NetworkButton/networkButton"
import HundredButton from "../HundredButton/hundredButton"
import AirdropButton from "../AirdropButton/airdropButton"
import { useUiContext } from "../../Types/uiContext"
// import SideMenuButton from "../Navbar/sideMenuButton"

const TabletMenu: React.FC = () => {
    const {isTablet, isMobile, show} = useUiContext()
    const [menuOpen, setMenuOpen] = useState(false)

    return(
        ((isTablet || isMobile) && show) ? 
        (<>
            <Navbar isMobile={isMobile} isTablet={isTablet}>
                <NavbarLogo isMobile={isMobile}/>
                    <NavBarRight>
                    {isTablet && !isMobile ?
                        <>
                            <AirdropButton/>
                            <HundredButton />
                            <NetworkButton/> 
                            <AddressButton />
                            <ThemeSwitch/>
                        </>
                    : null}
                        <NavBarButton setMenuOpen={setMenuOpen} menuOpen={menuOpen}/>
                    </NavBarRight>
            </Navbar>
            <NavbarMobile menuOpen={menuOpen}>
            {isMobile ? 
                <NavBarRight className="navbar-right-content">
                    <AirdropButton/>
                    <HundredButton />
                    <NetworkButton /> 
                    <AddressButton />
                    <ThemeSwitch/>
                </NavBarRight>
            : null}
            <NavBarLinks>
                 <NavbarLink link="https://dashboard.hundred.finance" target="_blank">Dashboard</NavbarLink>
                 <NavbarLink link="https://app.multichain.org/#/router" target="_blank">Bridge</NavbarLink>
                 <NavbarLink link="https://docs.hundred.finance" target="_blank">Docs</NavbarLink>
                 <NavbarLink link="https://vote.hundred.finance" target="_blank">Vote</NavbarLink>
                 <NavbarLink link="https://lendly.hundred.finance" target="_blank">Lendly</NavbarLink>
             </NavBarLinks>
        </NavbarMobile>
        </>
        )
        : null
    )
} 

export default TabletMenu
