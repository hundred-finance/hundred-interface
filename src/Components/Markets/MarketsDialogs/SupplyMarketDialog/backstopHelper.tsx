import { BigNumber } from '../../../../bigNumber';
import { CTokenInfo, CTokenSpinner } from '../../../../Classes/cTokenClass';
import { GaugeV4 } from '../../../../Classes/gaugeV4Class';

//GOAL: destructuring variables for better JSX readability
type backstopInfo = {
    underlyingSymbol: string;
    backstopSymbol: string;
    underlyingBalance: string;
    isBackstop: boolean;
    isBackstopWithdrawDisabled: boolean;
    isPendingHundred: boolean;
    isDepositDisabled: boolean;
    isApproveDisabled: boolean;
    claimAmount: string;
};

type directBackstopInfo = {
    underlyingSymbol: string;
    isStake: boolean;
    isStakeDisabled: boolean;
    isUnstake: boolean;
    isUnstakeDisabled: boolean;
    isBackstopClaimDisabled: boolean;
};

export const getDirectBackstopMarketTabVariables = (
    gaugeV4: GaugeV4,
    stakeInput: string,
    stakeValidation: string,
    stakeDisabled: boolean,
    unstakeInput: string,
    backstopClaimDisabled: boolean,
    selectedMarket: CTokenInfo | undefined,
): directBackstopInfo => {
    let underlyingSymbol = '';
    let isStake = false;
    let isUnstake = false;
    let isStakeDisabled = false;
    let isUnstakeDisabled = false;
    let isBackstopClaimDisabled = false;

    if (selectedMarket && gaugeV4) {
        const market = { ...selectedMarket };
        underlyingSymbol = market.underlying.symbol;
        //GOAL: boolean to decide rendering stake or approveStake
        //STEP 1: find valid stakeInput
        const isStakeInputValid = stakeInput.trim() === '' || isNaN(+stakeInput) || isNaN(parseFloat(stakeInput));
        const validStakeInput = isStakeInputValid ? 0 : +stakeInput;
        //STEP 2: find if allowance is > 0 and also >= stakeInput
        isStake = +{ ...selectedMarket }.underlying.gaugeHelperAllowance.toString() > 0;
        isStake = isStake && +{ ...selectedMarket }.underlying.gaugeHelperAllowance.toString() >= validStakeInput;

        isStakeDisabled = stakeDisabled || stakeInput === '' || stakeValidation !== '';
        //GOAL: boolean to decide rendering unstake or approveUnstake
        //STEP 1: find valid unstakeInput
        const isUnstakeInputValid =
            unstakeInput.trim() === '' || isNaN(+unstakeInput) || isNaN(parseFloat(unstakeInput));
        const validUnstakeInput = isUnstakeInputValid ? 0 : +unstakeInput;
        //STEP 2: find if allowance is > 0 and also >= unstakeInput
        isUnstake = +gaugeV4.userGaugeHelperAllowance.toString() > 0;
        isUnstake = isUnstake && +gaugeV4.userGaugeHelperAllowance.toString() >= validUnstakeInput;

        isUnstakeDisabled = isUnstakeDisabled;
        isBackstopClaimDisabled =
            backstopClaimDisabled ||
            gaugeV4.userClaimableHnd === undefined ||
            gaugeV4.userClaimableHnd?.eq(BigNumber.from(0));
    }

    return {
        underlyingSymbol: underlyingSymbol,
        isStake: isStake,
        isUnstake: isUnstake,
        isStakeDisabled: isStakeDisabled,
        isUnstakeDisabled: isUnstakeDisabled,
        isBackstopClaimDisabled: isBackstopClaimDisabled,
    };
};

export const getBackstopMarketTabVariables = (
    depositInput: string,
    depositValidation: string,
    backstopWithdrawInput: string,
    backstopWithdrawValidation: string,
    selectedMarket: CTokenInfo | undefined,
    selectedMarketSpinners: CTokenSpinner | undefined,
): backstopInfo => {
    let underlyingSymbol = '';
    let backstopSymbol = '';
    let underlyingBalance = '';
    let isBackstop = false;
    let isBackstopWithdrawDisabled = false;
    let isPendingHundred = false;
    let isDepositDisabled = false;
    let isApproveDisabled = false;
    let claimAmount = '';
    if (selectedMarket) {
        const market = { ...selectedMarket };
        const spinner = { ...selectedMarketSpinners };
        underlyingSymbol = market.underlying.symbol;
        underlyingBalance = market.underlying.walletBalance?.toRound(4, true);

        if (market.backstop) {
            const depositInvalid = depositInput.trim() === '' || isNaN(+depositInput);
            const deposit = depositInvalid ? BigNumber.from('0') : BigNumber.parseValue(depositInput);
            isBackstop = market.backstop.allowance?.gt(BigNumber.from(0)) && market.backstop.allowance?.gte(deposit);
            backstopSymbol = market.backstop.symbol;

            const backstopWithdrawInvalid =
                backstopWithdrawInput === '' || backstopWithdrawValidation !== '' || isNaN(+backstopWithdrawInput);
            isBackstopWithdrawDisabled =
                backstopWithdrawInvalid ||
                spinner.backstopWithdrawSpinner ||
                BigNumber.parseValue(backstopWithdrawInput).gt(market.backstop.userBalance);
            isPendingHundred = +market.backstop.pendingHundred.toString() > 0;
            claimAmount = market.backstop.pendingHundred.toRound(4, true, true);
        }
    } else {
        const spinner = { ...selectedMarketSpinners };
        if (spinner.backstopDepositSpinner) {
            isDepositDisabled = depositInput === '' || depositValidation !== '';
            isApproveDisabled = true;
        }
    }
    return {
        underlyingSymbol: underlyingSymbol,
        backstopSymbol: backstopSymbol,
        underlyingBalance: underlyingBalance,
        isBackstop: isBackstop,
        isBackstopWithdrawDisabled: isBackstopWithdrawDisabled,
        isPendingHundred: isPendingHundred,
        isDepositDisabled: isDepositDisabled,
        isApproveDisabled: isApproveDisabled,
        claimAmount: claimAmount,
    };
};
