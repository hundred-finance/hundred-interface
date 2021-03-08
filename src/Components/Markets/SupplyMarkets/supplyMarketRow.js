import React from "react"
import SwitchButton from "../../Switch/switch"

import "../style.css"

const SupplyMarketRow =(props) =>{
    return (
        <tr
        /*onClick={() => {
          setSupplyDialogOpen(true);
          setSelectedMarketDetails(props.details);
        }}*/
      >
        <td onClick={() => props.supplyMarketDialog(props.details)}>
          <div className="asset"> 
              <div className="asset-logo">
                <img className="rounded-circle" src={props.details.logoSource} alt=""/>
              </div>
              <span>{props.details.symbol}</span>
          </div>
        </td>
        <td onClick={() => props.supplyMarketDialog(props.details)} className={props.details?.supplyApy.toFixed(2) > 0 ? "positive" : ""}>
          
            {`${props.details?.supplyApy?.times(100).toFixed(2)}%`}
            {props.details?.supplyPctApy > 0 ? (
              <div>
                {`+ ${props.details.supplyPctApy?.times(100).toFixed(2)}% PCT`}
              </div>
            ) : null}
          
        </td>
        <td onClick={() => props.supplyMarketDialog(props.details)}>
            { props.details.supplyBalanceInTokenUnit.isGreaterThan(0) ? props.details.supplyBalanceInTokenUnit.decimalPlaces(4).toString() : 0}
          
        </td>
        <td onClick={() => props.supplyMarketDialog(props.details)}>
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
            <SwitchButton checked={props.details.isEnterMarket} onClick={()=>{props.enterMarketDialog(props.details)}}/>
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