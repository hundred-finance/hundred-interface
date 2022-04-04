import React from "react"
import HundredButton from "../HundredButton/hundredButton"
import AddressButton from "../AddressButton/addressButton"
import Navbar from "../Navbar/navbar"
import NavbarLeft from '../Navbar/navBarLeft'
import NavbarLink from "../Navbar/navBarLink"
import NavBarLinks from "../Navbar/navBarLinks"
import NavbarLogo from "../Navbar/navbarLogo"
import NavBarRight from "../Navbar/navBarRight"
import ThemeSwitch from "../Navbar/themeSwitch"
import NetworkButton from "../NetworkButton/networkButton"
import AirdropButton, { AirdropType } from "../AirdropButton/airdropButton"
import { useUiContext } from "../../Types/uiContext"

interface Props {
  address: string,
  setAddress: React.Dispatch<React.SetStateAction<string>>,
  hasClaimed: boolean,
  setHasClaimed: React.Dispatch<React.SetStateAction<boolean>>,
  airdrops: AirdropType[],
  setAirdrops: React.Dispatch<React.SetStateAction<AirdropType[]>>
}

const Menu : React.FC<Props> = (props: Props) => {
  const {isTablet, isMobile, show} = useUiContext()
    return(
        (!isTablet && !isMobile && show) ? (
            <Navbar isMobile={isMobile} isTablet={isTablet}>
                <NavbarLeft>
                  <NavbarLogo isMobile={isMobile}/>
                  <NavBarLinks>
                    <NavbarLink link="https://dashboard.hundred.finance" target="_blank">Dashboard</NavbarLink>
                    <NavbarLink link="https://app.multichain.org/#/router" target="_blank">Bridge</NavbarLink>
                    <NavbarLink link="https://docs.hundred.finance" target="_blank">Docs</NavbarLink>
                    <NavbarLink link="https://vote.hundred.finance" target="_blank">Vote</NavbarLink>
                    <NavbarLink link="https://lendly.hundred.finance" target="_blank">Lendly</NavbarLink>
                  </NavBarLinks>
                </NavbarLeft>
                <NavBarRight>
                  <AirdropButton address={props.address} hasClaimed={props.hasClaimed}
                                setHasClaimed={props.setHasClaimed} airdrops={props.airdrops} setAirdrops={props.setAirdrops}/>
                  <HundredButton address={props.address}/>
                  <NetworkButton/>
                  <AddressButton address={props.address} setAddress={props.setAddress}/>
                  <ThemeSwitch/>
                  {/* <SideMenuButton theme={props.theme} setSideMenu ={props.setSideMenu}/> */}
                </NavBarRight>
            </Navbar>
        ) : null
    )
} 

export default Menu