import React from "react"
import { HuArrow } from "../../../assets/huIcons/huIcons"
import { zeroStringIfNullish } from "../../../helpers"
import "./dialogSection.css"

const BorrowLimitSection = (props) => {
    return (
        <div className="dialog-section">
            <div className="dialog-section-title">
                Borrow Limit
            </div>
            <div className="dialog-section-content">
                <div className="dialog-section-content-header">
                    Borrow Limit
                </div>
                <div className="dialog-section-content-value">
                    <span>
                        {`$${props.generalData?.totalBorrowLimit?.toFixed(2)}`}
                    </span>
                    <span className={`dialog-section-arrow ${props.newBorrowLimit ? "dialog-section-arrow-active" : ""}`}><HuArrow width={"15px"} height={"12px"} color={"rgb(66, 122, 241)"}/></span>
                        {props.newBorrowLimit ? (
                    
                        <span>
                            {`$${zeroStringIfNullish(props.newBorrowLimit?.toFixed(2), 2)}`}
                        </span>
                    ) : null}
                </div>
            </div>
            <div className="dialog-section-content">
                <div className="dialog-section-content-header">
                    Borrow Limit Used
                </div>
                <div className="dialog-section-content-value">
                    <span>{`${zeroStringIfNullish(
                        props.generalData?.totalBorrowLimitUsedPercent?.toFixed(2),2)}%`}
                    </span>
                    <span className={`dialog-section-arrow ${props.newBorrowLimit ? "dialog-section-arrow-active" : ""}`}><HuArrow width={"15px"} height={"12px"} color={"rgb(66, 122, 241)"}/></span>
                    {props.newBorrowLimit ? 
                        (
                            <span
                                style={{
                                    color: props.generalData?.totalBorrowBalance
                                    ?.div(props.newBorrowLimit)
                                    .isGreaterThan(1)
                                    ?"red"
                                    : null,}}>
                                {`${zeroStringIfNullish(
                                    props.generalData?.totalBorrowBalance
                                    ?.div(props.newBorrowLimit)
                                    .times(100)
                                    .toFixed(2),2)}%`}
                            </span>) : null}
                </div>
            </div>
        </div>
    )
}

export default BorrowLimitSection
