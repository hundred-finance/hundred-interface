import { BigNumber } from "../../../bigNumber"
import React from "react"
import { Spinner } from "../../../assets/huIcons/huIcons"
import { CTokenInfo, CTokenSpinner } from "../../../Classes/cTokenClass"

import "../style.css"

interface Props{
  market: CTokenInfo | undefined,
  marketSpinners: CTokenSpinner | undefined,
  borrowMarketDialog: (market: CTokenInfo) => void,
}

const BorrowMarketRow: React.FC<Props> = (props : Props) => {
    return (
        <tr onClick={() =>props.market ?  props.borrowMarketDialog(props.market) : null}>
        <td>
          <div className="asset"> 
                <div className="asset-logo">
                  <img className="rounded-circle" src={props?.market?.underlying.logo} alt=""/>
                </div>
                <span>{props?.market?.underlying.symbol}</span>
            </div>
        </td>
        <td className={props.market && +props.market.borrowApy.toFixed(2) > 0 ? "positive" : ""}>
            {`${props.market ? props.market.borrowApy.mul(BigNumber.from("100")).toFixed(2): '0.00'}%`}
            {/* {props?.details?.borrowPctApy?.gt(BigNumber.from("0")) ? (
              <div>
                {`(${props.details.borrowPctApy?.times(100).toFixed(2)}% PCT)`}
              </div>
            ) : null} */}
        </td>
        <td>
            {props.market ? (+props.market.borrowBalanceInTokenUnit.toString() > 0.001 || +props.market.borrowBalanceInTokenUnit.toString() === 0
                              ? +props.market.borrowBalanceInTokenUnit.toFixed(4) : "<0.001"): "0"}
        </td>
        
        <td>
            {props.market ? +props.market.underlying.walletBalance.toFixed(4).toString() : "0"}
        </td>
        <td>
          <div className="spinner-container">
            {`${props.market ? props.market.liquidity.convertToLargeNumberRepresentation(3, '$') : "$0"}`}
            {props.marketSpinners && (props.marketSpinners?.borrowSpinner || props.marketSpinners?.repaySpinner) ? <Spinner size={"20px"}/> : null}
          </div>
        </td>
      </tr>
    )
}

export default BorrowMarketRow