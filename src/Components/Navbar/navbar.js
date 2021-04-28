import React from "react"
import "./navbar.css"

const Navbar = (props) => {
    return (
            <div className={`navbar ${props.isTablet || props.isMobile ? "navbar-mobile" : ""}`}>
                <div className="navbar-content">
                    {props.children}
                </div>
            </div>
    )
}

export default Navbar