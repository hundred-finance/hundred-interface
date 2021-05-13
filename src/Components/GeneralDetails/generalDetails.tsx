import React from "react"
import { GeneralDetailsData } from "../../Classes/generalDetailsClass"
import { convertToLargeNumberRepresentation, zeroStringIfNullish } from "../../helpers"
import Section from "../Section/section"
import { GeneralDetailsItem, GeneralDetailsItemContent, GeneralDetailsItemContentItem, GeneralDetailsItemTitle } from "./generalDetailsItem"
import "./style.css"

interface Props{
    generalData: GeneralDetailsData | null

}

const GeneralDetails: React.FC<Props> = ({generalData} : Props) => {
    return (
        <Section className="general-details-section">
                <GeneralDetailsItem>
                    <GeneralDetailsItemTitle  title="Market Overview"/>
                        <GeneralDetailsItemContent>
                            <GeneralDetailsItemContentItem label="Total Supply:" 
                                value={`$${generalData ? convertToLargeNumberRepresentation(generalData?.allMarketsTotalSupplyBalance, 54) : '0'}`}/>
                            <GeneralDetailsItemContentItem label="Total Borrow:" 
                                value={`$${generalData ? convertToLargeNumberRepresentation(generalData?.allMarketsTotalBorrowBalance, 36) : '0'}`}/>
                            <GeneralDetailsItemContentItem label="Total Liquidity:" 
                                value={`$${generalData ? convertToLargeNumberRepresentation(generalData?.totalLiquidity, 36): 0}`}/>
                        </GeneralDetailsItemContent>
                </GeneralDetailsItem>
                <GeneralDetailsItem>
                    <GeneralDetailsItemTitle  title="Balances"/>
                        <GeneralDetailsItemContent>
                            <GeneralDetailsItemContentItem label="Supply:" 
                                value={`$${generalData ? convertToLargeNumberRepresentation(generalData?.totalSupplyBalance, 54) : '0'}`}/>
                            <GeneralDetailsItemContentItem label="Borrow:" 
                                value={`$${generalData ? zeroStringIfNullish(generalData?.totalBorrowBalance, 54, 2) : '0'}`}/>
                            <GeneralDetailsItemContentItem label="Borrow Limit:" 
                                value={`$${generalData ? zeroStringIfNullish(generalData?.totalBorrowLimit, 72, 2) : '0'}`}
                                valueDetails={`(${generalData ? zeroStringIfNullish(generalData?.totalBorrowLimitUsedPercent, 18, 2) : '0'}% Used)`}/>
                        </GeneralDetailsItemContent>
                </GeneralDetailsItem>
                
                <GeneralDetailsItem>
                    <GeneralDetailsItemTitle  title="Net APY"/>
                    <GeneralDetailsItemContent>
                        <GeneralDetailsItemContentItem className="center"
                            // Check Number
                            value={`${generalData ? zeroStringIfNullish(generalData?.netApy, 18, 2) : 0}%`}/> 
                        <GeneralDetailsItemContentItem label="100 (supply):" 
                            value={`+ ${generalData ? zeroStringIfNullish(generalData?.totalSupplyPctApy, 18, 2) : 0}%`}/>
                        <GeneralDetailsItemContentItem label="100 (borrow):" 
                            value={`+ ${generalData ? zeroStringIfNullish(generalData?.totalBorrowPctApy, 18, 2) : 0}%`}/>
                    </GeneralDetailsItemContent>
                </GeneralDetailsItem>
                
                    
        </Section>
    )
}

export default GeneralDetails