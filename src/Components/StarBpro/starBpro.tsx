import React from 'react';
import './starBpro.css';
import star from '../../assets/icons/rating-star.svg';
import bpro from '../../assets/images/BPRO-logo.svg';
import ReactTooltip from 'react-tooltip';
import { useEffect } from 'react';

interface Props {
    active: boolean;
    backstop: boolean;
}

const StarBpro: React.FC<Props> = (props: Props) => {
    useEffect(() => {
        ReactTooltip.rebuild();
    });

    const handleClick = (e: any) => {
        console.log("STOP")
        e.stopPropagation();
  
    } 

    return props.active && props.backstop ? (
        <div className="star-bpro star-bpro-icons" onClick={(e) => e.stopPropagation()}>
            <img src={bpro} data-tip data-for="BPRO" />
            <img src={star} />
            <ReactTooltip id="BPRO" place="top" effect="solid" delayHide={100} delayShow={100} delayUpdate={100}>
                <p style={{ textAlign: 'center' }}>This market includes a B.Protocol backstop pool.</p>
                <p>
                    Learn more about backstop pools{' '}
                    <a
                        className="a"
                        target="_blank"
                        rel="noreferrer"
                        href="https://docs.hundred.finance/core-protocol/backstop-provision"
                    >
                        here
                    </a>{' '}
                </p>
            </ReactTooltip>
        </div>
    ) : props.active ? (
        <div className="star star-bpro-icons">
            <img src={star} />
        </div>
    ) : props.backstop ? (
        <div className="bpro star-bpro-icons" onClick={(e) => e.stopPropagation()}>
            <img src={bpro} data-tip data-for="BPRO" />
            <ReactTooltip id="BPRO" place="top" effect="solid" delayHide={100} delayShow={100} delayUpdate={100}>
                <div onClick={() => handleClick}>
                    <p style={{ textAlign: 'center' }}>This market includes a B.Protocol backstop pool.</p>
                    <p>
                        Learn more about backstop pools{' '}
                        <a
                            className="a"
                            target="_blank"
                            rel="noreferrer"
                            href="https://docs.hundred.finance/core-protocol/backstop-provision"
                            onClick={(e) => e.stopPropagation()}
                        >
                            here
                        </a>{' '}
                    </p>
                </div>
            </ReactTooltip>
        </div>
    ) : (
        <></>
    );
};

export default StarBpro;
