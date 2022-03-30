import { BigNumber } from "../../../bigNumber";
import React, {useEffect, useState} from "react"
import TextBox from "../../Textbox/textBox";
import BorrowLimitSection from "./borrowLimitSection";
import MarketDialogButton from "./marketDialogButton";
import "./supplyMarketDialog.css"
import MarketDialogItem from "./marketDialogItem";
import {Spinner} from "../../../assets/huIcons/huIcons";
import { CTokenInfo } from "../../../Classes/cTokenClass";
import { GeneralDetailsData } from "../../../Classes/generalDetailsClass";
import {GaugeV4} from "../../../Classes/gaugeV4Class";
import {stakingApr} from "../aprHelpers";

interface Props{
    market: CTokenInfo,
    generalData: GeneralDetailsData,
    gaugeV4: GaugeV4,
    supplyInput: string,
    withdrawInput: string,

    open: boolean,
    completed: boolean,

    handleStake: (symbol: string | undefined, guage: GaugeV4 | null | undefined, amount: string) => Promise<void>
    handleUnstake: (symbol: string | undefined, guage: GaugeV4 | null | undefined, amount: string) => Promise<void>
    handleMint: (symbol: string | undefined, guage: GaugeV4 | null | undefined) => Promise<void>
    handleApproveStake: (symbol: string | undefined, guage: GaugeV4 | null | undefined) => Promise<void>
    handleApproveUnStake: (symbol: string | undefined, guage: GaugeV4 | null | undefined) => Promise<void>
}
const DirectBackstopStakeMarketTab:React.FC<Props> = (props: Props) =>{
    const [newBorrowLimit3, setNewBorrowLimit3] = useState<BigNumber>(BigNumber.from(0))
    const [stakeInput, setStakeInput] = useState<string>("")
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [stakeDisabled, setStakeDisabled] = useState<boolean>(false)
    const [stakeValidation, setStakeValidation] = useState<string>("")
    const [unstakeInput, setUnstakeInput] = useState<string>("")
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [unstakeDisabled, setUnstakeDisabled] = useState<boolean>(false)
    const [unstakeValidation, setUnstakeValidation] = useState<string>("")

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
            } else if (+props.supplyInput <= 0 && props.market.underlying.walletBalance && +props.market.underlying.walletBalance.toString() <= 0) {
                setStakeValidation("No balance to stake");
                setNewBorrowLimit3(BigNumber.from("0"))
            } else if (+stakeInput <= 0) {
                setStakeValidation("Amount must be > 0");
                setNewBorrowLimit3(BigNumber.from("0"))
                return
            } else if (+stakeInput > +props.market.underlying.walletBalance) {
                setStakeValidation("Amount must be <= balance");
                setNewBorrowLimit3(BigNumber.from("0"))
                return
            } else{
                setStakeValidation("");
            }

            if(props.market && props.generalData){
                const totalBorrow = +props.generalData.totalBorrowLimit.toString()
                const stake = props.market.isEnterMarket && stakeInput.trim() !== "" ? +stakeInput : 0
                const price = +props.market.underlying.price.toString()
                const collateral = +props.market.collateralFactor.toString()
                const newTotalSupply = stake * price * collateral
                const borrow = totalBorrow - newTotalSupply
                setNewBorrowLimit3(BigNumber.parseValue(borrow.noExponents()))
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

    const formatBalance = (value: BigNumber | undefined) => {
        if (value) {
            return value
        } else {
            return BigNumber.from(0)
        }
    }

    const getMaxStake = () : void=> {
        setStakeInput(formatBalance(props.market.underlying.walletBalance).toString)
    }

    const getSafeMaxStake = () : void=> {
        const stake = BigNumber.from('0');

        if (props.market && props.generalData && props.market.underlying.walletBalance)
        {
            const borrow = BigNumber.parseValueSafe(props.generalData.totalBorrowBalance.toString(),props.market.underlying.decimals) ;
            const supply = props.generalData.totalSupplyBalance;
            const cFactor = BigNumber.parseValueSafe(props.market.collateralFactor.toString(),props.market.underlying.decimals)
                .mulSafe(BigNumber.parseValueSafe('0.5001', props.market.underlying.decimals));
            const percent = +cFactor.toString() === 0 ? 0 : +borrow.toString() / +cFactor.toString()
            const percentBN = BigNumber.parseValueSafe(percent.toString(), props.market.underlying.decimals);

            if (+props.generalData?.totalBorrowLimitUsedPercent.toRound(2) >= 50.01) {
                setStakeInput(stake.toString());
            } else{
                const result = supply.subSafe(percentBN);
                setStakeInput(BigNumber.minimum(result, props.market.underlying.walletBalance).toString());
            }
        } else {
            setStakeInput(stake.toString());
        }
    }

    const getMaxUnstake = () : void=> {
        setUnstakeInput(formatBalance(props.gaugeV4?.userStakeBalance).toString)
    }

    const setUnstakeRatio = (ratio: number) => {
        setUnstakeInput(
            BigNumber.from(props.gaugeV4?.userStakedTokenBalance.toString(), +props.gaugeV4?.gaugeTokenDecimals.toString())
                .mul(BigNumber.from(100 * ratio))
                .div(BigNumber.from(100))
                .toString()
        )
    }

    const setStakeRatio = (ratio: number) => {
        setStakeInput(
            props.market.underlying.walletBalance
                .mul(BigNumber.from(ratio * 100))
                .div(BigNumber.from(100))
                .toString()
        )
    }

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
    }, [props.market?.stakeSpinner,  props.completed])

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

    function isBorrowLimitUsed() {
        return newBorrowLimit3 && props.generalData &&
            (+newBorrowLimit3.toString() > 0 || +newBorrowLimit3.toString() < 0) &&
            (+newBorrowLimit3.toString() > 0 ? +props.generalData?.totalBorrowBalance.toString() / +newBorrowLimit3.toString() > 0.9 : +props.generalData?.totalBorrowBalance.toString() / +newBorrowLimit3.toString() * -1 > 0.9) &&
            (+newBorrowLimit3.toString() > 0 ? +props.generalData?.totalBorrowBalance.toString() / +newBorrowLimit3.toString() * 100 :
                +props.generalData?.totalBorrowBalance.toString() / +newBorrowLimit3.toString() * -1 * 100) > +props.generalData.totalBorrowLimitUsedPercent;
    }

    function getStakedBalance() {
        const stakedBalance = BigNumber.from(props.gaugeV4.userStakedTokenBalance, props.gaugeV4.lpTokenDecimals)
        return convertStakedBalance(stakedBalance);
    }

    function convertGaugeLpAmountToUnderlying(amount: string) : string{
        if (amount.length === 0) {
            return "0.0"
        }
        const stakedBalance = BigNumber.from(amount.replace('.',""), props.gaugeV4.lpTokenDecimals)
        return (+convertStakedBalance(stakedBalance)).toFixed(4)
    }

    function convertStakedBalance(stakedBalance: BigNumber) {
        if (!props.gaugeV4) {
            return BigNumber.from(0)
        }

        if (!props.gaugeV4.userStakedTokenBalance) {
            return BigNumber.from(0)
        }

        if (!props.gaugeV4.generalData.backstopTotalBalance) {
            return BigNumber.from(0)
        }

        if (!props.gaugeV4.generalData.backstopTotalSupply) {
            return BigNumber.from(0)
        }

        if (!props.market.exchangeRate) {
            return BigNumber.from(0)
        }

        if (!props.market.underlying.decimals) {
            return BigNumber.from(0)
        }

        const totalBalance = BigNumber.from(props.gaugeV4.generalData.backstopTotalBalance, 8)
        const totalSupply = BigNumber.from(props.gaugeV4.generalData.backstopTotalSupply, 18)

        const ratio = (10 ** (props.market.underlying.decimals - 8)).noExponents()
        const ratioDecimals = ratio.split(".").length > 1 ? ratio.split(".")[1].length : 0

        if (!stakedBalance) {
            return BigNumber.from(0)
        }

        return stakedBalance
            .mul(totalBalance)
            .mul(props.market.exchangeRate)
            .div(BigNumber.from(ratio.replace(".", ""), ratioDecimals))
            .div(totalSupply);
    }


    return (
        <>
            <MarketDialogItem
                title={"You Staked"}
                value={`${formatBalance(getStakedBalance()).toFixed(4)} ${props.market?.underlying.symbol}`}
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
                <span className="dialog-section-content-value"/>
                <div className="amount-select">
                    <div onClick={() => setStakeRatio(0.25) }>25%</div>
                    <div onClick={() => setStakeRatio(0.50) }>50%</div>
                    <div onClick={() => setStakeRatio(0.75) }>75%</div>
                    <div onClick={() => setStakeRatio(1) }>100%</div>
                </div>
            </div>
            <div className="input-button-group">
                <TextBox
                    placeholder={`${props.market?.underlying.symbol}`}
                    disabled={stakeDisabled}
                    value={stakeInput}
                    setInput={setStakeInput}
                    validation={stakeValidation}
                    button={props.generalData && +props.generalData.totalBorrowBalance.toString() > 0  ? "Safe Max" : "Max"}
                    buttonTooltip="50% of borrow limit"
                    onClick={() => {props.generalData && +props.generalData.totalBorrowBalance.toString() > 0 ? getSafeMaxStake() : getMaxStake()}}/>
                {props.gaugeV4 && +props.gaugeV4.userAllowance.toString() > 0 &&
                +props.gaugeV4.userAllowance.toString().toString() >= (stakeInput.trim() === "" || isNaN(+stakeInput) || isNaN(parseFloat(stakeInput)) ? 0 : +stakeInput)
                    ?
                    <MarketDialogButton
                        disabled={stakeInput === "" || stakeValidation !== "" || isBorrowLimitUsed()}
                        onClick={() => props.handleStake(props.market?.underlying.symbol, props?.gaugeV4, stakeInput)}
                    >
                        {props.market && props.market.stakeSpinner ? (
                            <Spinner size={"20px"}/>) : "Stake"}
                    </MarketDialogButton>
                    :
                    <MarketDialogButton
                        disabled={stakeInput === "" || stakeValidation !== "" || isBorrowLimitUsed()}
                        onClick={() => props.handleApproveStake(props.market?.underlying.symbol, props?.gaugeV4)}
                    >
                        {props.market && props.market.stakeSpinner ? (
                            <Spinner size={"20px"}/>) : "Approve"}
                    </MarketDialogButton>
                }
            </div>
            <div className="native-asset-amount">
                <span>{convertGaugeLpAmountToUnderlying(unstakeInput)} {props.market?.underlying.symbol}</span>
                <div className="amount-select">
                    <div onClick={() => setUnstakeRatio(0.25) }>25%</div>
                    <div onClick={() => setUnstakeRatio(0.50) }>50%</div>
                    <div onClick={() => setUnstakeRatio(0.75) }>75%</div>
                    <div onClick={() => setUnstakeRatio(1) }>100%</div>
                </div>
            </div>
            <div className="input-button-group">
                <TextBox
                    placeholder={`bh${props.market?.underlying.symbol}-g`}
                    disabled={unstakeDisabled}
                    value={unstakeInput}
                    setInput={setUnstakeInput}
                    validation={unstakeValidation}
                    button={"Max"}
                    onClick={() => getMaxUnstake()}
                />
                {props.gaugeV4 && +props.gaugeV4.userGaugeHelperAllowance.toString() > 0 &&
                +props.gaugeV4.userGaugeHelperAllowance.toString().toString() >= (unstakeInput.trim() === "" || isNaN(+unstakeInput) || isNaN(parseFloat(unstakeInput)) ? 0 : +unstakeInput)
                    ?
                    <MarketDialogButton
                        disabled={unstakeInput === "" || unstakeValidation !== ""}
                        onClick={() => props.handleUnstake(props.market?.underlying.symbol, props?.gaugeV4, unstakeInput)}
                    >
                        {props.market && props.market.unstakeSpinner ? (
                            <Spinner size={"20px"}/>) : "Unstake"}
                    </MarketDialogButton>
                    :
                    <MarketDialogButton
                        disabled={unstakeInput === "" || unstakeValidation !== ""}
                        onClick={() => props.handleApproveUnStake(props.market?.underlying.symbol, props?.gaugeV4)}
                    >
                        {props.market && props.market.unstakeSpinner ? (
                            <Spinner size={"20px"}/>) : "Approve"}
                    </MarketDialogButton>
                }
            </div>
            <MarketDialogButton
                disabled={props?.gaugeV4?.userClaimableHnd === undefined || props?.gaugeV4?.userClaimableHnd?.eq(BigNumber.from(0))}
                onClick={() => props.handleMint(props.market?.underlying.symbol, props?.gaugeV4)}
            >
                {props.market && props.market.mintSpinner ? (
                    <Spinner size={"20px"}/>) : "Claim HND"}
            </MarketDialogButton>
        </>
    )
}

export default DirectBackstopStakeMarketTab