import { BigNumber } from "../../../bigNumber"
import React from "react"
import { Spinner } from "../../../assets/huIcons/huIcons"
import { CTokenInfo, CTokenSpinner } from "../../../Classes/cTokenClass"

import "../style.css"
import { useUiContext } from "../../../Types/uiContext"
import { useWeb3React } from "@web3-react/core"
import { providers } from "ethers"

interface Props{
  market: CTokenInfo | undefined,
  marketSpinners: CTokenSpinner | undefined,
  borrowMarketDialog: (market: CTokenInfo) => void,
}

const BorrowMarketRow: React.FC<Props> = (props : Props) => {
  const {setShowWallets} = useUiContext()
  const { account } = useWeb3React<providers.Web3Provider>()
  
  const handleOpenBorrowMarketDialog = () => {
    if(!account){
      setShowWallets(true)
      return
    }

    if(props.market && !props?.marketSpinners?.spinner){
      props.borrowMarketDialog(props.market)
    }
    return
  }

    return (
        <tr className={props.marketSpinners?.spinner ? "disable-row" : ""} onClick={handleOpenBorrowMarketDialog}>
        <td>
          <div className="asset"> 
                <div className="asset-logo">
                  <img className="rounded-circle" src={props?.market?.underlying.logo} alt=""/>
                </div>
                <span>{props?.market?.underlying.symbol}</span>
            </div>
        </td>
        <td className={props.market && +props.market.borrowApy.toFixed(2) > 0 ? "positive" : ""}>
            {`${props.market ? props.market.borrowApy.mul(BigNumber.from("100")).toFixed(2): '0.00'}%`}
            {/* {props?.details?.borrowPctApy?.gt(BigNumber.from("0")) ? (
              <div>
                {`(${props.details.borrowPctApy?.times(100).toFixed(2)}% PCT)`}
              </div>
            ) : null} */}
        </td>
        <td>
            {props.market ? (+props.market.borrowBalanceInTokenUnit.toString() > 0.001 || +props.market.borrowBalanceInTokenUnit.toString() === 0
                              ? +props.market.borrowBalanceInTokenUnit.toFixed(4) : "<0.001"): "0"}
        </td>
        
        <td>
            {props.market ? +props.market.underlying.walletBalance.toRound(3).toString() : "0"}
        </td>
        <td>
          <div className="spinner-row borrow-market-spinner">
            <div className="borrow-market-liquidity">{`${props.market ? props.market.liquidity.convertToLargeNumberRepresentation(3, '$') : "$0"}`}</div>
            {props.marketSpinners?.spinner && (props.marketSpinners?.borrowSpinner || props.marketSpinners?.repaySpinner) ?
              <Spinner size={"20px"}/>
            : null}

          </div>
        </td>
      </tr>
    )
}

export default BorrowMarketRow