import { BigNumber } from "../../../bigNumber"
import React from "react"
import { Spinner } from "../../../assets/huIcons/huIcons"
import { CTokenInfo } from "../../../Classes/cTokenClass"
import SwitchButton from "../../Switch/switch"

import "../style.css"

interface Props{
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
          
            {`${ props.details ? props.details.supplyApy.mul(BigNumber.from("100")).toFixed(2): "0"}%`}
            {/* {props.details?.supplyPctApy > 0 ? (
              <div>
                {`+ ${props.details.supplyPctApy?.times(100).toFixed(2)}% PCT`}
              </div>
            ) : null} */}
          
        </td>
        <td onClick={() => props.details && !props?.details.spinner ? props.supplyMarketDialog(props?.details) : null}>
            { props.details && props.details.supplyBalanceInTokenUnit.gt(BigNumber.from("0")) ? +props.details.supplyBalanceInTokenUnit.toFixed(4) : 0}
          
        </td>
        <td onClick={() => props.details &&  !props.details.spinner ? props.supplyMarketDialog(props.details) : null}>
            <i
              className={`circle${
                props.details && +props.details.walletBalance.toFixed(4) <= 0
                  ? "-o"
                  : ""
              } text-c-green f-10 m-r-15`}
            />
            {props.details ? props.details.walletBalance.toFixed(4) : "0"}
          
        </td>
        <td>
          <div className="spinner-container">
            {props.details ? 
              <SwitchButton disabled={props.details.spinner} checked={props?.details?.isEnterMarket} onClick={()=>{props.details ? props.enterMarketDialog(props.details) : null}}/>
              : <SwitchButton disabled={false}/>
            }
            {(props?.details?.spinner || props?.details?.supplySpinner || props?.details?.withdrawSpinner)? (<Spinner size={"20px"}/>) : null}
          </div>
          {/*<StyledSwitch
            checked={props.details.isEnterMarket}
            onChange={() => {
              setSupplyDialogOpen(false);
              setEnterMarketDialogOpen(true);
              setSelectedMarketDetails(props.details);
            }
        />*/}
        </td>
      </tr>
    )
}

export default SupplyMarketRow