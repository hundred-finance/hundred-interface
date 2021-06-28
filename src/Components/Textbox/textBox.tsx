import React, { useState } from "react"
import "./textBox.css"

interface Props{
    onClick: () => Promise<void> | void,
    validation: string,
    setInput: React.Dispatch<React.SetStateAction<string>>,
    button: string,
    placeholder: string,
    value: string,
    onChange?: () => void
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
        <div className="textbox">
            <div className={props.button ? "textbox-button" : ""} 
            style={{borderColor: focus ? '#427af1' : '#646464'}}>
                <input type="text" required value={props.value} onChange={handleChange} onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)}/>
                <span className="placeholder">{props.placeholder}</span>
                {props.button ? 
                    <span className="input-button" onClick={props.onClick}>{props.button}</span>
                    :""}
            </div>
            <span className="validation">{props.validation}</span>
        </div>
    )
}

export default TextBox