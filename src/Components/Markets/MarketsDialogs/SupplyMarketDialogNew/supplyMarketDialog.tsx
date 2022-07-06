import React, { useEffect, useState } from "react"
import ReactDOM from "react-dom"
import { useHundredDataContext } from "../../../../Types/hundredDataContext"
import { useUiContext } from "../../../../Types/uiContext"
import closeIcon from "../../../../assets/icons/closeIcon.png"
import ReactToolTip from 'react-tooltip'
import { Tab, TabContent, TabContentItem, TabHeader, TabHeaderItem } from "../../../TabControl/tabControl"
import SupplyItem from "./supplyItem"
import { GaugeV4 } from "../../../../Classes/gaugeV4Class"
import WithdrawItem from "./withdrawItem"

interface Props{
    open: boolean,
    closeSupplyMarketDialog: () => void,
}

const SupplyMarketDialog:React.FC<Props> = (props: Props) =>{
    const {selectedMarket, gaugesV4Data} = useHundredDataContext()
    const {spinnerVisible} = useUiContext()
    const [tabChange, setTabChange] = useState<number>(1)
    const [tabHeaders, setTabHeaders] = useState<any[]>([])
    const [tabContents, setTabContents] = useState<any>([])
    const [gaugeV4,  setGaugeV4] = useState<GaugeV4 | undefined>() 

    const dialogContainer = document.getElementById("modal") as Element

    const CloseDialog = () =>{
        if(spinnerVisible)
            return
        props.closeSupplyMarketDialog()
    }

    useEffect(() => {
        setTabChange(1)
    }, [props.open])

    useEffect(() => {
        if(selectedMarket){
            const gaugev4 = [...gaugesV4Data].find((x) => x?.generalData.lpTokenUnderlying === {...selectedMarket}.underlying.address)
            setGaugeV4(gaugev4)
            if(selectedMarket && props.open){
                const market = {...selectedMarket}
                const headers = []
                const contents = []
                const gaugeV4 = [...gaugesV4Data].find((x) => x?.generalData.lpTokenUnderlying === {...selectedMarket}.underlying.address)
                headers.push({title: "Supply"})
                contents.push(
                        <SupplyItem gaugeV4={gaugeV4} />
                )
                if(gaugev4){
                    headers.push({title: "Stake"})
                    contents.push(<WithdrawItem/>)
                }
                
                const backstopGaugeV4= gaugesV4Data?.find(g => g?.generalData.lpTokenUnderlying.toLowerCase() === market.pTokenAddress.toLowerCase())
                if(market.backstop || backstopGaugeV4){
                    headers.push({title: "Backstop"})
                    contents.push(<WithdrawItem/>)
                }
                
                headers.push({title: "Withdraw"})
                contents.push(
                    <WithdrawItem/>)
    
                setTabHeaders(headers)
                setTabContents(contents)
                console.log(headers)
            }
       
        }
      
    }, [props.open, selectedMarket])
    

   const dialog = props.open && selectedMarket && tabHeaders.length > 0?
        <div className={`dialog ${props.open ? "open-dialog" : ""}`}>
            <ReactToolTip id="borrow-dialog-tooltip" effect="solid"/>
            <div className="dialog-background" onClick = {() => CloseDialog()}></div>
            <div className={`supply-box ${selectedMarket.backstop && +selectedMarket?.backstop?.pendingHundred.toString() > 0 ? "supply-box-expand" : "" }`}>
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
                    <TabHeader tabChange={tabChange}>
                        {[...tabHeaders].map((h, index) => {
                            return <TabHeaderItem key={index} tabId={index + 1} title={h.title} tabChange={tabChange} setTabChange={setTabChange}/>
                        })}
                    </TabHeader>
                    <TabContent>
                        {[...tabContents].map((c, index) => {
                            return (<TabContentItem key={index} tabId={index + 1} tabChange={tabChange} open={props.open}>
                                        {c}
                                    </TabContentItem>)
                        })}
                    </TabContent>
                </Tab>
            </div> 
        </div>
        : null

    return (
        props.open && selectedMarket? ReactDOM.createPortal(dialog, dialogContainer) : null
    )
    
}

export default SupplyMarketDialog