import React, {useEffect, useState} from "react"
import { TabContentItem} from "../../../TabControl/tabControl";
import TextBox from "../../../Textbox/textBox";
import MarketDialogButton from "../marketDialogButton";
import DialogMarketInfoSection from "../marketInfoSection";
import "../supplyMarketDialog.css"
import MarketDialogItem from "../marketDialogItem";
import BorrowRateSection from "./borrowRateSection";
import BorrowLimitSection2 from "./borrowLimitSection2";
import { Spinner } from "../../../../assets/huIcons/huIcons";
import { CTokenInfo, SpinnersEnum } from "../../../../Classes/cTokenClass";
import { BigNumber } from "../../../../bigNumber";
import { useHundredDataContext } from "../../../../Types/hundredDataContext";
import { useUiContext } from "../../../../Types/uiContext";
import { useWeb3React } from "@web3-react/core";
import { useGlobalContext } from "../../../../Types/globalContext";
import { ethers } from "ethers";
import { CTOKEN_ABI, MAXIMILLION_ABI, TOKEN_ABI } from "../../../../abi";
import { ExecutePayableWithExtraGasLimit, ExecuteWithExtraGasLimit } from "../../../../Classes/TransactionHelper";

const MaxUint256 = BigNumber.from(ethers.constants.MaxUint256)

