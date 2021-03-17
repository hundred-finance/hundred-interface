import React from "react"
import "./navbar.css"

const NavBarRight = (props) => {

    return (
        <div className="navbar-right">
            {props.children}
        </div>
    )
}

export default NavBarRight