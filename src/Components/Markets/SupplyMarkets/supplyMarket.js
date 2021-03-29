import React from "react"
import "../style.css"
import SupplyMarketRow from "./supplyMarketRow"
import {compareSymbol} from "../../../helpers"

const SupplyMarket = (props) => {
   
    return (
        <div className="market-content">
            <table className = "market-table">
            <thead className="market-table-header">
                <tr>
                    <th>Asset</th>
                    <th>APY</th>
                    <th>Supplied</th>
                    <th>Wallet</th>
                    <th>Collateral</th>
                </tr>
            </thead>
            <tbody className="market-table-content">
                {props.generalData?.totalSupplyBalance?.isGreaterThan(0) && (
                    <tr>
                      <td
                        style={{
                          fontSize: "100%",
                          fontWeight: "bold",
                          padding: "10px 0px 10px 15px",
                        }}
                      >
                        Supplying
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  )}
                  {props.marketsData?.filter((item) => item.supplyBalance?.isGreaterThan(0))
                    .sort(compareSymbol)
                    .map((details, index) => (
                      <SupplyMarketRow key={index} details={details} index={index} enterMarketDialog={props.enterMarketDialog} supplyMarketDialog={props.supplyMarketDialog} closeSupplyMarketDialog={props.closeSupplyMarketDialog}/>
                    ))}
                  {props.generalData?.totalSupplyBalance?.toNumber() > 0 && (
                    <tr>
                      <td
                        style={{
                          fontSize: "100%",
                          fontWeight: "bold",
                          padding: "10px 0px 10px 15px",
                        }}
                      >
                        Other Markets
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  )}
                  {props.marketsData?.filter((item) => item.supplyBalance?.isLessThanOrEqualTo(0))
                    .sort(compareSymbol)
                    .map((details, index) => (
                      <SupplyMarketRow key={index} details={details} index={index} enterMarketDialog={props.enterMarketDialog} supplyMarketDialog={props.supplyMarketDialog} closeSupplyMarketDialog={props.closeSupplyMarketDialog}/>
                    ))}

            </tbody>
        </table>
        </div>
    )
}

export default SupplyMarket