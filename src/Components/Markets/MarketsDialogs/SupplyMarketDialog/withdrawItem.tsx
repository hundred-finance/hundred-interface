import React, { useRef, useEffect, useState } from 'react';
import { TabContentItem } from '../../../TabControl/tabControl';
import TextBox from '../../../Textbox/textBox';
import MarketDialogButton from '../marketDialogButton';
import DialogMarketInfoSection from '../marketInfoSection';
import '../supplyMarketDialog.css';
import MarketDialogItem from '../marketDialogItem';
import { Spinner } from '../../../../assets/huIcons/huIcons';
import { CTokenInfo, SpinnersEnum } from '../../../../Classes/cTokenClass';
import { BigNumber } from '../../../../bigNumber';
import { useHundredDataContext } from '../../../../Types/hundredDataContext';
import { useWeb3React } from '@web3-react/core';
import { useUiContext } from '../../../../Types/uiContext';
import { ethers } from 'ethers';
import { ExecuteWithExtraGasLimit } from '../../../../Classes/TransactionHelper';
import { CETHER_ABI, CTOKEN_ABI } from '../../../../abi';
import BorrowLimitSection from './borrowLimitSection';
import SupplyRateSection from './supplyRatesSection';
import { Contract, Provider} from 'ethcall';
import useFetchData from '../../../../Hundred/Data/hundredData';

