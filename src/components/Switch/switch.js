import React, { useState } from "react"
import "./switch.css"

const SwitchButton = (props) => {
    const [check, setCheck] = useState(false)

    const handleClick = () => {
        setCheck(!check)
    }
    
    return (
        <div className={`switch ${props.checked ? "switch-checked" : ""}`}>
            <div className="switch-button" onClick={props.onClick}>

            </div>
        </div>
    )
}

export default SwitchButton