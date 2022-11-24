import React, { useEffect, useState } from "react"
import { CTokenInfo } from "../../Classes/cTokenClass"
import Section from "../Section/section"
import BorrowMarket from "./BorrowMarket/borrowMarket"
import {MarketContainer, MarketContainerTitle, MarketContainerShowMore} from "./marketContainer"
import "./style.css"
import SupplyMarket from "./SupplyMarkets/supplyMarket"
import { useHundredDataContext } from "../../Types/hundredDataContext"
import Button from "../Button/button"
import { useGlobalContext } from "../../Types/globalContext"
import { useWeb3React } from "@web3-react/core"
import SearchTextBox from "../SearchTexBox/searchTextBox"

interface Props{
    enterMarketDialog: (market: CTokenInfo) => void,
    supplyMarketDialog: (market: CTokenInfo) => void,
    borrowMarketDialog: (market: CTokenInfo) => void,
}
const Markets: React.FC<Props> = (props : Props) => {
    const {network} = useGlobalContext()
    const {account} = useWeb3React()
    const [allAssets, setAllAssets] = useState(true)
    const [myAssets, setMyAssets] = useState(false)
    const [searchAssets, setSearchAssets] = useState("")

    useEffect(() => {
        setAllAssets(true)
        setMyAssets(false)
        setSearchAssets("")
    }, [network, account])

    return (
        <div className="markets-wrapper">
            <div className="cube7"></div>
            <div className="cube8"></div>
            <div className="cube9"></div>
            <div className="markets">
                <div className="assets-functions">
                    <div className="assets-buttons">
                        <Button onClick={() => {
                            setAllAssets(true)
                            setMyAssets(false)
                            setSearchAssets("")
                            }} rectangle={true} large={true} active={allAssets}>
                                ALL ASSETS
                        </Button>
                        <Button onClick={() => {
                            setAllAssets(false)
                            setMyAssets(true)
                            setSearchAssets("")
                            }} rectangle={true} large={true} active={myAssets}>
                                MY ASSETS
                        </Button>
                    </div>
                    <div className="assets-search">
                            <SearchTextBox searchText={searchAssets} setSearchText={setSearchAssets}/>
                    </div>
                </div>
                <div className="markets-content">
                    <MarketContainer>
                        <MarketContainerTitle>
                            Supply Market
                        </MarketContainerTitle>
                        <SupplyMarket allAssets = {allAssets} myAssets = {myAssets} searchAssets={searchAssets}
                                      enterMarketDialog = {props.enterMarketDialog} 
                                      supplyMarketDialog={props.supplyMarketDialog}/>
                    </MarketContainer>
                  
                    <MarketContainer>
                        <MarketContainerTitle>
                            Borrow Market
                        </MarketContainerTitle>
                        <BorrowMarket allAssets={allAssets} myAssets={myAssets} searchAssets={searchAssets}
                            borrowMarketDialog={props.borrowMarketDialog}/>
                    </MarketContainer>
                </div>
            </div>
        </div>
    )
}

export default Markets