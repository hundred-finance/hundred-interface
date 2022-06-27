import { BigNumber } from "../../../bigNumber";
import React, {useEffect, useState} from "react"
import TextBox from "../../Textbox/textBox";
import BorrowLimitSection from "./borrowLimitSection";
import MarketDialogButton from "./marketDialogButton";
import "./supplyMarketDialog.css"
import MarketDialogItem from "./marketDialogItem";
import {Spinner} from "../../../assets/huIcons/huIcons";
import { CTokenInfo } from "../../../Classes/cTokenClass";
import {GaugeV4} from "../../../Classes/gaugeV4Class";
import {stakingApr} from "../aprHelpers";
import { useHundredDataContext } from "../../../Types/hundredDataContext";

interface Props{
    open: boolean,
    stakeDisabled: boolean;
    unstakeDisabled: boolean;
    claimDisabled: boolean;

    handleStake: (symbol: string | undefined, guage: GaugeV4 | null | undefined, amount: string) => Promise<void>
    handleUnstake: (symbol: string | undefined, guage: GaugeV4 | null | undefined, amount: string) => Promise<void>
    handleMint: (symbol: string | undefined, guage: GaugeV4 | null | undefined) => Promise<void>
    handleApproveStake: (symbol: string | undefined, guage: GaugeV4 | null | undefined) => Promise<void>
}
const StakeMarketTab:React.FC<Props> = (props: Props) =>{
    const { generalData, gaugesV4Data, selectedMarket, selectedMarketSpinners } = useHundredDataContext();
    const [newBorrowLimit3, setNewBorrowLimit3] = useState<BigNumber>(BigNumber.from(0));
    const [stakeInput, setStakeInput] = useState<string>("")
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [stakeValidation, setStakeValidation] = useState<string>("")
    const [unstakeInput, setUnstakeInput] = useState<string>("")
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [unstakeValidation, setUnstakeValidation] = useState<string>("")
    let userStakedUnderlyingTokenBalance, gaugeTokenUnderlyingAmount, isStake;
    const gaugeV4 = gaugesV4Data
        ? [...gaugesV4Data].find((x) => {
              return x?.generalData.lpTokenUnderlying === selectedMarket?.underlying.address;
          })
        : null;

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
            } else if (gaugeV4?.userLpBalance && +gaugeV4?.userLpBalance.toString() <= 0) {
                setStakeValidation("No balance to stake");
                setNewBorrowLimit3(BigNumber.from("0"))
            } else if (+stakeInput <= 0) {
                setStakeValidation("Amount must be > 0");
                setNewBorrowLimit3(BigNumber.from("0"))
                return
            } else if (gaugeV4 && +stakeInput > +gaugeV4?.userLpBalance) {
                setStakeValidation("Amount must be <= balance");
                setNewBorrowLimit3(BigNumber.from("0"))
                return
            } else{
                setStakeValidation("");
            }

            if(selectedMarket && generalData){
                const totalBorrow = +generalData.totalBorrowLimit.toString()
                const stake = selectedMarket.isEnterMarket && stakeInput.trim() !== "" ? +convertLpAmountToUnderlying(stakeInput, selectedMarket) : 0
                const price = +selectedMarket.underlying.price.toString()
                const collateral = +selectedMarket.collateralFactor.toString()
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
        setStakeInput(formatBalance(gaugeV4?.userLpBalance).toString)
    }

    const getSafeMaxStake = () : void=> {

        const stake = BigNumber.from('0');
             
        if (selectedMarket && generalData &&
            gaugeV4?.userLpBalance && +selectedMarket.supplyBalanceInTokenUnit.toString() > 0)
        { 

        const borrow = BigNumber.parseValueSafe(generalData.totalBorrowBalance.toString(),selectedMarket.underlying.decimals) ;
        const supply = generalData.totalSupplyBalance;
        const cFactor = BigNumber.parseValueSafe(selectedMarket.collateralFactor.toString(),selectedMarket.underlying.decimals).mulSafe(BigNumber.parseValueSafe('0.5001', selectedMarket.underlying.decimals));
        const percent = +cFactor.toString() === 0 ? 0 : +borrow.toString() / +cFactor.toString()
        const percentBN = BigNumber.parseValueSafe(percent.toString(), selectedMarket.underlying.decimals);
        if (+generalData?.totalBorrowLimitUsedPercent.toRound(2) >= 50.01) {
            setStakeInput(stake.toString());
        } 
        else{
            const result = convertUSDTohToken((supply.subSafe(percentBN)).toString(),selectedMarket); 
        setStakeInput(BigNumber.minimum(result, gaugeV4?.userLpBalance).toString());
        }
        }
                
        else {
            setStakeInput(stake.toString());
        }
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
        setStakeInput(
            BigNumber.from(
                Math.floor(
                    formatBalance(gaugeV4?.userLpBalance).toNumber() * ratio
                ),
                gaugeV4?.userLpBalance._decimals
            ).toString()
        )
    }

    function isBorrowLimitUsed() {
        return newBorrowLimit3 && generalData &&
            (+newBorrowLimit3.toString() > 0 || +newBorrowLimit3.toString() < 0) &&
            (+newBorrowLimit3.toString() > 0 ? +generalData?.totalBorrowBalance.toString() / +newBorrowLimit3.toString() > 0.9 : +generalData?.totalBorrowBalance.toString() / +newBorrowLimit3.toString() * -1 > 0.9) &&
            (+newBorrowLimit3.toString() > 0 ? +generalData?.totalBorrowBalance.toString() / +newBorrowLimit3.toString() * 100 :
                +generalData?.totalBorrowBalance.toString() / +newBorrowLimit3.toString() * -1 * 100) > +generalData.totalBorrowLimitUsedPercent;
    }

    //break down variables
    if (selectedMarket && gaugeV4) {
        //convert lpToken balance to underlying balance i.e. hUSDC -> USDC
        let balance = BigNumber.from(gaugeV4?.userStakedTokenBalance, selectedMarket?.underlying.decimals);
        balance = balance.mul(selectedMarket?.exchangeRate);
        userStakedUnderlyingTokenBalance = formatBalance(balance).toFixed(4);

        //find underlyingAmount
        gaugeTokenUnderlyingAmount = convertGaugeLpAmountToUnderlying(
            unstakeInput,
            gaugeV4.gaugeTokenDecimals,
            selectedMarket,
        ); 
        isStake = props.stakeDisabled || stakeInput === "" || stakeValidation !== "" || isBorrowLimitUsed()   
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
            <BorrowLimitSection generalData={generalData} newBorrowLimit={newBorrowLimit3}/>
            <div className="native-asset-amount">
                <span className="dialog-section-content-value">{selectedMarket ? convertLpAmountToUnderlying(stakeInput, selectedMarket) : null} {selectedMarket?.underlying.symbol}</span>
                <div className="amount-select">
                    <div onClick={() => setStakeRatio(0.25) }>25%</div>
                    <div onClick={() => setStakeRatio(0.50) }>50%</div>
                    <div onClick={() => setStakeRatio(0.75) }>75%</div>
                    <div onClick={() => setStakeRatio(1) }>100%</div>
                </div>
            </div>
            <div className="input-button-group">
                <TextBox
                    placeholder={`0 h${selectedMarket?.underlying.symbol}`}
                    disabled={props.stakeDisabled}
                    value={stakeInput}
                    setInput={setStakeInput}
                    validation={stakeValidation}
                    button={generalData && +generalData.totalBorrowBalance.toString() > 0  ? "Safe Max" : "Max"}
                    buttonTooltip="50% of borrow limit"
                    onClick={() => {generalData && +generalData.totalBorrowBalance.toString() > 0 ? getSafeMaxStake() : getMaxStake()}}/>
                {gaugeV4 && +gaugeV4.userAllowance.toString() > 0 &&
                +gaugeV4.userAllowance.toString().toString() >= (stakeInput.trim() === "" || isNaN(+stakeInput) || isNaN(parseFloat(stakeInput)) ? 0 : +stakeInput)
                    ?
                    <MarketDialogButton
                        disabled={isStake ? isStake : false}
                        onClick={() => props.handleStake(selectedMarket?.underlying.symbol, gaugeV4, stakeInput)}
                    >
                        {selectedMarket && selectedMarketSpinners?.stakeSpinner ? (
                            <Spinner size={"20px"}/>) : "Stake"}
                    </MarketDialogButton>
                    :
                    <MarketDialogButton
                        disabled={isStake ? isStake : false}
                        onClick={() => props.handleApproveStake(selectedMarket?.underlying.symbol, gaugeV4)}
                    >
                        {selectedMarket && selectedMarketSpinners?.stakeSpinner ? (
                            <Spinner size={"20px"}/>) : "Approve"}
                    </MarketDialogButton>
                }
            </div>
            <div className="native-asset-amount">
                <span>{gaugeTokenUnderlyingAmount} {selectedMarket?.underlying.symbol}</span>
                <div className="amount-select">
                    <div onClick={() => setUnstakeRatio(0.25) }>25%</div>
                    <div onClick={() => setUnstakeRatio(0.50) }>50%</div>
                    <div onClick={() => setUnstakeRatio(0.75) }>75%</div>
                    <div onClick={() => setUnstakeRatio(1) }>100%</div>
                </div>
            </div>
            <div className="input-button-group">
                <TextBox
                    placeholder={`0 h${selectedMarket?.underlying.symbol}-g`}
                    disabled={props.unstakeDisabled}
                    value={unstakeInput}
                    setInput={setUnstakeInput}
                    validation={unstakeValidation}
                    button={"Max"}
                    onClick={() => getMaxUnstake()}
                />
                <MarketDialogButton
                    disabled={props.unstakeDisabled || unstakeInput === "" || unstakeValidation !== ""}
                    onClick={() => props.handleUnstake(selectedMarket?.underlying.symbol, gaugeV4, unstakeInput)}
                >
                    {selectedMarket && selectedMarketSpinners?.unstakeSpinner ? (
                        <Spinner size={"20px"}/>) : "Unstake"}
                </MarketDialogButton>
            </div>
            <MarketDialogButton
                disabled={ props.claimDisabled || gaugeV4?.userClaimableHnd === undefined || gaugeV4?.userClaimableHnd?.eq(BigNumber.from(0))}
                onClick={() => props.handleMint(selectedMarket?.underlying.symbol, gaugeV4)}
            >
                {selectedMarket && selectedMarketSpinners ? (
                    <Spinner size={"20px"}/>) : "Claim HND"}
            </MarketDialogButton>
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