import React from "react"
import "./switch.css"

const SwitchButton = (props) => {

    const handleClick = () =>{
        if(!props.disabled)
            props.onClick()
    }
    
    return (
        <div className={`switch ${props.checked ? "switch-checked" : ""} ${props.disabled ? "switch-button-disable" : ""}`}  onClick={handleClick}>
            <div className={`switch-button `}>

            </div>
        </div>
    )
}

export default SwitchButton