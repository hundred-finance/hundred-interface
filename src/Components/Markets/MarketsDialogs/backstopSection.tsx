import { BigNumber } from '../../../bigNumber';
import React from 'react';
import './dialogSection.css';
import { CTokenInfo } from '../../../Classes/cTokenClass';

interface Props {
    market: CTokenInfo;
}

const BackstopSection: React.FC<Props> = (props: Props) => {
    // const BorrowLimit = () : void => {
    //     const value = props.generalData && props.newBorrowLimit && props.newBorrowLimit.gt(BigNumber.from(0)) ?  +props.generalData?.totalBorrowBalance.toString() / (+props.newBorrowLimit.toString()) * 100 : 0
    //     setBorrowLimit(BigNumber.parseValue(value.toFixed(18)))

    // }

    return (
        <div className="dialog-section dialog-section-no-top-gap">
            <div className="dialog-section-title">Balances</div>
            <div className="dialog-section-content">
                <div className="dialog-section-content-header">TVL</div>
                <div className="dialog-section-content-value">${props.market.backstop?.tvl.toRound(2, true)}</div>
            </div>
            <div className="dialog-section-content">
                <div className="dialog-section-content-header">APR</div>
                <div className="dialog-section-content-value">
                    {props.market.backstop
                        ? props.market.backstop.apr.toNumeral() * 100 > 10000
                            ? '>10,000'
                            : BigNumber.parseValue((props.market.backstop.apr.toNumeral() * 100).noExponents()).toRound(
                                  2,
                                  true,
                                  true,
                              )
                        : 0.0}
                    %
                </div>
            </div>
            <div className="dialog-section-content">
                <div className="dialog-section-content-header">Backstop Balance</div>
                <div className="dialog-section-content-value">
                    {props.market.backstop?.userBalance.toRound(2, true)} {props.market.backstop?.symbol}
                </div>
            </div>
            {props.market.backstop && (props.market.backstop as any).ethBalance ? (
                <div className="dialog-section-content-details">
                    <div className="dialog-section-content-header-details"></div>
                    <div className="dialog-section-content-value-details">
                        (
                        {props.market.backstop
                            ? BigNumber.parseValue(
                                  (
                                      +props.market.backstop.userBalance.toString() *
                                      +props.market.backstop.sharePrice.toString()
                                  ).noExponents(),
                              ).toRound(2, true)
                            : 0}{' '}
                        {props.market.underlying.symbol} +{' '}
                        {props.market.backstop
                            ? +(props.market.backstop as any).userEthBalance.toRound(2) === 0 &&
                              +(props.market.backstop as any).userEthBalance.toString() > 0
                                ? '>' + (props.market.backstop as any).userEthBalance.toRound(2, true, true)
                                : (props.market.backstop as any).userEthBalance.toRound(2, true, true)
                            : 0}{' '}
                        ETH)
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default BackstopSection;
// props.generalData && props.newBorrowLimit && props.newBorrowLimit.gt(BigNumber.from(0)) ?
// BigNumber.parseValue((+props.generalData?.totalBorrowBalance.toString() / (+props.newBorrowLimit.toString()) * 100).toFixed(18)).toRound(2) : 0
