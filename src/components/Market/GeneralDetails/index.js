import React from "react"
import { convertToLargeNumberRepresentation, zeroStringIfNullish } from "../../../helpers"
import Tooltip from "../../Tooltip/Tooltip"
import "./generalDetails.css"

const GeneralDetails = (props) => {
    return (
        <div className="box general-details">
            <div className = "market-overview">
                <div className="title">Market Overview</div>
                <div className="content">
                    <div>
                        Total Supply: <span>${convertToLargeNumberRepresentation(props.generalDetails.allMarketsTotalSupplyBalance?.precision(4))}</span>
                    </div>
                    <div>
                        Total Borrow: <span>${convertToLargeNumberRepresentation(props.generalDetails.allMarketsTotalBorrowBalance?.precision(4))}</span>
                    </div>
                    <div>
                        Total Liquidity: <span>${convertToLargeNumberRepresentation(props.generalDetails.totalLiquidity?.precision(4))}</span>
                    </div>
                </div>
            </div>
            <div className = "balance-overview">
                <div className="title">Your Supply Balance</div>
                <div className="balance-overview-balance">
                {`$${zeroStringIfNullish(
                      props.generalDetails.totalSupplyBalance?.toFixed(2),
                      2
                    )}`}
                </div>
            </div>
            <div className = "netapy-overview">
                    <Tooltip title="The balance of outstanding value you borrowed from the protocol."
                        placement="bottom-start">
                            <div className="title">Net Apy</div>
                    </Tooltip>
                    <div className="content">
                        <div>
                            {`${zeroStringIfNullish(
                                props.generalDetails.netApy?.times(100).toFixed(2),
                                2
                            )}%`}
                        </div>
                        <div>
                            {`+ ${zeroStringIfNullish(
                                props.generalDetails.totalSupplyPctApy?.times(100).toFixed(2),
                                2
                            )}% PCT (supply)`}
                        </div>
                        <div>
                            {`+ ${zeroStringIfNullish(
                                props.generalDetails.totalBorrowPctApy?.times(100).toFixed(2),
                                2
                            )}% PCT (borrow)`}
                        </div>
                    </div>
            </div>
            <div className = "borrow-balance-overview">
                    <Tooltip title="The balance of outstanding value you borrowed from the protocol."
                        placement="bottom-start">
                            <div className="title">Your Borrow Balance</div>
                    </Tooltip>
                    <div className="balance-overview-balance">
                        {`$${zeroStringIfNullish(
                            props.generalDetails.totalBorrowBalance?.toFixed(2),
                            2
                        )}`}
                    </div>
            </div>
            <div className = "borrow-limit-overview">
                    <Tooltip title="The balance of outstanding value you borrowed from the protocol."
                    placement="bottom-end">
                        <div className="title">Your Borrow Limit</div>
                    </Tooltip>
                    <div className="balance-overview-balance">
                    <span>
                      {`$${zeroStringIfNullish(
                        props.generalDetails.totalBorrowLimit?.toFixed(2),
                        2
                      )}`}
                    </span>
                    <span
                      style={{
                        fontSize: "50%",
                        margin: "0px 0px 0px 10px",
                        color: "grey",
                      }}
                    >
                      {`(${zeroStringIfNullish(
                        props.generalDetails.totalBorrowLimitUsedPercent?.toFixed(2),
                        2
                      )}% Used)`}
                    </span>
                    </div>
            </div>
        </div>
    )
}

export default GeneralDetails