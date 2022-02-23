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
import BackstopSection from "./backstopSection";
import {GaugeV4} from "../../../Classes/gaugeV4Class";
import {stakingApr} from "../aprHelpers";

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

    handleApproveBackstop: (symbol: string) => Promise<void>
    handleBackstopDeposit: (symbol: string, amount: string) => Promise<void>
    handleBackstopWithdraw: (symbol: string, amount: string) => Promise<void>
    handleBackstopClaim: (symbol: string) => Promise<void>
    handleApproveStake: (symbol: string | undefined, guage: GaugeV4 | null | undefined) => Promise<void>
}
const SupplyMarketDialog:React.FC<Props> = (props: Props) =>{
    const [supplyInput, setSupplyInput] = useState<string>("")
    const [supplyDisabled, setSupplyDisabled] = useState<boolean>(false)
    const [withdrawInput, setWithdrawInput] = useState<string>("")
    const [withdrawDisabled, setWithdrawDisabled] = useState<boolean>(false)
    const [depositInput, setDepositInput] = useState<string>("")
    const [depositDisabled, setDepositDisabled] = useState<boolean>(false)
    const [backstopWithdrawInput, setBackstopWithdrawInput] = useState<string>("")
    const [backstopWithdraw, setBackstopWithdraw] = useState<string>("Withdraw")
    const [backstopWithdrawDisabled, setbackstopWithdrawDisabled] = useState<boolean>(false)
    const [supplyValidation, setSupplyValidation] = useState<string>("")
    const [withdrawValidation, setWithdrawValidation] = useState<string>("")
    const [depositValidation, setDepositValidation] = useState<string>("")
    const [backstopWithdrawValidation, setBackstopWithdrawValidation] = useState<string>("")
    const [tabChange, setTabChange] = useState<number>(1)
    const [newBorrowLimit1, setNewBorrowLimit1] = useState<BigNumber>(BigNumber.from(0))
    const [newBorrowLimit2, setNewBorrowLimit2] = useState<BigNumber>(BigNumber.from(0))
    const [newBorrowLimit3, setNewBorrowLimit3] = useState<BigNumber>(BigNumber.from(0))
    const [withdrawMax, setWithdrawMax] = useState<boolean>(false)
    const [stakeInput, setStakeInput] = useState<string>("")
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [stakeMax, setStakeMax] = useState<boolean>(false)
    const [stakeDisabled, setStakeDisabled] = useState<boolean>(false)
    const [stakeValidation, setStakeValidation] = useState<string>("")
    const [unstakeInput, setUnstakeInput] = useState<string>("")
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [unstakeMax, setUnstakeMax] = useState<boolean>(false)
    const [unstakeDisabled, setUnstakeDisabled] = useState<boolean>(false)
    const [unstakeValidation, setUnstakeValidation] = useState<string>("")

    const CloseDialog = () =>{
        if(props.spinnerVisible)
            return
        setSupplyInput("")
        setWithdrawInput("")
        setBackstopWithdraw("Withdraw")
        setStakeInput("")
        setUnstakeInput("")
        setSupplyValidation("")
        setWithdrawValidation("")
        setStakeValidation("")
        setDepositInput("")
        setBackstopWithdrawInput("")
        setSupplyValidation("")
        setWithdrawValidation("")
        setDepositValidation("")
        setBackstopWithdrawValidation("")
        setTabChange(1)
        setNewBorrowLimit1(BigNumber.from(0))
        setNewBorrowLimit2(BigNumber.from(0))
        setNewBorrowLimit3(BigNumber.from(0))
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
            } else if (props.market && +supplyInput > +props.market?.underlying.walletBalance) {
              setSupplyValidation("Amount must be <= balance");
            }else if (props.market && +supplyInput > +props.market?.underlying.allowance.toString()){
                const approve = BigNumber.parseValue((+supplyInput - +props.market?.underlying.allowance.toString()).noExponents()).toRound(4)
              setSupplyValidation(`You must approve ${approve} ${props.market.underlying.symbol} more.`);
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
        const handleStakeAmountChange = () => {
            if(stakeInput.trim() === ""){
                setStakeValidation("")
                setNewBorrowLimit3(BigNumber.from("0"))
                return;
            }

            if(isNaN(+stakeInput) || isNaN(parseFloat(stakeInput))){
                setStakeValidation("Amount must be a number");
                setNewBorrowLimit3(BigNumber.from("0"))
                return;
            } else if (+stakeInput <= 0) {
                setStakeValidation("Amount must be > 0");
                setNewBorrowLimit3(BigNumber.from("0"))
                return
            } else if (props.gaugeV4 && +stakeInput > +props.gaugeV4?.userLpBalance) {
                setStakeValidation("Amount must be <= balance");
                setNewBorrowLimit3(BigNumber.from("0"))
                return
            } else{
                setStakeValidation("");
            }

            if(props.market && props.generalData){
                const totalBorrow = +props.generalData.totalBorrowLimit.toString()
                const stake = props.market.isEnterMarket && stakeInput.trim() !== "" ? +convertLpAmountToUnderlying(stakeInput, props.market) : 0
                const price = +props.market.underlying.price.toString()
                const collateral = +props.market.collateralFactor.toString()
                const newTotalSupply = stake * price * collateral
                const borrow = totalBorrow - newTotalSupply
                setNewBorrowLimit3(BigNumber.parseValue(borrow.noExponents()))
                console.log(borrow.noExponents())
            }

            // setNewBorrowLimit3(props.market && props.generalData ? 
            //     props.generalData.totalSupplyBalance?.subSafe(props.market?.isEnterMarket? BigNumber.parseValue(stakeInput.trim()!=="" ? convertLpAmountToUnderlying(stakeInput, props.market) : "0").
            //     mulSafe(props.market?.underlying.price).mulSafe(props.market?.collateralFactor): BigNumber.from(0)) : BigNumber.from(0))
            
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

    useEffect(() => {
        setNewBorrowLimit1( props.generalData && props.market ?
            props?.generalData.totalBorrowLimit?.addSafe(props.market?.isEnterMarket ? BigNumber.parseValue(supplyInput!=="" ? supplyInput : "0").
              mulSafe(props.market?.underlying.price).mulSafe(props.market?.collateralFactor): BigNumber.from(0)) : BigNumber.from(0));
          
        setNewBorrowLimit2(props.market && props.generalData ? props.generalData.totalBorrowLimit?.
            subSafe(props.market?.isEnterMarket? BigNumber.parseValue(withdrawInput!=="" ? withdrawInput : "0").
            mulSafe(props.market?.underlying.price).mulSafe(props.market?.collateralFactor): BigNumber.from(0)) : BigNumber.from(0));
        
        setNewBorrowLimit3(props.market && props.generalData ? 
            props.generalData.totalBorrowLimit?.subSafe(props.market?.isEnterMarket? BigNumber.parseValue(stakeInput.trim()!=="" ? convertLpAmountToUnderlying(stakeInput, props.market) : "0").
            mulSafe(props.market?.underlying.price).mulSafe(props.market?.collateralFactor): BigNumber.from(0)) : BigNumber.from(0))

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

    const setUnstakeRatio = (ratio: number) => {
        setUnstakeInput(
            BigNumber.from(
                Math.floor(
                    formatBalance(props.gaugeV4?.userStakeBalance).toNumber() * ratio
                ),
                props.gaugeV4?.userStakeBalance._decimals
            ).toString()
        )
    }

    const setStakeRatio = (ratio: number) => {
        setStakeInput(
            BigNumber.from(
                Math.floor(
                    formatBalance(props.gaugeV4?.userLpBalance).toNumber() * ratio
                ),
                props.gaugeV4?.userLpBalance._decimals
            ).toString()
        )
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
                if(props.completed) setUnstakeInput("")
                setUnstakeDisabled(false)
            }
            else{
                setUnstakeDisabled(true)
            }

        }
    }, [props.market?.unstakeSpinner])

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
                        {props.market?.backstop && props.gaugeV4 ?
                            <TabHeader tabChange = {tabChange}>
                                <TabHeaderItem tabId={1} title="Supply" tabChange = {tabChange} setTabChange = {setTabChange}/>
                                <TabHeaderItem tabId={2} title="Stake" tabChange={tabChange} setTabChange={setTabChange}/>
                                <TabHeaderItem tabId={3} title="Withdraw" tabChange = {tabChange} setTabChange = {setTabChange}/>
                                <TabHeaderItem tabId={4} title="Backstop" tabChange = {tabChange} setTabChange = {setTabChange}/>
                            </TabHeader>
                            : props.market?.backstop ?
                            <TabHeader tabChange = {tabChange}>
                                <TabHeaderItem tabId={1} title="Supply" tabChange = {tabChange} setTabChange = {setTabChange}/>
                                <TabHeaderItem tabId={2} title="Withdraw" tabChange = {tabChange} setTabChange = {setTabChange}/>
                                <TabHeaderItem tabId={3} title="Backstop" tabChange = {tabChange} setTabChange = {setTabChange}/>
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
                            <MarketDialogItem title={"Wallet Balance"} value={`${props.market?.underlying.walletBalance?.toRound(4, true)} ${props.market?.underlying.symbol}`}/>
                            <SupplyRateSection darkMode={props.darkMode} market={props.market} gaugeV4={props.gaugeV4} />
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
                            props.gaugeV4 && props.market ?
                                <TabContentItem open={props.open} tabId={2} tabChange={tabChange}>
                                    <MarketDialogItem
                                        title={"You Staked"}
                                        value={`${formatBalance(BigNumber.from(props.gaugeV4?.userStakedTokenBalance, props.market.underlying.decimals).mul(props.market.exchangeRate)).toFixed(4)} ${props.market?.underlying.symbol}`}
                                    />
                                    <MarketDialogItem
                                        title={"Claimable"}
                                        value={`${formatBalance(props.gaugeV4?.userClaimableHnd).toFixed(4)} HND`}
                                    />
                                    <MarketDialogItem
                                        title={"APR"}
                                        value={stakingApr(props.market, props.gaugeV4)}
                                    />
                                    <BorrowLimitSection generalData={props.generalData} newBorrowLimit={newBorrowLimit3}/>
                                    <div className="native-asset-amount">
                                        <span className="dialog-section-content-value">{convertLpAmountToUnderlying(stakeInput, props.market)} {props.market?.underlying.symbol}</span>
                                        <div className="amount-select">
                                            <div onClick={() => setStakeRatio(0.25) }>25%</div>
                                            <div onClick={() => setStakeRatio(0.50) }>50%</div>
                                            <div onClick={() => setStakeRatio(0.75) }>75%</div>
                                            <div onClick={() => setStakeRatio(1) }>100%</div>
                                        </div>
                                    </div>
                                    <div className="input-button-group">
                                        <TextBox
                                            placeholder={`0 h${props.market?.underlying.symbol}`}
                                            disabled={stakeDisabled}
                                            value={stakeInput}
                                            setInput={setStakeInput}
                                            validation={stakeValidation}
                                            button={"Max"}
                                            onClick={() => getMaxStake()}
                                        />
                                        {props.gaugeV4 && +props.gaugeV4.userAllowance.toString() > 0 &&
                                        +props.gaugeV4.userAllowance.toString().toString() >= (stakeInput.trim() === "" || isNaN(+stakeInput) || isNaN(parseFloat(stakeInput)) ? 0 : +stakeInput)
                                            ?
                                            <MarketDialogButton
                                                disabled={stakeInput === "" || stakeValidation !== "" || (newBorrowLimit3 && props.generalData &&
                                                    (+newBorrowLimit3.toString() > 0 || +newBorrowLimit3.toString() < 0) &&
                                                    (+newBorrowLimit3.toString() > 0 ? +props.generalData?.totalBorrowBalance.toString() / +newBorrowLimit3.toString() > 0.9 : +props.generalData?.totalBorrowBalance.toString() / +newBorrowLimit3.toString() * -1 > 0.9) &&
                                                    (+newBorrowLimit3.toString() > 0 ? +props.generalData?.totalBorrowBalance.toString() / +newBorrowLimit3.toString() * 100 : 
                                                    +props.generalData?.totalBorrowBalance.toString() / +newBorrowLimit3.toString() * -1 * 100) > +props.generalData.totalBorrowLimitUsedPercent ? true : false)}
                                                onClick={() => props.handleStake(props.market?.underlying.symbol, props?.gaugeV4, stakeInput)}
                                            >
                                                {props.market && props.market.stakeSpinner ? (
                                                    <Spinner size={"20px"}/>) : "Stake"}
                                            </MarketDialogButton>
                                            :
                                            <MarketDialogButton
                                                disabled={stakeInput === "" || stakeValidation !== "" || (newBorrowLimit3 && props.generalData &&
                                                (+newBorrowLimit3.toString() > 0 || +newBorrowLimit3.toString() < 0) &&
                                                (+newBorrowLimit3.toString() > 0 ? +props.generalData?.totalBorrowBalance.toString() / +newBorrowLimit3.toString() > 0.9 : +props.generalData?.totalBorrowBalance.toString() / +newBorrowLimit3.toString() * -1 > 0.9) &&
                                                (+newBorrowLimit3.toString() > 0 ? +props.generalData?.totalBorrowBalance.toString() / +newBorrowLimit3.toString() * 100 : 
                                                +props.generalData?.totalBorrowBalance.toString() / +newBorrowLimit3.toString() * -1 * 100) > +props.generalData.totalBorrowLimitUsedPercent ? true : false)}
                                                onClick={() => props.handleApproveStake(props.market?.underlying.symbol, props?.gaugeV4)}
                                            >
                                                {props.market && props.market.stakeSpinner ? (
                                                    <Spinner size={"20px"}/>) : "Approve"}
                                            </MarketDialogButton>
                                        }

                                    </div>
                                    <div className="native-asset-amount">
                                        <span>{convertGaugeLpAmountToUnderlying(unstakeInput, props?.gaugeV4.gaugeTokenDecimals, props.market)} {props.market?.underlying.symbol}</span>
                                        <div className="amount-select">
                                            <div onClick={() => setUnstakeRatio(0.25) }>25%</div>
                                            <div onClick={() => setUnstakeRatio(0.50) }>50%</div>
                                            <div onClick={() => setUnstakeRatio(0.75) }>75%</div>
                                            <div onClick={() => setUnstakeRatio(1) }>100%</div>
                                        </div>
                                    </div>
                                    <div className="input-button-group">
                                        <TextBox
                                            placeholder={`0 h${props.market?.underlying.symbol}-g`}
                                            disabled={unstakeDisabled}
                                            value={unstakeInput}
                                            setInput={setUnstakeInput}
                                            validation={unstakeValidation}
                                            button={"Max"}
                                            onClick={() => getMaxUnstake()}
                                        />
                                        <MarketDialogButton
                                            disabled={unstakeInput === "" || unstakeValidation !== ""}
                                            onClick={() => props.handleUnstake(props.market?.underlying.symbol, props?.gaugeV4, unstakeInput)}
                                        >
                                            {props.market && props.market.unstakeSpinner ? (
                                                <Spinner size={"20px"}/>) : "Unstake"}
                                        </MarketDialogButton>
                                    </div>
                                    <MarketDialogButton
                                        disabled={props?.gaugeV4?.userClaimableHnd === undefined || props?.gaugeV4?.userClaimableHnd?.eq(BigNumber.from(0))}
                                        onClick={() => props.handleMint(props.market?.underlying.symbol, props?.gaugeV4)}
                                    >
                                        {props.market && props.market.mintSpinner ? (
                                            <Spinner size={"20px"}/>) : "Claim HND"}
                                    </MarketDialogButton>
                                </TabContentItem>
                                : ''
                        }
                        <TabContentItem open={props.open} tabId={props.gaugeV4 && props.market ? 3 : 2} tabChange={tabChange}>
                            <TextBox placeholder={`0 ${props.market?.underlying.symbol}`} disabled={withdrawDisabled} value={withdrawInput} setInput={setWithdrawInput} validation={withdrawValidation} button={"Max"}
                                onClick={() => getMaxWithdraw()}/>
                            <MarketDialogItem title={"You Supplied"} value={`${props.market?.supplyBalanceInTokenUnit?.toFixed(4)} ${props.market?.underlying.symbol}`}/>
                            <SupplyRateSection darkMode={props.darkMode} market={props.market} gaugeV4={props.gaugeV4}/>
                            <BorrowLimitSection generalData={props.generalData} newBorrowLimit={newBorrowLimit2}/>
                            <DialogMarketInfoSection market={props.market} collateralFactorText={"Loan-to-Value"}/>
                            <MarketDialogButton disabled={withdrawInput==="" || isNaN(+withdrawInput) || withdrawValidation!=="" || (newBorrowLimit2 && props.generalData &&
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
                        {
                            props.market?.backstop ?
                            <TabContentItem open={props.open} tabId={props.gaugeV4 && props.market ? 4 : 3} tabChange={tabChange}>
                                    <MarketDialogItem title={"Wallet Ballance"} value={`${props.market?.underlying.walletBalance?.toRound(4, true)} ${props.market?.underlying.symbol}`} className="dialog-section-no-bottom-gap"/>
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
                                        {props.market && props.market.backstopWithdrawSpinner ? (<Spinner size={"20px"}/>) : backstopWithdraw}
                                    </MarketDialogButton>
                                    {
                                        +props.market.backstop.pendingHundred.toString() > 0 ?
                                        <MarketDialogButton className="backstop-dialog-button" disabled={props.market?.backstopClaimSpinner ? true: false}
                                        onClick={() => {    props.market ?
                                                            props.handleBackstopClaim(
                                                                props.market?.underlying.symbol,
                                                            ) : null
                                                        }}>
                                        {props.market && props.market.backstopClaimSpinner ? (<Spinner size={"20px"}/>) : `Claim ${props.market.backstop.pendingHundred.toRound(4, true, true)} HND`}
                                    </MarketDialogButton>
                                    :<></>
                                    }
                                </TabContentItem>
                            :
                            ''
                        }
                    </TabContent>
                </Tab>
            </div>
        </div>) : null
    )
}

function convertLpAmountToUnderlying(amount: string, market: CTokenInfo) : string{
    return (+amount * +market.exchangeRate / (10 ** (market.underlying.decimals - 8)) ).toFixed(4)
}

function convertGaugeLpAmountToUnderlying(amount: string, gaugeDecimals: number, market: CTokenInfo) : string{
    return (+amount * +market.exchangeRate / (10 ** (market.underlying.decimals - gaugeDecimals))).toFixed(4)
}

export default SupplyMarketDialog