import React from "react"
import "./style.css"

const MarketContainer = (props) => {
    return(
        <div className="market-container">
            {props.children}
        </div>
    )
}

const MarketContainerTitle = (props) => {
    return(
        <div className="market-container-title">
            {props.children}
        </div>
    )
}


export {
    MarketContainer, 
    MarketContainerTitle
}

