import React, {useEffect, useRef, useState} from "react"
import { TabContentItem} from "../../../TabControl/tabControl";
import TextBox from "../../../Textbox/textBox";
import MarketDialogButton from "../marketDialogButton";
import DialogMarketInfoSection from "../marketInfoSection";
import "../marketDialog.css"
import MarketDialogItem from "../marketDialogItem";
import BorrowRateSection from "./borrowRateSection";
import BorrowLimitSection2 from "./borrowLimitSection2";
import { Spinner } from "../../../../assets/huIcons/huIcons";
import { SpinnersEnum } from "../../../../Classes/cTokenClass";
import { BigNumber } from "../../../../bigNumber";
import { useHundredDataContext } from "../../../../Types/hundredDataContext";
import { useUiContext } from "../../../../Types/uiContext";
import { useWeb3React } from "@web3-react/core";
import { useGlobalContext } from "../../../../Types/globalContext";
import { ethers } from "ethers";
import { CTOKEN_ABI, MAXIMILLION_ABI, TOKEN_ABI } from "../../../../abi";
import { ExecutePayableWithExtraGasLimit, ExecuteWithExtraGasLimit } from "../../../../Classes/TransactionHelper";
import { UpdateTypeEnum } from "../../../../Hundred/Data/hundredData";

const MaxUint256 = BigNumber.from(ethers.constants.MaxUint256)

