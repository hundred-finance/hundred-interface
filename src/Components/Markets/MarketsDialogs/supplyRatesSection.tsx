import React from "react"
import { HuLogo } from "../../../assets/huIcons/huIcons"
import { CTokenInfo } from "../../../Classes/cTokenClass"
import {stakingApr, formatApr} from "../aprHelpers";
import "./dialogSection.css"
import {GaugeV4} from "../../../Classes/gaugeV4Class";

interface Props{
    market: CTokenInfo | null,
    gaugeV4: GaugeV4 | null | undefined,
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
                    {`${props.market ? formatApr(props.market?.supplyApy) : "0.00"}%`}
                </div>
            </div>
            <div className="dialog-section-content">
                    <div className="logo-holder">
                        <HuLogo size={"20px"}/>
                    </div>
                <div className="fill">Stake APR</div>
                <div className="dialog-section-content-value" style={{ margin: "0px 0px 0px 0px" }}>
                    { stakingApr(props.market, props.gaugeV4) }
                </div>
            </div>
        </div>
    )
}

export default SupplyRateSection