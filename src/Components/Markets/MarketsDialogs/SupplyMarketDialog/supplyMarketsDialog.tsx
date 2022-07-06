import { BigNumber } from '../../../../bigNumber';
import React, { useEffect, useRef, useState } from 'react';
import { Tab, TabContent, TabContentItem, TabHeader, TabHeaderItem } from '../../../TabControl/tabControl';
import '../supplyMarketDialog.css';
import { CTokenInfo } from '../../../../Classes/cTokenClass';
import ReactToolTip from 'react-tooltip';
import closeIcon from '../../../../assets/icons/closeIcon.png';
import { useHundredDataContext } from '../../../../Types/hundredDataContext';
import { useUiContext } from '../../../../Types/uiContext';
import StakeItem from './stakeItem';
import SupplyItem from './supplyItem';
import WithdrawItem from './withdrawItem';
import ReactDOM from 'react-dom';
import { GaugeV4 } from '../../../../Classes/gaugeV4Class';

interface Props {
    open: boolean;
    closeSupplyMarketDialog: () => void;
    getMaxAmount: (market: CTokenInfo, func?: string) => Promise<BigNumber>;
}
const SupplyMarketDialog: React.FC<Props> = (props: Props) => {
    const [tabChange, setTabChange] = useState<number>(1);
    const [tabHeaders, setTabHeaders] = useState<any[]>([])
    const [tabContents, setTabContents] = useState<any>([])
    const { spinnerVisible } = useUiContext();
    const { generalData, selectedMarket, gaugesV4Data } = useHundredDataContext();
    const dialogContainer = document.getElementById('modal') as Element;
    const ref = useRef<HTMLDivElement | null>(null);
    
    
    
    let isStake, isBackstop, isAllTabs, isBackstopTab;
    

    // console.log('isStake: ', isStake);
    // console.log('isBackstop: ', isBackstop);
    // console.log('isBackstopTab: ', isBackstopTab);
    // console.log('isAllTabs: ', isAllTabs);

    // const isSupplyandWithdraw =
    const CloseDialog = (): void => {
        //setTabChange(1);
        props.closeSupplyMarketDialog();
    };

    useEffect(() => {
        if(selectedMarket && props.open){
            const market = {...selectedMarket}
            const headers = []
            const contents = []
            const gaugeV4 = [...gaugesV4Data].find((x) => x?.generalData.lpTokenUnderlying === {...selectedMarket}.underlying.address)
            headers.push({title: "Supply"})
            contents.push(
                <TabContentItem key={headers.length - 1} open={props.open} tabId={headers.length} tabChange={tabChange}>
                    <SupplyItem tabChange={tabChange} open={props.open} getMaxAmount={props.getMaxAmount} />
                </TabContentItem>
            )
            if(gaugeV4){
                headers.push({title: "Stake"})
                contents.push(
                    <TabContentItem key={headers.length - 1} open={props.open} tabId={headers.length} tabChange={tabChange}>
                        <StakeItem
                            isStake={true}
                            tabChange={tabChange}
                            open={props.open}
                            getMaxAmount={props.getMaxAmount}
                        />
                    </TabContentItem>)
            }
            
            const backstopGaugeV4= gaugesV4Data?.find(g => g?.generalData.lpTokenUnderlying.toLowerCase() === market.pTokenAddress.toLowerCase())
            if(market.backstop || backstopGaugeV4){
                headers.push({title: "Backstop"})
                contents.push(
                    <TabContentItem key={headers.length - 1} open={props.open} tabId={headers.length} tabChange={tabChange}>
                        <StakeItem
                            isStake={true}
                            tabChange={tabChange}
                            open={props.open}
                            getMaxAmount={props.getMaxAmount}
                        />
                    </TabContentItem>)
            }
            
            headers.push({title: "Withdraw"})
            contents.push(
                <TabContentItem key={headers.length - 1} open={props.open} tabId={headers.length} tabChange={tabChange}>
                    <WithdrawItem tabChange={tabChange} open={props.open} getMaxAmount={props.getMaxAmount} />
                </TabContentItem>)

            setTabHeaders(headers)
            setTabContents(contents)
            console.log(headers)
        }
    }, [props.open])

    // Alert if clicked on outside of element
    // useEffect(() => {
    //     const CloseDialog = (): void => {
    //         if (spinnerVisible) return;

    //         setTabChange(1);
    //         props.closeSupplyMarketDialog();
    //     };

    //     if (props.open) {
    //         document.getElementsByTagName('body')[0].style.overflow = 'hidden';
    //     } else {
    //         document.getElementsByTagName('body')[0].style.overflow = 'auto';
    //         CloseDialog();
    //     }

    //     // function handleClickOutside(event: any): void {
    //     //     if (ref && ref.current && !ref.current.contains(event.target)) {
    //     //         CloseDialog();
    //     //     }
    //     // }

    //     // // Bind the event listener
    //     // document.addEventListener('mousedown', handleClickOutside);
    //     // return () => {
    //     //     // Unbind the event listener on clean up
    //     //     document.removeEventListener('mousedown', handleClickOutside);
    //     // };
    // }, [ref, props.open]);

    const dialog = selectedMarket && [...tabHeaders].length > 0 && [...tabContents].length > 0? (
        <div className={`dialog ${props.open ? 'open-dialog' : ''}`}>
            <div className="dialog-background" onClick={() => CloseDialog()}/>
            <ReactToolTip id="borrow-dialog-tooltip" effect="solid" />
            <div className={`supply-box ${
                    selectedMarket?.backstop && +selectedMarket.backstop.pendingHundred.toString() > 0
                        ? 'supply-box-expand'
                        : ''
                }`}>
                <img src={closeIcon} alt="Close Icon" className="dialog-close" onClick={() => CloseDialog()} />
                <div className="dialog-title">
                    {{ ...selectedMarket }?.underlying.symbol && (
                        <img
                            className="rounded-circle"
                            style={{ width: '30px', margin: '0px 10px 0px 0px' }}
                            src={{ ...selectedMarket }?.underlying.logo}
                            alt=""
                        />
                    )}
                    {`${{ ...selectedMarket }?.underlying.symbol}`}
                </div>
                <Tab>
                    <TabHeader tabChange={tabChange}>
                        {[...tabHeaders].map((h, index) => {
                            return <TabHeaderItem key={index} tabId={index + 1} title={h.title} tabChange={tabChange} setTabChange={setTabChange}/>
                        })}
                    </TabHeader>
                    <TabContent>
                        {[...tabContents].map((c) => {
                            return c
                        })}
                    </TabContent>
                </Tab>
            </div>
        </div>
    ) : null;

    return props.open && selectedMarket ? ReactDOM.createPortal(dialog, dialogContainer) : null;
};

export default SupplyMarketDialog;
