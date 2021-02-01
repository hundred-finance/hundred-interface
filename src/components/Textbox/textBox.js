import React, { useState } from "react"
import "./textBox.css"

const TextBox = (props) => {
    const [focus, setFocus] = useState(false)

    const handleChange = (e) => {
        if(props.onChange)
            props.onChange()
        props.setInput(e.target.value)
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