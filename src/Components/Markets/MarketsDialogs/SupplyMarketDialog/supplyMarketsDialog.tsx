import { BigNumber } from '../../../../bigNumber';
import React, { useEffect, useRef, useState } from 'react';
import { Tab, TabContent, TabHeader, TabHeaderItem } from '../../../TabControl/tabControl';
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

interface Props {
    open: boolean;
    closeSupplyMarketDialog: () => void;
    getMaxAmount: (market: CTokenInfo, func?: string) => Promise<BigNumber>;
}
const SupplyMarketDialog: React.FC<Props> = (props: Props) => {
    const [tabChange, setTabChange] = useState<number>(1);
    const { spinnerVisible } = useUiContext();
    const { generalData, selectedMarket, gaugesV4Data } = useHundredDataContext();
    const dialogContainer = document.getElementById('modal') as Element;
    const ref = useRef<HTMLDivElement | null>(null);
    const gaugeV4 = gaugesV4Data
        ? [...gaugesV4Data].find((x) => {
              return x?.generalData.lpTokenUnderlying === selectedMarket?.underlying.address;
          })
        : null;
    const backstopGaugeV4 = gaugeV4?.generalData.backstopGauge;
    let isStake, isBackstop, isAllTabs, isBackstopTab;
    if (selectedMarket) {
        console.log('selectedMarket: ', selectedMarket);
        isStake = gaugeV4 && generalData ? true : false;
        isBackstop = selectedMarket.backstop ? true : false;
        console.log('selectedMarket?.backstop : ', selectedMarket?.backstop);
        isAllTabs = (isBackstop || backstopGaugeV4) && gaugeV4 ? true : null;
        isBackstopTab = isBackstop || backstopGaugeV4;
    }

    // console.log('isStake: ', isStake);
    // console.log('isBackstop: ', isBackstop);
    // console.log('isBackstopTab: ', isBackstopTab);
    // console.log('isAllTabs: ', isAllTabs);

    // const isSupplyandWithdraw =
    const CloseDialog = (): void => {
        setTabChange(1);
        props.closeSupplyMarketDialog();
    };

    // Alert if clicked on outside of element
    useEffect(() => {
        const CloseDialog = (): void => {
            if (spinnerVisible) return;

            setTabChange(1);
            props.closeSupplyMarketDialog();
        };

        if (props.open) {
            document.getElementsByTagName('body')[0].style.overflow = 'hidden';
        } else {
            document.getElementsByTagName('body')[0].style.overflow = 'auto';
            CloseDialog();
        }

        function handleClickOutside(event: any): void {
            if (ref && ref.current && !ref.current.contains(event.target)) {
                CloseDialog();
            }
        }

        // Bind the event listener
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref, props.open]);

    const dialog = selectedMarket ? (
        <div className={`dialog ${props.open ? 'open-dialog' : ''}`}>
            <div className="dialog-background" />
            <ReactToolTip id="borrow-dialog-tooltip" effect="solid" />
            <div
                ref={ref}
                className={`supply-box ${
                    selectedMarket?.backstop && +selectedMarket.backstop.pendingHundred.toString() > 0
                        ? 'supply-box-expand'
                        : ''
                }`}
            >
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
                    {isAllTabs ? (
                        <TabHeader tabChange={tabChange}>
                            <TabHeaderItem tabId={1} title="Supply" tabChange={tabChange} setTabChange={setTabChange} />
                            <TabHeaderItem tabId={2} title="Stake" tabChange={tabChange} setTabChange={setTabChange} />
                            <TabHeaderItem
                                tabId={3}
                                title="Backstop"
                                tabChange={tabChange}
                                setTabChange={setTabChange}
                            />
                            <TabHeaderItem
                                tabId={4}
                                title="Withdraw"
                                tabChange={tabChange}
                                setTabChange={setTabChange}
                            />
                        </TabHeader>
                    ) : isBackstopTab ? (
                        <TabHeader tabChange={tabChange}>
                            <TabHeaderItem tabId={1} title="Supply" tabChange={tabChange} setTabChange={setTabChange} />
                            <TabHeaderItem
                                tabId={2}
                                title="Backstop"
                                tabChange={tabChange}
                                setTabChange={setTabChange}
                            />
                            <TabHeaderItem
                                tabId={3}
                                title="Withdraw"
                                tabChange={tabChange}
                                setTabChange={setTabChange}
                            />
                        </TabHeader>
                    ) : gaugeV4 ? (
                        <TabHeader tabChange={tabChange}>
                            <TabHeaderItem tabId={1} title="Supply" tabChange={tabChange} setTabChange={setTabChange} />
                            <TabHeaderItem tabId={2} title="Stake" tabChange={tabChange} setTabChange={setTabChange} />
                            <TabHeaderItem
                                tabId={3}
                                title="Withdraw"
                                tabChange={tabChange}
                                setTabChange={setTabChange}
                            />
                        </TabHeader>
                    ) : (
                        <TabHeader tabChange={tabChange}>
                            <TabHeaderItem tabId={1} title="Supply" tabChange={tabChange} setTabChange={setTabChange} />
                            <TabHeaderItem
                                tabId={2}
                                title="Withdraw"
                                tabChange={tabChange}
                                setTabChange={setTabChange}
                            />
                        </TabHeader>
                    )}
                    <TabContent>
                        <SupplyItem tabChange={tabChange} open={props.open} getMaxAmount={props.getMaxAmount} />
                        {isStake ? (
                            <StakeItem
                                isStake={isStake}
                                tabChange={tabChange}
                                open={props.open}
                                getMaxAmount={props.getMaxAmount}
                            />
                        ) : (
                            ''
                        )}
                        {isBackstop && isStake ? (
                            <StakeItem
                                isStake={isStake}
                                tabChange={tabChange}
                                open={props.open}
                                getMaxAmount={props.getMaxAmount}
                            />
                        ) : (
                            ''
                        )}
                        <WithdrawItem tabChange={tabChange} open={props.open} getMaxAmount={props.getMaxAmount} />
                    </TabContent>
                </Tab>
            </div>
        </div>
    ) : null;

    return props.open && selectedMarket ? ReactDOM.createPortal(dialog, dialogContainer) : null;
};

export default SupplyMarketDialog;
