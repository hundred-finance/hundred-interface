import { BigNumber } from "../../../../bigNumber"
import React from "react"
import "../dialogSection.css"
import { useHundredDataContext } from "../../../../Types/hundredDataContext"

const BackstopSection:React.FC = () => {
    const {selectedMarket} = useHundredDataContext()
    // const BorrowLimit = () : void => {
    //     const value = props.generalData && props.newBorrowLimit && props.newBorrowLimit.gt(BigNumber.from(0)) ?  +props.generalData?.totalBorrowBalance.toString() / (+props.newBorrowLimit.toString()) * 100 : 0
    //     setBorrowLimit(BigNumber.parseValue(value.toFixed(18)))
        
    // }
    return (selectedMarket && selectedMarket.backstop ?
        <div className="dialog-section dialog-section-no-top-gap">
            <div className="dialog-section-title">
                Balances
            </div>
            <div className="dialog-section-content">
                <div className="dialog-section-content-header">
                    TVL
                </div>
                <div className="dialog-section-content-value">
                    ${{...selectedMarket.backstop}.tvl.toRound(2, true)}
                </div>
            </div>
            <div className="dialog-line"/>
            <div className="dialog-section-content">
                <div className="dialog-section-content-header">
                    APR
                </div>
                <div className="dialog-section-content-value">
                    {{...selectedMarket.backstop}.apr.toNumeral() * 100 > 10000 ? ">10,000"
                         : BigNumber.parseValue(({...selectedMarket.backstop}.apr.toNumeral() * 100).noExponents()).toRound(2, true, true)}%
                </div>
            </div>
            <div className="dialog-line"/>
            <div className="dialog-section-content">
                <div className="dialog-section-content-header">
                    Backstop Balance
                </div>
                <div className="dialog-section-content-value">
                    {{...selectedMarket.backstop}.userBalance.toRound(2, true)} {{...selectedMarket.backstop}.symbol} 
                </div>
            </div>
            {({...selectedMarket.backstop} as any).ethBalance  ? 
            <div className="dialog-section-content-details">
                <div className="dialog-section-content-header-details">
                </div>
                <div className="dialog-section-content-value-details">
                ({BigNumber.parseValue((+{...selectedMarket.backstop}.userBalance.toString() * +{...selectedMarket.backstop}.sharePrice.toString()).noExponents()).toRound(2, true)} {{...selectedMarket}.underlying.symbol} + {
                     +({...selectedMarket.backstop} as any).userEthBalance.toRound(2) === 0 && +({...selectedMarket.backstop} as any).userEthBalance.toString() > 0 ? ">"+({...selectedMarket.backstop} as any).userEthBalance.toRound(2,true,true) :
                    ({...selectedMarket.backstop} as any).userEthBalance.toRound(2, true, true)} ETH)
                </div>
            </div> : null}
        </div>
        : null
    )
}

export default BackstopSection
// props.generalData && props.newBorrowLimit && props.newBorrowLimit.gt(BigNumber.from(0)) ?  
// BigNumber.parseValue((+props.generalData?.totalBorrowBalance.toString() / (+props.newBorrowLimit.toString()) * 100).toFixed(18)).toRound(2) : 0
