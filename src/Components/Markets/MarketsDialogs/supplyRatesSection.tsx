import React from "react"
import { HuLogo } from "../../../assets/huIcons/huIcons"
import { BigNumber } from "../../../bigNumber"
import { CTokenInfo } from "../../../Classes/cTokenClass"
import "./dialogSection.css"

interface Props{
    market: CTokenInfo | null,
    darkMode: boolean
}

const SupplyRateSection:React.FC<Props> = (props: Props) => {
    return (
        <div className="dialog-section">
            <div className="dialog-section-title">
                Supply Rate
            </div>
            <div className="dialog-section-content">
                    <div className="logo-holder">
                        <img className="rounded-circle"
                            style={{ width: "20px", height: "20px", margin: "0px 0px 0px 0px" }}
                            src={props.market?.underlying.logo}
                        alt=""/>
                    </div>
                <div className="fill">Supply APY</div>
                <div className="dialog-section-content-value" style={{ margin: "0px 0px 0px 0px" }}>
                    {`${props.market ? BigNumber.parseValue((+props.market?.supplyApy.toString() * 100).noExponents()).toRound(2, false, true) : "0.00"}%`}
                </div>
            </div>
            <div className="dialog-section-content">
                    <div className="logo-holder">
                        <HuLogo size={"20px"}/>
                    </div>
                <div className="fill">HND APR</div>
                <div className="dialog-section-content-value" style={{ margin: "0px 0px 0px 0px" }}>
                    {`${props.market ? BigNumber.parseValue((+props.market?.hndAPR.toString() * 100).noExponents()).toRound(2, false, true) : "0"}%`}
                </div>
            </div>
        </div>
    )
}

export default SupplyRateSection