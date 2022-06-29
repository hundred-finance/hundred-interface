import { BigNumber } from "../../../../bigNumber";
import React, {useEffect, useState} from "react"
import TextBox from "../../../Textbox/textBox";
import MarketDialogButton from "../marketDialogButton";
import "../supplyMarketDialog.css"
import MarketDialogItem from "../marketDialogItem";
import {Spinner} from "../../../../assets/huIcons/huIcons";
import { CTokenInfo } from "../../../../Classes/cTokenClass";
import { GaugeV4 } from "../../../../Classes/gaugeV4Class";
import {stakingApr} from "../../aprHelpers";
import { useHundredDataContext } from "../../../../Types/hundredDataContext";

interface Props{
    open: boolean;
    stakeDisabled: boolean;
    unstakeDisabled: boolean;
    claimDisabled: boolean;
    handleStake: (symbol: string | undefined, guage: GaugeV4 | null | undefined, amount: string) => Promise<void>;
    handleUnstake: (symbol: string | undefined, guage: GaugeV4 | null | undefined, amount: string) => Promise<void>;
    handleMint: (symbol: string | undefined, guage: GaugeV4 | null | undefined) => Promise<void>;
    handleApproveStake: (symbol: string | undefined, guage: GaugeV4 | null | undefined) => Promise<void>;
    handleApproveUnStake: (symbol: string | undefined, guage: GaugeV4 | null | undefined) => Promise<void>;
}
const DirectStakeMarketTab: React.FC<Props> = (props: Props) => {
    const { gaugesV4Data, selectedMarket, selectedMarketSpinners } = useHundredDataContext();
    const [stakeInput, setStakeInput] = useState<string>('');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [stakeValidation, setStakeValidation] = useState<string>('');
    const [unstakeInput, setUnstakeInput] = useState<string>('');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [unstakeValidation, setUnstakeValidation] = useState<string>('');
    let underlyingAmount, isStake, isUnstake, userStakedUnderlyingTokenBalance;
    const gaugeV4 = gaugesV4Data
        ? [...gaugesV4Data].find((x) => {
              return x?.generalData.lpTokenUnderlying === selectedMarket?.underlying.address;
          })
        : null;

    useEffect(()=>{
        const handleStakeAmountChange = () => {

            if(stakeInput.trim() === ""){
                setStakeValidation("")
                return;
            }

            if(isNaN(+stakeInput) || isNaN(parseFloat(stakeInput))){
                setStakeValidation("Amount must be a number");
                return;
            } else if (selectedMarket && selectedMarket.underlying.walletBalance && +selectedMarket.underlying.walletBalance.toString() <= 0) {
                setStakeValidation("No balance to stake");
            } else if (+stakeInput <= 0) {
                setStakeValidation("Amount must be > 0");
                return
            } else if (selectedMarket && +stakeInput > +selectedMarket.underlying.walletBalance) {
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
        setStakeInput(formatBalance(selectedMarket?.underlying.walletBalance).toString)
    }

    const getMaxUnstake = () : void=> {
        setUnstakeInput(formatBalance(gaugeV4?.userStakeBalance).toString)
    }

    const setUnstakeRatio = (ratio: number) => {
        setUnstakeInput(
            BigNumber.from(
                Math.floor(
                    formatBalance(gaugeV4?.userStakeBalance).toNumber() * ratio
                ),
                gaugeV4?.userStakeBalance._decimals
            ).toString()
        )
    }

    const setStakeRatio = (ratio: number) => {
        if(selectedMarket)
        setStakeInput(
            selectedMarket.underlying.walletBalance
                .mul(BigNumber.from(ratio * 100))
                .div(BigNumber.from(100))
                .toString()
        )
    }

    //break down variables
    if (selectedMarket && gaugeV4) {
        //convert lpToken balance to underlying balance i.e. hUSDC -> USDC
        let balance = BigNumber.from(gaugeV4?.userStakedTokenBalance, selectedMarket?.underlying.decimals);
        balance = balance.mul(selectedMarket?.exchangeRate);
        userStakedUnderlyingTokenBalance = formatBalance(balance).toFixed(4);

        //find underlyingAmount
        underlyingAmount = convertGaugeLpAmountToUnderlying(unstakeInput, gaugeV4?.gaugeTokenDecimals, selectedMarket);

        //boolean to decide rendering stake or approveStake
        //STEP 1: find valid stakeInput
        const isStakeInputValid = stakeInput.trim() === '' || isNaN(+stakeInput) || isNaN(parseFloat(stakeInput));
        const validStakeInput = isStakeInputValid ? 0 : +stakeInput;
        //STEP 2: find if allowance is > 0 and also >= stakeInput
        isStake = +selectedMarket.underlying.gaugeHelperAllowance.toString() > 0;
        isStake = isStake && +selectedMarket.underlying.gaugeHelperAllowance.toString() >= validStakeInput;

        //boolean to decide rendering unstake or approveUnstake
        isUnstake = gaugeV4 && unstakeInput === '';
        isUnstake = isUnstake || unstakeValidation !== '';
        //STEP 1: find valid unstakeInput
        const isUnstakeInputValid =
            unstakeInput.trim() === '' || isNaN(+unstakeInput) || isNaN(parseFloat(unstakeInput));
        const validUnstakeInput = isUnstakeInputValid ? 0 : +unstakeInput;
        //STEP 2: find if allowance is > 0 and also >= unstakeInput
        let isUnstakeAllowanceValid = +gaugeV4.userGaugeHelperAllowance.toString() > 0;
        isUnstakeAllowanceValid =
            isUnstakeAllowanceValid && +gaugeV4.userGaugeHelperAllowance.toString() >= validUnstakeInput;
        isUnstake = isUnstake || isUnstakeAllowanceValid;
    }

    return (
        <>
            <MarketDialogItem
                title={"You Staked"}
                value={`${userStakedUnderlyingTokenBalance}` + `${selectedMarket?.underlying.symbol}`}
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
                    placeholder={`${selectedMarket?.underlying.symbol}`}
                    disabled={props.stakeDisabled}
                    value={stakeInput}
                    setInput={setStakeInput}
                    validation={stakeValidation}
                    button={"Max"}
                    onClick={() => getMaxStake()}/>
                { isStake ?
                    <MarketDialogButton
                        disabled={props.stakeDisabled || stakeInput === "" || stakeValidation !== ""}
                        onClick={() => props.handleStake(selectedMarket?.underlying.symbol, gaugeV4, stakeInput)}
                    >
                        {selectedMarket && selectedMarketSpinners?.stakeSpinner ? (
                            <Spinner size={"20px"}/>) : "Stake"}
                    </MarketDialogButton>
                    :
                    <MarketDialogButton
                        disabled={props.stakeDisabled || stakeInput === "" || stakeValidation !== ""}
                        onClick={() => props.handleApproveStake(selectedMarket?.underlying.symbol, gaugeV4)}
                    >
                        {selectedMarket && selectedMarketSpinners?.stakeSpinner ? (
                            <Spinner size={"20px"}/>) : "Approve"}
                    </MarketDialogButton>
                }
            </div>
            <div className="native-asset-amount">
                {underlyingAmount} {selectedMarket?.underlying.symbol}
                <div className="amount-select">
                    <div onClick={() => setUnstakeRatio(0.25) }>25%</div>
                    <div onClick={() => setUnstakeRatio(0.50) }>50%</div>
                    <div onClick={() => setUnstakeRatio(0.75) }>75%</div>
                    <div onClick={() => setUnstakeRatio(1) }>100%</div>
                </div>
            </div>
            <div className="input-button-group">
                <TextBox
                    placeholder={`h${selectedMarket?.underlying.symbol}-gauge`}
                    disabled={props.unstakeDisabled}
                    value={unstakeInput}
                    setInput={setUnstakeInput}
                    validation={unstakeValidation}
                    button={"Max"}
                    onClick={() => getMaxUnstake()}
                />
                { isUnstake ?
                    <MarketDialogButton
                        disabled={props.unstakeDisabled || unstakeInput === "" || unstakeValidation !== ""}
                        onClick={() => props.handleUnstake(selectedMarket?.underlying.symbol, gaugeV4, unstakeInput)}
                    >
                        {selectedMarket && selectedMarketSpinners?.unstakeSpinner ? (
                            <Spinner size={"20px"}/>) : "Unstake"}
                    </MarketDialogButton>
                    :
                    <MarketDialogButton
                        disabled={props.unstakeDisabled || unstakeInput === "" || unstakeValidation !== ""}
                        onClick={() => props.handleApproveUnStake(selectedMarket?.underlying.symbol, gaugeV4)}
                    >
                        {selectedMarket && selectedMarketSpinners?.unstakeSpinner ? (
                            <Spinner size={"20px"}/>) : "Approve"}
                    </MarketDialogButton>
                }
            </div>
            <MarketDialogButton
                disabled={ props.claimDisabled || gaugeV4?.userClaimableHnd === undefined || gaugeV4?.userClaimableHnd?.eq(BigNumber.from(0))}
                onClick={() => props.handleMint(selectedMarket?.underlying.symbol, gaugeV4)}
            >
                {selectedMarket && selectedMarketSpinners?.mintSpinner ? (
                    <Spinner size={"20px"}/>) : "Claim HND"}
            </MarketDialogButton>
        </>
    )
}

function convertGaugeLpAmountToUnderlying(amount: string, gaugeDecimals: number, market: CTokenInfo) : string{
    return (+amount * +market.exchangeRate / (10 ** (market.underlying.decimals - gaugeDecimals))).toFixed(4)
}

export default DirectStakeMarketTab