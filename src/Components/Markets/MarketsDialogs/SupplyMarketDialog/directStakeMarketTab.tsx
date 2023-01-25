import { BigNumber } from "../../../../bigNumber";
import React, {useEffect, useRef, useState} from "react"
import TextBox from "../../../Textbox/textBox";
import "../marketDialog.css"
import MarketDialogItem from "../marketDialogItem";
import { CTokenInfo, SpinnersEnum } from "../../../../Classes/cTokenClass";
import {GaugeV4} from "../../../../Classes/gaugeV4Class";
import {stakingApr, rewardTokenApr} from "../../aprHelpers";
import { useHundredDataContext } from "../../../../Types/hundredDataContext";
import { useUiContext } from "../../../../Types/uiContext";
import { useWeb3React } from "@web3-react/core";
import { UpdateTypeEnum } from "../../../../Hundred/Data/hundredData";
import Range from "../../../Range/range"
import Button from "../../../Button/button";

interface Props{
    gaugeV4: GaugeV4
}

const DirectStakeMarketTab:React.FC<Props> = (props: Props) =>{
    const { selectedMarket, selectedMarketSpinners, toggleSpinners, updateMarket, marketsData} = useHundredDataContext()
    const { toastSuccessMessage, toastErrorMessage} = useUiContext()
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
            if(market && library && props.gaugeV4.approveCall){
                try{
                    if (!market.isNativeToken) {
                        //setSpinnerVisible(true)
                        toggleSpinners(market.underlying.symbol, SpinnersEnum.stake)
                        
                        const tx = await props.gaugeV4.approveCall(market)
                        
                        //setSpinnerVisible(false)
                        const receipt = await tx.wait()
                        console.log(receipt)
                        if(receipt.status === 1){
                            toastSuccessMessage("Transaction complete, updating contracts")
                            await updateMarket(props.gaugeV4, UpdateTypeEnum.ApproveStake)
                        }
                        else if(receipt.message){
                            toastErrorMessage(`${receipt.message}`);  
                        }
                    }
                }
                catch(error: any){
                    console.log(error)
                    toastErrorMessage(`${error?.message.replace('.', '')} on Approve Stake}`);
                }
                finally{
                    //setSpinnerVisible(false)
                    toggleSpinners(market.underlying.symbol, SpinnersEnum.stake)
                }
            }
        }
    }

    const handleStake = async (symbol: string | undefined, amount: string) => {
        if(selectedMarket && marketsData){
            const market = [...marketsData].find(x=> x.underlying.symbol === symbol)
            if(props.gaugeV4.generalData.gaugeHelper && library && symbol && market && account && props.gaugeV4.stakeCall){
                try{
                    //setSpinnerVisible(true)
                    toggleSpinners(symbol, SpinnersEnum.stake)

                    const tx = await props.gaugeV4.stakeCall(amount, market)
                    
                    //setSpinnerVisible(false)
                    const receipt = await tx.wait()
                    console.log(receipt)
                    if(receipt.status === 1){
                        toastSuccessMessage("Transaction complete, updating contracts")
                        await updateMarket(props.gaugeV4, UpdateTypeEnum.Stake)
                        if(mounted) setStakeInput("")
                    }
                    else if(receipt.message){
                        toastErrorMessage(`${receipt.message}`);  
                    }
                }
                catch(error: any){
                    console.log(error)
                    toastErrorMessage(`${error?.message.replace('.', '')} on Stake}`);
                }
                finally{
                    //setSpinnerVisible(false)
                    toggleSpinners(symbol, SpinnersEnum.stake)
                }
            }
        }
    }
  
      const handleApproveUnStake = async (symbol: string) => {
          if(selectedMarket && marketsData){
              
              const market = [...marketsData].find(x => x?.underlying.symbol === symbol)
              if(market && library && props.gaugeV4.approveUnstakeCall){
                  try{
                    //setSpinnerVisible(true)
                    toggleSpinners(symbol, SpinnersEnum.unstake)
  
                    const tx = await props.gaugeV4.approveUnstakeCall()
  
                    //setSpinnerVisible(false)
  
                    const receipt = await tx.wait()
                    console.log(receipt)
                    if(receipt.status === 1){
                        toastSuccessMessage("Transaction complete, updating contracts")
                        await updateMarket(props.gaugeV4, UpdateTypeEnum.ApproveUnStake)
                    }
                    else if(receipt.message){
                        toastErrorMessage(`${receipt.message}`);  
                    }
                  }
                  catch(error : any){
                      console.log(error)
                      toastErrorMessage(`${error?.message.replace('.', '')} on Approve Unstake}`);
                  }
                  finally{
                      //setSpinnerVisible(false)
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
              if(market && library && account && props.gaugeV4.generalData.gaugeHelper && props.gaugeV4.unstakeCall){
                  try{
                    //setSpinnerVisible(true)
                    toggleSpinners(symbol, SpinnersEnum.unstake)

                    const tx = await props.gaugeV4.unstakeCall(amount, market, nativeTokenMarket?.pTokenAddress)
                      
                    //setSpinnerVisible(false)
                    const receipt = await tx.wait()
                    console.log(receipt)
                    if(receipt.status === 1){
                        toastSuccessMessage("Transaction complete, updating contracts")
                        await updateMarket(props.gaugeV4, UpdateTypeEnum.Unstake)
                        if(mounted.current) setUnstakeInput("")
                    }
                    else if(receipt.message){
                        toastErrorMessage(`${receipt.message}`);  
                    }
                  }
                  catch(error : any){
                      console.log(error)
                      toastErrorMessage(`${error?.message.replace('.', '')} on Untake}`);

                  }
                  finally{
                      //setSpinnerVisible(false)
                      toggleSpinners(symbol, SpinnersEnum.unstake)
                  }
              }
          }
      }
  
      const handleMint = async (symbol: string) => {
          if(selectedMarket){
              const market = [...marketsData].find(x => x.underlying.symbol === symbol)
              if(market && library && props.gaugeV4.mintCall){
                  try{
                        //setSpinnerVisible(true)
                        toggleSpinners(symbol, SpinnersEnum.mint)

                        const tx = await props.gaugeV4.mintCall()
                      
                        //setSpinnerVisible(false)

                        const receipt = await tx.wait()
                        console.log(receipt)
                        if(receipt.status === 1){
                            toastSuccessMessage("Transaction complete, updating contracts")
                            await updateMarket(props.gaugeV4, UpdateTypeEnum.Mint)
                        }
                        else if(receipt.message){
                            toastErrorMessage(`${receipt.message}`);  
                        }
                  }
                  catch(error: any){
                      console.log(error)
                      toastErrorMessage(`${error?.message.replace('.', '')} on Mint}`);
                  }
                  finally{
                      //setSpinnerVisible(false)
                      toggleSpinners(symbol, SpinnersEnum.mint)
                  }
              }
          }
      }

    const handleClaimRewards = async (symbol: string) => {
        if(selectedMarket){
            const market = [...marketsData].find(x => x.underlying.symbol === symbol)
            if(market && library && props.gaugeV4.claimRewardsCall){
                try{
                      //setSpinnerVisible(true)
                      toggleSpinners(symbol, SpinnersEnum.rewards)

                      const tx = await props.gaugeV4.claimRewardsCall()
                    
                      //setSpinnerVisible(false)

                      const receipt = await tx.wait()
                      console.log(receipt)
                      if(receipt.status === 1){
                          toastSuccessMessage("Transaction complete, updating contracts")
                          await updateMarket(props.gaugeV4, UpdateTypeEnum.ClaimRewards)
                      }
                      else if(receipt.message){
                          toastErrorMessage(`${receipt.message}`);  
                      }
                }
                catch(error: any){
                    console.log(error)
                    toastErrorMessage(`${error?.message.replace('.', '')} on Claim Rewards}`);
                }
                finally{
                    //setSpinnerVisible(false)
                    toggleSpinners(symbol, SpinnersEnum.rewards)
                }
            }
        }
    }

    return (
        selectedMarket && selectedMarketSpinners ?
        <>
            <div className="dialog-line"/>
            <MarketDialogItem
                title={"You Staked"}
                value={`${formatBalance(BigNumber.from(props.gaugeV4?.userStakedTokenBalance, {...selectedMarket}.underlying.decimals).mul({...selectedMarket}.exchangeRate)).toRound(4)} ${{...selectedMarket}.underlying.symbol}`}
            />
            <div className="dialog-line"/>
            <MarketDialogItem
                title={"Claimable"}
                value={`${+formatBalance(props.gaugeV4?.userClaimableHnd).toString() > 0 
                        ? +formatBalance(props.gaugeV4?.userClaimableHnd).toFixed(4) === 0
                        ? ">0.0001"
                        : formatBalance(props.gaugeV4?.userClaimableHnd).toFixed(4)
                        : "0.0000"} HND`}
            />
            <div className="dialog-line"/>
            {props?.gaugeV4?.reward_token !== "0x0000000000000000000000000000000000000000" ?
                <>
                    <MarketDialogItem
                        title={"Claimable reward"}
                        value={`${+formatBalance(props.gaugeV4.claimable_reward).toString() > 0
                                ? +formatBalance(props.gaugeV4?.claimable_reward).toFixed(4) === 0
                                ? ">0.0001"
                                : formatBalance(props.gaugeV4?.claimable_reward).toFixed(4)
                                : "0.0000"} 
                        ${props.gaugeV4?.reward_token_symbol}`}
                    />
                    <div className="dialog-line"/>
                </>
                :
                null
            }
            <MarketDialogItem
                title={"HND APR"}
                value={stakingApr({...selectedMarket}, props.gaugeV4)}
            />
            <div className="dialog-line"/>
            {props?.gaugeV4?.reward_token !== "0x0000000000000000000000000000000000000000" ?
                <>
                    <MarketDialogItem
                        title={`${props?.gaugeV4?.reward_token_symbol} APR`}
                        value={rewardTokenApr({...selectedMarket}, props.gaugeV4)}
                    />
                    <div className="dialog-line"/>
                </>
                :
                null
            }
            <div className="input-group">
                <Range setRatio={setStakeRatio} disabled={+{...selectedMarket}.underlying.walletBalance.toString() === 0}/>
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
                        <Button disabled={stakeInput === "" || actionsDisabled || stakeValidation.trim() !== ""} loading={{...selectedMarketSpinners}.stakeSpinner} rectangle={true}
                            onClick={() => handleStake({...selectedMarket}.underlying.symbol, stakeInput)}>
                                Stake
                        </Button>
                        :
                        <Button disabled={stakeInput === "" || actionsDisabled || stakeValidation.trim() !== ""} loading={{...selectedMarketSpinners}.stakeSpinner} rectangle={true}
                            onClick={() => handleApproveStake({...selectedMarket}.underlying.symbol)}>
                            Approve
                        </Button>
                    }
                </div>
            </div>
            <div className="input-group">
                <div className="amount-group">
                    <Range setRatio={setUnstakeRatio} disabled={+props.gaugeV4?.userStakeBalance.toString() === 0}/>
                    <span>{convertGaugeLpAmountToUnderlying(unstakeInput, props?.gaugeV4.gaugeTokenDecimals, {...selectedMarket})} {{...selectedMarket}.underlying.symbol}</span>
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
                    <Button disabled={unstakeInput === "" || actionsDisabled || unstakeValidation !== ""} rectangle={true} 
                        onClick={() => handleUnstake({...selectedMarket}.underlying.symbol, unstakeInput)} loading={{...selectedMarketSpinners}.unstakeSpinner}>
                        Unstake
                    </Button>
                    :
                    <Button disabled={unstakeInput === "" || actionsDisabled || unstakeValidation !== ""} loading={{...selectedMarketSpinners}.unstakeSpinner}
                        onClick={() => handleApproveUnStake({...selectedMarket}.underlying.symbol)} rectangle={true}>
                        Approve
                    </Button>
                }
            </div>
            </div>
            <div className="dialog-line"/>
            <div className="button-section">
                <Button disabled={actionsDisabled || props.gaugeV4.userClaimableHnd === undefined || props.gaugeV4.userClaimableHnd?.eq(BigNumber.from(0)) || actionsDisabled}
                    onClick={() =>handleMint({...selectedMarket}.underlying.symbol)} loading={{...selectedMarketSpinners}.mintSpinner}>
                    { props?.gaugeV4?.generalData.minterIsV2 ? 'Claim All' : 'Claim HND' }
                </Button>
            </div>
            {props?.gaugeV4?.reward_token !== "0x0000000000000000000000000000000000000000" && !props?.gaugeV4?.generalData.minterIsV2 ?
                <div className="secondary-button-section">
                    <Button
                    disabled={props?.gaugeV4?.claimable_reward === undefined || props?.gaugeV4?.claimable_reward?.eq(BigNumber.from(0))}
                    loading={{...selectedMarketSpinners}.rewardsSpinner}
                    onClick={() => handleClaimRewards({...selectedMarket}.underlying.symbol)}
                >
                    Claim {props?.gaugeV4?.reward_token_symbol}
                </Button>
                </div>
                : null
            }
        </>
        : null
    )
}

function convertGaugeLpAmountToUnderlying(amount: string, gaugeDecimals: number, market: CTokenInfo) : string{
    return (+amount * +market.exchangeRate / (10 ** (market.underlying.decimals - gaugeDecimals))).toFixed(4)
}

export default DirectStakeMarketTab
