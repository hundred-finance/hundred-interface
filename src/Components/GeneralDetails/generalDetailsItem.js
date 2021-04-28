import React from "react"

const GeneralDetailsItem = (props) => {
    console.log(props.className)
    return(
        <div className={`general-details-item ${props.className ? props.className : ''}`}>
            {props.children}
        </div>
    )
}

const GeneralDetailsItemTitle = (props) => {
    return(
        <div className = "general-details-item-title">
            <div className = "general-details-item-icon" />
            {props.title}
        </div>
    )
}

const GeneralDetailsItemContent = (props) => {
    return(
        <div className = "general-details-item-content">
            {props.children}
        </div>
    )
}

const GeneralDetailsItemContentItem = (props) => {
    const style = props.bottomBorder ? { borderBottom: '1px solid var(--borderBottom)' } : {};
    return(
        <div
            className="general-details-item-content-item"
            style={style}
        >
            {props.label ? <label>{props.label}</label> : ""}
            {props.value ? <span className={props.className ? props.className : ""}>{props.value} {props.valueDetails ? <span className="value-details">{props.valueDetails}</span> : ""}</span> : ""}
            
        </div>
    )
}

export {GeneralDetailsItem, GeneralDetailsItemTitle, GeneralDetailsItemContent, GeneralDetailsItemContentItem}