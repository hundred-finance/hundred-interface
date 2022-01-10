import { BigNumber } from "../../../bigNumber"
import React from "react"
import { Spinner } from "../../../assets/huIcons/huIcons"
import { CTokenInfo } from "../../../Classes/cTokenClass"
import SwitchButton from "../../Switch/switch"

import "../style.css"
import StarBpro from "../../StarBpro/starBpro"
import {GeneralDetailsItemContentItem} from "../../GeneralDetails/generalDetailsItem";

interface Props{
  tooltip?: string,
  details: CTokenInfo | null,
  supplyMarketDialog: (market: CTokenInfo) => void,
  enterMarketDialog: (market: CTokenInfo) => void,
}

const SupplyMarketRow: React.FC<Props> = (props : Props) =>{
    return (
        <tr className={props.details?.spinner ? "disable-row" : ""}>
        <td onClick={() =>props.details ? (!props?.details?.spinner ? props.supplyMarketDialog(props.details) : null) : null}>
          <div className="asset"> 
              <div className="asset-logo">
                <img className="rounded-circle" src={props?.details?.underlying.logo} alt=""/>
              </div>
              <span>{props?.details?.underlying.symbol}</span>
          </div>
        </td>
        <td onClick={() => props.details ? (!props?.details?.spinner ? props.supplyMarketDialog(props.details) : null) : null} className={`apy ${props.details ? (+props.details?.supplyApy.toFixed(2) > 0 ? "positive" : "") : ""}`}>
            <div className="supply-apy">
              <StarBpro active={props.details && +props.details?.hndAPR.toString() > 0 ? true : false} backstop={props.details?.backstop ? true : false}/>
                <GeneralDetailsItemContentItem
                    label={`${ props.details && +props?.details?.totalMaxSupplyApy.toString() > 0 ? formatSupplyApyRange(+props.details.totalMinSupplyApy, +props.details.totalMaxSupplyApy) : "0.00"}%`}
                    value=""
                />
            </div>
        </td>
        <td onClick={() => props.details && !props?.details.spinner ? props.supplyMarketDialog(props?.details) : null}>
          <span data-tip={props.details && props.details.supplyBalanceInTokenUnit.gt(BigNumber.from("0")) ? BigNumber.parseValueSafe(props.details.supplyBalanceInTokenUnit.toString(), props.details.underlying.decimals).toString() : null}>
              {props.details && props.details.supplyBalanceInTokenUnit.gt(BigNumber.from("0")) ? BigNumber.parseValueSafe(props.details.supplyBalanceInTokenUnit.toString(), props.details.underlying.decimals).toFixed(4) : 0}
            </span>
        </td>
        <td onClick={() => props.details &&  !props.details.spinner ? props.supplyMarketDialog(props.details) : null}>
            <i
              className={`circle${
                props.details && +props.details.underlying.walletBalance.toRound(3) <= 0
                  ? "-o"
                  : ""
              } text-c-green f-10 m-r-15`}
            />
            {props.details ? props.details.underlying.walletBalance.toRound(3) : "0"}
          
        </td>
        <td>
          <div className="spinner-container">
            {props.details && +props.details.collateralFactor.toString() > 0? 
              <SwitchButton disabled={props.details.spinner} checked={props?.details?.isEnterMarket} onClick={()=>{props.details ? props.enterMarketDialog(props.details) : null}}/>
              : <SwitchButton disabled={true} switchToolTip={props.details ? +props.details.collateralFactor.toString() > 0 ? null : "Assets that earn HND can't be used as collateral": null }/>
            }
            {(props?.details?.spinner || props?.details?.supplySpinner || props?.details?.withdrawSpinner || props?.details?.backstopDepositSpinner || props?.details?.backstopWithdrawSpinner)? (<Spinner size={"20px"}/>) : null}
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