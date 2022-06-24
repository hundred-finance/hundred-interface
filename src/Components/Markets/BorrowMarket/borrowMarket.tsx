import React from "react"
import BorrowMarketRow from "./borrowMarketRow"
import {compareHndAPR, compareLiquidity, compareSymbol} from "../../../helpers"

import "../style.css"
import { CTokenInfo } from "../../../Classes/cTokenClass"
import { BigNumber } from "../../../bigNumber"
import { useHundredDataContext } from "../../../Types/hundredDataContext"

interface Props{
  borrowMarketDialog: (market: CTokenInfo) => void,
  more: boolean
}

const BorrowMarket: React.FC<Props> = (props : Props) => {
  const {generalData, marketsData, marketsSpinners} = useHundredDataContext()
  
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
                {{...generalData}?.totalBorrowBalance?.gt(BigNumber.from("0")) && (
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
                  {marketsData.length > 0 && marketsSpinners.length > 0 ? [...marketsData]?.filter((item) => item?.borrowBalance?.gt(BigNumber.from("0")))
                    .sort(compareSymbol).sort(compareLiquidity).sort(compareHndAPR)
                    .map((market, index) => {
                      const spinners = [...marketsSpinners].find(x => x.symbol === market.underlying.symbol)
                      return <BorrowMarketRow key={index} market={market} marketSpinners={spinners} borrowMarketDialog={props.borrowMarketDialog}/>
                    }) : null}
                  {{...generalData}?.totalBorrowBalance?.gt(BigNumber.from("0")) && (
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
                  {marketsData.length > 0 && marketsSpinners.length > 0 ? [...marketsData]?.filter((item) => item?.borrowBalance?.lte(BigNumber.from("0")))
                    .sort(compareSymbol).sort(compareLiquidity).sort(compareHndAPR)
                    .map((market, index) => {
                      if(props.more || (!props.more && index < 6)){
                        const spinners = [...marketsSpinners].find(x => x.symbol === market.underlying.symbol)
                        return (
                          <BorrowMarketRow key={index} market={market} marketSpinners={spinners} borrowMarketDialog={props.borrowMarketDialog} />
                        )
                      }
                      else return null
                  }) : null}
                </tbody>
            </table> 
        </div>   
    )
}

export default BorrowMarket