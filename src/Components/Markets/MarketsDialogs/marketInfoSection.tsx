import React from "react"
import { BigNumber } from "../../../bigNumber"
import { useHundredDataContext } from "../../../Types/hundredDataContext"
import "./dialogSection.css"

interface Props{
    collateralFactorText?: string,
}

const DialogMarketInfoSection : React.FC<Props> = (props : Props) => {
    const {selectedMarket} = useHundredDataContext()

    const getSupplyBorrowed = () : string => {
        if (selectedMarket){
            const market = {...selectedMarket}
            const marketTotalBorrowInTokenUnit = +market?.marketTotalBorrowInTokenUnit.toString()
            const underlyingAmount = +market?.cash.toString()
            let value = marketTotalBorrowInTokenUnit / (marketTotalBorrowInTokenUnit + underlyingAmount) * 100
            if (isNaN(value)) value = 0
            //else value = Math.round((value + Number.EPSILON) * Math.pow(10, 18)) / Math.pow(10, 18)
            return BigNumber.parseValue(value.toFixed(18)).toRound(2, false, true)+"%"
        }
        return "0%"
    }

    return (
        <div className="dialog-section">
            <div className="dialog-section-title">
                Market Info
            </div>
            {props.collateralFactorText ? (
                <div className="dialog-section-content">
                <div className="dialog-section-content-header">
                    <span>{props.collateralFactorText}</span>
                </div>
                <div className="dialog-section-content-value" style={{ margin: "0px 0px 0px 0px" }}>
                    {`${selectedMarket ? {...selectedMarket}?.collateralFactor?.mul(BigNumber.from(100)).toRound(2, false, true) : "0.00"}%`}
                </div>
            </div>
            ) : null}
            <div className="dialog-section-content">
                <div className="dialog-section-content-header">
                    <span>% of Supply Borrowed</span>
                </div>
                <div className="dialog-section-content-value" style={{ margin: "0px 0px 0px 0px" }}>
                    {getSupplyBorrowed()}
                </div>
            </div>
        </div>
    )
}

export default DialogMarketInfoSection