interface Props {
    tabChange: number;
    open: boolean;
    getMaxAmount: (market: CTokenInfo, func?: string) => Promise<BigNumber>;
}
const WithdrawItem: React.FC<Props> = (props: Props) => {
    const { library, account } = useWeb3React();
    const {
        gaugesV4Data,
        generalData,
        selectedMarket,
        selectedMarketSpinners,
        marketsData,
        toggleSpinners,
        setSelectedMarketSpinners,
    } = useHundredDataContext();
    const { setSpinnerVisible, toastErrorMessage, toastSuccessMessage } = useUiContext();
    const [withdrawInput, setWithdrawInput] = useState<string>('');
    const [withdrawDisabled, setWithdrawDisabled] = useState<boolean>(false);
    const [withdrawValidation, setWithdrawValidation] = useState<string>('');
    const [newBorrowLimit2, setNewBorrowLimit2] = useState<BigNumber>(BigNumber.from(0));
    const [withdrawMax, setWithdrawMax] = useState<boolean>(false);
    const {checkUserBalanceIsUpdated} = useFetchData();
    const selectedMarketRef = useRef<CTokenInfo>();
    const gaugeV4 = gaugesV4Data
        ? [...gaugesV4Data].find((x) => {
              return x?.generalData.lpTokenUnderlying === selectedMarket?.underlying.address;
          })
        : null;
    const backstopGaugeV4 = gaugeV4?.generalData.backstopGauge;
    useEffect(() => {
        selectedMarket ? (selectedMarketRef.current = { ...selectedMarket }) : undefined;
    }, [selectedMarket]);
    useEffect(() => {
        const handleWithdrawAmountChange = () => {
            if (withdrawInput.trim() === '') {
                setWithdrawValidation('');
                setNewBorrowLimit2(BigNumber.from('0'));
                return;
            }
            if (isNaN(+withdrawInput.trim()) || isNaN(parseFloat(withdrawInput))) {
                setWithdrawValidation('Amount must be a number');
                setNewBorrowLimit2(BigNumber.from('0'));
                return;
            } else if (selectedMarket && +selectedMarket?.supplyBalanceInTokenUnit.toString() <= 0) {
                setWithdrawValidation('No balance to withdraw');
            } else if (+withdrawInput.trim() <= 0) {
                setWithdrawValidation('Amount must be > 0');
            } else if (selectedMarket && +withdrawInput > +selectedMarket?.supplyBalanceInTokenUnit) {
                setWithdrawValidation('Amount must be <= your supply balance');
            } else if (selectedMarket && +withdrawInput > +selectedMarket?.cash) {
                setWithdrawValidation('Amount must be <= liquidity');
            } else {
                setWithdrawValidation('');
                if (withdrawMax && selectedMarket) {
                    if (
                        BigNumber.parseValueSafe(
                            selectedMarket?.supplyBalanceInTokenUnit.toString(),
                            selectedMarket?.underlying.decimals,
                        ).toString() !== withdrawInput.toString()
                    ) {
                        setWithdrawMax(false);
                    }
                }
            }

            setNewBorrowLimit2(
                selectedMarket && generalData
                    ? generalData.totalBorrowLimit?.subSafe(
                          selectedMarket?.isEnterMarket
                              ? BigNumber.parseValue(withdrawInput.trim() !== '' ? withdrawInput : '0')
                                    .mulSafe(selectedMarket?.underlying.price)
                                    .mulSafe(selectedMarket?.collateralFactor)
                              : BigNumber.from(0),
                      )
                    : BigNumber.from(0),
            );
            // if (newBorrowLimit2.gt(BigNumber.from("0")))
            // console.log(`totalBorrow: ${generalData?.totalBorrowBalance}\nborrowLimit: ${newBorrowLimit2}\npercent${generalData?.totalBorrowBalance.divSafe(newBorrowLimit2).toString()}`)
        };

        handleWithdrawAmountChange();

        // eslint-disable-next-line
    }, [withdrawInput]);

    useEffect(() => {
        setNewBorrowLimit2(
            selectedMarket && generalData
                ? generalData.totalBorrowLimit?.subSafe(
                      selectedMarket?.isEnterMarket
                          ? BigNumber.parseValue(withdrawInput !== '' ? withdrawInput : '0')
                                .mulSafe(selectedMarket?.underlying.price)
                                .mulSafe(selectedMarket?.collateralFactor)
                          : BigNumber.from(0),
                  )
                : BigNumber.from(0),
        );
    }, [generalData]);

    const handleWithdraw = async (symbol: string, amount: string, max: boolean): Promise<void> => {
        const market = [...marketsData].find((x) => x?.underlying.symbol === symbol);
        if (market && library && symbol) {
            try {
                setSpinnerVisible(true);
                toggleSpinners(symbol, SpinnersEnum.withdraw);
                setWithdrawDisabled(true);
                if (selectedMarketSpinners) {
                    const selected = { ...selectedMarketSpinners };
                    selected.withdrawSpinner = true;
                    setSelectedMarketSpinners(selected);
                }
                //STEP 1: ethcall setup
                const ethcallProvider = new Provider()
                await ethcallProvider.init(library) //library = provider                    
                const signer = library.getSigner();
                const token = market.isNativeToken ? CETHER_ABI : CTOKEN_ABI;
                const ctoken = new ethers.Contract(market.pTokenAddress, token, signer);
                //STEP 2: fetch user's current data
                const tokenContractWeb3 = new Contract(selectedMarket?.pTokenAddress as string, token)
                const call = [tokenContractWeb3.getAccountSnapshot(account)]
                const currBalanceResult : any = [] = await ethcallProvider.all(call)  
                const currBalance = currBalanceResult[0][1] //cTokenBalance
                //STEP 3: execute txn
                if (max) {
                    const accountSnapshot = await ctoken.getAccountSnapshot(account);
                    const withdraw = ethers.BigNumber.from(accountSnapshot[1].toString());
                    const receipt = await ExecuteWithExtraGasLimit(ctoken, 'redeem', [withdraw], () =>
                        setSpinnerVisible(false),
                    );
                    console.log(receipt);
                } else {
                    const withdraw = BigNumber.parseValueSafe(amount, market.underlying.decimals);
                    const receipt = await ExecuteWithExtraGasLimit(ctoken, 'redeemUnderlying', [withdraw._value], () =>
                        setSpinnerVisible(false),
                    );
                    console.log(receipt);
                }
                //STEP 4: check updated balance
                toastSuccessMessage("Transaction complete, updating contracts")
                const checkReceipt = await checkUserBalanceIsUpdated(currBalance, "withdraw", tokenContractWeb3)
                console.log('checkReceipt: ', checkReceipt)
            } catch (err) {
                const error = err as any;
                toastErrorMessage(`${error?.message.replace('.', '')} on Withdraw\n${error?.data?.message}`);
                console.log(err);
            } finally {
                setSpinnerVisible(false);
                toggleSpinners(symbol, SpinnersEnum.withdraw);
                setWithdrawDisabled(false);
                if (selectedMarketSpinners) {
                    const selected = { ...selectedMarketSpinners };
                    selected.withdrawSpinner = false;
                    setSelectedMarketSpinners(selected);
                    // await handleUpdate(market, "withdraw", false)
                }
            }
        }
    };
    const getSafeMaxWithdraw = (): void => {
        setWithdrawMax(true);
        const withdraw = BigNumber.from('0');
        if (selectedMarket && generalData && +selectedMarket.supplyBalanceInTokenUnit.toString() > 0) {
            const borrow = BigNumber.parseValueSafe(
                generalData.totalBorrowBalance.toString(),
                selectedMarket.underlying.decimals,
            );
            const supply = generalData.totalSupplyBalance;
            const cFactor = BigNumber.parseValueSafe(
                selectedMarket.collateralFactor.toString(),
                selectedMarket.underlying.decimals,
            ).mulSafe(BigNumber.parseValueSafe('0.5001', selectedMarket.underlying.decimals));
            const percent = +cFactor.toString() === 0 ? 0 : +borrow.toString() / +cFactor.toString();
            const percentBN = BigNumber.parseValueSafe(percent.toString(), selectedMarket.underlying.decimals);
            if (+generalData?.totalBorrowLimitUsedPercent.toRound(2) >= 50.01) {
                setWithdrawInput(withdraw.toString());
            } else {
                const result = convertUSDToUnderlyingToken(supply.subSafe(percentBN).toString(), selectedMarket);
                setWithdrawInput(BigNumber.minimum(result, selectedMarket.supplyBalanceInTokenUnit).toString());
            }
        } else {
            setWithdrawInput(withdraw.toString());
        }
    };

    const getMaxWithdraw = (): void => {
        setWithdrawMax(true);
        selectedMarket
            ? setWithdrawInput(
                  BigNumber.minimum(
                      BigNumber.parseValueSafe(
                          selectedMarket?.supplyBalanceInTokenUnit.toString(),
                          selectedMarket.underlying.decimals,
                      ),
                      BigNumber.parseValueSafe(selectedMarket?.cash.toString(), selectedMarket.underlying.decimals),
                  ).toString(),
              )
            : setWithdrawInput('0');
    };

    function convertUSDToUnderlyingToken(USD: string, market: CTokenInfo): BigNumber {
        //USD -> underlying token
        const underlyingToken = +USD / +market.underlying.price.toString();
        return BigNumber.parseValueSafe(underlyingToken.toString(), market.underlying.decimals);
    }
    return (
        <TabContentItem
            open={props.open}
            tabId={
                (selectedMarket?.backstop || backstopGaugeV4) && gaugeV4
                    ? 4
                    : selectedMarket?.backstop || backstopGaugeV4 || gaugeV4
                    ? 3
                    : 2
            }
            tabChange={props.tabChange}
        >
            <TextBox
                placeholder={`0 ${selectedMarket?.underlying.symbol}`}
                disabled={withdrawDisabled}
                value={withdrawInput}
                setInput={setWithdrawInput}
                validation={withdrawValidation}
                button={generalData && +generalData.totalBorrowBalance.toString() > 0 ? 'Safe Max' : 'Max'}
                buttonTooltip="50% of withdraw limit"
                onClick={() => {
                    generalData && +generalData.totalBorrowBalance.toString() > 0
                        ? getSafeMaxWithdraw()
                        : getMaxWithdraw();
                }}
            />
            <MarketDialogItem
                title={'You Supplied'}
                value={`${selectedMarket?.supplyBalanceInTokenUnit?.toFixed(4)} ${selectedMarket?.underlying.symbol}`}
            />
            <SupplyRateSection />
            <BorrowLimitSection newBorrowLimit={newBorrowLimit2} />
            <DialogMarketInfoSection collateralFactorText={'Loan-to-Value'} />
            <MarketDialogButton
                disabled={
                    withdrawInput === '' ||
                    (selectedMarket && selectedMarketSpinners?.withdrawSpinner) ||
                    isNaN(+withdrawInput) ||
                    withdrawValidation !== '' ||
                    (newBorrowLimit2 &&
                        generalData &&
                        +newBorrowLimit2.toString() > 0 &&
                        +generalData?.totalBorrowBalance.toString() / +newBorrowLimit2.toString() > 0.9 &&
                        (+generalData?.totalBorrowBalance.toString() / +newBorrowLimit2.toString()) * 100 >
                            +generalData.totalBorrowLimitUsedPercent)
                        ? true
                        : false
                }
                onClick={() => {
                    selectedMarket
                        ? handleWithdraw(selectedMarket?.underlying.symbol, withdrawInput, withdrawMax)
                        : null;
                }}
            >
                {selectedMarket && selectedMarketSpinners?.withdrawSpinner ? <Spinner size={'20px'} /> : 'Withdraw'}
            </MarketDialogButton>
        </TabContentItem>
    );
};

export default WithdrawItem;
