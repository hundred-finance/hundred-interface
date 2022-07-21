import React, { useEffect, useRef, useState } from "react"
import { GaugeV4 } from "../../../../Classes/gaugeV4Class"
import { useHundredDataContext } from "../../../../Types/hundredDataContext"
import { Spinner } from '../../../../assets/huIcons/huIcons';
import TextBox from "../../../Textbox/textBox"
import MarketDialogButton from "../marketDialogButton"
import MarketDialogItem from "../marketDialogItem"
import DialogMarketInfoSection from "../marketInfoSection"
import BorrowLimitSection from "./borrowLimitSection"
import SupplyRateSection from "./supplyRatesSection"
import { BigNumber } from "../../../../bigNumber";
import { useWeb3React } from "@web3-react/core";
import { useUiContext } from "../../../../Types/uiContext";
import { SpinnersEnum } from "../../../../Classes/cTokenClass";
import { ExecutePayableWithExtraGasLimit, ExecuteWithExtraGasLimit } from "../../../../Classes/TransactionHelper";
import { ethers } from "ethers";
import { UpdateTypeEnum } from "../../../../Hundred/Data/hundredData";
import { CETHER_ABI, CTOKEN_ABI, TOKEN_ABI } from "../../../../abi";

const MaxUint256 = BigNumber.from(ethers.constants.MaxUint256);

interface Props {
    gaugeV4: GaugeV4 | undefined
}

