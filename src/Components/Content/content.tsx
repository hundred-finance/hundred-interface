import React, { useState } from "react"
import GeneralDetails from "../GeneralDetails/generalDetails"
import { CTokenInfo } from "../../Classes/cTokenClass"
import Markets from "../Markets/markets"
import EnterMarketDialog from "../Markets/MarketsDialogs/enterMarketDialog"
import BorrowMarketDialog from "../Markets/MarketsDialogs/BorrowMarketDialog/borrowMarketsDialog"
import SupplyMarketDialog from "../Markets/MarketsDialogs/SupplyMarketDialog/supplyMarketDialog"
import { useUiContext } from "../../Types/uiContext"
import { useHundredDataContext } from "../../Types/hundredDataContext"

const Content: React.FC = () => {
    const {spinnerVisible} = useUiContext()
    const { setSelectedMarket, marketsSpinners, setSelectedMarketSpinners} = useHundredDataContext()

    const [openEnterMarket, setOpenEnterMarket] = useState(false)
    const [openSupplyMarketDialog, setOpenSupplyDialog] = useState(false)
    const [openBorrowMarketDialog, setOpenBorrowMarketDialog] = useState(false)

    const enterMarketDialog = (market: CTokenInfo) : void => {
      setSelectedMarket(market)
      const selectedSpinner = [...marketsSpinners].find(x => x.symbol === market.underlying.symbol)
      setSelectedMarketSpinners(selectedSpinner)
      setOpenEnterMarket(true)
    }

    const closeMarketDialog = () : void => {
      if(!spinnerVisible){
        console.log("Close")
        setOpenEnterMarket(false)
        setSelectedMarket(undefined)
        setSelectedMarketSpinners(undefined)
      }
    }
    
    const supplyMarketDialog = (market: CTokenInfo) => {

      setSelectedMarket(market)
      const selectedSpinner = [...marketsSpinners].find(x => x.symbol === market.underlying.symbol)
      setSelectedMarketSpinners(selectedSpinner)
      setOpenSupplyDialog(true)
    }

    const closeSupplyMarketDialog = () =>{
      if(!spinnerVisible){
        setOpenSupplyDialog(false)
        setSelectedMarket(undefined)
      }
    }

    const borrowMarketDialog = (market: CTokenInfo) : void => {
      setSelectedMarket(market)
      const selectedSpinner = [...marketsSpinners].find(x => x.symbol === market.underlying.symbol)
      setSelectedMarketSpinners(selectedSpinner)
      setOpenBorrowMarketDialog(true)
    }

    const closeBorrowMarketDialog = () => {
      if(!spinnerVisible){
        setOpenBorrowMarketDialog(false)
        setSelectedMarket(undefined)
      }
  }
    return (
        <div className="content">
            <GeneralDetails/>
            <Markets
                enterMarketDialog={enterMarketDialog}
                supplyMarketDialog={supplyMarketDialog}
                borrowMarketDialog={borrowMarketDialog}
            />
            {openEnterMarket ? <EnterMarketDialog 
                closeMarketDialog = {closeMarketDialog}/> 
            : null}
            {openSupplyMarketDialog ? <SupplyMarketDialog closeSupplyMarketDialog={closeSupplyMarketDialog}/> 
            : null}
            {openBorrowMarketDialog ?
              <BorrowMarketDialog closeBorrowMarketDialog={closeBorrowMarketDialog}/>
            : null}
        </div>
    )
}

export default Content