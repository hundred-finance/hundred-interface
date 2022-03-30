import { BigNumber } from "../../../bigNumber";
import React, {useEffect, useState} from "react"
import TextBox from "../../Textbox/textBox";
import MarketDialogButton from "./marketDialogButton";
import "./supplyMarketDialog.css"
import MarketDialogItem from "./marketDialogItem";
import {Spinner} from "../../../assets/huIcons/huIcons";
import { CTokenInfo } from "../../../Classes/cTokenClass";
import BackstopSection from "./backstopSection";

interface Props{
    market: CTokenInfo,
    getMaxAmount: (market: CTokenInfo, func?: string) => Promise<BigNumber>,

    depositDisabled: boolean,
    depositValidation: string,

    open: boolean,
    completed: boolean,

    handleApproveBackstop: (symbol: string) => Promise<void>
    handleBackstopDeposit: (symbol: string, amount: string) => Promise<void>
    handleBackstopWithdraw: (symbol: string, amount: string) => Promise<void>
    handleBackstopClaim: (symbol: string) => Promise<void>
}
const BackstopMarketTab:React.FC<Props> = (props: Props) =>{
    const [depositInput, setDepositInput] = useState<string>("")
    const [backstopWithdrawInput, setBackstopWithdrawInput] = useState<string>("")
    const [backstopWithdraw, setBackstopWithdraw] = useState<string>("Withdraw")
    const [backstopWithdrawDisabled, setbackstopWithdrawDisabled] = useState<boolean>(false)
    const [backstopWithdrawValidation, setBackstopWithdrawValidation] = useState<string>("")
    // eslint-disable-next-line @typescript-eslint/no-unused-vars

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
            } else if (props.market && props.market.backstop && +backstopWithdrawInput > +props.market?.backstop?.userBalance) {
                setBackstopWithdraw("Withdraw")
                setBackstopWithdrawValidation("Amount must be <= balance");
            }else{
                if(props.market?.backstop){
                    const widthdrawUsd = BigNumber.parseValue((+backstopWithdrawInput * props.market.backstop.sharePrice.toNumeral()).noExponents())
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
        
        handlebackstopWithdrawChange()
          // eslint-disable-next-line
    }, [backstopWithdrawInput])

    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        
        if(props.open){
            document.getElementsByTagName("body")[0].style.overflow = 'hidden'
        }
        else{
            document.getElementsByTagName("body")[0].style.overflow = 'auto'
        }

    }, [props.open]);

    const getMaxAmount = async () : Promise<void> => {
        const amount = props.market ? await props.getMaxAmount(props.market, "supply") : 0
        setDepositInput(amount.toString())
    }

    const getMaxBackstopWithdraw = () : void=> {
        props.market && props.market.backstop ? setBackstopWithdrawInput(props.market.backstop.userBalance.toString()) : setBackstopWithdrawInput("0")
    }

    useEffect(() => {
        if(props.market && props.market.backstop){
            if(!props.market.backstopWithdrawSpinner){
                if(props.completed) setBackstopWithdrawInput("")
                setbackstopWithdrawDisabled(false)
            }
            else{
                setbackstopWithdrawDisabled(true)
            }
            
        }
    }, [props.market?.backstopWithdrawSpinner])

    return (
        <>
            <MarketDialogItem title={"Wallet Ballance"} value={`${props.market?.underlying.walletBalance?.toRound(4, true)} ${props.market?.underlying.symbol}`} className="dialog-section-no-bottom-gap"/>
            <BackstopSection market={props.market}/>
            <TextBox placeholder={`0 ${props.market?.underlying.symbol}`} disabled={props.depositDisabled} value={depositInput} setInput={setDepositInput} validation={props.depositValidation} button={"Max"}
                     onClick={()=>getMaxAmount()} validationCollapse={true}/>
            {props.market?.backstop && props.market?.backstop.allowance?.gt(BigNumber.from(0)) && props.market?.backstop.allowance?.gte(depositInput.trim() === "" || isNaN(+depositInput) ?
                BigNumber.from("0") :
                BigNumber.parseValue(depositInput))
                ? (
                    <MarketDialogButton disabled={depositInput==="" || props.depositValidation!="" || props.market?.backstopDepositSpinner}
                                        onClick={() => {   props.market ? props.handleBackstopDeposit(props.market?.underlying.symbol, depositInput) : null}}>
                        {props.market.backstopDepositSpinner ? (<Spinner size={"20px"}/>) : "Deposit"}
                    </MarketDialogButton>
                ) : (
                    <MarketDialogButton disabled={!props.market || (props.market && props.market?.backstopDepositSpinner)}
                                        onClick={() => {props.market ? props.handleApproveBackstop(props.market?.underlying.symbol) : null}}>
                        {props.market?.backstopDepositSpinner ? (<Spinner size={"20px"}/>) : `Approve ${props.market?.underlying.symbol}`}
                    </MarketDialogButton>)}
            <TextBox placeholder={`0 ${props.market.backstop?.symbol}`} disabled={backstopWithdrawDisabled} value={backstopWithdrawInput} setInput={setBackstopWithdrawInput} validation={backstopWithdrawValidation} button={"Max"}
                     onClick={() => getMaxBackstopWithdraw()} validationCollapse={true}/>
            <MarketDialogButton
                className="backstop-dialog-button"
                disabled={backstopWithdrawInput === "" || backstopWithdrawValidation !== "" || isNaN(+backstopWithdrawInput) || props.market?.backstopWithdrawSpinner || !props.market?.backstop || BigNumber.parseValue(backstopWithdrawInput).gt(props.market.backstop?.userBalance)}
                onClick={() => {    props.market ?
                    props.handleBackstopWithdraw(
                        props.market?.underlying.symbol,
                        backstopWithdrawInput
                    ) : null
                }}
            >
                {props.market && props.market.backstopWithdrawSpinner ? (<Spinner size={"20px"}/>) : backstopWithdraw}
            </MarketDialogButton>
            {
                props.market.backstop && +props.market.backstop.pendingHundred.toString() > 0 ?
                    <MarketDialogButton
                        className="backstop-dialog-button"
                        disabled={!!props.market?.backstopClaimSpinner}
                        onClick={() => {    props.market ?
                            props.handleBackstopClaim(
                                props.market?.underlying.symbol,
                            ) : null
                        }}
                    >
                        {props.market && props.market.backstopClaimSpinner ? (<Spinner size={"20px"}/>) : `Claim ${props.market.backstop?.pendingHundred.toRound(4, true, true)} HND`}
                    </MarketDialogButton>
                    :<></>
            }
        </>
    )
}

export default BackstopMarketTab