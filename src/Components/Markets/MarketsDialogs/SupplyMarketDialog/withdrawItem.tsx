import { useWeb3React } from "@web3-react/core"
import { ethers } from "ethers"
import React, { useEffect, useRef, useState } from "react"
import { CETHER_ABI, CTOKEN_ABI } from "../../../../abi"
import { Spinner } from "../../../../assets/huIcons/huIcons"
import { BigNumber } from "../../../../bigNumber"
import { SpinnersEnum } from "../../../../Classes/cTokenClass"
import { GaugeV4 } from "../../../../Classes/gaugeV4Class"
import { ExecuteWithExtraGasLimit } from "../../../../Classes/TransactionHelper"
import { UpdateTypeEnum } from "../../../../Hundred/Data/hundredData"
import { useHundredDataContext } from "../../../../Types/hundredDataContext"
import { useUiContext } from "../../../../Types/uiContext"
import TextBox from "../../../Textbox/textBox"
import MarketDialogButton from "../marketDialogButton"
import MarketDialogItem from "../marketDialogItem"
import DialogMarketInfoSection from "../marketInfoSection"
import BorrowLimitSection from "./borrowLimitSection"
import SupplyRateSection from "./supplyRatesSection"

interface Props{
    gaugeV4: GaugeV4 | undefined
}

