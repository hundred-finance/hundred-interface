import React from "react"
import "./switch.css"

const SwitchButton = (props) => {
    
    return (
        <div className={`switch ${props.checked ? "switch-checked" : ""}`} onClick={props.onClick}>
            <div className="switch-button">

            </div>
        </div>
    )
}

export default SwitchButton