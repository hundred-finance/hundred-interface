import React from "react"
import "./dialogSection.css"

const MarketDialogItem = (props) => {
    return (
        <div className="dialog-section">
            <div className="dialog-section-content">
                <div className="dialog-section-content-header">
                    <span>{props.title}</span>
                </div>
                <div className="dialog-section-content-value" style={{ margin: "0px 15px 0px 0px" }}>
                    {props.value}
                </div>
            </div>
        </div>
    )
}

export default MarketDialogItem