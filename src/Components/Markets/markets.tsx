import React, { useState } from "react"
import { CTokenInfo } from "../../Classes/cTokenClass"
import { GeneralDetailsData } from "../../Classes/generalDetailsClass"
import Section from "../Section/section"
import BorrowMarket from "./BorrowMarket/borrowMarket"
import {MarketContainer, MarketContainerTitle, MarketContainerShowMore} from "./marketContainer"
import "./style.css"
import SupplyMarket from "./SupplyMarkets/supplyMarket"

interface Props{
    generalData: GeneralDetailsData | null,
    marketsData: (CTokenInfo | null)[] | null,
    enterMarketDialog: (market: CTokenInfo) => void,
    supplyMarketDialog: (market: CTokenInfo) => void,
    borrowMarketDialog: (market: CTokenInfo) => void,
}
const Markets: React.FC<Props> = (props : Props) => {
    const [supplyMore, setSupplyMore] = useState<boolean>(false)
    const [borrowMore, setBorrowMore] = useState<boolean>(false)

    const handleSupplyMore = () : void => {
        setSupplyMore(!supplyMore)
    }

    const handleBorrowMore = () : void => {
        setBorrowMore(!borrowMore)
    }

    return (
        <Section className="markets-section">
            <div className="markets">
            <MarketContainer>
                <MarketContainerTitle>
                    Supply Market
                </MarketContainerTitle>
                <SupplyMarket generalData={props.generalData} marketsData = {props.marketsData} enterMarketDialog = {props.enterMarketDialog} 
                    supplyMarketDialog={props.supplyMarketDialog} more={supplyMore}/>
                <MarketContainerShowMore onClick={handleSupplyMore}>
                {
                    !supplyMore ? (
                          "SHOW MORE"
                    ) : (
                          "SHOW LESS"
                    )
                  }
                </MarketContainerShowMore>
            </MarketContainer>
            
            <MarketContainer>
                <MarketContainerTitle>
                    Borrow Market
                </MarketContainerTitle>
                <BorrowMarket generalData={props.generalData} marketsData = {props.marketsData} borrowMarketDialog={props.borrowMarketDialog} more={borrowMore}/>
                <MarketContainerShowMore onClick={handleBorrowMore}>
                {
                    !borrowMore ? (
                          "SHOW MORE"
                    ) : (
                          "SHOW LESS"
                    )
                  }
                </MarketContainerShowMore>
            </MarketContainer>
            
        </div>
        </Section>
    )
}

export default Markets