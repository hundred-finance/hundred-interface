import { BigNumber } from "../../../bigNumber"
import React from "react"
import { Spinner } from "../../../assets/huIcons/huIcons"
import { CTokenInfo } from "../../../Classes/cTokenClass"

import "../style.css"

interface Props{
  details: CTokenInfo | null,
  borrowMarketDialog: (market: CTokenInfo) => void,
}

const BorrowMarketRow: React.FC<Props> = (props : Props) => {
    return (
        <tr onClick={() =>props.details ?  props.borrowMarketDialog(props.details) : null}>
        <td>
          <div className="asset"> 
                <div className="asset-logo">
                  <img className="rounded-circle" src={props?.details?.underlying.logo} alt=""/>
                </div>
                <span>{props?.details?.underlying.symbol}</span>
            </div>
        </td>
        <td className={props.details && +props.details.borrowApy.toFixed(2) > 0 ? "positive" : ""}>
            {`${props.details ? props.details.borrowApy.mul(BigNumber.from("100")).toFixed(2): '0.00'}%`}
            {/* {props?.details?.borrowPctApy?.gt(BigNumber.from("0")) ? (
              <div>
                {`(${props.details.borrowPctApy?.times(100).toFixed(2)}% PCT)`}
              </div>
            ) : null} */}
        </td>
        <td>
            {props.details ? (+props.details.borrowBalanceInTokenUnit.toString() > 0.001 || +props.details.borrowBalanceInTokenUnit.toString() === 0
                              ? +props.details.borrowBalanceInTokenUnit.toFixed(4) : "<0.001"): "0"}
        </td>
        
        <td>
            {props.details ? +props.details.underlying.walletBalance.toFixed(4).toString() : "0"}
        </td>
        <td>
          <div className="spinner-container">
            {`${props.details ? props.details.liquidity.convertToLargeNumberRepresentation(3, '$') : "$0"}`}
            {(props?.details?.borrowSpinner || props?.details?.repaySpinner) ? (<Spinner size={"20px"}/>) : null}
          </div>
        </td>
      </tr>
    )
}

export default BorrowMarketRow