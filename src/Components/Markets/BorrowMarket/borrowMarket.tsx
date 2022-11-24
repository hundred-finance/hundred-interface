import React from "react"
import BorrowMarketRow from "./borrowMarketRow"
import {compareHndAPR, compareLiquidity, compareSymbol} from "../../../helpers"

import "../style.css"
import { CTokenInfo } from "../../../Classes/cTokenClass"
import { BigNumber } from "../../../bigNumber"
import { useHundredDataContext } from "../../../Types/hundredDataContext"

interface Props{
  allAssets: boolean,
  myAssets: boolean,
  searchAssets: string,
  borrowMarketDialog: (market: CTokenInfo) => void,
}

const BorrowMarket: React.FC<Props> = (props : Props) => {
  const {marketsData, marketsSpinners} = useHundredDataContext()
  
    return (
        <div className="market-content">
            <table className = "market-table">
                <thead className="market-table-header">
                    <tr>
                        <th colSpan={5}>
                            <div className='seperator'/>
                        </th>
                    </tr>
                    <tr className='market-table-header-headers'>
                        <th className='market-header-title'>Asset</th>
                        <th className='market-header-title'>APY</th>
                        <th className='market-header-title'>Borrowed</th>
                        <th className='market-header-title'>Wallet</th>
                        <th className='market-header-title'>Liquidity</th>
                    </tr>
                    <tr>
                        <th colSpan={5}>
                            <div className='seperator'/>
                        </th>
                    </tr>
                </thead>
                {props.myAssets ? 
                  <tbody className="market-table-content">
                  {marketsData.length > 0 && marketsSpinners.length > 0 ? [...marketsData]
                      ?.filter((item) => item?.borrowBalance?.gt(BigNumber.from("0")))
                      .filter((item) => {
                        if(props.searchAssets.trim() === "") return true
                        if(item.underlying.name.toLowerCase().includes(props.searchAssets.toLowerCase().trim()) || 
                           item.underlying.symbol.toLowerCase().includes(props.searchAssets.toLowerCase().trim()))
                            return true
                        return false
                    })
                      .sort(compareSymbol).sort(compareLiquidity).sort(compareHndAPR)
                      .map((market, index) => {
                        const spinners = [...marketsSpinners].find(x => x.symbol === market.underlying.symbol)
                        return <BorrowMarketRow key={index} market={market} marketSpinners={spinners} borrowMarketDialog={props.borrowMarketDialog}/>
                      }) : null}
                  </tbody>
                : props.allAssets ? 
                <tbody className="market-table-content">
                  {marketsData.length > 0 && marketsSpinners.length > 0 ? [...marketsData]
                    ?.filter((item) => item?.borrowBalance?.gt(BigNumber.from("0")))
                    .filter((item) => {
                      if(props.searchAssets.trim() === "") return true
                      if(item.underlying.name.toLowerCase().includes(props.searchAssets.toLowerCase().trim()) || 
                         item.underlying.symbol.toLowerCase().includes(props.searchAssets.toLowerCase().trim()))
                          return true
                      return false
                  })
                    .sort(compareSymbol).sort(compareLiquidity).sort(compareHndAPR)
                    .map((market, index) => {
                      const spinners = [...marketsSpinners].find(x => x.symbol === market.underlying.symbol)
                      return <BorrowMarketRow key={index} market={market} marketSpinners={spinners} borrowMarketDialog={props.borrowMarketDialog}/>
                    }) : null}
                  {marketsData.length > 0 && marketsSpinners.length > 0 ? [...marketsData]
                    ?.filter((item) => item?.borrowBalance?.lte(BigNumber.from("0")))
                    .filter((item) => {
                      if(props.searchAssets.trim() === "") return true
                      if(item.underlying.name.toLowerCase().includes(props.searchAssets.toLowerCase().trim()) || 
                         item.underlying.symbol.toLowerCase().includes(props.searchAssets.toLowerCase().trim()))
                          return true
                      return false
                  })
                    .sort(compareSymbol).sort(compareLiquidity).sort(compareHndAPR)
                    .map((market, index) => {
                    
                        const spinners = [...marketsSpinners].find(x => x.symbol === market.underlying.symbol)
                        return (
                          <BorrowMarketRow key={index} market={market} marketSpinners={spinners} borrowMarketDialog={props.borrowMarketDialog} />
                        )                    
                }) : null}
              </tbody>
                : null}
            </table> 
        </div>   
    )
}

export default BorrowMarket