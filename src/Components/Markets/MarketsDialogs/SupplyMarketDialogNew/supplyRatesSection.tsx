import React from "react"
import { HuLogo } from "../../../../assets/huIcons/huIcons"
import {stakingApr, formatApr} from "../../aprHelpers";
import "../dialogSection.css"
import { useHundredDataContext } from "../../../../Types/hundredDataContext";
import { useUiContext } from "../../../../Types/uiContext";
import { GaugeV4 } from "../../../../Classes/gaugeV4Class";

interface Props{
    gaugeV4: GaugeV4 | null | undefined
}
const SupplyRateSection:React.FC<Props> = (props: Props) => {
    const { darkMode } = useUiContext();
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
                            style={{ width: "20px", height: "20px", margin: "0px 0px 0px 0px" }}
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
                        <HuLogo darkMode={darkMode} size={"20px"}/>
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