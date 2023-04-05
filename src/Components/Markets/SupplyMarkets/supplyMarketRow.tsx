import { BigNumber } from "../../../bigNumber"
import React from "react"
import { Spinner } from "../../../assets/huIcons/huIcons"
import { CTokenInfo, CTokenSpinner } from "../../../Classes/cTokenClass"
import SwitchButton from "../../Switch/switch"

import "../style.css"
import StarBpro from "../../StarBpro/starBpro"

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional
import { useUiContext } from "../../../Types/uiContext"
import { useWeb3React } from "@web3-react/core"
import { providers } from "ethers"

interface Props{
  tooltip?: string,
  market: CTokenInfo | undefined,
  marketSpinners: CTokenSpinner | undefined
  hasbackstopGauge: boolean,
  supplyMarketDialog: (market: CTokenInfo) => void,
  enterMarketDialog: (market: CTokenInfo) => void,
}

const SupplyMarketRow: React.FC<Props> = (props : Props) =>{
  const {setShowWallets} = useUiContext()
  const { account } = useWeb3React<providers.Web3Provider>()

    const handleOpenSupplyMarketDialog = () => {
      if(!account){
        setShowWallets(true)
        return
      }

      if(props.market && !props?.marketSpinners?.spinner){
        props.supplyMarketDialog(props.market)
      }
      return
    }

    const handleOpenEnterMarkerDialog = () => {
      if(!account){
        setShowWallets(true)
        return
      }

      if(props.market)
        props.enterMarketDialog(props.market)
      return
    }

    return (
        <tr className={`${props.marketSpinners?.spinner ? "disable-row" : ""}`}>
        <td onClick={handleOpenSupplyMarketDialog}>
          <div className="asset"> 
              <div className="asset-logo">
                <img className="rounded-circle" src={props?.market?.underlying.logo} alt=""/>
              </div>
              <span>{props?.market?.underlying.symbol}</span>
          </div>
        </td>
        <td className={`apy ${props.market ? (+props.market?.supplyApy.toFixed(2) > 0 ? "positive" : "") : ""}`} 
          onClick={handleOpenSupplyMarketDialog}>
            <div className="supply-apy">
              <StarBpro active={props.market && +props.market?.veHndAPR.toString() > 0 ? true : false} backstop={false}/>
              <div className="apy-content">
                { props.market && +props?.market?.totalMaxSupplyApy.toString() > 0 ? formatSupplyApyRange(+props.market.totalMinSupplyApy, +props.market.totalMaxSupplyApy) : "0.00"}%
              </div>
                {/* <GeneralDetailsItemContentItem className="general-details-item-content-item-pointer" onClick={() => props.market && !props?.marketSpinners?.spinner ? props.supplyMarketDialog(props?.market) : null}
                    label={`${ props.market && +props?.market?.totalMaxSupplyApy.toString() > 0 ? formatSupplyApyRange(+props.market.totalMinSupplyApy, +props.market.totalMaxSupplyApy) : "0.00"}%`}
                    value=""
                /> */}
            </div>
        </td>
        <td onClick={handleOpenSupplyMarketDialog}>
          {
            props.market && +props.market.supplyBalanceInTokenUnit.add(props.market.stakeBalance).toString() > 0 ?
            <Tippy content={
                BigNumber.parseValueSafe(
                    BigNumber.parseValueSafe(props.market.supplyBalanceInTokenUnit.toString(), props.market.underlying.decimals)
                    .add(BigNumber.parseValueSafe(props.market.stakeBalance.toString(), props.market.underlying.decimals)).toString(),
                    props.market.underlying.decimals
                ).toRound(5, true, true)
            }>
              <div>{
                  BigNumber.parseValueSafe(
                      BigNumber.parseValueSafe(props.market.supplyBalanceInTokenUnit.toString(), props.market.underlying.decimals)
                          .add(BigNumber.parseValueSafe(props.market.stakeBalance.toString(), props.market.underlying.decimals)).toString(),
                      props.market.underlying.decimals
                  ).toRound(4, true, true)
              }</div>
            </Tippy>
            : "0"
          }
        </td>
        <td onClick={handleOpenSupplyMarketDialog}>
          {
            props.market && +props.market.underlying.walletBalance.toString() > 0 ?
            <Tippy content={BigNumber.parseValueSafe(props.market.underlying.walletBalance.toString(), props.market.underlying.decimals).toString()}>
              <div>
                {props.market ? +props.market.underlying.walletBalance.toRound(3) === 0 && +props.market.underlying.walletBalance.toString() > 0 ? "<0.001"
                : props.market.underlying.walletBalance.toRound(3) : "0"}
              </div>
            </Tippy>
            : "0"
          }
          
        </td>
        <td>
          <div className="spinner-container">
              <div className="switch-button-container">
                {props.market && +props.market.collateralFactor.toString() > 0 ? 
                  <SwitchButton disabled={props.marketSpinners ? props.marketSpinners.spinner : true} checked={props?.market?.isEnterMarket} 
                    onClick={handleOpenEnterMarkerDialog}/>
                  : <SwitchButton disabled={true} switchToolTip={props.market ? +props.market.collateralFactor.toString() > 0 ? null : "Assets that earn HND can't be used as collateral": null }/>
                }
              </div>
              
                {(props?.marketSpinners?.spinner && 
                  (props?.marketSpinners?.supplySpinner 
                  || props?.marketSpinners?.withdrawSpinner 
                  || props?.marketSpinners?.backstopDepositSpinner 
                  || props?.marketSpinners?.backstopWithdrawSpinner
                  || props?.marketSpinners.backstopClaimSpinner
                  || props?.marketSpinners.stakeSpinner
                  || props?.marketSpinners.unstakeSpinner
                  || props?.marketSpinners.mintSpinner
                  || props?.marketSpinners.enterMarketSpinner)) ? 
                    <div className="spinner-row">
                      <Spinner size={"20px"}/>
                    </div>
                : null}
            </div>
        </td>
      </tr>
    )
}

function formatSupplyApyRange(min: number, max: number) {
    const formattedMin = BigNumber.parseValue((min * 100).noExponents()).toRound(2, false, true)
    const formattedMax = BigNumber.parseValue((max * 100).noExponents()).toRound(2, false, true)

    if (min === max) {
        return formattedMin;
    }
    return `${formattedMin}-${formattedMax}`
}

export default SupplyMarketRow