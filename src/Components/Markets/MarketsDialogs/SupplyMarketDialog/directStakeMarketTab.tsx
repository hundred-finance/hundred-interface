import { BigNumber } from "../../../../bigNumber";
import React, {useEffect, useRef, useState} from "react"
import TextBox from "../../../Textbox/textBox";
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
    gaugeV4: GaugeV4
}

const DirectStakeMarketTab:React.FC<Props> = (props: Props) =>{
    const { selectedMarket, selectedMarketSpinners, toggleSpinners, updateMarket, marketsData} = useHundredDataContext()
    const {setSpinnerVisible, toastSuccessMessage, toastErrorMessage} = useUiContext()
    const {library, account} = useWeb3React()

    const [actionsDisabled, setActionsDisabled] = useState<boolean>(false)
    
    const [stakeInput, setStakeInput] = useState<string>("")
    const [stakeValidation, setStakeValidation] = useState<string>("")
    const [unstakeInput, setUnstakeInput] = useState<string>("")
    const [unstakeValidation, setUnstakeValidation] = useState<string>("")

    const mounted = useRef<boolean>(false)

    useEffect(() => {
        mounted.current = true
        return () => {
            mounted.current = false
        }
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
                return;
            }

            if(isNaN(+stakeInput) || isNaN(parseFloat(stakeInput))){
                setStakeValidation("Amount must be a number");
                return;
            } else if (+stakeInput <= 0 && selectedMarket && +{...selectedMarket}.underlying.walletBalance.toString() <= 0) {
                setStakeValidation("No balance to stake");
            } else if (+stakeInput <= 0) {
                setStakeValidation("Amount must be > 0");
                return
            } else if (selectedMarket && +stakeInput > +{...selectedMarket}.underlying.walletBalance) {
                setStakeValidation("Amount must be <= balance");
                return
            } else{
                setStakeValidation("");
            }
        }

        handleStakeAmountChange()
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
    }, [unstakeInput, props.gaugeV4])

    const formatBalance = (value: BigNumber | undefined) => {
        if (value) {
            return value
        } else {
            return BigNumber.from(0)
        }
    }

    const getMaxStake = () : void=> {
        setStakeInput(formatBalance(selectedMarket ? {...selectedMarket}.underlying.walletBalance : BigNumber.from("0")).toString)
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
        if(selectedMarket)
            setStakeInput(
                {...selectedMarket}.underlying.walletBalance
                    .mul(BigNumber.from(ratio * 100))
                    .div(BigNumber.from(100))
                    .toString()
        )
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
  
      const handleApproveUnStake = async (symbol: string) => {
          if(selectedMarket && marketsData){
              
              const market = {...marketsData}.find(x => x?.underlying.symbol === symbol)
              if(market && library){
                  try{
                    setSpinnerVisible(true)
                    toggleSpinners(symbol, SpinnersEnum.unstake)
  
                    const tx = await props.gaugeV4.approveUnstakeCall()
  
                    setSpinnerVisible(false)
  
                    const receipt = await tx.wait()
                    console.log(receipt)
                    if(receipt.status === 1){
                        toastSuccessMessage("Transaction complete, updating contracts")
                        await updateMarket(props.gaugeV4, UpdateTypeEnum.ApproveUnStake)
                    }
                  }
                  catch(error : any){
                      console.log(error)
                      toastErrorMessage(`${error?.message.replace('.', '')} on Approve Unstake}`);
                  }
                  finally{
                      setSpinnerVisible(false)
                      toggleSpinners(symbol, SpinnersEnum.unstake)
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
                      toastErrorMessage(`${error?.message.replace('.', '')} on Untake}`);

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
        selectedMarket && selectedMarketSpinners ?
        <>
            <MarketDialogItem
                title={"You Staked"}
                value={`${formatBalance(BigNumber.from(props.gaugeV4?.userStakedTokenBalance, {...selectedMarket}.underlying.decimals).mul({...selectedMarket}.exchangeRate)).toRound(4)} ${{...selectedMarket}.underlying.symbol}`}
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
            <div className="native-asset-amount">
                <span className="dialog-section-content-value"/>
                <div className={`amount-select ${actionsDisabled ? "amount-select-disabled" : ""}`}>
                    <div onClick={() => setStakeRatio(0.25) }>25%</div>
                    <div onClick={() => setStakeRatio(0.50) }>50%</div>
                    <div onClick={() => setStakeRatio(0.75) }>75%</div>
                    <div onClick={() => setStakeRatio(1) }>100%</div>
                </div>
            </div>
            <div className="input-button-group">
                <TextBox
                    placeholder={`0 ${{...selectedMarket}.underlying.symbol}`}
                    disabled={actionsDisabled}
                    value={stakeInput}
                    setInput={setStakeInput}
                    validation={stakeValidation}
                    button={"Max"}
                    onClick={() => getMaxStake()}/>
                {+props.gaugeV4.userAllowance.toString() > 0 &&
                +props.gaugeV4.userAllowance.toString() >= (stakeInput.trim() === "" || isNaN(+stakeInput) || isNaN(parseFloat(stakeInput)) ? 0 : +stakeInput)
                    ?
                    <MarketDialogButton
                        disabled={stakeInput === "" || actionsDisabled || stakeValidation.trim() !== ""}
                        onClick={() => handleStake({...selectedMarket}.underlying.symbol, stakeInput)}
                    >
                        {{...selectedMarketSpinners}.stakeSpinner ? (
                            <Spinner size={"20px"}/>) : "Stake"}
                    </MarketDialogButton>
                    :
                    <MarketDialogButton
                        disabled={stakeInput === "" || actionsDisabled || stakeValidation.trim() !== ""}
                        onClick={() => handleApproveStake({...selectedMarket}.underlying.symbol)}
                    >
                        {{...selectedMarketSpinners}.stakeSpinner ? (
                            <Spinner size={"20px"}/>) : "Approve"}
                    </MarketDialogButton>
                }
            </div>
            <div className="native-asset-amount">
                <span>{convertGaugeLpAmountToUnderlying(unstakeInput, props?.gaugeV4.gaugeTokenDecimals, {...selectedMarket})} {{...selectedMarket}.underlying.symbol}</span>
                <div className={`amount-select ${actionsDisabled ? "amount-select-disabled" : ""}`}>
                    <div onClick={() => setUnstakeRatio(0.25) }>25%</div>
                    <div onClick={() => setUnstakeRatio(0.50) }>50%</div>
                    <div onClick={() => setUnstakeRatio(0.75) }>75%</div>
                    <div onClick={() => setUnstakeRatio(1) }>100%</div>
                </div>
            </div>
            <div className="input-button-group">
                <TextBox
                    placeholder={`0 h${{...selectedMarket}.underlying.symbol}-gauge`}
                    disabled={actionsDisabled}
                    value={unstakeInput}
                    setInput={setUnstakeInput}
                    validation={unstakeValidation}
                    button={"Max"}
                    onClick={() => getMaxUnstake()}
                />
                {props.gaugeV4 && unstakeInput === "" || unstakeValidation !== "" || (+props.gaugeV4.userGaugeHelperAllowance.toString() > 0 &&
                +props.gaugeV4.userGaugeHelperAllowance.toString().toString() >= (unstakeInput.trim() === "" || isNaN(+unstakeInput) || isNaN(parseFloat(unstakeInput)) ? 0 : +unstakeInput))
                    ?
                    <MarketDialogButton
                        disabled={unstakeInput === "" || actionsDisabled || unstakeValidation !== ""}
                        onClick={() => handleUnstake({...selectedMarket}.underlying.symbol, unstakeInput)}
                    >
                        {{...selectedMarketSpinners}.unstakeSpinner ? (
                            <Spinner size={"20px"}/>) : "Unstake"}
                    </MarketDialogButton>
                    :
                    <MarketDialogButton
                        disabled={unstakeInput === "" || actionsDisabled || unstakeValidation !== ""}
                        onClick={() => handleApproveUnStake({...selectedMarket}.underlying.symbol)}
                    >
                        {{...selectedMarketSpinners}.unstakeSpinner ? (
                            <Spinner size={"20px"}/>) : "Approve"}
                    </MarketDialogButton>
                }
            </div>
            <MarketDialogButton
                disabled={actionsDisabled || props.gaugeV4.userClaimableHnd === undefined || props.gaugeV4.userClaimableHnd?.eq(BigNumber.from(0)) || actionsDisabled}
                onClick={() =>handleMint({...selectedMarket}.underlying.symbol)}
            >
                {{...selectedMarketSpinners}.mintSpinner ? (
                    <Spinner size={"20px"}/>) : "Claim HND"}
            </MarketDialogButton>
        </>
        : null
    )
}

function convertGaugeLpAmountToUnderlying(amount: string, gaugeDecimals: number, market: CTokenInfo) : string{
    return (+amount * +market.exchangeRate / (10 ** (market.underlying.decimals - gaugeDecimals))).toFixed(4)
}

export default DirectStakeMarketTab