interface Props{
    tabChange: number,
    open: boolean,
}
const RepayItem: React.FC<Props> = (props : Props) =>{
    const mounted = useRef<boolean>(false)

    const {selectedMarket, selectedMarketSpinners, marketsData, 
      toggleSpinners, getMaxAmount, getMaxRepayAmount, updateMarket} = useHundredDataContext()
    const {setSpinnerVisible, toastErrorMessage, toastSuccessMessage} = useUiContext()
    const {network} = useGlobalContext()
    const {library, account} = useWeb3React()

    const [repayInput, setRepayInput] = useState<string>("")
    const [repayDisabled, setRepayDisabled] = useState<boolean>(false)

    const [repayValidation, setRepayValidation] = useState<string>("")
    const [isFullRepay, setIsFullRepay] = useState<boolean>(false);

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
              if(spinner) setRepayDisabled(true)
              else setRepayDisabled(false)
          }
      }

  }, [selectedMarketSpinners?.spinner])

    useEffect(()=>{
        const handleRepayAmountChange = () => {
            if(repayInput ===""){
                setRepayValidation("")
                return
            }
            if(isNaN(+repayInput)){
                setRepayValidation("Amount must be a number")
            }
            else if (+repayInput <= 0) {
                setRepayValidation("Amount must be > 0");
            } else if (!isFullRepay && selectedMarket && BigNumber.parseValue(repayInput).gt({...selectedMarket}?.borrowBalanceInTokenUnit)) {
                setRepayValidation("Amount must be <= your borrow balance");
              } else if (selectedMarket && BigNumber.parseValue(repayInput).gt({...selectedMarket}?.underlying.walletBalance)) {
                setRepayValidation("Amount must be <= balance");
              } else if (selectedMarket && +{...selectedMarket}?.underlying.allowance.toString() < +repayInput){
                const approve = BigNumber.parseValue((+repayInput - +{...selectedMarket}?.underlying.allowance.toString()).noExponents()).toRound(4)
                setRepayValidation(`You must approve ${approve} ${{...selectedMarket}.underlying.symbol} more.`)
              }
               else {
                setRepayValidation("");
              }
        };
        handleRepayAmountChange()
          // eslint-disable-next-line
    }, [repayInput])
    

    const handleMaxRepay = async () => {
        const maxAffordable = selectedMarket ? await getMaxAmount(
            selectedMarket, "repay") : BigNumber.from("0")

        const fullRepayAmount = selectedMarket ? await getMaxRepayAmount(
            selectedMarket) : BigNumber.from("0")
            
        const isFull = maxAffordable.gteSafe(fullRepayAmount)
        setIsFullRepay(isFull);
          
        setRepayInput( BigNumber.minimum(
              maxAffordable,
              fullRepayAmount
        ).toString()) 
    }

    const handleEnable = async (symbol: string): Promise<void> => {
        if(marketsData){
          const markets = [...marketsData]
          const market = markets.find(x=> x?.underlying.symbol === symbol)
          if(market && library && network && account){
            try{
              setSpinnerVisible(true)
              toggleSpinners(symbol, SpinnersEnum.repay)

              if(market.underlying.address){
                const signer = library.getSigner()
                const contract = new ethers.Contract(market.underlying.address, TOKEN_ABI, signer);
                const tx = await ExecuteWithExtraGasLimit(
                    contract,
                    "approve",
                    [market.pTokenAddress, MaxUint256._value], 0)
                setSpinnerVisible(false)

                const receipt = await tx.wait()
                console.log(receipt)
                if (receipt.status === 1){
                  toastSuccessMessage("Transaction completed successfully.\nUpdating contracts")
                  await updateMarket(market, UpdateTypeEnum.ApproveMarket)
                }
              }
            }
            catch(err){
              const error = err as any
              toastErrorMessage(`${error?.message.replace(".", "")} on Approve`)
              console.log(err)
            }
            finally{
              setSpinnerVisible(false)
              toggleSpinners(symbol, SpinnersEnum.repay)
            }
          }
        }
      }

      const handleRepay = async(symbol: string, amount: string, fullRepay: boolean) => {
        if(marketsData){
          const market = [...marketsData].find(x => x?.underlying.symbol === symbol)
          
          if(market && library && network){
            try{
                const net = {...network}
                setSpinnerVisible(true)
                toggleSpinners(symbol, SpinnersEnum.repay)

                const value = BigNumber.parseValueSafe(amount, market.underlying.decimals)
                const repayAmount = (market.isNativeToken) ? ({value: value._value}) : 
                       (fullRepay ? ethers.constants.MaxUint256 : value._value)
              
                const signer = library.getSigner()
                const contract = market.isNativeToken && net.maximillion
                                  ? new ethers.Contract(net.maximillion, MAXIMILLION_ABI, signer)
                                  : new ethers.Contract(market.pTokenAddress, CTOKEN_ABI, signer)

                const tx = market.isNativeToken && net.maximillion
                          ? await ExecutePayableWithExtraGasLimit(contract, value._value, "repayBehalfExplicit", [
                            account, market.pTokenAddress], 0)
                          : await ExecuteWithExtraGasLimit(contract, "repayBorrow", [repayAmount], 0)
    
                setSpinnerVisible(false)

                const receipt = await tx.wait()
                console.log(receipt)
                if (receipt.status === 1){
                  toastSuccessMessage("Transaction completed successfully.\nUpdating contracts")
                  await updateMarket(market, UpdateTypeEnum.Repay)
                  if(mounted.current)
                    setRepayInput("")
                }
              }
              catch(error: any){
                console.log(error)
                toastErrorMessage(`${error?.message.replace(".", "")} on Repay`)
              }
            finally{
              setSpinnerVisible(false)
              toggleSpinners(symbol, SpinnersEnum.repay)
            }
          }
        }
      }

    return ( selectedMarket && selectedMarketSpinners && mounted.current ?
        <TabContentItem open={props.open} tabId={2} tabChange={props.tabChange}>
            <TextBox placeholder={`0 ${{...selectedMarket}?.underlying.symbol}`} disabled={repayDisabled} value={repayInput} setInput={setRepayInput} validation={repayValidation} button={"Max"}
             onClick={ ()=> handleMaxRepay()} onChange={()=>setIsFullRepay(false)}/>
             <MarketDialogItem title={"Wallet Ballance"} value={`${{...selectedMarket}?.underlying.walletBalance?.toRound(4, true)} ${{...selectedMarket}.underlying.symbol}`}/>
            <BorrowRateSection/>
            <BorrowLimitSection2 borrowAmount={"0"} repayAmount={repayInput}/>
            <DialogMarketInfoSection/>
                {{...selectedMarket}.underlying.allowance?.gt(BigNumber.from("0")) &&
                +{...selectedMarket}.underlying.allowance.toString() >= (repayInput.trim() === "" || isNaN(+repayInput) || isNaN(parseFloat(repayInput)) ? 0 : +repayInput)
                ? 
                 (
                    <MarketDialogButton disabled={(!repayInput || repayValidation || {...selectedMarketSpinners}.repaySpinner) ? true : false}
                        onClick={() => {handleRepay(
                                    {...selectedMarket}?.underlying.symbol,
                                    repayInput,
                                    isFullRepay)}}>
                        {{...selectedMarketSpinners}.repaySpinner ? (<Spinner size={"20px"}/>) : "Repay"}
                    </MarketDialogButton>
                ) : (
                    <MarketDialogButton disabled={{...selectedMarketSpinners}.repaySpinner ? true : false} 
                      onClick={() => handleEnable({...selectedMarket}.underlying.symbol)}>
                        {{...selectedMarketSpinners}.repaySpinner ? (<Spinner size={"20px"}/>) : `Approve ${{...selectedMarket}.underlying.symbol}`}
                    </MarketDialogButton>)}
        </TabContentItem>
        : null
    )
}

export default RepayItem