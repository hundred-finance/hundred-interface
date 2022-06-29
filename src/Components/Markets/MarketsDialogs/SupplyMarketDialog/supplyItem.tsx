import React, { useRef, useEffect, useState } from 'react';
import { TabContentItem } from '../../../TabControl/tabControl';
import TextBox from '../../../Textbox/textBox';
import MarketDialogButton from '../marketDialogButton';
import DialogMarketInfoSection from '../marketInfoSection';
import '../supplyMarketDialog.css';
import MarketDialogItem from '../marketDialogItem';
import SupplyRateSection from './supplyRatesSection';
import { Spinner } from '../../../../assets/huIcons/huIcons';
import { CTokenInfo, SpinnersEnum } from '../../../../Classes/cTokenClass';
import { BigNumber } from '../../../../bigNumber';
import { useHundredDataContext } from '../../../../Types/hundredDataContext';
import { useWeb3React } from '@web3-react/core';
import { useUiContext } from '../../../../Types/uiContext';
import { ethers } from 'ethers';
import { ExecutePayableWithExtraGasLimit, ExecuteWithExtraGasLimit } from '../../../../Classes/TransactionHelper';
import { CETHER_ABI, CTOKEN_ABI, TOKEN_ABI } from '../../../../abi';
import BorrowLimitSection from './borrowLimitSection';
import { Contract, Provider } from 'ethcall'
import useFetchData from '../../../../Hundred/Data/hundredData';

