import React from "react"
import {NavbarMenuItem, NavbarExternalLink} from "./NavbarMenuItem"

const NavbarMenuItems = () =>{
    return (
        <ul className="navbar-menu">
            <NavbarMenuItem url="">Governance</NavbarMenuItem>
            <NavbarMenuItem url="/">Audit</NavbarMenuItem>
            <NavbarMenuItem url="/">Github</NavbarMenuItem>
            <NavbarExternalLink url="https://dev.percent.finance/">Dashboard</NavbarExternalLink>
        </ul>
    )
}

export default NavbarMenuItems