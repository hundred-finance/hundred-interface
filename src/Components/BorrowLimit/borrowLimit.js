import React from "react"
import { zeroStringIfNullish } from "../../helpers"
import "./borrowLimit.css"

const DialogBorrowLimitSection = (props) => {
    return (
        <div className="borrow-limit-section">
            <div className="borrow-limit-header">
                Borrow Limit
            </div>
            <div className="borrow-limit-item">
                <div>
                    Borrow Limit
                </div>
                <div className="borrow-limit-item-details">
                    <span>
                        {`$${props.generalData.totalBorrowLimit?.toFixed(2)}`}
                    </span>
                        {props.newBorrowLimit ? (
                    <span>
                        {">"}
                        <span>
                            {`$${zeroStringIfNullish(props.newBorrowLimit?.toFixed(2), 2)}`}
                        </span>
                    </span>
                    ) : null}
                </div>
            </div>
            <div className="borrow-limit-item">
                <div>
                    Borrow Limit Used
                </div>
                <div className="borrow-limit-item-details">
                    <span>{`${zeroStringIfNullish(
                        props.generalData.totalBorrowLimitUsedPercent?.toFixed(2),2)}%`}
                    </span>
                    {props.newBorrowLimit ? (
                    <span>
                        {">"}
                        <span
                            style={{
                                color: props.generalData.totalBorrowBalance
                                ?.div(props.newBorrowLimit)
                                .isGreaterThan(1)
                                ?"red"
                                : null,}}>
                        {`${zeroStringIfNullish(
                                props.generalData.totalBorrowBalance
                                ?.div(props.newBorrowLimit)
                                .times(100)
                                .toFixed(2),
                                2
                        )}%`}
                        </span>
                    </span>) : null}
                </div>
            </div>
        </div>
    )
}

export default DialogBorrowLimitSection
