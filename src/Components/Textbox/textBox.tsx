import React, { useState } from "react"
import "./textBox.css"

interface Props{
    onClick: () => Promise<void> | void,
    validation: string,
    setInput: React.Dispatch<React.SetStateAction<string>>,
    button?: string,
    symbol?: string,
    placeholder?: string,
    value: string,
    disabled: boolean,
    onChange?: () => void,
    buttonTooltip?: string,
    validationCollapse?: boolean
}

const TextBox : React.FC<Props> = (props : Props) => {
    const [focus, setFocus] = useState(false)

    const handleChange = (e : any) : void => {
        if(props.onChange)
            props.onChange()
        let value : string = e.target.value.toString()
        if(value.startsWith('.'))
            value = "0" + value
        props.setInput(value)
    }

    return(
        <div className={`textbox ${props.validation.trim() === "" && props.validationCollapse ? "validation-collapse" : ""}`}>
            <div className={props.button || props.symbol ? "textbox-button" : ""}
            style={{borderColor: focus ? '#427af1' : '#646464'}}>
                <input type="text" disabled={props.disabled} required value={props.value} onChange={handleChange} onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)}/>
                <span data-tip={props.buttonTooltip} className={`placeholder ${props.disabled ? "placeholder-disabled" : ""}`}>{props.placeholder}</span>
                {props.button ?
                    props.buttonTooltip ? <span data-tip={props.buttonTooltip} data-for="borrow-dialog-tooltip" className={`input-button ${props.disabled ? "input-button-disabled" : ""}`} onClick={props.onClick}>{props.button}</span>: 
                    <span className={`input-button ${props.disabled ? "input-button-disabled" : ""}`} onClick={props.onClick}>{props.button}</span>
                    :""}
                {props.symbol ?
                    <span className="input-button input-button-disabled">{props.symbol}</span>
                    : ""
                }
            </div>
            <span className={`validation`}>{props.validation}</span>
        </div>
    )
}

export default TextBox