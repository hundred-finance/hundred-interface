import React, {useRef, useEffect, useState} from "react"
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
import { useWeb3React } from "@web3-react/core";
import { useUiContext } from "../../../../Types/uiContext";
import { ethers } from "ethers";
import { ExecuteWithExtraGasLimit } from "../../../../Classes/TransactionHelper";
import { CETHER_ABI, CTOKEN_ABI } from "../../../../abi";

interface Props{
    tabChange: number
    open: boolean,
    getMaxAmount: (market: CTokenInfo, func?: string) => Promise<BigNumber>,
    
}
const BorrowItem: React.FC<Props> = (props : Props) =>{
    const {library} = useWeb3React()
    const {generalData, selectedMarket, selectedMarketSpinners, marketsData, toggleSpinners, setSelectedMarketSpinners} = useHundredDataContext()
    const {setSpinnerVisible} = useUiContext()
    const [borrowInput, setBorrowInput] = useState<string>("")
    const [borrowDisabled, setBorrowDisabled] = useState<boolean>(false)
    const [borrowValidation, setBorrowValidation] = useState<string>("")

    const selectedMarketRef = useRef<CTokenInfo>()

    useEffect (() => {
        selectedMarket ? selectedMarketRef.current = {...selectedMarket} : undefined
    }, [selectedMarket])

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
            } else if (+pValue.toRound(2) >= 90.01) {
              setBorrowValidation("Amount must be <= 90% borrow limit");
            }else if (selectedMarket && +BigNumber.parseValue(borrowInput).toString() > +{...selectedMarket}.cash.toString()) {
                setBorrowValidation("Amount must be <= liquidity");
            } else {
              setBorrowValidation("");
            }
        };
        
          handleBorrowAmountChange()
          // eslint-disable-next-line
    }, [borrowInput])

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
                setSpinnerVisible(true)
                setBorrowDisabled(true)
                toggleSpinners(symbol, SpinnersEnum.borrow)
                
                const value = BigNumber.parseValueSafe(amount, market.underlying.decimals)
              
                if (selectedMarketSpinners){
                    const selected = {...selectedMarketSpinners}
                    selected.borrowSpinner = true
                    setSelectedMarketSpinners(selected)
                }

                const signer = library.getSigner()
                const token = market.isNativeToken ? CETHER_ABI : CTOKEN_ABI
                const ctoken = new ethers.Contract(market.pTokenAddress, token, signer)
                const receipt = await ExecuteWithExtraGasLimit(ctoken, "borrow", [value._value], () => setSpinnerVisible(false))
              
                console.log(receipt)
            }
            catch(err){
              console.log(err)
            }
            finally{
              setSpinnerVisible(false)
              setBorrowDisabled(false)

              toggleSpinners(symbol, SpinnersEnum.borrow)
              if (selectedMarketSpinners){
                const selected = {...selectedMarketSpinners}
                selected.borrowSpinner = false
                setSelectedMarketSpinners(selected)
            }
            }
          }
        }
      }

    return (
        <TabContentItem open={props.open} tabId={1} tabChange={props.tabChange}>
            <TextBox placeholder={`0 ${selectedMarket ? {...selectedMarket}?.underlying.symbol : ""}`} disabled={borrowDisabled || (selectedMarket ? {...selectedMarket}.borrowPaused : false)} value={borrowInput} setInput={setBorrowInput} validation={borrowValidation} button={"Safe Max"}
            buttonTooltip="50% of borrow limit" buttonDisabled={generalData && +{...generalData}?.totalBorrowLimitUsedPercent.toRound(2) >= 50.01 ? true : false} onClick={ () => handleMaxBorrow()}/>
            <MarketDialogItem title={"You Borrowed"} value={`${selectedMarket ? {...selectedMarket}?.borrowBalanceInTokenUnit?.toRound(4, true) : "0"} ${selectedMarket ? {...selectedMarket}?.underlying.symbol : ""}`}/>
            <BorrowRateSection/>
            <BorrowLimitSection2 borrowAmount={borrowInput} repayAmount={"0"}/>
            <DialogMarketInfoSection/>
            {selectedMarket && {...selectedMarket}.borrowPaused ? 
                <MarketDialogButton disabled={true} onClick={() => null}>
                    Borrow is Paused
                </MarketDialogButton>
                :<MarketDialogButton disabled={(!borrowInput || borrowValidation || selectedMarketSpinners?.borrowSpinner) ? true : false}
                    onClick={() => {  selectedMarket ? handleBorrow(
                                            {...selectedMarket}?.underlying.symbol,
                                            borrowInput
                                        ) : null
                                    }}>
                    {selectedMarketSpinners && {...selectedMarketSpinners}?.borrowSpinner ? (<Spinner size={"20px"}/>) :"Borrow"}
                </MarketDialogButton>
            }
        </TabContentItem>
    )
}

export default BorrowItem