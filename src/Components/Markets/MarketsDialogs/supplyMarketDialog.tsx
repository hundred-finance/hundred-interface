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
import {Spinner} from "../../../assets/huIcons/huIcons";
import { CTokenInfo } from "../../../Classes/cTokenClass";
import { GeneralDetailsData } from "../../../Classes/generalDetailsClass";
import closeIcon from "../../../assets/icons/closeIcon.png"
import {GaugeV4} from "../../../Classes/gaugeV4Class";
import ReactToolTip from 'react-tooltip'
import StakeMarketTab from "./stakeMarketTab";
import BackstopMarketTab from "./backstopMarketTab";
import DirectStakeMarketTab from "./directStakeMarketTab";
import DirectBackstopMarketTab from "./directBackstopMarketTab";

interface Props{
    spinnerVisible: boolean,
    closeSupplyMarketDialog: () => void,
    market: CTokenInfo | null,
    generalData: GeneralDetailsData | undefined,
    gaugeV4: GaugeV4 | null | undefined
    backstopGaugeV4: GaugeV4 | null | undefined
    open: boolean,
    getMaxAmount: (market: CTokenInfo, func?: string) => Promise<BigNumber>,
    completed: boolean,
    handleSupply: (symbol: string, amount: string) => Promise<void>,
    handleEnable: (symbol: string, borrowDialog: boolean) => Promise<void>,
    handleWithdraw: (symbol: string, amount: string, max: boolean) => Promise<void>
    handleStake: (symbol: string | undefined, guage: GaugeV4 | null | undefined, amount: string) => Promise<void>
    handleUnstake: (symbol: string | undefined, guage: GaugeV4 | null | undefined, amount: string) => Promise<void>
    handleMint: (symbol: string | undefined, guage: GaugeV4 | null | undefined) => Promise<void>
    handleClaimRewards: (symbol: string | undefined, guage: GaugeV4 | null | undefined) => Promise<void>

