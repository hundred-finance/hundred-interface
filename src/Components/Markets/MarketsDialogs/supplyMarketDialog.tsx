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
import {GaugeV4} from "../../../Classes/gaugeV4Class";

interface Props{
    spinnerVisible: boolean,
    closeSupplyMarketDialog: () => void,
    market: CTokenInfo | null,
    generalData: GeneralDetailsData | null,
    gaugeV4: GaugeV4 | null | undefined
    open: boolean,
    getMaxAmount: (market: CTokenInfo, func?: string) => Promise<BigNumber>,
    darkMode: boolean,
    completed: boolean,
    handleSupply: (symbol: string, amount: string) => Promise<void>,
    handleEnable: (symbol: string, borrowDialog: boolean) => Promise<void>,
    handleWithdraw: (symbol: string, amount: string, max: boolean) => Promise<void>
    handleStake: (symbol: string | undefined, guage: GaugeV4 | null | undefined, amount: string) => Promise<void>
    handleUnstake: (symbol: string | undefined, guage: GaugeV4 | null | undefined, amount: string) => Promise<void>
    handleMint: (symbol: string | undefined, guage: GaugeV4 | null | undefined) => Promise<void>

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
    const [stakeInput, setStakeInput] = useState<string>("")
    const [stakeMax, setStakeMax] = useState<boolean>(false)
    const [stakeDisabled, setStakeDisabled] = useState<boolean>(false)
    const [stakeValidation, setStakeValidation] = useState<string>("")
    const [unstakeInput, setUnstakeInput] = useState<string>("")
    const [unstakeMax, setUnstakeMax] = useState<boolean>(false)
    const [unstakeDisabled, setUnstakeDisabled] = useState<boolean>(false)
    const [unstakeValidation, setUnstakeValidation] = useState<string>("")

    const CloseDialog = () =>{
        if(props.spinnerVisible)
            return
        setSupplyInput("")
        setWithdrawInput("")
        setStakeInput("")
        setSupplyValidation("")
        setWithdrawValidation("")
        setStakeValidation("")
        setTabChange(1)
        setNewBorrowLimit1(BigNumber.from(0))
        setNewBorrowLimit2(BigNumber.from(0))
        setWithdrawMax(false)
        setStakeMax(false)
        setUnstakeMax(false)
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
                                console.log(`totalBorrow: ${props.generalData?.totalBorrowLimit}\nborrowLimit: ${newBorrowLimit2}\npercent${props.generalData?.totalBorrowBalance.divSafe(newBorrowLimit2).toString()}`)
            }


          handleWithdrawAmountChange()

