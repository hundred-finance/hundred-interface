import React from "react"
import Section from "../Section/section"
import BorrowMarket from "./BorrowMarket/borrowMarket"
import {MarketContainer, MarketContainerTitle} from "./marketContainer"
import "./style.css"
import SupplyMarket from "./SupplyMarkets/supplyMarket"

const Markets = (props) => {
    return (
        <Section className="secondary-section">
            <div className="markets">
                <MarketContainer>
                    <MarketContainerTitle>
                        Supply Market
                    </MarketContainerTitle>
                    <SupplyMarket generalData={props.generalData} marketsData = {props.marketsData} enterMarketDialog = {props.enterMarketDialog} supplyMarketDialog={props.supplyMarketDialog}/>
                </MarketContainer>
                
                <MarketContainer>
                    <MarketContainerTitle>
                        Borrow Market
                    </MarketContainerTitle>
                    <BorrowMarket generalData={props.generalData} marketsData = {props.marketsData} borrowMarketDialog={props.borrowMarketDialog}/>
                </MarketContainer>
                
            </div>
        </Section>
    )
}

export default Markets