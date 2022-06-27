import React, { useRef, useEffect } from "react"
import { CTokenInfo, SpinnersEnum } from "../../../Classes/cTokenClass";
import DialogBorrowLimitSection from "../../BorrowLimit/borrowLimit";
import "./enterMarketDialog.css"
import closeIcon from "../../../assets/icons/closeIcon.png"
import { useHundredDataContext } from "../../../Types/hundredDataContext";
import { useUiContext } from "../../../Types/uiContext";
import { useWeb3React } from "@web3-react/core";
import { ExecuteWithExtraGasLimit } from "../../../Classes/TransactionHelper";
import ReactDOM from "react-dom"
import { UpdateTypeEnum } from "../../../Hundred/Data/hundredData";
import { useGlobalContext } from "../../../Types/globalContext";
// import { Contract } from "ethers";
// import { COMPTROLLER_ABI } from "../../../abi";

interface Props{
  open: boolean,
  closeMarketDialog: () => void,
  market: CTokenInfo | undefined,
  //updateMarket: (market: CTokenInfo, updateType: UpdateTypeEnum, shouldReturn: any) => Promise<any>
}

const EnterMarketDialog : React.FC<Props> = (props : Props) => {
  const dialogContainer = document.getElementById("modal") as Element
  const {library, account} = useWeb3React()
  const {setSpinnerVisible} = useUiContext()
  const {marketsData, generalData, comptrollerData, toggleSpinners,  updateMarket} = useHundredDataContext()  
  const ref = useRef<HTMLDivElement | null>(null);
  const {network} = useGlobalContext()

    useEffect(() => {
        if(props.open){
            document.getElementsByTagName("body")[0].style.overflow = 'hidden'
        }
        else{
            document.getElementsByTagName("body")[0].style.overflow = 'auto'
        }
    }, [props.open]);

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
            console.log("get tx")
            const tx = await ExecuteWithExtraGasLimit(signedComptroller, "enterMarkets", [addr])
            
            console.log("exit")
            setSpinnerVisible(false)
            props.closeMarketDialog()
            const receipt = await tx.wait()
            console.log(receipt)            
            await updateMarket(market, UpdateTypeEnum.EnableMarket, true)

          }
          catch (err){
            console.log(err)
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
            await updateMarket(market, UpdateTypeEnum.EnableMarket, false)
          }
          catch (err){
            console.log(err)
          }
          finally{
            setSpinnerVisible(false)
            toggleSpinners(symbol, SpinnersEnum.enterMarket)
          }
        }
      }
    }
    
    const dialog = 
    <div className={`dialog ${props.open ? "open-dialog" : ""}`} >
        <div className="dialog-background" onClick={() => props.closeMarketDialog()}></div>
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
            <DialogBorrowLimitSection generalData={generalData}/>
            <div className="footer-section">
                {props.market.isEnterMarket ? (
                 <button disabled={+props.market.borrowBalance.toString() > 0 || +props.market.supplyBalance.toString() > 0 ? true : false} className="dialog-button" onClick={() => {
                     props.market?.underlying.symbol ? handleExitMarket(
                      props.market?.underlying.symbol
                    ) : null;
                  }}>
                {`Disable ${props.market?.underlying.symbol} as Collateral`}
                </button>
                ) : (
                    <button className="dialog-button"onClick={() => {
                        props.market?.underlying.symbol ? handleEnterMarket(props.market?.underlying.symbol) : null
                      }}>
                {`Use ${props.market?.underlying.symbol} as Collateral`}
              </button>
            )}
          </div>
        </div>
        )}
        </div>
      </div>

    return (
      props.open ? ReactDOM.createPortal(dialog, dialogContainer) : null
    )
}


      


  export default EnterMarketDialog