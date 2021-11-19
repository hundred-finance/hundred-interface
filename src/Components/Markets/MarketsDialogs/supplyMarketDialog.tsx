import { BigNumber } from "../../../bigNumber";
import React, {useEffect, useState} from "react"
import { Tab, TabContent, TabContentItem, TabHeader, TabHeaderItem } from "../../TabControl/tabControl";
import TextBox from "../../Textbox/textBox";
import BorrowLimitSection from "./borrowLimitSection";
import MarketDialogButton from "./marketDialogButton";
import DialogMarketInfoSection from "./marketInfoSection";
import "./supplyMarketDialog.css"
import SupplyRateSection from "./supplyRatesSection";
import MarketDialogItem from "./marketDialogItem";
import { Spinner } from "../../../assets/huIcons/huIcons";
import { CTokenInfo } from "../../../Classes/cTokenClass";
import { GeneralDetailsData } from "../../../Classes/generalDetailsClass";
import closeIcon from "../../../assets/icons/closeIcon.png"
import BackstopSection from "./backstopSection";

interface Props{
    spinnerVisible: boolean,
    closeSupplyMarketDialog: () => void,
    market: CTokenInfo | null,
    generalData: GeneralDetailsData | null,
    open: boolean,
    getMaxAmount: (market: CTokenInfo, func?: string) => Promise<BigNumber>,
    darkMode: boolean,
    completed: boolean,
    handleSupply: (symbol: string, amount: string) => Promise<void>,
    handleEnable: (symbol: string, borrowDialog: boolean) => Promise<void>,
    handleWithdraw: (symbol: string, amount: string, max: boolean) => Promise<void>
    handleApproveBackstop: (symbol: string) => Promise<void>
    handleBackstopDeposit: (symbol: string, amount: string) => Promise<void>
    handleBackstopWithdraw: (symbol: string, amount: string) => Promise<void>
    
}
const SupplyMarketDialog:React.FC<Props> = (props: Props) =>{
    
    const [supplyInput, setSupplyInput] = useState<string>("")
    const [supplyDisabled, setSupplyDisabled] = useState<boolean>(false)
    const [withdrawInput, setWithdrawInput] = useState<string>("")
    const [withdrawDisabled, setWithdrawDisabled] = useState<boolean>(false)
    const [depositInput, setDepositInput] = useState<string>("")
    const [depositDisabled, setDepositDisabled] = useState<boolean>(false)
    const [backstopWithdrawInput, setBackstopWithdrawInput] = useState<string>("")
    const [backstopWithdrawDisabled, setbackstopWithdrawDisabled] = useState<boolean>(false)
    const [supplyValidation, setSupplyValidation] = useState<string>("")
    const [withdrawValidation, setWithdrawValidation] = useState<string>("")
    const [depositValidation, setDepositValidation] = useState<string>("")
    const [backstopWithdrawValidation, setBackstopWithdrawValidation] = useState<string>("")
    const [tabChange, setTabChange] = useState<number>(1)
    const [newBorrowLimit1, setNewBorrowLimit1] = useState<BigNumber>(BigNumber.from(0))
    const [newBorrowLimit2, setNewBorrowLimit2] = useState<BigNumber>(BigNumber.from(0))
    const [withdrawMax, setWithdrawMax] = useState<boolean>(false)

    const CloseDialog = () =>{
        if(props.spinnerVisible)
            return
        setSupplyInput("")
        setWithdrawInput("")
        setDepositInput("")
        setBackstopWithdrawInput("")
        setSupplyValidation("")
        setWithdrawValidation("")
        setDepositValidation("")
        setBackstopWithdrawValidation("")
        setTabChange(1)
        setNewBorrowLimit1(BigNumber.from(0))
        setNewBorrowLimit2(BigNumber.from(0))
        setWithdrawMax(false)
        props.closeSupplyMarketDialog()
    }

    useEffect(()=>{
        const handleSupplyAmountChange = () => {
            if(supplyInput.trim() === ""){
                setSupplyValidation("")
                setNewBorrowLimit1(BigNumber.from("0"))
                return;
            }

            if(isNaN(+supplyInput) || isNaN(parseFloat(supplyInput))){
                setSupplyValidation("Amount must be a number");
                setNewBorrowLimit1(BigNumber.from("0"))
                return;
            }else if (+supplyInput <= 0) {
              setSupplyValidation("Amount must be > 0");
            } else if (props.market && +supplyInput > +props.market?.underlying.walletBalance) {
              setSupplyValidation("Amount must be <= balance");
            }else{
                setSupplyValidation("");
            }

            setNewBorrowLimit1( props.generalData && props.market ?
              props?.generalData.totalBorrowLimit?.addSafe(props.market?.isEnterMarket ? BigNumber.parseValue(supplyInput!=="" ? supplyInput : "0").
                mulSafe(props.market?.underlying.price).mulSafe(props.market?.collateralFactor): BigNumber.from(0)) : BigNumber.from(0));
            }
        
          handleSupplyAmountChange()
          // eslint-disable-next-line
    }, [supplyInput])

    useEffect(()=>{
        const handleWithdrawAmountChange = () => {
            if(withdrawInput.trim()===""){
                setWithdrawValidation("")
                setNewBorrowLimit2(BigNumber.from("0"))
                return
            }
            if(isNaN(+withdrawInput.trim()) || isNaN(parseFloat(withdrawInput))){
                setWithdrawValidation("Amount must be a number")
                setNewBorrowLimit2(BigNumber.from("0"))
                return
            }else if (+withdrawInput.trim() <= 0) {
                setWithdrawValidation("Amount must be > 0")
            } else if (props.market && +withdrawInput > +props.market?.supplyBalanceInTokenUnit) {
                setWithdrawValidation("Amount must be <= your supply balance")
            } else if (props.market && +withdrawInput > +props.market?.cash) {
                setWithdrawValidation("Amount must be <= liquidity")
            }else{
                setWithdrawValidation("");
                if(withdrawMax && props.market){
                    if(BigNumber.parseValueSafe(props.market?.supplyBalanceInTokenUnit.toString(), props.market?.underlying.decimals).toString() !==  withdrawInput.toString())
                    {
                        setWithdrawMax(false)
                    }
                }
            }

            setNewBorrowLimit2(props.market && props.generalData ? 
                props.generalData.totalBorrowLimit?.subSafe(props.market?.isEnterMarket? BigNumber.parseValue(withdrawInput.trim()!=="" ? withdrawInput : "0").
                                mulSafe(props.market?.underlying.price).mulSafe(props.market?.collateralFactor): BigNumber.from(0)) : BigNumber.from(0))
                                // if (newBorrowLimit2.gt(BigNumber.from("0"))) 
                                // console.log(`totalBorrow: ${props.generalData?.totalBorrowBalance}\nborrowLimit: ${newBorrowLimit2}\npercent${props.generalData?.totalBorrowBalance.divSafe(newBorrowLimit2).toString()}`)
            }

        
          handleWithdrawAmountChange()

          // eslint-disable-next-line
    }, [withdrawInput])

    useEffect(()=>{
        const handleDepositAmountChange = () => {
            if(depositInput.trim() === ""){
                setDepositValidation("")
                return;
            }

            if(isNaN(+depositInput) || isNaN(parseFloat(depositInput))){
                setDepositValidation("Amount must be a number");
                return;
            }else if (+depositInput <= 0) {
              setDepositValidation("Amount must be > 0");
            } else if (props.market && +depositInput > +props.market?.underlying.walletBalance) {
              setDepositValidation("Amount must be <= balance");
            }else{
                setDepositValidation("");
            }
        }
        
          handleDepositAmountChange()
          // eslint-disable-next-line
    }, [depositInput])

    useEffect(()=>{
        const handlebackstopWithdrawChange = () => {
            if(depositInput.trim() === ""){
                setBackstopWithdrawValidation("")
                return;
            }

            if(isNaN(+backstopWithdrawInput) || isNaN(parseFloat(backstopWithdrawInput))){
                setBackstopWithdrawValidation("Amount must be a number");
                return;
            }else if (+depositInput <= 0) {
                setBackstopWithdrawValidation("Amount must be > 0");
            } else if (props.market && +depositInput > +props.market?.underlying.walletBalance) {
                setBackstopWithdrawValidation("Amount must be <= balance");
            }else{
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

    useEffect(() => {
        setNewBorrowLimit1( props.generalData && props.market ?
            props?.generalData.totalBorrowLimit?.addSafe(props.market?.isEnterMarket ? BigNumber.parseValue(supplyInput!=="" ? supplyInput : "0").
              mulSafe(props.market?.underlying.price).mulSafe(props.market?.collateralFactor): BigNumber.from(0)) : BigNumber.from(0));
          
        setNewBorrowLimit2(props.market && props.generalData ? props.generalData.totalBorrowLimit?.
            subSafe(props.market?.isEnterMarket? BigNumber.parseValue(withdrawInput!=="" ? withdrawInput : "0").
            mulSafe(props.market?.underlying.price).mulSafe(props.market?.collateralFactor): BigNumber.from(0)) : BigNumber.from(0));
    },[props.generalData])
    

    const getMaxAmount = async (deposit?: boolean) : Promise<void> => {
        const amount = props.market ? await props.getMaxAmount(props.market, "supply") : 0
        if(deposit)
            setDepositInput(amount.toString())
        else
            setSupplyInput(amount.toString())
    }

    const getMaxWithdraw = () : void=> {
        setWithdrawMax(true)
        props.market ? setWithdrawInput(BigNumber.minimum(BigNumber.parseValueSafe(props.market?.supplyBalanceInTokenUnit.toString(), props.market.underlying.decimals),
         BigNumber.parseValueSafe(props.market?.cash.toString(), props.market.underlying.decimals)).toString()) : setWithdrawInput("0")
    }

    const getMaxBackstopWithdraw = () : void=> {
        
        props.market && props.market.backstop ? setBackstopWithdrawInput(props.market.backstop.userBalance.toString()) : setBackstopWithdrawInput("0")
    }

    useEffect(() => {
        if(props.market){
            if(!props.market.supplySpinner){
                if(props.completed) setSupplyInput("")
                setSupplyDisabled(false)
            }
            else{
                setSupplyDisabled(true)
            }
        }
    }, [props.market?.supplySpinner])

    useEffect(() => {
        if(props.market){
            if(!props.market.withdrawSpinner){
                if(props.completed) setWithdrawInput("")
                setWithdrawDisabled(false)
            }
            else{
                setWithdrawDisabled(true)
            }
            
        }
    }, [props.market?.withdrawSpinner])

    useEffect(() => {
        if(props.market && props.market.backstop){
            if(!props.market.backstopDepositSpinner){
                if(props.completed) setDepositInput("")
                setDepositDisabled(false)
            }
            else{
                setDepositDisabled(true)
            }
            
        }
    }, [props.market?.backstopDepositSpinner])

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
        props.open ? (
        <div className={`dialog ${props.open ? "open-dialog" : ""}`}>
            <div className="dialog-background" onClick = {() => CloseDialog()}></div>
            <div className="supply-box">
            <img src={closeIcon} alt="Close Icon" className="dialog-close" onClick={()=>CloseDialog()} />  
                <div className="dialog-title">
                    {props.market?.underlying.symbol && (
                    <img
                        className="rounded-circle"
                        style={{ width: "30px", margin: "0px 10px 0px 0px" }}
                        src={props.market?.underlying.logo}
                        alt=""/>)}
                    {`${props.market?.underlying.symbol}`}
                </div>
                <Tab>
                        {props.market?.backstop ?
                            <TabHeader tabChange = {tabChange}>
                                <TabHeaderItem tabId={1} title="Supply" tabChange = {tabChange} setTabChange = {setTabChange}/>
                                <TabHeaderItem tabId={2} title="Withdraw" tabChange = {tabChange} setTabChange = {setTabChange}/>
                                <TabHeaderItem tabId={3} title="Backstop" tabChange = {tabChange} setTabChange = {setTabChange}/>
                            </TabHeader>
                            :
                            <TabHeader tabChange = {tabChange}>
                                <TabHeaderItem tabId={1} title="Supply" tabChange = {tabChange} setTabChange = {setTabChange}/>
                                <TabHeaderItem tabId={2} title="Withdraw" tabChange = {tabChange} setTabChange = {setTabChange}/>
                            </TabHeader>
                            }
                    <TabContent>
                        <TabContentItem open={props.open} tabId={1} tabChange={tabChange}>
                            <TextBox placeholder={`0 ${props.market?.underlying.symbol}`} disabled={supplyDisabled} value={supplyInput} setInput={setSupplyInput} validation={supplyValidation} button={"Max"} 
                                onClick={()=>getMaxAmount()}/>
                            <MarketDialogItem title={"Wallet Ballance"} value={`${props.market?.underlying.walletBalance?.toRound(4, true)} ${props.market?.underlying.symbol}`}/>
                            <SupplyRateSection darkMode={props.darkMode} market={props.market}/>
                            <BorrowLimitSection generalData={props.generalData} newBorrowLimit={newBorrowLimit1}/>
                            <DialogMarketInfoSection market={props.market} collateralFactorText={"Loan-to-Value"}/>
                           
                            {props.market?.underlying.allowance?.gt(BigNumber.from(0)) &&
                                props.market?.underlying.allowance?.gte(supplyInput.trim() === "" || !isNaN(+supplyInput) || isNaN(parseFloat(supplyInput)) ? BigNumber.from("0") 
                                : BigNumber.parseValue(supplyInput)) 
                                ? (
                                    <MarketDialogButton disabled={supplyInput==="" || supplyValidation!="" || props.market?.supplySpinner}
                                        onClick={() => {   props.market ? props.handleSupply(props.market?.underlying.symbol,supplyInput) : null}}>
                                        {props.market.supplySpinner ? (<Spinner size={"20px"}/>) : "Supply"}
                                    </MarketDialogButton>
                                ) : (
                                    <MarketDialogButton disabled={!props.market || (props.market && props.market?.supplySpinner)}
                                        onClick={() => {props.market ? props.handleEnable(props.market?.underlying.symbol,false) : null}}>
                                        {props.market?.supplySpinner ? (<Spinner size={"20px"}/>) : `Approve ${props.market?.underlying.symbol}`}
                                    </MarketDialogButton>)}
                        </TabContentItem>
                        <TabContentItem open={props.open} tabId={2} tabChange={tabChange}>
                            <TextBox placeholder={`0 ${props.market?.underlying.symbol}`} disabled={withdrawDisabled} value={withdrawInput} setInput={setWithdrawInput} validation={withdrawValidation} button={"Max"}
                                onClick={() => getMaxWithdraw()}/>
                            <MarketDialogItem title={"You Supplied"} value={`${props.market?.supplyBalanceInTokenUnit?.toFixed(4)} ${props.market?.underlying.symbol}`}/>
                            <SupplyRateSection darkMode={props.darkMode} market={props.market}/>
                            <BorrowLimitSection generalData={props.generalData} newBorrowLimit={newBorrowLimit2}/>
                            <DialogMarketInfoSection market={props.market} collateralFactorText={"Loan-to-Value"}/>
                            <MarketDialogButton disabled={withdrawInput==="" || !isNaN(+withdrawInput) || withdrawValidation!=="" || (newBorrowLimit2 && props.generalData && 
                            +newBorrowLimit2.toString() > 0 && 
                                        +props.generalData?.totalBorrowBalance.toString() / +newBorrowLimit2.toString() > 0.9 && +newBorrowLimit2.toString() > +props.generalData.totalBorrowLimit.toString() ? true: false)}
                                onClick={() => {    props.market ?
                                                    props.handleWithdraw(
                                                        props.market?.underlying.symbol,
                                                        withdrawInput,
                                                        withdrawMax
                                                    ) : null
                                                }}>
                                {props.market && props.market.withdrawSpinner ? (<Spinner size={"20px"}/>) : "Withdraw"}
                            </MarketDialogButton>
                        </TabContentItem>
                        {
                            props.market?.backstop ? 
                            <TabContentItem open={props.open} tabId={3} tabChange={tabChange}>
                                <MarketDialogItem title={"Wallet Ballance"} value={`${props.market?.underlying.walletBalance?.toRound(4, true)} ${props.market?.underlying.symbol}`}/>
                                <BackstopSection market={props.market}/>
                                <TextBox placeholder={`0 ${props.market?.underlying.symbol}`} disabled={depositDisabled} value={depositInput} setInput={setDepositInput} validation={depositValidation} button={"Max"} 
                                onClick={()=>getMaxAmount(true)} validationCollapse={true}/>
                                {props.market?.backstop.allowance?.gt(BigNumber.from(0)) &&
                                props.market?.backstop.allowance?.gte(depositInput.trim() === "" || isNaN(+depositInput) ? BigNumber.from("0") 
                                : BigNumber.parseValue(depositInput)) 
                                ? (
                                    <MarketDialogButton disabled={depositInput==="" || depositValidation!="" || props.market?.backstopDepositSpinner}
                                        onClick={() => {   props.market ? props.handleBackstopDeposit(props.market?.underlying.symbol, depositInput) : null}}>
                                        {props.market.backstopDepositSpinner ? (<Spinner size={"20px"}/>) : "Deposit"}
                                    </MarketDialogButton>
                                ) : (
                                    <MarketDialogButton disabled={!props.market || (props.market && props.market?.backstopDepositSpinner)}
                                        onClick={() => {props.market ? props.handleApproveBackstop(props.market?.underlying.symbol) : null}}>
                                        {props.market?.backstopDepositSpinner ? (<Spinner size={"20px"}/>) : `Approve ${props.market?.underlying.symbol}`}
                                    </MarketDialogButton>)}
                                <TextBox placeholder={`0 ${props.market.backstop.symbol}`} disabled={backstopWithdrawDisabled} value={backstopWithdrawInput} setInput={setBackstopWithdrawInput} validation={backstopWithdrawValidation} button={"Max"}
                                onClick={() => getMaxBackstopWithdraw()} validationCollapse={true}/>
                                <MarketDialogButton className="backstop-dialog-button" disabled={backstopWithdrawInput==="" || backstopWithdrawValidation!=="" || isNaN(+backstopWithdrawInput) || props.market?.backstopWithdrawSpinner || 
                                BigNumber.parseValue(backstopWithdrawInput).gt(props.market.backstop.userBalance)  ? true: false}
                                onClick={() => {    props.market ?
                                                    props.handleBackstopWithdraw(
                                                        props.market?.underlying.symbol,
                                                        backstopWithdrawInput
                                                    ) : null
                                                }}>
                                {props.market && props.market.backstopWithdrawSpinner ? (<Spinner size={"20px"}/>) : "Withdraw"}
                            </MarketDialogButton>
                            </TabContentItem>
                            : <></>
                        }
                        
                    </TabContent>
                </Tab>
            </div>
        </div>) : null
    )
}

export default SupplyMarketDialog