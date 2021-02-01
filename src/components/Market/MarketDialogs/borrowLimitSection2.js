import BigNumber from "bignumber.js"
import React from "react"
import { HuArrow } from "../../../assets/huIcons/huIcons"
import { zeroStringIfNullish } from "../../../helpers"
import "./dialogSection.css"

const BorrowLimitSection2 = (props) => {

    const getNewBorrowBalance = (
        originBorrowBalance,
        borrowAmount,
        repayAmount,
        underlyingPrice
      ) => {
        return originBorrowBalance?.plus(
          new BigNumber(borrowAmount).minus(repayAmount).times(underlyingPrice)
        );
      };

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
                        {`$${props.generalDetails.totalBorrowBalance?.toFixed(2)}`}
                    </span>
                    <span className={`dialog-section-arrow ${props.borrowAmount || props.repayAmount ? "dialog-section-arrow-active" : ""}`}><HuArrow width={"15px"} height={"12px"} color={"rgb(66, 122, 241)"}/></span>
                        {props.borrowAmount || props.repayAmount ? (
                    
                        <span>
                            {`$${zeroStringIfNullish(
                                    getNewBorrowBalance(
                                        props.generalDetails.totalBorrowBalance,
                                        props.borrowAmount,
                                        props.repayAmount,
                                        props.selectedMarketDetails.underlyingPrice)?.toFixed(2),2)}`}
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
                        props.generalDetails.totalBorrowLimitUsedPercent?.toFixed(2),2)}%`}
                    </span>
                    <span className={`dialog-section-arrow ${props.borrowAmount || props.repayAmount ? "dialog-section-arrow-active" : ""}`}><HuArrow width={"15px"} height={"12px"} color={"rgb(66, 122, 241)"}/></span>
                    {props.borrowAmount || props.repayAmount ? 
                        (
                            <span style={{color: getNewBorrowBalance(
                                                    props.generalDetails.totalBorrowBalance,
                                                    props.borrowAmount,
                                                    props.repayAmount,
                                                    props.selectedMarketDetails.underlyingPrice
                                        )?.div(props.generalDetails.totalBorrowLimit).isGreaterThan(1)
                                        ? "red": null,}}>
                                {`${zeroStringIfNullish(getNewBorrowBalance(
                                                            props.generalDetails.totalBorrowBalance,
                                                            props.borrowAmount,
                                                            props.repayAmount,
                                                            props.selectedMarketDetails.underlyingPrice)                           
                                    ?.div(props.generalDetails.totalBorrowLimit).times(100).toFixed(2),2)}%`}
                            </span>
                        ) : null}
                </div>
            </div>
        </div>
    )
}

export default BorrowLimitSection2
