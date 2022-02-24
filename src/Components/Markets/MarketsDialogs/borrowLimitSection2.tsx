import { BigNumber } from '../../../bigNumber';
import React, { useEffect, useState } from 'react';
import { HuArrow } from '../../../assets/huIcons/huIcons';
import { CTokenInfo } from '../../../Classes/cTokenClass';
import { GeneralDetailsData } from '../../../Classes/generalDetailsClass';
import './dialogSection.css';
import ReactToolTip from 'react-tooltip';

interface Props {
    generalData: GeneralDetailsData | null;
    borrowAmount: string;
    repayAmount: string;
    market: CTokenInfo | null;
}

const BorrowLimitSection2: React.FC<Props> = (props: Props) => {
    const [borrowBalance, setBorrowBalance] = useState<BigNumber>(BigNumber.from('0'));
    const [borrowLimit, setBorrowLimit] = useState<BigNumber>(BigNumber.from('0'));

    useEffect(() => {
        if (props.generalData && props.market) {
            if (
                (props.borrowAmount !== '' && !isNaN(+props.borrowAmount) && props.repayAmount === '0') ||
                (props.repayAmount !== '' && !isNaN(+props.repayAmount) && props.borrowAmount === '0')
            ) {
                getNewBorrowBalance(
                    props.generalData.totalBorrowBalance,
                    props.borrowAmount,
                    props.repayAmount,
                    props.market?.underlying.price,
                );
            } else {
                setBorrowBalance(BigNumber.from(0));
                setBorrowLimit(BigNumber.from(0));
            }
        }
    }, [props.borrowAmount, props.repayAmount, props.generalData]);

    useEffect(() => {
        ReactToolTip.rebuild();
    });

    const getNewBorrowBalance = (
        originBorrowBalance: BigNumber,
        borrowAmount: string,
        repayAmount: string,
        underlyingPrice: BigNumber,
    ): void => {
        if (props.generalData) {
            if (borrowAmount === '' || isNaN(+borrowAmount)) borrowAmount = '0';
            if (repayAmount === '' || isNaN(+repayAmount)) repayAmount = '0';
            const value =
                +originBorrowBalance.toString() +
                (+BigNumber.parseValue(borrowAmount).toString() - +BigNumber.parseValue(repayAmount).toString()) *
                    +underlyingPrice.toString();
            // const value = (originBorrowBalance.add((BigNumber.parseValue(borrowAmount).sub(BigNumber.parseValue(repayAmount)).mul(underlyingPrice))))
            setBorrowBalance(value === 0 ? BigNumber.from(0) : BigNumber.parseValue(value.toFixed(18)));
            const pValue =
                +props.generalData.totalBorrowLimit.toString() > 0
                    ? (+value / +props.generalData.totalBorrowLimit.toString()) * 100
                    : 0;
            setBorrowLimit(pValue === 0 ? BigNumber.from(0) : BigNumber.parseValue(pValue.toFixed(18)));
        }
    };

    return (
        <div className="dialog-section">
            <div className="dialog-section-title">Borrow Limit</div>
            <div className="dialog-section-content">
                <div className="dialog-section-content-header">Borrow Balance</div>
                <div className="dialog-section-content-value">
                    <span>
                        {`$${
                            props.generalData?.totalBorrowBalance
                                ? props.generalData?.totalBorrowBalance.toRound(2, false, true)
                                : 0
                        }`}
                    </span>
                    <span
                        className={`dialog-section-arrow ${
                            borrowBalance.gt(BigNumber.from('0')) ? 'dialog-section-arrow-active' : ''
                        }`}
                    >
                        <HuArrow width={'15px'} height={'12px'} color={'rgb(66, 122, 241)'} />
                    </span>
                    {borrowBalance.gt(BigNumber.from('0')) ? (
                        <span>{`$${borrowBalance.toRound(2, false, true)}`}</span>
                    ) : null}
                </div>
            </div>
            <div className="dialog-section-content">
                <div className="dialog-section-content-header">Borrow Limit Used</div>
                <div className="dialog-section-content-value">
                    <span>
                        {`${
                            props.generalData?.totalBorrowLimitUsedPercent
                                ? props.generalData?.totalBorrowLimitUsedPercent.toRound(2, false, true)
                                : 0
                        }%`}
                    </span>
                    <span
                        className={`dialog-section-arrow ${
                            borrowLimit.gt(BigNumber.from('0')) ? 'dialog-section-arrow-active' : ''
                        }`}
                    >
                        <HuArrow width={'15px'} height={'12px'} color={'rgb(66, 122, 241)'} />
                    </span>
                    {borrowLimit.gt(BigNumber.from('0')) ? (
                        +borrowLimit.toRound(2) >= 90.01 ? (
                            <div
                                style={{
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}
                                data-for="borrow-dialog-tooltip"
                                data-tip="You are not allowed to use more than 90% of your borrow limit via the website."
                            >
                                <span style={{ color: 'red', cursor: 'pointer' }}>
                                    {`${borrowLimit.toRound(2, false, true)}% `}
                                </span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    fill="currentColor"
                                    style={{ paddingLeft: '5px' }}
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                    <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                                </svg>
                            </div>
                        ) : (
                            <span>{`${borrowLimit.toRound(2, false, true)}% `}</span>
                        )
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default BorrowLimitSection2;
