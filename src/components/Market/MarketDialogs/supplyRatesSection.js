import React from "react"
import { HuLogo } from "../../../assets/huIcons/huIcons"
import { zeroStringIfNullish } from "../../../helpers"
import "./dialogSection.css"

const SupplyRateSection = (props) => {
    return (
        <div className="dialog-section">
            <div className="dialog-section-title">
                Supply Rate
            </div>
            <div className="dialog-section-content">
                <div className="dialog-section-content-header">
                    <img
                        className="rounded-circle"
                        style={{ width: "30px", margin: "0px 10px 0px 0px" }}
                        src={props.selectedMarketDetails.logoSource}
                    alt=""/>
                    <span>Supply APY</span>
                </div>
                <div className="dialog-section-content-value" style={{ margin: "0px 15px 0px 0px" }}>
                    {`${props.selectedMarketDetails.supplyApy
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
                        props.selectedMarketDetails.supplyPctApy?.times(100).toFixed(2),2)}%`}
                </div>
            </div>
        </div>
    )
}

export default SupplyRateSection