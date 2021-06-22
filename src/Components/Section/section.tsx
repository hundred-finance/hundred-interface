import React, { ReactNode } from "react"
import "./style.css"

interface Props{
    className?: string,
    children?: ReactNode
}

const Section: React.FC<Props> = (props : Props) => {
    return (
        <div className={`section ${props.className ? props.className : ""}`}>
            <div className="section-content">
                {props.children}
            </div>
        </div>
    )
}

export default Section