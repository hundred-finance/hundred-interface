import React from "react"
import { HuLogo } from "../../../../assets/huIcons/huIcons"
import { BigNumber } from "../../../../bigNumber"
import Logos from "../../../../logos"
import { useHundredDataContext } from "../../../../Types/hundredDataContext"
import { useUiContext } from "../../../../Types/uiContext"
import "../dialogSection.css"


const BorrowRateSection: React.FC = () => {
    const {darkMode} = useUiContext()
    const {selectedMarket} = useHundredDataContext()

    return (
        <div className="dialog-section">
            <div className="dialog-section-title">
                Borrow Rate
            </div>
            <div className="dialog-section-content">
                <div className="logo-holder">
                    <img className="rounded-circle"
                        style={{ width: "25px", height: "25px", margin: "0px 0px 0px 0px" }}
                        src={selectedMarket ? {...selectedMarket}?.underlying.logo : undefined}
                    alt=""/>
                </div>
                <div className="fill">Borrow APY</div>
                <div className="dialog-section-content-value" style={{ margin: "0px 0px 0px 0px" }}>
                    {`${selectedMarket ? {...selectedMarket}?.borrowApy.mul(BigNumber.from("100")).toFixed(2) : "0.00"}%`}
                </div>
            </div>
            <div className="dialog-section-content">
                <div className="logo-holder">
                        <img className="rounded-circle"
                            style={{ width: "25px", height: "25px", margin: "0px 0px 0px 0px" }}
                            src={Logos["HND"]}
                        alt=""/>
                    </div>
                <div className="fill">HND APY</div>
                <div className="dialog-section-content-value" style={{ margin: "0px 0px 0px 0px" }}>
                    {`${selectedMarket ? (+{...selectedMarket}?.borrowHndApy * 100).toFixed(2) : "0.00"}%`}
                </div>
            </div>
        </div>
    )
}

export default BorrowRateSection