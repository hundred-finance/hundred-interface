import React from "react"
import { Link } from "react-router-dom"

const NavbarMenuItem = (props) => {
    return(
        <li>
            <Link to={props.url} className="menu-item">{props.children}</Link>
        </li>
    )
}

const NavbarExternalLink = (props) => {
    return(
        <li>
            <a href={props.url} className="menu-item" target="_blank" rel="noopener noreferrer">{props.children}</a>
        </li>
    )
}

export  { NavbarMenuItem, NavbarExternalLink}