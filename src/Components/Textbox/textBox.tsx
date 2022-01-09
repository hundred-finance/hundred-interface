import React, { useState } from "react"
import "./textBox.css"

interface Props{
    onClick: () => Promise<void> | void,
    validation: string,
    setInput: React.Dispatch<React.SetStateAction<string>>,
    button: string,
    placeholder: string,
    value: string,
    disabled: boolean,
    onChange?: () => void,
    buttonTooltip?: string,
    validationCollapse?: boolean,
    symbol?: string
}

const TextBox : React.FC<Props> = (props : Props) => {
    const [focus, setFocus] = useState(false)
    const [placeHolder, setPlaceholder] = useState(props.placeholder)
   
    const onFocus = () : void =>{
        setFocus(true)
        setPlaceholder(props.placeholder.replace("0", "").trim())
    }

    const onBlur = () : void =>{
        setFocus(false)
        if(props.value.trim() === "")
            setPlaceholder(props.placeholder)

    }

    const buttonClick = () : void => {
        setFocus(true)
        setPlaceholder(props.placeholder.replace("0", "").trim())
        props.onClick()
    }

    const handleChange = (e : any) : void => {
        if(props.onChange)
            props.onChange()
        let value : string = e.target.value.toString()
        if(value.startsWith('.'))
            value = "0" + value
        props.setInput(value)
        setPlaceholder(props.placeholder.replace("0", "").trim())
    }

    return(
        <div className={`textbox ${props.validation.trim() === "" && props.validationCollapse ? "validation-collapse" : ""}`}>
            <div className={props.button ? "textbox-button" : ""} 
            style={{borderColor: focus ? '#427af1' : '#646464'}}>
                <input type="text" disabled={props.disabled} required value={props.value} onChange={handleChange} onFocus={()=>onFocus()} onBlur={()=>onBlur()}/>
                <span data-tip={props.buttonTooltip} className={`placeholder ${props.disabled ? "placeholder-disabled" : ""}`}>{placeHolder}</span>
                {props.button ?
                    props.buttonTooltip ? <span data-tip={props.buttonTooltip} data-for="borrow-dialog-tooltip" className={`input-button ${props.disabled ? "input-button-disabled" : ""}`} onClick={buttonClick}>{props.button}</span>: 
                    <span className={`input-button ${props.disabled ? "input-button-disabled" : ""}`} onClick={buttonClick}>{props.button}</span>
                    :""}
            </div>
            <span className={`validation`}>{props.validation}</span>
        </div>
    )
}

export default TextBox