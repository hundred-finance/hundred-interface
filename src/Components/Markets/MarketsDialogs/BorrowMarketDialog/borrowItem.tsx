import React, {useRef, useEffect, useState} from "react"
import { TabContentItem} from "../../../TabControl/tabControl";
import TextBox from "../../../Textbox/textBox";
import DialogMarketInfoSection from "../marketInfoSection";
import "../marketDialog.css"
import MarketDialogItem from "../marketDialogItem";
import BorrowRateSection from "./borrowRateSection";
import BorrowLimitSection2 from "./borrowLimitSection2";
import { SpinnersEnum } from "../../../../Classes/cTokenClass";
import { BigNumber } from "../../../../bigNumber";
import { useHundredDataContext } from "../../../../Types/hundredDataContext";
import { useWeb3React } from "@web3-react/core";
import { useUiContext } from "../../../../Types/uiContext";
import { ethers } from "ethers";
import { ExecuteWithExtraGasLimit } from "../../../../Classes/TransactionHelper";
import { CETHER_ABI, CTOKEN_ABI } from "../../../../abi";
import { UpdateTypeEnum } from "../../../../Hundred/Data/hundredData";
import Button from "../../../Button/button";

interface Props{
    tabChange: number
    open: boolean,
    
}
const BorrowItem: React.FC<Props> = (props : Props) =>{
    const mounted = useRef<boolean>(false)
    const {library} = useWeb3React()
    const {generalData, selectedMarket, selectedMarketSpinners, marketsData, 
        toggleSpinners, updateMarket} = useHundredDataContext()
    const { toastErrorMessage, toastSuccessMessage} = useUiContext()
    const [borrowInput, setBorrowInput] = useState<string>("")
    const [borrowDisabled, setBorrowDisabled] = useState<boolean>(false)
    const [borrowValidation, setBorrowValidation] = useState<string>("")

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
                if(spinner) setBorrowDisabled(true)
                else setBorrowDisabled(false)
            }
        }

    }, [selectedMarketSpinners?.spinner])

    useEffect(()=>{
        const handleBorrowAmountChange = () => {
            if(borrowInput === ""){
                setBorrowValidation("")
                return;
            }
            let pValue = BigNumber.from("0")
            if (generalData && selectedMarket) {
                const general = {...generalData}
                const market = {...selectedMarket}
                const value = +general.totalBorrowBalance.toString() + +BigNumber.parseValue(borrowInput).toString() * +market.underlying.price.toString()
                pValue = BigNumber.parseValue((+general.totalBorrowLimit.toString() > 0 ? +value / +general.totalBorrowLimit.toString() * 100 : 0).toFixed(18))
            }

            if(isNaN(+borrowInput)){
                setBorrowValidation("Amount must be a number");
            }else if (+borrowInput <= 0) {
              setBorrowValidation("Amount must be > 0");
            }else if (+pValue === 0){
                setBorrowValidation("Your Borrow Limit is 0");
            }else if (+pValue.toRound(2) >= 90.01) {
              setBorrowValidation("Amount must be <= 90% borrow limit");
            }else if (selectedMarket && +BigNumber.parseValue(borrowInput).toString() > +{...selectedMarket}.cash.toString()) {
                setBorrowValidation("Amount must be <= liquidity");
            } else {
              setBorrowValidation("");
            }
        };
        
          handleBorrowAmountChange()
          // eslint-disable-next-line
    }, [borrowInput, selectedMarket])

    const handleMaxBorrow = async () => {
        if(generalData && selectedMarket){
            const general = {...generalData}
            const market = {...selectedMarket} 
            const balance = (+general.totalBorrowLimit.toString() - +general.totalBorrowBalance.toString()) / +market.underlying.price.toString() / 2
            const amount = +market.cash.toString() / 2
            let borrow = 0
            if (balance > amount)
                borrow = amount
            else
                borrow = balance
            
            let pValue = BigNumber.from("0")
            
            const value = +general.totalBorrowBalance.toString() + +BigNumber.parseValue(borrow.toString()).toString() * +market?.underlying.price.toString()
            pValue = BigNumber.parseValue((+general.totalBorrowLimit.toString() > 0 ? +value / +general.totalBorrowLimit.toString() * 100 : 0).toFixed(18))
            if(+pValue.toRound(2) >= 50.01){
                borrow  = (0.5 * +general.totalBorrowLimit.toString() - +general.totalBorrowBalance.toString()) / +market.underlying.price.toString()
            }
            setBorrowInput(BigNumber.parseValue(borrow.toFixed(market.underlying.decimals)).toString())
        }
        else setBorrowInput("0")
    }

    const handleBorrow = async (symbol: string, amount: string) => {
        if (marketsData){
            const market = marketsData.find(x => x?.underlying.symbol === symbol)
          if(market && library){
            try{
                //setSpinnerVisible(true)
                toggleSpinners(symbol, SpinnersEnum.borrow)
                
                const value = BigNumber.parseValueSafe(amount, market.underlying.decimals)
              
                const signer = library.getSigner()
                const token = market.isNativeToken ? CETHER_ABI : CTOKEN_ABI
                const ctoken = new ethers.Contract(market.pTokenAddress, token, signer)
                const tx = await ExecuteWithExtraGasLimit(ctoken, "borrow", [value._value], 0)
              
                // setSpinnerVisible(false)
                const receipt = await tx.wait()
                console.log(receipt)
                if(receipt.status === 1){
                    toastSuccessMessage("Transaction completed successfully.\nUpdating contracts")
                    if(mounted.current) setBorrowInput("")
                    await updateMarket(market, UpdateTypeEnum.Borrow)
                }
            }
            catch(error: any){
              console.log(error)
              toastErrorMessage(`${error?.message.replace(".", "")} on Approve`)
            }
            finally{
              //setSpinnerVisible(false)
              toggleSpinners(symbol, SpinnersEnum.borrow)
            }
          }
        }
      }

    return (
        selectedMarket && selectedMarketSpinners && generalData && mounted ? 
        <TabContentItem open={props.open} tabId={1} tabChange={props.tabChange}>
            <TextBox placeholder={`0 ${{...selectedMarket}?.underlying.symbol}`} disabled={borrowDisabled || ({...selectedMarket}.borrowPaused)} value={borrowInput} setInput={setBorrowInput} validation={borrowValidation} button={"Safe Max"}
            buttonTooltip="50% of borrow limit" buttonDisabled={+{...generalData}?.totalBorrowLimitUsedPercent.toRound(2) >= 50.01 ? true : false} onClick={ () => handleMaxBorrow()}/>
            <MarketDialogItem title={"You Borrowed"} value={`${{...selectedMarket}?.borrowBalanceInTokenUnit?.toRound(4, true)} ${{...selectedMarket}?.underlying.symbol}`}/>
            <div className="dialog-line"/>
            <BorrowRateSection/>
            <div className="dialog-line"/>
            <BorrowLimitSection2 borrowAmount={borrowInput} repayAmount={"0"}/>
            <div className="dialog-line"/>
            <DialogMarketInfoSection/>
            <div className="button-section">
                {{...selectedMarket}.borrowPaused ? 
                    <Button disabled={true} onClick={() => null}>
                        Borrow is Paused
                    </Button>
                    :<Button loading={{...selectedMarketSpinners}?.borrowSpinner}
                        disabled={(!borrowInput || borrowValidation || selectedMarketSpinners?.borrowSpinner) ? true : false}
                        onClick={() => {handleBorrow(
                                                {...selectedMarket}?.underlying.symbol,
                                                borrowInput
                                            )
                                        }}>
                        Borrow
                    </Button>
                }
            </div>
        </TabContentItem>
        : null
    )
}

export default BorrowItem