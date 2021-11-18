import { BigNumber } from "../../../bigNumber"
import React from "react"
import "./dialogSection.css"
import { CTokenInfo } from "../../../Classes/cTokenClass"

interface Props{
    market: CTokenInfo
    
}

const BackstopSection:React.FC<Props> = (props : Props) => {
    
    // const BorrowLimit = () : void => {
    //     const value = props.generalData && props.newBorrowLimit && props.newBorrowLimit.gt(BigNumber.from(0)) ?  +props.generalData?.totalBorrowBalance.toString() / (+props.newBorrowLimit.toString()) * 100 : 0
    //     setBorrowLimit(BigNumber.parseValue(value.toFixed(18)))
        
    // }
    

    return (
        <div className="dialog-section">
            <div className="dialog-section-title">
                Balances
            </div>
            <div className="dialog-section-content">
                <div className="dialog-section-content-header">
                    Backstop Balance
                </div>
                <div className="dialog-section-content-value">
                    {props.market.backstop?.userBalance.toRound(2, true)} {props.market.backstop?.symbol} (
                        {props.market.backstop ? BigNumber.parseValue((+props.market.backstop.userBalance.toString() * +props.market.backstop.sharePrice.toString()).toString()).toRound(2, true) : 0} {props.market.symbol})
                </div>
            </div>
            <div className="dialog-section-content">
                <div className="dialog-section-content-header">
                    Total Supply
                </div>
                <div className="dialog-section-content-value">
                    {props.market.backstop?.totalSupply.toRound(2, true)} {props.market.backstop?.symbol} (
                        {props.market.backstop ? BigNumber.from((+props.market.backstop.totalSupply.toString() * +props.market.backstop.sharePrice.toString()).toString()).toRound(2, true) : 0} {props.market.symbol})
                </div>
            </div>
        </div>
    )
}

export default BackstopSection
// props.generalData && props.newBorrowLimit && props.newBorrowLimit.gt(BigNumber.from(0)) ?  
// BigNumber.parseValue((+props.generalData?.totalBorrowBalance.toString() / (+props.newBorrowLimit.toString()) * 100).toFixed(18)).toRound(2) : 0