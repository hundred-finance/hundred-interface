import React from "react"
import injectedConnector from "../../../connectors";
import Button from "../../Button/Button"
import PctButton from "./PctButton";

const NavbarMenuSettings = (props) => {

    const onConnectClick =() => {
        props.activate(injectedConnector)
    }

    const onDisconectClick = () => {
      props.deactivate()
    }

    function getShortenAddress(address) {
        const firstCharacters = address.substring(0, 6);
        const lastCharacters = address.substring(
          address.length - 4,
          address.length
        );
        return `${firstCharacters}...${lastCharacters}`;
      }

    return (
        <div className="navbar-menu-settings-container">
            <h3>Settings</h3>
            
            <PctButton claimPct={props.claimPct} account={props.account}/>
            
            
            {!props.active ? 
                <Button primaryButton onClick={onConnectClick}>Connect</Button>
                : <div>
                    <Button primaryButton onClick = {onDisconectClick}>{getShortenAddress(props.account)}</Button>
                </div>
            }
        </div>
    )
}

export default NavbarMenuSettings