    handleApproveBackstop: (symbol: string) => Promise<void>
    handleBackstopDeposit: (symbol: string, amount: string) => Promise<void>
    handleBackstopWithdraw: (symbol: string, amount: string) => Promise<void>
    handleBackstopClaim: (symbol: string) => Promise<void>
    handleApproveStake: (symbol: string | undefined, guage: GaugeV4 | null | undefined) => Promise<void>
    handleApproveUnStake: (symbol: string | undefined, guage: GaugeV4 | null | undefined) => Promise<void>
}
const SupplyMarketDialog:React.FC<Props> = (props: Props) =>{
    const [supplyInput, setSupplyInput] = useState<string>("")
    const [supplyDisabled, setSupplyDisabled] = useState<boolean>(false)
    const [withdrawInput, setWithdrawInput] = useState<string>("")
    const [withdrawDisabled, setWithdrawDisabled] = useState<boolean>(false)
    const [depositInput, setDepositInput] = useState<string>("")
    const [depositDisabled, setDepositDisabled] = useState<boolean>(false)
    const [supplyValidation, setSupplyValidation] = useState<string>("")
    const [withdrawValidation, setWithdrawValidation] = useState<string>("")
    const [depositValidation, setDepositValidation] = useState<string>("")
    const [tabChange, setTabChange] = useState<number>(1)
    const [newBorrowLimit1, setNewBorrowLimit1] = useState<BigNumber>(BigNumber.from(0))
    const [newBorrowLimit2, setNewBorrowLimit2] = useState<BigNumber>(BigNumber.from(0))
    const [withdrawMax, setWithdrawMax] = useState<boolean>(false)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars

    const CloseDialog = () =>{
        if(props.spinnerVisible)
            return
        setSupplyInput("")
        setWithdrawInput("")
        setSupplyValidation("")
        setWithdrawValidation("")
        setDepositInput("")
        setSupplyValidation("")
        setWithdrawValidation("")
        setDepositValidation("")
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
            } else if (+supplyInput <= 0) {
              setSupplyValidation("Amount must be > 0");
            } else if (props.market && +supplyInput > +props.market?.underlying.walletBalance) {
              setSupplyValidation("Amount must be <= balance");
            }else if (props.market && +supplyInput > +props.market?.underlying.allowance.toString()){
              setSupplyValidation(`You must approve ${props.market.underlying.symbol} first.`);
            }
            else {
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
            } else if (props.market && +props.market?.supplyBalanceInTokenUnit.toString() <= 0) {
                setWithdrawValidation("No balance to withdraw")
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

    useEffect(() => {
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

    const getSafeMaxWithdraw = () : void=> {
        setWithdrawMax(true)
        if (props.market && props.generalData && +props.market.supplyBalanceInTokenUnit.toString() > 0)
        {
            const hTokenBalance = BigNumber.parseValueSafe(props.market?.supplyBalanceInTokenUnit.toString(), props.market?.underlying.decimals);
            const borrow = BigNumber.parseValueSafe(props.generalData.totalBorrowBalance.toString(),props.market.underlying.decimals) ;
            const supply = props.generalData.totalSupplyBalance;
            const cFactor = BigNumber.parseValueSafe(props.market.collateralFactor.toString(),props.market.underlying.decimals).mulSafe(BigNumber.parseValueSafe('0.5001', props.market.underlying.decimals));
            const percent = +cFactor.toString() === 0 ? 0 : +borrow.toString() / +cFactor.toString()
            const percentBN = BigNumber.parseValueSafe(percent.toString(), props.market.underlying.decimals);

            if (+props.generalData?.totalBorrowLimitUsedPercent.toRound(2) >= 50.01){
                setWithdrawInput(hTokenBalance.toString())
            } else {
                const safeWithdrawBalance = convertUSDToUnderlyingToken(supply.subSafe(percentBN).toString(), props.market );
                setWithdrawInput(BigNumber.minimum(safeWithdrawBalance, hTokenBalance).toString());
            }
        } else{ 
            setWithdrawInput("0");
        }
    }

    useEffect(() => {
        if(props.market){
            if(!props.market.supplySpinner){
                if(props.completed) setSupplyInput("")
                setSupplyValidation("")
                setSupplyDisabled(false)
            }
            else{
                setSupplyDisabled(true)
            }
        }
    }, [props.market?.supplySpinner,  props.completed])

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
    }, [props.market?.backstopDepositSpinner, props.completed])

    return (
        props.open ? (
        <div className={`dialog ${props.open ? "open-dialog" : ""}`}>
            <ReactToolTip id="borrow-dialog-tooltip" effect="solid"/>
            <div className="dialog-background" onClick = {() => CloseDialog()}></div>
            <div className={`supply-box ${props.market?.backstop && +props.market.backstop.pendingHundred.toString()>0 ? "supply-box-expand" : ""}`}>
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
                        {(props.market?.backstop || props.backstopGaugeV4?.generalData?.backstopGauge) && props.gaugeV4 ?
                            <TabHeader tabChange = {tabChange}>
                                <TabHeaderItem tabId={1} title="Supply" tabChange = {tabChange} setTabChange = {setTabChange}/>
                                <TabHeaderItem tabId={2} title="Stake" tabChange={tabChange} setTabChange={setTabChange}/>
                                <TabHeaderItem tabId={3} title="Backstop" tabChange = {tabChange} setTabChange = {setTabChange}/>
                                <TabHeaderItem tabId={4} title="Withdraw" tabChange = {tabChange} setTabChange = {setTabChange}/>
                            </TabHeader>
                            : props.market?.backstop || props.backstopGaugeV4?.generalData?.backstopGauge ?
                            <TabHeader tabChange = {tabChange}>
                                <TabHeaderItem tabId={1} title="Supply" tabChange = {tabChange} setTabChange = {setTabChange}/>
                                <TabHeaderItem tabId={2} title="Backstop" tabChange = {tabChange} setTabChange = {setTabChange}/>
                                <TabHeaderItem tabId={3} title="Withdraw" tabChange = {tabChange} setTabChange = {setTabChange}/>
                            </TabHeader>
                            :props.gaugeV4 ? 
                            <TabHeader tabChange = {tabChange}>
                                <TabHeaderItem tabId={1} title="Supply" tabChange = {tabChange} setTabChange = {setTabChange}/>
                                <TabHeaderItem tabId={2} title="Stake" tabChange={tabChange} setTabChange={setTabChange}/>
                                <TabHeaderItem tabId={3} title="Withdraw" tabChange = {tabChange} setTabChange = {setTabChange}/>
                            </TabHeader>
                            : <TabHeader tabChange = {tabChange}>
                                <TabHeaderItem tabId={1} title="Supply" tabChange = {tabChange} setTabChange = {setTabChange}/>
                                <TabHeaderItem tabId={2} title="Withdraw" tabChange = {tabChange} setTabChange = {setTabChange}/>
                        </TabHeader>
                            }
                    <TabContent>
                        <TabContentItem open={props.open} tabId={1} tabChange={tabChange}>
                            <TextBox placeholder={`0 ${props.market?.underlying.symbol}`} disabled={supplyDisabled || (props.market ? props.market?.mintPaused : false)} value={supplyInput} setInput={setSupplyInput} validation={supplyValidation} button={"Max"} 
                                onClick={()=>getMaxAmount()}/>
                            {props.gaugeV4 ? 
                                <div style={{textAlign:"left"}}>If you want to Stake, please go directly to that tab<br/>(there is no need to Supply first). </div>
                                : null
                            }   
                            <MarketDialogItem title={"Wallet Balance"} value={`${props.market?.underlying.walletBalance?.toRound(4, true)} ${props.market?.underlying.symbol}`}/>
                            <SupplyRateSection market={props.market} gaugeV4={props.gaugeV4} />
                            <BorrowLimitSection generalData={props.generalData} newBorrowLimit={newBorrowLimit1}/>
                            <DialogMarketInfoSection market={props.market} collateralFactorText={"Loan-to-Value"}/>
                           
                            {props.market && props.market.mintPaused ? 
                                <MarketDialogButton disabled={true} onClick={() => null}>
                                    Supply is Paused
                                </MarketDialogButton>
                            : props.market && +props.market.underlying.allowance.toString() > 0 &&
                                +props.market.underlying.allowance.toString() >= (supplyInput.trim() === "" || isNaN(+supplyInput) || isNaN(parseFloat(supplyInput)) ? 0 : +supplyInput)
                                ? 
                                    <MarketDialogButton disabled={supplyInput.trim()==="" || supplyValidation!="" || props.market?.supplySpinner}
                                        onClick={() => {   props.market ? props.handleSupply(props.market?.underlying.symbol, supplyInput) : null}}>
                                        {props.market.supplySpinner ? (<Spinner size={"20px"}/>) : "Supply"}
                                    </MarketDialogButton>
                                : 
                                    <MarketDialogButton disabled={!props.market || (props.market && props.market?.supplySpinner)}
                                        onClick={() => {props.market ? props.handleEnable(props.market?.underlying.symbol,false) : null}}>
                                        {props.market?.supplySpinner ? (<Spinner size={"20px"}/>) : `Approve ${props.market?.underlying.symbol}`}
                                    </MarketDialogButton>}
                        </TabContentItem>
                        {
                            props.gaugeV4 && props.market && props.generalData ?
                                <TabContentItem open={props.open} tabId={2} tabChange={tabChange}>
                                    {props.gaugeV4.generalData.gaugeHelper ?
                                        <DirectStakeMarketTab
                                            market={props.market}
                                            generalData={props.generalData}
                                            gaugeV4={props.gaugeV4}
                                            supplyInput={supplyInput}
                                            withdrawInput={withdrawInput}
                                            open={props.open}
                                            completed={props.completed}
                                            handleStake={props.handleStake}
                                            handleUnstake={props.handleUnstake}
                                            handleMint={props.handleMint}
                                            handleApproveStake={props.handleApproveStake}
                                            handleApproveUnStake={props.handleApproveUnStake}
                                            handleClaimRewards={props.handleClaimRewards}
                                        />
                                        :
                                        <StakeMarketTab
                                            market={props.market}
                                            generalData={props.generalData}
                                            gaugeV4={props.gaugeV4}
                                            supplyInput={supplyInput}
                                            withdrawInput={withdrawInput}
                                            open={props.open}
                                            completed={props.completed}
                                            handleStake={props.handleStake}
                                            handleUnstake={props.handleUnstake}
                                            handleMint={props.handleMint}
                                            handleApproveStake={props.handleApproveStake}
                                            handleClaimRewards={props.handleClaimRewards}
                                        />
                                    }
                                </TabContentItem>
                                : ''
                        }
                        {
                            props.market?.backstop ?
                            <TabContentItem open={props.open} tabId={props.gaugeV4 && props.market ? 3 : 2} tabChange={tabChange}>
                                    <BackstopMarketTab
                                        market={props.market}
                                        getMaxAmount={props.getMaxAmount}
                                        depositDisabled={depositDisabled}
                                        depositValidation={depositValidation}
                                        open={props.open}
                                        completed={props.completed}
                                        handleApproveBackstop={props.handleApproveBackstop}
                                        handleBackstopDeposit={props.handleBackstopDeposit}
                                        handleBackstopWithdraw={props.handleBackstopWithdraw}
                                        handleBackstopClaim={props.handleBackstopClaim}
                                    />
                            </TabContentItem>
                            :
                            ''
                        }
                        {
                            props.backstopGaugeV4 && props.generalData && props.market ?
                                <TabContentItem open={props.open} tabId={props.backstopGaugeV4 && props.market ? 3 : 2} tabChange={tabChange}>
                                    <DirectBackstopMarketTab
                                        market={props.market}
                                        generalData={props.generalData}
                                        gaugeV4={props.backstopGaugeV4}
                                        supplyInput={supplyInput}
                                        withdrawInput={withdrawInput}
                                        open={props.open}
                                        completed={props.completed}
                                        handleStake={props.handleStake}
                                        handleUnstake={props.handleUnstake}
                                        handleMint={props.handleMint}
                                        handleApproveStake={props.handleApproveStake}
                                        handleApproveUnStake={props.handleApproveUnStake}/>
                                </TabContentItem>
                            :
                                ''
                        }
                        <TabContentItem
                            open={props.open}
                            tabId={
                                (props.market?.backstop || props.backstopGaugeV4?.generalData?.backstopGauge) && props.gaugeV4 ?
                                    4
                                    :
                                    props.market?.backstop || props.backstopGaugeV4?.generalData?.backstopGauge || props.gaugeV4 ?
                                        3 : 2
                            }
                            tabChange={tabChange}>
                            <TextBox placeholder={`0 ${props.market?.underlying.symbol}`} disabled={withdrawDisabled} value={withdrawInput} setInput={setWithdrawInput} validation={withdrawValidation}
                                     button={props.generalData && +props.generalData.totalBorrowBalance.toString() > 0 ? "Safe Max" : "Max"} buttonTooltip="50% of borrow limit"
                                     onClick={() => {props.generalData && +props.generalData.totalBorrowBalance.toString() > 0 ? getSafeMaxWithdraw() : getMaxWithdraw()}}/>
                            <MarketDialogItem title={"You Supplied"} value={`${props.market?.supplyBalanceInTokenUnit?.toFixed(4)} ${props.market?.underlying.symbol}`}/>
                            <SupplyRateSection market={props.market} gaugeV4={props.gaugeV4}/>
                            <BorrowLimitSection generalData={props.generalData} newBorrowLimit={newBorrowLimit2}/>
                            <DialogMarketInfoSection market={props.market} collateralFactorText={"Loan-to-Value"}/>
                            <MarketDialogButton disabled={withdrawInput==="" || (props.market && props.market.withdrawSpinner) || isNaN(+withdrawInput) || withdrawValidation!=="" || (newBorrowLimit2 && props.generalData &&
                                +newBorrowLimit2.toString() > 0 &&
                                +props.generalData?.totalBorrowBalance.toString() / +newBorrowLimit2.toString() > 0.9 &&
                                (+props.generalData?.totalBorrowBalance.toString() / +newBorrowLimit2.toString() * 100) > +props.generalData.totalBorrowLimitUsedPercent) ? true: false}
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
                    </TabContent>
                </Tab>
            </div>
        </div>) : null
    )
}

function convertUSDToUnderlyingToken(USD: string, market: CTokenInfo ) : BigNumber{ //USD -> underlying token
    const underlyingToken = +USD / +market.underlying.price.toString(); 
    return BigNumber.parseValueSafe(underlyingToken.toString(), market.underlying.decimals);  
}

export default SupplyMarketDialog