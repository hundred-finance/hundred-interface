import { BigNumber } from "../../../../bigNumber"
import React from "react"
import "../dialogSection.css"
import { useHundredDataContext } from "../../../../Types/hundredDataContext"

const BackstopSection:React.FC = () => {
    const { selectedMarket } = useHundredDataContext();
    // const BorrowLimit = () : void => {
    //     const value = props.generalData && props.newBorrowLimit && props.newBorrowLimit.gt(BigNumber.from(0)) ?  +props.generalData?.totalBorrowBalance.toString() / (+props.newBorrowLimit.toString()) * 100 : 0
    //     setBorrowLimit(BigNumber.parseValue(value.toFixed(18)))
        
    // }
    const market = {...selectedMarket}
    let tvl = ""; 
    let backstopSymbol = "";     
    let backstopUserBalance = "";
    let backstopAPR = "0.00";
    let ethBalance;
    let userEthBalance: string | boolean = "0.00"; 
    let shareAmount = "0.00"
    const underlyingSymbol = market.underlying ? market.underlying.symbol : ""
    
    if (market.backstop){
        const bs = market.backstop 
        tvl = bs.tvl.toRound(2, true)
        backstopAPR = bs.apr.toNumeral() * 100 > 10000 ? ">10,000" : BigNumber.parseValue((bs.apr.toNumeral() * 100).noExponents()).toRound(2, true, true); 
        backstopUserBalance = bs.userBalance.toRound(2, true)
        backstopSymbol = bs.symbol
        ethBalance = (bs as any).ethBalance
        shareAmount = BigNumber.parseValue((+bs.userBalance.toString() * +bs.sharePrice.toString()).noExponents()).toRound(2, true)
        userEthBalance = +(bs as any).userEthBalance.toRound(2) === 0 
        userEthBalance = userEthBalance && +(bs as any).userEthBalance.toString() > 0 
        userEthBalance = userEthBalance ? ">"+(bs as any).userEthBalance.toRound(2,true,true) : (bs as any).userEthBalance.toRound(2, true, true)
    }
    return (
        <div className="dialog-section dialog-section-no-top-gap">
            <div className="dialog-section-title">
                Balances
            </div>
            <div className="dialog-section-content">
                <div className="dialog-section-content-header">
                    TVL
                </div>
                <div className="dialog-section-content-value">
                    ${tvl}
                </div>
            </div>
            <div className="dialog-section-content">
                <div className="dialog-section-content-header">
                    APR
                </div>
                <div className="dialog-section-content-value">
                    {backstopAPR}%
                </div>
            </div>
            <div className="dialog-section-content">
                <div className="dialog-section-content-header">
                    Backstop Balance
                </div>
                <div className="dialog-section-content-value">
                    {backstopUserBalance} {backstopSymbol} 
                </div>
            </div>
            { ethBalance  ? 
            <div className="dialog-section-content-details">
                <div className="dialog-section-content-header-details">
                </div>
                <div className="dialog-section-content-value-details">
                ({shareAmount} {underlyingSymbol} + {userEthBalance} ETH)
                </div>
            </div> : null}
        </div>
    )
}

export default BackstopSection
// props.generalData && props.newBorrowLimit && props.newBorrowLimit.gt(BigNumber.from(0)) ?  
// BigNumber.parseValue((+props.generalData?.totalBorrowBalance.toString() / (+props.newBorrowLimit.toString()) * 100).toFixed(18)).toRound(2) : 0

