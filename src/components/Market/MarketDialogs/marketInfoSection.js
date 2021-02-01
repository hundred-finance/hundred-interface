import React from "react"
import { zeroStringIfNullish } from "../../../helpers"
import "./dialogSection.css"

const DialogMarketInfoSection = (props) => {
    return (
        <div className="dialog-section">
            <div className="dialog-section-title">
                Market Info
            </div>
            <div className="dialog-section-content">
                <div className="dialog-section-content-header">
                    <span>{props.collateralFactorText}</span>
                </div>
                <div className="dialog-section-content-value" style={{ margin: "0px 15px 0px 0px" }}>
                    {`${props.selectedMarketDetails.collateralFactor
                        ?.times(100)
                        .toFixed(0)}%`}
                </div>
            </div>
            <div className="dialog-section-content">
                <div className="dialog-section-content-header">
                    <span>% of Supply Borrowed</span>
                </div>
                <div className="dialog-section-content-value" style={{ margin: "0px 15px 0px 0px" }}>
                    {`${zeroStringIfNullish(
                        props.selectedMarketDetails.marketTotalBorrowInTokenUnit
                        ?.div(props.selectedMarketDetails.marketTotalBorrowInTokenUnit.plus(
                            props.selectedMarketDetails.underlyingAmount)).times(100).toFixed(2),2)}%`}
                </div>
            </div>
        </div>
    )
}

export default DialogMarketInfoSection