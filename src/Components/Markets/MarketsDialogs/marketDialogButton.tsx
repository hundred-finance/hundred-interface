import React, { ReactNode } from "react"
import "./marketDialogButton.css"

interface Props{
    disabled: boolean,
    children: ReactNode,
    onClick: () => void
}

const MarketDialogButton: React.FC<Props> = (props: Props) => {
    return (
        <div className="market-dialog-button">
            <button disabled={props.disabled} onClick={() => props.onClick()}>{props.children}</button>
        </div>
    )
} 

export default MarketDialogButton