const SupplyItem: React.FC<Props> = (props: Props) => {
    const mounted = useRef<boolean>(false)
    const {selectedMarket, selectedMarketSpinners, 
        generalData, marketsData, toggleSpinners, comptrollerData, getMaxAmount, updateMarket} = useHundredDataContext()
    const {setSpinnerVisible, toastSuccessMessage, toastErrorMessage} = useUiContext()
    const {library} = useWeb3React()
    const [supplyInput, setSupplyInput] = useState<string>('');
    const [supplyDisabled, setSupplyDisabled] = useState<boolean>(false);
    const [supplyValidation, setSupplyValidation] = useState<string>('');
    const [newBorrowLimit, setNewBorrowLimit] = useState<BigNumber>(BigNumber.from(0));

    const get_MaxAmount = async (): Promise<void> => {
        const amount = selectedMarket ? await getMaxAmount(selectedMarket, 'supply') : 0;
        setSupplyInput(amount.toString());
    };

    useEffect(() => {
        mounted.current = true

        return () => {
            mounted.current = false
        }
    }, [])

    useEffect(() => {
        if(selectedMarketSpinners){
            const spinner = {...selectedMarketSpinners}.spinner
            if(mounted.current){
                if(spinner) setSupplyDisabled(true)
                else setSupplyDisabled(false)
            }
        }

    }, [selectedMarketSpinners?.spinner])

    useEffect(() => {
        const handleSupplyAmountChange = () => {
            if (supplyInput.trim() === '') {
                setSupplyValidation('');
                setNewBorrowLimit(BigNumber.from('0'));
                return;
            }
            if (isNaN(+supplyInput) || isNaN(parseFloat(supplyInput))) {
                setSupplyValidation('Amount must be a number');
                setNewBorrowLimit(BigNumber.from('0'));
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

            setNewBorrowLimit(
                generalData && selectedMarket
                    ? {...generalData}.totalBorrowLimit?.addSafe(
                          {...selectedMarket}?.isEnterMarket
                              ? BigNumber.parseValue(supplyInput !== '' ? supplyInput : '0')
                                    .mulSafe({...selectedMarket}?.underlying.price)
                                    .mulSafe({...selectedMarket}?.collateralFactor)
                              : BigNumber.from(0),
                      )
                    : BigNumber.from(0),
            );
        };

        handleSupplyAmountChange();
    }, [supplyInput, generalData, selectedMarket]);

    useEffect(() => {
        setNewBorrowLimit(
            generalData && selectedMarket
                ? {...generalData}.totalBorrowLimit?.addSafe(
                      {...selectedMarket}?.isEnterMarket
                          ? BigNumber.parseValue(supplyInput !== '' ? supplyInput : '0')
                                .mulSafe({...selectedMarket}?.underlying.price)
                                .mulSafe({...selectedMarket}?.collateralFactor)
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
                    toggleSpinners(symbol, SpinnersEnum.supply);
                    
                    //STEP 1: ethcall setup
                    const value = BigNumber.parseValueSafe(amount, market.underlying.decimals);
                    const signer = library.getSigner();
                    const token = market.isNativeToken ? CETHER_ABI : CTOKEN_ABI;
                    const ctoken = new ethers.Contract(market.pTokenAddress, token, signer);
                    
                    const tx = market.isNativeToken
                        ? await ExecutePayableWithExtraGasLimit(ctoken, value._value, 'mint', [])
                        : await ExecuteWithExtraGasLimit(ctoken, 'mint', [value._value])
                    
                    setSpinnerVisible(false);
                    const receipt =  await tx.wait()
                    console.log(receipt);
                    //STEP 4: check updated balance
                    toastSuccessMessage("Transaction completed successfully.\nUpdating contracts")
                    await updateMarket(market, UpdateTypeEnum.Supply)
                    if(mounted.current)
                        setSupplyInput("")
                } catch (err) {
                    const error = err as any;
                    toastErrorMessage(`${error?.message.replace('.', '')} on Supply\n${error?.data?.message}`);
                    console.log(err);
                } finally {
                    setSpinnerVisible(false);
                    toggleSpinners(symbol, SpinnersEnum.supply);
                }
            }
        }
    }

    const handleApproveSupply = async (symbol: string): Promise<void> => {
        if (marketsData) {
            const market = [...marketsData].find((x) => x?.underlying.symbol === symbol);
            if (market && library && comptrollerData) {
                try {
                    setSpinnerVisible(true);
                    toggleSpinners(symbol, SpinnersEnum.supply);
                    
                    if (market.underlying.address) {
                        const signer = library.getSigner();
                        const contract = new ethers.Contract(market.underlying.address, TOKEN_ABI, signer);
                       
                        const tx = await ExecuteWithExtraGasLimit(contract, "approve", [market.pTokenAddress, MaxUint256._value])
                        
                        setSpinnerVisible(false)

                        const receipt = await tx.wait()

                        console.log(receipt);
                        toastSuccessMessage("Transaction complete, updating contracts")
                        await updateMarket(market, UpdateTypeEnum.ApproveMarket)
                    }
                } catch (err) {
                    const error = err as any;
                    toastErrorMessage(`${error?.message.replace('.', '')} on Approve Supply\n${error?.data?.message}`);
                    console.log(err);
                } finally {
                    setSpinnerVisible(false);
                    toggleSpinners(symbol, SpinnersEnum.supply);
                }
            }
        }
    }
    
    return (
        selectedMarket && selectedMarketSpinners && mounted ? 
        <>
        <TextBox placeholder={`0 ${{...selectedMarket}?.underlying.symbol}`} disabled={supplyDisabled || {...selectedMarket}?.mintPaused} value={supplyInput} setInput={setSupplyInput} validation={supplyValidation} button={"Max"} onClick={()=>get_MaxAmount()}/>
                            {props.gaugeV4 ? 
                                <div>If you want to Stake, please go directly to that tab<br/>(there is no need to Supply first). </div>
                                : null
                            }   
                            <MarketDialogItem title={"Wallet Balance"} value={`${{...selectedMarket}?.underlying.walletBalance?.toRound(4, true)} ${{...selectedMarket}?.underlying.symbol}`}/>
                            <SupplyRateSection gaugeV4={props.gaugeV4} />
                            <BorrowLimitSection newBorrowLimit={newBorrowLimit}/>
                            <DialogMarketInfoSection collateralFactorText={"Loan-to-Value"}/>
                           
                            {{...selectedMarket}.mintPaused ? 
                                <MarketDialogButton disabled={true} onClick={() => null}>
                                    Supply is Paused
                                </MarketDialogButton>
                            : +{...selectedMarket}.underlying.allowance.toString() > 0 &&
                                +{...selectedMarket}.underlying.allowance.toString() >= (supplyInput.trim() === "" || isNaN(+supplyInput) || isNaN(parseFloat(supplyInput)) ? 0 : +supplyInput)
                                ? 
                                    <MarketDialogButton disabled={supplyInput.trim()==="" || supplyValidation!="" || {...selectedMarketSpinners}.supplySpinner}
                                        onClick={() => handleSupply({...selectedMarket}.underlying.symbol, supplyInput)}>
                                        {{...selectedMarketSpinners}.supplySpinner ? (<Spinner size={"20px"}/>) : "Supply"}
                                    </MarketDialogButton>
                                : 
                                    <MarketDialogButton disabled={!selectedMarket || {...selectedMarketSpinners}?.supplySpinner}
                                        onClick={() => { handleApproveSupply({...selectedMarket}?.underlying.symbol) }}>
                                        {{...selectedMarketSpinners}.supplySpinner ? (<Spinner size={"20px"}/>) : `Approve ${{...selectedMarket}?.underlying.symbol}`}
                                    </MarketDialogButton>}
        </>
    : null)
}

export default SupplyItem