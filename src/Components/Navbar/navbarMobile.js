import React from "react"
import "./navbar.css"

const NavbarMobile = (props) => {
    return (
        <div className={`navbar-mobile-content ${props.menuOpen ? "navbar-mobile-content-open" : ""}`}>
            {props.children}
        </div>
    )
}

export default NavbarMobile