import { BigNumber } from '../../bigNumber';
import React from 'react';
import { GeneralDetailsData } from '../../Classes/generalDetailsClass';
import './borrowLimit.css';

interface Props {
    generalData: GeneralDetailsData | null;
    newBorrowLimit?: BigNumber | null;
}

const DialogBorrowLimitSection: React.FC<Props> = (props: Props) => {
    return (
        <div className="borrow-limit-section">
            <div className="borrow-limit-header">Borrow Limit</div>
            <div className="borrow-limit-item">
                <div>Borrow Limit</div>
                <div className="borrow-limit-item-details">
                    <span>
                        {`$${props.generalData?.totalBorrowLimit ? props.generalData?.totalBorrowLimit.toFixed(2) : 0}`}
                    </span>
                    {props.newBorrowLimit ? (
                        <span>
                            {'>'}
                            <span>{`$${props.newBorrowLimit.toFixed(2)}`}</span>
                        </span>
                    ) : null}
                </div>
            </div>
            <div className="borrow-limit-item">
                <div>Borrow Limit Used</div>
                <div className="borrow-limit-item-details">
                    <span>
                        {`${
                            props.generalData?.totalBorrowLimitUsedPercent
                                ? props.generalData?.totalBorrowLimitUsedPercent.toFixed(2)
                                : 0
                        }%`}
                    </span>
                    {props.newBorrowLimit ? (
                        <span>
                            {'>'}
                            <span
                                style={{
                                    color: props.generalData?.totalBorrowBalance
                                        ?.div(props.newBorrowLimit)
                                        .gt(BigNumber.from('1'))
                                        ? 'red'
                                        : '',
                                }}
                            >
                                {`${
                                    props.generalData && props.generalData.totalBorrowBalance && props.newBorrowLimit
                                        ? props.generalData.totalBorrowBalance
                                              .div(props.newBorrowLimit)
                                              .mul(BigNumber.from('100'))
                                              .toFixed(2)
                                        : 0
                                }%`}
                            </span>
                        </span>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default DialogBorrowLimitSection;
