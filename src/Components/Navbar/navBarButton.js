import React, { useState } from "react"

const NavBarButton = (props) => {
    const [clicked, setClicked] = useState(false)
    const [hover, setHover] = useState(false)

    const style = {
        border: `1px solid ${props.theme.text}`,
        borderRadius: '10px',
        display: `${props.isMobile || props.isTablet ? 'block' : 'none'}`,
        width: '40px',
        height: '40px',
        margin: '0 10px',
        position: 'relative',
        cursor: 'pointer',
        transition: 'all 0.2s ease-out',
        backgroundColor: `${hover || clicked ? props.theme.buttonColor : ""}`
    }

    const bar1 = {
        display: 'block',
        width: '25px',
        height: '2px',
        backgroundColor: `${hover || clicked ? props.theme.buttonHover2 : props.theme.text}`,
        border: `1px solid ${hover || clicked ? props.theme.buttonHover2 : props.theme.text}`,
        borderRadius: '3px',
        position:'absolute',
        left: '50%',
        top: `${clicked ? '50%' : '25%'}`,
        transform: `${clicked ? 'translate(-50%, -50%) rotate(45deg)' : 'translate(-50%, -25%)'}`,
        transition: 'all 0.2s ease-out'
    }

    const bar2 = {
        display: 'block',
        width: '25px',
        height: '2px',
        backgroundColor: `${hover || clicked ? props.theme.buttonHover2 : props.theme.text}`,
        border: `1px solid ${hover || clicked ? props.theme.buttonHover2 : props.theme.text}`,
        borderRadius: '3px',
        position:'absolute',
        left: '50%',
        top:'50%',
        transform: 'translate(-50%, -50%)',
        transition: 'all 0.2s ease-out',
        opacity: `${clicked ? '0' : '1'}`
    }

    const bar3 = {
        display: 'block',
        width: '25px',
        height: '2px',
        backgroundColor: `${hover || clicked ? props.theme.buttonHover2 : props.theme.text}`,
        border: `1px solid ${hover || clicked ? props.theme.buttonHover2 : props.theme.text}`,
        borderRadius: '3px',
        position:'absolute',
        left: '50%',
        top: `${clicked ? '50%' : '75%'}`,
        transform: `${clicked ? 'translate(-50%, -50%) rotate(-45deg)' : 'translate(-50%, -75%)'}`,
        transition: 'all 0.2s ease-out'
    }



    return (
        <div style={style} onClick={() =>{ setClicked(!clicked); props.setMenuOpen(!clicked)}} onMouseOver={()=>setHover(true)} onMouseOut={()=>setHover(false)}>
            <span style={bar1}></span>
            <span style={bar2}></span>
            <span style={bar3}></span>
        </div>
    )
}

export default NavBarButton