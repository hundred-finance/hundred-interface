import React from "react"

const GeneralDetailsItem = (props) => {
    return(
        <div className="general-details-item">
            {props.children}
        </div>
    )
}

const GeneralDetailsItemTitle = (props) => {
    return(
        <div className = "general-details-item-title">
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
    return(
        <div className="general-details-item-content-item">
            {props.label ? <label>{props.label}</label> : ""}
            {props.value ? <span className={props.className ? props.className : ""}>{props.value} {props.valueDetails ? <span className="value-details">{props.valueDetails}</span> : ""}</span> : ""}
            
        </div>
    )
}

export {GeneralDetailsItem, GeneralDetailsItemTitle, GeneralDetailsItemContent, GeneralDetailsItemContentItem}