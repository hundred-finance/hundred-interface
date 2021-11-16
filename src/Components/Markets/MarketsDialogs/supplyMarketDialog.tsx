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
    
}
const SupplyMarketDialog:React.FC<Props> = (props: Props) =>{
    
    const [supplyInput, setSupplyInput] = useState<string>("")
    const [supplyDisabled, setSupplyDisabled] = useState<boolean>(false)
    const [withdrawInput, setWithdrawInput] = useState<string>("")
    const [withdrawDisabled, setWithdrawDisabled] = useState<boolean>(false)
    const [supplyValidation, setSupplyValidation] = useState<string>("")
    const [withdrawValidation, setWithdrawValidation] = useState<string>("")
    const [tabChange, setTabChange] = useState<number>(1)
    const [newBorrowLimit1, setNewBorrowLimit1] = useState<BigNumber>(BigNumber.from(0))
    const [newBorrowLimit2, setNewBorrowLimit2] = useState<BigNumber>(BigNumber.from(0))
    const [withdrawMax, setWithdrawMax] = useState<boolean>(false)

    const CloseDialog = () =>{
        if(props.spinnerVisible)
            return
        setSupplyInput("")
        setWithdrawInput("")
        setSupplyValidation("")
        setWithdrawValidation("")
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
            } else if (props.market && +supplyInput > +props.market?.walletBalance) {
              setSupplyValidation("Amount must be <= balance");
            }else{
                setSupplyValidation("");
            }

            setNewBorrowLimit1( props.generalData && props.market ?
              props?.generalData.totalBorrowLimit?.addSafe(props.market?.isEnterMarket ? BigNumber.parseValue(supplyInput!=="" ? supplyInput : "0").
                mulSafe(props.market?.underlyingPrice).mulSafe(props.market?.collateralFactor): BigNumber.from(0)) : BigNumber.from(0));
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
            } else if (props.market && +withdrawInput > +props.market?.underlyingAmount) {
                setWithdrawValidation("Amount must be <= liquidity")
            }else{
                setWithdrawValidation("");
                if(withdrawMax && props.market){
                    if(BigNumber.parseValueSafe(props.market?.supplyBalanceInTokenUnit.toString(), props.market?.decimals).toString() !==  withdrawInput.toString())
                    {
                        setWithdrawMax(false)
                    }
                }
            }

            setNewBorrowLimit2(props.market && props.generalData ? 
                props.generalData.totalBorrowLimit?.subSafe(props.market?.isEnterMarket? BigNumber.parseValue(withdrawInput.trim()!=="" ? withdrawInput : "0").
                                mulSafe(props.market?.underlyingPrice).mulSafe(props.market?.collateralFactor): BigNumber.from(0)) : BigNumber.from(0))
            
                                if (newBorrowLimit2.gt(BigNumber.from("0"))) 
                                console.log(`totalBorrow: ${props.generalData?.totalBorrowBalance}\nborrowLimit: ${newBorrowLimit2}\npercent${props.generalData?.totalBorrowBalance.divSafe(newBorrowLimit2).toString()}`)
            }

        
          handleWithdrawAmountChange()

          // eslint-disable-next-line
    }, [withdrawInput])

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
              mulSafe(props.market?.underlyingPrice).mulSafe(props.market?.collateralFactor): BigNumber.from(0)) : BigNumber.from(0));
          
        setNewBorrowLimit2(props.market && props.generalData ? props.generalData.totalBorrowLimit?.
            subSafe(props.market?.isEnterMarket? BigNumber.parseValue(withdrawInput!=="" ? withdrawInput : "0").
            mulSafe(props.market?.underlyingPrice).mulSafe(props.market?.collateralFactor): BigNumber.from(0)) : BigNumber.from(0));
    },[props.generalData])
    

    const getMaxAmount = async () : Promise<void> => {
        const amount = props.market ? await props.getMaxAmount(props.market, "supply") : 0
        
        setSupplyInput(amount.toString())
    }

    const getMaxWithdraw = () : void=> {
        setWithdrawMax(true)
        props.market ? setWithdrawInput(BigNumber.minimum(BigNumber.parseValueSafe(props.market?.supplyBalanceInTokenUnit.toString(), props.market.decimals),
         BigNumber.parseValueSafe(props.market?.underlyingAmount.toString(), props.market.decimals)).toString()) : setWithdrawInput("0")
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

    return (
        props.open ? (
        <div className={`dialog ${props.open ? "open-dialog" : ""}`}>
            <div className="dialog-background" onClick = {() => CloseDialog()}></div>
            <div className="supply-box">
            <img src={closeIcon} alt="Close Icon" className="dialog-close" onClick={()=>CloseDialog()} />  
                <div className="dialog-title">
                    {props.market?.symbol && (
                    <img
                        className="rounded-circle"
                        style={{ width: "30px", margin: "0px 10px 0px 0px" }}
                        src={props.market?.logoSource}
                        alt=""/>)}
                    {`${props.market?.symbol}`}
                </div>
                <Tab>
                    <TabHeader tabChange = {tabChange}>
                        <TabHeaderItem tabId={1} title="Supply" tabChange = {tabChange} setTabChange = {setTabChange}/>
                        <TabHeaderItem tabId={2} title="Withdraw" tabChange = {tabChange} setTabChange = {setTabChange}/>
                    </TabHeader>
                    <TabContent>
                        <TabContentItem open={props.open} tabId={1} tabChange={tabChange}>
                            <TextBox placeholder={`0 ${props.market?.symbol}`} disabled={supplyDisabled} value={supplyInput} setInput={setSupplyInput} validation={supplyValidation} button={"Max"} 
                                onClick={()=>getMaxAmount()}/>
                            <MarketDialogItem title={"Wallet Ballance"} value={`${props.market?.walletBalance?.toRound(4, true)} ${props.market?.symbol}`}/>
                            <SupplyRateSection darkMode={props.darkMode} market={props.market}/>
                            <BorrowLimitSection generalData={props.generalData} newBorrowLimit={newBorrowLimit1}/>
                            <DialogMarketInfoSection market={props.market} collateralFactorText={"Loan-to-Value"}/>
                           
                            {props.market?.underlyingAllowance?.gt(BigNumber.from(0)) &&
                                props.market?.underlyingAllowance?.gte(supplyInput.trim() === "" || isNaN(+supplyInput) || isNaN(parseFloat(supplyInput)) ? BigNumber.from("0") 
                                : BigNumber.parseValue(supplyInput)) 
                                ? (
                                    <MarketDialogButton disabled={supplyInput==="" || supplyValidation!="" || props.market?.supplySpinner}
                                        onClick={() => {   props.market ? props.handleSupply(props.market?.symbol,supplyInput) : null}}>
                                        {props.market.supplySpinner ? (<Spinner size={"20px"}/>) : "Supply"}
                                    </MarketDialogButton>
                                ) : (
                                    <MarketDialogButton disabled={!props.market || (props.market && props.market?.supplySpinner)}
                                        onClick={() => {props.market ? props.handleEnable(props.market?.symbol,false) : null}}>
                                        {props.market?.supplySpinner ? (<Spinner size={"20px"}/>) : `Approve ${props.market?.symbol}`}
                                    </MarketDialogButton>)}
                        </TabContentItem>
                        <TabContentItem open={props.open} tabId={2} tabChange={tabChange}>
                            <TextBox placeholder={`0 ${props.market?.symbol}`} disabled={withdrawDisabled} value={withdrawInput} setInput={setWithdrawInput} validation={withdrawValidation} button={"Max"}
                                onClick={() => getMaxWithdraw()}/>
                            <MarketDialogItem title={"You Supplied"} value={`${props.market?.supplyBalanceInTokenUnit?.toFixed(4)} ${props.market?.symbol}`}/>
                            <SupplyRateSection darkMode={props.darkMode} market={props.market}/>
                            <BorrowLimitSection generalData={props.generalData} newBorrowLimit={newBorrowLimit2}/>
                            <DialogMarketInfoSection market={props.market} collateralFactorText={"Loan-to-Value"}/>
                            <MarketDialogButton disabled={withdrawInput==="" || withdrawValidation!=="" || (newBorrowLimit2 && props.generalData && 
                            +newBorrowLimit2.toString() > 0 && 
                                        +props.generalData?.totalBorrowBalance.toString() / +newBorrowLimit2.toString() > 0.9 && +newBorrowLimit2.toString() > +props.generalData.totalBorrowLimit.toString() ? true: false)}
                                onClick={() => {    props.market ?
                                                    props.handleWithdraw(
                                                        props.market?.symbol,
                                                        withdrawInput,
                                                        withdrawMax
                                                    ) : null
                                                }}>
                                {props.market && props.market.withdrawSpinner ? (<Spinner size={"20px"}/>) : "Withdraw"}
                            </MarketDialogButton>
                        </TabContentItem>
                    </TabContent>
                </Tab>
            </div>
        </div>) : null
    )
}

export default SupplyMarketDialog