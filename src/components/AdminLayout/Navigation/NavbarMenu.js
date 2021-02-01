import React from "react"
import NavbarMenuItems from "./NavbarMenuItems"
import NavbarMenuSettings from "./NavbarMenuSettings"

const NavbarMenu = (props) => {
    
    return (
        <div className={`navbar-menu-container ${props.click ? "navbar-menu-container-open" : ""}`}>
            <NavbarMenuItems/>
            <NavbarMenuSettings claimPct={props.claimPct} activate={props.activate} deactivate={props.deactivate} account={props.account} active={props.active}/>
        </div>
    )
}

export default NavbarMenu