import { BigNumber } from "../../../../bigNumber"
import React, { useEffect, useState } from "react"
import "../dialogSection.css"
import { useHundredDataContext } from "../../../../Types/hundredDataContext"

const BackstopSection:React.FC = () => {
    const { selectedMarket } = useHundredDataContext();  
    const [backstopAPR, setBackstopAPR] = useState<string>("0.00")
    const [shareAmount, setShareAmount] = useState<string>("0.00")  
    const [ethBalance, setEthBalance] = useState<any>()
    const [userEthBalance, setUserEthBalance] = useState<string | boolean>("0.00")

    // const BorrowLimit = () : void => {
    //     const value = props.generalData && props.newBorrowLimit && props.newBorrowLimit.gt(BigNumber.from(0)) ?  +props.generalData?.totalBorrowBalance.toString() / (+props.newBorrowLimit.toString()) * 100 : 0
    //     setBorrowLimit(BigNumber.parseValue(value.toFixed(18)))
        
    // }

    useEffect(() => {
        if(selectedMarket && selectedMarket.backstop){
            const bs = {...selectedMarket}.backstop
            const apr = bs ? bs.apr.toNumeral() * 100 > 10000 ? ">10,000" : BigNumber.parseValue((bs.apr.toNumeral() * 100).noExponents()).toRound(2, true, true) : "0.00"
            setBackstopAPR(apr)
            const share = bs ? BigNumber.parseValue((+bs.userBalance.toString() * +bs.sharePrice.toString()).noExponents()).toRound(2, true) : "0.00"
            setShareAmount(share)
            const ethbalance = (bs as any).ethBalance
            setEthBalance(ethbalance)
        
            let userEthbalance = +(bs as any).userEthBalance.toRound(2) === 0 
            userEthbalance = userEthbalance && +(bs as any).userEthbalance.toString() > 0 
            userEthbalance = userEthbalance ? ">"+(bs as any).userEthbalance.toRound(2,true,true) : (bs as any).userEthbalance.toRound(2, true, true)

            setUserEthBalance(userEthbalance)
        }

    }, [selectedMarket])

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
                    ${{...selectedMarket}.backstop?.tvl.toRound(2, true)}
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
                    {{...selectedMarket}?.backstop?.userBalance.toRound(2, true)} {{...selectedMarket}.backstop?.symbol} 
                </div>
            </div>
            { ethBalance  ? 
            <div className="dialog-section-content-details">
                <div className="dialog-section-content-header-details">
                </div>
                <div className="dialog-section-content-value-details">
                ({shareAmount} {{...selectedMarket}.underlying?.symbol} + {userEthBalance} ETH)
                </div>
            </div> : null}
        </div>
    )
}

export default BackstopSection
// props.generalData && props.newBorrowLimit && props.newBorrowLimit.gt(BigNumber.from(0)) ?  
// BigNumber.parseValue((+props.generalData?.totalBorrowBalance.toString() / (+props.newBorrowLimit.toString()) * 100).toFixed(18)).toRound(2) : 0

