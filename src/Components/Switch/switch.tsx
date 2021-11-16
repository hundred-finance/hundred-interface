import React from "react"
import "./switch.css"

interface Props{
    disabled: boolean,
    checked?: boolean,
    onClick?: () => void
    switchToolTip?: string | null
}

const SwitchButton: React.FC<Props> = (props : Props) => {

    const handleClick = () =>{
        if(!props.disabled && props.onClick)
            props.onClick()
    }
    
    return (
        props.switchToolTip ? 
        <div data-tip={props.switchToolTip} className={`switch ${props.checked ? "switch-checked" : ""} ${props.disabled ? "switch-button-disable" : "switch-button-enabled"}`}  onClick={handleClick}>
            <div className={`switch-button`}>

            </div>
        </div>
        :
        <div className={`switch ${props.checked ? "switch-checked" : ""} ${props.disabled ? "switch-button-disable" : "switch-button-enabled"}`}  onClick={handleClick}>
            <div className={`switch-button`}>

            </div>
        </div>
    )
}

export default SwitchButton