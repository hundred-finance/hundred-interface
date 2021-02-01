import React from "react"
import { HuLogo } from "../../../assets/huIcons/huIcons"
import { zeroStringIfNullish } from "../../../helpers"
import "./dialogSection.css"

const BorrowRateSection = (props) => {
    return (
        <div className="dialog-section">
            <div className="dialog-section-title">
                Borrow Rate
            </div>
            <div className="dialog-section-content">
                <div className="dialog-section-content-header">
                    <img
                        className="rounded-circle"
                        style={{ width: "30px", margin: "0px 10px 0px 0px" }}
                        src={props.selectedMarketDetails.logoSource}
                    alt=""/>
                    <span>Borrow APY</span>
                </div>
                <div className="dialog-section-content-value" style={{ margin: "0px 15px 0px 0px" }}>
                    {`${props.selectedMarketDetails.borrowApy
                        ?.times(100)
                        .toFixed(2)}%`}
                </div>
            </div>
            <div className="dialog-section-content">
                <div className="dialog-section-content-header">
                    <HuLogo size={"30px"} className="hulogo"/>
                    <span>PCT APY </span>
                </div>
                <div className="dialog-section-content-value" style={{ margin: "0px 15px 0px 0px" }}>
                    {`${zeroStringIfNullish(
                        props.selectedMarketDetails.borrowPctApy?.times(100).toFixed(2),2)}%`}
                </div>
            </div>
        </div>
    )
}

export default BorrowRateSection