import { BigNumber } from "../../../bigNumber"
import React, { useEffect } from "react"
import { HuArrow } from "../../../assets/huIcons/huIcons"
import { GeneralDetailsData } from "../../../Classes/generalDetailsClass"
import "./dialogSection.css"

interface Props{
    generalData: GeneralDetailsData | null,
    newBorrowLimit: BigNumber | null
    
}

const BorrowLimitSection:React.FC<Props> = (props : Props) => {
    
    // const BorrowLimit = () : void => {
    //     const value = props.generalData && props.newBorrowLimit && props.newBorrowLimit.gt(BigNumber.from(0)) ?  +props.generalData?.totalBorrowBalance.toString() / (+props.newBorrowLimit.toString()) * 100 : 0
    //     setBorrowLimit(BigNumber.parseValue(value.toFixed(18)))
        
    // }
    useEffect(() => {
        console.log(`totalBorrowLimitUsedPercent: ${props.generalData?.totalBorrowLimitUsedPercent.toRound(2)}`)
        console.log(`newBorrowLimit: ${props.newBorrowLimit?.toString()}`)
        const value = props.generalData && props.newBorrowLimit && props.newBorrowLimit.gt(BigNumber.from(0)) ?  
            BigNumber.parseValue((+props.generalData?.totalBorrowBalance.toString() / (+props.newBorrowLimit.toString()) * 100).toFixed(18)).toRound(2) 
            : 0
            console.log(`new value: ${value}`)
    }, [props.generalData?.totalBorrowLimitUsedPercent,  props.newBorrowLimit])

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
                        {`$${props.generalData?.totalBorrowLimit ? props.generalData?.totalBorrowLimit.toRound(2) : 0}`}
                    </span>
                    <span className={`dialog-section-arrow ${props.newBorrowLimit && props.newBorrowLimit.gt(BigNumber.from(0))? "dialog-section-arrow-active" : ""}`}><HuArrow width={"15px"} height={"12px"} color={"rgb(66, 122, 241)"}/></span>
                        {props.newBorrowLimit && props.newBorrowLimit.gt(BigNumber.from(0))? (
                    
                        <span>
                            {`$${props.newBorrowLimit ?  props.newBorrowLimit.toRound(2) : 0}`}
                        </span>
                    ) : null}
                </div>
            </div>
            <div className="dialog-section-content">
                <div className="dialog-section-content-header">
                    Borrow Limit Used
                </div>
                <div className="dialog-section-content-value">
                    <span>{`${props.generalData?.totalBorrowLimitUsedPercent ? props.generalData?.totalBorrowLimitUsedPercent.toRound(2) : 0}%`}
                    </span>
                    <span className={`dialog-section-arrow ${props.newBorrowLimit && props.newBorrowLimit.gt(BigNumber.from(0)) ? "dialog-section-arrow-active" : ""}`}><HuArrow width={"15px"} height={"12px"} color={"rgb(66, 122, 241)"}/></span>
                    {props.newBorrowLimit && props.newBorrowLimit.gt(BigNumber.from(0))? 
                        (
                            <span
                                style={{
                                    color: props.newBorrowLimit && props.generalData && props.newBorrowLimit.gt(BigNumber.from(0)) && 
                                        +props.generalData?.totalBorrowBalance/(+props.newBorrowLimit) > 1 ? "red": ""}}>
                                {`${props.generalData && props.newBorrowLimit && props.newBorrowLimit.gt(BigNumber.from(0)) ?  
                                    BigNumber.parseValue((+props.generalData?.totalBorrowBalance.toString() / (+props.newBorrowLimit.toString()) * 100).toFixed(18)).toRound(2) 
                                    : 0}%`}
                            </span>) : null}
                </div>
            </div>
        </div>
    )
}

export default BorrowLimitSection
// props.generalData && props.newBorrowLimit && props.newBorrowLimit.gt(BigNumber.from(0)) ?  
// BigNumber.parseValue((+props.generalData?.totalBorrowBalance.toString() / (+props.newBorrowLimit.toString()) * 100).toFixed(18)).toRound(2) : 0