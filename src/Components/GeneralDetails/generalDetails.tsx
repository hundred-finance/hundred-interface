import React from "react"
import { GeneralDetailsData } from "../../Classes/generalDetailsClass"
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
                                value={`$${generalData ? generalData?.allMarketsTotalSupplyBalance.toRound(2) : '0'}`}/>
                            <GeneralDetailsItemContentItem label="Total Borrow:" 
                                value={`$${generalData ? generalData?.allMarketsTotalBorrowBalance.toRound(2) : '0'}`}/>
                            <GeneralDetailsItemContentItem label="Total Liquidity:" 
                                value={`$${generalData ? generalData?.totalLiquidity.toRound(2): 0}`}/>
                        </GeneralDetailsItemContent>
                </GeneralDetailsItem>
                <GeneralDetailsItem>
                    <GeneralDetailsItemTitle  title="Balances"/>
                        <GeneralDetailsItemContent>
                            <GeneralDetailsItemContentItem label="Supply:" 
                                value={`$${generalData ? generalData?.totalSupplyBalance.toRound(2) : '0'}`}/>
                            <GeneralDetailsItemContentItem label="Borrow:" 
                                value={`$${generalData ? generalData?.totalBorrowBalance.toRound(2) : '0'}`}/>
                            <GeneralDetailsItemContentItem label="Borrow Limit:" 
                                value={`$${generalData ? generalData?.totalBorrowLimit.toRound(2) : '0'}`}
                                valueDetails={`(${generalData ? generalData?.totalBorrowLimitUsedPercent.toRound(2) : '0'}% Used)`}/>
                        </GeneralDetailsItemContent>
                </GeneralDetailsItem>
                
                <GeneralDetailsItem>
                    <GeneralDetailsItemTitle  title="Net APY"/>
                    <GeneralDetailsItemContent>
                        <GeneralDetailsItemContentItem className="center"
                            // Check Number
                            value={`${generalData ? generalData?.netApy.toRound(2) : 0}%`}/> 
                        <GeneralDetailsItemContentItem label="100 (supply):" 
                            value={`+ ${generalData ? generalData?.totalSupplyPctApy.toRound(2) : 0}%`}/>
                        <GeneralDetailsItemContentItem label="100 (borrow):" 
                            value={`+ ${generalData ? generalData?.totalBorrowPctApy.toRound(2) : 0}%`}/>
                    </GeneralDetailsItemContent>
                </GeneralDetailsItem>
                
                    
        </Section>
    )
}

export default GeneralDetails