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
import {rewardTokenApr, stakingApr} from "../aprHelpers";

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
    handleClaimRewards: (symbol: string | undefined, guage: GaugeV4 | null | undefined) => Promise<void>
}
const StakeMarketTab:React.FC<Props> = (props: Props) =>{
    const [newBorrowLimit3, setNewBorrowLimit3] = useState<BigNumber>(BigNumber.from(0))
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
            } else if (+props.supplyInput <= 0 && props.gaugeV4?.userLpBalance && +props.gaugeV4?.userLpBalance.toString() <= 0) {
                setStakeValidation("No balance to stake");
                setNewBorrowLimit3(BigNumber.from("0"))
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
        setStakeMax(true)
        setStakeInput(formatBalance(props.gaugeV4?.userLpBalance).toString)
    }

    const getSafeMaxStake = () : void=> {

        setStakeMax(true)
        const stake = BigNumber.from('0');
             
        if (props.market && props.generalData &&
            props.gaugeV4?.userLpBalance && +props.market.supplyBalanceInTokenUnit.toString() > 0)
        { 

        const borrow = BigNumber.parseValueSafe(props.generalData.totalBorrowBalance.toString(),props.market.underlying.decimals) ;
        const supply = props.generalData.totalSupplyBalance;
        const cFactor = BigNumber.parseValueSafe(props.market.collateralFactor.toString(),props.market.underlying.decimals).mulSafe(BigNumber.parseValueSafe('0.5001', props.market.underlying.decimals));
        const percent = +cFactor.toString() === 0 ? 0 : +borrow.toString() / +cFactor.toString()
        const percentBN = BigNumber.parseValueSafe(percent.toString(), props.market.underlying.decimals);
        if (+props.generalData?.totalBorrowLimitUsedPercent.toRound(2) >= 50.01) {
            setStakeInput(stake.toString());
        } 
        else{
            const result = convertUSDTohToken((supply.subSafe(percentBN)).toString(),props.market); 
        setStakeInput(BigNumber.minimum(result, props.gaugeV4?.userLpBalance).toString());
        }
        }
                
        else {
            setStakeInput(stake.toString());
        }
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

    return (
        <>
            <MarketDialogItem
                title={"You Staked"}
                value={`${formatBalance(BigNumber.from(props.gaugeV4?.userStakedTokenBalance, props.market.underlying.decimals).mul(props.market.exchangeRate)).toFixed(4)} ${props.market?.underlying.symbol}`}
            />
            <MarketDialogItem
                title={"Claimable"}
                value={`${formatBalance(props.gaugeV4?.userClaimableHnd).toFixed(4)} HND`}
            />
            <MarketDialogItem
                title={"HND APR"}
                value={stakingApr(props.market, props.gaugeV4)}
            />
            {props?.gaugeV4?.reward_token !== "0x0000000000000000000000000000000000000000" ?
                <MarketDialogItem
                    title={`${props?.gaugeV4?.reward_token_symbol} APR`}
                    value={rewardTokenApr(props.market, props.gaugeV4)}
                />
                :
                ''
            }
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
            {props?.gaugeV4?.reward_token !== "0x0000000000000000000000000000000000000000" ?
                <MarketDialogButton
                    disabled={props?.gaugeV4?.claimable_reward === undefined || props?.gaugeV4?.claimable_reward?.toString() === '0'}
                    onClick={() => props.handleClaimRewards(props.market?.underlying.symbol, props?.gaugeV4)}
                >
                    {props.market && props.market.mintSpinner ? (
                        <Spinner
                            size={"20px"}/>) : `Claim ${props?.gaugeV4?.reward_token_symbol}`}
                </MarketDialogButton>
                : ''
            }
        </>
    )
}

function convertLpAmountToUnderlying(amount: string, market: CTokenInfo) : string{
    return (+amount * +market.exchangeRate / (10 ** (market.underlying.decimals - 8)) ).toFixed(4)
}

function convertGaugeLpAmountToUnderlying(amount: string, gaugeDecimals: number, market: CTokenInfo) : string{
    return (+amount * +market.exchangeRate / (10 ** (market.underlying.decimals - gaugeDecimals))).toFixed(4)
}

function convertUSDTohToken(USD: string, market: CTokenInfo ) : BigNumber{
    const underlyingToken = +USD / +market.underlying.price.toString();
    const hToken = (underlyingToken / +market.exchangeRate ) * (10 ** (market.underlying.decimals - 8))
    return BigNumber.parseValueSafe(hToken.toString(), market.underlying.decimals);  
}

export default StakeMarketTab