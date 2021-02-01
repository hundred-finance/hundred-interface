import React from "react"
import SwitchButton from "../../Switch/switch"
import "./supplyMarkets.css"

const SupplyMarketRow =(props) =>{
    return (
        <tr
        /*onClick={() => {
          setSupplyDialogOpen(true);
          setSelectedMarketDetails(props.details);
        }}*/
      >
        <td onClick={() => props.supplyMarketDialog(props.details)}>
          <img
            className="rounded-circle"
            style={{ width: "40px" }}
            src={props.details.logoSource}
            alt=""
          />
        </td>
        <td onClick={() => props.supplyMarketDialog(props.details)}>
          {props.details.symbol}
        </td>
        <td onClick={() => props.supplyMarketDialog(props.details)}>
          
            {`${props.details.supplyApy?.times(100).toFixed(2)}%`}
            {props.details.supplyPctApy?.isGreaterThan(0) ? (
              <div>
                {`+ ${props.details.supplyPctApy?.times(100).toFixed(2)}% PCT`}
              </div>
            ) : null}
          
        </td>
        <td onClick={() => props.supplyMarketDialog(props.details)}>
            {props.details.supplyBalanceInTokenUnit.decimalPlaces(4).toString()}
          
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