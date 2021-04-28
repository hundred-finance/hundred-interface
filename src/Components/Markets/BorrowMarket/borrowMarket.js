import React, { useState } from "react"
import BorrowMarketRow from "./borrowMarketRow"
import {compareSymbol} from "../../../helpers"

import "../style.css"

const BorrowMarket = (props) => {
    const [more, setMore] = useState(false);
    return (
        <div className="market-content">
            <table className = "market-table">
                <thead className="market-table-header">
                    <tr>
                        <th>Asset</th>
                        <th>APY</th>
                        <th>Borrowed</th>
                        <th>Wallet</th>
                        <th>Liquidity</th>
                    </tr>
                </thead>
                <tbody className="market-table-content">
                {props.generalData?.totalBorrowBalance?.isGreaterThan(0) && (
                    <tr>
                      <td
                        style={{
                          fontSize: "80%",
                          fontWeight: "bold",
                          padding: "1px 0px 1px 15px",
                        }}
                      >
                        Borrowing
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  )}
                  {props.marketsData?.filter((item) => item.borrowBalance?.isGreaterThan(0))
                    .sort(compareSymbol)
                    .map((details, index) => (
                      <BorrowMarketRow key={index} details={details} borrowMarketDialog={props.borrowMarketDialog}/>
                    ))}
                  {props.generalData?.totalBorrowBalance?.isGreaterThan(0) && (
                    <tr>
                      <td
                        style={{
                          fontSize: "80%",
                          fontWeight: "bold",
                          padding: "1px 0px 1px 15px",
                        }}
                      >
                        Other Markets
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  )}
                  {props.marketsData?.filter((item) => item.borrowBalance?.isLessThanOrEqualTo(0) && item.underlyingPrice?.isGreaterThan(0))
                    .sort(compareSymbol)
                    .map((details, index) => {
                      if(more || (!more && index < 4))
                        return (
                          <BorrowMarketRow key={index} details={details} borrowMarketDialog={props.borrowMarketDialog} />
                        )
                      else return null
                  })}
                  {
                    !more && (
                      <tr className='showMoreRow'>
                        <td colSpan={5} className='showMore' onClick={() => setMore(true)}>
                          SHOW MORE
                        </td>
                      </tr>
                    )
                  }
                </tbody>
            </table> 
        </div>   
    )
}

export default BorrowMarket