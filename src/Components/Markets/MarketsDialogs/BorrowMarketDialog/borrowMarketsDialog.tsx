import React, {useRef, useEffect, useState} from "react"
import { Tab, TabContent, TabHeader, TabHeaderItem } from "../../../TabControl/tabControl";
import "../supplyMarketDialog.css"
import { CTokenInfo } from "../../../../Classes/cTokenClass";
import {BigNumber} from "../../../../bigNumber";
import closeIcon from "../../../../assets/icons/closeIcon.png"
import ReactToolTip from 'react-tooltip'
import BorrowItem from "./borrowItem";
import RepayItem from "./repayItem";
import { useUiContext } from "../../../../Types/uiContext";
import { useHundredDataContext } from "../../../../Types/hundredDataContext";
import ReactDOM from "react-dom"



interface Props{
    closeBorrowMarketDialog : () => void,
    open: boolean,
    getMaxAmount: (market: CTokenInfo, func?: string) => Promise<BigNumber>,
    getMaxRepayAmount: (market: CTokenInfo) => Promise<BigNumber>,
    
}
const BorrowMarketDialog: React.FC<Props> = (props : Props) =>{
    const dialogContainer = document.getElementById("modal") as Element
    const ref = useRef<HTMLDivElement | null>(null)
    const [tabChange, setTabChange] = useState<number>(1)
    const {spinnerVisible} = useUiContext()
    const {selectedMarket} = useHundredDataContext()
    
    const CloseDialog = () : void =>{
        setTabChange(1)
        props.closeBorrowMarketDialog()
    }

    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        
        const CloseDialog = () : void =>{
            if(spinnerVisible)
                return
            
            setTabChange(1)
            props.closeBorrowMarketDialog()
        }

        if(props.open){
            document.getElementsByTagName("body")[0].style.overflow = 'hidden'
        }
        else{
            document.getElementsByTagName("body")[0].style.overflow = 'auto'
            CloseDialog()
        }

        function handleClickOutside(event : any) : void {
            if (ref && ref.current && !ref.current.contains(event.target)) {
                CloseDialog()
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, props.open]);

   const dialog = selectedMarket ? 
            <div className={`dialog ${props.open ? "open-dialog" : ""}`}>
                <div className="dialog-background"/>
                <ReactToolTip id="borrow-dialog-tooltip" effect="solid"/>
                <div ref={ref} className="supply-box">
                    <img src={closeIcon} alt="Close Icon" className="dialog-close" onClick={()=>CloseDialog()} />  
                    <div className="dialog-title">
                        {{...selectedMarket}?.underlying.symbol && (
                        <img
                            className="rounded-circle"
                            style={{ width: "30px", margin: "0px 10px 0px 0px" }}
                            src={{...selectedMarket}?.underlying.logo}
                            alt=""/>)}
                        {`${{...selectedMarket}?.underlying.symbol}`}
                    </div>
                    <Tab>
                        <TabHeader tabChange = {tabChange}>
                            <TabHeaderItem tabId={1} title="Borrow" tabChange = {tabChange} setTabChange = {setTabChange}/>
                            <TabHeaderItem tabId={2} title="Repay" tabChange = {tabChange} setTabChange = {setTabChange}/>
                        </TabHeader>
                        <TabContent>
                            <BorrowItem tabChange={tabChange} open={props.open} getMaxAmount={props.getMaxAmount}/>
                            <RepayItem tabChange={tabChange} open={props.open} getMaxAmount={props.getMaxAmount} getMaxRepayAmount={props.getMaxRepayAmount}/>
                        </TabContent>
                    </Tab>
                </div>
            </div>
            : null
    
    return (
        props.open && selectedMarket? ReactDOM.createPortal(dialog, dialogContainer) : null
    )
}

export default BorrowMarketDialog