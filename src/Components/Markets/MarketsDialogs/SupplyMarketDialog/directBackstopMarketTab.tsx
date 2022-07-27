import { BigNumber } from "../../../../bigNumber";
import React, {useEffect, useRef, useState} from "react"
import TextBox from "../../../Textbox/textBox";
import MarketDialogButton from "../marketDialogButton";
import "../marketDialog.css"
import MarketDialogItem from "../marketDialogItem";
import {Spinner} from "../../../../assets/huIcons/huIcons";
import {GaugeV4} from "../../../../Classes/gaugeV4Class";
import {stakingApr} from "../../aprHelpers";
import { useHundredDataContext } from "../../../../Types/hundredDataContext";
import { useUiContext } from "../../../../Types/uiContext";
import { useWeb3React } from "@web3-react/core";
import { SpinnersEnum } from "../../../../Classes/cTokenClass";
import { UpdateTypeEnum } from "../../../../Hundred/Data/hundredData";

interface Props{
    gaugeV4: GaugeV4
}
const DirectBackstopStakeMarketTab:React.FC<Props> = (props: Props) =>{
    const { selectedMarket, selectedMarketSpinners, marketsData, toggleSpinners, updateMarket} = useHundredDataContext()
    const { library, account } = useWeb3React()
    const { setSpinnerVisible, toastErrorMessage, toastSuccessMessage } = useUiContext()

    const mounted = useRef<boolean>(false)

    const [actionsDisabled, setActionsDisabled] = useState<boolean>(false)
    
    const [stakeInput, setStakeInput] = useState<string>("")
    const [stakeValidation, setStakeValidation] = useState<string>("")
    
    const [unstakeInput, setUnstakeInput] = useState<string>("")
    const [unstakeValidation, setUnstakeValidation] = useState<string>("")

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
            } else if (+stakeInput <= 0 && selectedMarket && {...selectedMarket}.underlying.walletBalance && +{...selectedMarket}.underlying.walletBalance.toString() <= 0) {
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
        setStakeInput(formatBalance(selectedMarket ? {...selectedMarket}.underlying.walletBalance : BigNumber.from("0")).toString())
    }

    // const getSafeMaxStake = () : void=> {
    //     const stake = BigNumber.from('0');
    //     setStakeInput(stake.toString());
    // }

    const getMaxUnstake = () : void=> {
        setUnstakeInput(formatBalance(props.gaugeV4?.userStakeBalance).toString())
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
        if(selectedMarket)
            setStakeInput(
                {...selectedMarket}.underlying.walletBalance
                    .mul(BigNumber.from(ratio * 100))
                    .div(BigNumber.from(100))
                    .toString()
            )
        else setStakeInput("0")
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
        if (!props.gaugeV4 || !selectedMarket 
             || (!props.gaugeV4.userStakedTokenBalance || !props.gaugeV4.generalData.backstopTotalBalance || !props.gaugeV4.generalData.backstopTotalSupply) 
             || (!{...selectedMarket}.exchangeRate) || !{...selectedMarket}?.underlying.decimals) {
            return BigNumber.from(0)
        }

        const totalBalance = BigNumber.from(props.gaugeV4.generalData.backstopTotalBalance, 8)
        const totalSupply = BigNumber.from(props.gaugeV4.generalData.backstopTotalSupply, 18)

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

    const handleApproveStake = async (symbol: string) => {
        if(selectedMarket){
            const market = [...marketsData].find(x=> x.underlying.symbol === symbol)
            if(market && library){
                try{
                    if (!market.isNativeToken) {
                        setSpinnerVisible(true)
                        toggleSpinners(market.underlying.symbol, SpinnersEnum.backstopDeposit)
                        
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
                    toggleSpinners(market.underlying.symbol, SpinnersEnum.backstopDeposit)
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
                    toggleSpinners(symbol, SpinnersEnum.backstopDeposit)

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
                    toggleSpinners(symbol, SpinnersEnum.backstopDeposit)
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
                    toggleSpinners(symbol, SpinnersEnum.backstopWithdraw)
  
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
                      toggleSpinners(symbol, SpinnersEnum.backstopWithdraw)
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
                    toggleSpinners(symbol, SpinnersEnum.backstopWithdraw)

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
                      toggleSpinners(symbol, SpinnersEnum.backstopWithdraw)
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
                        toggleSpinners(symbol, SpinnersEnum.backstopClaim)

                        const tx = await props.gaugeV4.mintCall()
                      
                        setSpinnerVisible(false)

                        const receipt = await tx.wait()
                        console.log(receipt)
                        if (receipt.status === 1){
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
                      toggleSpinners(symbol, SpinnersEnum.backstopClaim)
                  }
              }
          }
      }

    return ( selectedMarket && selectedMarketSpinners && mounted?
        <>
            <MarketDialogItem
                title={"You Staked"}
                value={`${formatBalance(getStakedBalance()).toFixed(4)} ${{...selectedMarket}.underlying.symbol}`}
            />
            <MarketDialogItem
                title={"Claimable"}
                value={`${+formatBalance(props.gaugeV4?.userClaimableHnd) > 0 ? +formatBalance(props.gaugeV4?.userClaimableHnd).toFixed(4)===0
                    ? ">0.0001"  
                    : formatBalance(props.gaugeV4?.userClaimableHnd).toFixed(4)
                    : "0.000"} HND`}
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
                    placeholder={`${{...selectedMarket}.underlying.symbol}`}
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
                        disabled={stakeInput === "" || stakeValidation !== "" || actionsDisabled}
                        onClick={() => handleStake({...selectedMarket}.underlying.symbol, stakeInput)}
                    >
                        {{...selectedMarketSpinners}.backstopDepositSpinner ? (
                            <Spinner size={"20px"}/>) : "Stake"}
                    </MarketDialogButton>
                    :
                    <MarketDialogButton
                        disabled={stakeInput === "" || stakeValidation !== "" || actionsDisabled}
                        onClick={() => handleApproveStake({...selectedMarket}.underlying.symbol)}
                    >
                        {{...selectedMarketSpinners}.backstopDepositSpinner ? (
                            <Spinner size={"20px"}/>) : "Approve"}
                    </MarketDialogButton>
                }
            </div>
            <div className="native-asset-amount">
                <span>{convertGaugeLpAmountToUnderlying(unstakeInput)} {{...selectedMarket}.underlying.symbol}</span>
                <div className={`amount-select ${actionsDisabled ? "amount-select-disabled" : ""}`}>
                    <div onClick={() => setUnstakeRatio(0.25) }>25%</div>
                    <div onClick={() => setUnstakeRatio(0.50) }>50%</div>
                    <div onClick={() => setUnstakeRatio(0.75) }>75%</div>
                    <div onClick={() => setUnstakeRatio(1) }>100%</div>
                </div>
            </div>
            <div className="input-button-group">
                <TextBox
                    placeholder={`bh${{...selectedMarket}.underlying.symbol}-gauge`}
                    disabled={actionsDisabled}
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
                        disabled={unstakeInput === "" || unstakeValidation !== "" || actionsDisabled}
                        onClick={() => handleUnstake({...selectedMarket}.underlying.symbol, unstakeInput)}
                    >
                        {{...selectedMarketSpinners}.backstopWithdrawSpinner ? (
                            <Spinner size={"20px"}/>) : "Unstake"}
                    </MarketDialogButton>
                    :
                    <MarketDialogButton
                        disabled={unstakeInput === "" || unstakeValidation !== "" || actionsDisabled}
                        onClick={() => handleApproveUnStake({...selectedMarket}.underlying.symbol)}
                    >
                        {{...selectedMarketSpinners}.backstopWithdrawSpinner ? (
                            <Spinner size={"20px"}/>) : "Approve"}
                    </MarketDialogButton>
                }
            </div>
            <MarketDialogButton
                disabled={props?.gaugeV4?.userClaimableHnd === undefined || 
                    props?.gaugeV4?.userClaimableHnd?.eq(BigNumber.from(0)) || actionsDisabled}
                onClick={() => handleMint({...selectedMarket}.underlying.symbol)}
            >
                {{...selectedMarketSpinners}.backstopClaimSpinner ? (
                    <Spinner size={"20px"}/>) : "Claim HND"}
            </MarketDialogButton>
        </>
        : null
    )
}

export default DirectBackstopStakeMarketTab