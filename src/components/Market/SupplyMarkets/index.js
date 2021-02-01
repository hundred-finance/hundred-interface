import React from "react"
import Tooltip from "../../Tooltip/Tooltip"
import "./supplyMarkets.css"
import SupplyMarketRow from "./supplyMarketRow"

const SupplyMarkets = (props) => {
    return (
        <div className="box markets supply-markets">
            <div className="markets-title">
                <span></span>
                <div>
                    <h3>Supply Markets</h3>
                </div>
            </div>
            <div className="markets-content">
            <table>
                <thead>
                  <tr>
                    <th colSpan="2" style={{textAlign: "center"}}>Asset</th>
                    
                    <th>
                    <Tooltip title="Annual percentage yield of the asset. APY constantly changes to reflect market conditions."
                        placement="bottom-start">
                            <div className="title">Apy</div>
                    </Tooltip>
                    </th>
                    <th>You Supplied</th>
                    <th>Wallet</th>
                    <th>
                    <Tooltip title="By selecting this option you enable your deposited tokens to be used as collateral for borrowing."
                        placement="bottom-end">
                            <div className="title">Use As Collateral</div>
                    </Tooltip>
                    </th>
                  </tr>
                  </thead>
                  <tbody>
                  {props.generalDetails.totalSupplyBalance?.toNumber() > 0 && (
                    <tr>
                      <td
                        style={{
                          fontSize: "80%",
                          fontWeight: "bold",
                          padding: "1px 0px 1px 15px",
                        }}
                      >
                        Supplying
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  )}
                  {props.allMarketDetails
                    .filter((item) => item.supplyBalance?.toNumber() > 0)
                    .sort(props.compareSymbol)
                    .map((details, index) => (
                      <SupplyMarketRow key={index} details={details} index={index} enterMarketDialog={props.enterMarketDialog} supplyMarketDialog={props.supplyMarketDialog}/>
                    ))}
                  {props.generalDetails.totalSupplyBalance?.toNumber() > 0 && (
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
                  {props.allMarketDetails
                    .filter((item) => item.supplyBalance?.toNumber() <= 0)
                    .sort(props.compareSymbol)
                    .map((details, index) => (
                      <SupplyMarketRow key={index} details={details} index={index} enterMarketDialog={props.enterMarketDialog} supplyMarketDialog={props.supplyMarketDialog}/>
                    ))}
                </tbody>
              </table>
            </div>
        </div>
    )
}

export default SupplyMarkets