          // eslint-disable-next-line
    }, [withdrawInput])

    useEffect(()=>{
        const handleStakeAmountChange = () => {
            if(stakeInput.trim() === ""){
                setStakeValidation("")
                return;
            }

            if(isNaN(+stakeInput) || isNaN(parseFloat(stakeInput))){
                setStakeValidation("Amount must be a number");
                return;
            } else if (+stakeInput <= 0) {
                setStakeValidation("Amount must be > 0");
            } else if (props.gaugeV4 && +stakeInput > +props.gaugeV4?.userLpBalance) {
                setStakeValidation("Amount must be <= balance");
            } else{
                setStakeValidation("");
            }
        }

        handleStakeAmountChange()
        // eslint-disable-next-line
    }, [stakeInput])

    useEffect(()=>{
        const handleUnstakeAmountChange = () => {
            if(unstakeInput.trim() === ""){
                setUnstakeValidation("")
                return;
            }

            if(isNaN(+unstakeInput) || isNaN(parseFloat(unstakeInput))){
                setUnstakeValidation("Amount must be a number");
                return;
            } else if (+unstakeInput <= 0) {
                setUnstakeValidation("Amount must be > 0");
            } else if (props.gaugeV4 && +unstakeInput > +props.gaugeV4?.userStakeBalance) {
                setUnstakeValidation("Amount must be <= staked balance");
            } else{
                setUnstakeValidation("");
            }
        }

        handleUnstakeAmountChange()
        // eslint-disable-next-line
    }, [unstakeInput])


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

    const formatBalance = (value: BigNumber | undefined) => {
        if (value) {
            return value
        } else {
            return BigNumber.from(0)
        }
    }

    const getMaxStake = () : void=> {
        setStakeMax(true)
        setStakeInput(formatBalance(props.gaugeV4?.userLpBalance).toString)
    }

    const getMaxUnstake = () : void=> {
        setUnstakeMax(true)
        setUnstakeInput(formatBalance(props.gaugeV4?.userStakeBalance).toString)
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
        if(props.market){
            if(!props.market.stakeSpinner){
                if(props.completed) setStakeInput("")
                setStakeDisabled(false)
            }
            else{
                setStakeDisabled(true)
            }

        }
    }, [props.market?.stakeSpinner])

    useEffect(() => {
        if(props.market){
            if(!props.market.unstakeSpinner){
                if(props.completed) setStakeInput("")
                setUnstakeDisabled(false)
            }
            else{
                setUnstakeDisabled(true)
            }

        }
    }, [props.market?.stakeSpinner])

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
                        {props.market?.backstop ?
                            <TabHeader tabChange = {tabChange}>
                                <TabHeaderItem tabId={1} title="Supply" tabChange = {tabChange} setTabChange = {setTabChange}/>
                                <TabHeaderItem tabId={2} title="Withdraw" tabChange = {tabChange} setTabChange = {setTabChange}/>
                                <TabHeaderItem tabId={3} title="Backstop" tabChange = {tabChange} setTabChange = {setTabChange}/>
                                <TabHeaderItem tabId={4} title="Farm" tabChange = {tabChange} setTabChange = {setTabChange}/>
                            </TabHeader>
                            :
                            <TabHeader tabChange = {tabChange}>
                                <TabHeaderItem tabId={1} title="Supply" tabChange = {tabChange} setTabChange = {setTabChange}/>
                                <TabHeaderItem tabId={2} title="Withdraw" tabChange = {tabChange} setTabChange = {setTabChange}/>
                                <TabHeaderItem tabId={3} title="Farm" tabChange = {tabChange} setTabChange = {setTabChange}/>
                            </TabHeader>
                            }
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
                            <MarketDialogButton disabled={withdrawInput==="" || isNaN(+withdrawInput) || withdrawValidation!=="" || (newBorrowLimit2 && props.generalData &&
                            +newBorrowLimit2.toString() > 0 &&
                                        +props.generalData?.totalBorrowBalance.toString() / +newBorrowLimit2.toString() > 0.9 && (+props.generalData?.totalBorrowBalance.toString() / +newBorrowLimit2.toString() * 100) > +props.generalData.totalBorrowLimitUsedPercent) ? true: false}
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
                        {
                            props.market?.backstop ?
                            <>
                                <TabContentItem open={props.open} tabId={3} tabChange={tabChange}>
                                    <MarketDialogItem title={"Wallet Ballance"} value={`${props.market?.walletBalance?.toRound(4, true)} ${props.market?.symbol}`}/>
                                    <BackstopSection market={props.market}/>
                                    <TextBox placeholder={`0 ${props.market?.symbol}`} disabled={supplyDisabled} value={supplyInput} setInput={setSupplyInput} validation={supplyValidation} button={"Max"}
                                    onClick={()=>getMaxAmount()} validationCollapse={true}/>
                                    {props.market?.underlyingAllowance?.gt(BigNumber.from(0)) &&
                                    props.market?.underlyingAllowance?.gte(supplyInput.trim() === "" || isNaN(+supplyInput) || isNaN(parseFloat(supplyInput)) ? BigNumber.from("0")
                                    : BigNumber.parseValue(supplyInput))
                                    ? (
                                        <MarketDialogButton disabled={supplyInput==="" || supplyValidation!="" || props.market?.supplySpinner}
                                            onClick={() => {   props.market ? props.handleSupply(props.market?.symbol,supplyInput) : null}}>
                                            {props.market.supplySpinner ? (<Spinner size={"20px"}/>) : "Deposit"}
                                        </MarketDialogButton>
                                    ) : (
                                        <MarketDialogButton disabled={!props.market || (props.market && props.market?.supplySpinner)}
                                            onClick={() => {props.market ? props.handleEnable(props.market?.symbol,false) : null}}>
                                            {props.market?.supplySpinner ? (<Spinner size={"20px"}/>) : `Approve ${props.market?.symbol}`}
                                        </MarketDialogButton>)}
                                    <TextBox placeholder={`0 ${props.market.backstop.symbol}`} disabled={withdrawDisabled} value={withdrawInput} setInput={setWithdrawInput} validation={withdrawValidation} button={"Max"}
                                    onClick={() => getMaxWithdraw()} validationCollapse={true}/>
                                    <MarketDialogButton className="backstop-dialog-button" disabled={withdrawInput==="" || withdrawValidation!=="" || (newBorrowLimit2 && props.generalData &&
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
                                <TabContentItem open={props.open} tabId={3} tabChange={tabChange}>
                                    <MarketDialogItem
                                        title={"You Staked"}
                                        value={`${formatBalance(props.gaugeV4?.userStakeBalance).toFixed(4)} h${props.market?.symbol}`}
                                    />
                                    <MarketDialogItem
                                        title={"Claimable"}
                                        value={`${formatBalance(props.gaugeV4?.userClaimableHnd).toFixed(4)} HND`}
                                    />
                                    <TextBox
                                        placeholder={`0 h${props.market?.symbol}`}
                                        disabled={stakeDisabled}
                                        value={stakeInput}
                                        setInput={setStakeInput}
                                        validation={stakeValidation}
                                        button={"Max"}
                                        onClick={() => getMaxStake()}
                                    />
                                    <MarketDialogButton disabled={stakeInput==="" || stakeValidation!=="" }
                                                        onClick={() => props.handleStake(props.market?.symbol, props?.gaugeV4, stakeInput) }
                                    >
                                        {props.market && props.market.stakeSpinner ? (<Spinner size={"20px"}/>) : "Stake"}
                                    </MarketDialogButton>
                                    <TextBox
                                        placeholder={`0 h${props.market?.symbol}`}
                                        disabled={unstakeDisabled}
                                        value={unstakeInput}
                                        setInput={setUnstakeInput}
                                        validation={unstakeValidation}
                                        button={"Max"}
                                        onClick={() => getMaxUnstake()}
                                    />
                                    <MarketDialogButton disabled={unstakeInput==="" || unstakeValidation!=="" }
                                                        onClick={() => props.handleUnstake(props.market?.symbol, props?.gaugeV4, unstakeInput) }
                                    >
                                        {props.market && props.market.unstakeSpinner ? (<Spinner size={"20px"}/>) : "Exit stake"}
                                    </MarketDialogButton>
                                    <MarketDialogButton disabled={props?.gaugeV4?.userClaimableHnd === undefined || props?.gaugeV4?.userClaimableHnd?.eq(BigNumber.from(0))}
                                                        onClick={() => props.handleMint(props.market?.symbol, props?.gaugeV4) }
                                    >
                                        {props.market && props.market.mintSpinner ? (<Spinner size={"20px"}/>) : "Claim HND"}
                                    </MarketDialogButton>
                                </TabContentItem>
                            </>
                            :
                                <>
                                    <TabContentItem open={props.open} tabId={3} tabChange={tabChange}>
                                        <MarketDialogItem
                                            title={"You Staked"}
                                            value={`${formatBalance(props.gaugeV4?.userStakeBalance).toFixed(4)} h${props.market?.symbol}`}
                                        />
                                        <MarketDialogItem
                                            title={"Claimable"}
                                            value={`${formatBalance(props.gaugeV4?.userClaimableHnd).toFixed(4)} HND`}
                                        />
                                        <TextBox
                                            placeholder={`0 h${props.market?.symbol}`}
                                            disabled={stakeDisabled}
                                            value={stakeInput}
                                            setInput={setStakeInput}
                                            validation={stakeValidation}
                                            button={"Max"}
                                            onClick={() => getMaxStake()}
                                        />
                                        <MarketDialogButton disabled={stakeInput==="" || stakeValidation!=="" }
                                                            onClick={() => props.handleStake(props.market?.symbol, props?.gaugeV4, stakeInput) }
                                        >
                                            {props.market && props.market.stakeSpinner ? (<Spinner size={"20px"}/>) : "Stake"}
                                        </MarketDialogButton>
                                        <TextBox
                                            placeholder={`0 h${props.market?.symbol}`}
                                            disabled={unstakeDisabled}
                                            value={unstakeInput}
                                            setInput={setUnstakeInput}
                                            validation={unstakeValidation}
                                            button={"Max"}
                                            onClick={() => getMaxUnstake()}
                                        />
                                        <MarketDialogButton disabled={unstakeInput==="" || unstakeValidation!=="" }
                                                            onClick={() => props.handleUnstake(props.market?.symbol, props?.gaugeV4, unstakeInput) }
                                        >
                                            {props.market && props.market.unstakeSpinner ? (<Spinner size={"20px"}/>) : "Exit stake"}
                                        </MarketDialogButton>
                                        <MarketDialogButton disabled={props?.gaugeV4?.userClaimableHnd === undefined || props?.gaugeV4?.userClaimableHnd?.eq(BigNumber.from(0))}
                                                            onClick={() => props.handleMint(props.market?.symbol, props?.gaugeV4) }
                                        >
                                            {props.market && props.market.mintSpinner ? (<Spinner size={"20px"}/>) : "Claim HND"}
                                        </MarketDialogButton>
                                    </TabContentItem>

                                </>
                        }

                    </TabContent>
                </Tab>
            </div>
        </div>) : null
    )
}

export default SupplyMarketDialog