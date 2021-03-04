import React from "react"
import "./style.css"

const Section = (props) => {
    return (
        <div className={`section ${props.className ? props.className : ""}`}>
            <div className="section-content">
                {props.children}
            </div>
        </div>
    )
}

export default Section