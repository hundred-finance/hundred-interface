import { BigNumber } from "../../../../bigNumber";
import React, {useEffect, useState} from "react"
import TextBox from "../../../Textbox/textBox";
import MarketDialogButton from "../marketDialogButton";
import "../supplyMarketDialog.css"
import MarketDialogItem from "../marketDialogItem";
import {Spinner} from "../../../../assets/huIcons/huIcons";
import { CTokenInfo } from "../../../../Classes/cTokenClass";
import BackstopSection from "./backstopSection";
import { useHundredDataContext } from "../../../../Types/hundredDataContext";
import { getBackstopMarketTabVariables } from "./backstopHelper";

interface Props{
    getMaxAmount: (market: CTokenInfo, func?: string) => Promise<BigNumber>,
    backstopDepositDisabled: boolean;
    backstopWithdrawDisabled: boolean;
    backstopClaimDisabled: boolean;
    open: boolean,
    handleApproveBackstop: (symbol: string) => Promise<void>
    handleBackstopDeposit: (symbol: string, amount: string) => Promise<void>
    handleBackstopWithdraw: (symbol: string, amount: string) => Promise<void>
    handleBackstopClaim: (symbol: string) => Promise<void>
}
const BackstopMarketTab:React.FC<Props> = (props: Props) =>{
    const [depositInput, setDepositInput] = useState<string>("")
    const [backstopWithdrawInput, setBackstopWithdrawInput] = useState<string>("")
    const [backstopWithdraw, setBackstopWithdraw] = useState<string>("Withdraw")
    const [backstopWithdrawValidation, setBackstopWithdrawValidation] = useState<string>("")
    const { selectedMarket, selectedMarketSpinners } = useHundredDataContext();
    const [depositValidation, setDepositValidation] = useState<string>('');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    useEffect(() => {
        const handleDepositAmountChange = () => {
            if (depositInput.trim() === '') {
                setDepositValidation('');
                return;
            }

            if (isNaN(+depositInput) || isNaN(parseFloat(depositInput))) {
                setDepositValidation('Amount must be a number');
                return;
            } else if (+depositInput <= 0) {
                setDepositValidation('Amount must be > 0');
            } else if (selectedMarket) {
                const market = {...selectedMarket}
                if (+depositInput > +market?.underlying.walletBalance)
                setDepositValidation('Amount must be <= balance');            
            } else {
                setDepositValidation('');
            }
        };

        handleDepositAmountChange();
        // eslint-disable-next-line
    }, [depositInput]);
    useEffect(()=>{
        const handlebackstopWithdrawChange = () => {
            if(backstopWithdrawInput.trim() === ""){
                setBackstopWithdrawValidation("")
                setBackstopWithdraw("Withdraw")
                return;
            }

            if(isNaN(+backstopWithdrawInput) || isNaN(parseFloat(backstopWithdrawInput))){
                setBackstopWithdrawValidation("Amount must be a number");
                setBackstopWithdraw("Withdraw")
                return;
            }else if (+backstopWithdrawInput <= 0) {
                setBackstopWithdrawValidation("Amount must be > 0");
                setBackstopWithdraw("Withdraw")
            } else if (selectedMarket){ 
                const market = {...selectedMarket}
                if (market.backstop && +backstopWithdrawInput > +market?.backstop?.userBalance) {
                    setBackstopWithdraw("Withdraw")
                    setBackstopWithdrawValidation("Amount must be <= balance");
                } else {
                    if(market.backstop){
                        const widthdrawUsd = BigNumber.parseValue((+backstopWithdrawInput * market.backstop.sharePrice.toNumeral()).noExponents())
                        if(widthdrawUsd.toNumeral() > 0){
                            if(+widthdrawUsd.toRound(2, true) > 0)
                                setBackstopWithdraw(`Withdraw ($${widthdrawUsd.toRound(2,true,true)})`)
                            else if(+widthdrawUsd.toRound(3, true) > 0)
                                setBackstopWithdraw(`Withdraw ($${widthdrawUsd.toRound(3,true,true)})`)
                            else if(+widthdrawUsd.toRound(4, true) > 0)
                                setBackstopWithdraw(`Withdraw ($${widthdrawUsd.toRound(4,true,true)})`)
                            else
                                setBackstopWithdraw(`Withdraw (>$${widthdrawUsd.toRound(2,true,true)})`)
                        }
                        else setBackstopWithdraw("Withdraw")
                    }
                    setBackstopWithdrawValidation("");
                }
            }
        }
        
        handlebackstopWithdrawChange()
          // eslint-disable-next-line
    }, [backstopWithdrawInput])

    // Alert if clicked on outside of element
    useEffect(() => {

        
        if(props.open){
            document.getElementsByTagName("body")[0].style.overflow = 'hidden'
        }
        else{
            document.getElementsByTagName("body")[0].style.overflow = 'auto'
        }

    }, [props.open]);

    const getMaxAmount = async () : Promise<void> => {
        const amount = selectedMarket ? await props.getMaxAmount(selectedMarket, "supply") : 0
        setDepositInput(amount.toString())
    }

    const getMaxBackstopWithdraw = () : void=> {
        selectedMarket && selectedMarket.backstop ? setBackstopWithdrawInput(selectedMarket.backstop.userBalance.toString()) : setBackstopWithdrawInput("0")
    }

    const bs = getBackstopMarketTabVariables(depositInput, depositValidation, backstopWithdrawInput, backstopWithdrawValidation, selectedMarket, selectedMarketSpinners)
    
    return (
        <>  
            <MarketDialogItem title={"Wallet Ballance"} value={`${bs.underlyingBalance} ${bs.underlyingSymbol}`} className="dialog-section-no-bottom-gap"/>
            <BackstopSection/>
            <TextBox placeholder={`0 ${bs.underlyingSymbol}`} disabled={props.backstopDepositDisabled} value={depositInput} setInput={setDepositInput} validation={depositValidation} button={"Max"}
                     onClick={()=>getMaxAmount()} validationCollapse={true}/>
            { bs.isBackstop
                ? (
                    <MarketDialogButton disabled={bs.isDepositDisabled}
                                        onClick={() => {selectedMarket ? props.handleBackstopDeposit(bs.underlyingSymbol, depositInput) : null}}>
                        {selectedMarketSpinners?.backstopDepositSpinner ? (<Spinner size={"20px"}/>) : "Deposit"}
                    </MarketDialogButton>
                ) : (
                    <MarketDialogButton disabled={bs.isApproveDisabled}
                                        onClick={() => {selectedMarket ? props.handleApproveBackstop(bs.underlyingSymbol) : null}}>
                        {selectedMarketSpinners?.backstopDepositSpinner ? (<Spinner size={"20px"}/>) : `Approve ${bs.underlyingSymbol}`}
                    </MarketDialogButton>)}
            <TextBox placeholder={`0 ${bs.backstopSymbol}`} disabled={props.backstopWithdrawDisabled} value={backstopWithdrawInput} setInput={setBackstopWithdrawInput} validation={backstopWithdrawValidation} button={"Max"}
                     onClick={() => getMaxBackstopWithdraw()} validationCollapse={true}/>
            <MarketDialogButton
                className="backstop-dialog-button"
                disabled={bs.isBackstopWithdrawDisabled}
                onClick={() => {    selectedMarket ?
                    props.handleBackstopWithdraw(
                        bs.underlyingSymbol,
                        backstopWithdrawInput
                    ) : null
                }}
            >
                {selectedMarket && {...selectedMarketSpinners}?.backstopWithdrawSpinner ? (<Spinner size={"20px"}/>) : backstopWithdraw}
            </MarketDialogButton>
            {
                bs.isPendingHundred ?
                    <MarketDialogButton
                        className="backstop-dialog-button"
                        disabled={!!selectedMarketSpinners?.backstopClaimSpinner}
                        onClick={() => {    selectedMarket ?
                            props.handleBackstopClaim(
                                bs.underlyingSymbol,
                            ) : null
                        }}
                    >
                        {selectedMarket && selectedMarketSpinners?.backstopClaimSpinner ? (<Spinner size={"20px"}/>) : `Claim ${bs.claimAmount} HND`}
                    </MarketDialogButton>
                    :<></>
            }
        </>
    )
}

export default BackstopMarketTab