import Logos from "./logos"

type NativeCurrency = {
    name: string,
    decimals: number,
    symbol: string
}

type NetworkParams = {
    chainId: string,
    rpcUrls: string[],
    chainName: string,
    nativeCurrency: NativeCurrency,
    blockExplorerUrls: string[]
}

export enum MasterChefVersion {
    v1,
    v2
}

type BackstopMasterChef = {
    address: string,
    version: MasterChefVersion,
    collaterals?: number
}

type Network = {
    chainId: number,
    network: string,
    logo: string,
    blocksPerYear: number,
    networkParams: NetworkParams,
    addLiquidity?: string,
    trade?: string,
    stakeLp?: string,
    nativeTokenMarketAddress: string,
    blockRpc?: string,
    unitrollerAddress: string,
    hundredAddress: string,
    compoundLensAddress: string,
    hundredLiquidityPoolAddress?: string,
    hndPoolPercent?: number,
    liquidity?: boolean, 
    multicallAddress?: string,
    backstopMasterChef?: BackstopMasterChef,
    minterAddress?: string,
    minterAddressLendly?: string,
    gaugeControllerAddress?: string,
    airdropMulticallAddress?: string,
    maximillion?: string;
    votingAddress?: string;
    lendly?: Lendly

}

export type LendlyData = {
    nativeTokenMarketAddress: string,
    unitrollerAddress: string,
    hundredAddress: string,
    gaugeControllerAddress?: string,
}

type Lendly = {
    [key: string]: LendlyData
}

type NetworkData = {
    [key:number]: Network
}

