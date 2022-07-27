import { BigNumber } from "../../../../bigNumber";
import React, {useEffect, useRef, useState} from "react"
import TextBox from "../../../Textbox/textBox";
import BorrowLimitSection from "./borrowLimitSection";
import MarketDialogButton from "../marketDialogButton";
import "../marketDialog.css"
import MarketDialogItem from "../marketDialogItem";
import {Spinner} from "../../../../assets/huIcons/huIcons";
import { CTokenInfo, SpinnersEnum } from "../../../../Classes/cTokenClass";
import {GaugeV4} from "../../../../Classes/gaugeV4Class";
import {stakingApr} from "../../aprHelpers";
import { useHundredDataContext } from "../../../../Types/hundredDataContext";
import { useUiContext } from "../../../../Types/uiContext";
import { useWeb3React } from "@web3-react/core";
import { UpdateTypeEnum } from "../../../../Hundred/Data/hundredData";

interface Props{
    gaugeV4: GaugeV4,
}

const StakeMarketTab:React.FC<Props> = (props: Props) =>{
    const {generalData, selectedMarket, selectedMarketSpinners, marketsData, toggleSpinners, updateMarket} = useHundredDataContext()
    const {setSpinnerVisible, toastErrorMessage, toastSuccessMessage} = useUiContext()
    const { library, account } = useWeb3React()

    const mounted = useRef<boolean>(false)
    const [newBorrowLimit, setNewBorrowLimit] = useState<BigNumber>(BigNumber.from(0))
    const [actionsDisabled, setActionsDisabled] = useState<boolean>(false)
    const [stakeInput, setStakeInput] = useState<string>("")
    const [stakeValidation, setStakeValidation] = useState<string>("")
    const [unstakeInput, setUnstakeInput] = useState<string>("")
    const [unstakeValidation, setUnstakeValidation] = useState<string>("")


    useEffect(() => {
        mounted.current = true

        return () => {mounted.current = false}

    }, [])

    useEffect(() => {
        if(selectedMarketSpinners){
            const spinner = {...selectedMarketSpinners}.spinner
            if(mounted.current){
                if(spinner) setActionsDisabled(true)
                else setActionsDisabled(false)
            }
        }

    }, [selectedMarketSpinners?.spinner])

    useEffect(()=>{
        const handleStakeAmountChange = () => {

            if(stakeInput.trim() === ""){
                setStakeValidation("")
                setNewBorrowLimit(BigNumber.from("0"))
                return;
            }

            if(isNaN(+stakeInput) || isNaN(parseFloat(stakeInput))){
                setStakeValidation("Amount must be a number");
                setNewBorrowLimit(BigNumber.from("0"))
                return;
            } else if (+stakeInput <= 0 && props.gaugeV4?.userLpBalance && +props.gaugeV4?.userLpBalance.toString() <= 0) {
                setStakeValidation("No balance to stake");
                setNewBorrowLimit(BigNumber.from("0"))
            } else if (+stakeInput <= 0) {
                setStakeValidation("Amount must be > 0");
                setNewBorrowLimit(BigNumber.from("0"))
                return
            } else if (props.gaugeV4 && +stakeInput > +props.gaugeV4?.userLpBalance) {
                setStakeValidation("Amount must be <= balance");
                setNewBorrowLimit(BigNumber.from("0"))
                return
            } else{
                setStakeValidation("");
            }
            
            if(selectedMarket && generalData){
                const totalBorrow = +{...generalData}.totalBorrowLimit.toString()
                const stake = {...selectedMarket}.isEnterMarket && stakeInput.trim() !== "" ? +convertLpAmountToUnderlying(stakeInput, {...selectedMarket}) : 0
                const price = +{...selectedMarket}.underlying.price.toString()
                const collateral = +{...selectedMarket}.collateralFactor.toString()
                const newTotalSupply = stake * price * collateral
                const borrow = totalBorrow - newTotalSupply
                setNewBorrowLimit(BigNumber.parseValue(borrow.noExponents()))
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

    const formatBalance = (value: BigNumber | undefined) => {
        if (value) {
            return value
        } else {
            return BigNumber.from(0)
        }
    }

    const getMaxStake = () : void=> {
        setStakeInput(formatBalance(props.gaugeV4?.userLpBalance).toString)
    }

    const getSafeMaxStake = () : void=> {
        const stake = BigNumber.from('0');
             
        if (selectedMarket && generalData && props.gaugeV4?.userLpBalance && +{...selectedMarket}.supplyBalanceInTokenUnit.toString() > 0)
        { 
            const general = {...generalData}
            const market = {...selectedMarket}
            const borrow = BigNumber.parseValueSafe(general.totalBorrowBalance.toString(), market.underlying.decimals) ;
            const supply = general.totalSupplyBalance;
            const cFactor = BigNumber.parseValueSafe(market.collateralFactor.toString(),market.underlying.decimals).mulSafe(BigNumber.parseValueSafe('0.5001', market.underlying.decimals));
            const percent = +cFactor.toString() === 0 ? 0 : +borrow.toString() / +cFactor.toString()
            const percentBN = BigNumber.parseValueSafe(percent.toString(), market.underlying.decimals);
        
            if (+generalData.totalBorrowLimitUsedPercent.toRound(2) >= 50.01) {
                setStakeInput(stake.toString());
            } 
            else{
                const result = convertUSDTohToken((supply.subSafe(percentBN)).toString(), market); 
            setStakeInput(BigNumber.minimum(result, props.gaugeV4?.userLpBalance).toString());
            }
        }
                
        else {
            setStakeInput(stake.toString());
        }
    }

    const getMaxUnstake = () : void=> {
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

    function isBorrowLimitUsed() {
        return newBorrowLimit && generalData ?
            (+newBorrowLimit.toString() > 0 || +newBorrowLimit.toString() < 0) && (+newBorrowLimit.toString() > 0 
            ? +{...generalData}.totalBorrowBalance.toString() / +newBorrowLimit.toString() > 0.9 
            : +{...generalData}.totalBorrowBalance.toString() / +newBorrowLimit.toString() * -1 > 0.9) && (+newBorrowLimit.toString() > 0 
            ? +{...generalData}.totalBorrowBalance.toString() / +newBorrowLimit.toString() * 100 
            : +{...generalData}.totalBorrowBalance.toString() / +newBorrowLimit.toString() * -1 * 100) > +{...generalData}.totalBorrowLimitUsedPercent
            : false
    }

    const handleApproveStake = async (symbol: string) => {
        if(selectedMarket){
            const market = [...marketsData].find(x=> x.underlying.symbol === symbol)
            if(market && library){
                try{
                    if (!market.isNativeToken) {
                        setSpinnerVisible(true)
                        toggleSpinners(market.underlying.symbol, SpinnersEnum.stake)
                        
                        const tx = await props.gaugeV4.approveCall(market)
                        
                        setSpinnerVisible(false)
                        const receipt = await tx.wait()
                        console.log(receipt)
                        if(receipt.status === 1){
                            toastSuccessMessage("Transaction complete, updating contracts")
                            await updateMarket(market, UpdateTypeEnum.ApproveStake)
                        }
                    }
                }
                catch(error: any){
                    console.log(error)
                    toastErrorMessage(`${error?.message.replace('.', '')} on Approve Stake}`);
                }
                finally{
                    setSpinnerVisible(false)
                    toggleSpinners(market.underlying.symbol, SpinnersEnum.stake)
                }
            }
        }
    }

    const handleStake = async (symbol: string | undefined, amount: string) => {
        if(selectedMarket && marketsData){
            const market = [...marketsData].find(x=> x.underlying.symbol === symbol)
            if(props.gaugeV4.generalData.gaugeHelper && library && symbol && market && account){
                try{
                    setSpinnerVisible(true)
                    toggleSpinners(symbol, SpinnersEnum.stake)

                    const tx = await props.gaugeV4.stakeCall(amount, market)
                    
                    setSpinnerVisible(false)
                    const receipt = await tx.wait()
                    console.log(receipt)
                    if(receipt.status === 1){
                        toastSuccessMessage("Transaction complete, updating contracts")
                        await updateMarket(props.gaugeV4, UpdateTypeEnum.Stake)
                        if(mounted) setStakeInput("")
                    }
                }
                catch(error: any){
                    console.log(error)
                    toastErrorMessage(`${error?.message.replace('.', '')} on Stake}`);
                }
                finally{
                    setSpinnerVisible(false)
                    toggleSpinners(symbol, SpinnersEnum.stake)
                }
            }
        }
    }
  
    const handleUnstake = async (symbol: string, amount: string) => {
        if(selectedMarket && marketsData){
          const markets = [...marketsData]
            const market = markets.find(x => x?.underlying.symbol === symbol)
            const nativeTokenMarket = markets.find(x => x.isNativeToken === true) 
            if(market && library && account && props.gaugeV4.generalData.gaugeHelper){
                try{
                  setSpinnerVisible(true)
                  toggleSpinners(symbol, SpinnersEnum.unstake)
                  const tx = await props.gaugeV4.unstakeCall(amount, market, nativeTokenMarket?.pTokenAddress)
                    
                  setSpinnerVisible(false)
                  const receipt = await tx.wait()
                  console.log(receipt)
                  if(receipt.status === 1){
                    toastSuccessMessage("Transaction complete, updating contracts")
                    await updateMarket(props.gaugeV4, UpdateTypeEnum.Unstake)
                    if(mounted.current) setUnstakeInput("")
                  }
                }
                catch(error : any){
                    console.log(error)
                    toastErrorMessage(`${error?.message.replace('.', '')} on Unstake}`);
                }
                finally{
                    setSpinnerVisible(false)
                    toggleSpinners(symbol, SpinnersEnum.unstake)
                }
            }
        }
      }
  
      const handleMint = async (symbol: string) => {
          if(selectedMarket){
              const market = [...marketsData].find(x => x.underlying.symbol === symbol)
              if(market && library){
                  try{
                        setSpinnerVisible(true)
                        toggleSpinners(symbol, SpinnersEnum.mint)

                        const tx = await props.gaugeV4.mintCall()
                      
                        setSpinnerVisible(false)

                        const receipt = await tx.wait()
                        console.log(receipt)
                        if(receipt.status === 1){
                            toastSuccessMessage("Transaction complete, updating contracts")
                            await updateMarket(props.gaugeV4, UpdateTypeEnum.Mint)
                        }
                  }
                  catch(error: any){
                      console.log(error)
                      toastErrorMessage(`${error?.message.replace('.', '')} on Mint}`);
                  }
                  finally{
                      setSpinnerVisible(false)
                      toggleSpinners(symbol, SpinnersEnum.mint)
                  }
              }
          }
      }

    return (
        selectedMarket && selectedMarketSpinners && generalData?
        <>
            <MarketDialogItem
                title={"You Staked"}
                value={`${formatBalance(BigNumber.from(props.gaugeV4?.userStakedTokenBalance, {...selectedMarket}.underlying.decimals).mul({...selectedMarket}.exchangeRate)).toFixed(4)} ${{...selectedMarket}.underlying.symbol}`}
            />
            <MarketDialogItem
                title={"Claimable"}
                value={`${+formatBalance(props.gaugeV4?.userClaimableHnd).toString() > 0 
                    ? +formatBalance(props.gaugeV4?.userClaimableHnd).toFixed(4) === 0
                    ? ">0.0001"
                    : formatBalance(props.gaugeV4?.userClaimableHnd).toFixed(4)
                    : "0.0000"} HND`}
            />
            <MarketDialogItem
                title={"APR"}
                value={stakingApr({...selectedMarket}, props.gaugeV4)}
            />
            <BorrowLimitSection newBorrowLimit={newBorrowLimit}/>
            <div className="native-asset-amount">
                <span className="dialog-section-content-value">{convertLpAmountToUnderlying(stakeInput, {...selectedMarket})} {{...selectedMarket}.underlying.symbol}</span>
                <div className={`amount-select ${actionsDisabled ? "amount-select-disabled": ""}`}>
                    <div onClick={() => setStakeRatio(0.25) }>25%</div>
                    <div onClick={() => setStakeRatio(0.50) }>50%</div>
                    <div onClick={() => setStakeRatio(0.75) }>75%</div>
                    <div onClick={() => setStakeRatio(1) }>100%</div>
                </div>
            </div>
            <div className="input-button-group">
                <TextBox
                    placeholder={`0 h${{...selectedMarket}.underlying.symbol}`}
                    disabled={actionsDisabled}
                    value={stakeInput}
                    setInput={setStakeInput}
                    validation={stakeValidation}
                    button={+{...generalData}.totalBorrowBalance.toString() > 0  ? "Safe Max" : "Max"}
                    buttonTooltip="50% of borrow limit"
                    onClick={() => {+generalData.totalBorrowBalance.toString() > 0 ? getSafeMaxStake() : getMaxStake()}}/>
                {props.gaugeV4 && +props.gaugeV4.userAllowance.toString() > 0 &&
                +props.gaugeV4.userAllowance.toString().toString() >= (stakeInput.trim() === "" || isNaN(+stakeInput) || isNaN(parseFloat(stakeInput)) ? 0 : +stakeInput)
                    ?
                    <MarketDialogButton
                        disabled={stakeInput === "" || stakeValidation !== "" || isBorrowLimitUsed() || actionsDisabled}
                        onClick={() => handleStake({...selectedMarket}.underlying.symbol, stakeInput)}
                    >
                        {{...selectedMarketSpinners}.stakeSpinner ? (
                            <Spinner size={"20px"}/>) : "Stake"}
                    </MarketDialogButton>
                    :
                    <MarketDialogButton
                        disabled={stakeInput === "" || stakeValidation !== "" || isBorrowLimitUsed() || actionsDisabled}
                        onClick={() => handleApproveStake({...selectedMarket}.underlying.symbol)}
                    >
                        {{...selectedMarketSpinners}.stakeSpinner ? (
                            <Spinner size={"20px"}/>) : "Approve"}
                    </MarketDialogButton>
                }
            </div>
            <div className={`amount-select ${actionsDisabled ? "amount-select-disabled" : ""}`}>
                <span>{convertGaugeLpAmountToUnderlying(unstakeInput, props?.gaugeV4.gaugeTokenDecimals, {...selectedMarket})} {{...selectedMarket}.underlying.symbol}</span>
                <div className="amount-select">
                    <div onClick={() => setUnstakeRatio(0.25) }>25%</div>
                    <div onClick={() => setUnstakeRatio(0.50) }>50%</div>
                    <div onClick={() => setUnstakeRatio(0.75) }>75%</div>
                    <div onClick={() => setUnstakeRatio(1) }>100%</div>
                </div>
            </div>
            <div className="input-button-group">
                <TextBox
                    placeholder={`0 h${{...selectedMarket}.underlying.symbol}-g`}
                    disabled={actionsDisabled}
                    value={unstakeInput}
                    setInput={setUnstakeInput}
                    validation={unstakeValidation}
                    button={"Max"}
                    onClick={() => getMaxUnstake()}
                />
                <MarketDialogButton
                    disabled={unstakeInput === "" || unstakeValidation !== "" || actionsDisabled}
                    onClick={() => handleUnstake({...selectedMarket}.underlying.symbol, unstakeInput)}
                >
                    {{...selectedMarketSpinners}.unstakeSpinner ? (
                        <Spinner size={"20px"}/>) : "Unstake"}
                </MarketDialogButton>
            </div>
            <MarketDialogButton
                disabled={props?.gaugeV4?.userClaimableHnd === undefined || props?.gaugeV4?.userClaimableHnd?.eq(BigNumber.from(0)) || actionsDisabled}
                onClick={() => handleMint({...selectedMarket}.underlying.symbol)}
            >
                {{...selectedMarketSpinners}.mintSpinner ? (
                    <Spinner size={"20px"}/>) : "Claim HND"}
            </MarketDialogButton>
        </>
        : null
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