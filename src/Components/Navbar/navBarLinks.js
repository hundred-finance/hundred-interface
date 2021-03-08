import React from "react"
import "./navbar.css"

const NavBarLinks = (props) => {

    
    return (
        <div className="navbar-links">
            <ul className="navbar-links-list">
                {props.children}
            </ul>
        </div>
    )
}

export default NavBarLinks