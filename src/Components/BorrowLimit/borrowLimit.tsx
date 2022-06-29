import { BigNumber } from "../../bigNumber"
import React from "react"
import "./borrowLimit.css"
import { useHundredDataContext } from "../../Types/hundredDataContext"

interface Props{
    newBorrowLimit?: BigNumber | null
}

const DialogBorrowLimitSection: React.FC<Props> = (props : Props) => {
    const {generalData} = useHundredDataContext();

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
                        {`$${generalData?.totalBorrowLimit ? generalData?.totalBorrowLimit.toFixed(2) : 0}`}
                    </span> 
                        {props.newBorrowLimit ? (
                    <span>
                        {">"}
                        <span>
                            {`$${props.newBorrowLimit.toFixed(2)}`}
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
                    <span>{`${generalData?.totalBorrowLimitUsedPercent ?
                        generalData?.totalBorrowLimitUsedPercent.toFixed(2) : 0}%`}
                    </span>
                    {props.newBorrowLimit ? (
                    <span>
                        {">"}
                        <span
                            style={{
                                color: generalData?.totalBorrowBalance?.div(props.newBorrowLimit).gt(BigNumber.from("1")) ?"red": ""}}>
                        {`${(generalData && generalData.totalBorrowBalance && props.newBorrowLimit) ? generalData.totalBorrowBalance.div(props.newBorrowLimit).mul(BigNumber.from("100")).toFixed(2) : 0}%`}
                        </span>
                    </span>) : null}
                </div>
            </div>
        </div>
    )
}

export default DialogBorrowLimitSection
