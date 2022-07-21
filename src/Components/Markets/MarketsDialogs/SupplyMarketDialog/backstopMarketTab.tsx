import { BigNumber } from "../../../../bigNumber";
import React, {useEffect, useRef, useState} from "react"
import TextBox from "../../../Textbox/textBox";
import MarketDialogButton from "../marketDialogButton";
import "../marketDialog.css"
import MarketDialogItem from "../marketDialogItem";
import {Spinner} from "../../../../assets/huIcons/huIcons";
import BackstopSection from "./backstopSection";
import { useHundredDataContext } from "../../../../Types/hundredDataContext";
import { useUiContext } from "../../../../Types/uiContext";
import { useWeb3React } from "@web3-react/core";
import { useGlobalContext } from "../../../../Types/globalContext";
import { SpinnersEnum } from "../../../../Classes/cTokenClass";
import { ethers } from "ethers";
import { BACKSTOP_MASTERCHEF_ABI, BACKSTOP_MASTERCHEF_ABI_V2, TOKEN_ABI } from "../../../../abi";
import { ExecuteWithExtraGasLimit } from "../../../../Classes/TransactionHelper";
import { UpdateTypeEnum } from "../../../../Hundred/Data/hundredData";
import { MasterChefVersion } from "../../../../networks";

const MaxUint256 = BigNumber.from(ethers.constants.MaxUint256);

