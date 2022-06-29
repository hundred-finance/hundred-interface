import { BigNumber } from "../../../../bigNumber"
import React from "react"
import { HuArrow } from "../../../../assets/huIcons/huIcons"
import "../dialogSection.css"
import { useHundredDataContext } from "../../../../Types/hundredDataContext"

interface Props{
    newBorrowLimit: BigNumber | null
}

const BorrowLimitSection:React.FC<Props> = (props : Props) => {
    const {generalData} = useHundredDataContext();

    // const BorrowLimit = () : void => {
    //     const value = generalData && props.newBorrowLimit && props.newBorrowLimit.gt(BigNumber.from(0)) ?  +generalData?.totalBorrowBalance.toString() / (+props.newBorrowLimit.toString()) * 100 : 0
    //     setBorrowLimit(BigNumber.parseValue(value.toFixed(18)))
        
    // }
    

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
                        {`$${generalData?.totalBorrowLimit ? generalData?.totalBorrowLimit.toRound(2, false, true) : "0.00"}`}
                    </span>
                    <span className={`dialog-section-arrow ${props.newBorrowLimit && (+props.newBorrowLimit.toString() > 0 || +props.newBorrowLimit.toString() < 0)
                         && generalData && +generalData.totalBorrowLimit.toString() !== +props.newBorrowLimit.toString() ? "dialog-section-arrow-active" : ""}`}>
                        <HuArrow width={"15px"} height={"12px"} color={"rgb(66, 122, 241)"}/>
                    </span>
                        {props.newBorrowLimit && (+props.newBorrowLimit.toString() > 0 || +props.newBorrowLimit.toString() < 0) && +props.newBorrowLimit.toString()  
                        && generalData && +generalData.totalBorrowLimit.toString() !== +props.newBorrowLimit.toString() 
                        ? (
                    
                        <span style={{color: props.newBorrowLimit && generalData && +generalData.totalBorrowLimitUsedPercent.toString() > 0 && +props.newBorrowLimit.toString() < 0 ? "red" : ""}}>
                            {`$${props.newBorrowLimit && +props.newBorrowLimit.toString() > 0  ?  props.newBorrowLimit.toRound(2, false, true) : "0.00"}`}
                        </span>
                        ) : null}
                </div>
            </div>
            <div className="dialog-section-content">
                <div className="dialog-section-content-header">
                    Borrow Limit Used
                </div>
                <div className="dialog-section-content-value">
                    <span>{`${generalData?.totalBorrowLimitUsedPercent ? generalData?.totalBorrowLimitUsedPercent.toRound(2, false, true) : "0.00"}%`}
                    </span>
                    <span className={`dialog-section-arrow ${props.newBorrowLimit && (+props.newBorrowLimit.toString() > 0 || +props.newBorrowLimit.toString() < 0) 
                        && generalData && +generalData.totalBorrowLimit.toString() !== +props.newBorrowLimit.toString()? "dialog-section-arrow-active" : ""}`}>
                            <HuArrow width={"15px"} height={"12px"} color={"rgb(66, 122, 241)"}/>
                    </span>
                    {props.newBorrowLimit && (+props.newBorrowLimit.toString() > 0 || +props.newBorrowLimit.toString() < 0) 
                    && generalData && +generalData.totalBorrowLimit.toString() !== +props.newBorrowLimit.toString() ? 
                        (
                            <span
                                style={{
                                    color: props.newBorrowLimit && generalData && +generalData.totalBorrowLimitUsedPercent.toString() > 0 && ((+props.newBorrowLimit.toString() > 0 && 
                                        +generalData?.totalBorrowBalance/(+props.newBorrowLimit) > 0.9) || +props.newBorrowLimit.toString() < 0)  ? "red": ""}}>
                                {`${generalData && props.newBorrowLimit && +props.newBorrowLimit.toRound(2) > 0 ?  
                                    (+(+generalData?.totalBorrowBalance.toString() / +props.newBorrowLimit.toString() * 100).toFixed(2) <= 100)
                                    ? (+generalData?.totalBorrowBalance.toString() / +props.newBorrowLimit.toString() * 100).toFixed(2) : ">100"
                                    : generalData && +generalData.totalBorrowLimitUsedPercent.toString() > 0 ? "infinity" : "0.00"}%`}
                            </span>) : null}
                </div>
            </div>
        </div>
    )
}

export default BorrowLimitSection
// generalData && props.newBorrowLimit && props.newBorrowLimit.gt(BigNumber.from(0)) ?  
// BigNumber.parseValue((+generalData?.totalBorrowBalance.toString() / (+props.newBorrowLimit.toString()) * 100).toFixed(18)).toRound(2) : 0