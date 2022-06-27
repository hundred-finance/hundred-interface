import React, { useRef, useEffect, useState } from 'react';
import { TabContentItem } from '../../../TabControl/tabControl';
import '../supplyMarketDialog.css';
import { CTokenInfo, SpinnersEnum } from '../../../../Classes/cTokenClass';
import { BigNumber } from '../../../../bigNumber';
import { useHundredDataContext } from '../../../../Types/hundredDataContext';
import { useWeb3React } from '@web3-react/core';
import { useUiContext } from '../../../../Types/uiContext';
import DirectStakeMarketTab from '../directStakeMarketTab';
import StakeMarketTab from '../stakeMarketTab';
import { GaugeV4 } from '../../../../Classes/gaugeV4Class';
import { ethers } from 'ethers';
import { TOKEN_ABI, BACKSTOP_MASTERCHEF_ABI, BACKSTOP_MASTERCHEF_ABI_V2, HUNDRED_ABI } from '../../../../abi';
import { ExecuteWithExtraGasLimit } from '../../../../Classes/TransactionHelper';
import { MasterChefVersion } from '../../../../networks';
import BackstopMarketTab from '../backstopMarketTab';
import DirectBackstopMarketTab from '../directBackstopMarketTab';
import { useGlobalContext } from '../../../../Types/globalContext';
import { Contract, Provider} from 'ethcall';
import { checkUserBalanceIsUpdated } from '../checkUserBalanceHelper';

