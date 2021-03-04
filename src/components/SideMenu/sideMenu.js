import React, { useEffect } from "react"
import "./style.css"

const SideMenu = (props) => {
    const sideMenuStyle = {
        position: 'fixed',
        width: `${props.open ? "100%" : "0"}`,
        height: `${props.open ? "100%" : "0"}`,
        top:0,
        left: 0,
        margin: 0,
        padding:0,
        overflow: 'hidden'
    }

    const overlayStyle = {
        float: 'left',
        display: 'block',
        height: '100%',
        width: '100%',
        backgroundColor: `${props.theme.overlayBackground}`
    }

    const contentStyle = {
        width: '200px',
        height: '100%',
        backgroundColor: '#333',
        color: '#f0f0f0',
        position: 'fixed',
        right: `${props.open ? "0" : "-220px"}`,
        margin: '0',
        padding: '70px 10px 10px 10px',
        transition: 'all 0.2s ease-in-out'
    }

    const handleClose = () => {
        props.setSideMenu(false)
        props.setOpenAddress(false)
    }

    
    return (
        props.open ?(
        <div className="sideMenu" style={sideMenuStyle}>
        <div style={overlayStyle} onClick={() => handleClose()}></div>
          <div style={contentStyle}>
          <span className="close" onClick={() => handleClose()}></span>
            
            <div className="sideMenu-content">
                {props.children}
            </div>
        </div>
      </div>) : null
    )
}

export default SideMenu