const BackstopMarketTab:React.FC = () =>{
    const mounted = useRef<boolean>(false)

    const {selectedMarket, selectedMarketSpinners, getMaxAmount, marketsData, toggleSpinners, updateMarket} = useHundredDataContext()
    const {library, account} = useWeb3React()
    const {network} = useGlobalContext()
    const {setSpinnerVisible, toastErrorMessage, toastSuccessMessage} = useUiContext()

    const [actionsDisabled, setActionsDisabled] = useState<boolean>(false)

    const [depositInput, setDepositInput] = useState<string>("")
    const [depositInputValidation, setDepositInputValidation] = useState<string>("")

    const [backstopWithdrawInput, setBackstopWithdrawInput] = useState<string>("")
    const [backstopWithdraw, setBackstopWithdraw] = useState<string>("Withdraw")
    const [backstopWithdrawValidation, setBackstopWithdrawValidation] = useState<string>("")

    useEffect(() => {
        mounted.current = true

        return (() => {
            mounted.current = false
        })
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

    useEffect(() => {
        const handleDepositAmountChange = () => {
            if(depositInput.trim() === ""){
                setDepositInputValidation("")
                return;
            }

            if(isNaN(+depositInput) || isNaN(parseFloat(depositInput))){
                setDepositInputValidation("Amount must be a number");
                return;
            }else if (+depositInput <= 0) {
                setDepositInputValidation("Amount must be > 0");
            } else if (selectedMarket && +depositInput > +{...selectedMarket}.underlying.walletBalance) {
                setDepositInputValidation("Amount must be <= balance");
            }else{
                setDepositInputValidation("");
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
            } else if (selectedMarket && selectedMarket.backstop){ 
                const selected = {...selectedMarket}
                if (selected.backstop?.userBalance && +backstopWithdrawInput > +selected.backstop.userBalance.toString()){
                    setBackstopWithdraw("Withdraw")
                    setBackstopWithdrawValidation("Amount must be <= balance");
                } 
            }else{
                if(selectedMarket){
                    const selected = {...selectedMarket}
                    
                    if(selected.backstop){
                        const widthdrawUsd = BigNumber.parseValue((+backstopWithdrawInput * selected.backstop.sharePrice.toNumeral()).noExponents())
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
                }
                
                setBackstopWithdrawValidation("");
            }
        }
        
        handlebackstopWithdrawChange()
          // eslint-disable-next-line
    }, [backstopWithdrawInput])

    const setMaxAmount = async () : Promise<void> => {
        const amount = selectedMarket ? await getMaxAmount({...selectedMarket}, "supply") : 0
        setDepositInput(amount.toString())
    }

    const setMaxBackstopWithdraw = () : void=> {
        if(selectedMarket){
            const selected = {...selectedMarket}
            if(selected.backstop){
                setBackstopWithdrawInput(selected.backstop.userBalance.toString())
                return
            }
        }
        setBackstopWithdrawInput("0")
    }

    const handleApproveBackstop = async (symbol: string): Promise<void> => {
        if(marketsData){
          const market = [...marketsData].find(x=> x?.underlying.symbol === symbol)
          if(market && market.backstop && library && network && account){
            try{
                const net = {...network}
              setSpinnerVisible(true)
              toggleSpinners(symbol, SpinnersEnum.backstopDeposit)
              
              const signer = library.getSigner()
              if(market.underlying.address && net.backstopMasterChef){
                const contract = new ethers.Contract(market.underlying.address, TOKEN_ABI, signer);
                const tx = await ExecuteWithExtraGasLimit(contract, "approve", [
                    net.backstopMasterChef.address, MaxUint256._value])
                
                setSpinnerVisible(false)

                const receipt = await tx.wait()
                console.log(receipt)
                toastSuccessMessage("Transaction completed successfully.\nUpdating contracts")
                await updateMarket(market, UpdateTypeEnum.ApproveBackstop)
              }
            }
            catch(error: any){
              toastErrorMessage(`${error?.message.replace(".", "")} on Approve Backstop`)
              console.log(error)
    
            }
            finally{
              setSpinnerVisible(false)
              toggleSpinners(symbol, SpinnersEnum.backstopDeposit)
            }
          }
        }
      }
    
      const handleBackstopDeposit = async (symbol: string, amount: string) : Promise<void> => {
        if (marketsData && network){
            const net = {...network}
            const market = [...marketsData].find(x =>x.underlying.symbol === symbol)
          
            if(market && market.backstop && library && account && net.backstopMasterChef){
                try{
                    setSpinnerVisible(true)
                    toggleSpinners(symbol, SpinnersEnum.backstopDeposit)

                    const value = BigNumber.parseValueSafe(amount, market.underlying.decimals)
                    
                    const signer = library.getSigner()
                    const backstopAbi = net.backstopMasterChef.version === MasterChefVersion.v1 ? BACKSTOP_MASTERCHEF_ABI : BACKSTOP_MASTERCHEF_ABI_V2
                    const backstop = new ethers.Contract(net.backstopMasterChef.address, backstopAbi, signer)
                    const tx = await ExecuteWithExtraGasLimit(backstop, "deposit", [
                        market.backstop.pool.poolId, value._value, account])
                    
                    setSpinnerVisible(false)

                    const receipt = await tx.wait()
                    console.log(receipt)
                    toastSuccessMessage("Transaction completed successfully.\nUpdating contracts")
                    await updateMarket(market, UpdateTypeEnum.BackstopDeposit)
                    if(mounted.current) setDepositInput("")
                }
                catch(error : any){
                    console.log(error)
                    toastErrorMessage(`${error?.message.replace(".", "")} on Backstop Deposit`)
                }
                finally{
                    setSpinnerVisible(false)
                    toggleSpinners(symbol, SpinnersEnum.backstopDeposit)
                }
            }
          }
        }
      
      const handleBackstopWithdraw = async (symbol: string, amount: string) : Promise<void> => {
        if (marketsData && network){
            const net = {...network}
            const market = [...marketsData].find(x =>x?.underlying.symbol === symbol)
          
            if(market && market.backstop && library && net.backstopMasterChef){
                try{
                    setSpinnerVisible(true)
                    toggleSpinners(symbol, SpinnersEnum.backstopWithdraw)

                    const value = BigNumber.parseValueSafe(amount, market.backstop.decimals)
              
                    const signer = library.getSigner()
                    const backstopAbi = net.backstopMasterChef.version === MasterChefVersion.v1 ? BACKSTOP_MASTERCHEF_ABI : BACKSTOP_MASTERCHEF_ABI_V2
                    const backstop = new ethers.Contract(net.backstopMasterChef.address, backstopAbi, signer)
                    const tx = await ExecuteWithExtraGasLimit(backstop, "withdrawAndHarvest", 
                        [market.backstop.pool.poolId, value._value, account])
              
                    setSpinnerVisible(false)

                    const receipt = await tx.wait()
                    console.log(receipt)
                    toastSuccessMessage("Transaction completed successfully.\nUpdating contracts")
                    await updateMarket(market, UpdateTypeEnum.BackstopWithdraw)
                    if(mounted.current) setBackstopWithdrawInput("")
                }
                catch(error: any){
                    console.log(error)
                    toastErrorMessage(`${error?.message.replace(".", "")} on Backstop Deposit`)
                }
                finally{
                    setSpinnerVisible(false)
                    toggleSpinners(symbol, SpinnersEnum.backstopWithdraw)
                }
            }
        }
    }
    
      const handleBackstopClaim = async (symbol: string) : Promise<void> => {
        if (marketsData && network){
            const net = {...network}
            const market = [...marketsData].find(x =>x.underlying.symbol === symbol)
          
            if(market && market.backstop && library && account && net.backstopMasterChef){
                try{
                    setSpinnerVisible(true)
                    toggleSpinners(symbol, SpinnersEnum.backstopClaim)
              
                    const signer = library.getSigner()
                    const backstopAbi = net.backstopMasterChef.version === MasterChefVersion.v1 ? BACKSTOP_MASTERCHEF_ABI : BACKSTOP_MASTERCHEF_ABI_V2
                    const backstop = new ethers.Contract(net.backstopMasterChef.address, backstopAbi, signer)
                    const tx = await ExecuteWithExtraGasLimit(backstop, "harvest", [
                        market.backstop.pool.poolId, account])
                    
                    setSpinnerVisible(false)
                    const receipt = await tx.wait()
                    console.log(receipt)
                    toastSuccessMessage("Transaction completed successfully.\nUpdating contracts")
                    await updateMarket(market, UpdateTypeEnum.BackstopClaim)
                }
                catch(error: any){
                    console.log(error)
                    toastErrorMessage(`${error?.message.replace(".", "")} on Backstop Claim`)
                }
                finally{
                    setSpinnerVisible(false)
                    toggleSpinners(symbol, SpinnersEnum.backstopClaim)
                }
            }
        }
    }

    return ( selectedMarket && selectedMarket.backstop && selectedMarketSpinners ?
        <>
            <MarketDialogItem title={"Wallet Ballance"} value={`${{...selectedMarket}.underlying.walletBalance?.toRound(4, true)} ${{...selectedMarket}.underlying.symbol}`} className="dialog-section-no-bottom-gap"/>
            <BackstopSection/>
            <TextBox placeholder={`0 ${{...selectedMarket}.underlying.symbol}`} disabled={actionsDisabled} value={depositInput} setInput={setDepositInput} validation={depositInputValidation} button={"Max"}
                     onClick={()=>setMaxAmount()} validationCollapse={true}/>
            {{...selectedMarket}.backstop && {...selectedMarket}.backstop?.allowance?.gt(BigNumber.from(0)) && {...selectedMarket}?.backstop?.allowance?.gte(depositInput.trim() === "" || isNaN(+depositInput) ?
                BigNumber.from("0") :
                BigNumber.parseValue(depositInput))
                ? (
                    <MarketDialogButton disabled={depositInput==="" || depositInputValidation!="" || {...selectedMarketSpinners}.backstopDepositSpinner || actionsDisabled}
                                        onClick={() => { handleBackstopDeposit({...selectedMarket}.underlying.symbol, depositInput)}}>
                        {{...selectedMarketSpinners}.backstopDepositSpinner ? (<Spinner size={"20px"}/>) : "Deposit"}
                    </MarketDialogButton>
                ) : (
                    <MarketDialogButton disabled={{...selectedMarketSpinners}.backstopDepositSpinner || actionsDisabled}
                                        onClick={() => { handleApproveBackstop({...selectedMarket}.underlying.symbol) }}>
                        {{...selectedMarketSpinners}.backstopDepositSpinner ? (<Spinner size={"20px"}/>) : `Approve ${{...selectedMarket}.underlying.symbol}`}
                    </MarketDialogButton>)}
            <TextBox placeholder={`0 ${{...selectedMarket}.backstop?.symbol}`} disabled={actionsDisabled} value={backstopWithdrawInput} setInput={setBackstopWithdrawInput} validation={backstopWithdrawValidation} button={"Max"}
                     onClick={() => setMaxBackstopWithdraw()} validationCollapse={true}/>
            <MarketDialogButton
                className="backstop-dialog-button"
                disabled={backstopWithdrawInput === "" || backstopWithdrawValidation !== "" || isNaN(+backstopWithdrawInput) ||{...selectedMarketSpinners}.backstopWithdrawSpinner || !{...selectedMarket}.backstop 
                || BigNumber.parseValue(backstopWithdrawInput).gt({...selectedMarket.backstop}.userBalance)}
                onClick={() => { handleBackstopWithdraw(
                        {...selectedMarket}.underlying.symbol,
                        backstopWithdrawInput
                    )
                }}
            >
                { {...selectedMarketSpinners}.backstopWithdrawSpinner ? (<Spinner size={"20px"}/>) : backstopWithdraw}
            </MarketDialogButton>
            {
                
                +{...selectedMarket.backstop}.pendingHundred.toString() > 0 ?
                    <MarketDialogButton
                        className="backstop-dialog-button"
                        disabled={{...selectedMarketSpinners}.backstopClaimSpinner || actionsDisabled}
                        onClick={() => { handleBackstopClaim({...selectedMarket}.underlying.symbol)
                        }}
                    >
                        {{...selectedMarketSpinners}.backstopClaimSpinner 
                        ? (<Spinner size={"20px"}/>) 
                        : `Claim ${+{...selectedMarket.backstop}.pendingHundred.toRound(8, true) === 0 
                        ? ">0.0001" 
                        : {...selectedMarket.backstop}.pendingHundred.toRound(8, true, true)} HND`}
                    </MarketDialogButton>
                    :<></>
            }
        </>
        : null
    )
}

export default BackstopMarketTab