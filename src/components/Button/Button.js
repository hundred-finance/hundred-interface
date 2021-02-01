import React from "react"
import { HuArrow } from "../../assets/huIcons/huIcons"
import "./Button.css"

const Button = (props) => {
    const buttonStyle = props.primaryButton ? "button-primary" : props.addressButton ? "button-address" : ""
    const type = props.type ? props.type : "button"

    return (
        <button className={buttonStyle} type={type} onClick={props.onClick ? props.onClick : null}>
            {props.addressButton ? 
                <div>
                    {props.children}
                    <span><HuArrow color="#646464" width="10" height="10"/></span>
                </div> 
                : props.children}
        </button>
    )
}

export default Button