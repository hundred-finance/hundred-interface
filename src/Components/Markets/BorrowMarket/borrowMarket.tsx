import React from "react"
import BorrowMarketRow from "./borrowMarketRow"
import {compareHndAPR, compareLiquidity, compareSymbol} from "../../../helpers"

import "../style.css"
import { CTokenInfo } from "../../../Classes/cTokenClass"
import { GeneralDetailsData } from "../../../Classes/generalDetailsClass"
import { BigNumber } from "../../../bigNumber"

interface Props{
  generalData: GeneralDetailsData | null,
  marketsData: (CTokenInfo | null)[] | null | undefined,
  borrowMarketDialog: (market: CTokenInfo) => void,
  more: boolean
}

const BorrowMarket: React.FC<Props> = (props : Props) => {
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
                {props.generalData?.totalBorrowBalance?.gt(BigNumber.from("0")) && (
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
                  {props.marketsData?.filter((item) => item?.borrowBalance?.gt(BigNumber.from("0")))
                    .sort(compareSymbol).sort(compareLiquidity).sort(compareHndAPR)
                    .map((details, index) => (
                      <BorrowMarketRow key={index} details={details} borrowMarketDialog={props.borrowMarketDialog}/>
                    ))}
                  {props.generalData?.totalBorrowBalance?.gt(BigNumber.from("0")) && (
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
                  {props.marketsData?.filter((item) => item?.borrowBalance?.lte(BigNumber.from("0")))
                    .sort(compareSymbol).sort(compareLiquidity).sort(compareHndAPR)
                    .map((details, index) => {
                      if(props.more || (!props.more && index < 6))
                        return (
                          <BorrowMarketRow key={index} details={details} borrowMarketDialog={props.borrowMarketDialog} />
                        )
                      else return null
                  })}
                </tbody>
            </table> 
        </div>   
    )
}

export default BorrowMarket