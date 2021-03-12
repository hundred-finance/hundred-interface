import React from "react"
import { Spinner } from "../../../assets/huIcons/huIcons"
import SwitchButton from "../../Switch/switch"

import "../style.css"

const SupplyMarketRow =(props) =>{
    return (
        <tr className={props.details.spinner ? "disable-row" : ""}
        /*onClick={() => {
          setSupplyDialogOpen(true);
          setSelectedMarketDetails(props.details);
        }}*/
      >
        <td onClick={() => !props.details.spinner ? props.supplyMarketDialog(props.details) : null}>
          <div className="asset"> 
              <div className="asset-logo">
                <img className="rounded-circle" src={props.details.logoSource} alt=""/>
              </div>
              <span>{props.details.symbol}</span>
          </div>
        </td>
        <td onClick={() => !props.details.spinner ? props.supplyMarketDialog(props.details) : null} className={props.details?.supplyApy.toFixed(2) > 0 ? "positive" : ""}>
          
            {`${props.details?.supplyApy?.times(100).toFixed(2)}%`}
            {props.details?.supplyPctApy > 0 ? (
              <div>
                {`+ ${props.details.supplyPctApy?.times(100).toFixed(2)}% PCT`}
              </div>
            ) : null}
          
        </td>
        <td onClick={() => !props.details.spinner ? props.supplyMarketDialog(props.details) : null}>
            { props.details.supplyBalanceInTokenUnit.isGreaterThan(0) ? props.details.supplyBalanceInTokenUnit.decimalPlaces(4).toString() : 0}
          
        </td>
        <td onClick={() => !props.details.spinner ? props.supplyMarketDialog(props.details) : null}>
            <i
              className={`circle${
                props.details.walletBalance.decimalPlaces(4).toNumber() <= 0
                  ? "-o"
                  : ""
              } text-c-green f-10 m-r-15`}
            />
            {props.details.walletBalance.decimalPlaces(4).toString()}
          
        </td>
        <td>
          <div className="spinner-container">
            <SwitchButton disabled={props.details.spinner} checked={props.details.isEnterMarket} onClick={()=>{props.enterMarketDialog(props.details)}}/>
            {(props.details.spinner || props.details.supplySpinner)? (<Spinner size={"20px"}/>) : null}
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