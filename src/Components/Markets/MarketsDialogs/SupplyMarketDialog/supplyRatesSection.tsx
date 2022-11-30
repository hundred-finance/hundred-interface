import React from "react"
import {stakingApr, formatApr} from "../../aprHelpers";
import "../dialogSection.css"
import { useHundredDataContext } from "../../../../Types/hundredDataContext";
import { GaugeV4 } from "../../../../Classes/gaugeV4Class";
import Logos from "../../../../logos"

interface Props{
    gaugeV4: GaugeV4 | null | undefined
}
const SupplyRateSection:React.FC<Props> = (props: Props) => {
    const { selectedMarket } = useHundredDataContext();
    
    return (
        selectedMarket ? 
        <div className="dialog-section">
            <div className="dialog-section-title">
                Supply Rate
            </div>
            <div className="dialog-section-content">
                    <div className="logo-holder">
                        <img className="rounded-circle"
                            style={{ width: "25px", height: "25px", margin: "0px 0px 0px 0px" }}
                            src={{...selectedMarket}?.underlying.logo}
                        alt=""/>
                    </div>
                <div className="fill">Supply APY</div>
                <div className="dialog-section-content-value" style={{ margin: "0px 0px 0px 0px" }}>
                    {`${{...selectedMarket} ? formatApr({...selectedMarket}?.supplyApy) : "0.00"}%`}
                </div>
            </div>
            <div className="dialog-section-content">
                    <div className="logo-holder">
                        <img className="rounded-circle"
                            style={{ width: "25px", height: "25px", margin: "0px 0px 0px 0px" }}
                            src={Logos["HND"]}
                        alt=""/>
                    </div>
                <div className="fill">Stake APR</div>
                <div className="dialog-section-content-value" style={{ margin: "0px 0px 0px 0px" }}>
                    { stakingApr({...selectedMarket}, props.gaugeV4) }
                </div>
            </div>
        </div>
        : null
    )
}

export default SupplyRateSection