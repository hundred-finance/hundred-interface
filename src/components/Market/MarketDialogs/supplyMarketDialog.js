import BigNumber from "bignumber.js";
import React, {useRef, useEffect, useState} from "react"
import { Tab, TabContent, TabContentItem, TabHeader, TabHeaderItem } from "../../TabControl/tabControl";
import TextBox from "../../Textbox/textBox";
import BorrowLimitSection from "./borrowLimitSection";
import MarketDialogButton from "./marketDialogButton";
import DialogMarketInfoSection from "./marketInfoSection";
import "./supplyMarketDialog.css"
import SupplyRateSection from "./supplyRatesSection";
import MarketDialogItem from "./marketDialogItem";

const SupplyMarketDialog = (props) =>{
    const ref = useRef(null)
    const [supplyInput, setSupplyInput] = useState("")
    const [withdrawInput, setWithdrawInput] = useState("")
    const [supplyValidation, setSupplyValidation] = useState("")
    const [withdrawValidation, setWithdrawValidation] = useState("")
    const [tabChange, setTabChange] = useState(1)
    const [newBorrowLimit1, setNewBorrowLimit1] = useState();
    const [newBorrowLimit2, setNewBorrowLimit2] = useState();

    const CloseDialog = () =>{
        setSupplyInput("")
        setSupplyValidation("")
        setWithdrawValidation("")
        setTabChange(1)
        setNewBorrowLimit1("")
        setNewBorrowLimit2("")
        props.closeSupplyMarketDialog()
    }

    useEffect(()=>{
        const handleSupplyAmountChange = () => {
            if(supplyInput === ""){
                setSupplyValidation("")
                return;
            }

            if(isNaN(supplyInput)){
                setSupplyValidation("Amount must be a number");
            }else if (supplyInput <= 0) {
              setSupplyValidation("Amount must be > 0");
            } else if (supplyInput > +props.selectedMarketDetails.walletBalance) {
              setSupplyValidation("Amount must be <= balance");
            } else {
              setSupplyValidation("");
            }
      
            setNewBorrowLimit1(
              props.generalDetails.totalBorrowLimit?.plus(
                props.selectedMarketDetails.isEnterMarket
                  ? new BigNumber(supplyInput ? supplyInput : "0")
                      .times(props.selectedMarketDetails.underlyingPrice)
                      .times(props.selectedMarketDetails.collateralFactor)
                  : new BigNumber(0)
              )
            );
          };
        
          handleSupplyAmountChange()
          // eslint-disable-next-line
    }, [supplyInput])

    useEffect(()=>{
        const handleWithdrawAmountChange = () => {
            
            if(withdrawInput===""){
                setWithdrawValidation("")
                return;
            }
            if(isNaN(withdrawInput)){
                setWithdrawValidation("Amount must be a number")
            }else if (withdrawInput <= 0) {
                setWithdrawValidation("Amount must be > 0");
            } else if (withdrawInput > +props.selectedMarketDetails.supplyBalanceInTokenUnit) {
                setWithdrawValidation("Amount must be <= your supply balance");
            } else if (withdrawInput > +props.selectedMarketDetails.underlyingAmount) {
                setWithdrawValidation("Amount must be <= liquidity");
            } else {
                setWithdrawValidation("");
            }

            setNewBorrowLimit2(
                props.generalDetails.totalBorrowLimit?.minus(
                props.selectedMarketDetails.isEnterMarket
                    ? new BigNumber(withdrawInput ? withdrawInput : "0")
                        .times(props.selectedMarketDetails.underlyingPrice)
                        .times(props.selectedMarketDetails.collateralFactor)
                : new BigNumber(0)
            ));
        };
        
          handleWithdrawAmountChange()
          // eslint-disable-next-line
    }, [withdrawInput])

    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        
        const CloseDialog = () =>{
            setSupplyInput("")
            setSupplyValidation("")
            setWithdrawValidation("")
            setTabChange(1)
            setNewBorrowLimit1("")
            setNewBorrowLimit2("")
            props.closeSupplyMarketDialog()
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

    

    const getMaxAmount = () => {
        var amount = props.getMaxAmount(props.selectedMarketDetails.symbol, props.selectedMarketDetails.walletBalance).toString()
        setSupplyInput(amount)
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
                        <TabHeaderItem tabId={1} title="Supply" tabChange = {tabChange} setTabChange = {setTabChange}/>
                        <TabHeaderItem tabId={2} title="Withdraw" tabChange = {tabChange} setTabChange = {setTabChange}/>
                    </TabHeader>
                    <TabContent>
                        <TabContentItem open={props.open} tabId={1} tabChange={tabChange}>
                            <TextBox placeholder={props.selectedMarketDetails.symbol} value={supplyInput} setInput={setSupplyInput} validation={supplyValidation} button={"MAX"} 
                                onClick={()=>getMaxAmount()}/>
                            <SupplyRateSection selectedMarketDetails={props.selectedMarketDetails}/>
                            <BorrowLimitSection generalDetails={props.generalDetails} newBorrowLimit={newBorrowLimit1}/>
                            <DialogMarketInfoSection generalDetails={props.generalDetails} selectedMarketDetails={props.selectedMarketDetails} collateralFactorText={"Loan-to-Value"}/>
                           
                            {props.selectedMarketDetails.underlyingAllowance?.isGreaterThan(0) &&
                                props.selectedMarketDetails.underlyingAllowance?.isGreaterThanOrEqualTo(+supplyInput) 
                                ? (
                                    <MarketDialogButton disabled={!supplyInput || supplyValidation}
                                        onClick={() => {    props.handleSupply(
                                                                props.selectedMarketDetails.underlyingAddress,
                                                                props.selectedMarketDetails.pTokenAddress,
                                                                supplyInput,
                                                                props.selectedMarketDetails.decimals,
                                                                props.selectedMarketDetails.symbol
                                                            );
                                                        }}>
                                        Supply
                                    </MarketDialogButton>
                                ) : (
                                    <MarketDialogButton
                                        onClick={() => {props.handleEnable(
                                                            props.selectedMarketDetails.underlyingAddress,
                                                            props.selectedMarketDetails.pTokenAddress,
                                                            props.selectedMarketDetails.symbol
                                                        );
                                                }}>
                                        Access To Wallet
                                    </MarketDialogButton>)}

                            <MarketDialogItem title={"Wallet Ballance"} 
                                value={`${props.selectedMarketDetails.walletBalance?.decimalPlaces(4).toString()} ${props.selectedMarketDetails.symbol}`}/>
                        </TabContentItem>
                        <TabContentItem open={props.open} tabId={2} tabChange={tabChange}>
                            <TextBox placeholder={props.selectedMarketDetails.symbol} value={withdrawInput} setInput={setWithdrawInput} validation={withdrawValidation}/>
                            <SupplyRateSection selectedMarketDetails={props.selectedMarketDetails}/>
                            <BorrowLimitSection generalDetails={props.generalDetails} newBorrowLimit={newBorrowLimit2}/>
                            <DialogMarketInfoSection generalDetails={props.generalDetails} selectedMarketDetails={props.selectedMarketDetails} collateralFactorText={"Loan-to-Value"}/>
                            <MarketDialogButton disabled={!withdrawInput || withdrawValidation}
                                onClick={() => {    props.handleWithdraw(
                                                        props.selectedMarketDetails.underlyingAddress,
                                                        props.selectedMarketDetails.pTokenAddress,
                                                        withdrawInput,
                                                        props.selectedMarketDetails.decimals,
                                                        props.selectedMarketDetails.symbol
                                                    );
                                                }}>
                                Withdraw
                            </MarketDialogButton>
                            <MarketDialogItem title={"You Supplied"} value={`${props.selectedMarketDetails.supplyBalanceInTokenUnit?.decimalPlaces(4)} ${props.selectedMarketDetails.symbol}`}/>
                        </TabContentItem>
                    </TabContent>
                </Tab>
            </div>
        </div>
    )
}

export default SupplyMarketDialog