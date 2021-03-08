import React from "react"
import "./navbar.css"

const NavBarRight = (props) => {

    const style = {
        display: 'flex',
        alignItems: 'center',
    }
    
    return (
        <div className="navbar-right">
            {props.children}
        </div>
    )
}

export default NavBarRight