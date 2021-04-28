import React from "react"
import "./navbar.css"

import { ReactComponent as Sun } from '../../assets/sun.svg';
import { ReactComponent as Moon } from '../../assets/moon.svg';

const NavBarRight = (props) => {

    return (
        <div className="navbar-right">
            {props.children}
            <Sun className={`navbar-right-sun ${props.darkMode ? 'deactive' : 'active'}`} onClick={() => props.setDarkMode(false)} />
            <Moon className={`navbar-right-moon ${props.darkMode ? 'active' : 'deactive'}`} onClick={() => props.setDarkMode(true)} />
        </div>
    )
}

export default NavBarRight