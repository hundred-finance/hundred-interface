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
    const { setSelectedMarket, marketsData, marketsSpinners, setSelectedMarketSpinners} = useHundredDataContext()

    const [openEnterMarket, setOpenEnterMarket] = useState(false)
    const [openSupplyMarketDialog, setOpenSupplyDialog] = useState(false)
    const [openBorrowMarketDialog, setOpenBorrowMarketDialog] = useState(false)

    const enterMarketDialog = (market: CTokenInfo) : void => {
      const selected = [...marketsData].find(x => x.underlying.symbol === market.underlying.symbol)
      const selectedSpinner = [...marketsSpinners].find(x => x.symbol === market.underlying.symbol)
      
      setSelectedMarket(selected)
      setSelectedMarketSpinners(selectedSpinner)
      setOpenEnterMarket(true)
    }

    const closeMarketDialog = () : void => {
      if(!spinnerVisible){
        setOpenEnterMarket(false)
      }
    }
    
    const supplyMarketDialog = (market: CTokenInfo) => {
      const selected = [...marketsData].find(x => x.underlying.symbol === market.underlying.symbol)
      const selectedSpinner = [...marketsSpinners].find(x => x.symbol === market.underlying.symbol)
      
      setSelectedMarket(selected)
      setSelectedMarketSpinners(selectedSpinner)
      setOpenSupplyDialog(true)
    }

    const closeSupplyMarketDialog = () =>{
      if(!spinnerVisible){
        setOpenSupplyDialog(false)
      }
    }

    const borrowMarketDialog = (market: CTokenInfo) : void => {
      const selected = [...marketsData].find(x => x.underlying.symbol === market.underlying.symbol)
      const selectedSpinner = [...marketsSpinners].find(x => x.symbol === market.underlying.symbol)
      
      setSelectedMarket(selected)
      setSelectedMarketSpinners(selectedSpinner)
      setOpenBorrowMarketDialog(true)
    }

    const closeBorrowMarketDialog = () => {
      if(!spinnerVisible){
        setOpenBorrowMarketDialog(false)
      }
  }
    return (
        <div className="content">
            {/* <GeneralDetails/> */}
            {/* <Markets
                enterMarketDialog={enterMarketDialog}
                supplyMarketDialog={supplyMarketDialog}
                borrowMarketDialog={borrowMarketDialog}
            /> */}
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