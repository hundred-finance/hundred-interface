import { BigNumber } from "@ethersproject/bignumber"
import React from "react"
import { Spinner } from "../../../assets/huIcons/huIcons"
import { CTokenInfo } from "../../../Classes/cTokenClass"
import { convertToLargeNumberRepresentation, toDecimalPlaces } from "../../../helpers"

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
                  <img className="rounded-circle" src={props?.details?.logoSource} alt=""/>
                </div>
                <span>{props?.details?.symbol}</span>
            </div>
        </td>
        <td className={props.details && +toDecimalPlaces(props.details.borrowApy, 36 - props.details.decimals, 2) > 0 ? "positive" : ""}>
            {`${props.details ? toDecimalPlaces(props.details.borrowApy.mul(BigNumber.from(100)), 36-props.details.decimals, 2): '0'}%`}
            {/* {props?.details?.borrowPctApy?.gt(BigNumber.from("0")) ? (
              <div>
                {`(${props.details.borrowPctApy?.times(100).toFixed(2)}% PCT)`}
              </div>
            ) : null} */}
        </td>
        <td>
            {props.details ? (+toDecimalPlaces(props.details.borrowBalanceInTokenUnit, 18, 18) > 0.001 || +toDecimalPlaces(props.details.borrowBalanceInTokenUnit, 18, 18) === 0
                              ? +toDecimalPlaces(props.details.borrowBalanceInTokenUnit, 18, 4).toString() : "<0.001"): "0"}
        </td>
        
        <td>
            {props.details ? +toDecimalPlaces(props.details.walletBalance, props.details.decimals, 4).toString() : "0"}
        </td>
        <td>
          <div className="spinner-container">
            {`${props.details ? convertToLargeNumberRepresentation(props.details.liquidity, 36, 2, '$') : "$0"}`}
            {(props?.details?.borrowSpinner || props?.details?.repaySpinner) ? (<Spinner size={"20px"}/>) : null}
          </div>
        </td>
      </tr>
    )
}

export default BorrowMarketRow