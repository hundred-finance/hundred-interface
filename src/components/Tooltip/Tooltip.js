import React from "react"
import "./Tooltip.css"

const Tooltip = (props) => {
    return (
        <div className="tooltip">
            <div className="tooltip-header">
                {props.children} <span>i</span>
            </div>
            <div className={`tooltip-title ${props.placement}`}>
                <span className="tooltip-content">{props.title}</span>
            </div>
        </div>
    )
}

export default Tooltip