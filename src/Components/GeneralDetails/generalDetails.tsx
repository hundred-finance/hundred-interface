import React from "react"
import { BigNumber } from "../../bigNumber"
import { GeneralDetailsData } from "../../Classes/generalDetailsClass"
import Section from "../Section/section"
import { GeneralDetailsItem, GeneralDetailsItemContent, GeneralDetailsItemContentItem, GeneralDetailsItemTitle } from "./generalDetailsItem"
import "./style.css"

interface Props{
    generalData: GeneralDetailsData | undefined

}

const GeneralDetails: React.FC<Props> = ({generalData} : Props) => {
    return (
        <Section className="general-details-section">
                <GeneralDetailsItem>
                    <GeneralDetailsItemTitle  title="Market Overview"/>
                        <GeneralDetailsItemContent>
                            <GeneralDetailsItemContentItem label="Total Supply" 
                                value={`$${generalData ? generalData?.allMarketsTotalSupplyBalance.toRound(2, true, true) : '0'}`}/>
                            <GeneralDetailsItemContentItem label="Total Staked"
                                                           value={`$${generalData ? generalData?.allMarketsTotalStakeBalance.toRound(2, true, true) : '0'}`}/>
                            <GeneralDetailsItemContentItem label="Total Borrow" 
                                value={`$${generalData ? generalData?.allMarketsTotalBorrowBalance.toRound(2, true, true) : '0'}`}/>
                            <GeneralDetailsItemContentItem label="Total Liquidity" 
                                value={`$${generalData ? generalData?.totalLiquidity.toRound(2, true, true): 0}`}/>
                        </GeneralDetailsItemContent>
                </GeneralDetailsItem>
                <GeneralDetailsItem>
                    <GeneralDetailsItemTitle  title="Balances"/>
                        <GeneralDetailsItemContent>
                            <GeneralDetailsItemContentItem label="Supply" 
                                value={`$${generalData ? generalData?.totalSupplyBalance.toRound(2, true, true) : '0'}`}/>
                            <GeneralDetailsItemContentItem label="Staked"
                                                           value={`$${generalData ? generalData?.totalStakeBalance.toRound(2, true, true) : '0'}`}/>
                            <GeneralDetailsItemContentItem label="Borrow" 
                                value={`$${generalData ? generalData?.totalBorrowBalance.toRound(2, true, true) : '0'}`}/>
                            <GeneralDetailsItemContentItem label="Borrow Limit" 
                                value={`$${generalData ? generalData?.totalBorrowLimit.toRound(2, true, true) : '0'}`}
                                valueDetails={`(${generalData ? generalData?.totalBorrowLimitUsedPercent.toRound(2) : '0'}% Used)`}/>
                        </GeneralDetailsItemContent>
                </GeneralDetailsItem>
                
                <GeneralDetailsItem>
                    <GeneralDetailsItemTitle  title="APR"/>
                    <GeneralDetailsItemContent>
                        <GeneralDetailsItemContentItem label="Supply"
                            value={`${generalData && +generalData.totalSupplyBalance.toString() > 0 ? 
                            +BigNumber.parseValue((+generalData?.yearSupplyInterest.toString() / +generalData.totalSupplyBalance.toString() * 100).noExponents()).toRound(3, true) >= 0.01 
                            ? BigNumber.parseValue((+generalData?.yearSupplyInterest.toString() / +generalData.totalSupplyBalance.toString() * 100).noExponents()).toRound(3, true)
                            : "<0.01": 0}%`}/>
                        <GeneralDetailsItemContentItem label="Staking"
                                                       value={`${generalData && +generalData.totalStakeBalance.toString() > 0 ?
                                                           BigNumber.parseValue((+generalData?.yearStakeInterest.toString() / +generalData.totalStakeBalance.toString() * 100).noExponents()).toRound(3, true) : 0}%`}/>
                        <GeneralDetailsItemContentItem label="Borrow" 
                            value={`${generalData && +generalData.totalBorrowBalance.toString() > 0 ? 
                            BigNumber.parseValue((+generalData?.yearBorrowInterest.toString() / +generalData.totalBorrowBalance.toString() * 100).noExponents()).toRound(3, true) : 0}%`}/>
                        <GeneralDetailsItemContentItem label="Net" toolTip="APY on your total outlay (supplied minus borrowed)"
                            value={`${generalData ? BigNumber.parseValue((+generalData?.netApy.toString() * 100).noExponents()).toRound(3, true) : 0}%`}/>
                    </GeneralDetailsItemContent>
                </GeneralDetailsItem>
                
                    
        </Section>
    )
}

export default GeneralDetails