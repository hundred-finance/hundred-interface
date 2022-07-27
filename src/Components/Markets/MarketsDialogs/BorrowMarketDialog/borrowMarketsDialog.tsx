import React, {useRef, useEffect, useState} from "react"
import { Tab, TabContent, TabHeader, TabHeaderItem } from "../../../TabControl/tabControl";
import "../marketDialog.css"
import closeIcon from "../../../../assets/icons/closeIcon.png"
import ReactToolTip from 'react-tooltip'
import BorrowItem from "./borrowItem";
import RepayItem from "./repayItem";
import { useUiContext } from "../../../../Types/uiContext";
import { useHundredDataContext } from "../../../../Types/hundredDataContext";
import ReactDOM from "react-dom"



interface Props{
    closeBorrowMarketDialog : () => void,    
}
const BorrowMarketDialog: React.FC<Props> = (props : Props) =>{
    const mounted = useRef<boolean>(false)
    const dialogContainer = document.getElementById("modal") as Element
    const [tabChange, setTabChange] = useState<number>(1)
    const {spinnerVisible, darkMode} = useUiContext()
    const {selectedMarket} = useHundredDataContext()
    
    const CloseDialog = () : void =>{
        if(spinnerVisible)
        return

        props.closeBorrowMarketDialog()
    }

    useEffect(() => {
        mounted.current = true

        return (() => {
            mounted.current = false
        }) 
    }, [])

   const dialog = selectedMarket ? 
            <div className={`dialog ${"open-dialog"} ${darkMode ? "dark-theme" : ""}`}>
                <div className="dialog-background" onClick={() => CloseDialog()}/>
                <ReactToolTip id="borrow-dialog-tooltip" effect="solid"/>
                <div className="supply-box">
                    <img src={closeIcon} alt="Close Icon" className="dialog-close" onClick={()=>CloseDialog()} />  
                    <div className="dialog-title">
                        {{...selectedMarket}?.underlying.symbol && (
                        <img
                            className="rounded-circle"
                            style={{ width: "30px", height: "30px", margin: "0px 10px 0px 0px" }}
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
                            <BorrowItem tabChange={tabChange} open={true}/>
                            <RepayItem tabChange={tabChange} open={true}/>
                        </TabContent>
                    </Tab>
                </div>
            </div>
            : null
    
    return (
        ReactDOM.createPortal(dialog, dialogContainer)
    )
}

export default BorrowMarketDialog