import BigNumber from "bignumber.js";
import React, {useRef, useEffect, useState} from "react"
import { Tab, TabContent, TabContentItem, TabHeader, TabHeaderItem } from "../../TabControl/tabControl";
import TextBox from "../../Textbox/textBox";
import MarketDialogButton from "./marketDialogButton";
import DialogMarketInfoSection from "./marketInfoSection";
import "./supplyMarketDialog.css"
import MarketDialogItem from "./marketDialogItem";
import BorrowRateSection from "./borrowRateSection";
import BorrowLimitSection2 from "./borrowLimitSection2";
import { Spinner } from "../../../assets/huIcons/huIcons";

const BorrowMarketDialog = (props) =>{
    const ref = useRef(null)
    const [borrowInput, setBorrowInput] = useState("")
    const [repayInput, setRepayInput] = useState("")
    const [borrowValidation, setBorrowValidation] = useState("")
    const [repayValidation, setRepayValidation] = useState("")
    const [tabChange, setTabChange] = useState(1)
    const [isFullRepay, setIsFullRepay] = useState(false);

    const CloseDialog = () =>{
        setBorrowInput("")
        setRepayInput("")
        setBorrowValidation("")
        setRepayValidation("")
        setIsFullRepay(false)
        setTabChange(1)
        props.closeBorrowMarketDialog()
    }

    useEffect(()=>{
        const handleBorrowAmountChange = () => {
            if(borrowInput === ""){
                setBorrowValidation("")
                return;
            }

            if(isNaN(borrowInput)){
                setBorrowValidation("Amount must be a number");
            }else if (borrowInput <= 0) {
              setBorrowValidation("Amount must be > 0");
            } else if (borrowInput * +props.market?.underlyingPrice >
                +props.generalData.totalBorrowLimit) {
              setBorrowValidation("Amount must be <= borrow limit");
            }else if (borrowInput > +props.market?.underlyingAmount) {
                setBorrowValidation("Amount must be <= liquidity");
            } else {
              setBorrowValidation("");
            }
        };
        
          handleBorrowAmountChange()
          // eslint-disable-next-line
    }, [borrowInput])

    useEffect(()=>{
        const handleRepayAmountChange = () => {
            if(repayInput===""){
                setRepayValidation("")
                return;
            }
            if(isNaN(repayInput)){
                setRepayValidation("Amount must be a number")
            }else if (repayInput <= 0) {
                setRepayValidation("Amount must be > 0");
            } else if (!isFullRepay &&
                repayInput > +props.market?.borrowBalanceInTokenUnit) {
                setRepayValidation("Amount must be <= your borrow balance");
              } else if (repayInput > +props.market?.walletBalance) {
                setRepayValidation("Amount must be <= balance");
              } else {
                setRepayValidation("");
              }
        };
        
        handleRepayAmountChange()
          // eslint-disable-next-line
    }, [repayInput])

    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        
        const CloseDialog = () =>{
            if(props.spinnerVisible)
                return
            setBorrowInput("")
            setRepayInput("")
            setBorrowValidation("")
            setRepayValidation("")
            setIsFullRepay(false)
            setTabChange(1)
            props.closeBorrowMarketDialog()
        }

        if(props.open){
            document.getElementsByTagName("body")[0].style.overflow = 'hidden'
        }
        else{
            document.getElementsByTagName("body")[0].style.overflow = 'auto'
        }

        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                CloseDialog()
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, props]);

    const handleMaxRepay = async () => {
        const maxAffordable = await props.getMaxAmount(
            props.market
          );
          const fullRepayAmount = props.getMaxRepayAmount(
            props.market
          )
          const isFull = maxAffordable.gte(fullRepayAmount);
          setIsFullRepay(isFull);
          setRepayInput( BigNumber.minimum(
              maxAffordable,
              fullRepayAmount
            ).toString());
    }

    const handleMaxBorrow = async () => {
        var balance = new BigNumber(props.generalData?.totalBorrowLimit.minus(props.generalData?.totalBorrowBalance)).div(props.market?.underlyingPrice).div(2).decimalPlaces(18)
        if(balance.isGreaterThan(props.market?.underlyingAmount))
            setBorrowInput(props.market?.underlyingAmount)
        else
        setBorrowInput(balance.toString())
    }

    return (
        props.open ? (
        <div className={`dialog ${props.open ? "open-dialog" : ""}`}>
            <div ref={ref} className="supply-box">
                <button className="dialog-close" onClick={()=>CloseDialog()}>

                </button>
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
                        <TabHeaderItem tabId={1} title="Borrow" tabChange = {tabChange} setTabChange = {setTabChange}/>
                        <TabHeaderItem tabId={2} title="Repay" tabChange = {tabChange} setTabChange = {setTabChange}/>
                    </TabHeader>
                    <TabContent>
                        <TabContentItem open={props.open} tabId={1} tabChange={tabChange}>
                            <TextBox placeholder={`0 ${props.market?.symbol}`} value={borrowInput} setInput={setBorrowInput} validation={borrowValidation} button={"MAX"}
                            onClick={ () => handleMaxBorrow()}/>
                            <BorrowRateSection market={props.market} darkMode={props.darkMode}/>
                            <BorrowLimitSection2 generalData={props.generalData} market = {props.market}
                                borrowAmount={borrowInput} repayAmount={0} validation={borrowValidation}/>
                            <DialogMarketInfoSection generalData={props.generalData} market={props.market}
                                collateralFactorText={"Liquidation Threshold"}/>
                            <MarketDialogButton disabled={!borrowInput || borrowValidation || props.market?.borrowSpinner}
                                onClick={() => {    props.handleBorrow(
                                                        props.market?.symbol,
                                                        borrowInput
                                                    );
                                                }}>
                                {props.market?.borrowSpinner ? (<Spinner size={"20px"}/>) :"Borrow"}
                            </MarketDialogButton>
                            <MarketDialogItem title={"You Borrowed"} value={`${props.market?.borrowBalanceInTokenUnit?.decimalPlaces(4)} ${props.market?.symbol}`}/>
                        </TabContentItem>
                        <TabContentItem open={props.open} tabId={2} tabChange={tabChange}>
                            <TextBox placeholder={`0 ${props.market?.symbol}`} value={repayInput} setInput={setRepayInput} validation={repayValidation} button={"MAX"}
                             onClick={ ()=> handleMaxRepay()} onChange={()=>setIsFullRepay(false)}/>
                            <BorrowRateSection market={props.market} darkMode={props.darkMode}/>
                            <BorrowLimitSection2 generalData={props.generalData} market = {props.market}
                                borrowAmount={0} repayAmount={repayInput} validation={repayValidation}/>
                            <DialogMarketInfoSection generalData={props.generalData} market={props.market}
                                collateralFactorText={"Liquidation Threshold"}/>

                                {props.market?.underlyingAllowance?.isGreaterThan(0) &&
                                 props.market?.underlyingAllowance?.isGreaterThanOrEqualTo(+repayInput) ? 
                                 (
                                    <MarketDialogButton disabled={!repayInput || repayValidation || props.market?.repaySpinner}
                                        onClick={() => {props.handleRepay(
                                                    props.market?.symbol,
                                                    repayInput,
                                                    isFullRepay,
                                                );}}>
                                        {props.market?.repaySpinner? (<Spinner size={"20px"}/>) : "Repay"}
                                    </MarketDialogButton>
                                ) : (
                                    <MarketDialogButton disabled={props.market?.repaySpinner} onClick={() => { props.handleEnable(
                                                                            props.market?.symbol,
                                                                            true)}}>
                                        {props.market?.repaySpinner ? (<Spinner size={"20px"}/>) : `Approve ${props.market?.symbol}`}
                                    </MarketDialogButton>)}
                            
                                    <MarketDialogItem title={"Wallet Ballance"} 
                                value={`${props.market?.walletBalance?.decimalPlaces(4).toString()} ${props.market?.symbol}`}/>
                        </TabContentItem>
                    </TabContent>
                </Tab>
            </div>
        </div>) : null
    )
}

export default BorrowMarketDialog