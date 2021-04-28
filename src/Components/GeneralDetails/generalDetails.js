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
                            <GeneralDetailsItemContentItem label="Total Supply:" bottomBorder
                                value={`$${convertToLargeNumberRepresentation(props.generalData?.allMarketsTotalSupplyBalance?.precision(4))}`}/>
                            <GeneralDetailsItemContentItem label="Total Borrow:" bottomBorder
                                value={`$${convertToLargeNumberRepresentation(props.generalData?.allMarketsTotalBorrowBalance?.precision(4))}`}/>
                            <GeneralDetailsItemContentItem label="Total Liquidity:" 
                                value={`$${convertToLargeNumberRepresentation(props.generalData?.totalLiquidity?.precision(4))}`}/>
                        </GeneralDetailsItemContent>
                </GeneralDetailsItem>
                <GeneralDetailsItem className="general-details-item-second">
                    <GeneralDetailsItemTitle  title="Balances"/>
                        <GeneralDetailsItemContent>
                            <GeneralDetailsItemContentItem label="Supply:" bottomBorder
                                value={`$${convertToLargeNumberRepresentation(props.generalData?.totalSupplyBalance?.precision(4))}`}/>
                            <GeneralDetailsItemContentItem label="Borrow:" bottomBorder
                                value={`$${zeroStringIfNullish(props.generalData?.totalBorrowBalance?.toFixed(2),2)}`}/>
                            <GeneralDetailsItemContentItem label="Borrow Limit:" 
                                value={`$${zeroStringIfNullish(props.generalData?.totalBorrowLimit?.toFixed(2),2)}`}
                                valueDetails={`(${zeroStringIfNullish(props.generalData?.totalBorrowLimitUsedPercent?.toFixed(2),2)}% Used)`}/>
                        </GeneralDetailsItemContent>
                </GeneralDetailsItem>
                
                <GeneralDetailsItem className="general-details-item-third">
                    <GeneralDetailsItemTitle  title="Net APY"/>
                    <GeneralDetailsItemContent>
                        <GeneralDetailsItemContentItem className="center" bottomBorder
                            value={`${zeroStringIfNullish(props.generalData?.netApy?.times(100).toFixed(2),2)}%`}/>
                        <GeneralDetailsItemContentItem label="100 (supply):" bottomBorder
                            value={`+ ${zeroStringIfNullish(props.generalData?.totalSupplyPctApy?.times(100).toFixed(2),2)}%`}/>
                        <GeneralDetailsItemContentItem label="100 (borrow):" 
                            value={`+ ${zeroStringIfNullish(props.generalData?.totalBorrowPctApy?.times(100).toFixed(2),2)}%`}/>
                    </GeneralDetailsItemContent>
                </GeneralDetailsItem>
                
                    
        </Section>
    )
}

export default GeneralDetails