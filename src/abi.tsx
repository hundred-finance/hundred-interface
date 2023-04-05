const MAXIMILLION_ABI = [
    {
        inputs: [{ internalType: 'contract CEther', name: 'cEther_', type: 'address' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
    {
        constant: true,
        inputs: [],
        name: 'cEther',
        outputs: [{ internalType: 'contract CEther', name: '', type: 'address' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [{ internalType: 'address', name: 'borrower', type: 'address' }],
        name: 'repayBehalf',
        outputs: [],
        payable: true,
        stateMutability: 'payable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            { internalType: 'address', name: 'borrower', type: 'address' },
            { internalType: 'contract CEther', name: 'cEther_', type: 'address' },
        ],
        name: 'repayBehalfExplicit',
        outputs: [],
        payable: true,
        stateMutability: 'payable',
        type: 'function',
    },
];

const COMPTROLLER_ABI = [
    {
        constant: true,
        inputs: [],
        name: 'oracle',
        outputs: [{ internalType: 'contract PriceOracle', name: '', type: 'address' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'getAllMarkets',
        outputs: [{ internalType: 'contract CToken[]', name: '', type: 'address[]' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
        name: 'getAssetsIn',
        outputs: [{ internalType: 'contract CToken[]', name: '', type: 'address[]' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [{ internalType: 'address', name: '', type: 'address' }],
        name: 'markets',
        outputs: [
            { internalType: 'bool', name: 'isListed', type: 'bool' },
            { internalType: 'uint256', name: 'collateralFactorMantissa', type: 'uint256' }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [{ internalType: 'address', name: '', type: 'address' }],
        name: 'compSpeeds',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [{ internalType: 'address[]', name: 'cTokens', type: 'address[]' }],
        name: 'enterMarkets',
        outputs: [{ internalType: 'uint256[]', name: '', type: 'uint256[]' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [{ internalType: 'address', name: 'cTokenAddress', type: 'address' }],
        name: 'exitMarket',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [{ internalType: 'address', name: '', type: 'address' }],
        name: 'compAccrued',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [
            { internalType: 'address', name: 'account', type: 'address' },
            { internalType: 'contract CToken', name: 'cToken', type: 'address' },
        ],
        name: 'checkMembership',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [{ internalType: 'address', name: 'holder', type: 'address' }],
        name: 'claimComp',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [{ internalType: 'address', name: '', type: 'address' }],
        name: 'compSupplyState',
        outputs: [
            { internalType: 'uint224', name: 'index', type: 'uint224' },
            { internalType: 'uint32', name: 'block', type: 'uint32' },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [
            { internalType: 'address', name: '', type: 'address' },
            { internalType: 'address', name: '', type: 'address' },
        ],
        name: 'compSupplierIndex',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [{ internalType: 'address', name: '', type: 'address' }],
        name: 'mintGuardianPaused',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [{ internalType: 'address', name: '', type: 'address' }],
        name: 'borrowGuardianPaused',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
];

const TOKEN_ABI = [
    {
        constant: true,
        inputs: [],
        name: 'name',
        outputs: [{ name: '', type: 'string' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            { name: '_spender', type: 'address' },
            { name: '_value', type: 'uint256' },
        ],
        name: 'approve',
        outputs: [{ name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'totalSupply',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            { name: '_from', type: 'address' },
            { name: '_to', type: 'address' },
            { name: '_value', type: 'uint256' },
        ],
        name: 'transferFrom',
        outputs: [{ name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'decimals',
        outputs: [{ name: '', type: 'uint8' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            { name: '_to', type: 'address' },
            { name: '_value', type: 'uint256' },
            { name: '_data', type: 'bytes' },
        ],
        name: 'transferAndCall',
        outputs: [{ name: 'success', type: 'bool' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            { name: '_spender', type: 'address' },
            { name: '_subtractedValue', type: 'uint256' },
        ],
        name: 'decreaseApproval',
        outputs: [{ name: 'success', type: 'bool' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [{ name: '_owner', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: 'balance', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'symbol',
        outputs: [{ name: '', type: 'string' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            { name: '_to', type: 'address' },
            { name: '_value', type: 'uint256' },
        ],
        name: 'transfer',
        outputs: [{ name: 'success', type: 'bool' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            { name: '_spender', type: 'address' },
            { name: '_addedValue', type: 'uint256' },
        ],
        name: 'increaseApproval',
        outputs: [{ name: 'success', type: 'bool' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [
            { name: '_owner', type: 'address' },
            { name: '_spender', type: 'address' },
        ],
        name: 'allowance',
        outputs: [{ name: 'remaining', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    { inputs: [], payable: false, stateMutability: 'nonpayable', type: 'constructor' },
    {
        anonymous: false,
        inputs: [
            { indexed: true, name: 'from', type: 'address' },
            { indexed: true, name: 'to', type: 'address' },
            { indexed: false, name: 'value', type: 'uint256' },
            { indexed: false, name: 'data', type: 'bytes' },
        ],
        name: 'Transfer',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, name: 'owner', type: 'address' },
            { indexed: true, name: 'spender', type: 'address' },
            { indexed: false, name: 'value', type: 'uint256' },
        ],
        name: 'Approval',
        type: 'event',
    },
];

const CETHER_ABI = [
    {
        inputs: [
            { internalType: 'contract ComptrollerInterface', name: 'comptroller_', type: 'address' },
            { internalType: 'contract InterestRateModel', name: 'interestRateModel_', type: 'address' },
            { internalType: 'uint256', name: 'initialExchangeRateMantissa_', type: 'uint256' },
            { internalType: 'string', name: 'name_', type: 'string' },
            { internalType: 'string', name: 'symbol_', type: 'string' },
            { internalType: 'uint8', name: 'decimals_', type: 'uint8' },
            { internalType: 'address payable', name: 'admin_', type: 'address' },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, internalType: 'uint256', name: 'cashPrior', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'interestAccumulated', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'borrowIndex', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'totalBorrows', type: 'uint256' },
        ],
        name: 'AccrueInterest',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
            { indexed: true, internalType: 'address', name: 'spender', type: 'address' },
            { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
        ],
        name: 'Approval',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, internalType: 'address', name: 'borrower', type: 'address' },
            { indexed: false, internalType: 'uint256', name: 'borrowAmount', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'accountBorrows', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'totalBorrows', type: 'uint256' },
        ],
        name: 'Borrow',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, internalType: 'uint256', name: 'error', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'info', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'detail', type: 'uint256' },
        ],
        name: 'Failure',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, internalType: 'address', name: 'liquidator', type: 'address' },
            { indexed: false, internalType: 'address', name: 'borrower', type: 'address' },
            { indexed: false, internalType: 'uint256', name: 'repayAmount', type: 'uint256' },
            { indexed: false, internalType: 'address', name: 'cTokenCollateral', type: 'address' },
            { indexed: false, internalType: 'uint256', name: 'seizeTokens', type: 'uint256' },
        ],
        name: 'LiquidateBorrow',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, internalType: 'address', name: 'minter', type: 'address' },
            { indexed: false, internalType: 'uint256', name: 'mintAmount', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'mintTokens', type: 'uint256' },
        ],
        name: 'Mint',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, internalType: 'address', name: 'oldAdmin', type: 'address' },
            { indexed: false, internalType: 'address', name: 'newAdmin', type: 'address' },
        ],
        name: 'NewAdmin',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, internalType: 'contract ComptrollerInterface', name: 'oldComptroller', type: 'address' },
            { indexed: false, internalType: 'contract ComptrollerInterface', name: 'newComptroller', type: 'address' },
        ],
        name: 'NewComptroller',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'contract InterestRateModel',
                name: 'oldInterestRateModel',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'contract InterestRateModel',
                name: 'newInterestRateModel',
                type: 'address',
            },
        ],
        name: 'NewMarketInterestRateModel',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, internalType: 'address', name: 'oldPendingAdmin', type: 'address' },
            { indexed: false, internalType: 'address', name: 'newPendingAdmin', type: 'address' },
        ],
        name: 'NewPendingAdmin',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, internalType: 'uint256', name: 'oldReserveFactorMantissa', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'newReserveFactorMantissa', type: 'uint256' },
        ],
        name: 'NewReserveFactor',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, internalType: 'address', name: 'redeemer', type: 'address' },
            { indexed: false, internalType: 'uint256', name: 'redeemAmount', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'redeemTokens', type: 'uint256' },
        ],
        name: 'Redeem',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, internalType: 'address', name: 'payer', type: 'address' },
            { indexed: false, internalType: 'address', name: 'borrower', type: 'address' },
            { indexed: false, internalType: 'uint256', name: 'repayAmount', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'accountBorrows', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'totalBorrows', type: 'uint256' },
        ],
        name: 'RepayBorrow',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, internalType: 'address', name: 'benefactor', type: 'address' },
            { indexed: false, internalType: 'uint256', name: 'addAmount', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'newTotalReserves', type: 'uint256' },
        ],
        name: 'ReservesAdded',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, internalType: 'address', name: 'admin', type: 'address' },
            { indexed: false, internalType: 'uint256', name: 'reduceAmount', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'newTotalReserves', type: 'uint256' },
        ],
        name: 'ReservesReduced',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'from', type: 'address' },
            { indexed: true, internalType: 'address', name: 'to', type: 'address' },
            { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
        ],
        name: 'Transfer',
        type: 'event',
    },
    { payable: true, stateMutability: 'payable', type: 'fallback' },
    {
        constant: false,
        inputs: [],
        name: '_acceptAdmin',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [{ internalType: 'uint256', name: 'reduceAmount', type: 'uint256' }],
        name: '_reduceReserves',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [{ internalType: 'contract ComptrollerInterface', name: 'newComptroller', type: 'address' }],
        name: '_setComptroller',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [{ internalType: 'contract InterestRateModel', name: 'newInterestRateModel', type: 'address' }],
        name: '_setInterestRateModel',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [{ internalType: 'address payable', name: 'newPendingAdmin', type: 'address' }],
        name: '_setPendingAdmin',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [{ internalType: 'uint256', name: 'newReserveFactorMantissa', type: 'uint256' }],
        name: '_setReserveFactor',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            { internalType: 'address', name: 'original', type: 'address' },
            { internalType: 'address[]', name: 'accounts', type: 'address[]' },
        ],
        name: '_specialInitState',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'accrualBlockNumber',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [],
        name: 'accrueInterest',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'admin',
        outputs: [{ internalType: 'address payable', name: '', type: 'address' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [
            { internalType: 'address', name: 'owner', type: 'address' },
            { internalType: 'address', name: 'spender', type: 'address' },
        ],
        name: 'allowance',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            { internalType: 'address', name: 'spender', type: 'address' },
            { internalType: 'uint256', name: 'amount', type: 'uint256' },
        ],
        name: 'approve',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
        name: 'balanceOfUnderlying',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [{ internalType: 'uint256', name: 'borrowAmount', type: 'uint256' }],
        name: 'borrow',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
        name: 'borrowBalanceCurrent',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
        name: 'borrowBalanceStored',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'borrowIndex',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'borrowRatePerBlock',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'comptroller',
        outputs: [{ internalType: 'contract ComptrollerInterface', name: '', type: 'address' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'decimals',
        outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [],
        name: 'exchangeRateCurrent',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'exchangeRateStored',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
        name: 'getAccountSnapshot',
        outputs: [
            { internalType: 'uint256', name: '', type: 'uint256' },
            { internalType: 'uint256', name: '', type: 'uint256' },
            { internalType: 'uint256', name: '', type: 'uint256' },
            { internalType: 'uint256', name: '', type: 'uint256' },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'getCash',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            { internalType: 'contract ComptrollerInterface', name: 'comptroller_', type: 'address' },
            { internalType: 'contract InterestRateModel', name: 'interestRateModel_', type: 'address' },
            { internalType: 'uint256', name: 'initialExchangeRateMantissa_', type: 'uint256' },
            { internalType: 'string', name: 'name_', type: 'string' },
            { internalType: 'string', name: 'symbol_', type: 'string' },
            { internalType: 'uint8', name: 'decimals_', type: 'uint8' },
        ],
        name: 'initialize',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'interestRateModel',
        outputs: [{ internalType: 'contract InterestRateModel', name: '', type: 'address' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'isCToken',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            { internalType: 'address', name: 'borrower', type: 'address' },
            { internalType: 'contract CToken', name: 'cTokenCollateral', type: 'address' },
        ],
        name: 'liquidateBorrow',
        outputs: [],
        payable: true,
        stateMutability: 'payable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [],
        name: 'mint',
        outputs: [],
        payable: true,
        stateMutability: 'payable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'name',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'pendingAdmin',
        outputs: [{ internalType: 'address payable', name: '', type: 'address' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [{ internalType: 'uint256', name: 'redeemTokens', type: 'uint256' }],
        name: 'redeem',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [{ internalType: 'uint256', name: 'redeemAmount', type: 'uint256' }],
        name: 'redeemUnderlying',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [],
        name: 'repayBorrow',
        outputs: [],
        payable: true,
        stateMutability: 'payable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [{ internalType: 'address', name: 'borrower', type: 'address' }],
        name: 'repayBorrowBehalf',
        outputs: [],
        payable: true,
        stateMutability: 'payable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'reserveFactorMantissa',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            { internalType: 'address', name: 'liquidator', type: 'address' },
            { internalType: 'address', name: 'borrower', type: 'address' },
            { internalType: 'uint256', name: 'seizeTokens', type: 'uint256' },
        ],
        name: 'seize',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'supplyRatePerBlock',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'symbol',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'totalBorrows',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [],
        name: 'totalBorrowsCurrent',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'totalReserves',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'totalSupply',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            { internalType: 'address', name: 'dst', type: 'address' },
            { internalType: 'uint256', name: 'amount', type: 'uint256' },
        ],
        name: 'transfer',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            { internalType: 'address', name: 'src', type: 'address' },
            { internalType: 'address', name: 'dst', type: 'address' },
            { internalType: 'uint256', name: 'amount', type: 'uint256' },
        ],
        name: 'transferFrom',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
];

const CTOKEN_ABI = [
    {
        inputs: [
            { internalType: 'address', name: 'underlying_', type: 'address' },
            { internalType: 'contract ComptrollerInterface', name: 'comptroller_', type: 'address' },
            { internalType: 'contract InterestRateModel', name: 'interestRateModel_', type: 'address' },
            { internalType: 'uint256', name: 'initialExchangeRateMantissa_', type: 'uint256' },
            { internalType: 'string', name: 'name_', type: 'string' },
            { internalType: 'string', name: 'symbol_', type: 'string' },
            { internalType: 'uint8', name: 'decimals_', type: 'uint8' },
            { internalType: 'address payable', name: 'admin_', type: 'address' },
            { internalType: 'address', name: 'implementation_', type: 'address' },
            { internalType: 'bytes', name: 'becomeImplementationData', type: 'bytes' },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, internalType: 'uint256', name: 'cashPrior', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'interestAccumulated', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'borrowIndex', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'totalBorrows', type: 'uint256' },
        ],
        name: 'AccrueInterest',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
            { indexed: true, internalType: 'address', name: 'spender', type: 'address' },
            { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
        ],
        name: 'Approval',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, internalType: 'address', name: 'borrower', type: 'address' },
            { indexed: false, internalType: 'uint256', name: 'borrowAmount', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'accountBorrows', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'totalBorrows', type: 'uint256' },
        ],
        name: 'Borrow',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, internalType: 'uint256', name: 'error', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'info', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'detail', type: 'uint256' },
        ],
        name: 'Failure',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, internalType: 'address', name: 'liquidator', type: 'address' },
            { indexed: false, internalType: 'address', name: 'borrower', type: 'address' },
            { indexed: false, internalType: 'uint256', name: 'repayAmount', type: 'uint256' },
            { indexed: false, internalType: 'address', name: 'cTokenCollateral', type: 'address' },
            { indexed: false, internalType: 'uint256', name: 'seizeTokens', type: 'uint256' },
        ],
        name: 'LiquidateBorrow',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, internalType: 'address', name: 'minter', type: 'address' },
            { indexed: false, internalType: 'uint256', name: 'mintAmount', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'mintTokens', type: 'uint256' },
        ],
        name: 'Mint',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, internalType: 'address', name: 'oldAdmin', type: 'address' },
            { indexed: false, internalType: 'address', name: 'newAdmin', type: 'address' },
        ],
        name: 'NewAdmin',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, internalType: 'contract ComptrollerInterface', name: 'oldComptroller', type: 'address' },
            { indexed: false, internalType: 'contract ComptrollerInterface', name: 'newComptroller', type: 'address' },
        ],
        name: 'NewComptroller',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, internalType: 'address', name: 'oldImplementation', type: 'address' },
            { indexed: false, internalType: 'address', name: 'newImplementation', type: 'address' },
        ],
        name: 'NewImplementation',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'contract InterestRateModel',
                name: 'oldInterestRateModel',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'contract InterestRateModel',
                name: 'newInterestRateModel',
                type: 'address',
            },
        ],
        name: 'NewMarketInterestRateModel',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, internalType: 'address', name: 'oldPendingAdmin', type: 'address' },
            { indexed: false, internalType: 'address', name: 'newPendingAdmin', type: 'address' },
        ],
        name: 'NewPendingAdmin',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, internalType: 'uint256', name: 'oldReserveFactorMantissa', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'newReserveFactorMantissa', type: 'uint256' },
        ],
        name: 'NewReserveFactor',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, internalType: 'address', name: 'redeemer', type: 'address' },
            { indexed: false, internalType: 'uint256', name: 'redeemAmount', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'redeemTokens', type: 'uint256' },
        ],
        name: 'Redeem',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, internalType: 'address', name: 'payer', type: 'address' },
            { indexed: false, internalType: 'address', name: 'borrower', type: 'address' },
            { indexed: false, internalType: 'uint256', name: 'repayAmount', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'accountBorrows', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'totalBorrows', type: 'uint256' },
        ],
        name: 'RepayBorrow',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, internalType: 'address', name: 'benefactor', type: 'address' },
            { indexed: false, internalType: 'uint256', name: 'addAmount', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'newTotalReserves', type: 'uint256' },
        ],
        name: 'ReservesAdded',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, internalType: 'address', name: 'admin', type: 'address' },
            { indexed: false, internalType: 'uint256', name: 'reduceAmount', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'newTotalReserves', type: 'uint256' },
        ],
        name: 'ReservesReduced',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'from', type: 'address' },
            { indexed: true, internalType: 'address', name: 'to', type: 'address' },
            { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
        ],
        name: 'Transfer',
        type: 'event',
    },
    { payable: true, stateMutability: 'payable', type: 'fallback' },
    {
        constant: false,
        inputs: [],
        name: '_acceptAdmin',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [{ internalType: 'uint256', name: 'addAmount', type: 'uint256' }],
        name: '_addReserves',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [{ internalType: 'uint256', name: 'reduceAmount', type: 'uint256' }],
        name: '_reduceReserves',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [{ internalType: 'contract ComptrollerInterface', name: 'newComptroller', type: 'address' }],
        name: '_setComptroller',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            { internalType: 'address', name: 'implementation_', type: 'address' },
            { internalType: 'bool', name: 'allowResign', type: 'bool' },
            { internalType: 'bytes', name: 'becomeImplementationData', type: 'bytes' },
        ],
        name: '_setImplementation',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [{ internalType: 'contract InterestRateModel', name: 'newInterestRateModel', type: 'address' }],
        name: '_setInterestRateModel',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [{ internalType: 'address payable', name: 'newPendingAdmin', type: 'address' }],
        name: '_setPendingAdmin',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [{ internalType: 'uint256', name: 'newReserveFactorMantissa', type: 'uint256' }],
        name: '_setReserveFactor',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'accrualBlockNumber',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [],
        name: 'accrueInterest',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'admin',
        outputs: [{ internalType: 'address payable', name: '', type: 'address' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [
            { internalType: 'address', name: 'owner', type: 'address' },
            { internalType: 'address', name: 'spender', type: 'address' },
        ],
        name: 'allowance',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            { internalType: 'address', name: 'spender', type: 'address' },
            { internalType: 'uint256', name: 'amount', type: 'uint256' },
        ],
        name: 'approve',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
        name: 'balanceOfUnderlying',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [{ internalType: 'uint256', name: 'borrowAmount', type: 'uint256' }],
        name: 'borrow',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
        name: 'borrowBalanceCurrent',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
        name: 'borrowBalanceStored',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'borrowIndex',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'borrowRatePerBlock',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'comptroller',
        outputs: [{ internalType: 'contract ComptrollerInterface', name: '', type: 'address' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'decimals',
        outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [{ internalType: 'bytes', name: 'data', type: 'bytes' }],
        name: 'delegateToImplementation',
        outputs: [{ internalType: 'bytes', name: '', type: 'bytes' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [{ internalType: 'bytes', name: 'data', type: 'bytes' }],
        name: 'delegateToViewImplementation',
        outputs: [{ internalType: 'bytes', name: '', type: 'bytes' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [],
        name: 'exchangeRateCurrent',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'exchangeRateStored',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
        name: 'getAccountSnapshot',
        outputs: [
            { internalType: 'uint256', name: '', type: 'uint256' },
            { internalType: 'uint256', name: '', type: 'uint256' },
            { internalType: 'uint256', name: '', type: 'uint256' },
            { internalType: 'uint256', name: '', type: 'uint256' },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'getCash',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'implementation',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'interestRateModel',
        outputs: [{ internalType: 'contract InterestRateModel', name: '', type: 'address' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'isCToken',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            { internalType: 'address', name: 'borrower', type: 'address' },
            { internalType: 'uint256', name: 'repayAmount', type: 'uint256' },
            { internalType: 'contract CTokenInterface', name: 'cTokenCollateral', type: 'address' },
        ],
        name: 'liquidateBorrow',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [{ internalType: 'uint256', name: 'mintAmount', type: 'uint256' }],
        name: 'mint',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'name',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'pendingAdmin',
        outputs: [{ internalType: 'address payable', name: '', type: 'address' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [{ internalType: 'uint256', name: 'redeemTokens', type: 'uint256' }],
        name: 'redeem',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [{ internalType: 'uint256', name: 'redeemAmount', type: 'uint256' }],
        name: 'redeemUnderlying',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [{ internalType: 'uint256', name: 'repayAmount', type: 'uint256' }],
        name: 'repayBorrow',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            { internalType: 'address', name: 'borrower', type: 'address' },
            { internalType: 'uint256', name: 'repayAmount', type: 'uint256' },
        ],
        name: 'repayBorrowBehalf',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'reserveFactorMantissa',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            { internalType: 'address', name: 'liquidator', type: 'address' },
            { internalType: 'address', name: 'borrower', type: 'address' },
            { internalType: 'uint256', name: 'seizeTokens', type: 'uint256' },
        ],
        name: 'seize',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'supplyRatePerBlock',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'symbol',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'totalBorrows',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [],
        name: 'totalBorrowsCurrent',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'totalReserves',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'totalSupply',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            { internalType: 'address', name: 'dst', type: 'address' },
            { internalType: 'uint256', name: 'amount', type: 'uint256' },
        ],
        name: 'transfer',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            { internalType: 'address', name: 'src', type: 'address' },
            { internalType: 'address', name: 'dst', type: 'address' },
            { internalType: 'uint256', name: 'amount', type: 'uint256' },
        ],
        name: 'transferFrom',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'underlying',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
];

const CTOKEN_V2_ABI = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "cashPrior",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "interestAccumulated",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "borrowIndex",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "totalBorrows",
                "type": "uint256"
            }
        ],
        "name": "AccrueInterest",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "borrower",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "borrowAmount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "accountBorrows",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "totalBorrows",
                "type": "uint256"
            }
        ],
        "name": "Borrow",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "error",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "info",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "detail",
                "type": "uint256"
            }
        ],
        "name": "Failure",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "liquidator",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "borrower",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "repayAmount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "cTokenCollateral",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "seizeTokens",
                "type": "uint256"
            }
        ],
        "name": "LiquidateBorrow",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "minter",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "mintAmount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "mintTokens",
                "type": "uint256"
            }
        ],
        "name": "Mint",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "oldAdmin",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "newAdmin",
                "type": "address"
            }
        ],
        "name": "NewAdmin",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "contract ComptrollerInterface",
                "name": "oldComptroller",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "contract ComptrollerInterface",
                "name": "newComptroller",
                "type": "address"
            }
        ],
        "name": "NewComptroller",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "contract InterestRateModel",
                "name": "oldInterestRateModel",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "contract InterestRateModel",
                "name": "newInterestRateModel",
                "type": "address"
            }
        ],
        "name": "NewMarketInterestRateModel",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "oldPendingAdmin",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "newPendingAdmin",
                "type": "address"
            }
        ],
        "name": "NewPendingAdmin",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "oldReserveFactorMantissa",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "newReserveFactorMantissa",
                "type": "uint256"
            }
        ],
        "name": "NewReserveFactor",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "redeemer",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "redeemAmount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "redeemTokens",
                "type": "uint256"
            }
        ],
        "name": "Redeem",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "payer",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "borrower",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "repayAmount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "accountBorrows",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "totalBorrows",
                "type": "uint256"
            }
        ],
        "name": "RepayBorrow",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "benefactor",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "addAmount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "newTotalReserves",
                "type": "uint256"
            }
        ],
        "name": "ReservesAdded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "admin",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "reduceAmount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "newTotalReserves",
                "type": "uint256"
            }
        ],
        "name": "ReservesReduced",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "_acceptAdmin",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "uint256",
                "name": "reduceAmount",
                "type": "uint256"
            }
        ],
        "name": "_reduceReserves",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "contract ComptrollerInterface",
                "name": "newComptroller",
                "type": "address"
            }
        ],
        "name": "_setComptroller",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "contract InterestRateModel",
                "name": "newInterestRateModel",
                "type": "address"
            }
        ],
        "name": "_setInterestRateModel",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "address payable",
                "name": "newPendingAdmin",
                "type": "address"
            }
        ],
        "name": "_setPendingAdmin",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "uint256",
                "name": "newReserveFactorMantissa",
                "type": "uint256"
            }
        ],
        "name": "_setReserveFactor",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "accrualBlockNumber",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "accrualBlockTimestamp",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "accrueInterest",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "admin",
        "outputs": [
            {
                "internalType": "address payable",
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "balanceOfUnderlying",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "borrowBalanceCurrent",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "borrowBalanceStored",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "borrowIndex",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "borrowRatePerSecond",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "comptroller",
        "outputs": [
            {
                "internalType": "contract ComptrollerInterface",
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "exchangeRateCurrent",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "exchangeRateStored",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "getAccountSnapshot",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "getCash",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "contract ComptrollerInterface",
                "name": "comptroller_",
                "type": "address"
            },
            {
                "internalType": "contract InterestRateModel",
                "name": "interestRateModel_",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "initialExchangeRateMantissa_",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "name_",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "symbol_",
                "type": "string"
            },
            {
                "internalType": "uint8",
                "name": "decimals_",
                "type": "uint8"
            }
        ],
        "name": "initialize",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "interestRateModel",
        "outputs": [
            {
                "internalType": "contract InterestRateModel",
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "isCToken",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "pendingAdmin",
        "outputs": [
            {
                "internalType": "address payable",
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "reserveFactorMantissa",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "address",
                "name": "liquidator",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "borrower",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "seizeTokens",
                "type": "uint256"
            }
        ],
        "name": "seize",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "supplyRatePerSecond",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "totalBorrows",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "totalBorrowsCurrent",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "totalReserves",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "address",
                "name": "dst",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "address",
                "name": "src",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "dst",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

const ORACLE_ABI = [
    {
        inputs: [{ internalType: 'address', name: 'ethUsdChainlinkAggregatorAddress_', type: 'address' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
            { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' },
        ],
        name: 'OwnershipTransferred',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, internalType: 'address', name: 'cTokenAddress', type: 'address' },
            { indexed: false, internalType: 'address', name: 'chainlinkAggregatorAddress', type: 'address' },
            { indexed: false, internalType: 'uint256', name: 'chainlinkPriceBase', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'underlyingTokenDecimals', type: 'uint256' },
        ],
        name: 'TokenConfigUpdated',
        type: 'event',
    },
    {
        constant: true,
        inputs: [],
        name: 'ethUsdChainlinkAggregatorAddress',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [{ internalType: 'contract CTokenInterface', name: 'cToken', type: 'address' }],
        name: 'getUnderlyingPrice',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'isPriceOracle',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'owner',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [],
        name: 'renounceOwnership',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [{ internalType: 'address', name: 'addr', type: 'address' }],
        name: 'setEthUsdChainlinkAggregatorAddress',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            { internalType: 'address[]', name: 'cTokenAddress', type: 'address[]' },
            { internalType: 'address[]', name: 'chainlinkAggregatorAddress', type: 'address[]' },
            { internalType: 'uint256[]', name: 'chainlinkPriceBase', type: 'uint256[]' },
            { internalType: 'uint256[]', name: 'underlyingTokenDecimals', type: 'uint256[]' },
        ],
        name: 'setTokenConfigs',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [{ internalType: 'address', name: '', type: 'address' }],
        name: 'tokenConfig',
        outputs: [
            { internalType: 'address', name: 'chainlinkAggregatorAddress', type: 'address' },
            { internalType: 'uint256', name: 'chainlinkPriceBase', type: 'uint256' },
            { internalType: 'uint256', name: 'underlyingTokenDecimals', type: 'uint256' },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
        name: 'transferOwnership',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
];

const MKR_TOKEN_ABI = [
    {
        constant: true,
        inputs: [],
        name: 'name',
        outputs: [{ name: '', type: 'bytes32' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [],
        name: 'stop',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            { name: 'guy', type: 'address' },
            { name: 'wad', type: 'uint256' },
        ],
        name: 'approve',
        outputs: [{ name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [{ name: 'owner_', type: 'address' }],
        name: 'setOwner',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'totalSupply',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            { name: 'src', type: 'address' },
            { name: 'dst', type: 'address' },
            { name: 'wad', type: 'uint256' },
        ],
        name: 'transferFrom',
        outputs: [{ name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'decimals',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            { name: 'guy', type: 'address' },
            { name: 'wad', type: 'uint256' },
        ],
        name: 'mint',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [{ name: 'wad', type: 'uint256' }],
        name: 'burn',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [{ name: 'name_', type: 'bytes32' }],
        name: 'setName',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [{ name: 'src', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'stopped',
        outputs: [{ name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [{ name: 'authority_', type: 'address' }],
        name: 'setAuthority',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'owner',
        outputs: [{ name: '', type: 'address' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'symbol',
        outputs: [{ name: '', type: 'bytes32' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            { name: 'guy', type: 'address' },
            { name: 'wad', type: 'uint256' },
        ],
        name: 'burn',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [{ name: 'wad', type: 'uint256' }],
        name: 'mint',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            { name: 'dst', type: 'address' },
            { name: 'wad', type: 'uint256' },
        ],
        name: 'transfer',
        outputs: [{ name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            { name: 'dst', type: 'address' },
            { name: 'wad', type: 'uint256' },
        ],
        name: 'push',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            { name: 'src', type: 'address' },
            { name: 'dst', type: 'address' },
            { name: 'wad', type: 'uint256' },
        ],
        name: 'move',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [],
        name: 'start',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'authority',
        outputs: [{ name: '', type: 'address' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [{ name: 'guy', type: 'address' }],
        name: 'approve',
        outputs: [{ name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [
            { name: 'src', type: 'address' },
            { name: 'guy', type: 'address' },
        ],
        name: 'allowance',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            { name: 'src', type: 'address' },
            { name: 'wad', type: 'uint256' },
        ],
        name: 'pull',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [{ name: 'symbol_', type: 'bytes32' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, name: 'guy', type: 'address' },
            { indexed: false, name: 'wad', type: 'uint256' },
        ],
        name: 'Mint',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, name: 'guy', type: 'address' },
            { indexed: false, name: 'wad', type: 'uint256' },
        ],
        name: 'Burn',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [{ indexed: true, name: 'authority', type: 'address' }],
        name: 'LogSetAuthority',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [{ indexed: true, name: 'owner', type: 'address' }],
        name: 'LogSetOwner',
        type: 'event',
    },
    {
        anonymous: true,
        inputs: [
            { indexed: true, name: 'sig', type: 'bytes4' },
            { indexed: true, name: 'guy', type: 'address' },
            { indexed: true, name: 'foo', type: 'bytes32' },
            { indexed: true, name: 'bar', type: 'bytes32' },
            { indexed: false, name: 'wad', type: 'uint256' },
            { indexed: false, name: 'fax', type: 'bytes' },
        ],
        name: 'LogNote',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, name: 'from', type: 'address' },
            { indexed: true, name: 'to', type: 'address' },
            { indexed: false, name: 'value', type: 'uint256' },
        ],
        name: 'Transfer',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, name: 'owner', type: 'address' },
            { indexed: true, name: 'spender', type: 'address' },
            { indexed: false, name: 'value', type: 'uint256' },
        ],
        name: 'Approval',
        type: 'event',
    },
];

const HUNDRED_ABI = [
    {
        inputs: [
            { internalType: 'string', name: '_name', type: 'string' },
            { internalType: 'string', name: '_symbol', type: 'string' },
            { internalType: 'uint8', name: '_decimals', type: 'uint8' },
            { internalType: 'address', name: '_owner', type: 'address' },
            { internalType: 'uint256', name: 'initialSupply', type: 'uint256' },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
            { indexed: true, internalType: 'address', name: 'spender', type: 'address' },
            { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
        ],
        name: 'Approval',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'delegator', type: 'address' },
            { indexed: true, internalType: 'address', name: 'fromDelegate', type: 'address' },
            { indexed: true, internalType: 'address', name: 'toDelegate', type: 'address' },
        ],
        name: 'DelegateChanged',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'delegate', type: 'address' },
            { indexed: false, internalType: 'uint256', name: 'previousBalance', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'newBalance', type: 'uint256' },
        ],
        name: 'DelegateVotesChanged',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'from', type: 'address' },
            { indexed: true, internalType: 'address', name: 'to', type: 'address' },
            { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
        ],
        name: 'Transfer',
        type: 'event',
    },
    {
        inputs: [],
        name: 'DELEGATION_TYPEHASH',
        outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'DOMAIN_SEPARATOR',
        outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'DOMAIN_TYPEHASH',
        outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'PERMIT_TYPEHASH',
        outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'TRANSFER_TYPEHASH',
        outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'address', name: '', type: 'address' },
            { internalType: 'address', name: '', type: 'address' },
        ],
        name: 'allowance',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'address', name: 'spender', type: 'address' },
            { internalType: 'uint256', name: 'value', type: 'uint256' },
        ],
        name: 'approve',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'address', name: 'spender', type: 'address' },
            { internalType: 'uint256', name: 'value', type: 'uint256' },
            { internalType: 'bytes', name: 'data', type: 'bytes' },
        ],
        name: 'approveAndCall',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'address', name: '', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'address', name: '', type: 'address' },
            { internalType: 'uint32', name: '', type: 'uint32' },
        ],
        name: 'checkpoints',
        outputs: [
            { internalType: 'uint32', name: 'fromBlock', type: 'uint32' },
            { internalType: 'uint256', name: 'votes', type: 'uint256' },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'decimals',
        outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'address', name: 'delegatee', type: 'address' }],
        name: 'delegate',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'address', name: 'delegatee', type: 'address' },
            { internalType: 'uint256', name: 'nonce', type: 'uint256' },
            { internalType: 'uint256', name: 'expiry', type: 'uint256' },
            { internalType: 'uint8', name: 'v', type: 'uint8' },
            { internalType: 'bytes32', name: 'r', type: 'bytes32' },
            { internalType: 'bytes32', name: 's', type: 'bytes32' },
        ],
        name: 'delegateBySig',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'address', name: '', type: 'address' }],
        name: 'delegates',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
        name: 'getCurrentVotes',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'address', name: 'account', type: 'address' },
            { internalType: 'uint256', name: 'blockNumber', type: 'uint256' },
        ],
        name: 'getPriorVotes',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'name',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'address', name: '', type: 'address' }],
        name: 'nonces',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'address', name: '', type: 'address' }],
        name: 'numCheckpoints',
        outputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'owner',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'address', name: 'target', type: 'address' },
            { internalType: 'address', name: 'spender', type: 'address' },
            { internalType: 'uint256', name: 'value', type: 'uint256' },
            { internalType: 'uint256', name: 'deadline', type: 'uint256' },
            { internalType: 'uint8', name: 'v', type: 'uint8' },
            { internalType: 'bytes32', name: 'r', type: 'bytes32' },
            { internalType: 'bytes32', name: 's', type: 'bytes32' },
        ],
        name: 'permit',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'symbol',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'totalSupply',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'address', name: 'to', type: 'address' },
            { internalType: 'uint256', name: 'value', type: 'uint256' },
        ],
        name: 'transfer',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'address', name: 'to', type: 'address' },
            { internalType: 'uint256', name: 'value', type: 'uint256' },
            { internalType: 'bytes', name: 'data', type: 'bytes' },
        ],
        name: 'transferAndCall',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'address', name: 'from', type: 'address' },
            { internalType: 'address', name: 'to', type: 'address' },
            { internalType: 'uint256', name: 'value', type: 'uint256' },
        ],
        name: 'transferFrom',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'address', name: 'target', type: 'address' },
            { internalType: 'address', name: 'to', type: 'address' },
            { internalType: 'uint256', name: 'value', type: 'uint256' },
            { internalType: 'uint256', name: 'deadline', type: 'uint256' },
            { internalType: 'uint8', name: 'v', type: 'uint8' },
            { internalType: 'bytes32', name: 'r', type: 'bytes32' },
            { internalType: 'bytes32', name: 's', type: 'bytes32' },
        ],
        name: 'transferWithPermit',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];