interface Props {
    tabChange: number;
    open: boolean;
    isStake: boolean;
    getMaxAmount: (market: CTokenInfo, func?: string) => Promise<BigNumber>;
}
const StakeItem: React.FC<Props> = (props: Props) => {
    const MaxUint256 = BigNumber.from(ethers.constants.MaxUint256);
    const { library , account} = useWeb3React();
    const {
        generalData,
        gaugesV4Data,
        selectedMarket,
        selectedMarketSpinners,
        marketsData,
        toggleSpinners,
        setSelectedMarketSpinners,
    } = useHundredDataContext();
    const { network, address } = useGlobalContext();
    const { setSpinnerVisible, toastErrorMessage, toastSuccessMessage} = useUiContext();
    const [stakeDisabled, setStakeDisabled] = useState<boolean>(false);
    const [unstakeDisabled, setUnstakeDisabled] = useState<boolean>(false);
    const [claimDisabled, setClaimDisabled] = useState<boolean>(false);
    const [backstopDepositDisabled, setBackstopDepositDisabled] = useState<boolean>(false);
    const [backstopWithdrawDisabled, setBackstopWithdrawDisabled] = useState<boolean>(false);
    const [backstopClaimDisabled, setBackstopClaimDisabled] = useState<boolean>(false);

    const selectedMarketRef = useRef<CTokenInfo>();

    useEffect(() => {
        selectedMarket ? (selectedMarketRef.current = { ...selectedMarket }) : undefined;
    }, [selectedMarket]);

    const gaugeV4 = gaugesV4Data
        ? [...gaugesV4Data].find((x) => {
              return x?.generalData.lpTokenUnderlying === selectedMarket?.underlying.address;
          })
        : null;
    const backstopGaugeV4 = gaugeV4?.generalData.backstopGauge;
    const isStake = props.isStake && selectedMarket;
    const isBackstop = !isStake && selectedMarket && selectedMarket.backstop;
    const isDirectBackstop = backstopGaugeV4 && generalData && selectedMarket;

    const handleApproveStake = async (symbol: string | undefined, gaugeV4: GaugeV4 | null | undefined) => {
        if (marketsData) {
            const market = [...marketsData].find((x) => x?.underlying.symbol === symbol);
            if (market && library && symbol) {
                try {
                    setSpinnerVisible(true);
                    toggleSpinners(symbol, SpinnersEnum.stake);
                    setStakeDisabled(true);
                    if (selectedMarketSpinners) {
                        const selected = { ...selectedMarketSpinners };
                        selected.stakeSpinner = true;
                        setSelectedMarketSpinners(selected);
                    }
                    await gaugeV4?.approveCall(market);
                    toastSuccessMessage("Transaction complete, updating contracts")
                    const checkReceipt = await checkUserBalanceIsUpdated(gaugeV4, null, 0, "approveStake")
                    console.log('checkReceipt: ', checkReceipt);                    
                    setSpinnerVisible(false);
                } catch (err) {
                    const error = err as any;
                    toastErrorMessage(`${error?.message.replace('.', '')} on Approve Stake\n${error?.data?.message}`);
                    console.log(err);
                } finally {
                    setSpinnerVisible(false);
                    toggleSpinners(symbol, SpinnersEnum.stake);
                    setStakeDisabled(false);
                    if (selectedMarketSpinners) {
                        const selected = { ...selectedMarketSpinners };
                        selected.stakeSpinner = false;
                        setSelectedMarketSpinners(selected);
                    }
                    // await handleUpdate(market, "approveStake", false)
                }
            }
        }
    };

    const handleStake = async (symbol: string | undefined, gaugeV4: GaugeV4 | null | undefined, amount: string) => {
        const market = [...marketsData].find((x) => x?.underlying.symbol === symbol);
        if (market && library && symbol) {
            try {
                setSpinnerVisible(true);
                toggleSpinners(symbol, SpinnersEnum.stake);
                setStakeDisabled(true);
                if (selectedMarketSpinners) {
                    const selected = { ...selectedMarketSpinners };
                    selected.stakeSpinner = true;
                    setSelectedMarketSpinners(selected);
                }
                await gaugeV4?.stakeCall(amount, market);
                toastSuccessMessage("Transaction complete, updating contracts")
                const checkReceipt = await checkUserBalanceIsUpdated(gaugeV4, null, gaugeV4?.userStakedTokenBalance, "stake")
                console.log('checkReceipt: ', checkReceipt);
                setSpinnerVisible(false);
            } catch (err) {
                const error = err as any;
                toastErrorMessage(`${error?.message.replace('.', '')} on Stake\n${error?.data?.message}`);
                console.log(err);
            } finally {
                setSpinnerVisible(false);
                toggleSpinners(symbol, SpinnersEnum.stake);
                setStakeDisabled(false);
                if (selectedMarketSpinners) {
                    const selected = { ...selectedMarketSpinners };
                    selected.stakeSpinner = false;
                    setSelectedMarketSpinners(selected);
                    // await handleUpdate(market, "stake", false)
                }
            }
        }
    };

    const handleApproveUnStake = async (symbol: string | undefined, gaugeV4: GaugeV4 | null | undefined) => {
        if (marketsData) {
            const market = [...marketsData].find((x) => x?.underlying.symbol === symbol);
            if (market && library && symbol) {
                try {
                    setSpinnerVisible(true);
                    toggleSpinners(symbol, SpinnersEnum.unstake);
                    setUnstakeDisabled(true);
                    if (selectedMarketSpinners) {
                        const selected = { ...selectedMarketSpinners };
                        selected.unstakeSpinner = true;
                        setSelectedMarketSpinners(selected);
                    }
                    await gaugeV4?.approveUnstakeCall();
                    toastSuccessMessage("Transaction complete, updating contracts")
                    const checkReceipt = await checkUserBalanceIsUpdated(gaugeV4, null, 0, "approveUnstake")
                    console.log('checkReceipt: ', checkReceipt);                    
                    setSpinnerVisible(false);
                } catch (err) {
                    const error = err as any;
                    toastErrorMessage(`${error?.message.replace('.', '')} on Approve Unstake\n${error?.data?.message}`);
                    console.log(err);
                } finally {
                    setSpinnerVisible(false);
                    toggleSpinners(symbol, SpinnersEnum.unstake);
                    setUnstakeDisabled(false);
                    if (selectedMarketSpinners) {
                        const selected = { ...selectedMarketSpinners };
                        selected.unstakeSpinner = false;
                        setSelectedMarketSpinners(selected);
                    }
                    // await handleUpdate(market, "approveUnstake", false)
                }
            }
        }
    };
    const handleUnstake = async (symbol: string | undefined, gaugeV4: GaugeV4 | null | undefined, amount: string) => {
        const market = [...marketsData].find((x) => x?.underlying.symbol === symbol);
        const nativeTokenMarket = [...marketsData].find((x) => x?.isNativeToken);
        if (market && library && nativeTokenMarket && symbol) {
            try {
                setSpinnerVisible(true);
                toggleSpinners(symbol, SpinnersEnum.unstake);
                setUnstakeDisabled(true);
                if (selectedMarketSpinners) {
                    const selected = { ...selectedMarketSpinners };
                    selected.unstakeSpinner = true;
                    setSelectedMarketSpinners(selected);
                }
                await gaugeV4?.unstakeCall(amount, market, nativeTokenMarket?.pTokenAddress);
                toastSuccessMessage("Transaction complete, updating contracts")
                const checkReceipt = await checkUserBalanceIsUpdated(gaugeV4, null, gaugeV4?.userStakedTokenBalance, "unstake")
                console.log('checkReceipt: ', checkReceipt);                
                setSpinnerVisible(false);
            } catch (err) {
                const error = err as any;
                toastErrorMessage(`${error?.message.replace('.', '')} on Unstake\n${error?.data?.message}`);
                console.log(err);
            } finally {
                setSpinnerVisible(false);
                toggleSpinners(symbol, SpinnersEnum.unstake);
                setUnstakeDisabled(false);
                if (selectedMarketSpinners) {
                    const selected = { ...selectedMarketSpinners };
                    selected.unstakeSpinner = false;
                    setSelectedMarketSpinners(selected);
                    // await handleUpdate(market, "unstake", false)
                }
            }
        }
    };

    const handleMint = async (symbol: string | undefined, gaugeV4: GaugeV4 | null | undefined) => {
        const market = [...marketsData].find((x) => x?.underlying.symbol === symbol);
        if (market && library && symbol) {
            try {
                setSpinnerVisible(true);
                toggleSpinners(symbol, SpinnersEnum.mint);
                setClaimDisabled(true);
                if (selectedMarketSpinners) {
                    const selected = { ...selectedMarketSpinners };
                    selected.mintSpinner = true;
                    setSelectedMarketSpinners(selected);
                }
                //STEP 1: ethcall setup
                const ethcallProvider = new Provider()
                await ethcallProvider.init(library) //library = provider
                //STEP 2: fetch user's hnd balance
                const call = [new Contract(network?.hundredAddress as string, HUNDRED_ABI).balanceOf(account)]
                const currHndBalanceResult = await ethcallProvider.all(call)  
                const currHndBalance : any = currHndBalanceResult[0]
                //STEP 3: execute txn, check contract is updated
                await gaugeV4?.mintCall();
                toastSuccessMessage("Transaction complete, updating contracts")
                const checkReceipt = await checkUserBalanceIsUpdated(gaugeV4, null, currHndBalance, "claimHnd")
                console.log('checkReceipt: ', checkReceipt);                
                setSpinnerVisible(false);
            } catch (err) {
                const error = err as any;
                toastErrorMessage(`${error?.message.replace('.', '')} on Mint\n${error?.data?.message}`);
                console.log(err);
            } finally {
                setSpinnerVisible(false);
                toggleSpinners(symbol, SpinnersEnum.mint);
                setClaimDisabled(false);
                if (selectedMarketSpinners) {
                    const selected = { ...selectedMarketSpinners };
                    selected.mintSpinner = false;
                    setSelectedMarketSpinners(selected);
                    // await handleUpdate(market, "mint", false)
                }
            }
        }
    };

    //---old hundred.finance functions---
    const handleApproveBackstop = async (symbol: string): Promise<void> => {
        if (marketsData) {
            const market = [...marketsData].find((x) => x?.underlying.symbol === symbol);
            if (market && market.backstop && library && network && address) {
                try {
                    setSpinnerVisible(true);
                    toggleSpinners(symbol, SpinnersEnum.backstopDeposit);
                    setBackstopDepositDisabled(true);
                    if (selectedMarketSpinners) {
                        const selected = { ...selectedMarketSpinners };
                        selected.backstopDepositSpinner = true;
                        setSelectedMarketSpinners(selected);
                    }
                    const signer = library.getSigner();
                    if (market.underlying.address && network.backstopMasterChef) {
                        const contract = new ethers.Contract(market.underlying.address, TOKEN_ABI, signer);
                        const receipt = await ExecuteWithExtraGasLimit(
                            contract,
                            'approve',
                            [network.backstopMasterChef.address, MaxUint256._value],
                            () => setSpinnerVisible(false),
                        );
                        console.log(receipt);
                    }
                } catch (err) {
                    const error = err as any;
                    toastErrorMessage(
                        `${error?.message.replace('.', '')} on Approve Backstop\n${error?.data?.message}`,
                    );
                    console.log(err);
                } finally {
                    setSpinnerVisible(false);
                    toggleSpinners(symbol, SpinnersEnum.backstopDeposit);
                    setBackstopDepositDisabled(false);
                    if (selectedMarketSpinners) {
                        const selected = { ...selectedMarketSpinners };
                        selected.backstopDepositSpinner = false;
                        setSelectedMarketSpinners(selected);
                    }
                    //   await handleUpdate(market, "approveBackstop", false);
                }
            }
        }
    };

    const handleBackstopDeposit = async (symbol: string, amount: string): Promise<void> => {
        if (marketsData) {
            const market = [...marketsData].find((x) => x?.underlying.symbol === symbol);
            if (market && market.backstop && library && network && network.backstopMasterChef) {
                try {
                    setSpinnerVisible(true);
                    toggleSpinners(symbol, SpinnersEnum.backstopDeposit);
                    setBackstopDepositDisabled(true);
                    if (selectedMarketSpinners) {
                        const selected = { ...selectedMarketSpinners };
                        selected.backstopDepositSpinner = true;
                        setSelectedMarketSpinners(selected);
                    }
                    const value = BigNumber.parseValueSafe(amount, market.underlying.decimals);
                    const am = value._value;
                    const signer = library.getSigner();
                    const backstopAbi =
                        network.backstopMasterChef.version === MasterChefVersion.v1
                            ? BACKSTOP_MASTERCHEF_ABI
                            : BACKSTOP_MASTERCHEF_ABI_V2;
                    const backstop = new ethers.Contract(network.backstopMasterChef.address, backstopAbi, signer);
                    const receipt = await ExecuteWithExtraGasLimit(
                        backstop,
                        'deposit',
                        [market.backstop.pool.poolId, am, address],
                        () => setSpinnerVisible(false),
                    );
                    console.log(receipt);
                } catch (err) {
                    const error = err as any;
                    toastErrorMessage(
                        `${error?.message.replace('.', '')} on Backstop Deposit\n${error?.data?.message}`,
                    );
                    console.log(err);
                } finally {
                    setSpinnerVisible(false);
                    toggleSpinners(symbol, SpinnersEnum.backstopDeposit);
                    setBackstopDepositDisabled(false);
                    if (selectedMarketSpinners) {
                        const selected = { ...selectedMarketSpinners };
                        selected.backstopDepositSpinner = false;
                        setSelectedMarketSpinners(selected);
                    }
                    //   await handleUpdate(market, "backstopDeposit", false);
                }
            }
        }
    };

    const handleBackstopWithdraw = async (symbol: string, amount: string): Promise<void> => {
        if (marketsData && network) {
            const market = [...marketsData].find((x) => x?.underlying.symbol === symbol);
            if (market && market.backstop && library && network.backstopMasterChef) {
                try {
                    setSpinnerVisible(true);
                    toggleSpinners(symbol, SpinnersEnum.backstopWithdraw);
                    setBackstopWithdrawDisabled(true);
                    if (selectedMarketSpinners) {
                        const selected = { ...selectedMarketSpinners };
                        selected.backstopWithdrawSpinner = true;
                        setSelectedMarketSpinners(selected);
                    }
                    const value = BigNumber.parseValueSafe(amount, market.backstop.decimals);
                    const am = value._value;
                    const signer = library.getSigner();
                    const backstopAbi =
                        network.backstopMasterChef.version === MasterChefVersion.v1
                            ? BACKSTOP_MASTERCHEF_ABI
                            : BACKSTOP_MASTERCHEF_ABI_V2;
                    const backstop = new ethers.Contract(network.backstopMasterChef.address, backstopAbi, signer);
                    const receipt = await ExecuteWithExtraGasLimit(
                        backstop,
                        'withdrawAndHarvest',
                        [market.backstop.pool.poolId, am, address],
                        () => setSpinnerVisible(false),
                    );

                    console.log(receipt);
                } catch (err) {
                    const error = err as any;
                    toastErrorMessage(
                        `${error?.message.replace('.', '')} on Backstop Withdraw\n${error?.data?.message}`,
                    );
                    console.log(err);
                } finally {
                    setSpinnerVisible(false);
                    toggleSpinners(symbol, SpinnersEnum.backstopWithdraw);
                    setBackstopWithdrawDisabled(false);
                    if (selectedMarketSpinners) {
                        const selected = { ...selectedMarketSpinners };
                        selected.backstopWithdrawSpinner = false;
                        setSelectedMarketSpinners(selected);
                    }
                    //   await handleUpdate(market, "backstopWithdraw", false);
                }
            }
        }
    };

    const handleBackstopClaim = async (symbol: string): Promise<void> => {
        if (marketsData && network) {
            const market = [...marketsData].find((x) => x?.underlying.symbol === symbol);
            if (market && market.backstop && library && network.backstopMasterChef) {
                try {
                    setSpinnerVisible(true);
                    toggleSpinners(symbol, SpinnersEnum.backstopClaim);
                    setBackstopClaimDisabled(true);
                    if (selectedMarketSpinners) {
                        const selected = { ...selectedMarketSpinners };
                        selected.backstopClaimSpinner = true;
                        setSelectedMarketSpinners(selected);
                    }
                    const signer = library.getSigner();
                    const backstopAbi =
                        network.backstopMasterChef.version === MasterChefVersion.v1
                            ? BACKSTOP_MASTERCHEF_ABI
                            : BACKSTOP_MASTERCHEF_ABI_V2;
                    const backstop = new ethers.Contract(network.backstopMasterChef.address, backstopAbi, signer);
                    const receipt = await ExecuteWithExtraGasLimit(
                        backstop,
                        'harvest',
                        [market.backstop.pool.poolId, address],
                        () => setSpinnerVisible(false),
                    );
                    setSpinnerVisible(false);
                    console.log(receipt);
                } catch (err) {
                    const error = err as any;
                    toastErrorMessage(
                        `${error?.message.replace('.', '')} on Backstop Claim HND\n${error?.data?.message}`,
                    );
                    console.log(err);
                } finally {
                    setSpinnerVisible(false);
                    toggleSpinners(symbol, SpinnersEnum.backstopClaim);
                    setBackstopClaimDisabled(false);
                    if (selectedMarketSpinners) {
                        const selected = { ...selectedMarketSpinners };
                        selected.backstopClaimSpinner = false;
                        setSelectedMarketSpinners(selected);
                    }
                    //   await handleUpdate(market, "backstopClaim", false);
                }
            }
        }
    };

    return (
        <>
            {isStake ? (
                <TabContentItem open={props.open} tabId={2} tabChange={props.tabChange}>
                    {gaugeV4 && gaugeV4.generalData.gaugeHelper ? (
                        <DirectStakeMarketTab
                            open={props.open}
                            stakeDisabled={stakeDisabled}
                            unstakeDisabled={unstakeDisabled}
                            claimDisabled={claimDisabled}
                            handleStake={handleStake}
                            handleUnstake={handleUnstake}
                            handleMint={handleMint}
                            handleApproveStake={handleApproveStake}
                            handleApproveUnStake={handleApproveUnStake}
                        />
                    ) : (
                        <StakeMarketTab
                            open={props.open}
                            stakeDisabled={stakeDisabled}
                            unstakeDisabled={unstakeDisabled}
                            claimDisabled={claimDisabled}
                            handleStake={handleStake}
                            handleUnstake={handleUnstake}
                            handleMint={handleMint}
                            handleApproveStake={handleApproveStake}
                        />
                    )}
                </TabContentItem>
            ) : (
                ''
            )}
            {isBackstop ? (
                <TabContentItem open={props.open} tabId={gaugeV4 ? 3 : 2} tabChange={props.tabChange}>
                    <BackstopMarketTab
                        getMaxAmount={props.getMaxAmount}
                        backstopDepositDisabled={backstopDepositDisabled}
                        backstopWithdrawDisabled={backstopWithdrawDisabled}
                        backstopClaimDisabled={backstopClaimDisabled}
                        open={props.open}
                        handleApproveBackstop={handleApproveBackstop}
                        handleBackstopDeposit={handleBackstopDeposit}
                        handleBackstopWithdraw={handleBackstopWithdraw}
                        handleBackstopClaim={handleBackstopClaim}
                    />
                </TabContentItem>
            ) : (
                ''
            )}
            {isDirectBackstop ? (
                <TabContentItem open={props.open} tabId={backstopGaugeV4 ? 3 : 2} tabChange={props.tabChange}>
                    <DirectBackstopMarketTab
                        open={props.open}
                        stakeDisabled={stakeDisabled}
                        unstakeDisabled={unstakeDisabled}
                        backstopClaimDisabled={backstopClaimDisabled}
                        handleStake={handleStake}
                        handleUnstake={handleUnstake}
                        handleMint={handleMint}
                        handleApproveStake={handleApproveStake}
                        handleApproveUnStake={handleApproveUnStake}
                    />
                </TabContentItem>
            ) : (
                ''
            )}
        </>
    );
};

export default StakeItem;
