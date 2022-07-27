import React, { useRef, useEffect } from "react"
import {SpinnersEnum } from "../../../Classes/cTokenClass";
import DialogBorrowLimitSection from "../../BorrowLimit/borrowLimit";
import "./enterMarketDialog.css"
import closeIcon from "../../../assets/icons/closeIcon.png"
import { useHundredDataContext } from "../../../Types/hundredDataContext";
import { useUiContext } from "../../../Types/uiContext";
import { useWeb3React } from "@web3-react/core";
import { ExecuteWithExtraGasLimit } from "../../../Classes/TransactionHelper";
import ReactDOM from "react-dom"
import { UpdateTypeEnum } from "../../../Hundred/Data/hundredData";
// import { Contract } from "ethers";
// import { COMPTROLLER_ABI } from "../../../abi";

interface Props{
  closeMarketDialog: () => void,
}

const EnterMarketDialog : React.FC<Props> = (props : Props) => {
  const dialogContainer = document.getElementById("modal") as Element
  const {library} = useWeb3React()
  const {setSpinnerVisible, toastErrorMessage, toastSuccessMessage} = useUiContext()
  const {marketsData, comptrollerData, selectedMarket, toggleSpinners,  updateMarket} = useHundredDataContext()  
  const mounted = useRef<boolean>(false)

    useEffect(() => {
        mounted.current = true
        return (() => {
          mounted.current = false
        })
    }, []);

    const handleEnterMarket = async(symbol: string): Promise<void> => {
      if(marketsData){
        const markets = [...marketsData]
        const market = markets.find(m => m?.underlying.symbol === symbol)
        const comp = {...comptrollerData}
        if (market && library && comp.comptroller){
          try{
            console.log("enter")
            setSpinnerVisible(true)
            toggleSpinners(symbol, SpinnersEnum.enterMarket)
            
            const addr = [market.pTokenAddress]
            const signer = library.getSigner()
            const signedComptroller = comp.comptroller.connect(signer)
            const tx = await ExecuteWithExtraGasLimit(signedComptroller, "enterMarkets", [addr])
            
            setSpinnerVisible(false)
            props.closeMarketDialog()
            const receipt = await tx.wait()
            console.log(receipt)     
            if(receipt.status === 1){
              toastSuccessMessage("Transaction completed successfully.\nUpdating contracts")
              await updateMarket(market, UpdateTypeEnum.EnableMarket, true)
            }       

          }
          catch (error: any){
            console.log(error)
            toastErrorMessage(`${error?.message.replace(".", "")} on Enter Market`)
          }
          finally{
            setSpinnerVisible(false)
            toggleSpinners(symbol, SpinnersEnum.enterMarket)
          }
        }
      }
    }

    const handleExitMarket = async (symbol: string): Promise<void> => {
      if(marketsData){
        
        const markets = [...marketsData]
        const comp = {...comptrollerData}
        const market = markets.find(m => m?.underlying.symbol === symbol)
        
        if (market && library && comp.comptroller){
          try{
            setSpinnerVisible(true)
            toggleSpinners(symbol, SpinnersEnum.enterMarket)

            const signer = library.getSigner()
            const signedComptroller = comp.comptroller.connect(signer)
            const tx = await ExecuteWithExtraGasLimit(signedComptroller, "exitMarket", [market.pTokenAddress])
            setSpinnerVisible(false)
            props.closeMarketDialog()

            const receipt = await tx.wait()
            console.log(receipt)
            if(receipt.status === 1){
              toastSuccessMessage("Transaction completed successfully.\nUpdating contracts")
              await updateMarket(market, UpdateTypeEnum.EnableMarket, false)
            }            
          }
          catch (error: any){
            console.log(error)
            toastErrorMessage(`${error?.message.replace(".", "")} on Exit Market`)
          }
          finally{
            setSpinnerVisible(false)
            toggleSpinners(symbol, SpinnersEnum.enterMarket)
          }
        }
      }
    }
    
    const dialog = mounted && selectedMarket ? 
    <div className={`dialog ${"open-dialog"}`} >
        <div className="dialog-background" onClick={() => props.closeMarketDialog()}></div>
        <div className="dialog-box">
            <img src={closeIcon} alt="Close Icon" className="dialog-close" onClick={()=>props.closeMarketDialog()} />  
          <div className="dialog-title">
            {{...selectedMarket}.underlying.symbol && (
            <img
            className="rounded-circle"
            style={{ width: "30px", margin: "0px 10px 0px 0px" }}
            src={{...selectedMarket}.underlying.logo}
            alt=""/>
            )}
            {`${
                {...selectedMarket}.isEnterMarket ? "Disable" : "Enable"
            } as Collateral`}
          </div>
          {{...selectedMarket}.underlying.symbol && (
          <div className="dialog-content">
            <div className="dialog-message">
                {{...selectedMarket}.isEnterMarket 
                    ? "This asset is required to support your borrowed assets. Either repay borrowed assets, or supply another asset as collateral."
                    : "Each asset used as collateral increases your borrowing limit. Be careful, this can subject the asset to being seized in liquidation."}
            </div>
            <DialogBorrowLimitSection/>
            <div className="footer-section">
                {{...selectedMarket}.isEnterMarket ? (
                 <button disabled={+{...selectedMarket}.borrowBalance.toString() > 0 || +{...selectedMarket}.supplyBalance.toString() > 0 ? true : false} 
                 className="dialog-button" onClick={() => { handleExitMarket({...selectedMarket}.underlying.symbol) }}>
                {`Disable ${{...selectedMarket}.underlying.symbol} as Collateral`}
                </button>
                ) : (
                    <button className="dialog-button"onClick={() => { handleEnterMarket({...selectedMarket}.underlying.symbol)}}>
                {`Use ${{...selectedMarket}.underlying.symbol} as Collateral`}
              </button>
            )}
          </div>
        </div>
        )}
        </div>
      </div> : null

    return (
      ReactDOM.createPortal(dialog, dialogContainer)
    )
}


      


  export default EnterMarketDialog