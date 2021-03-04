import React from "react"
import "./navbar.css"

const NavbarLink = (props) => {
    const listItemStyle = {
        listStyle: 'none',
        margin:0,
        padding:0,
    }

    const linkStyle ={
        display: 'inline-block',
        lineHeight: '60px',
        textDecoration: 'none',
        padding: '0 1rem',
        userSelect: 'none'
    }

    return (
        <li style={listItemStyle}>
            <a className="nav-link" style={linkStyle} href={props.link} target={props.target ? props.target : ""}>{props.children}</a>
        </li>
    )
}

export default NavbarLink