import React from "react"
import "./navbar.css"

const NavBarLinks = (props) => {

    const style = {
        flex : 1,
        display: 'flex',
        height:'60px',
        justifyContent:'center',
        alignItems:'center'
    }

    const mobileStyle = {
        
    }

    const listStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin:0,
        padding:0
    }

    return (
        <div className="navbar-links" style={props.isMobile ? mobileStyle : style}>
            <ul style={listStyle}>
                {props.children}
            </ul>
        </div>
    )
}

export default NavBarLinks