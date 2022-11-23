import React from "react"
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional
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
            <Tippy content={props.switchToolTip}>
                <div className={`switch-button ${props.checked ? "switch-button-checked" : ""} ${props.disabled ? "switch-button-disabled" : ""}`} onClick={handleClick}/>
            </Tippy>
        :
            <div className={`switch-button ${props.checked ? "switch-button-checked" : ""} ${props.disabled ? "switch-button-disabled" : ""}`} onClick={handleClick}/>
    )
}

export default SwitchButton