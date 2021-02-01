import React from "react"
import "./marketDialogButton.css"

const MarketDialogButton = (props) => {
    return (
        <div className="market-dialog-button">
            <button disabled={props.disabled} onClick={() => props.onClick()}>{props.children}</button>
        </div>
    )
} 

export default MarketDialogButton