const NETWORKS: NetworkData = !process.env.REACT_APP_TEST_NETWORK ? {
    1 : {
        chainId: 1,
        network: "Ethereum Mainnet",
        logo: Logos["ETH"],
        blocksPerYear: 24*60*60/13.5*365,
        networkParams: {
            chainId: "0x1",
            chainName: "Ethereum",
            rpcUrls:["https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"],
            nativeCurrency: {
                name: "ETH",
                decimals: 18,
                symbol: "ETH"
            },
            blockExplorerUrls: ["https://etherscan.io"]
        }, 
        trade: "https://app.balancer.fi/#/trade",
        addLiquidity: "https://app.balancer.fi/#/pool/0x56b2811bf75bb258d2234af4f43b479bb55c3b46000200000000000000000091",
        nativeTokenMarketAddress: "0xfcd8570ad81e6c77b8d252bebeba62ed980bd64d",
        unitrollerAddress: "0x0f390559f258eb8591c8e31cf0905e97cf36ace2",
        hundredAddress: "0x10010078a54396f62c96df8532dc2b4847d47ed3",
        compoundLensAddress: "0xd513d22422a3062Bd342Ae374b4b9c20E0a9a074",
        maximillion: '0x97F3763F8C0bE87Cab0e99Ee4b7806acA772FeDA',
    },
    42161: {
        chainId: 42161,
        network: "Arbitrum One", 
        logo: Logos["ARBITRUM"],
        blocksPerYear: 24*60*60/13.5*365,
        networkParams: {
            chainId: "0xa4b1",
            chainName: "Arbitrum",
            rpcUrls: ["https://arb1.arbitrum.io/rpc"],
            nativeCurrency: {
                name: "AETH",
                decimals: 18,
                symbol: "AETH"
            },
            blockExplorerUrls: ["https://arbiscan.io"]
        },
        addLiquidity: "https://app.dodoex.io/liquidity?network=arbitrum&poolAddress=0x65e17c52128396443d4a9a61eacf0970f05f8a20",
        trade: "https://app.dodoex.io/exchange/WETH-HND?network=arbitrum",
        stakeLp:"https://app.dodoex.io/mining?network=arbitrum&mining=0x52c7b4aa3f67d3533aaf1153430758c702a3594b",
        nativeTokenMarketAddress: "0x8e15a22853a0a60a0fbb0d875055a8e66cff0235",
        blockRpc: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
        unitrollerAddress: "0x0f390559f258eb8591c8e31cf0905e97cf36ace2",
        hundredAddress: "0x10010078a54396f62c96df8532dc2b4847d47ed3",
        compoundLensAddress: "0xd513d22422a3062Bd342Ae374b4b9c20E0a9a074",
        hundredLiquidityPoolAddress: "0x65E17c52128396443d4A9A61EaCf0970F05F8a20",
        backstopMasterChef: {address: "0x89db3B59381bC06FE9BF74532Afd777e5F78Ef02", version: MasterChefVersion.v1},
        gaugeControllerAddress: "0xb4BAfc3d60662De362c0cB0f5e2DE76603Ea77D7",
        maximillion: '0x26596af66A10Cb6c6fe890273eD37980D50f2448',
        votingAddress: '0xBa57440fA35Fdb671E58F6F56c1A4447aB1f6C2B',
        minterAddress: '0xc3CC9369fcB8491DaD4FA64cE1Fbd3DD2d70034f'
},
    250: {
        chainId: 250,
        network: "Fantom Opera", 
        logo: Logos["FTM"],
        blocksPerYear: 24*60*60*365,
        networkParams: {
            chainId: "0xfa",
            chainName: "Fantom Opera",
            rpcUrls: ["https://rpc.ftm.tools/"],
            nativeCurrency: {
                name: "FTM",
                decimals: 18,
                symbol: "FTM"
            },
            blockExplorerUrls: ["https://ftmscan.com"]
        },
        nativeTokenMarketAddress: "0xfcd8570ad81e6c77b8d252bebeba62ed980bd64d",
        addLiquidity: "https://app.beets.fi/#/pool/0xd57cda2caebb9b64bb88905c4de0f0da217a77d7000100000000000000000073",
        stakeLp: "https://app.beets.fi/#/pool/0xd57cda2caebb9b64bb88905c4de0f0da217a77d7000100000000000000000073",
        trade: "https://app.beets.fi/#/trade",
        unitrollerAddress: "0x0f390559f258eb8591c8e31cf0905e97cf36ace2",
        hundredAddress: "0x10010078a54396f62c96df8532dc2b4847d47ed3",
        compoundLensAddress: "0xd513d22422a3062Bd342Ae374b4b9c20E0a9a074",
        hundredLiquidityPoolAddress: "0x20dd72ed959b6147912c2e529f0a0c651c33c9ce",
        gaugeControllerAddress: "0xb1c4426C86082D91a6c097fC588E5D5d8dD1f5a8",
        hndPoolPercent: 0.6,
        liquidity: true,
        backstopMasterChef: {address: "0xf347b0e405249c78d8b261b7c493449b9275b946", version: MasterChefVersion.v2, collaterals: 5},
        airdropMulticallAddress: "0x96a0eEa3a9cff74764b73A891c3b36a4F6B81181",
        maximillion: '0x9226f7304b547891eE257d64Cfb8F8c2a42b42BB',
        votingAddress: '0x376020c5B0ba3Fd603d7722381fAA06DA8078d8a',
        minterAddress: '0x42B458056f887Fd665ed6f160A59Afe932e1F559',
        minterAddressLendly: '0x14Cb5E017a3F10B9f6254fF24b87e2297dC8b8b3',
        lendly: {
            "HND":{
                nativeTokenMarketAddress: "",
                unitrollerAddress: "0xeea62eD232fF4CCB6425d41AFB1b0B41d34F3114",
                hundredAddress: "0x10010078a54396f62c96df8532dc2b4847d47ed3",
                gaugeControllerAddress: "0x788ac705a7b67562cdd1913b67ee091785fa4f68",
            },
            "WEVE":{
                nativeTokenMarketAddress: "",
                unitrollerAddress: "0x612dcaaf5b20774f2ebbed49bc82442d642b7082",
                hundredAddress: "0x10010078a54396f62c96df8532dc2b4847d47ed3"
            }
        }
    },
    1666600000:
    {
        chainId: 1666600000,
        network: "Harmony",
        logo: Logos["ONE"],
        blocksPerYear: 15778476,
        networkParams : {
            chainId: "0x63564c40",
            chainName: "Harmony Mainnet",
            rpcUrls: ["https://api.harmony.one"],
            nativeCurrency: {
                name: "ONE",
                decimals: 18,
                symbol: "ONE"
            },
            blockExplorerUrls: ["https://explorer.harmony.one"]
        },
        nativeTokenMarketAddress: "0xbb93c7f378b9b531216f9ad7b5748be189a55807",
        unitrollerAddress: "0x0f390559f258eb8591c8e31cf0905e97cf36ace2",
        hundredAddress: "0x10010078a54396f62c96df8532dc2b4847d47ed3",
        compoundLensAddress: "0xd513d22422a3062Bd342Ae374b4b9c20E0a9a074",
        gaugeControllerAddress: "0xa8cD5D59827514BCF343EC19F531ce1788Ea48f8",
        trade: "https://app.sushi.com/swap?inputCurrency=0x10010078a54396f62c96df8532dc2b4847d47ed3",
        addLiquidity: "https://app.sushi.com/add/0x10010078a54396f62c96df8532dc2b4847d47ed3/ETH",
        maximillion: '0x2c7a9d9919f042C4C120199c69e126124d09BE7c',
        votingAddress: '0xE4e43864ea18d5E5211352a4B810383460aB7fcC',
        minterAddress: '0xb4300e088a3AE4e624EE5C71Bc1822F68BB5f2bc'

    },
    1285:
    {
        chainId: 1285,
        network: "Moonriver",
        logo: Logos["MOVR"],
        networkParams : {
            chainId: "0x505",
            chainName: "Moonriver",
            rpcUrls: ["https://rpc.moonriver.moonbeam.network"],
            nativeCurrency: {
                name: "MOVR",
                decimals: 18,
                symbol: "MOVR"
            },
            blockExplorerUrls: ["https://moonriver.moonscan.io/"],
        },
        blocksPerYear: 2465386,
        nativeTokenMarketAddress: "0xd6fcbccfc375c2c61d7ee2952b329dceba2d4e10",
        unitrollerAddress: "0x7d166777bd19a916c2edf5f1fc1ec138b37e7391",
        hundredAddress: "0x10010078a54396f62c96df8532dc2b4847d47ed3",
        multicallAddress:"0x9fdd7e3e2df5998c7866cd2471d7d30e04496dfa",
        compoundLensAddress: "0xd513d22422a3062Bd342Ae374b4b9c20E0a9a074",
        gaugeControllerAddress: "0xca78ca5C3Da9a5a4C960C1757456E99d9F1bc76d",
        trade: "https://app.solarbeam.io/exchange/swap?inputCurrency=0x10010078a54396f62c96df8532dc2b4847d47ed3",
        addLiquidity: "https://app.solarbeam.io/exchange/add/0x10010078a54396f62c96df8532dc2b4847d47ed3/ETH",
        maximillion: '0xbd193db8a909cAC57Cdb981Ea81B5dc270287F19',
        votingAddress: '0x243E33aa7f6787154a8E59d3C27a66db3F8818ee',
        minterAddress: '0x08110737CB8276B155aB18533dacF7d27e2357c8'

    },
    100: {
        chainId: 100,
        network: "Gnosis Chain", 
        logo: Logos["GNOSIS"],
        blocksPerYear: 6307200,
        networkParams: {
            chainId: "0x64",
            chainName: "Gnosis Chain",
            rpcUrls: ["https://rpc.xdaichain.com/"],
            nativeCurrency: {
                name: "xDAI",
                decimals: 18,
                symbol: "xDAI"
            },
            blockExplorerUrls: ["https://blockscout.com/xdai/mainnet/"],
        },
        nativeTokenMarketAddress: "0x090a00a2de0ea83def700b5e216f87a5d4f394fe",
        unitrollerAddress: "0x0F390559F258eB8591C8e31Cf0905E97cf36ACE2",
        hundredAddress: "0x10010078a54396F62c96dF8532dc2B4847d47ED3",
        compoundLensAddress: "0xd513d22422a3062Bd342Ae374b4b9c20E0a9a074",
        gaugeControllerAddress: "0x2105dE165eD364919703186905B9BB5B8015F13c",
        votingAddress: '0xf64E1a3eF0d2F5659dC4c10983e595B797C6ecA4',
        minterAddress: '0x818b3dff96d01590Caf72965e6F50b24331EfdEC',
        maximillion: "0x42b458056f887fd665ed6f160a59afe932e1f559"
    },
    10:
    {
        chainId: 10,
        network: "Optimism",
        logo: Logos["OPT"],
        blocksPerYear: 2336000,
        networkParams: {
            chainId: "0xa",
            chainName: "Optimism",
            rpcUrls: ["https://mainnet.optimism.io"],
            nativeCurrency: {
                name: "ETH",
                decimals: 18,
                symbol: "ETH"
            },
            blockExplorerUrls: ["https://optimistic.etherscan.io"],
        },
        nativeTokenMarketAddress: "0xe8f12f5492ec28609d2932519456b7436d6c93bd",
        unitrollerAddress: "0x0f390559f258eb8591c8e31cf0905e97cf36ace2",
        hundredAddress: "0x10010078a54396f62c96df8532dc2b4847d47ed3",
        compoundLensAddress: "0xd513d22422a3062Bd342Ae374b4b9c20E0a9a074",
        maximillion: "0xedba32185baf7fef9a26ca567bc4a6cbe426e499",
        votingAddress: "0x1F8e8472e124F58b7F0D2598EaE3F4f482780b09",
        minterAddress: "0x4adF575DBe0e6F1c5909AE9c7119927b4FaabbBd"
    },
    // "0x1251":
    // {
    //     chainId: "0x1251",
    //     network: "IoTeX",
    //     symbol: "IOTX",
    //     rpcUrls: ["https://babel-api.iotex.io"],
    //     blockExplorerUrls: ["https://iotexscan.io/"],
    //     logo: Logos["IOTX"],
    //     name: "IOTX",
    //     blocksPerYear: 6307200,
    //     nativeTokenMarketAddress: "0x243e33aa7f6787154a8e59d3c27a66db3f8818ee",
    //     unitrollerAddress: "0x8c6139ff1e9d7c1e32bdafd79948d0895ba0a831",
    //     hundredAddress: "0xe0a6d4684aabbe8c08a57b3a4b54855c08165c1d",
    //     compoundLensAddress: "0xd513d22422a3062Bd342Ae374b4b9c20E0a9a074",
    // },
    // "0x38": {
    //     chainId: "0x38",
    //     network: "Binance Smart Chain", 
    //     symbol: "BNB",
    //     rpcUrls: ["https://bsc-dataseed1.binance.org/"],
    //     blockExplorelUrls: ["https://bscscan.com/"],
    //     logo: Logos["BNB"], 
    //     name: "BNB", 
    //     nativeTokenMarketAddress: "0xfcd8570ad81e6c77b8d252bebeba62ed980bd64d",
    //     UNITROLLER_ADDRESS: "0x0F390559F258eB8591C8e31Cf0905E97cf36ACE2", 
    //     HUNDRED_ADDRESS: "0x100100745f72c0b072C55E7fe0750Ba212E380A7",
    //     COMPOUND_LENS_ADDRESS: "0xd513d22422a3062Bd342Ae374b4b9c20E0a9a074",
    // },
    // "0x80": {
    //     chainId: "0x80",
    //     network: "Heco Mainet", 
    //     symbol: "HT",
    //     rpcUrls: ["https://http-mainnet-node.huobichain.com"],
    //     blockExplorelUrls: ["https://hecoinfo.com"],
    //     logo: Logos["HT"], 
    //     name: "Heco", 
    //     nativeTokenMarketAddress: "0xfcd8570ad81e6c77b8d252bebeba62ed980bd64d",
    //     UNITROLLER_ADDRESS: "0x0F390559F258eB8591C8e31Cf0905E97cf36ACE2",
    //     HUNDRED_ADDRESS: "0x100100745f72c0b072C55E7fe0750Ba212E380A7",
    //     COMPOUND_LENS_ADDRESS: "0xd513d22422a3062Bd342Ae374b4b9c20E0a9a074",
    // },  
    // "0x89": {
    //     chainId: "0x89",
    //     network: "Polygon",
    //     symbol: "MATIC",
    //     rpcUrls:["https://rpc-mainnet.matic.network",
    //              "https://rpc-mainnet.maticvigil.com",
    //              "https://rpc-mainnet.matic.quiknode.pro",
    //              "https://matic-mainnet.chainstacklabs.com",
    //              "https://matic-mainnet-full-rpc.bwarelabs.com",
    //              "https://matic-mainnet-archive-rpc.bwarelabs.com"],
    //     blockExplorelUrls: ["https://explorer.matic.network", "https://explorer-mainnet.maticvigil.com/"],
    //     logo: Logos["MATIC"],
    //     name: "Matic",
    //     nativeTokenMarketAddress: "0xebd7f3349aba8bb15b897e03d6c1a4ba95b55e31",
    //     UNITROLLER_ADDRESS: "0xEdBA32185BAF7fEf9A26ca567bC4A6cbe426e499",
    //     HUNDRED_ADDRESS: "0xfCD8570AD81e6c77b8D252bEbEBA62ed980BD64D",
    //     COMPOUND_LENS_ADDRESS: "0xd513d22422a3062Bd342Ae374b4b9c20E0a9a074",
    // }       
} : {
    42:
    {
        chainId: 42,
        network: "KOVAN Test Network",
        logo: Logos["ETH"],
        blocksPerYear: 2336000,
        networkParams: {
            chainId: "0x2a",
            chainName: "Kovan",
            rpcUrls: ["https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"],
            nativeCurrency: {
                name: "ETH",
                decimals: 18,
                symbol: "ETH"
            },
            blockExplorerUrls: ["https://kovan.etherscan.io"]
        },
        nativeTokenMarketAddress: "0xfcd8570ad81e6c77b8d252bebeba62ed980bd64d",
        unitrollerAddress: "0x0f390559f258eb8591c8e31cf0905e97cf36ace2",
        hundredAddress: "0x10010054c81c8c01951E6A631dD228bB02d8D1e5",
        compoundLensAddress: "0xd513d22422a3062Bd342Ae374b4b9c20E0a9a074",
        minterAddress: "0x4646F704ceEBB522126CFD024506C509A5D19694",
        gaugeControllerAddress: "0x2E08596F46f51d1E88207790270aF2BD94602762",
        votingAddress: "0xbeD8EFa1973F6E1fB3515bf94aa760174431b3F8"
    },
    1666700000:
    {
        chainId: 1666700000,
        network: "Harmony Testnet",
        logo: Logos["ONE"],
        blocksPerYear: 15017140,
        networkParams: {
            chainId: "0x6357d2e0",
            chainName: "Harmony Testnet",
            rpcUrls: ["https://api.s0.b.hmny.io"],
            nativeCurrency: {
                name: "ONE",
                decimals: 18,
                symbol: "ONE"
            },
            blockExplorerUrls: ["https://explorer.testnet.harmony.one/"]
        },
        nativeTokenMarketAddress: "0xfCD8570AD81e6c77b8D252bEbEBA62ed980BD64D",
        unitrollerAddress: "0x0F390559F258eB8591C8e31Cf0905E97cf36ACE2",
        hundredAddress: "0x10010078a54396F62c96dF8532dc2B4847d47ED3",
        compoundLensAddress: "0xd513d22422a3062Bd342Ae374b4b9c20E0a9a074",
        multicallAddress: "0xd078799c53396616844e2fa97f0dd2b4c145a685"
    },
    69:
    {
        chainId: 69,
        network: "Optimism Kovan",
        logo: Logos["OPT"],
        blocksPerYear: 15017140,
        networkParams: {
            chainId: "0x45",
            chainName: "Optimism Kovan",
            rpcUrls: ["https://kovan.optimism.io"],
            nativeCurrency: {
                name: "ETH",
                decimals: 18,
                symbol: "ETH"
            },
            blockExplorerUrls: ["https://kovan-optimistic.etherscan.io"]
        },
        nativeTokenMarketAddress: "0xfcd8570ad81e6c77b8d252bebeba62ed980bd64d",
        unitrollerAddress: "0x0f390559f258eb8591c8e31cf0905e97cf36ace2",
        hundredAddress: "0x10010078a54396F62c96dF8532dc2B4847d47ED3",
        compoundLensAddress: "0xd513d22422a3062Bd342Ae374b4b9c20E0a9a074",
        multicallAddress: "0x19ead25619352ea106f25a1c870c0a4df65faa75"
    },
    4690:
    {
        chainId: 4690,
        network: "IoTeX Testnet",
        logo: Logos["IOTX"],
        blocksPerYear: 6307200,
        networkParams: {
            chainId: "0x1252",
            chainName: "IoTeX Testnet",
            rpcUrls: ["https://babel-api.testnet.iotex.io"],
            nativeCurrency: {
                name: "IOTX-T",
                decimals: 18,
                symbol: "IOTX-T"
            },
            blockExplorerUrls: ["https://testnet.iotexscan.io/"],
        },
        nativeTokenMarketAddress: "",
        unitrollerAddress: "0x8c6139ff1e9d7c1e32bdafd79948d0895ba0a831",
        hundredAddress: "0x10010078a54396F62c96dF8532dc2B4847d47ED3",
        compoundLensAddress: "0xd513d22422a3062Bd342Ae374b4b9c20E0a9a074",
        multicallAddress: "0x25bb701a0ce238faecaec56b437460a372d7f139"
    }
}

export default NETWORKS 
export type { Network }
