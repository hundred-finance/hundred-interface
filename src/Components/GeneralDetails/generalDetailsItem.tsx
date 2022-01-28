import React, { ReactNode } from "react"
import "./style.css"

interface Children{
    children?: ReactNode
}

interface Title{
    title: string
}

interface Props {
    label?: string,
    value: string,
    className?: string,
    valueDetails?: string,
    toolTip?: string,
    onClick?: (() => void) | null
}

const GeneralDetailsItem: React.FC<Children> = (props : Children) => {
    return(
        <div className="general-details-item">
            {props.children}
        </div>
    )
}

const GeneralDetailsItemTitle: React.FC<Title> = (props : Title) => {
    return(
        <div className = "general-details-item-title">
            <div className = "general-details-item-icon" />
            <div className="general-details-item-title-text">{props.title}</div>
        </div>
    )
}

const GeneralDetailsItemContent: React.FC<Children> = (props : Children) => {
    return(
        <div className = "general-details-item-content">
            {props.children}
        </div>
    )
}

const GeneralDetailsItemContentItem : React.FC<Props> = (props : Props) => {
    return(
        <div className={`general-details-item-content-item ${props.className ? props.className : ""}`} onClick={() => props.onClick ? props.onClick() : null}>
            {props.label ? props.toolTip ? <label>{props.label}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="info-circle" data-tip={props.toolTip} viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
            </svg>
            </label> :<label>{props.label}</label> : ""}
            {props.value ? <span className={props.className ? props.className : ""}>{props.value} {props.valueDetails ? <span className="value-details">{props.valueDetails}</span> : ""}</span> : ""}
            
        </div>
    )
}

export {GeneralDetailsItem, GeneralDetailsItemTitle, GeneralDetailsItemContent, GeneralDetailsItemContentItem}