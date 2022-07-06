import React, { useState } from "react"
import { Spinner } from "../../../../assets/huIcons/huIcons"
import { BigNumber } from "../../../../bigNumber"
import { GaugeV4 } from "../../../../Classes/gaugeV4Class"
import { useHundredDataContext } from "../../../../Types/hundredDataContext"
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
    const {selectedMarket, selectedMarketSpinners, generalData} = useHundredDataContext()
    const [withdrawInput, setWithdrawInput] = useState<string>('');
    const [withdrawDisabled, setWithdrawDisabled] = useState<boolean>(false);
    const [withdrawValidation, setWithdrawValidation] = useState<string>('');
    const [newBorrowLimit, setNewBorrowLimit] = useState<BigNumber>(BigNumber.from(0));
    const [withdrawMax, setWithdrawMax] = useState<boolean>(false);
    
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
    : null)
}

export default WithdrawItem