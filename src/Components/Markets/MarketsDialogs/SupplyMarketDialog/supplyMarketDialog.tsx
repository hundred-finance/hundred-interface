import React, { useEffect, useRef, useState } from "react"
import ReactDOM from "react-dom"
import { useHundredDataContext } from "../../../../Types/hundredDataContext"
import { useUiContext } from "../../../../Types/uiContext"
import closeIcon from "../../../../assets/icons/closeIcon.png"
import ReactToolTip from 'react-tooltip'
import { Tab, TabContent, TabContentItem, TabHeader, TabHeaderItem } from "../../../TabControl/tabControl"
import SupplyItem from "./supplyItem"
import WithdrawItem from "./withdrawItem"
import DirectStakeMarketTab from "./directStakeMarketTab"
import StakeMarketTab from "./StakeMarket"
import DirectBackstopStakeMarketTab from "./directBackstopMarketTab"
import BackstopMarketTab from "./backstopMarketTab"
import "../marketDialog.css"

interface Props{
    closeSupplyMarketDialog: () => void,
}

const SupplyMarketDialog:React.FC<Props> = (props: Props) =>{
    const {selectedMarket, setSelectedMarket, setSelectedMarketSpinners, gaugesV4Data} = useHundredDataContext()
    const {spinnerVisible, darkMode} = useUiContext()
    const [tabChange, setTabChange] = useState<number>(1)
    const [tabHeaders, setTabHeaders] = useState<any[]>([])
    const [tabContents, setTabContents] = useState<any>([])

    const mountedSupply = useRef<boolean>(false)

    const dialogContainer = document.getElementById("modal") as Element

    const CloseDialog = () =>{
        if(spinnerVisible)
            return
        props.closeSupplyMarketDialog()
    }

    useEffect(() => {
        mountedSupply.current = true
        setTabChange(1)
        return () => {
            setSelectedMarket(undefined)
            setSelectedMarketSpinners(undefined)
            mountedSupply.current = false
        }
    }, [])

    useEffect(() => {
        if(selectedMarket && mountedSupply.current){
            const market = {...selectedMarket}
            const headers = []
            const contents = []
            const gaugeV4 = [...gaugesV4Data].find((x) => x?.generalData.lpTokenUnderlying === market.underlying.address)
            headers.push({title: "Supply"})
            contents.push(
                    <SupplyItem gaugeV4={gaugeV4} />
            )
            if(gaugeV4){
                headers.push({title: "Stake"})
                gaugeV4.generalData.gaugeHelper ?
                contents.push(<DirectStakeMarketTab gaugeV4={gaugeV4}/>)
                : contents.push(<StakeMarketTab gaugeV4={gaugeV4}/>)
            }
            
            const backstopGaugeV4= [...gaugesV4Data]?.find(g => g?.generalData.lpTokenUnderlying.toLowerCase() === market.pTokenAddress.toLowerCase())
            if(market.backstop || backstopGaugeV4){
                if (backstopGaugeV4){
                    headers.push({title: "Backstop"})
                    contents.push(<DirectBackstopStakeMarketTab gaugeV4={backstopGaugeV4}/>)
                }   
                else if(market.backstop){
                    headers.push({title: "Backstop"})
                    contents.push(<BackstopMarketTab/>)
                }
            }
            
            headers.push({title: "Withdraw"})
            contents.push(
                <WithdrawItem gaugeV4={gaugeV4}/>)

            setTabHeaders(headers)
            setTabContents(contents)
        }
    }, [selectedMarket, gaugesV4Data])
    

   const dialog = mountedSupply.current && selectedMarket && tabHeaders.length > 0?
        <div className={`dialog ${"open-dialog"} ${darkMode ? "dark" : "light"}`}>
            <ReactToolTip id="borrow-dialog-tooltip" effect="solid"/>
            <div className="dialog-background" onClick = {() => CloseDialog()}></div>
            <div className={`supply-box ${selectedMarket.backstop && +{...selectedMarket.backstop}.pendingHundred.toString() > 0 ? "supply-box-expand" : "" }`}>
                <img src={closeIcon} alt="Close Icon" className="dialog-close" onClick={()=>CloseDialog()} />  
                    <div className="dialog-title">
                        {{...selectedMarket}.underlying.symbol && (
                            <div className="logo-container">
                                <img
                                    className="rounded-circle"
                                    style={{ width: "30px", height: "30px"}}
                                    src={{...selectedMarket}.underlying.logo}
                                    alt=""/>
                            </div>
                        )}
                        {`${{...selectedMarket}.underlying.symbol}`}
                    </div>
                    <div className="seperator"/>
                    <Tab>
                    <TabHeader tabChange={tabChange}>
                        {[...tabHeaders].map((h, index) => {
                            return <TabHeaderItem key={index} tabId={index + 1} title={h.title} tabChange={tabChange} setTabChange={setTabChange}/>
                        })}
                    </TabHeader>
                    <TabContent>
                        {[...tabContents].map((c, index) => {
                            return (<TabContentItem key={index} tabId={index + 1} tabChange={tabChange} open={true}>
                                        {c}
                                    </TabContentItem>)
                        })}
                    </TabContent>
                </Tab>
            </div> 
        </div>
        : null

    return (
        ReactDOM.createPortal(dialog, dialogContainer)
    )
    
}

export default SupplyMarketDialog