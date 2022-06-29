import React, {useRef, useEffect, useState} from "react"
// import { Tab, TabContent, TabContentItem, TabHeader, TabHeaderItem } from "../../TabControl/tabControl";
// import TextBox from "../../Textbox/textBox";
// import MarketDialogButton from "./marketDialogButton";
// import DialogMarketInfoSection from "./marketInfoSection";
// import "./supplyMarketDialog.cBorrowMarketDialogss"
// import MarketDialogItem from "./marketDialogItem";
// import BorrowRateSection from "./borrowRateSection";
// import BorrowLimitSection2 from "./borrowLimitSection2";
// import { Spinner } from "../../../assets/huIcons/huIcons";
// import { CTokenInfo } from "../../../Classes/cTokenClass";
// import { BigNumber } from "../../../bigNumber";
// import { GeneralDetailsData } from "../../../Classes/generalDetailsClass"
// import closeIcon from "../../../assets/icons/closeIcon.png"
// import ReactToolTip from 'react-tooltip'



// interface Props{
//     closeBorrowMarketDialog : () => void,
//     market: CTokenInfo | null,
//     generalData: GeneralDetailsData | undefined,
//     spinnerVisible: boolean,
//     open: boolean,
//     completed: boolean,
//     getMaxAmount: (market: CTokenInfo, func?: string) => Promise<BigNumber>,
//     getMaxRepayAmount: (market: CTokenInfo) => Promise<BigNumber>,
//     handleBorrow: (symbol: string, amount: string) => Promise<void>,
//     handleRepay: (symbol: string, amount: string, fullRepay: boolean) => Promise<void>,
//     handleEnable: (symbol: string, borrowDialog: boolean) => Promise<void>
// }
// const BorrowMarketDialog: React.FC<Props> = (props : Props) =>{
//     const ref = useRef<HTMLDivElement | null>(null)
//     const [borrowInput, setBorrowInput] = useState<string>("")
//     const [borrowDisabled, setBorrowDisabled] = useState<boolean>(false)
//     const [repayInput, setRepayInput] = useState<string>("")
//     const [repayDisabled, setRepayDisabled] = useState<boolean>(false)
//     const [borrowValidation, setBorrowValidation] = useState<string>("")
//     const [repayValidation, setRepayValidation] = useState<string>("")
//     const [tabChange, setTabChange] = useState<number>(1)
//     const [isFullRepay, setIsFullRepay] = useState<boolean>(false);

//     const CloseDialog = () : void =>{
//         setBorrowInput("")
//         setRepayInput("")
//         setBorrowValidation("")
//         setRepayValidation("")
//         setIsFullRepay(false)
//         setTabChange(1)
//         props.closeBorrowMarketDialog()
//     }

//     useEffect(()=>{
//         const handleBorrowAmountChange = () => {
//             if(borrowInput === ""){
//                 setBorrowValidation("")
//                 return;
//             }
//             let pValue = BigNumber.from("0")
//             if (props.generalData && props.market) {
//                 const value = +props.generalData.totalBorrowBalance.toString() + +BigNumber.parseValue(borrowInput).toString() * +props.market?.underlying.price.toString()
//                 pValue = BigNumber.parseValue((+props.generalData.totalBorrowLimit.toString() > 0 ? +value / +props.generalData.totalBorrowLimit.toString() * 100 : 0).toFixed(18))
//             }

//             if(isNaN(+borrowInput)){
//                 setBorrowValidation("Amount must be a number");
//             }else if (+borrowInput <= 0) {
//               setBorrowValidation("Amount must be > 0");
//             } else if (+pValue.toRound(2) >= 90.01) {
//               setBorrowValidation("Amount must be <= 90% borrow limit");
//             }else if (props.market && +BigNumber.parseValue(borrowInput).toString() > +props.market?.cash.toString()) {
//                 setBorrowValidation("Amount must be <= liquidity");
//             } else {
//               setBorrowValidation("");
//             }
//         };
        
//           handleBorrowAmountChange()
//           // eslint-disable-next-line
//     }, [borrowInput])

//     useEffect(()=>{
//         const handleRepayAmountChange = () => {
//             if(repayInput ===""){
//                 setRepayValidation("")
//                 return
//             }
//             if(isNaN(+repayInput)){
//                 setRepayValidation("Amount must be a number")
//             }
//             else if (+repayInput <= 0) {
//                 setRepayValidation("Amount must be > 0");
//             } else if (!isFullRepay && props.market && BigNumber.parseValue(repayInput).gt(props.market?.borrowBalanceInTokenUnit)) {
//                 setRepayValidation("Amount must be <= your borrow balance");
//               } else if (props.market && BigNumber.parseValue(repayInput).gt(props.market?.underlying.walletBalance)) {
//                 setRepayValidation("Amount must be <= balance");
//               } else if (props.market && +props.market?.underlying.allowance.toString() < +repayInput){
//                 const approve = BigNumber.parseValue((+repayInput - +props.market?.underlying.allowance.toString()).noExponents()).toRound(4)
//                 setRepayValidation(`You must approve ${approve} ${props.market.underlying.symbol} more.`)
//               }
//                else {
//                 setRepayValidation("");
//               }
//         };
//         handleRepayAmountChange()
//           // eslint-disable-next-line
//     }, [repayInput])

