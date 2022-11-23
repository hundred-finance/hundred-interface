import React from 'react';
import './starBpro.css';
import star from '../../assets/icons/rating-star.svg';
import bpro from '../../assets/images/BPRO-logo.svg';
import ReactTooltip from 'react-tooltip';
import { useEffect } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

interface Props {
    active: boolean;
    backstop: boolean;
}

const StarBpro: React.FC<Props> = (props: Props) => {
    useEffect(() => {
        ReactTooltip.rebuild();
    }); 

    return props.active && props.backstop ? (
        <div className="star-bpro star-bpro-icons" onClick={(e) => e.stopPropagation()}>
            <Tippy content={
                <div>
                    This market includes a B.Protocol backstop pool.<br/>
                    Learn more about backstop pools <a className="a" target="_blank" rel="noreferrer" href="https://docs.hundred.finance/core-protocol/backstop-provision">here</a>
                </div>
            } interactive={true}>
                <img src={bpro}/>
            </Tippy>
            <img src={star} />
            {/* <ReactTooltip id="BPRO" place="top" effect="solid" delayHide={100} delayShow={100} delayUpdate={100}>
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
            </ReactTooltip> */}
        </div>
    ) : props.active ? (
        <div className="star star-bpro-icons">
            <img src={star} />
        </div>
    ) : props.backstop ? (
        <div className="bpro star-bpro-icons" onClick={(e) => e.stopPropagation()}>
            <Tippy content={
                <div style={{textAlign:"left"}}>
                    This market includes a B.Protocol backstop pool.<br/>
                    Learn more about backstop pools <a className="a" target="_blank" rel="noreferrer" href="https://docs.hundred.finance/core-protocol/backstop-provision"> here</a>
                </div>
            } interactive={true}>
                <img src={bpro}/>
            </Tippy>
            {/* <ReactTooltip id="BPRO" place="top" effect="solid" delayHide={100} delayShow={100} delayUpdate={100}>
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
            </ReactTooltip> */}
        </div>
    ) : (
        <></>
    );
};

export default StarBpro;
