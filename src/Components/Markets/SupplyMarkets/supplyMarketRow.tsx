import { BigNumber } from "../../../bigNumber"
import React from "react"
import { Spinner } from "../../../assets/huIcons/huIcons"
import { CTokenInfo, CTokenSpinner } from "../../../Classes/cTokenClass"
import SwitchButton from "../../Switch/switch"

import "../style.css"
import StarBpro from "../../StarBpro/starBpro"
import {GeneralDetailsItemContentItem} from "../../GeneralDetails/generalDetailsItem";

interface Props{
  tooltip?: string,
  market: CTokenInfo | undefined,
  marketSpinners: CTokenSpinner | undefined
  hasbackstopGauge: boolean,
  supplyMarketDialog: (market: CTokenInfo) => void,
  enterMarketDialog: (market: CTokenInfo) => void,
}

const SupplyMarketRow: React.FC<Props> = (props : Props) =>{

    function hasBackstop() {
        return props.hasbackstopGauge || !!props.market?.backstop;
    }

    return (
        <tr className={props.marketSpinners?.spinner ? "disable-row" : ""}>
        <td onClick={() =>props.market ? (!props?.marketSpinners?.spinner ? props.supplyMarketDialog(props.market) : null) : null}>
          <div className="asset"> 
              <div className="asset-logo">
                <img className="rounded-circle" src={props?.market?.underlying.logo} alt=""/>
              </div>
              <span>{props?.market?.underlying.symbol}</span>
          </div>
        </td>
        <td className={`apy ${props.market ? (+props.market?.supplyApy.toFixed(2) > 0 ? "positive" : "") : ""}`}>
            <div className="supply-apy">
              <StarBpro active={props.market && +props.market?.hndAPR.toString() > 0 ? true : false} backstop={hasBackstop()}/>
                <GeneralDetailsItemContentItem className="general-details-item-content-item-pointer" onClick={() => props.market && !props?.marketSpinners?.spinner ? props.supplyMarketDialog(props?.market) : null}
                    label={`${ props.market && +props?.market?.totalMaxSupplyApy.toString() > 0 ? formatSupplyApyRange(+props.market.totalMinSupplyApy, +props.market.totalMaxSupplyApy) : "0.00"}%`}
                    value=""
                />
            </div>
        </td>
        <td onClick={() => props.marketSpinners && props.market && !props?.marketSpinners.spinner ? props.supplyMarketDialog(props?.market) : null}>
          <span data-tip={props.market && props.market.supplyBalanceInTokenUnit.gt(BigNumber.from("0")) ? BigNumber.parseValueSafe(props.market.supplyBalanceInTokenUnit.toString(), props.market.underlying.decimals).toString() : null}>
              {props.market && props.market.supplyBalanceInTokenUnit.gt(BigNumber.from("0")) ? BigNumber.parseValueSafe(props.market.supplyBalanceInTokenUnit.toString(), props.market.underlying.decimals).toFixed(4) : 0}
            </span>
        </td>
        <td onClick={() => props.marketSpinners && props.market &&  !props.marketSpinners.spinner ? props.supplyMarketDialog(props.market) : null}>
            <i
              className={`circle${
                props.market && +props.market.underlying.walletBalance.toString() <= 0
                  ? "-o"
                  : ""
              } text-c-green f-10 m-r-15`}
            />
            <span data-tip={props.market && +props.market.underlying.walletBalance.toString() > 0 ? props.market.underlying.walletBalance.toString() : null}>
              {props.market ? +props.market.underlying.walletBalance.toRound(3) === 0 && +props.market.underlying.walletBalance.toString() > 0 ? "<0.001" 
              : props.market.underlying.walletBalance.toRound(3) : "0"}
            </span>
        </td>
        <td>
          <div className="spinner-container">
            {props.market && +props.market.collateralFactor.toString() > 0? 
              <SwitchButton disabled={props.marketSpinners ? props.marketSpinners.spinner : false} checked={props?.market?.isEnterMarket} onClick={()=>{props.market ? props.enterMarketDialog(props.market) : null}}/>
              : <SwitchButton disabled={true} switchToolTip={props.market ? +props.market.collateralFactor.toString() > 0 ? null : "Assets that earn HND can't be used as collateral": null }/>
            }
            {(props?.marketSpinners?.spinner || props?.marketSpinners?.supplySpinner || props?.marketSpinners?.withdrawSpinner || props?.marketSpinners?.backstopDepositSpinner || props?.marketSpinners?.backstopWithdrawSpinner)? (<Spinner size={"20px"}/>) : null}
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