import React from "react"
import { HuLogo } from "../../../assets/huIcons/huIcons"
import {stakingApr, formatApr} from "../aprHelpers";
import "./dialogSection.css"
import { useHundredDataContext } from "../../../Types/hundredDataContext";
import { useUiContext } from "../../../Types/uiContext";

const SupplyRateSection:React.FC = () => {
    const { darkMode } = useUiContext();
    const { selectedMarket, gaugesV4Data } = useHundredDataContext();
    const gaugeV4 = gaugesV4Data
        ? [...gaugesV4Data].find((x) => {
              return x?.generalData.lpTokenUnderlying === selectedMarket?.underlying.address;
          })
        : null;
    return (
        <div className="dialog-section">
            <div className="dialog-section-title">
                Supply Rate
            </div>
            <div className="dialog-section-content">
                    <div className="logo-holder">
                        <img className="rounded-circle"
                            style={{ width: "20px", height: "20px", margin: "0px 0px 0px 0px" }}
                            src={selectedMarket?.underlying.logo}
                        alt=""/>
                    </div>
                <div className="fill">Supply APY</div>
                <div className="dialog-section-content-value" style={{ margin: "0px 0px 0px 0px" }}>
                    {`${selectedMarket ? formatApr(selectedMarket?.supplyApy) : "0.00"}%`}
                </div>
            </div>
            <div className="dialog-section-content">
                    <div className="logo-holder">
                        <HuLogo darkMode={darkMode} size={"20px"}/>
                    </div>
                <div className="fill">Stake APR</div>
                <div className="dialog-section-content-value" style={{ margin: "0px 0px 0px 0px" }}>
                    { stakingApr(selectedMarket, gaugeV4) }
                </div>
            </div>
        </div>
    )
}

export default SupplyRateSection