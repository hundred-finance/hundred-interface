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
            } else if (borrowInput * +props.selectedMarketDetails.underlyingPrice >
                +props.generalDetails.totalBorrowLimit) {
              setBorrowValidation("Amount must be <= borrow limit");
            }else if (borrowInput > +props.selectedMarketDetails.underlyingAmount) {
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
                repayInput > +props.selectedMarketDetails.borrowBalanceInTokenUnit) {
                setRepayValidation("Amount must be <= your borrow balance");
              } else if (repayInput > +props.selectedMarketDetails.walletBalance) {
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

    const handleMaxRepay = () => {
        const maxAffortable = props.getMaxAmount(
            props.selectedMarketDetails.symbol,
            props.selectedMarketDetails.walletBalance
          );
          const fullRepayAmount = props.getMaxRepayAmount(
            props.selectedMarketDetails.symbol,
            props.selectedMarketDetails.borrowBalanceInTokenUnit,
            props.selectedMarketDetails.borrowApy
          );
          const isFull = maxAffortable.gte(fullRepayAmount);
          setIsFullRepay(isFull);
          setRepayInput( BigNumber.minimum(
              maxAffortable,
              fullRepayAmount
            ).toString());
    }

    return (
        <div className={`dialog ${props.open ? "open-dialog" : ""}`}>
            <div ref={ref} className="supply-box">
                <button className="dialog-close" onClick={()=>CloseDialog()}>

                </button>
                <div className="dialog-title">
                    {props.selectedMarketDetails.symbol && (
                    <img
                        className="rounded-circle"
                        style={{ width: "30px", margin: "0px 10px 0px 0px" }}
                        src={props.selectedMarketDetails.logoSource}
                        alt=""/>)}
                    {`${props.selectedMarketDetails.symbol}`}
                </div>
                <Tab>
                    <TabHeader tabChange = {tabChange}>
                        <TabHeaderItem tabId={1} title="Borrow" tabChange = {tabChange} setTabChange = {setTabChange}/>
                        <TabHeaderItem tabId={2} title="Repay" tabChange = {tabChange} setTabChange = {setTabChange}/>
                    </TabHeader>
                    <TabContent>
                        <TabContentItem open={props.open} tabId={1} tabChange={tabChange}>
                            <TextBox placeholder={props.selectedMarketDetails.symbol} value={borrowInput} setInput={setBorrowInput} validation={borrowValidation}/>
                            <BorrowRateSection selectedMarketDetails={props.selectedMarketDetails}/>
                            <BorrowLimitSection2 generalDetails={props.generalDetails} selectedMarketDetails = {props.selectedMarketDetails}
                                borrowAmount={borrowInput} repayAmount={0}/>
                            <DialogMarketInfoSection generalDetails={props.generalDetails} selectedMarketDetails={props.selectedMarketDetails}
                                collateralFactorText={"Liquidation Threshold"}/>
                            <MarketDialogButton disabled={!borrowInput || borrowValidation}
                                onClick={() => {    props.handleBorrow(
                                                        props.selectedMarketDetails.underlyingAddress,
                                                        props.selectedMarketDetails.pTokenAddress,
                                                        borrowInput,
                                                        props.selectedMarketDetails.decimals,
                                                        props.selectedMarketDetails.symbol
                                                    );
                                                }}>
                                Borrow
                            </MarketDialogButton>
                            <MarketDialogItem title={"You Borrowed"} value={`${props.selectedMarketDetails.borrowBalanceInTokenUnit?.decimalPlaces(4)} ${props.selectedMarketDetails.symbol}`}/>
                        </TabContentItem>
                        <TabContentItem open={props.open} tabId={2} tabChange={tabChange}>
                            <TextBox placeholder={props.selectedMarketDetails.symbol} value={repayInput} setInput={setRepayInput} validation={repayValidation} button={"MAX"}
                             onClick={()=>handleMaxRepay()} onChange={()=>setIsFullRepay(false)}/>
                            <BorrowRateSection selectedMarketDetails={props.selectedMarketDetails}/>
                            <BorrowLimitSection2 generalDetails={props.generalDetails} selectedMarketDetails = {props.selectedMarketDetails}
                                borrowAmount={0} repayAmount={repayInput}/>
                            <DialogMarketInfoSection generalDetails={props.generalDetails} selectedMarketDetails={props.selectedMarketDetails}
                                collateralFactorText={"Liquidation Threshold"}/>

                                {props.selectedMarketDetails.underlyingAllowance?.isGreaterThan(0) &&
                                 props.selectedMarketDetails.underlyingAllowance?.isGreaterThanOrEqualTo(+repayInput) ? 
                                 (
                                    <MarketDialogButton disabled={!repayInput || repayValidation}
                                        onClick={() => {props.handleRepay(
                                                    props.account,
                                                    props.selectedMarketDetails.underlyingAddress,
                                                    props.selectedMarketDetails.pTokenAddress,
                                                    repayInput,
                                                    isFullRepay,
                                                    props.selectedMarketDetails.decimals,
                                                    props.selectedMarketDetails.symbol
                                                );}}>
                                        Repay
                                    </MarketDialogButton>
                                ) : (
                                    <MarketDialogButton onClick={() => { props.handleEnable(
                                                                            props.selectedMarketDetails.underlyingAddress,
                                                                            props.selectedMarketDetails.pTokenAddress)}}>
                                        Access To Wallet
                                    </MarketDialogButton>)}
                            
                                    <MarketDialogItem title={"Wallet Ballance"} 
                                value={`${props.selectedMarketDetails.walletBalance?.decimalPlaces(4).toString()} ${props.selectedMarketDetails.symbol}`}/>
                        </TabContentItem>
                    </TabContent>
                </Tab>
            </div>
        </div>
    )
}

export default BorrowMarketDialog