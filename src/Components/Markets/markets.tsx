import React, { useState } from "react"
import { CTokenInfo } from "../../Classes/cTokenClass"
import Section from "../Section/section"
import BorrowMarket from "./BorrowMarket/borrowMarket"
import {MarketContainer, MarketContainerTitle, MarketContainerShowMore} from "./marketContainer"
import "./style.css"
import SupplyMarket from "./SupplyMarkets/supplyMarket"
import { useHundredDataContext } from "../../Types/hundredDataContext"

interface Props{
    enterMarketDialog: (market: CTokenInfo) => void,
    supplyMarketDialog: (market: CTokenInfo) => void,
    borrowMarketDialog: (market: CTokenInfo) => void,
}
const Markets: React.FC<Props> = (props : Props) => {
    const [showMore, setShowMore] = useState<boolean>(false)

    const s = props.enterMarketDialog
   
    return (
        <div className="markets-wrapper">
            <div className="markets">
                <MarketContainer>
                    <MarketContainerTitle>
                        Supply Market
                    </MarketContainerTitle>
                    <SupplyMarket enterMarketDialog = {props.enterMarketDialog} supplyMarketDialog={props.supplyMarketDialog}/>
                </MarketContainer>
                  
                <MarketContainer>
                    <MarketContainerTitle>
                        Borrow Market
                    </MarketContainerTitle>
                    <BorrowMarket borrowMarketDialog={props.borrowMarketDialog}/>
                </MarketContainer>
            </div>
        </div>
    )
}

export default Markets