const MaxUint256 = BigNumber.from(ethers.constants.MaxUint256);
interface Props {
    tabChange: number;
    open: boolean;
    getMaxAmount: (market: CTokenInfo, func?: string) => Promise<BigNumber>;
}
const SupplyItem: React.FC<Props> = (props: Props) => {
    const { library , account} = useWeb3React();
    const {
        generalData,
        selectedMarket,
        selectedMarketSpinners,
        marketsData,
        toggleSpinners,
        setSelectedMarketSpinners,
        gaugesV4Data,
    } = useHundredDataContext();
    const { setSpinnerVisible, toastErrorMessage , toastSuccessMessage } = useUiContext();
    const [supplyInput, setSupplyInput] = useState<string>('');
    const [supplyDisabled, setSupplyDisabled] = useState<boolean>(false);
    const [supplyValidation, setSupplyValidation] = useState<string>('');
    const [newBorrowLimit1, setNewBorrowLimit1] = useState<BigNumber>(BigNumber.from(0));
    const selectedMarketRef = useRef<CTokenInfo>();
    const { checkUserBalanceIsUpdated } = useFetchData()

    useEffect(() => {
        selectedMarket ? (selectedMarketRef.current = { ...selectedMarket }) : undefined;
    }, [selectedMarket]);

    useEffect(() => {
        const handleSupplyAmountChange = () => {
            if (supplyInput.trim() === '') {
                setSupplyValidation('');
                setNewBorrowLimit1(BigNumber.from('0'));
                return;
            }
            if (isNaN(+supplyInput) || isNaN(parseFloat(supplyInput))) {
                setSupplyValidation('Amount must be a number');
                setNewBorrowLimit1(BigNumber.from('0'));
                return;
            } else if (+supplyInput <= 0) {
                setSupplyValidation('Amount must be > 0');
            } else if (selectedMarket && +supplyInput > +selectedMarket?.underlying.walletBalance) {
                setSupplyValidation('Amount must be <= balance');
            } else if (selectedMarket && +supplyInput > +selectedMarket?.underlying.allowance.toString()) {
                setSupplyValidation(`You must approve ${selectedMarket.underlying.symbol} first.`);
            } else {
                setSupplyValidation('');
            }

            setNewBorrowLimit1(
                generalData && selectedMarket
                    ? generalData.totalBorrowLimit?.addSafe(
                          selectedMarket?.isEnterMarket
                              ? BigNumber.parseValue(supplyInput !== '' ? supplyInput : '0')
                                    .mulSafe(selectedMarket?.underlying.price)
                                    .mulSafe(selectedMarket?.collateralFactor)
                              : BigNumber.from(0),
                      )
                    : BigNumber.from(0),
            );
        };

        handleSupplyAmountChange();
        // eslint-disable-next-line
    }, [supplyInput]);
    useEffect(() => {
        setNewBorrowLimit1(
            generalData && selectedMarket
                ? generalData.totalBorrowLimit?.addSafe(
                      selectedMarket?.isEnterMarket
                          ? BigNumber.parseValue(supplyInput !== '' ? supplyInput : '0')
                                .mulSafe(selectedMarket?.underlying.price)
                                .mulSafe(selectedMarket?.collateralFactor)
                          : BigNumber.from(0),
                  )
                : BigNumber.from(0),
        );
    }, [generalData]);
    const handleSupply = async (symbol: string, amount: string): Promise<void> => {
        if (marketsData) {
            const market = [...marketsData].find((x) => x?.underlying.symbol === symbol);
            if (market && library) {
                try {
                    setSpinnerVisible(true);
                    setSupplyDisabled(true);
                    toggleSpinners(symbol, SpinnersEnum.supply);
                    if (selectedMarketSpinners) {
                        const selected = { ...selectedMarketSpinners };
                        selected.supplySpinner = true;
                        setSelectedMarketSpinners(selected);
                    }
                    //STEP 1: ethcall setup
                    const ethcallProvider = new Provider()
                    await ethcallProvider.init(library) //library = provider                    
                    const value = BigNumber.parseValueSafe(amount, market.underlying.decimals);
                    const signer = library.getSigner();
                    const token = market.isNativeToken ? CETHER_ABI : CTOKEN_ABI;
                    const ctoken = new ethers.Contract(market.pTokenAddress, token, signer);
                    const tokenContractWeb3 = new Contract(selectedMarket?.pTokenAddress as string, token)
                    //STEP 2: fetch user's current account snapshot
                    const call = [tokenContractWeb3.getAccountSnapshot(account)]
                    const currBalanceResult : any = [] = await ethcallProvider.all(call)  
                    const currBalance = currBalanceResult[0][1] //cTokenBalance
                    //STEP 3: execute txn
                    const receipt = market.isNativeToken
                        ? await ExecutePayableWithExtraGasLimit(ctoken, value._value, 'mint', [], () =>
                              setSpinnerVisible(false),
                          )
                        : await ExecuteWithExtraGasLimit(ctoken, 'mint', [value._value], () =>
                              setSpinnerVisible(false),
                          );
                    console.log(receipt);
                    //STEP 4: check updated balance
                    toastSuccessMessage("Transaction complete, updating contracts")
                    const checkReceipt = await checkUserBalanceIsUpdated(currBalance, "supply", tokenContractWeb3)
                    console.log('checkReceipt: ', checkReceipt);
                } catch (err) {
                    const error = err as any;
                    toastErrorMessage(`${error?.message.replace('.', '')} on Supply\n${error?.data?.message}`);
                    console.log(err);
                } finally {
                    setSpinnerVisible(false);
                    toggleSpinners(symbol, SpinnersEnum.supply);
                    setSupplyDisabled(false);
                    if (selectedMarketSpinners) {
                        const selected = { ...selectedMarketSpinners };
                        selected.supplySpinner = false;
                        setSelectedMarketSpinners(selected);
                    }
                    //   await handleUpdate(market, "supply", false);
                }
            }
        }
    };
    const handleApproveSupply = async (symbol: string): Promise<void> => {
        if (marketsData) {
            const market = [...marketsData].find((x) => x?.underlying.symbol === symbol);
            if (market && library) {
                try {
                    setSpinnerVisible(true);
                    toggleSpinners(symbol, SpinnersEnum.supply);
                    setSupplyDisabled(true);
                    if (selectedMarketSpinners) {
                        const selected = { ...selectedMarketSpinners };
                        selected.supplySpinner = true;
                        setSelectedMarketSpinners(selected);
                    }
                    const signer = library.getSigner();
                    if (market.underlying.address) {
                        const contract = new ethers.Contract(market.underlying.address, TOKEN_ABI, signer);
                        const tokenContractWeb3 = new Contract(market.underlying.address, TOKEN_ABI);
                        const receipt = await ExecuteWithExtraGasLimit(
                            contract,
                            'approve',
                            [market.pTokenAddress, MaxUint256._value],
                            () => setSpinnerVisible(false),
                        );
                        console.log(receipt);
                        toastSuccessMessage("Transaction complete, updating contracts")
                        const checkReceipt = await checkUserBalanceIsUpdated(0, "approveSupply", tokenContractWeb3)
                        console.log('checkReceipt: ', checkReceipt); 
                    }
                } catch (err) {
                    const error = err as any;
                    toastErrorMessage(`${error?.message.replace('.', '')} on Approve Supply\n${error?.data?.message}`);
                    console.log(err);
                } finally {
                    setSpinnerVisible(false);
                    toggleSpinners(symbol, SpinnersEnum.supply);
                    setSupplyDisabled(false);
                    if (selectedMarketSpinners) {
                        const selected = { ...selectedMarketSpinners };
                        selected.supplySpinner = false;
                        setSelectedMarketSpinners(selected);
                    }
                    //   await handleUpdate(market, "supply", false);
                }
            }
        }
    };

    const getMaxAmount = async (): Promise<void> => {
        const amount = selectedMarket ? await props.getMaxAmount(selectedMarket, 'supply') : 0;
        setSupplyInput(amount.toString());
    };

    let supplyButtonIsDisabled = supplyInput.trim() === '' || supplyValidation != '';
    if (selectedMarketSpinners?.supplySpinner) {
        supplyButtonIsDisabled = supplyButtonIsDisabled || selectedMarketSpinners?.supplySpinner;
    }
    let approveButtonIsDisabled = !selectedMarket;
    if (selectedMarketSpinners?.supplySpinner) {
        approveButtonIsDisabled = !selectedMarket || (selectedMarket && selectedMarketSpinners?.supplySpinner);
    }
    let isSupplyDisabled = selectedMarket ? { ...selectedMarket }.mintPaused : false
    isSupplyDisabled = isSupplyDisabled || supplyDisabled
    return (
        <TabContentItem open={props.open} tabId={1} tabChange={props.tabChange}>
            <TextBox
                placeholder={`0 ${selectedMarket ? { ...selectedMarket }?.underlying.symbol : ''}`}
                disabled={isSupplyDisabled}
                value={supplyInput}
                setInput={setSupplyInput}
                validation={supplyValidation}
                button={'Max'}
                onClick={() => getMaxAmount()}
            />
            {gaugesV4Data ? (
                <div style={{ textAlign: 'left' }}>
                    If you want to Stake, please go directly to that tab
                    <br />
                    (there is no need to Supply first).{' '}
                </div>
            ) : null}
            <MarketDialogItem
                title={'Wallet Balance'}
                value={`${selectedMarket ? { ...selectedMarket }?.underlying.walletBalance?.toRound(4, true) : '0'} ${
                    selectedMarket ? { ...selectedMarket }?.underlying.symbol : ''
                }`}
            />
            <SupplyRateSection />
            <BorrowLimitSection newBorrowLimit={newBorrowLimit1} />
            <DialogMarketInfoSection />
            {selectedMarket && selectedMarket.mintPaused ? (
                <MarketDialogButton disabled={true} onClick={() => null}>
                    Supply is Paused
                </MarketDialogButton>
            ) : selectedMarket &&
              +selectedMarket.underlying.allowance.toString() > 0 &&
              +selectedMarket.underlying.allowance.toString() >=
                  (supplyInput.trim() === '' || isNaN(+supplyInput) || isNaN(parseFloat(supplyInput))
                      ? 0
                      : +supplyInput) ? (
                <MarketDialogButton
                    disabled={supplyButtonIsDisabled}
                    onClick={() => {
                        selectedMarket ? handleSupply(selectedMarket.underlying.symbol, supplyInput) : null;
                    }}
                >
                    {selectedMarketSpinners?.supplySpinner ? <Spinner size={'20px'} /> : 'Supply'}
                </MarketDialogButton>
            ) : (
                <MarketDialogButton
                    disabled={approveButtonIsDisabled}
                    onClick={() => {
                        selectedMarket ? handleApproveSupply(selectedMarket?.underlying.symbol) : null;
                    }}
                >
                    {selectedMarketSpinners?.supplySpinner ? (
                        <Spinner size={'20px'} />
                    ) : (
                        `Approve ${selectedMarket?.underlying.symbol}`
                    )}
                </MarketDialogButton>
            )}
        </TabContentItem>
    );
};

export default SupplyItem;