const COMPOUNT_LENS_ABI = [
    {
        constant: false,
        inputs: [
            { internalType: 'contract CToken', name: 'cToken', type: 'address' },
            { internalType: 'address payable', name: 'account', type: 'address' },
        ],
        name: 'cTokenBalances',
        outputs: [
            {
                components: [
                    { internalType: 'address', name: 'cToken', type: 'address' },
                    { internalType: 'uint256', name: 'balanceOf', type: 'uint256' },
                    { internalType: 'uint256', name: 'borrowBalanceCurrent', type: 'uint256' },
                    { internalType: 'uint256', name: 'balanceOfUnderlying', type: 'uint256' },
                    { internalType: 'uint256', name: 'tokenBalance', type: 'uint256' },
                    { internalType: 'uint256', name: 'tokenAllowance', type: 'uint256' },
                ],
                internalType: 'struct CompoundLens.CTokenBalances',
                name: '',
                type: 'tuple',
            },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            { internalType: 'contract CToken[]', name: 'cTokens', type: 'address[]' },
            { internalType: 'address payable', name: 'account', type: 'address' },
        ],
        name: 'cTokenBalancesAll',
        outputs: [
            {
                components: [
                    { internalType: 'address', name: 'cToken', type: 'address' },
                    { internalType: 'uint256', name: 'balanceOf', type: 'uint256' },
                    { internalType: 'uint256', name: 'borrowBalanceCurrent', type: 'uint256' },
                    { internalType: 'uint256', name: 'balanceOfUnderlying', type: 'uint256' },
                    { internalType: 'uint256', name: 'tokenBalance', type: 'uint256' },
                    { internalType: 'uint256', name: 'tokenAllowance', type: 'uint256' },
                ],
                internalType: 'struct CompoundLens.CTokenBalances[]',
                name: '',
                type: 'tuple[]',
            },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [{ internalType: 'contract CToken', name: 'cToken', type: 'address' }],
        name: 'cTokenMetadata',
        outputs: [
            {
                components: [
                    { internalType: 'address', name: 'cToken', type: 'address' },
                    { internalType: 'uint256', name: 'exchangeRateCurrent', type: 'uint256' },
                    { internalType: 'uint256', name: 'supplyRatePerBlock', type: 'uint256' },
                    { internalType: 'uint256', name: 'borrowRatePerBlock', type: 'uint256' },
                    { internalType: 'uint256', name: 'reserveFactorMantissa', type: 'uint256' },
                    { internalType: 'uint256', name: 'totalBorrows', type: 'uint256' },
                    { internalType: 'uint256', name: 'totalReserves', type: 'uint256' },
                    { internalType: 'uint256', name: 'totalSupply', type: 'uint256' },
                    { internalType: 'uint256', name: 'totalCash', type: 'uint256' },
                    { internalType: 'bool', name: 'isListed', type: 'bool' },
                    { internalType: 'uint256', name: 'collateralFactorMantissa', type: 'uint256' },
                    { internalType: 'address', name: 'underlyingAssetAddress', type: 'address' },
                    { internalType: 'uint256', name: 'cTokenDecimals', type: 'uint256' },
                    { internalType: 'uint256', name: 'underlyingDecimals', type: 'uint256' },
                ],
                internalType: 'struct CompoundLens.CTokenMetadata',
                name: '',
                type: 'tuple',
            },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [{ internalType: 'contract CToken[]', name: 'cTokens', type: 'address[]' }],
        name: 'cTokenMetadataAll',
        outputs: [
            {
                components: [
                    { internalType: 'address', name: 'cToken', type: 'address' },
                    { internalType: 'uint256', name: 'exchangeRateCurrent', type: 'uint256' },
                    { internalType: 'uint256', name: 'supplyRatePerBlock', type: 'uint256' },
                    { internalType: 'uint256', name: 'borrowRatePerBlock', type: 'uint256' },
                    { internalType: 'uint256', name: 'reserveFactorMantissa', type: 'uint256' },
                    { internalType: 'uint256', name: 'totalBorrows', type: 'uint256' },
                    { internalType: 'uint256', name: 'totalReserves', type: 'uint256' },
                    { internalType: 'uint256', name: 'totalSupply', type: 'uint256' },
                    { internalType: 'uint256', name: 'totalCash', type: 'uint256' },
                    { internalType: 'bool', name: 'isListed', type: 'bool' },
                    { internalType: 'uint256', name: 'collateralFactorMantissa', type: 'uint256' },
                    { internalType: 'address', name: 'underlyingAssetAddress', type: 'address' },
                    { internalType: 'uint256', name: 'cTokenDecimals', type: 'uint256' },
                    { internalType: 'uint256', name: 'underlyingDecimals', type: 'uint256' },
                ],
                internalType: 'struct CompoundLens.CTokenMetadata[]',
                name: '',
                type: 'tuple[]',
            },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [{ internalType: 'contract CToken', name: 'cToken', type: 'address' }],
        name: 'cTokenUnderlyingPrice',
        outputs: [
            {
                components: [
                    { internalType: 'address', name: 'cToken', type: 'address' },
                    { internalType: 'uint256', name: 'underlyingPrice', type: 'uint256' },
                ],
                internalType: 'struct CompoundLens.CTokenUnderlyingPrice',
                name: '',
                type: 'tuple',
            },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [{ internalType: 'contract CToken[]', name: 'cTokens', type: 'address[]' }],
        name: 'cTokenUnderlyingPriceAll',
        outputs: [
            {
                components: [
                    { internalType: 'address', name: 'cToken', type: 'address' },
                    { internalType: 'uint256', name: 'underlyingPrice', type: 'uint256' },
                ],
                internalType: 'struct CompoundLens.CTokenUnderlyingPrice[]',
                name: '',
                type: 'tuple[]',
            },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            { internalType: 'contract ComptrollerLensInterface', name: 'comptroller', type: 'address' },
            { internalType: 'address', name: 'account', type: 'address' },
        ],
        name: 'getAccountLimits',
        outputs: [
            {
                components: [
                    { internalType: 'contract CToken[]', name: 'markets', type: 'address[]' },
                    { internalType: 'uint256', name: 'liquidity', type: 'uint256' },
                    { internalType: 'uint256', name: 'shortfall', type: 'uint256' },
                ],
                internalType: 'struct CompoundLens.AccountLimits',
                name: '',
                type: 'tuple',
            },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [
            { internalType: 'contract Comp', name: 'comp', type: 'address' },
            { internalType: 'address', name: 'account', type: 'address' },
        ],
        name: 'getCompBalanceMetadata',
        outputs: [
            {
                components: [
                    { internalType: 'uint256', name: 'balance', type: 'uint256' },
                    { internalType: 'uint256', name: 'votes', type: 'uint256' },
                    { internalType: 'address', name: 'delegate', type: 'address' },
                ],
                internalType: 'struct CompoundLens.CompBalanceMetadata',
                name: '',
                type: 'tuple',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            { internalType: 'contract Comp', name: 'comp', type: 'address' },
            { internalType: 'contract ComptrollerLensInterface', name: 'comptroller', type: 'address' },
            { internalType: 'address', name: 'account', type: 'address' },
        ],
        name: 'getCompBalanceMetadataExt',
        outputs: [
            {
                components: [
                    { internalType: 'uint256', name: 'balance', type: 'uint256' },
                    { internalType: 'uint256', name: 'votes', type: 'uint256' },
                    { internalType: 'address', name: 'delegate', type: 'address' },
                    { internalType: 'uint256', name: 'allocated', type: 'uint256' },
                ],
                internalType: 'struct CompoundLens.CompBalanceMetadataExt',
                name: '',
                type: 'tuple',
            },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [
            { internalType: 'contract Comp', name: 'comp', type: 'address' },
            { internalType: 'address', name: 'account', type: 'address' },
            { internalType: 'uint32[]', name: 'blockNumbers', type: 'uint32[]' },
        ],
        name: 'getCompVotes',
        outputs: [
            {
                components: [
                    { internalType: 'uint256', name: 'blockNumber', type: 'uint256' },
                    { internalType: 'uint256', name: 'votes', type: 'uint256' },
                ],
                internalType: 'struct CompoundLens.CompVotes[]',
                name: '',
                type: 'tuple[]',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [
            { internalType: 'contract GovernorAlpha', name: 'governor', type: 'address' },
            { internalType: 'uint256[]', name: 'proposalIds', type: 'uint256[]' },
        ],
        name: 'getGovProposals',
        outputs: [
            {
                components: [
                    { internalType: 'uint256', name: 'proposalId', type: 'uint256' },
                    { internalType: 'address', name: 'proposer', type: 'address' },
                    { internalType: 'uint256', name: 'eta', type: 'uint256' },
                    { internalType: 'address[]', name: 'targets', type: 'address[]' },
                    { internalType: 'uint256[]', name: 'values', type: 'uint256[]' },
                    { internalType: 'string[]', name: 'signatures', type: 'string[]' },
                    { internalType: 'bytes[]', name: 'calldatas', type: 'bytes[]' },
                    { internalType: 'uint256', name: 'startBlock', type: 'uint256' },
                    { internalType: 'uint256', name: 'endBlock', type: 'uint256' },
                    { internalType: 'uint256', name: 'forVotes', type: 'uint256' },
                    { internalType: 'uint256', name: 'againstVotes', type: 'uint256' },
                    { internalType: 'bool', name: 'canceled', type: 'bool' },
                    { internalType: 'bool', name: 'executed', type: 'bool' },
                ],
                internalType: 'struct CompoundLens.GovProposal[]',
                name: '',
                type: 'tuple[]',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [
            { internalType: 'contract GovernorAlpha', name: 'governor', type: 'address' },
            { internalType: 'address', name: 'voter', type: 'address' },
            { internalType: 'uint256[]', name: 'proposalIds', type: 'uint256[]' },
        ],
        name: 'getGovReceipts',
        outputs: [
            {
                components: [
                    { internalType: 'uint256', name: 'proposalId', type: 'uint256' },
                    { internalType: 'bool', name: 'hasVoted', type: 'bool' },
                    { internalType: 'bool', name: 'support', type: 'bool' },
                    { internalType: 'uint96', name: 'votes', type: 'uint96' },
                ],
                internalType: 'struct CompoundLens.GovReceipt[]',
                name: '',
                type: 'tuple[]',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
];

const UNITROLLER_ABI = [
    { inputs: [], payable: false, stateMutability: 'nonpayable', type: 'constructor' },
    {
        anonymous: false,
        inputs: [
            { indexed: false, internalType: 'uint256', name: 'error', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'info', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'detail', type: 'uint256' },
        ],
        name: 'Failure',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, internalType: 'address', name: 'oldAdmin', type: 'address' },
            { indexed: false, internalType: 'address', name: 'newAdmin', type: 'address' },
        ],
        name: 'NewAdmin',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, internalType: 'address', name: 'oldImplementation', type: 'address' },
            { indexed: false, internalType: 'address', name: 'newImplementation', type: 'address' },
        ],
        name: 'NewImplementation',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, internalType: 'address', name: 'oldPendingAdmin', type: 'address' },
            { indexed: false, internalType: 'address', name: 'newPendingAdmin', type: 'address' },
        ],
        name: 'NewPendingAdmin',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, internalType: 'address', name: 'oldPendingImplementation', type: 'address' },
            { indexed: false, internalType: 'address', name: 'newPendingImplementation', type: 'address' },
        ],
        name: 'NewPendingImplementation',
        type: 'event',
    },
    { payable: true, stateMutability: 'payable', type: 'fallback' },
    {
        constant: false,
        inputs: [],
        name: '_acceptAdmin',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [],
        name: '_acceptImplementation',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [{ internalType: 'address', name: 'newPendingAdmin', type: 'address' }],
        name: '_setPendingAdmin',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [{ internalType: 'address', name: 'newPendingImplementation', type: 'address' }],
        name: '_setPendingImplementation',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'admin',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'comptrollerImplementation',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'pendingAdmin',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'pendingComptrollerImplementation',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
];

const BPRO_ABI = [
    {
        inputs: [
            { internalType: 'address', name: '_priceAggregator', type: 'address' },
            { internalType: 'address', name: '_LUSD', type: 'address' },
            { internalType: 'address', name: '_cETH', type: 'address' },
            { internalType: 'address', name: '_cBorrow', type: 'address' },
            { internalType: 'uint256', name: '_maxDiscount', type: 'uint256' },
            { internalType: 'address payable', name: '_feePool', type: 'address' },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'tokenOwner', type: 'address' },
            { indexed: true, internalType: 'address', name: 'spender', type: 'address' },
            { indexed: false, internalType: 'uint256', name: 'tokens', type: 'uint256' },
        ],
        name: 'Approval',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
            { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' },
        ],
        name: 'OwnershipTransferred',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, internalType: 'uint256', name: 'A', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'fee', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'callerFee', type: 'uint256' },
        ],
        name: 'ParamsSet',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'user', type: 'address' },
            { indexed: false, internalType: 'uint256', name: 'lusdAmount', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'ethAmount', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'timestamp', type: 'uint256' },
        ],
        name: 'RebalanceSwap',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'from', type: 'address' },
            { indexed: true, internalType: 'address', name: 'to', type: 'address' },
            { indexed: false, internalType: 'uint256', name: 'tokens', type: 'uint256' },
        ],
        name: 'Transfer',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'user', type: 'address' },
            { indexed: false, internalType: 'uint256', name: 'lusdAmount', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'numShares', type: 'uint256' },
        ],
        name: 'UserDeposit',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'user', type: 'address' },
            { indexed: false, internalType: 'uint256', name: 'lusdAmount', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'ethAmount', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'numShares', type: 'uint256' },
        ],
        name: 'UserWithdraw',
        type: 'event',
    },
    {
        inputs: [],
        name: 'A',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'LUSD',
        outputs: [{ internalType: 'contract IERC20', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'MAX_A',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'MAX_CALLER_FEE',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'MAX_FEE',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'MIN_A',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'PRECISION',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'address', name: '', type: 'address' },
            { internalType: 'address', name: '', type: 'address' },
        ],
        name: 'allowance',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'address', name: 'spender', type: 'address' },
            { internalType: 'uint256', name: 'tokens', type: 'uint256' },
        ],
        name: 'approve',
        outputs: [{ internalType: 'bool', name: 'success', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'address', name: '', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'cBorrow',
        outputs: [{ internalType: 'contract ICToken', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'cETH',
        outputs: [{ internalType: 'contract ICToken', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'callerFee',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'address', name: 'cTokenBorrowed', type: 'address' },
            { internalType: 'address', name: 'cTokenCollateral', type: 'address' },
            { internalType: 'uint256', name: 'repayAmount', type: 'uint256' },
        ],
        name: 'canLiquidate',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'decimals',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'uint256', name: 'lusdAmount', type: 'uint256' }],
        name: 'deposit',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'fee',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'feePool',
        outputs: [{ internalType: 'address payable', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'fetchPrice',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'uint256', name: 'xQty', type: 'uint256' },
            { internalType: 'uint256', name: 'xBalance', type: 'uint256' },
            { internalType: 'uint256', name: 'yBalance', type: 'uint256' },
            { internalType: 'uint256', name: 'A', type: 'uint256' },
        ],
        name: 'getReturn',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'pure',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'uint256', name: 'x', type: 'uint256' },
            { internalType: 'uint256', name: 'y', type: 'uint256' },
            { internalType: 'uint256', name: 'A', type: 'uint256' },
        ],
        name: 'getSumFixedPoint',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'pure',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'uint256', name: 'lusdQty', type: 'uint256' }],
        name: 'getSwapEthAmount',
        outputs: [{ internalType: 'uint256', name: 'ethAmount', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'isOwner',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'address', name: 'borrower', type: 'address' },
            { internalType: 'uint256', name: 'amount', type: 'uint256' },
            { internalType: 'address', name: 'collateral', type: 'address' },
        ],
        name: 'liquidateBorrow',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'lusdDecimals',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'maxDiscount',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'name',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'owner',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'priceAggregator',
        outputs: [{ internalType: 'contract AggregatorV3Interface', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'uint256', name: '_A', type: 'uint256' },
            { internalType: 'uint256', name: '_fee', type: 'uint256' },
            { internalType: 'uint256', name: '_callerFee', type: 'uint256' },
        ],
        name: 'setParams',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'uint256', name: 'lusdAmount', type: 'uint256' },
            { internalType: 'uint256', name: 'minEthReturn', type: 'uint256' },
            { internalType: 'address payable', name: 'dest', type: 'address' },
        ],
        name: 'swap',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'symbol',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'totalSupply',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'address', name: 'to', type: 'address' },
            { internalType: 'uint256', name: 'tokens', type: 'uint256' },
        ],
        name: 'transfer',
        outputs: [{ internalType: 'bool', name: 'success', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'address', name: 'from', type: 'address' },
            { internalType: 'address', name: 'to', type: 'address' },
            { internalType: 'uint256', name: 'tokens', type: 'uint256' },
        ],
        name: 'transferFrom',
        outputs: [{ internalType: 'bool', name: 'success', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
        name: 'transferOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'uint256', name: 'numShares', type: 'uint256' }],
        name: 'withdraw',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    { stateMutability: 'payable', type: 'receive' },
];

const BPRO_ABI_V2 = [
    {
        inputs: [
            { internalType: 'address', name: '_LUSD', type: 'address' },
            { internalType: 'address', name: '_cBorrow', type: 'address' },
            { internalType: 'uint256', name: '_maxDiscount', type: 'uint256' },
            { internalType: 'address payable', name: '_feePool', type: 'address' },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'tokenOwner', type: 'address' },
            { indexed: true, internalType: 'address', name: 'spender', type: 'address' },
            { indexed: false, internalType: 'uint256', name: 'tokens', type: 'uint256' },
        ],
        name: 'Approval',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
            { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' },
        ],
        name: 'OwnershipTransferred',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, internalType: 'uint256', name: 'A', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'fee', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'callerFee', type: 'uint256' },
        ],
        name: 'ParamsSet',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'user', type: 'address' },
            { indexed: false, internalType: 'uint256', name: 'lusdAmount', type: 'uint256' },
            { indexed: false, internalType: 'contract IERC20', name: 'token', type: 'address' },
            { indexed: false, internalType: 'uint256', name: 'tokenAmount', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'timestamp', type: 'uint256' },
        ],
        name: 'RebalanceSwap',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'from', type: 'address' },
            { indexed: true, internalType: 'address', name: 'to', type: 'address' },
            { indexed: false, internalType: 'uint256', name: 'tokens', type: 'uint256' },
        ],
        name: 'Transfer',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'user', type: 'address' },
            { indexed: false, internalType: 'uint256', name: 'lusdAmount', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'numShares', type: 'uint256' },
        ],
        name: 'UserDeposit',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'user', type: 'address' },
            { indexed: false, internalType: 'uint256', name: 'lusdAmount', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'numShares', type: 'uint256' },
        ],
        name: 'UserWithdraw',
        type: 'event',
    },
    {
        inputs: [],
        name: 'A',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'LUSD',
        outputs: [{ internalType: 'contract IERC20', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'MAX_A',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'MAX_CALLER_FEE',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'MAX_FEE',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'MIN_A',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'PRECISION',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'contract ICToken', name: 'ctoken', type: 'address' },
            { internalType: 'contract AggregatorV3Interface', name: 'feed', type: 'address' },
        ],
        name: 'addCollateral',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'address', name: '', type: 'address' },
            { internalType: 'address', name: '', type: 'address' },
        ],
        name: 'allowance',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'address', name: 'spender', type: 'address' },
            { internalType: 'uint256', name: 'tokens', type: 'uint256' },
        ],
        name: 'approve',
        outputs: [{ internalType: 'bool', name: 'success', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'address', name: '', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'cBorrow',
        outputs: [{ internalType: 'contract ICToken', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'address', name: '', type: 'address' }],
        name: 'cTokens',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'callerFee',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'contract ICToken', name: 'cTokenBorrowed', type: 'address' },
            { internalType: 'contract ICToken', name: 'cTokenCollateral', type: 'address' },
            { internalType: 'uint256', name: 'repayAmount', type: 'uint256' },
        ],
        name: 'canLiquidate',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'address', name: '', type: 'address' }],
        name: 'collateralDecimals',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        name: 'collaterals',
        outputs: [{ internalType: 'contract IERC20', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'decimals',
        outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'uint256', name: 'lusdAmount', type: 'uint256' }],
        name: 'deposit',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'fee',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'feePool',
        outputs: [{ internalType: 'address payable', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'contract IERC20', name: 'token', type: 'address' }],
        name: 'fetchPrice',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'getCollateralValue',
        outputs: [
            { internalType: 'bool', name: 'succ', type: 'bool' },
            { internalType: 'uint256', name: 'value', type: 'uint256' },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'uint256', name: 'xQty', type: 'uint256' },
            { internalType: 'uint256', name: 'xBalance', type: 'uint256' },
            { internalType: 'uint256', name: 'yBalance', type: 'uint256' },
            { internalType: 'uint256', name: 'A', type: 'uint256' },
        ],
        name: 'getReturn',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'pure',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'uint256', name: 'x', type: 'uint256' },
            { internalType: 'uint256', name: 'y', type: 'uint256' },
            { internalType: 'uint256', name: 'A', type: 'uint256' },
        ],
        name: 'getSumFixedPoint',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'pure',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'uint256', name: 'lusdQty', type: 'uint256' },
            { internalType: 'contract IERC20', name: 'token', type: 'address' },
        ],
        name: 'getSwapAmount',
        outputs: [{ internalType: 'uint256', name: 'tokenAmount', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'isOwner',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'address', name: 'borrower', type: 'address' },
            { internalType: 'uint256', name: 'amount', type: 'uint256' },
            { internalType: 'contract ICToken', name: 'collateral', type: 'address' },
        ],
        name: 'liquidateBorrow',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'lusdDecimals',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'maxDiscount',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'name',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'owner',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'address', name: '', type: 'address' }],
        name: 'priceAggregators',
        outputs: [{ internalType: 'contract AggregatorV3Interface', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'contract ICToken', name: 'ctoken', type: 'address' }],
        name: 'removeCollateral',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'uint256', name: '_A', type: 'uint256' },
            { internalType: 'uint256', name: '_fee', type: 'uint256' },
            { internalType: 'uint256', name: '_callerFee', type: 'uint256' },
        ],
        name: 'setParams',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'uint256', name: 'lusdAmount', type: 'uint256' },
            { internalType: 'contract IERC20', name: 'returnToken', type: 'address' },
            { internalType: 'uint256', name: 'minReturn', type: 'uint256' },
            { internalType: 'address payable', name: 'dest', type: 'address' },
        ],
        name: 'swap',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'symbol',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'totalSupply',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'address', name: 'to', type: 'address' },
            { internalType: 'uint256', name: 'tokens', type: 'uint256' },
        ],
        name: 'transfer',
        outputs: [{ internalType: 'bool', name: 'success', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'address', name: 'from', type: 'address' },
            { internalType: 'address', name: 'to', type: 'address' },
            { internalType: 'uint256', name: 'tokens', type: 'uint256' },
        ],
        name: 'transferFrom',
        outputs: [{ internalType: 'bool', name: 'success', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
        name: 'transferOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'uint256', name: 'numShares', type: 'uint256' }],
        name: 'withdraw',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    { stateMutability: 'payable', type: 'receive' },
];

const MINTER_ABI = [
    {
        anonymous: false,
        inputs: [
            { indexed: true, name: 'recipient', type: 'address' },
            { indexed: false, name: 'gauge', type: 'address' },
            { indexed: false, name: 'minted', type: 'uint256' },
        ],
        name: 'Minted',
        type: 'event',
    },
    {
        inputs: [
            { name: '_treasury', type: 'address' },
            { name: '_controller', type: 'address' },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
    {
        inputs: [{ name: 'gauge_addr', type: 'address' }],
        name: 'mint',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [{ name: 'gauge_addrs', type: 'address[8]' }],
        name: 'mint_many',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            { name: 'gauge_addr', type: 'address' },
            { name: '_for', type: 'address' },
        ],
        name: 'mint_for',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [{ name: 'minting_user', type: 'address' }],
        name: 'toggle_approve_mint',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'treasury',
        outputs: [{ name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'controller',
        outputs: [{ name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { name: 'arg0', type: 'address' },
            { name: 'arg1', type: 'address' },
        ],
        name: 'minted',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { name: 'arg0', type: 'address' },
            { name: 'arg1', type: 'address' },
        ],
        name: 'allowed_to_mint_for',
        outputs: [{ name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function',
    },
];

const MINTER_V2_ABI = [
    {
        "name": "Minted",
        "inputs": [
            {
                "name": "recipient",
                "type": "address",
                "indexed": true
            },
            {
                "name": "gauge",
                "type": "address",
                "indexed": false
            },
            {
                "name": "token",
                "type": "address",
                "indexed": false
            },
            {
                "name": "minted",
                "type": "uint256",
                "indexed": false
            }
        ],
        "anonymous": false,
        "type": "event"
    },
    {
        "stateMutability": "nonpayable",
        "type": "constructor",
        "inputs": [
            {
                "name": "_treasury",
                "type": "address"
            },
            {
                "name": "_controller",
                "type": "address"
            }
        ],
        "outputs": []
    },
    {
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "mint",
        "inputs": [
            {
                "name": "gauge_addr",
                "type": "address"
            }
        ],
        "outputs": []
    },
    {
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "mint_many",
        "inputs": [
            {
                "name": "gauge_addrs",
                "type": "address[8]"
            }
        ],
        "outputs": []
    },
    {
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "mint_for",
        "inputs": [
            {
                "name": "gauge_addr",
                "type": "address"
            },
            {
                "name": "_for",
                "type": "address"
            }
        ],
        "outputs": []
    },
    {
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "toggle_approve_mint",
        "inputs": [
            {
                "name": "minting_user",
                "type": "address"
            }
        ],
        "outputs": []
    },
    {
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "add_token",
        "inputs": [
            {
                "name": "_token",
                "type": "address"
            }
        ],
        "outputs": []
    },
    {
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "set_admin",
        "inputs": [
            {
                "name": "_admin",
                "type": "address"
            }
        ],
        "outputs": []
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "token_count",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "tokens",
        "inputs": [
            {
                "name": "arg0",
                "type": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "treasury",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "controller",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "admin",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "minted",
        "inputs": [
            {
                "name": "arg0",
                "type": "address"
            },
            {
                "name": "arg1",
                "type": "address"
            },
            {
                "name": "arg2",
                "type": "address"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "allowed_to_mint_for",
        "inputs": [
            {
                "name": "arg0",
                "type": "address"
            },
            {
                "name": "arg1",
                "type": "address"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ]
    }
];

const GAUGE_V4_ABI = [
    {
        "name": "Deposit",
        "inputs": [
            {
                "name": "provider",
                "type": "address",
                "indexed": true
            },
            {
                "name": "value",
                "type": "uint256",
                "indexed": false
            }
        ],
        "anonymous": false,
        "type": "event"
    },
    {
        "name": "Withdraw",
        "inputs": [
            {
                "name": "provider",
                "type": "address",
                "indexed": true
            },
            {
                "name": "value",
                "type": "uint256",
                "indexed": false
            }
        ],
        "anonymous": false,
        "type": "event"
    },
    {
        "name": "UpdateLiquidityLimit",
        "inputs": [
            {
                "name": "user",
                "type": "address",
                "indexed": false
            },
            {
                "name": "original_balance",
                "type": "uint256",
                "indexed": false
            },
            {
                "name": "original_supply",
                "type": "uint256",
                "indexed": false
            },
            {
                "name": "working_balance",
                "type": "uint256",
                "indexed": false
            },
            {
                "name": "working_supply",
                "type": "uint256",
                "indexed": false
            }
        ],
        "anonymous": false,
        "type": "event"
    },
    {
        "name": "CommitOwnership",
        "inputs": [
            {
                "name": "admin",
                "type": "address",
                "indexed": false
            }
        ],
        "anonymous": false,
        "type": "event"
    },
    {
        "name": "ApplyOwnership",
        "inputs": [
            {
                "name": "admin",
                "type": "address",
                "indexed": false
            }
        ],
        "anonymous": false,
        "type": "event"
    },
    {
        "name": "Transfer",
        "inputs": [
            {
                "name": "_from",
                "type": "address",
                "indexed": true
            },
            {
                "name": "_to",
                "type": "address",
                "indexed": true
            },
            {
                "name": "_value",
                "type": "uint256",
                "indexed": false
            }
        ],
        "anonymous": false,
        "type": "event"
    },
    {
        "name": "Approval",
        "inputs": [
            {
                "name": "_owner",
                "type": "address",
                "indexed": true
            },
            {
                "name": "_spender",
                "type": "address",
                "indexed": true
            },
            {
                "name": "_value",
                "type": "uint256",
                "indexed": false
            }
        ],
        "anonymous": false,
        "type": "event"
    },
    {
        "stateMutability": "nonpayable",
        "type": "constructor",
        "inputs": [
            {
                "name": "_lp_token",
                "type": "address"
            },
            {
                "name": "_minter",
                "type": "address"
            },
            {
                "name": "_admin",
                "type": "address"
            },
            {
                "name": "_reward_policy_maker",
                "type": "address"
            },
            {
                "name": "_veboost_proxy",
                "type": "address"
            },
            {
                "name": "_reward_fee",
                "type": "uint256"
            }
        ],
        "outputs": []
    },
    {
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "set_reward_fee",
        "inputs": [
            {
                "name": "_reward_fee",
                "type": "uint256"
            }
        ],
        "outputs": []
    },
    {
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "set_reward_collector",
        "inputs": [
            {
                "name": "_addr",
                "type": "address"
            }
        ],
        "outputs": []
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "integrate_checkpoint",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ]
    },
    {
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "user_checkpoint",
        "inputs": [
            {
                "name": "addr",
                "type": "address"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "claimable_tokens",
        "inputs": [
            {
                "name": "addr",
                "type": "address"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "claimed_reward",
        "inputs": [
            {
                "name": "_addr",
                "type": "address"
            },
            {
                "name": "_token",
                "type": "address"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "claimable_reward",
        "inputs": [
            {
                "name": "_user",
                "type": "address"
            },
            {
                "name": "_reward_token",
                "type": "address"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ]
    },
    {
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "set_rewards_receiver",
        "inputs": [
            {
                "name": "_receiver",
                "type": "address"
            }
        ],
        "outputs": []
    },
    {
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "claim_rewards",
        "inputs": [],
        "outputs": []
    },
    {
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "claim_rewards",
        "inputs": [
            {
                "name": "_addr",
                "type": "address"
            }
        ],
        "outputs": []
    },
    {
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "claim_rewards",
        "inputs": [
            {
                "name": "_addr",
                "type": "address"
            },
            {
                "name": "_receiver",
                "type": "address"
            }
        ],
        "outputs": []
    },
    {
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "kick",
        "inputs": [
            {
                "name": "addr",
                "type": "address"
            }
        ],
        "outputs": []
    },
    {
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "deposit",
        "inputs": [
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "outputs": []
    },
    {
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "deposit",
        "inputs": [
            {
                "name": "_value",
                "type": "uint256"
            },
            {
                "name": "_addr",
                "type": "address"
            }
        ],
        "outputs": []
    },
    {
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "deposit",
        "inputs": [
            {
                "name": "_value",
                "type": "uint256"
            },
            {
                "name": "_addr",
                "type": "address"
            },
            {
                "name": "_claim_rewards",
                "type": "bool"
            }
        ],
        "outputs": []
    },
    {
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "withdraw",
        "inputs": [
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "outputs": []
    },
    {
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "withdraw",
        "inputs": [
            {
                "name": "_value",
                "type": "uint256"
            },
            {
                "name": "_claim_rewards",
                "type": "bool"
            }
        ],
        "outputs": []
    },
    {
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "transfer",
        "inputs": [
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ]
    },
    {
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "transferFrom",
        "inputs": [
            {
                "name": "_from",
                "type": "address"
            },
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ]
    },
    {
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "approve",
        "inputs": [
            {
                "name": "_spender",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ]
    },
    {
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "increaseAllowance",
        "inputs": [
            {
                "name": "_spender",
                "type": "address"
            },
            {
                "name": "_added_value",
                "type": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ]
    },
    {
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "decreaseAllowance",
        "inputs": [
            {
                "name": "_spender",
                "type": "address"
            },
            {
                "name": "_subtracted_value",
                "type": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ]
    },
    {
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "add_reward",
        "inputs": [
            {
                "name": "_reward_token",
                "type": "address"
            },
            {
                "name": "_distributor",
                "type": "address"
            }
        ],
        "outputs": []
    },
    {
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "set_reward_distributor",
        "inputs": [
            {
                "name": "_reward_token",
                "type": "address"
            },
            {
                "name": "_distributor",
                "type": "address"
            }
        ],
        "outputs": []
    },
    {
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "deposit_reward_token",
        "inputs": [
            {
                "name": "_reward_token",
                "type": "address"
            },
            {
                "name": "_amount",
                "type": "uint256"
            }
        ],
        "outputs": []
    },
    {
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "set_killed",
        "inputs": [
            {
                "name": "_is_killed",
                "type": "bool"
            }
        ],
        "outputs": []
    },
    {
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "commit_transfer_ownership",
        "inputs": [
            {
                "name": "addr",
                "type": "address"
            }
        ],
        "outputs": []
    },
    {
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "accept_transfer_ownership",
        "inputs": [],
        "outputs": []
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "minter",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "reward_policy_maker",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "voting_escrow",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "controller",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "veboost_proxy",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "lp_token",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "balanceOf",
        "inputs": [
            {
                "name": "arg0",
                "type": "address"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "totalSupply",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "allowance",
        "inputs": [
            {
                "name": "arg0",
                "type": "address"
            },
            {
                "name": "arg1",
                "type": "address"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "name",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "symbol",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "decimals",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "working_balances",
        "inputs": [
            {
                "name": "arg0",
                "type": "address"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "working_supply",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "period",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "int128"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "period_timestamp",
        "inputs": [
            {
                "name": "arg0",
                "type": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "integrate_inv_supply",
        "inputs": [
            {
                "name": "arg0",
                "type": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "integrate_inv_supply_of",
        "inputs": [
            {
                "name": "arg0",
                "type": "address"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "integrate_checkpoint_of",
        "inputs": [
            {
                "name": "arg0",
                "type": "address"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "integrate_fraction",
        "inputs": [
            {
                "name": "arg0",
                "type": "address"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "reward_count",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "reward_tokens",
        "inputs": [
            {
                "name": "arg0",
                "type": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "reward_fee",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "reward_collector",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "reward_data",
        "inputs": [
            {
                "name": "arg0",
                "type": "address"
            }
        ],
        "outputs": [
            {
                "name": "token",
                "type": "address"
            },
            {
                "name": "distributor",
                "type": "address"
            },
            {
                "name": "period_finish",
                "type": "uint256"
            },
            {
                "name": "rate",
                "type": "uint256"
            },
            {
                "name": "last_update",
                "type": "uint256"
            },
            {
                "name": "integral",
                "type": "uint256"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "rewards_receiver",
        "inputs": [
            {
                "name": "arg0",
                "type": "address"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "reward_integral_for",
        "inputs": [
            {
                "name": "arg0",
                "type": "address"
            },
            {
                "name": "arg1",
                "type": "address"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "admin",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "future_admin",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "is_killed",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ]
    }
];

const GAUGE_V5_ABI = [
    {
        "name": "Deposit",
        "inputs": [
            {
                "name": "provider",
                "type": "address",
                "indexed": true
            },
            {
                "name": "value",
                "type": "uint256",
                "indexed": false
            }
        ],
        "anonymous": false,
        "type": "event"
    },
    {
        "name": "Withdraw",
        "inputs": [
            {
                "name": "provider",
                "type": "address",
                "indexed": true
            },
            {
                "name": "value",
                "type": "uint256",
                "indexed": false
            }
        ],
        "anonymous": false,
        "type": "event"
    },
    {
        "name": "EmergencyWithdraw",
        "inputs": [
            {
                "name": "provider",
                "type": "address",
                "indexed": true
            },
            {
                "name": "value",
                "type": "uint256",
                "indexed": false
            }
        ],
        "anonymous": false,
        "type": "event"
    },
    {
        "name": "UpdateLiquidityLimit",
        "inputs": [
            {
                "name": "user",
                "type": "address",
                "indexed": false
            },
            {
                "name": "original_balance",
                "type": "uint256",
                "indexed": false
            },
            {
                "name": "original_supply",
                "type": "uint256",
                "indexed": false
            },
            {
                "name": "working_balance",
                "type": "uint256",
                "indexed": false
            },
            {
                "name": "working_supply",
                "type": "uint256",
                "indexed": false
            }
        ],
        "anonymous": false,
        "type": "event"
    },
    {
        "name": "CommitOwnership",
        "inputs": [
            {
                "name": "admin",
                "type": "address",
                "indexed": false
            }
        ],
        "anonymous": false,
        "type": "event"
    },
    {
        "name": "ApplyOwnership",
        "inputs": [
            {
                "name": "admin",
                "type": "address",
                "indexed": false
            }
        ],
        "anonymous": false,
        "type": "event"
    },
    {
        "name": "Transfer",
        "inputs": [
            {
                "name": "_from",
                "type": "address",
                "indexed": true
            },
            {
                "name": "_to",
                "type": "address",
                "indexed": true
            },
            {
                "name": "_value",
                "type": "uint256",
                "indexed": false
            }
        ],
        "anonymous": false,
        "type": "event"
    },
    {
        "name": "Approval",
        "inputs": [
            {
                "name": "_owner",
                "type": "address",
                "indexed": true
            },
            {
                "name": "_spender",
                "type": "address",
                "indexed": true
            },
            {
                "name": "_value",
                "type": "uint256",
                "indexed": false
            }
        ],
        "anonymous": false,
        "type": "event"
    },
    {
        "stateMutability": "nonpayable",
        "type": "constructor",
        "inputs": [
            {
                "name": "_lp_token",
                "type": "address"
            },
            {
                "name": "_minter",
                "type": "address"
            },
            {
                "name": "_admin",
                "type": "address"
            },
            {
                "name": "_reward_policy_maker",
                "type": "address"
            },
            {
                "name": "_veboost_proxy",
                "type": "address"
            }
        ],
        "outputs": []
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "integrate_checkpoint",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ]
    },
    {
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "user_checkpoint",
        "inputs": [
            {
                "name": "addr",
                "type": "address"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "claimable_tokens",
        "inputs": [
            {
                "name": "addr",
                "type": "address"
            },
            {
                "name": "token",
                "type": "address"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ]
    },
    {
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "kick",
        "inputs": [
            {
                "name": "addr",
                "type": "address"
            }
        ],
        "outputs": []
    },
    {
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "deposit",
        "inputs": [
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "outputs": []
    },
    {
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "deposit",
        "inputs": [
            {
                "name": "_value",
                "type": "uint256"
            },
            {
                "name": "_addr",
                "type": "address"
            }
        ],
        "outputs": []
    },
    {
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "withdraw",
        "inputs": [
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "outputs": []
    },
    {
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "emergency_withdraw",
        "inputs": [],
        "outputs": []
    },
    {
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "transfer",
        "inputs": [
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ]
    },
    {
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "transferFrom",
        "inputs": [
            {
                "name": "_from",
                "type": "address"
            },
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ]
    },
    {
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "approve",
        "inputs": [
            {
                "name": "_spender",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ]
    },
    {
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "increaseAllowance",
        "inputs": [
            {
                "name": "_spender",
                "type": "address"
            },
            {
                "name": "_added_value",
                "type": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ]
    },
    {
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "decreaseAllowance",
        "inputs": [
            {
                "name": "_spender",
                "type": "address"
            },
            {
                "name": "_subtracted_value",
                "type": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ]
    },
    {
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "set_killed",
        "inputs": [
            {
                "name": "_is_killed",
                "type": "bool"
            }
        ],
        "outputs": []
    },
    {
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "commit_transfer_ownership",
        "inputs": [
            {
                "name": "addr",
                "type": "address"
            }
        ],
        "outputs": []
    },
    {
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "accept_transfer_ownership",
        "inputs": [],
        "outputs": []
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "minter",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "reward_policy_maker",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "voting_escrow",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "controller",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "veboost_proxy",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "lp_token",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "balanceOf",
        "inputs": [
            {
                "name": "arg0",
                "type": "address"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "totalSupply",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "allowance",
        "inputs": [
            {
                "name": "arg0",
                "type": "address"
            },
            {
                "name": "arg1",
                "type": "address"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "name",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "symbol",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "decimals",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "working_balances",
        "inputs": [
            {
                "name": "arg0",
                "type": "address"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "working_supply",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "period",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "int128"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "period_timestamp",
        "inputs": [
            {
                "name": "arg0",
                "type": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "integrate_inv_supply",
        "inputs": [
            {
                "name": "arg0",
                "type": "address"
            },
            {
                "name": "arg1",
                "type": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "integrate_inv_supply_of",
        "inputs": [
            {
                "name": "arg0",
                "type": "address"
            },
            {
                "name": "arg1",
                "type": "address"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "integrate_checkpoint_of",
        "inputs": [
            {
                "name": "arg0",
                "type": "address"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "integrate_fraction",
        "inputs": [
            {
                "name": "arg0",
                "type": "address"
            },
            {
                "name": "arg1",
                "type": "address"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "admin",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "future_admin",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "is_killed",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ]
    }
];

const GAUGE_CONTROLLER_ABI = [
    {
        anonymous: false,
        inputs: [{ indexed: false, name: 'admin', type: 'address' }],
        name: 'CommitOwnership',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [{ indexed: false, name: 'admin', type: 'address' }],
        name: 'ApplyOwnership',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, name: 'name', type: 'string' },
            { indexed: false, name: 'type_id', type: 'int128' },
        ],
        name: 'AddType',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, name: 'type_id', type: 'int128' },
            { indexed: false, name: 'time', type: 'uint256' },
            { indexed: false, name: 'weight', type: 'uint256' },
            { indexed: false, name: 'total_weight', type: 'uint256' },
        ],
        name: 'NewTypeWeight',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, name: 'gauge_address', type: 'address' },
            { indexed: false, name: 'time', type: 'uint256' },
            { indexed: false, name: 'weight', type: 'uint256' },
            { indexed: false, name: 'total_weight', type: 'uint256' },
        ],
        name: 'NewGaugeWeight',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, name: 'time', type: 'uint256' },
            { indexed: false, name: 'user', type: 'address' },
            { indexed: false, name: 'gauge_addr', type: 'address' },
            { indexed: false, name: 'weight', type: 'uint256' },
        ],
        name: 'VoteForGauge',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, name: 'addr', type: 'address' },
            { indexed: false, name: 'gauge_type', type: 'int128' },
            { indexed: false, name: 'weight', type: 'uint256' },
        ],
        name: 'NewGauge',
        type: 'event',
    },
    {
        inputs: [
            { name: '_token', type: 'address' },
            { name: '_voting_escrow', type: 'address' },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
    {
        inputs: [{ name: 'addr', type: 'address' }],
        name: 'commit_transfer_ownership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    { inputs: [], name: 'apply_transfer_ownership', outputs: [], stateMutability: 'nonpayable', type: 'function' },
    {
        inputs: [{ name: '_addr', type: 'address' }],
        name: 'gauge_types',
        outputs: [{ name: '', type: 'int128' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { name: 'addr', type: 'address' },
            { name: 'gauge_type', type: 'int128' },
        ],
        name: 'add_gauge',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            { name: 'addr', type: 'address' },
            { name: 'gauge_type', type: 'int128' },
            { name: 'weight', type: 'uint256' },
        ],
        name: 'add_gauge',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    { inputs: [], name: 'checkpoint', outputs: [], stateMutability: 'nonpayable', type: 'function' },
    {
        inputs: [{ name: 'addr', type: 'address' }],
        name: 'checkpoint_gauge',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [{ name: 'addr', type: 'address' }],
        name: 'gauge_relative_weight',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { name: 'addr', type: 'address' },
            { name: 'time', type: 'uint256' },
        ],
        name: 'gauge_relative_weight',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ name: 'addr', type: 'address' }],
        name: 'gauge_relative_weight_write',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            { name: 'addr', type: 'address' },
            { name: 'time', type: 'uint256' },
        ],
        name: 'gauge_relative_weight_write',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [{ name: '_name', type: 'string' }],
        name: 'add_type',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            { name: '_name', type: 'string' },
            { name: 'weight', type: 'uint256' },
        ],
        name: 'add_type',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            { name: 'type_id', type: 'int128' },
            { name: 'weight', type: 'uint256' },
        ],
        name: 'change_type_weight',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            { name: 'addr', type: 'address' },
            { name: 'weight', type: 'uint256' },
        ],
        name: 'change_gauge_weight',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            { name: '_gauge_addr', type: 'address' },
            { name: '_user_weight', type: 'uint256' },
        ],
        name: 'vote_for_gauge_weights',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [{ name: 'addr', type: 'address' }],
        name: 'get_gauge_weight',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ name: 'type_id', type: 'int128' }],
        name: 'get_type_weight',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'get_total_weight',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ name: 'type_id', type: 'int128' }],
        name: 'get_weights_sum_per_type',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    { inputs: [], name: 'admin', outputs: [{ name: '', type: 'address' }], stateMutability: 'view', type: 'function' },
    {
        inputs: [],
        name: 'future_admin',
        outputs: [{ name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
    },
    { inputs: [], name: 'token', outputs: [{ name: '', type: 'address' }], stateMutability: 'view', type: 'function' },
    {
        inputs: [],
        name: 'voting_escrow',
        outputs: [{ name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'n_gauge_types',
        outputs: [{ name: '', type: 'int128' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'n_gauges',
        outputs: [{ name: '', type: 'int128' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ name: 'arg0', type: 'int128' }],
        name: 'gauge_type_names',
        outputs: [{ name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ name: 'arg0', type: 'uint256' }],
        name: 'gauges',
        outputs: [{ name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { name: 'arg0', type: 'address' },
            { name: 'arg1', type: 'address' },
        ],
        name: 'vote_user_slopes',
        outputs: [
            { name: 'slope', type: 'uint256' },
            { name: 'power', type: 'uint256' },
            { name: 'end', type: 'uint256' },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ name: 'arg0', type: 'address' }],
        name: 'vote_user_power',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { name: 'arg0', type: 'address' },
            { name: 'arg1', type: 'address' },
        ],
        name: 'last_user_vote',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { name: 'arg0', type: 'address' },
            { name: 'arg1', type: 'uint256' },
        ],
        name: 'points_weight',
        outputs: [
            { name: 'bias', type: 'uint256' },
            { name: 'slope', type: 'uint256' },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ name: 'arg0', type: 'address' }],
        name: 'time_weight',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { name: 'arg0', type: 'int128' },
            { name: 'arg1', type: 'uint256' },
        ],
        name: 'points_sum',
        outputs: [
            { name: 'bias', type: 'uint256' },
            { name: 'slope', type: 'uint256' },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ name: 'arg0', type: 'uint256' }],
        name: 'time_sum',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ name: 'arg0', type: 'uint256' }],
        name: 'points_total',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'time_total',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { name: 'arg0', type: 'int128' },
            { name: 'arg1', type: 'uint256' },
        ],
        name: 'points_type_weight',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ name: 'arg0', type: 'uint256' }],
        name: 'time_type_weight',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
];

const REWARD_POLICY_MAKER_ABI = [
    { name: 'SetAdmin', inputs: [{ name: 'admin', type: 'address', indexed: false }], anonymous: false, type: 'event' },
    {
        stateMutability: 'nonpayable',
        type: 'constructor',
        inputs: [{ name: '_epoch_length', type: 'uint256' }],
        outputs: [],
    },
    {
        stateMutability: 'view',
        type: 'function',
        name: 'epoch_at',
        inputs: [{ name: '_timestamp', type: 'uint256' }],
        outputs: [{ name: '', type: 'uint256' }],
    },
    {
        stateMutability: 'view',
        type: 'function',
        name: 'epoch_start_time',
        inputs: [{ name: '_epoch', type: 'uint256' }],
        outputs: [{ name: '', type: 'uint256' }],
    },
    {
        stateMutability: 'view',
        type: 'function',
        name: 'rate_at',
        inputs: [{ name: '_timestamp', type: 'uint256' }],
        outputs: [{ name: '', type: 'uint256' }],
    },
    {
        stateMutability: 'view',
        type: 'function',
        name: 'current_epoch',
        inputs: [],
        outputs: [{ name: '', type: 'uint256' }],
    },
    {
        stateMutability: 'view',
        type: 'function',
        name: 'future_epoch_time',
        inputs: [],
        outputs: [{ name: '', type: 'uint256' }],
    },
    {
        stateMutability: 'view',
        type: 'function',
        name: 'future_epoch_rate',
        inputs: [],
        outputs: [{ name: '', type: 'uint256' }],
    },
    {
        stateMutability: 'nonpayable',
        type: 'function',
        name: 'set_admin',
        inputs: [{ name: '_admin', type: 'address' }],
        outputs: [],
    },
    {
        stateMutability: 'nonpayable',
        type: 'function',
        name: 'set_rewards_at',
        inputs: [
            { name: '_epoch', type: 'uint256' },
            { name: '_reward', type: 'uint256' },
        ],
        outputs: [],
    },
    {
        stateMutability: 'nonpayable',
        type: 'function',
        name: 'set_rewards_starting_at',
        inputs: [
            { name: '_epoch', type: 'uint256' },
            { name: '_rewards', type: 'uint256[10]' },
        ],
        outputs: [],
    },
    { stateMutability: 'view', type: 'function', name: 'admin', inputs: [], outputs: [{ name: '', type: 'address' }] },
    {
        stateMutability: 'view',
        type: 'function',
        name: 'first_epoch_time',
        inputs: [],
        outputs: [{ name: '', type: 'uint256' }],
    },
    {
        stateMutability: 'view',
        type: 'function',
        name: 'epoch_length',
        inputs: [],
        outputs: [{ name: '', type: 'uint256' }],
    },
    {
        stateMutability: 'view',
        type: 'function',
        name: 'rewards',
        inputs: [{ name: 'arg0', type: 'uint256' }],
        outputs: [{ name: '', type: 'uint256' }],
    },
];

const REWARD_POLICY_MAKER_V2_ABI = [
    {
        "name": "SetAdmin",
        "inputs": [
            {
                "name": "admin",
                "type": "address",
                "indexed": false
            }
        ],
        "anonymous": false,
        "type": "event"
    },
    {
        "stateMutability": "nonpayable",
        "type": "constructor",
        "inputs": [
            {
                "name": "_epoch_length",
                "type": "uint256"
            },
            {
                "name": "_admin",
                "type": "address"
            }
        ],
        "outputs": []
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "epoch_at",
        "inputs": [
            {
                "name": "_timestamp",
                "type": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "epoch_start_time",
        "inputs": [
            {
                "name": "_epoch",
                "type": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "rate_at",
        "inputs": [
            {
                "name": "_timestamp",
                "type": "uint256"
            },
            {
                "name": "_token",
                "type": "address"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "current_epoch",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "future_epoch_time",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "future_epoch_rate",
        "inputs": [
            {
                "name": "_token",
                "type": "address"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ]
    },
    {
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "set_admin",
        "inputs": [
            {
                "name": "_admin",
                "type": "address"
            }
        ],
        "outputs": []
    },
    {
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "set_rewards_at",
        "inputs": [
            {
                "name": "_epoch",
                "type": "uint256"
            },
            {
                "name": "_token",
                "type": "address"
            },
            {
                "name": "_reward",
                "type": "uint256"
            }
        ],
        "outputs": []
    },
    {
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "set_rewards_starting_at",
        "inputs": [
            {
                "name": "_epoch",
                "type": "uint256"
            },
            {
                "name": "_token",
                "type": "address"
            },
            {
                "name": "_rewards",
                "type": "uint256[10]"
            }
        ],
        "outputs": []
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "admin",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "first_epoch_time",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "epoch_length",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "rewards",
        "inputs": [
            {
                "name": "arg0",
                "type": "address"
            },
            {
                "name": "arg1",
                "type": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ]
    }
];

const BACKSTOP_MASTERCHEF_ABI = [
    {
        inputs: [{ internalType: 'contract IERC20', name: '_hundred', type: 'address' }],
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'user', type: 'address' },
            { indexed: true, internalType: 'uint256', name: 'pid', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'shares', type: 'uint256' },
            { indexed: true, internalType: 'address', name: 'to', type: 'address' },
        ],
        name: 'Deposit',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'user', type: 'address' },
            { indexed: true, internalType: 'uint256', name: 'pid', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'shares', type: 'uint256' },
            { indexed: true, internalType: 'address', name: 'to', type: 'address' },
        ],
        name: 'EmergencyWithdraw',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'user', type: 'address' },
            { indexed: true, internalType: 'uint256', name: 'pid', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'shares', type: 'uint256' },
        ],
        name: 'Harvest',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [{ indexed: false, internalType: 'uint256', name: 'hundredPerSecond', type: 'uint256' }],
        name: 'LogHundredPerSecond',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'uint256', name: 'pid', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'allocPoint', type: 'uint256' },
            { indexed: true, internalType: 'contract IERC20', name: 'lpToken', type: 'address' },
            { indexed: true, internalType: 'contract IRewarder', name: 'rewarder', type: 'address' },
        ],
        name: 'LogPoolAddition',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'uint256', name: 'pid', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'allocPoint', type: 'uint256' },
            { indexed: true, internalType: 'contract IRewarder', name: 'rewarder', type: 'address' },
            { indexed: false, internalType: 'bool', name: 'overwrite', type: 'bool' },
        ],
        name: 'LogSetPool',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'uint256', name: 'pid', type: 'uint256' },
            { indexed: false, internalType: 'uint64', name: 'lastRewardTime', type: 'uint64' },
            { indexed: false, internalType: 'uint256', name: 'lpSupply', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'accHundredPerShare', type: 'uint256' },
        ],
        name: 'LogUpdatePool',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
            { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' },
        ],
        name: 'OwnershipTransferred',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'user', type: 'address' },
            { indexed: true, internalType: 'uint256', name: 'pid', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'shares', type: 'uint256' },
            { indexed: true, internalType: 'address', name: 'to', type: 'address' },
        ],
        name: 'Withdraw',
        type: 'event',
    },
    {
        inputs: [],
        name: 'Hundred',
        outputs: [{ internalType: 'contract IERC20', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'uint256', name: 'allocPoint', type: 'uint256' },
            { internalType: 'contract IBAMM', name: '_lpToken', type: 'address' },
            { internalType: 'contract IERC20', name: '_underlyingToken', type: 'address' },
            { internalType: 'contract IRewarder', name: '_rewarder', type: 'address' },
        ],
        name: 'add',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'address', name: '', type: 'address' }],
        name: 'addedTokens',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'uint256', name: 'pid', type: 'uint256' },
            { internalType: 'uint256', name: 'underlyingAmount', type: 'uint256' },
            { internalType: 'address', name: 'to', type: 'address' },
        ],
        name: 'deposit',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'uint256', name: 'pid', type: 'uint256' },
            { internalType: 'address', name: 'to', type: 'address' },
        ],
        name: 'emergencyWithdraw',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'uint256', name: 'pid', type: 'uint256' },
            { internalType: 'address', name: 'to', type: 'address' },
        ],
        name: 'harvest',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'hundredPerSecond',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        name: 'lpTokens',
        outputs: [{ internalType: 'contract IBAMM', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'uint256[]', name: 'pids', type: 'uint256[]' }],
        name: 'massUpdatePools',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'owner',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'uint256', name: '_pid', type: 'uint256' },
            { internalType: 'address', name: '_user', type: 'address' },
        ],
        name: 'pendingHundred',
        outputs: [{ internalType: 'uint256', name: 'pending', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        name: 'poolInfo',
        outputs: [
            { internalType: 'uint128', name: 'accHundredPerShare', type: 'uint128' },
            { internalType: 'uint64', name: 'lastRewardTime', type: 'uint64' },
            { internalType: 'uint64', name: 'allocPoint', type: 'uint64' },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'poolLength',
        outputs: [{ internalType: 'uint256', name: 'pools', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    { inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' },
    {
        inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        name: 'rewarders',
        outputs: [{ internalType: 'contract IRewarder', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'uint256', name: '_pid', type: 'uint256' },
            { internalType: 'uint256', name: '_allocPoint', type: 'uint256' },
            { internalType: 'contract IRewarder', name: '_rewarder', type: 'address' },
            { internalType: 'bool', name: 'overwrite', type: 'bool' },
        ],
        name: 'set',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'uint256', name: '_hundredPerSecond', type: 'uint256' }],
        name: 'setHundredPerSecond',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'totalAllocPoint',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
        name: 'transferOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        name: 'underlyingTokens',
        outputs: [{ internalType: 'contract IERC20', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'uint256', name: 'pid', type: 'uint256' }],
        name: 'updatePool',
        outputs: [
            {
                components: [
                    { internalType: 'uint128', name: 'accHundredPerShare', type: 'uint128' },
                    { internalType: 'uint64', name: 'lastRewardTime', type: 'uint64' },
                    { internalType: 'uint64', name: 'allocPoint', type: 'uint64' },
                ],
                internalType: 'struct BProtocolChef.PoolInfo',
                name: 'pool',
                type: 'tuple',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'uint256', name: '', type: 'uint256' },
            { internalType: 'address', name: '', type: 'address' },
        ],
        name: 'userInfo',
        outputs: [
            { internalType: 'uint256', name: 'shares', type: 'uint256' },
            { internalType: 'int256', name: 'rewardDebt', type: 'int256' },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'uint256', name: 'pid', type: 'uint256' },
            { internalType: 'uint256', name: 'shares', type: 'uint256' },
            { internalType: 'address', name: 'to', type: 'address' },
        ],
        name: 'withdraw',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'uint256', name: 'pid', type: 'uint256' },
            { internalType: 'uint256', name: 'shares', type: 'uint256' },
            { internalType: 'address', name: 'to', type: 'address' },
        ],
        name: 'withdrawAndHarvest',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    { stateMutability: 'payable', type: 'receive' },
];

const BACKSTOP_MASTERCHEF_ABI_V2 = [
    {
        inputs: [{ internalType: 'contract IERC20', name: '_hundred', type: 'address' }],
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'user', type: 'address' },
            { indexed: true, internalType: 'uint256', name: 'pid', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'shares', type: 'uint256' },
            { indexed: true, internalType: 'address', name: 'to', type: 'address' },
        ],
        name: 'Deposit',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'user', type: 'address' },
            { indexed: true, internalType: 'uint256', name: 'pid', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'shares', type: 'uint256' },
            { indexed: true, internalType: 'address', name: 'to', type: 'address' },
        ],
        name: 'EmergencyWithdraw',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'user', type: 'address' },
            { indexed: true, internalType: 'uint256', name: 'pid', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'shares', type: 'uint256' },
        ],
        name: 'Harvest',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [{ indexed: false, internalType: 'uint256', name: 'hundredPerSecond', type: 'uint256' }],
        name: 'LogHundredPerSecond',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'uint256', name: 'pid', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'allocPoint', type: 'uint256' },
            { indexed: true, internalType: 'contract IERC20', name: 'lpToken', type: 'address' },
            { indexed: true, internalType: 'contract IRewarder', name: 'rewarder', type: 'address' },
        ],
        name: 'LogPoolAddition',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'uint256', name: 'pid', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'allocPoint', type: 'uint256' },
            { indexed: true, internalType: 'contract IRewarder', name: 'rewarder', type: 'address' },
            { indexed: false, internalType: 'bool', name: 'overwrite', type: 'bool' },
        ],
        name: 'LogSetPool',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'uint256', name: 'pid', type: 'uint256' },
            { indexed: false, internalType: 'uint64', name: 'lastRewardTime', type: 'uint64' },
            { indexed: false, internalType: 'uint256', name: 'lpSupply', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'accHundredPerShare', type: 'uint256' },
        ],
        name: 'LogUpdatePool',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
            { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' },
        ],
        name: 'OwnershipTransferred',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'user', type: 'address' },
            { indexed: true, internalType: 'uint256', name: 'pid', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'shares', type: 'uint256' },
            { indexed: true, internalType: 'address', name: 'to', type: 'address' },
        ],
        name: 'Withdraw',
        type: 'event',
    },
    {
        inputs: [],
        name: 'Hundred',
        outputs: [{ internalType: 'contract IERC20', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'uint256', name: 'allocPoint', type: 'uint256' },
            { internalType: 'contract IBAMMv2', name: '_lpToken', type: 'address' },
            { internalType: 'contract IERC20', name: '_underlyingToken', type: 'address' },
            { internalType: 'contract IRewarder', name: '_rewarder', type: 'address' },
            { internalType: 'contract IERC20[]', name: '_collateralTokens', type: 'address[]' },
        ],
        name: 'add',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'address', name: '', type: 'address' }],
        name: 'addedTokens',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'uint256', name: '', type: 'uint256' },
            { internalType: 'uint256', name: '', type: 'uint256' },
        ],
        name: 'collateralTokens',
        outputs: [{ internalType: 'contract IERC20', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'uint256', name: 'pid', type: 'uint256' },
            { internalType: 'uint256', name: 'underlyingAmount', type: 'uint256' },
            { internalType: 'address', name: 'to', type: 'address' },
        ],
        name: 'deposit',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'uint256', name: 'pid', type: 'uint256' },
            { internalType: 'address', name: 'to', type: 'address' },
        ],
        name: 'emergencyWithdraw',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'uint256', name: 'pid', type: 'uint256' },
            { internalType: 'address', name: 'to', type: 'address' },
        ],
        name: 'harvest',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'hundredPerSecond',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        name: 'lpTokens',
        outputs: [{ internalType: 'contract IBAMMv2', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'uint256[]', name: 'pids', type: 'uint256[]' }],
        name: 'massUpdatePools',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'owner',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'uint256', name: '_pid', type: 'uint256' },
            { internalType: 'address', name: '_user', type: 'address' },
        ],
        name: 'pendingHundred',
        outputs: [{ internalType: 'uint256', name: 'pending', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        name: 'poolInfo',
        outputs: [
            { internalType: 'uint128', name: 'accHundredPerShare', type: 'uint128' },
            { internalType: 'uint64', name: 'lastRewardTime', type: 'uint64' },
            { internalType: 'uint64', name: 'allocPoint', type: 'uint64' },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'poolLength',
        outputs: [{ internalType: 'uint256', name: 'pools', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    { inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' },
    {
        inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        name: 'rewarders',
        outputs: [{ internalType: 'contract IRewarder', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'uint256', name: '_pid', type: 'uint256' },
            { internalType: 'uint256', name: '_allocPoint', type: 'uint256' },
            { internalType: 'contract IRewarder', name: '_rewarder', type: 'address' },
            { internalType: 'bool', name: 'overwriteRewarder', type: 'bool' },
            { internalType: 'contract IERC20[]', name: '_collateralTokens', type: 'address[]' },
            { internalType: 'bool', name: 'overwriteCollateralTokens', type: 'bool' },
        ],
        name: 'set',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'uint256', name: '_hundredPerSecond', type: 'uint256' }],
        name: 'setHundredPerSecond',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'totalAllocPoint',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
        name: 'transferOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        name: 'underlyingTokens',
        outputs: [{ internalType: 'contract IERC20', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'uint256', name: 'pid', type: 'uint256' }],
        name: 'updatePool',
        outputs: [
            {
                components: [
                    { internalType: 'uint128', name: 'accHundredPerShare', type: 'uint128' },
                    { internalType: 'uint64', name: 'lastRewardTime', type: 'uint64' },
                    { internalType: 'uint64', name: 'allocPoint', type: 'uint64' },
                ],
                internalType: 'struct BProtocolChefV2.PoolInfo',
                name: 'pool',
                type: 'tuple',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'uint256', name: '', type: 'uint256' },
            { internalType: 'address', name: '', type: 'address' },
        ],
        name: 'userInfo',
        outputs: [
            { internalType: 'uint256', name: 'shares', type: 'uint256' },
            { internalType: 'int256', name: 'rewardDebt', type: 'int256' },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'uint256', name: 'pid', type: 'uint256' },
            { internalType: 'uint256', name: 'shares', type: 'uint256' },
            { internalType: 'address', name: 'to', type: 'address' },
        ],
        name: 'withdraw',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'uint256', name: 'pid', type: 'uint256' },
            { internalType: 'uint256', name: 'shares', type: 'uint256' },
            { internalType: 'address', name: 'to', type: 'address' },
        ],
        name: 'withdrawAndHarvest',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    { stateMutability: 'payable', type: 'receive' },
];

const AIRDROP_ABI = [
    {
        inputs: [
            { internalType: 'bytes32', name: '_merkleRoot', type: 'bytes32' },
            { internalType: 'contract IERC20', name: '_claimToken', type: 'address' },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'to', type: 'address' },
            { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
        ],
        name: 'Claim',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
            { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' },
        ],
        name: 'OwnershipTransferred',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [{ indexed: false, internalType: 'address', name: 'account', type: 'address' }],
        name: 'Paused',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [{ indexed: false, internalType: 'address', name: 'account', type: 'address' }],
        name: 'Unpaused',
        type: 'event',
    },
    {
        inputs: [
            { internalType: 'address', name: 'to', type: 'address' },
            { internalType: 'uint256', name: 'amount', type: 'uint256' },
            { internalType: 'bytes32[]', name: 'proof', type: 'bytes32[]' },
        ],
        name: 'claim',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'claimToken',
        outputs: [{ internalType: 'contract IERC20', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'address', name: '', type: 'address' }],
        name: 'hasClaimed',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'merkleRoot',
        outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'owner',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
    },
    { inputs: [], name: 'pause', outputs: [], stateMutability: 'nonpayable', type: 'function' },
    {
        inputs: [],
        name: 'paused',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function',
    },
    { inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' },
    { inputs: [], name: 'sweepRemainingFunds', outputs: [], stateMutability: 'nonpayable', type: 'function' },
    {
        inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
        name: 'transferOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    { inputs: [], name: 'unPause', outputs: [], stateMutability: 'nonpayable', type: 'function' },
];

const AIRDROP_V2_ABI = [
    { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'uint256', name: 'dropId', type: 'uint256' },
            { indexed: true, internalType: 'address', name: 'to', type: 'address' },
            { indexed: false, internalType: 'address', name: 'token', type: 'address' },
            { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
        ],
        name: 'Claim',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [{ indexed: true, internalType: 'uint256', name: 'dropId', type: 'uint256' }],
        name: 'DropAdded',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [{ indexed: true, internalType: 'uint256', name: 'dropId', type: 'uint256' }],
        name: 'DropClosed',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
            { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' },
        ],
        name: 'OwnershipTransferred',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [{ indexed: false, internalType: 'address', name: 'account', type: 'address' }],
        name: 'Paused',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [{ indexed: false, internalType: 'address', name: 'account', type: 'address' }],
        name: 'Unpaused',
        type: 'event',
    },
    {
        inputs: [
            { internalType: 'bytes32', name: '_merkleRoot', type: 'bytes32' },
            { internalType: 'contract IERC20[]', name: '_tokens', type: 'address[]' },
        ],
        name: 'addDrop',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'address', name: '_to', type: 'address' },
            { internalType: 'uint256[]', name: '_amounts', type: 'uint256[]' },
            { internalType: 'bytes32[]', name: '_proof', type: 'bytes32[]' },
            { internalType: 'uint256', name: '_dropId', type: 'uint256' },
        ],
        name: 'claim',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'uint256', name: '_dropId', type: 'uint256' }],
        name: 'closeDrop',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        name: 'drops',
        outputs: [
            { internalType: 'bool', name: 'isClosed', type: 'bool' },
            { internalType: 'bytes32', name: 'merkleRoot', type: 'bytes32' },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'address', name: '_to', type: 'address' },
            { internalType: 'uint256', name: '_dropId', type: 'uint256' },
        ],
        name: 'hasClaimed',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                components: [
                    { internalType: 'address', name: 'target', type: 'address' },
                    { internalType: 'bytes', name: 'data', type: 'bytes' },
                ],
                internalType: 'struct ExternalMulticall.CallData[]',
                name: 'data',
                type: 'tuple[]',
            },
        ],
        name: 'multicall',
        outputs: [{ internalType: 'bytes[]', name: 'results', type: 'bytes[]' }],
        stateMutability: 'payable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'owner',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
    },
    { inputs: [], name: 'pause', outputs: [], stateMutability: 'nonpayable', type: 'function' },
    {
        inputs: [],
        name: 'paused',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function',
    },
    { inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' },
    {
        inputs: [{ internalType: 'contract IERC20', name: '_token', type: 'address' }],
        name: 'sweepUnclaimedFunds',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
        name: 'transferOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    { inputs: [], name: 'unPause', outputs: [], stateMutability: 'nonpayable', type: 'function' },
];

const VOTING_ESCROW_ABI: any[] = [
    {
        name: 'CommitOwnership',
        inputs: [{ type: 'address', name: 'admin', indexed: false }],
        anonymous: false,
        type: 'event',
    },
    {
        name: 'ApplyOwnership',
        inputs: [{ type: 'address', name: 'admin', indexed: false }],
        anonymous: false,
        type: 'event',
    },
    {
        name: 'Deposit',
        inputs: [
            { type: 'address', name: 'provider', indexed: true },
            { type: 'uint256', name: 'value', indexed: false },
            { type: 'uint256', name: 'locktime', indexed: true },
            { type: 'int128', name: 'type', indexed: false },
            { type: 'uint256', name: 'ts', indexed: false },
        ],
        anonymous: false,
        type: 'event',
    },
    {
        name: 'Withdraw',
        inputs: [
            { type: 'address', name: 'provider', indexed: true },
            { type: 'uint256', name: 'value', indexed: false },
            { type: 'uint256', name: 'ts', indexed: false },
        ],
        anonymous: false,
        type: 'event',
    },
    {
        name: 'Supply',
        inputs: [
            { type: 'uint256', name: 'prevSupply', indexed: false },
            { type: 'uint256', name: 'supply', indexed: false },
        ],
        anonymous: false,
        type: 'event',
    },
    {
        outputs: [],
        inputs: [
            { type: 'address', name: 'token_addr' },
            { type: 'string', name: '_name' },
            { type: 'string', name: '_symbol' },
            { type: 'string', name: '_version' },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
    {
        name: 'commit_transfer_ownership',
        outputs: [],
        inputs: [{ type: 'address', name: 'addr' }],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        name: 'apply_transfer_ownership',
        outputs: [],
        inputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        name: 'commit_smart_wallet_checker',
        outputs: [],
        inputs: [{ type: 'address', name: 'addr' }],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        name: 'apply_smart_wallet_checker',
        outputs: [],
        inputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        name: 'get_last_user_slope',
        outputs: [{ type: 'int128', name: '' }],
        inputs: [{ type: 'address', name: 'addr' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        name: 'user_point_history__ts',
        outputs: [{ type: 'uint256', name: '' }],
        inputs: [
            { type: 'address', name: '_addr' },
            { type: 'uint256', name: '_idx' },
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        name: 'locked__end',
        outputs: [{ type: 'uint256', name: '' }],
        inputs: [{ type: 'address', name: '_addr' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        name: 'checkpoint',
        outputs: [],
        inputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        name: 'deposit_for',
        outputs: [],
        inputs: [
            { type: 'address', name: '_addr' },
            { type: 'uint256', name: '_value' },
        ],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        name: 'create_lock',
        outputs: [],
        inputs: [
            { type: 'uint256', name: '_value' },
            { type: 'uint256', name: '_unlock_time' },
        ],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        name: 'increase_amount',
        outputs: [],
        inputs: [{ type: 'uint256', name: '_value' }],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        name: 'increase_unlock_time',
        outputs: [],
        inputs: [{ type: 'uint256', name: '_unlock_time' }],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        name: 'withdraw',
        outputs: [],
        inputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        name: 'balanceOf',
        outputs: [{ type: 'uint256', name: '' }],
        inputs: [{ type: 'address', name: 'addr' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        name: 'balanceOf',
        outputs: [{ type: 'uint256', name: '' }],
        inputs: [
            { type: 'address', name: 'addr' },
            { type: 'uint256', name: '_t' },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        name: 'balanceOfAt',
        outputs: [{ type: 'uint256', name: '' }],
        inputs: [
            { type: 'address', name: 'addr' },
            { type: 'uint256', name: '_block' },
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        name: 'totalSupply',
        outputs: [{ type: 'uint256', name: '' }],
        inputs: [],
        stateMutability: 'view',
        type: 'function',
    },
    {
        name: 'totalSupply',
        outputs: [{ type: 'uint256', name: '' }],
        inputs: [{ type: 'uint256', name: 't' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        name: 'totalSupplyAt',
        outputs: [{ type: 'uint256', name: '' }],
        inputs: [{ type: 'uint256', name: '_block' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        name: 'changeController',
        outputs: [],
        inputs: [{ type: 'address', name: '_newController' }],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        name: 'token',
        outputs: [{ type: 'address', name: '' }],
        inputs: [],
        stateMutability: 'view',
        type: 'function'
    },
    {
        name: 'supply',
        outputs: [{ type: 'uint256', name: '' }],
        inputs: [],
        stateMutability: 'view',
        type: 'function'
    },
    {
        name: 'locked',
        outputs: [
            { type: 'int128', name: 'amount' },
            { type: 'uint256', name: 'end' },
        ],
        inputs: [{ type: 'address', name: 'arg0' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        name: 'epoch',
        outputs: [{ type: 'uint256', name: '' }],
        inputs: [],
        stateMutability: 'view',
        type: 'function'
    },
    {
        name: 'point_history',
        outputs: [
            { type: 'int128', name: 'bias' },
            { type: 'int128', name: 'slope' },
            { type: 'uint256', name: 'ts' },
            { type: 'uint256', name: 'blk' },
        ],
        inputs: [{ type: 'uint256', name: 'arg0' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        name: 'user_point_history',
        outputs: [
            { type: 'int128', name: 'bias' },
            { type: 'int128', name: 'slope' },
            { type: 'uint256', name: 'ts' },
            { type: 'uint256', name: 'blk' },
        ],
        inputs: [
            { type: 'address', name: 'arg0' },
            { type: 'uint256', name: 'arg1' },
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        name: 'user_point_epoch',
        outputs: [{ type: 'uint256', name: '' }],
        inputs: [{ type: 'address', name: 'arg0' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        name: 'slope_changes',
        outputs: [{ type: 'int128', name: '' }],
        inputs: [{ type: 'uint256', name: 'arg0' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        name: 'controller',
        outputs: [{ type: 'address', name: '' }],
        inputs: [],
        stateMutability: 'view',
        type: 'function'
    },
    {
        name: 'transfersEnabled',
        outputs: [{ type: 'bool', name: '' }],
        inputs: [],
        stateMutability: 'view',
        type: 'function'
    },
    {
        name: 'name',
        outputs: [{ type: 'string', name: '' }],
        inputs: [],
        stateMutability: 'view',
        type: 'function'
    },
    {
        name: 'symbol',
        outputs: [{ type: 'string', name: '' }],
        inputs: [],
        stateMutability: 'view',
        type: 'function'
    },
    {
        name: 'version',
        outputs: [{ type: 'string', name: '' }],
        inputs: [],
        stateMutability: 'view',
        type: 'function'
    },
    {
        name: 'decimals',
        outputs: [{ type: 'uint256', name: '' }],
        inputs: [],
        stateMutability: 'view',
        type: 'function'
    },
    {
        name: 'future_smart_wallet_checker',
        outputs: [{ type: 'address', name: '' }],
        inputs: [],
        stateMutability: 'view',
        type: 'function'
    },
    {
        name: 'smart_wallet_checker',
        outputs: [{ type: 'address', name: '' }],
        inputs: [],
        stateMutability: 'view',
        type: 'function'
    },
    {
        name: 'admin',
        outputs: [{ type: 'address', name: '' }],
        inputs: [],
        stateMutability: 'view',
        type: 'function'
    },
    {
        name: 'future_admin',
        outputs: [{ type: 'address', name: '' }],
        inputs: [],
        stateMutability: 'view',
        type: 'function'
    },
];

const GAUGE_HELPER_ABI = [
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'previousOwner',
                type: 'address',
            },
            { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' },
        ],
        name: 'OwnershipTransferred',
        type: 'event',
    },
    { stateMutability: 'payable', type: 'fallback' },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'hToken',
                type: 'address',
            },
            { internalType: 'address', name: 'gauge', type: 'address' },
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
        ],
        name: 'depositEtherToGauge',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'address', name: 'underlying', type: 'address' },
            {
                internalType: 'address',
                name: 'hToken',
                type: 'address',
            },
            { internalType: 'address', name: 'bamm', type: 'address' },
            {
                internalType: 'address',
                name: 'gauge',
                type: 'address',
            },
            { internalType: 'uint256', name: 'underlyingAmount', type: 'uint256' },
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
        ],
        name: 'depositUnderlyingToBammGauge',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'address', name: 'underlying', type: 'address' },
            {
                internalType: 'address',
                name: 'hToken',
                type: 'address',
            },
            { internalType: 'address', name: 'gauge', type: 'address' },
            {
                internalType: 'uint256',
                name: 'underlyingAmount',
                type: 'uint256',
            },
            { internalType: 'address', name: 'to', type: 'address' },
        ],
        name: 'depositUnderlyingToGauge',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'address', name: 'minter', type: 'address' },
            {
                internalType: 'address',
                name: 'gaugeFrom',
                type: 'address',
            },
            { internalType: 'address', name: 'hToken', type: 'address' },
            {
                internalType: 'address',
                name: 'gaugeTo',
                type: 'address',
            },
            { internalType: 'uint256', name: 'gaugeAmount', type: 'uint256' },
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
        ],
        name: 'migrateGauge',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'owner',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'renounceOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'rescueETH',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'address', name: 'token', type: 'address' }],
        name: 'rescueErc20',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
        name: 'transferOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'address', name: 'minter', type: 'address' },
            {
                internalType: 'address',
                name: 'gauge',
                type: 'address',
            },
            { internalType: 'address', name: 'bamm', type: 'address' },
            {
                internalType: 'address',
                name: 'hToken',
                type: 'address',
            },
            { internalType: 'uint256', name: 'gaugeAmount', type: 'uint256' },
            {
                internalType: 'address payable',
                name: 'to',
                type: 'address',
            },
            { internalType: 'address', name: 'hETH', type: 'address' },
        ],
        name: 'withdrawFromBammGaugeToUnderlying',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'address', name: 'minter', type: 'address' },
            {
                internalType: 'address',
                name: 'gauge',
                type: 'address',
            },
            { internalType: 'address', name: 'hToken', type: 'address' },
            {
                internalType: 'uint256',
                name: 'gaugeAmount',
                type: 'uint256',
            },
            { internalType: 'address payable', name: 'to', type: 'address' },
            {
                internalType: 'bool',
                name: 'isCEther',
                type: 'bool',
            },
        ],
        name: 'withdrawFromGaugeToUnderlying',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    { stateMutability: 'payable', type: 'receive' },
];

export {
    COMPTROLLER_ABI,
    TOKEN_ABI,
    CETHER_ABI,
    CTOKEN_ABI,
    CTOKEN_V2_ABI,
    ORACLE_ABI,
    MKR_TOKEN_ABI,
    HUNDRED_ABI,
    COMPOUNT_LENS_ABI,
    UNITROLLER_ABI,
    BPRO_ABI,
    BPRO_ABI_V2,
    MINTER_ABI,
    MINTER_V2_ABI,
    GAUGE_V4_ABI,
    GAUGE_V5_ABI,
    GAUGE_CONTROLLER_ABI,
    BACKSTOP_MASTERCHEF_ABI,
    BACKSTOP_MASTERCHEF_ABI_V2,
    REWARD_POLICY_MAKER_ABI,
    REWARD_POLICY_MAKER_V2_ABI,
    AIRDROP_ABI,
    AIRDROP_V2_ABI,
    MAXIMILLION_ABI,
    VOTING_ESCROW_ABI,
    GAUGE_HELPER_ABI,
};
