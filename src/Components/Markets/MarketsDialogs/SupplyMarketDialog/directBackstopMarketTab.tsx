import { BigNumber } from "../../../../bigNumber";
import React, {useEffect, useState} from "react"
import TextBox from "../../../Textbox/textBox";
import MarketDialogButton from "../marketDialogButton";
import "../supplyMarketDialog.css"
import MarketDialogItem from "../marketDialogItem";
import {Spinner} from "../../../../assets/huIcons/huIcons";
import {GaugeV4} from "../../../../Classes/gaugeV4Class";
import {stakingApr} from "../../aprHelpers";
import { useHundredDataContext } from "../../../../Types/hundredDataContext";
import { getDirectBackstopMarketTabVariables } from "./backstopHelper";

interface Props{
    open: boolean,
    stakeDisabled: boolean,
    unstakeDisabled: boolean,
    backstopClaimDisabled: boolean,
    handleStake: (symbol: string | undefined, guage: GaugeV4 | null | undefined, amount: string) => Promise<void>
    handleUnstake: (symbol: string | undefined, guage: GaugeV4 | null | undefined, amount: string) => Promise<void>
    handleMint: (symbol: string | undefined, guage: GaugeV4 | null | undefined) => Promise<void>
    handleApproveStake: (symbol: string | undefined, guage: GaugeV4 | null | undefined) => Promise<void>
    handleApproveUnStake: (symbol: string | undefined, guage: GaugeV4 | null | undefined) => Promise<void>
}
const DirectBackstopStakeMarketTab:React.FC<Props> = (props: Props) =>{
    const {gaugesV4Data, selectedMarket, selectedMarketSpinners} = useHundredDataContext()
    const [stakeInput, setStakeInput] = useState<string>("")
    const [stakeValidation, setStakeValidation] = useState<string>("")
    const [unstakeInput, setUnstakeInput] = useState<string>("")
    const [unstakeValidation, setUnstakeValidation] = useState<string>("")
    let isStake, isUnstake;
    let gaugeV4 : GaugeV4 | null | undefined; 
    if (selectedMarket){
        gaugeV4 = gaugesV4Data
            ? [...gaugesV4Data].find((x) => {
                    return x?.generalData.lpTokenUnderlying === {...selectedMarket}.underlying.address;
                })
            : null;
    }
    useEffect(()=>{
        const handleStakeAmountChange = () => {

            if(stakeInput.trim() === ""){
                setStakeValidation("")
                return;
            }

            if(isNaN(+stakeInput) || isNaN(parseFloat(stakeInput))){
                setStakeValidation("Amount must be a number");
                return;
            } else if (selectedMarket && {...selectedMarket}.underlying.walletBalance && +{...selectedMarket}.underlying.walletBalance.toString() <= 0) {
                setStakeValidation("No balance to stake");
            } else if (+stakeInput <= 0) {
                setStakeValidation("Amount must be > 0");
                return
            } else if (selectedMarket && +stakeInput > +{...selectedMarket}?.underlying.walletBalance) {
                setStakeValidation("Amount must be <= balance");
                return
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
            } else if (gaugeV4 && +unstakeInput > +gaugeV4?.userStakeBalance) {
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
        if (selectedMarket)
        setStakeInput(formatBalance({...selectedMarket}?.underlying.walletBalance).toString)
    }

    // const getSafeMaxStake = () : void=> {
    //     const stake = BigNumber.from('0');
    //     setStakeInput(stake.toString());
    // }

    const getMaxUnstake = () : void=> {
        setUnstakeInput(formatBalance(gaugeV4?.userStakeBalance).toString)
    }

    const setUnstakeRatio = (ratio: number) => {
        if(gaugeV4)
        setUnstakeInput(
            BigNumber.from(gaugeV4?.userStakedTokenBalance.toString(), +gaugeV4?.gaugeTokenDecimals.toString())
                .mul(BigNumber.from(100 * ratio))
                .div(BigNumber.from(100))
                .toString()
        )
    }

    const setStakeRatio = (ratio: number) => {
        if(selectedMarket)
        setStakeInput(
            {...selectedMarket}.underlying.walletBalance
                .mul(BigNumber.from(ratio * 100))
                .div(BigNumber.from(100))
                .toString()
        )
    }

    function getStakedBalance() {
        const stakedBalance = BigNumber.from(gaugeV4?.userStakedTokenBalance, gaugeV4?.lpTokenDecimals)
        return convertStakedBalance(stakedBalance);
    }

    function convertGaugeLpAmountToUnderlying(amount: string) : string{
        if (amount.length === 0) {
            return "0.0"
        }
        const stakedBalance = BigNumber.from(amount.replace('.',""), gaugeV4?.lpTokenDecimals)
        return (+convertStakedBalance(stakedBalance)).toFixed(4)
    }

    function convertStakedBalance(stakedBalance: BigNumber) {
        if (!gaugeV4) {
            return BigNumber.from(0)
        }

        if (!gaugeV4.userStakedTokenBalance) {
            return BigNumber.from(0)
        }

        if (!gaugeV4.generalData.backstopTotalBalance) {
            return BigNumber.from(0)
        }

        if (!gaugeV4.generalData.backstopTotalSupply) {
            return BigNumber.from(0)
        }

        if (!selectedMarket?.exchangeRate) {
            return BigNumber.from(0)
        }

        if (!selectedMarket?.underlying.decimals) {
            return BigNumber.from(0)
        }

        const totalBalance = BigNumber.from(gaugeV4.generalData.backstopTotalBalance, 8)
        const totalSupply = BigNumber.from(gaugeV4.generalData.backstopTotalSupply, 18)

        const ratio = (10 ** ({...selectedMarket}.underlying.decimals - 8)).noExponents()
        const ratioDecimals = ratio.split(".").length > 1 ? ratio.split(".")[1].length : 0

        if (+ratio === 0) {
            return BigNumber.from(0)
        }

        if (+totalSupply === 0) {
            return BigNumber.from(0)
        }

        return stakedBalance
            .mul(totalBalance)
            .mul({...selectedMarket}.exchangeRate)
            .div(BigNumber.from(ratio.replace(".", ""), ratioDecimals))
            .div(totalSupply);
    }    
    const bs = getDirectBackstopMarketTabVariables(
        gaugeV4 as GaugeV4,
        stakeInput,
        stakeValidation,
        props.stakeDisabled,
        unstakeInput,
        props.backstopClaimDisabled,
        selectedMarket,
    )

    return (
        <>
            <MarketDialogItem
                title={"You Staked"}
                value={`${formatBalance(getStakedBalance()).toFixed(4)} ${bs.underlyingSymbol}`}
            />
            <MarketDialogItem
                title={"Claimable"}
                value={`${formatBalance(gaugeV4?.userClaimableHnd).toFixed(4)} HND`}
            />
            <MarketDialogItem
                title={"APR"}
                value={stakingApr(selectedMarket, gaugeV4)}
            />
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
                    placeholder={`${bs.underlyingSymbol}`}
                    disabled={props.stakeDisabled}
                    value={stakeInput}
                    setInput={setStakeInput}
                    validation={stakeValidation}
                    button={"Max"}
                    onClick={() => getMaxStake()}/>
                {isStake
                    ?
                    <MarketDialogButton
                        disabled={bs.isStakeDisabled}
                        onClick={() => props.handleStake(bs.underlyingSymbol, gaugeV4, stakeInput)}
                    >
                        {selectedMarket && { ...selectedMarketSpinners }?.stakeSpinner ? (
                            <Spinner size={"20px"}/>) : "Stake"}
                    </MarketDialogButton>
                    :
                    <MarketDialogButton
                        disabled={bs.isStakeDisabled}
                        onClick={() => props.handleApproveStake(bs.underlyingSymbol, gaugeV4)}
                    >
                        {selectedMarket && { ...selectedMarketSpinners }?.stakeSpinner ? (
                            <Spinner size={"20px"}/>) : "Approve"}
                    </MarketDialogButton>
                }
            </div>
            <div className="native-asset-amount">
                {convertGaugeLpAmountToUnderlying(unstakeInput)} {bs.underlyingSymbol}
                <div className="amount-select">
                    <div onClick={() => setUnstakeRatio(0.25) }>25%</div>
                    <div onClick={() => setUnstakeRatio(0.50) }>50%</div>
                    <div onClick={() => setUnstakeRatio(0.75) }>75%</div>
                    <div onClick={() => setUnstakeRatio(1) }>100%</div>
                </div>
            </div>
            <div className="input-button-group">
                <TextBox
                    placeholder={`bh${bs.underlyingSymbol}-gauge`}
                    disabled={props.unstakeDisabled}
                    value={unstakeInput}
                    setInput={setUnstakeInput}
                    validation={unstakeValidation}
                    button={"Max"}
                    onClick={() => getMaxUnstake()}
                />
                {isUnstake ? (
                    <MarketDialogButton
                        disabled={bs.isUnstakeDisabled}
                        onClick={() => props.handleUnstake(bs.underlyingSymbol, gaugeV4, unstakeInput)}
                    >
                        {selectedMarket && { ...selectedMarketSpinners }?.unstakeSpinner ? (
                            <Spinner size={"20px"}/>) : "Unstake"}
                    </MarketDialogButton>
                 ) : (
                    <MarketDialogButton
                        disabled={bs.isUnstakeDisabled}
                        onClick={() => props.handleApproveUnStake(bs.underlyingSymbol, gaugeV4)}
                    >
                        {selectedMarket && { ...selectedMarketSpinners }?.unstakeSpinner ? (
                            <Spinner size={"20px"}/>) : "Approve"}
                    </MarketDialogButton>
                 )
                }
            </div>
            <MarketDialogButton
                disabled={bs.isBackstopClaimDisabled}
                onClick={() => props.handleMint(bs.underlyingSymbol, gaugeV4)}
            >
                {selectedMarket && { ...selectedMarketSpinners }?.mintSpinner ? <Spinner size={'20px'} /> : 'Claim HND'}
            </MarketDialogButton>
        </>
    );
}

export default DirectBackstopStakeMarketTab