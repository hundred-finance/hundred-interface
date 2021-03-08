import React from "react"
import "./navbar.css"

const NavbarLink = (props) => {
   
    return (
        <li className="navbar-links-list-item">
            <a className="nav-link" href={props.link} target={props.target ? props.target : ""}>{props.children}</a>
        </li>
    )
}

export default NavbarLink