import React, { useState } from "react"
import './NavBar.css'
import NavbarHeader from "./NavbarHeader"
import NavbarMenu from "./NavbarMenu"

const Navbar = (props) => {
    const [click, setClick] = useState(false)
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 960 ? true : false)

    const handleMobile = () =>{
        if (window.innerWidth <= 960){
            setIsMobile(true)
            setClick(false)
        }
        else{
            setIsMobile(false)
            setClick(false)
        }
    }

    window.addEventListener('resize', handleMobile)

    return(
        <header className={`navbar ${isMobile ? "navbar-mobile" : ""}`}>
            <div className= "navbar-container">
                <NavbarHeader click={click} setClick={setClick}/>
                <NavbarMenu click={click} claimPct={props.claimPct} activate={props.activate} deactivate={props.deactivate} account={props.account} active={props.active}/>   
            </div>
        </header>
    )
}

export default Navbar