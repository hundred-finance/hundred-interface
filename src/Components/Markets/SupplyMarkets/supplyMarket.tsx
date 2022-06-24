import React, { useEffect } from 'react';
import '../style.css';
import SupplyMarketRow from './supplyMarketRow';
import { compareSymbol, compareLiquidity, compareHndAPR } from '../../../helpers';
import { BigNumber } from '../../../bigNumber';
import { CTokenInfo } from '../../../Classes/cTokenClass';
import ReactTooltip from 'react-tooltip';
import { useUiContext } from '../../../Types/uiContext';
import { useHundredDataContext } from '../../../Types/hundredDataContext';

interface Props {
    enterMarketDialog: (market: CTokenInfo) => void;
    supplyMarketDialog: (market: CTokenInfo) => void;
    more: boolean;
}

const SupplyMarket: React.FC<Props> = (props: Props) => {
    const {darkMode} = useUiContext()
    const {generalData, marketsData, gaugesV4Data, marketsSpinners} = useHundredDataContext()

    useEffect(() => {
        ReactTooltip.rebuild();
    });

    return (
        <div className="market-content">
            <ReactTooltip
                place="top"
                effect="solid"
                backgroundColor={`${darkMode ? '#f9fafb' : ''}`}
                textColor={`${darkMode ? '#101010' : ''}`}
            />

          {/* React tooltip for adding info icon and doc link to APR table header */}
            <ReactTooltip id="APR" place="top" effect="solid" delayHide={100} delayShow={100} delayUpdate={100}>
            <p style={{ textAlign: 'center' }}>
                    Learn about APR{' '}
                    <a 
                        className="a"
                        target="_blank"
                        rel="noreferrer"
                        href="https://docs.hundred.finance/protocol-governance/hnd-staking-and-locking/boosting-apr-with-vehnd"
                    >
                        here
                    </a>{' '}
                </p>
            </ReactTooltip>

            <table className="market-table">
                <thead className="market-table-header">
                    <tr>
                        <th>Asset</th>
                        <th>
                            APR 
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="info-circle"
                                data-tip="test"
                                data-for="APR"
                                viewBox="0 0 16 16"
                            >
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                            </svg>
                        </th>

                        <th>Supplied</th>
                        <th>Wallet</th>
                        <th>Collateral</th>
                    </tr>
                </thead>
                <tbody className="market-table-content">
                    {{...generalData}?.totalSupplyBalance?.gt(BigNumber.from('0')) && (
                        <tr>
                            <td
                                style={{
                                    fontSize: '80%',
                                    fontWeight: 'bold',
                                    padding: '1px 0px 1px 15px',
                                }}
                            >
                                Supplying
                            </td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    )}
                    {marketsData.length > 0 && marketsSpinners.length > 0 ? [...marketsData]
                        ?.filter((item) => item?.supplyBalance?.gt(BigNumber.from('0')))
                        .sort(compareSymbol)
                        .sort(compareLiquidity)
                        .sort(compareHndAPR)
                        .map((market, index) => {
                            const spinners = [...marketsSpinners].find(x => x.symbol === market.underlying.symbol)
                            return (<SupplyMarketRow
                                key={index}
                                tooltip={`supply-${index}`}
                                market={market}
                                marketSpinners={spinners}
                                hasbackstopGauge={[...gaugesV4Data]?.find(g => g?.generalData.lpTokenUnderlying.toLowerCase() === market?.pTokenAddress.toLowerCase()) !== undefined}
                                enterMarketDialog={props.enterMarketDialog}
                                supplyMarketDialog={props.supplyMarketDialog}
                            />)
                            }): null}
                    {(generalData ? {...generalData}?.totalSupplyBalance.gt(BigNumber.from('0')) : false) && (
                        <tr>
                            <td
                                style={{
                                    fontSize: '80%',
                                    fontWeight: 'bold',
                                    padding: '1px 0px 1px 15px',
                                }}
                            >
                                Other Markets
                            </td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    )}
                  {marketsData.length > 0 && marketsSpinners.length > 0 ? [...marketsData]?.filter((item) => item?.supplyBalance?.lte(BigNumber.from("0")))
                    .sort(compareSymbol).sort(compareLiquidity).sort(compareHndAPR)
                    .map((market, index) => {
                      if(props.more || (!props.more && index < 6)) {
                        const spinners = [...marketsSpinners].find(x => x.symbol === market.underlying.symbol)
                        return (
                            <SupplyMarketRow
                                key={index}
                                tooltip={`not-supply-${index}`}
                                market={market}
                                marketSpinners={spinners}
                                hasbackstopGauge={[...gaugesV4Data]?.find(g => g?.generalData.lpTokenUnderlying.toLowerCase() === market?.pTokenAddress.toLowerCase()) !== undefined}
                                enterMarketDialog={props.enterMarketDialog}
                                supplyMarketDialog={props.supplyMarketDialog}
                            />
                          )
                      }
                        else return null;
                        }) : null}
                </tbody>
            </table>
        </div>
    );
};

export default SupplyMarket;