//     useEffect(() => {
//         /**
//          * Alert if clicked on outside of element
//          */
        
//         const CloseDialog = () : void =>{
//             if(props.spinnerVisible)
//                 return
//             setBorrowInput("")
//             setRepayInput("")
//             setBorrowValidation("")
//             setRepayValidation("")
//             setIsFullRepay(false)
//             setTabChange(1)
//             props.closeBorrowMarketDialog()
//         }

//         if(props.open){
//             document.getElementsByTagName("body")[0].style.overflow = 'hidden'
//         }
//         else{
//             document.getElementsByTagName("body")[0].style.overflow = 'auto'
//             CloseDialog()
//         }

//         function handleClickOutside(event : any) : void {
//             if (ref && ref.current && !ref.current.contains(event.target)) {
//                 CloseDialog()
//             }
//         }

//         // Bind the event listener
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => {
//             // Unbind the event listener on clean up
//             document.removeEventListener("mousedown", handleClickOutside);
//         };
//     }, [ref, props.open]);

//     useEffect(()=>{
//         if(props.market){
//             if(!props.market.borrowSpinner){
//                 if (props.completed) setBorrowInput("")
//                 setBorrowDisabled(false)
//             }
//             else{
//                 setBorrowDisabled(true)
//             }
//         }
//     }, [props.market?.borrowSpinner])

//     useEffect(()=>{
//         if(props.market){
//             if(!props.market.repaySpinner){
//                 if(props.completed) setRepayInput("")
//                 setRepayDisabled(false)
//             }
//             else{
//                 setRepayDisabled(true)
//             }
//         }
        
//     }, [props.market?.repaySpinner])

//     const handleMaxRepay = async () => {
//         const maxAffordable = props.market ? await props.getMaxAmount(
//             props.market, "repay") : BigNumber.from("0")

//         const fullRepayAmount = props.market ? await props.getMaxRepayAmount(
//             props.market) : BigNumber.from("0")

        
            
//         const isFull = maxAffordable.gteSafe(fullRepayAmount)
//         setIsFullRepay(isFull);
          
//         setRepayInput( BigNumber.minimum(
//               maxAffordable,
//               fullRepayAmount
//         ).toString()) 
//     }

//     const handleMaxBorrow = async () => {
//         if(props.generalData && props.market){
//             const balance = (+props.generalData.totalBorrowLimit.toString() - +props.generalData.totalBorrowBalance.toString()) / +props.market.underlying.price.toString() / 2
//             const amount = +props.market.cash.toString() / 2
//             let borrow = 0
//             if (balance > amount)
//                 borrow = amount
//             else
//                 borrow = balance
            
//             let pValue = BigNumber.from("0")
//             if (props.generalData && props.market) {
//                     const value = +props.generalData.totalBorrowBalance.toString() + +BigNumber.parseValue(borrow.toString()).toString() * +props.market?.underlying.price.toString()
//                     pValue = BigNumber.parseValue((+props.generalData.totalBorrowLimit.toString() > 0 ? +value / +props.generalData.totalBorrowLimit.toString() * 100 : 0).toFixed(18))
//                 if(+pValue.toRound(2) >= 50.01){
//                      borrow  = (0.5 * +props.generalData.totalBorrowLimit.toString() - +props.generalData.totalBorrowBalance.toString()) / +props.market?.underlying.price.toString()

//                 }
//             }
//             setBorrowInput(BigNumber.parseValue(borrow.toFixed(props.market.underlying.decimals)).toString())
//         }
//         else setBorrowInput("0")
//         // const balance = props.generalData && props.market ? 
//         //         (props.generalData?.totalBorrowLimit?.sub(props.generalData?.totalBorrowBalance)).div(props.market?.underlyingPrice) : BigNumber.from("0") //new BigNumber(props.generalData?.totalBorrowLimit.minus(props.generalData?.totalBorrowBalance)).div(props.market?.underlyingPrice).div(2).decimalPlaces(18)
//         // if(props.market && balance.gt(props.market?.underlyingAmount))
//         //     setBorrowInput(props.market?.underlyingAmount.toString())
//         // else
//         // setBorrowInput(balance.toString())
//     }

//     return (
//         props.open ? (
//             <div className={`dialog ${props.open ? "open-dialog" : ""}`}>
//                 <ReactToolTip id="borrow-dialog-tooltip" effect="solid"/>
//                 <div ref={ref} className="supply-box">
//                     <img src={closeIcon} alt="Close Icon" className="dialog-close" onClick={()=>CloseDialog()} />  
//                     <div className="dialog-title">
//                         {props.market?.underlying.symbol && (
//                         <img
//                             className="rounded-circle"
//                             style={{ width: "30px", margin: "0px 10px 0px 0px" }}
//                             src={props.market?.underlying.logo}
//                             alt=""/>)}
//                         {`${props.market?.underlying.symbol}`}
//                     </div>
//                     <Tab>
//                         <TabHeader tabChange = {tabChange}>
//                             <TabHeaderItem tabId={1} title="Borrow" tabChange = {tabChange} setTabChange = {setTabChange}/>
//                             <TabHeaderItem tabId={2} title="Repay" tabChange = {tabChange} setTabChange = {setTabChange}/>
//                         </TabHeader>
//                         <TabContent>
//                             <TabContentItem open={props.open} tabId={1} tabChange={tabChange}>
//                                 <TextBox placeholder={`0 ${props.market?.underlying.symbol}`} disabled={borrowDisabled || (props.market ? props.market.borrowPaused : false)} value={borrowInput} setInput={setBorrowInput} validation={borrowValidation} button={"Safe Max"}
//                                 buttonTooltip="50% of borrow limit" buttonDisabled={props.generalData && +props.generalData?.totalBorrowLimitUsedPercent.toRound(2) >= 50.01 ? true : false} onClick={ () => handleMaxBorrow()}/>
//                                 <MarketDialogItem title={"You Borrowed"} value={`${props.market?.borrowBalanceInTokenUnit?.toRound(4, true)} ${props.market?.underlying.symbol}`}/>
//                                 <BorrowRateSection market={props.market}/>
//                                 <BorrowLimitSection2 generalData={props.generalData} market = {props.market}
//                                     borrowAmount={borrowInput} repayAmount={"0"}/>
//                                 <DialogMarketInfoSection market={props.market}/>
//                                 {props.market && props.market.borrowPaused ? 
//                                     <MarketDialogButton disabled={true} onClick={() => null}>
//                                         Borrow is Paused
//                                     </MarketDialogButton>
//                                     :<MarketDialogButton disabled={(!borrowInput || borrowValidation || props.market?.borrowSpinner) ? true : false}
//                                         onClick={() => {  props.market ? props.handleBorrow(
//                                                                 props.market?.underlying.symbol,
//                                                                 borrowInput
//                                                             ) : null
//                                                         }}>
//                                         {props.market?.borrowSpinner ? (<Spinner size={"20px"}/>) :"Borrow"}
//                                     </MarketDialogButton>
//                                 }
//                             </TabContentItem>
//                             <TabContentItem open={props.open} tabId={2} tabChange={tabChange}>
//                                 <TextBox placeholder={`0 ${props.market?.underlying.symbol}`} disabled={repayDisabled} value={repayInput} setInput={setRepayInput} validation={repayValidation} button={"Max"}
//                                  onClick={ ()=> handleMaxRepay()} onChange={()=>setIsFullRepay(false)}/>
//                                  <MarketDialogItem title={"Wallet Ballance"} value={`${props.market?.underlying.walletBalance?.toRound(4, true)} ${props.market?.underlying.symbol}`}/>
//                                 <BorrowRateSection market={props.market}/>
//                                 <BorrowLimitSection2 generalData={props.generalData} market = {props.market}
//                                     borrowAmount={"0"} repayAmount={repayInput}/>
//                                 <DialogMarketInfoSection market={props.market} />
    
//                                     {props.market && props.market?.underlying.allowance?.gt(BigNumber.from("0")) &&
//                                     +props.market.underlying.allowance.toString() >= (repayInput.trim() === "" || isNaN(+repayInput) || isNaN(parseFloat(repayInput)) ? 0 : +repayInput)
//                                     ? 
//                                      (
//                                         <MarketDialogButton disabled={(!repayInput || repayValidation || props.market?.repaySpinner) ? true : false}
//                                             onClick={() => {props.market ? props.handleRepay(
//                                                         props.market?.underlying.symbol,
//                                                         repayInput,
//                                                         isFullRepay) : null}}>
//                                             {props.market?.repaySpinner? (<Spinner size={"20px"}/>) : "Repay"}
//                                         </MarketDialogButton>
//                                     ) : (
//                                         <MarketDialogButton disabled={(props.market && props.market?.repaySpinner) ? true : false} onClick={() => {props.market ? props.handleEnable(
//                                                                                 props.market?.underlying.symbol, true) : null}}>
//                                             {props.market?.repaySpinner ? (<Spinner size={"20px"}/>) : `Approve ${props.market?.underlying.symbol}`}
//                                         </MarketDialogButton>)}
//                             </TabContentItem>
//                         </TabContent>
//                     </Tab>
//                 </div>
//             </div>) : null
//     )
// }

// export default BorrowMarketDialog