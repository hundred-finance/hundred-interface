import React from "react"
import { HuLogo } from "../../../assets/huIcons/huIcons"
import { BigNumber } from "../../../bigNumber"
import { CTokenInfo } from "../../../Classes/cTokenClass"
import "./dialogSection.css"

interface Props{
    market: CTokenInfo | null,
    darkMode: boolean

}

const BorrowRateSection: React.FC<Props> = (props : Props) => {
    return (
        <div className="dialog-section">
            <div className="dialog-section-title">
                Borrow Rate
            </div>
            <div className="dialog-section-content">
                <div className="logo-holder">
                    <img className="rounded-circle"
                        style={{ width: "20px", height: "20px", margin: "0px 0px 0px 0px" }}
                        src={props.market?.logoSource}
                    alt=""/>
                </div>
                <div className="fill">Borrow APY</div>
                <div className="dialog-section-content-value" style={{ margin: "0px 0px 0px 0px" }}>
                    {`${props.market?.borrowApy?.mul(BigNumber.from("100")).toRound(2)}%`}
                </div>
            </div>
            <div className="dialog-section-content">
                <div className="logo-holder">
                    <HuLogo darkMode={props.darkMode} size={"20px"}/>
                    </div>
                <div className="fill">HND APY</div>
                <div className="dialog-section-content-value" style={{ margin: "0px 0px 0px 0px" }}>
                    {`${props.market ? props.market?.borrowPctApy?.mul(BigNumber.from(100)).toRound(2) : "0"}%`}
                </div>
            </div>
        </div>
    )
}

export default BorrowRateSection