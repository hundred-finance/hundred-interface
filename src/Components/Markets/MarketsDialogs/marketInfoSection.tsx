import React from 'react';
import { BigNumber } from '../../../bigNumber';
import { CTokenInfo } from '../../../Classes/cTokenClass';
import './dialogSection.css';

interface Props {
    collateralFactorText?: string;
    market: CTokenInfo | null;
}

const DialogMarketInfoSection: React.FC<Props> = (props: Props) => {
    const getSupplyBorrowed = (): string => {
        if (props.market) {
            const marketTotalBorrowInTokenUnit = +props.market?.marketTotalBorrowInTokenUnit.toString();
            const underlyingAmount = +props.market?.cash.toString();
            let value = (marketTotalBorrowInTokenUnit / (marketTotalBorrowInTokenUnit + underlyingAmount)) * 100;
            if (isNaN(value)) value = 0;
            //else value = Math.round((value + Number.EPSILON) * Math.pow(10, 18)) / Math.pow(10, 18)
            return BigNumber.parseValue(value.toFixed(18)).toRound(2, false, true) + '%';
        }
        return '0%';
    };

    return (
        <div className="dialog-section">
            <div className="dialog-section-title">Market Info</div>
            {props.collateralFactorText ? (
                <div className="dialog-section-content">
                    <div className="dialog-section-content-header">
                        <span>{props.collateralFactorText}</span>
                    </div>
                    <div className="dialog-section-content-value" style={{ margin: '0px 0px 0px 0px' }}>
                        {`${
                            props.market
                                ? props.market?.collateralFactor?.mul(BigNumber.from(100)).toRound(2, false, true)
                                : '0.00'
                        }%`}
                    </div>
                </div>
            ) : null}
            <div className="dialog-section-content">
                <div className="dialog-section-content-header">
                    <span>% of Supply Borrowed</span>
                </div>
                <div className="dialog-section-content-value" style={{ margin: '0px 0px 0px 0px' }}>
                    {getSupplyBorrowed()}
                </div>
            </div>
        </div>
    );
};

export default DialogMarketInfoSection;
