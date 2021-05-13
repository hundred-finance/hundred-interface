import React, { ReactNode } from "react"

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
        <div className="general-details-item-content-item">
            {props.label ? <label>{props.label}</label> : ""}
            {props.value ? <span className={props.className ? props.className : ""}>{props.value} {props.valueDetails ? <span className="value-details">{props.valueDetails}</span> : ""}</span> : ""}
            
        </div>
    )
}

export {GeneralDetailsItem, GeneralDetailsItemTitle, GeneralDetailsItemContent, GeneralDetailsItemContentItem}