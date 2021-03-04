import React from "react"
import { convertToLargeNumberRepresentation, zeroStringIfNullish } from "../../helpers"
import Section from "../Section/section"
import { GeneralDetailsItem, GeneralDetailsItemContent, GeneralDetailsItemContentItem, GeneralDetailsItemTitle } from "./generalDetailsItem"
import "./style.css"

const GeneralDetails = (props) => {
    return (
        <Section>
                <GeneralDetailsItem>
                    <GeneralDetailsItemTitle  title="Market Overview"/>
                        <GeneralDetailsItemContent>
                            <GeneralDetailsItemContentItem label="Total Supply:" 
                                value={`$${convertToLargeNumberRepresentation(props.generalData?.allMarketsTotalSupplyBalance?.precision(4))}`}/>
                            <GeneralDetailsItemContentItem label="Total Borrow:" 
                                value={`$${convertToLargeNumberRepresentation(props.generalData?.allMarketsTotalBorrowBalance?.precision(4))}`}/>
                            <GeneralDetailsItemContentItem label="Total Liquidity:" 
                                value={`$${convertToLargeNumberRepresentation(props.generalData?.totalLiquidity?.precision(4))}`}/>
                        </GeneralDetailsItemContent>
                </GeneralDetailsItem>
                <GeneralDetailsItem>
                    <GeneralDetailsItemTitle  title="Balances"/>
                        <GeneralDetailsItemContent>
                            <GeneralDetailsItemContentItem label="Supply:" 
                                value={`$${zeroStringIfNullish(props.generalData?.totalSupplyBalance?.toFixed(2), 2)}`}/>
                            <GeneralDetailsItemContentItem label="Borrow:" 
                                value={`$${zeroStringIfNullish(props.generalDetails?.totalBorrowBalance?.toFixed(2),2)}`}/>
                            <GeneralDetailsItemContentItem label="Borrow Limit:" 
                                value={`$${zeroStringIfNullish(props.generalDetails?.totalBorrowLimit?.toFixed(2),2)}`}
                                valueDetails={`(${zeroStringIfNullish(props.generalDetails?.totalBorrowLimitUsedPercent?.toFixed(2),2)}% Used)`}/>
                        </GeneralDetailsItemContent>
                </GeneralDetailsItem>
                
                <GeneralDetailsItem>
                    <GeneralDetailsItemTitle  title="Net APY"/>
                    <GeneralDetailsItemContent>
                        <GeneralDetailsItemContentItem className="center"
                            value={`${zeroStringIfNullish(props.generalDetails?.netApy?.times(100).toFixed(2),2)}%`}/>
                        <GeneralDetailsItemContentItem label="PCT (supply):" 
                            value={`+ ${zeroStringIfNullish(props.generalDetails?.totalSupplyPctApy?.times(100).toFixed(2),2)}%`}/>
                        <GeneralDetailsItemContentItem label="PCT (borrow):" 
                            value={`+ ${zeroStringIfNullish(props.generalDetails?.totalBorrowPctApy?.times(100).toFixed(2),2)}%`}/>
                    </GeneralDetailsItemContent>
                </GeneralDetailsItem>
                
                    
        </Section>
    )
}

export default GeneralDetails