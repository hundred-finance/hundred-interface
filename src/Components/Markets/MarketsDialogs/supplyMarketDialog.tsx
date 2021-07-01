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
    handleSupply: (symbol: string, amount: string) => Promise<void>,
    handleEnable: (symbol: string, borrowDialog: boolean) => Promise<void>,
    handleWithdraw: (symbol: string, amount: string, max: boolean) => Promise<void>
    
}
const SupplyMarketDialog:React.FC<Props> = (props: Props) =>{
    
    const [supplyInput, setSupplyInput] = useState<string>("")
    const [withdrawInput, setWithdrawInput] = useState<string>("")
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
            if(supplyInput === ""){
                setSupplyValidation("")
                return;
            }

            if(isNaN(+supplyInput)){
                setSupplyValidation("Amount must be a number");
            }else if (+supplyInput <= 0) {
              setSupplyValidation("Amount must be > 0");
            } else if (props.market && +supplyInput > +props.market?.walletBalance) {
              setSupplyValidation("Amount must be <= balance");
            }else{
                setSupplyValidation("");
            }

            setNewBorrowLimit1( props.generalData && props.market ?
              props?.generalData.totalBorrowLimit?.add(props.market?.isEnterMarket ? BigNumber.parseValue(supplyInput!=="" ? supplyInput : "0").
                mul(props.market?.underlyingPrice).mul(props.market?.collateralFactor): BigNumber.from(0)) : BigNumber.from(0));
            }
        
          handleSupplyAmountChange()
          // eslint-disable-next-line
    }, [supplyInput])

    useEffect(()=>{
        const handleWithdrawAmountChange = () => {
            if(withdrawInput===""){
                setWithdrawValidation("")
                return
            }
            if(isNaN(+withdrawInput)){
                setWithdrawValidation("Amount must be a number")
            }else if (+withdrawInput <= 0) {
                setWithdrawValidation("Amount must be > 0")
            } else if (props.market && +withdrawInput > +props.market?.supplyBalanceInTokenUnit) {
                setWithdrawValidation("Amount must be <= your supply balance")
            } else if (props.market && +withdrawInput > +props.market?.underlyingAmount) {
                setWithdrawValidation("Amount must be <= liquidity")
            }else{
                setWithdrawValidation("");
                if(withdrawMax && props.market){
                    console.log(BigNumber.parseValueSafe(props.market?.supplyBalanceInTokenUnit.toString(), props.market?.decimals).toString())
                    if(BigNumber.parseValueSafe(props.market?.supplyBalanceInTokenUnit.toString(), props.market?.decimals).toString() !==  withdrawInput.toString())
                    {
                        setWithdrawMax(false)
                    }
                }
            }

            setNewBorrowLimit2(props.market && props.generalData ? props.generalData.totalBorrowLimit?.
                                sub(props.market?.isEnterMarket? BigNumber.parseValue(withdrawInput!=="" ? withdrawInput : "0").
                                mul(props.market?.underlyingPrice).mul(props.market?.collateralFactor): BigNumber.from(0)) : BigNumber.from(0));
        };
        
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

    

    const getMaxAmount = async () : Promise<void> => {
        const amount = props.market ? await props.getMaxAmount(props.market, "supply") : 0
        setSupplyInput(amount.toString())
    }

    const getMaxWithdraw = () : void=> {
        setWithdrawMax(true)
        props.market ? setWithdrawInput(BigNumber.minimum(BigNumber.parseValueSafe(props.market?.supplyBalanceInTokenUnit.toString(), props.market.decimals),
         BigNumber.parseValueSafe(props.market?.underlyingAmount.toString(), props.market.decimals)).toString()) : setWithdrawInput("0")
    }

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
                            <TextBox placeholder={`0 ${props.market?.symbol}`} value={supplyInput} setInput={setSupplyInput} validation={supplyValidation} button={"MAX"} 
                                onClick={()=>getMaxAmount()}/>
                            <SupplyRateSection darkMode={props.darkMode} market={props.market}/>
                            <BorrowLimitSection generalData={props.generalData} newBorrowLimit={newBorrowLimit1}/>
                            <DialogMarketInfoSection market={props.market} collateralFactorText={"Loan-to-Value"}/>
                           
                            {props.market?.underlyingAllowance?.gt(BigNumber.from(0)) &&
                                props.market?.underlyingAllowance?.gte(supplyInput === "" ? BigNumber.from("0") : BigNumber.parseValue(supplyInput)) 
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

                            <MarketDialogItem title={"Wallet Ballance"} 
                                value={`${props.market?.walletBalance?.toRound(4)} ${props.market?.symbol}`}/>
                        </TabContentItem>
                        <TabContentItem open={props.open} tabId={2} tabChange={tabChange}>
                            <TextBox placeholder={`0 ${props.market?.symbol}`} value={withdrawInput} setInput={setWithdrawInput} validation={withdrawValidation} button={"MAX"}
                                onClick={() => getMaxWithdraw()}/>
                            <SupplyRateSection darkMode={props.darkMode} market={props.market}/>
                            <BorrowLimitSection generalData={props.generalData} newBorrowLimit={newBorrowLimit2}/>
                            <DialogMarketInfoSection market={props.market} collateralFactorText={"Loan-to-Value"}/>
                            <MarketDialogButton disabled={withdrawInput==="" || withdrawValidation!==""}
                                onClick={() => {    props.market ?
                                                    props.handleWithdraw(
                                                        props.market?.symbol,
                                                        withdrawInput,
                                                        withdrawMax
                                                    ) : null
                                                }}>
                                {props.market && props.market.withdrawSpinner ? (<Spinner size={"20px"}/>) : "Withdraw"}
                            </MarketDialogButton>
                            <MarketDialogItem title={"You Supplied"} value={`${props.market?.supplyBalanceInTokenUnit?.toFixed(4)} ${props.market?.symbol}`}/>
                        </TabContentItem>
                    </TabContent>
                </Tab>
            </div>
        </div>) : null
    )
}

export default SupplyMarketDialog