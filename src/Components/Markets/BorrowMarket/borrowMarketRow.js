import BigNumber from "bignumber.js"
import React from "react"
import { convertToLargeNumberRepresentation } from "../../../helpers"

import "../style.css"


const BorrowMarketRow = (props) => {
    return (
        <tr onClick={() => props.borrowMarketDialog(props.details)}>
        <td>
          <img
            className="rounded-circle"
            style={{ width: "40px" }}
            src={props.details.logoSource}
            alt=""
          />
        </td>
        <td>
          {props.details.symbol}
        </td>
        <td>
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
          {`$${convertToLargeNumberRepresentation(
            new BigNumber(props.details.liquidity).precision(2)
          )}`}
        </td>
      </tr>
    )
}

export default BorrowMarketRow