import React, { useRef, useEffect } from "react"
import { CTokenInfo } from "../../../Classes/cTokenClass";
import { GeneralDetailsData } from "../../../Classes/generalDetailsClass";
import DialogBorrowLimitSection from "../../BorrowLimit/borrowLimit";
import "./enterMarketDialog.css"
import closeIcon from "../../../assets/icons/closeIcon.png"

interface Props{
  open: boolean,
  closeMarketDialog: () => void,
  market: CTokenInfo | null,
  generalData: GeneralDetailsData | null,
  handleExitMarket: (symbol: string) => Promise<void>
  handleEnterMarket: (symbol: string) => Promise<void>
}

const EnterMarketDialog : React.FC<Props> = (props : Props) => {
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        if(props.open){
            document.getElementsByTagName("body")[0].style.overflow = 'hidden'
        }
        else{
            document.getElementsByTagName("body")[0].style.overflow = 'auto'
        }

        function handleClickOutside(event : any) : void {
          if (ref.current && !ref.current.contains(event.target)) {
              props.closeMarketDialog()
          }
      }

      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
          // Unbind the event listener on clean up
          document.removeEventListener("mousedown", handleClickOutside);
      };
       
    }, [props]);
    

    return (
      props.open ? (
        <div className={`dialog ${props.open ? "open-dialog" : ""}`}>
            <div ref={ref} className="dialog-box">
                <img src={closeIcon} alt="Close Icon" className="dialog-close" onClick={()=>props.closeMarketDialog()} />  
            <div className="dialog-title">
                {props.market?.underlying.symbol && (
                <img
                className="rounded-circle"
                style={{ width: "30px", margin: "0px 10px 0px 0px" }}
                src={props.market?.underlying.logo}
                alt=""/>
                )}
                {`${
                    props.market?.isEnterMarket ? "Disable" : "Enable"
                } as Collateral`}
          </div>
          {props.market?.underlying.symbol && (
          <div className="dialog-content">
                <div className="dialog-message">
                    {props.market?.isEnterMarket 
                        ? "This asset is required to support your borrowed assets. Either repay borrowed assets, or supply another asset as collateral."
                        : "Each asset used as collateral increases your borrowing limit. Be careful, this can subject the asset to being seized in liquidation."}
                </div>
                <DialogBorrowLimitSection generalData={props.generalData}/>
                <div className="footer-section">
                    {props.market.isEnterMarket ? (
                     <button disabled={+props.market.borrowBalance.toString() > 0 || +props.market.supplyBalance.toString() > 0 ? true : false} className="dialog-button" onClick={() => {
                         props.market?.underlying.symbol ? props.handleExitMarket(
                          props.market?.underlying.symbol
                        ) : null;
                      }}>
                    {`Disable ${props.market?.underlying.symbol} as Collateral`}
                    </button>
                    ) : (
                        <button className="dialog-button"onClick={() => {
                            props.market?.underlying.symbol ? props.handleEnterMarket(props.market?.underlying.symbol) : null
                          }}>
                    {`Use ${props.market?.underlying.symbol} as Collateral`}
                  </button>
                )}
              </div>
          </div>
          )}
        </div>
        </div>  ) : null
    )
}


      


  export default EnterMarketDialog