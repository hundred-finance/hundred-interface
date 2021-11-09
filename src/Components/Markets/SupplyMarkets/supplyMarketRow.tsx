import { BigNumber } from "../../../bigNumber"
import React from "react"
import { Spinner } from "../../../assets/huIcons/huIcons"
import { CTokenInfo } from "../../../Classes/cTokenClass"
import SwitchButton from "../../Switch/switch"

import "../style.css"
import Star from "../../Star/star"

interface Props{
  tooltip?: string,
  details: CTokenInfo | null,
  supplyMarketDialog: (market: CTokenInfo) => void,
  enterMarketDialog: (market: CTokenInfo) => void,
}

const SupplyMarketRow: React.FC<Props> = (props : Props) =>{
    return (
        <tr className={props.details?.spinner ? "disable-row" : ""}
        /*onClick={() => {
          setSupplyDialogOpen(true);
          setSelectedMarketDetails(props.details);
        }}*/
      >
        <td onClick={() =>props.details ? (!props?.details?.spinner ? props.supplyMarketDialog(props.details) : null) : null}>
          <div className="asset"> 
              <div className="asset-logo">
                <img className="rounded-circle" src={props?.details?.logoSource} alt=""/>
              </div>
              <span>{props?.details?.symbol}</span>
          </div>
        </td>
        <td onClick={() => props.details ? (!props?.details?.spinner ? props.supplyMarketDialog(props.details) : null) : null} className={props.details ? (+props.details?.supplyApy.toFixed(2) > 0 ? "positive" : "") : ""}>
            <div className="supply-apy">
              <Star active={props.details && +props.details?.hndAPR.toString() > 0 ? true : false}/>
              {`${ props.details && +props?.details?.totalSupplyApy.toString() > 0 ? BigNumber.parseValue((+props.details.totalSupplyApy * 100).noExponents()).toRound(2, false, true) : "0.00"}%`}
            </div>
        </td>
        <td onClick={() => props.details && !props?.details.spinner ? props.supplyMarketDialog(props?.details) : null}>
          <span data-tip={props.details && props.details.supplyBalanceInTokenUnit.gt(BigNumber.from("0")) ? BigNumber.parseValueSafe(props.details.supplyBalanceInTokenUnit.toString(), props.details.decimals).toString() : null}>
              {props.details && props.details.supplyBalanceInTokenUnit.gt(BigNumber.from("0")) ? BigNumber.parseValueSafe(props.details.supplyBalanceInTokenUnit.toString(), props.details.decimals).toFixed(4) : 0}
            </span>
            {/* { props.details && props.details.supplyBalanceInTokenUnit.gt(BigNumber.from("0")) ? props.details.supplyBalanceInTokenUnit.toFixed(4) : 0} */}
        </td>
        <td onClick={() => props.details &&  !props.details.spinner ? props.supplyMarketDialog(props.details) : null}>
            <i
              className={`circle${
                props.details && +props.details.walletBalance.toRound(3) <= 0
                  ? "-o"
                  : ""
              } text-c-green f-10 m-r-15`}
            />
            {props.details ? props.details.walletBalance.toRound(3) : "0"}
          
        </td>
        <td>
          <div className="spinner-container">
            {props.details ? 
              <SwitchButton disabled={props.details.spinner} checked={props?.details?.isEnterMarket} onClick={()=>{props.details ? props.enterMarketDialog(props.details) : null}}/>
              : <SwitchButton disabled={false}/>
            }
            {(props?.details?.spinner || props?.details?.supplySpinner || props?.details?.withdrawSpinner)? (<Spinner size={"20px"}/>) : null}
          </div>
        </td>
      </tr>
    )
}

export default SupplyMarketRow