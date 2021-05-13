import React from "react"
import "./switch.css"

interface Props{
    disabled: boolean,
    checked?: boolean,
    onClick?: () => void
}

const SwitchButton: React.FC<Props> = (props : Props) => {

    const handleClick = () =>{
        if(!props.disabled && props.onClick)
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