const WithdrawItem: React.FC<Props> = (props: Props) => {
    const mounted = useRef<boolean>(false)
    const {selectedMarket, selectedMarketSpinners, generalData, marketsData, toggleSpinners, convertUSDToUnderlyingToken, updateMarket} = useHundredDataContext()
    const {setSpinnerVisible, toastSuccessMessage, toastErrorMessage} = useUiContext()
    const {library, account} = useWeb3React()
    const [withdrawInput, setWithdrawInput] = useState<string>('');
    const [withdrawDisabled, setWithdrawDisabled] = useState<boolean>(false);
    const [withdrawValidation, setWithdrawValidation] = useState<string>('');
    const [newBorrowLimit, setNewBorrowLimit] = useState<BigNumber>(BigNumber.from(0));
    const [withdrawMax, setWithdrawMax] = useState<boolean>(false);

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
                if(spinner) setWithdrawDisabled(true)
                else setWithdrawDisabled(false)
            }
        }

    }, [selectedMarketSpinners?.spinner])

    useEffect(()=>{
        if(selectedMarket && generalData){
            const selected = {...selectedMarket}
            const general = {...generalData}
            if(withdrawInput.trim()===""){
                setWithdrawValidation("")
                setNewBorrowLimit(BigNumber.from("0"))
                return
            }
            if(isNaN(+withdrawInput.trim()) || isNaN(parseFloat(withdrawInput))){
                setWithdrawValidation("Amount must be a number")
                setNewBorrowLimit(BigNumber.from("0"))
                return
            } else if (+selected.supplyBalanceInTokenUnit.toString() <= 0) {
                setWithdrawValidation("No balance to withdraw")
            }else if (+withdrawInput.trim() <= 0) {
                setWithdrawValidation("Amount must be > 0")
            } else if (+withdrawInput > +selected?.supplyBalanceInTokenUnit) {
                setWithdrawValidation("Amount must be <= your supply balance")
            } else if (+withdrawInput > +selected?.cash) {
                setWithdrawValidation("Amount must be <= liquidity")
            }else{
                setWithdrawValidation("");
                if(withdrawMax){
                    if(BigNumber.parseValueSafe(selected.supplyBalanceInTokenUnit.toString(), selected.underlying.decimals).toString() !==  withdrawInput.toString())
                    {
                        setWithdrawMax(false)
                    }
                }
            }

            setNewBorrowLimit( 
                general.totalBorrowLimit?.subSafe(selected.isEnterMarket? BigNumber.parseValue(withdrawInput.trim()!=="" ? withdrawInput : "0").
                                mulSafe(selected.underlying.price).mulSafe(selected.collateralFactor): BigNumber.from(0)))
        }
        else
            BigNumber.from(0)
    }, [withdrawInput, selectedMarket, generalData])

    const getMaxWithdraw = () : void=> {
        setWithdrawMax(true)
        if (selectedMarket){
            const selected = {...selectedMarket}
            setWithdrawInput(BigNumber.minimum(BigNumber.parseValueSafe(selected.supplyBalanceInTokenUnit.toString(),  selected.underlying.decimals),
                BigNumber.parseValueSafe(selected.cash.toString(), selected.underlying.decimals)).toString())
        }
        else setWithdrawInput("0")
    }

    const getSafeMaxWithdraw = () : void=> {
        setWithdrawMax(true)
        const withdraw = BigNumber.from('0'); 
        if (selectedMarket && generalData && +{...selectedMarket}.supplyBalanceInTokenUnit.toString() > 0)
        {
            const selected = {...selectedMarket}
            const general = {...generalData}

            const borrow = BigNumber.parseValueSafe(general.totalBorrowBalance.toString(), selected.underlying.decimals) ;
            const supply = general.totalSupplyBalance;
            const cFactor = BigNumber.parseValueSafe(selected.collateralFactor.toString(), selected.underlying.decimals).mulSafe(BigNumber.parseValueSafe('0.5001', selected.underlying.decimals));
            const percent = +cFactor.toString() === 0 ? 0 : +borrow.toString() / +cFactor.toString()
            const percentBN = BigNumber.parseValueSafe(percent.toString(), selected.underlying.decimals);
            if (+general.totalBorrowLimitUsedPercent.toRound(2) >= 50.01){
                setWithdrawInput(withdraw.toString())
            }
            else {
                const result = convertUSDToUnderlyingToken(supply.subSafe(percentBN).toString(), selected );
                setWithdrawInput (BigNumber.minimum(result, selected.supplyBalanceInTokenUnit).toString());

            }

        } else{ 
        setWithdrawInput(withdraw.toString());

        }
    }

    const handleWithdraw = async (symbol:  string, amount: string, max: boolean) : Promise<void> => {
        if(marketsData){
          const market = [...marketsData].find(x=>x?.underlying.symbol === symbol)
          if(market && library){
            try{
                setSpinnerVisible(true)
                toggleSpinners(symbol, SpinnersEnum.withdraw);

                const signer = library.getSigner()
                const token = market.isNativeToken ? CETHER_ABI : CTOKEN_ABI
                const ctoken = new ethers.Contract(market.pTokenAddress, token, signer)
                
                let withdraw = ethers.BigNumber.from("0")
                
                console.log(max)
                if (max){
                    const accountSnapshot = await ctoken.getAccountSnapshot(account)
                    withdraw = ethers.BigNumber.from(accountSnapshot[1].toString())
                }
                else{
                    withdraw = BigNumber.parseValueSafe(amount, market.underlying.decimals)._value
                }

                const tx = await ExecuteWithExtraGasLimit(ctoken, max ? "redeem" : "redeemUnderlying", [withdraw])
                setSpinnerVisible(false);
                const receipt =  await tx.wait()
                console.log(receipt);
                    
                toastSuccessMessage("Transaction completed successfully.\nUpdating contracts")
                await updateMarket(market, UpdateTypeEnum.Withdraw)
                if(mounted)
                    setWithdrawInput("")
                else console.log("Unmounted supply tab")

            }
            catch(err){
                const error = err as any;
                toastErrorMessage(`${error?.message.replace('.', '')} on Supply\n${error?.data?.message}`);
                console.log(err)
            }
            finally{
                setSpinnerVisible(false)
                toggleSpinners(symbol, SpinnersEnum.withdraw);
            }
          }
        }
      }
    
    return (selectedMarket && selectedMarketSpinners ?
    <>
        <TextBox placeholder={`0 ${{...selectedMarket}?.underlying.symbol}`} disabled={withdrawDisabled} value={withdrawInput} setInput={setWithdrawInput} validation={withdrawValidation}
                                     button={generalData && +{...generalData}.totalBorrowBalance.toString() > 0 ? "Safe Max" : "Max"} buttonTooltip="50% of borrow limit"
                                     onClick={() => {generalData && +{...generalData}.totalBorrowBalance.toString() > 0 ? getSafeMaxWithdraw() : getMaxWithdraw()}}/>
        <MarketDialogItem title={"You Supplied"} value={`${{...selectedMarket}?.supplyBalanceInTokenUnit?.toFixed(4)} ${{...selectedMarket}?.underlying.symbol}`}/>
        <SupplyRateSection gaugeV4={props.gaugeV4}/>
        <BorrowLimitSection newBorrowLimit={newBorrowLimit}/>
        <DialogMarketInfoSection collateralFactorText={"Loan-to-Value"}/>
        <MarketDialogButton disabled={withdrawInput==="" || {...selectedMarketSpinners}.withdrawSpinner || isNaN(+withdrawInput) || withdrawValidation!=="" || 
            (newBorrowLimit && generalData &&
            +newBorrowLimit.toString() > 0 &&
            +{...generalData}?.totalBorrowBalance.toString() / +newBorrowLimit.toString() > 0.9 &&
            (+{...generalData}?.totalBorrowBalance.toString() / +newBorrowLimit.toString() * 100) > +{...generalData}.totalBorrowLimitUsedPercent) ? true: false}
                            onClick={() => {
                                handleWithdraw(
                                    {...selectedMarket}?.underlying.symbol,
                                    withdrawInput,
                                    withdrawMax
                                )
                            }}>
            {{...selectedMarketSpinners}.withdrawSpinner ? (<Spinner size={"20px"}/>) : "Withdraw"}
        </MarketDialogButton>
    </>
    : <div>null</div>)
}

export default WithdrawItem