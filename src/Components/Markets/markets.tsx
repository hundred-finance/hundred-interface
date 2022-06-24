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
    const {marketsData} = useHundredDataContext()

    const handleSupplyMore = () : void => {
        setShowMore(!showMore)
    }

    const handleBorrowMore = () : void => {
        setShowMore(!showMore)
    }

    return (
        <Section className="markets-section">
            <div className="markets">
            <MarketContainer>
                <MarketContainerTitle>
                    Supply Market
                </MarketContainerTitle>
                <SupplyMarket
                    enterMarketDialog = {props.enterMarketDialog}
                    supplyMarketDialog={props.supplyMarketDialog}
                    more={showMore}
                />
                {marketsData && [...marketsData].length > 6 ? <MarketContainerShowMore onClick={handleSupplyMore}>
                {
                    !showMore ? (
                          "SHOW MORE"
                    ) : (
                          "SHOW LESS"
                    )
                  }
                </MarketContainerShowMore> : null}
            </MarketContainer>
            
            <MarketContainer>
                <MarketContainerTitle>
                    Borrow Market
                </MarketContainerTitle>
                <BorrowMarket borrowMarketDialog={props.borrowMarketDialog} more={showMore}/>
                {marketsData && [...marketsData].length > 6 ?<MarketContainerShowMore onClick={handleBorrowMore}>
                {
                    !showMore ? (
                          "SHOW MORE"
                    ) : (
                          "SHOW LESS"
                    )
                  }
                </MarketContainerShowMore> : null}
            </MarketContainer>
            
        </div>
        </Section>
    )
}

export default Markets