import React, { useRef, useEffect } from "react"
import DialogBorrowLimitSection from "../../BorrowLimit/borrowLimit";
import "./enterMarketDialog.css"

const EnterMarketDialog = (props) => {
    const ref = useRef(null);

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

        function handleClickOutside(event) {
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
                <button className="dialog-close" onClick={() => props.closeMarketDialog()}>
                    
                </button>
            <div className="dialog-title">
                {props.market?.symbol && (
                <img
                className="rounded-circle"
                style={{ width: "30px", margin: "0px 10px 0px 0px" }}
                src={props.market?.logoSource}
                alt=""/>
                )}
                {`${
                    props.market?.isEnterMarket ? "Disable" : "Enable"
                } as Collateral`}
          </div>
          {props.market?.symbol && (
          <div className="dialog-content">
                <div className="dialog-message">
                    {props.market?.isEnterMarket 
                        ? "This asset is required to support your borrowed assets. Either repay borrowed assets, or supply another asset as collateral."
                        : "Each asset used as collateral increases your borrowing limit. Be careful, this can subject the asset to being seized in liquidation."}
                </div>
                <DialogBorrowLimitSection generalData={props.generalData}/>
                <div className="footer-section">
                    {props.market.isEnterMarket ? (
                     <button className="dialog-button" onClick={() => {
                        props.handleExitMarket(
                          props.market?.symbol
                        );
                      }}>
                    {`Disable ${props.market?.symbol} as Collateral`}
                    </button>
                    ) : (
                        <button className="dialog-button"onClick={() => {
                            props.handleEnterMarket(
                              props.market?.symbol
                            );
                          }}>
                    {`Use ${props.market?.symbol} as Collateral`}
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