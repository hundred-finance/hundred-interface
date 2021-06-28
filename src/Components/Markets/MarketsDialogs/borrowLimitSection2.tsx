import { BigNumber } from "../../../bigNumber"
import React, { useEffect, useState } from "react"
import { HuArrow } from "../../../assets/huIcons/huIcons"
import { CTokenInfo } from "../../../Classes/cTokenClass"
import { GeneralDetailsData } from "../../../Classes/generalDetailsClass"
import "./dialogSection.css"

interface Props{
    generalData : GeneralDetailsData | null,
    borrowAmount: string,
    repayAmount: string,
    market: CTokenInfo | null
}

const BorrowLimitSection2: React.FC<Props> = (props : Props) => {
    const [borrowBalance, setBorrowBalance] = useState<BigNumber>(BigNumber.from("0"))
    const [borrowLimit, setBorrowLimit] = useState<BigNumber>(BigNumber.from("0"))

    useEffect(() =>{
        if(props.generalData && props.market){
            if((props.borrowAmount!=="" && !isNaN(+props.borrowAmount) && props.repayAmount==="0") || (props.repayAmount!=="" && !isNaN(+props.repayAmount) && props.borrowAmount==="0")){
                getNewBorrowBalance(
                    props.generalData.totalBorrowBalance,
                    props.borrowAmount,
                    props.repayAmount,
                    props.market?.underlyingPrice)
            }
            else{
                setBorrowBalance(BigNumber.from(0))
                setBorrowLimit(BigNumber.from(0))
            }
        }
    },[props.borrowAmount, props.repayAmount])

    const getNewBorrowBalance = (originBorrowBalance : BigNumber, borrowAmount : string, repayAmount : string, underlyingPrice : BigNumber) : void => {
        if(props.generalData){
            if (borrowAmount === "" || isNaN(+borrowAmount)) borrowAmount="0"
        if (repayAmount === "" || isNaN(+repayAmount)) repayAmount="0"
        const value =
            +originBorrowBalance.toString() + ((+BigNumber.parseValue(borrowAmount).toString() - +BigNumber.parseValue(repayAmount).toString()) * +underlyingPrice.toString())
            // const value = (originBorrowBalance.add((BigNumber.parseValue(borrowAmount).sub(BigNumber.parseValue(repayAmount)).mul(underlyingPrice))))
            setBorrowBalance(value===0 ? BigNumber.from(0) :BigNumber.parseValue(value.toFixed(18)))
            const pValue = +props.generalData.totalBorrowLimit.toString() > 0 ? +value / +props.generalData.totalBorrowLimit.toString() * 100 : 0
            setBorrowLimit(pValue === 0 ? BigNumber.from(0) : BigNumber.parseValue(pValue.toFixed(18)))
        }
      }

    return (
        <div className="dialog-section">
            <div className="dialog-section-title">
                Borrow Limit
            </div>
            <div className="dialog-section-content">
                <div className="dialog-section-content-header">
                    Borrow Balance
                </div>
                <div className="dialog-section-content-value">
                    <span>
                        {`$${props.generalData?.totalBorrowBalance ? props.generalData?.totalBorrowBalance.toRound(2) : 0}`}
                    </span>
                    <span className={`dialog-section-arrow ${ borrowBalance.gt(BigNumber.from("0")) ? "dialog-section-arrow-active" : ""}`}><HuArrow width={"15px"} height={"12px"} color={"rgb(66, 122, 241)"}/></span>
                        {borrowBalance.gt(BigNumber.from("0")) ? (
                    
                        <span>
                            {`$${borrowBalance.toRound(2)}`}
                        </span>
                    ) : null}
                </div>
            </div>
            <div className="dialog-section-content">
                <div className="dialog-section-content-header">
                    Borrow Limit Used
                </div>
                <div className="dialog-section-content-value">
                    <span>{`${props.generalData?.totalBorrowLimitUsedPercent ? 
                        props.generalData?.totalBorrowLimitUsedPercent.toRound(2) : 0}%`}
                    </span>
                    <span className={`dialog-section-arrow ${borrowLimit.gt(BigNumber.from("0")) ? "dialog-section-arrow-active" : ""}`}><HuArrow width={"15px"} height={"12px"} color={"rgb(66, 122, 241)"}/></span>
                    {borrowLimit.gt(BigNumber.from("0")) ? 
                        (
                            <span style={{color: (+borrowLimit.toString() > 100) ? "red" : ""}}>
                                {`${borrowLimit.toFixed(2)}%`}
                            </span>
                        ) : null}
                </div>
            </div>
        </div>
    )
}

export default BorrowLimitSection2
