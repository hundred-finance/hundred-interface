import BigNumber from "bignumber.js"
import React from "react"
import { Spinner } from "../../../assets/huIcons/huIcons"
import { convertToLargeNumberRepresentation } from "../../../helpers"

import "../style.css"


const BorrowMarketRow = (props) => {
    return (
        <tr onClick={() => props.borrowMarketDialog(props.details)}>
        <td>
          <div className="asset"> 
                <div className="asset-logo">
                  <img className="rounded-circle" src={props.details.logoSource} alt=""/>
                </div>
                <span>{props.details.symbol}</span>
            </div>
        </td>
        <td className={props.details?.borrowApy.toFixed(2) > 0 ? "positive" : ""}>
            {`${props.details.borrowApy?.times(100).toFixed(2)}%`}
            {props.details.borrowPctApy?.isGreaterThan(0) ? (
              <div>
                {`(${props.details.borrowPctApy?.times(100).toFixed(2)}% PCT)`}
              </div>
            ) : null}
        </td>
        <td>
            {props.details.borrowBalanceInTokenUnit.decimalPlaces(4).toString()}
        </td>
        
        <td>
            {props.details.walletBalance.decimalPlaces(4).toString()}
        </td>
        <td>
          <div className="spinner-container">
            {`$${convertToLargeNumberRepresentation(
              new BigNumber(props.details.liquidity).precision(2)
            )}`}
            {(props.details.borrowSpinner || props.details.repaySpinner) ? (<Spinner size={"20px"}/>) : null}
          </div>
        </td>
      </tr>
    )
}

export default BorrowMarketRow