import React from "react"
import { Link } from "react-router-dom"
import { HuBars, HuClose, HuLogo } from "../../../assets/huIcons/huIcons"

const NavbarHeader = (props) =>{
    const handleClick = () => {props.setClick(!props.click)}

    return (
        <div className="navbar-header">
            <Link to='/' className="navbar-logo">
                <HuLogo size="40"/>
                Hundred
            </Link>
            <div className="menu-icon" onClick={handleClick}>
                {!props.click ? <HuBars className="menu-icon-img" width="25"/> : <HuClose className="menu-icon-img" width="25"/>}
            </div>
        </div>
    )
}

export default NavbarHeader
