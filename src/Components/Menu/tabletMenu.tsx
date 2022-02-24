import { useState } from 'react';
import React from 'react';
import AddressButton from '../AddressButton/addressButton';
import Navbar from '../Navbar/navbar';
import NavBarButton from '../Navbar/navBarButton';
import NavbarLink from '../Navbar/navBarLink';
import NavBarLinks from '../Navbar/navBarLinks';
import NavbarLogo from '../Navbar/navbarLogo';
import NavbarMobile from '../Navbar/navbarMobile';
import NavBarRight from '../Navbar/navBarRight';
import ThemeSwitch from '../Navbar/themeSwitch';
import { Network } from '../../networks';
import NetworkButton from '../NetworkButton/networkButton';
import HundredButton from '../HundredButton/hundredButton';
import AirdropButton, { AirdropType } from '../AirdropButton/airdropButton';
import { ethers } from 'ethers';
// import SideMenuButton from "../Navbar/sideMenuButton"

interface Props {
    isTablet: boolean;
    isMobile: boolean;
    darkMode: boolean;
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
    address: string;
    setAddress: React.Dispatch<React.SetStateAction<string>>;
    setOpenAddress: React.Dispatch<React.SetStateAction<boolean>>;
    setSideMenu: React.Dispatch<React.SetStateAction<boolean>>;
    setNetwork: React.Dispatch<React.SetStateAction<Network | null>>;
    setOpenAirdrop: React.Dispatch<React.SetStateAction<boolean>>;
    network: Network | null;
    setOpenNetwork: React.Dispatch<React.SetStateAction<boolean>>;
    setOpenHundred: React.Dispatch<React.SetStateAction<boolean>>;
    hasClaimed: boolean;
    setHasClaimed: React.Dispatch<React.SetStateAction<boolean>>;
    provider: ethers.providers.Web3Provider | null;
    airdrops: AirdropType[];
    setAirdrops: React.Dispatch<React.SetStateAction<AirdropType[]>>;
    airdropSpinner: boolean;
}

const TabletMenu: React.FC<Props> = (props: Props) => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (props.isTablet || props.isMobile) && props.show ? (
        <>
            <Navbar isMobile={props.isMobile} isTablet={props.isTablet}>
                <NavbarLogo isMobile={props.isMobile} />
                <NavBarRight>
                    {props.isTablet && !props.isMobile ? (
                        <>
                            <AirdropButton
                                network={props.network}
                                address={props.address}
                                hasClaimed={props.hasClaimed}
                                setOpenAirdrop={props.setOpenAirdrop}
                                spinner={props.airdropSpinner}
                                setHasClaimed={props.setHasClaimed}
                                provider={props.provider}
                                airdrops={props.airdrops}
                                setAirdrops={props.setAirdrops}
                                setSideMenu={props.setSideMenu}
                            />
                            <HundredButton
                                network={props.network}
                                address={props.address}
                                setOpenHundred={props.setOpenHundred}
                                setSideMenu={props.setSideMenu}
                            />
                            <NetworkButton
                                network={props.network}
                                setOpenNetwork={props.setOpenNetwork}
                                setSideMenu={props.setSideMenu}
                            />
                            <AddressButton
                                address={props.address}
                                setAddress={props.setAddress}
                                setNetwork={props.setNetwork}
                                setOpenAddress={props.setOpenAddress}
                                setSideMenu={props.setSideMenu}
                            />
                            <ThemeSwitch
                                darkMode={props.darkMode}
                                setDarkMode={props.setDarkMode}
                                setOpenMenu={setMenuOpen}
                            />
                        </>
                    ) : null}
                    <NavBarButton setMenuOpen={setMenuOpen} menuOpen={menuOpen} />
                </NavBarRight>
            </Navbar>
            <NavbarMobile menuOpen={menuOpen}>
                {props.isMobile ? (
                    <NavBarRight className="navbar-right-content">
                        <AirdropButton
                            network={props.network}
                            address={props.address}
                            hasClaimed={props.hasClaimed}
                            setOpenAirdrop={props.setOpenAirdrop}
                            spinner={props.airdropSpinner}
                            setHasClaimed={props.setHasClaimed}
                            provider={props.provider}
                            airdrops={props.airdrops}
                            setAirdrops={props.setAirdrops}
                            setSideMenu={props.setSideMenu}
                        />
                        <HundredButton
                            network={props.network}
                            address={props.address}
                            setOpenHundred={props.setOpenHundred}
                            setSideMenu={props.setSideMenu}
                        />
                        <NetworkButton
                            network={props.network}
                            setOpenNetwork={props.setOpenNetwork}
                            setSideMenu={props.setSideMenu}
                        />
                        <AddressButton
                            address={props.address}
                            setAddress={props.setAddress}
                            setNetwork={props.setNetwork}
                            setOpenAddress={props.setOpenAddress}
                            setSideMenu={props.setSideMenu}
                        />
                        <ThemeSwitch
                            darkMode={props.darkMode}
                            setDarkMode={props.setDarkMode}
                            setOpenMenu={setMenuOpen}
                        />
                    </NavBarRight>
                ) : null}
                <NavBarLinks>
                    <NavbarLink link="https://dashboard.hundred.finance" target="_blank">
                        Dashboard
                    </NavbarLink>
                    <NavbarLink link="https://app.multichain.org/#/router" target="_blank">
                        Bridge
                    </NavbarLink>
                    <NavbarLink link="https://docs.hundred.finance" target="_blank">
                        Docs
                    </NavbarLink>
                    <NavbarLink link="https://vote.hundred.finance" target="_blank">
                        Vote
                    </NavbarLink>
                    <NavbarLink link="https://lendly.hundred.finance" target="_blank">
                        Lendly
                    </NavbarLink>
                </NavBarLinks>
            </NavbarMobile>
        </>
    ) : null;
};

export default TabletMenu;
