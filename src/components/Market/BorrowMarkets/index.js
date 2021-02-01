import React from "react"
import Tooltip from "../../Tooltip/Tooltip"
import "./borrowMarkets.css"
import BorrowMarketRow from "./borrowMarketRow"

const BorrowMarkets = (props) => {
    return (
        <div className="box markets borrow-markets">
            <div className="markets-title">
                <span></span>
                <div>
                    <h3>Borrow Markets</h3>
                </div>
            </div>
            <div className="markets-content">
            <table >
                <thead>
                    <tr>
                        <th colSpan="2" style={{textAlign: "center"}}>Asset</th>
                        <th>APY</th>
                        <th>You Borrowed</th>
                        <th>Total Borrowed</th>
                        <th>Wallet</th>
                        <th>
                          <Tooltip title="Total supply of a specific token in the money market." placement="bottom-end">
                            <div className="title">
                              Liquidity
                            </div>
                          </Tooltip>
                        </th>
                    </tr>
                </thead>
                <tbody>
                  {props.generalDetails.totalBorrowBalance?.toNumber() > 0 && (
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
                      <td></td>
                    </tr>
                  )}
                  {props.allMarketDetails
                    .filter((item) => item.borrowBalance?.toNumber() > 0)
                    .sort(props.compareSymbol)
                    .map((details, index) => (
                      <BorrowMarketRow key={index} details={details} borrowMarketDialog={props.borrowMarketDialog}/>
                    ))}
                  {props.generalDetails.totalBorrowBalance?.toNumber() > 0 && (
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
                      <td></td>
                    </tr>
                  )}
                  {props.allMarketDetails
                    .filter((item) => item.borrowBalance?.toNumber() <= 0)
                    .sort(props.compareSymbol)
                    .map((details, index) => (
                      <BorrowMarketRow key={index} details={details} borrowMarketDialog={props.borrowMarketDialog} />
                    ))}
                </tbody>
              </table>
            </div>
        </div>
    )
}

export default BorrowMarkets