interface Props{
    tabChange: number,
    open: boolean,
    getMaxAmount: (market: CTokenInfo, func?: string) => Promise<BigNumber>,
    getMaxRepayAmount: (market: CTokenInfo) => Promise<BigNumber>,
}
const RepayItem: React.FC<Props> = (props : Props) =>{
    const {selectedMarket, selectedMarketSpinners, marketsData, toggleSpinners, setSelectedMarketSpinners} = useHundredDataContext()
    const {setSpinnerVisible, toastErrorMessage} = useUiContext()
    const {network} = useGlobalContext()
    const {library, account} = useWeb3React()

    const [repayInput, setRepayInput] = useState<string>("")
    const [repayDisabled, setRepayDisabled] = useState<boolean>(false)

    const [repayValidation, setRepayValidation] = useState<string>("")
    const [isFullRepay, setIsFullRepay] = useState<boolean>(false);

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
        const maxAffordable = selectedMarket ? await props.getMaxAmount(
            selectedMarket, "repay") : BigNumber.from("0")

        const fullRepayAmount = selectedMarket ? await props.getMaxRepayAmount(
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
                setRepayDisabled(true)
              if(selectedMarketSpinners) {
                const selected = {...selectedMarketSpinners}
                selected.repaySpinner = true
                setSelectedMarketSpinners(selected)
              }

              const signer = library.getSigner()
              if(market.underlying.address){
                const contract = new ethers.Contract(market.underlying.address, TOKEN_ABI, signer);
                const receipt = await ExecuteWithExtraGasLimit(
                    contract,
                    "approve",
                    [market.pTokenAddress, MaxUint256._value]
                , 0, () => setSpinnerVisible(false))
                console.log(receipt)
              }
            }
            catch(err){
              const error = err as any
              toastErrorMessage(`${error?.message.replace(".", "")} on Approve\n${error?.data?.message}`)
              console.log(err)
            }
            finally{
              setSpinnerVisible(false)
              toggleSpinners(symbol, SpinnersEnum.repay)
              setRepayDisabled(false)
              if(selectedMarketSpinners) {
                const selected = {...selectedMarketSpinners}
                selected.repaySpinner = false
                setSelectedMarketSpinners(selected)
              }
              //borrowDialog ? await handleUpdate(market, "repay", false) : await handleUpdate(market, "supply", false)
            }
          }
        }
      }

      const handleRepay = async(symbol: string, amount: string, fullRepay: boolean) => {
        if(marketsData){
          const market = [...marketsData].find(x => x?.underlying.symbol === symbol)
          
          if(market && library && network){
            try{
                setSpinnerVisible(true)
                toggleSpinners(symbol, SpinnersEnum.repay)
                if(selectedMarketSpinners) {
                    const selected = {...selectedMarketSpinners}
                    selected.repaySpinner = true
                    setSelectedMarketSpinners(selected)
                  }

              const value = BigNumber.parseValueSafe(amount, market.underlying.decimals)
              const repayAmount = (market.isNativeToken) ? ({value: value._value}) : 
                       (fullRepay ? ethers.constants.MaxUint256 : value._value)
              
              const signer = library.getSigner()
    
              if (market.isNativeToken && network.maximillion) {
                const maxiContract = new ethers.Contract(network.maximillion, MAXIMILLION_ABI, signer);
                const receipt = await ExecutePayableWithExtraGasLimit(maxiContract, value._value, "repayBehalfExplicit", [
                  account, market.pTokenAddress
                ], 0, () => setSpinnerVisible(false))
                // setSpinnerVisible(false);
                console.log(receipt);
              } 
              else {        
                const ctoken = new ethers.Contract(market.pTokenAddress, CTOKEN_ABI, signer)
                const receipt = await ExecuteWithExtraGasLimit(ctoken, "repayBorrow", [repayAmount], 0, () => setSpinnerVisible(false))
                
                console.log(receipt)
              }
            }
            catch(err){
              console.log(err)
            }
            finally{
              setSpinnerVisible(false)
              toggleSpinners(symbol, SpinnersEnum.repay)
              if(selectedMarketSpinners) {
                const selected = {...selectedMarketSpinners}
                selected.repaySpinner = true
                setSelectedMarketSpinners(selected)
              }
              
            //   if(market){
            //       setUpdate(true)
            //       await handleUpdate(market, "repay", false)
            //     }
            }
          }
        }
      }

    return (
        <TabContentItem open={props.open} tabId={2} tabChange={props.tabChange}>
            <TextBox placeholder={`0 ${selectedMarket ? {...selectedMarket}?.underlying.symbol : ""}`} disabled={repayDisabled} value={repayInput} setInput={setRepayInput} validation={repayValidation} button={"Max"}
             onClick={ ()=> handleMaxRepay()} onChange={()=>setIsFullRepay(false)}/>
             <MarketDialogItem title={"Wallet Ballance"} value={`${selectedMarket ? {...selectedMarket}?.underlying.walletBalance?.toRound(4, true) : "0"} ${selectedMarket ? {...selectedMarket}?.underlying.symbol : ""}`}/>
            <BorrowRateSection/>
            <BorrowLimitSection2 borrowAmount={"0"} repayAmount={repayInput}/>
            <DialogMarketInfoSection/>
                {selectedMarket && {...selectedMarket}?.underlying.allowance?.gt(BigNumber.from("0")) &&
                +{...selectedMarket}.underlying.allowance.toString() >= (repayInput.trim() === "" || isNaN(+repayInput) || isNaN(parseFloat(repayInput)) ? 0 : +repayInput)
                ? 
                 (
                    <MarketDialogButton disabled={(!repayInput || repayValidation || selectedMarketSpinners?.repaySpinner) ? true : false}
                        onClick={() => {selectedMarket ? handleRepay(
                                    {...selectedMarket}?.underlying.symbol,
                                    repayInput,
                                    isFullRepay) : null}}>
                        {selectedMarketSpinners?.repaySpinner? (<Spinner size={"20px"}/>) : "Repay"}
                    </MarketDialogButton>
                ) : (
                    <MarketDialogButton disabled={(selectedMarket && selectedMarketSpinners?.repaySpinner) ? true : false} onClick={() => {selectedMarket ? handleEnable(
                                                            {...selectedMarket}?.underlying.symbol) : null}}>
                        {selectedMarketSpinners?.repaySpinner ? (<Spinner size={"20px"}/>) : `Approve ${selectedMarket ? {...selectedMarket}?.underlying.symbol : ""}`}
                    </MarketDialogButton>)}
        </TabContentItem>
    )
}

export default RepayItem