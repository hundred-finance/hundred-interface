import Logos from "./logos"

type Network = {
    chainId: string,
    network: string,
    symbol: string,
    rpcUrls?: string[],
    blockExplorerUrls?: string[],
    logo: string,
    name: string,
    blocksPerYear: number,
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
    backstop?:[Backstop]    
}

type Backstop = {
    symbol: string,
    address: string,
    hToken: string,
}

type NetworkData = {
    [key:string]: Network
}

const NETWORKS: NetworkData = !process.env.REACT_APP_TEST_NETWORK ? {
    "0x1" : {
        chainId: "0x1",
        network: "Ethereum Mainnet",
        symbol: "ETH",
        logo: Logos["ETH"],
        name: "Ethereum",
        blocksPerYear: 24*60*60/13.5*365,
        trade: "https://app.balancer.fi/#/trade",
        addLiquidity: "https://app.balancer.fi/#/pool/0x56b2811bf75bb258d2234af4f43b479bb55c3b46000200000000000000000091",
        nativeTokenMarketAddress: "0xfcd8570ad81e6c77b8d252bebeba62ed980bd64d",
        unitrollerAddress: "0x0f390559f258eb8591c8e31cf0905e97cf36ace2",
        hundredAddress: "0x10010078a54396f62c96df8532dc2b4847d47ed3",
        compoundLensAddress: "0xd513d22422a3062Bd342Ae374b4b9c20E0a9a074"
    },
    "0xa4b1": {
        chainId: "0xa4b1",
        network: "Arbitrum One", 
        symbol: "AETH",
        rpcUrls: ["https://arb1.arbitrum.io/rpc"],
        blockExplorerUrls: ["https://arbiscan.io"],
        logo: Logos["ARBITRUM"],
        name: "AETH",
        blocksPerYear: 24*60*60/13.5*365,
        addLiquidity: "https://app.dodoex.io/pool/list?network=arbitrum",
        trade: "https://app.dodoex.io/exchange/WETH-HND?network=arbitrum",
        stakeLp:"https://app.dodoex.io/mining?network=arbitrum",
        nativeTokenMarketAddress: "0x8e15a22853a0a60a0fbb0d875055a8e66cff0235",
        blockRpc: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
        unitrollerAddress: "0x0f390559f258eb8591c8e31cf0905e97cf36ace2",
        hundredAddress: "0x10010078a54396f62c96df8532dc2b4847d47ed3",
        compoundLensAddress: "0xd513d22422a3062Bd342Ae374b4b9c20E0a9a074",
        hundredLiquidityPoolAddress: "0x65E17c52128396443d4A9A61EaCf0970F05F8a20",
        backstop:[
            {symbol: "USDT", address: "0x24099000AE45558Ce4D049ad46DDaaf71429b168", hToken: "0x607312a5C671D0C511998171e634DE32156e69d0"}
        ]
    },
    "0xfa": {
        chainId: "0xfa",
        network: "Fantom Opera", 
        symbol: "FTM",
        rpcUrls: ["https://rpc.ftm.tools/"],
        blockExplorerUrls: ["https://ftmscan.com/"],
        logo: Logos["FTM"],
        name: "FTM",
        blocksPerYear: 24*60*60*365,
        nativeTokenMarketAddress: "0xfcd8570ad81e6c77b8d252bebeba62ed980bd64d",
        addLiquidity: "https://app.beets.fi/#/pool/0xd57cda2caebb9b64bb88905c4de0f0da217a77d7000100000000000000000073",
        stakeLp: "https://app.beets.fi/#/pool/0xd57cda2caebb9b64bb88905c4de0f0da217a77d7000100000000000000000073",
        trade: "https://app.beets.fi/#/trade",
        unitrollerAddress: "0x0f390559f258eb8591c8e31cf0905e97cf36ace2",
        hundredAddress: "0x10010078a54396f62c96df8532dc2b4847d47ed3",
        compoundLensAddress: "0xd513d22422a3062Bd342Ae374b4b9c20E0a9a074",
        hundredLiquidityPoolAddress: "0x20dd72ed959b6147912c2e529f0a0c651c33c9ce",
        hndPoolPercent: 0.6,
        liquidity: true
    }
    // "0x64": {
    //     chainId: "0x64",
    //     network: "xDai", 
    //     symbol: "xDAI",
    //     rpcUrls: ["https://dai.poa.network"],
    //     blockExplorelUrls: ["https://blockscout.com/poa/xdai"],
    //     logo: Logos["XDAI"],
    //     name: "xDai",
    //     nativeTokenMarketAddress: "0x090a00a2de0ea83def700b5e216f87a5d4f394fe",
    //     UNITROLLER_ADDRESS: "0x0F390559F258eB8591C8e31Cf0905E97cf36ACE2",
    //     HUNDRED_ADDRESS: "0x100100745f72c0b072C55E7fe0750Ba212E380A7",
    //     COMPOUND_LENS_ADDRESS: "0xd513d22422a3062Bd342Ae374b4b9c20E0a9a074",
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
    "0x2a":
    {
        chainId: "0x2a",
        network: "KOVAN Test Network",
        symbol: "ETH",
        rpcUrls: ["https://kovan.infura.io/v3/undefined"],
        blockExplorerUrls: ["https://kovan.etherscan.io"],
        logo: Logos["ETH"],
        name: "ETH",
        blocksPerYear: 2336000	,
        nativeTokenMarketAddress: "0xfcd8570ad81e6c77b8d252bebeba62ed980bd64d",
        unitrollerAddress: "0x0f390559f258eb8591c8e31cf0905e97cf36ace2",
        hundredAddress: "0x10010054c81c8c01951E6A631dD228bB02d8D1e5",
        compoundLensAddress: "0xd513d22422a3062Bd342Ae374b4b9c20E0a9a074",
    },
    "0x6357d2e0":
    {
        chainId: "0x6357d2e0",
        network: "Harmony Testnet Shard 0",
        symbol: "ETH",
        rpcUrls: ["https://api.s0.b.hmny.io"],
        blockExplorerUrls: ["https://explorer.testnet.harmony.one/"],
        logo: Logos["ONE"],
        name: "ONE",
        blocksPerYear: 15017140,
        nativeTokenMarketAddress: "0xfCD8570AD81e6c77b8D252bEbEBA62ed980BD64D",
        unitrollerAddress: "0x0F390559F258eB8591C8e31Cf0905E97cf36ACE2",
        hundredAddress: "0x10010078a54396F62c96dF8532dc2B4847d47ED3",
        compoundLensAddress: "0xd513d22422a3062Bd342Ae374b4b9c20E0a9a074",
        multicallAddress: "0xd078799c53396616844e2fa97f0dd2b4c145a685"
    },
    "0x45":
    {
        chainId: "0x45",
        network: "Optimism Kovan",
        symbol: "ETH",
        rpcUrls: ["https://kovan.optimism.io"],
        blockExplorerUrls: ["https://kovan-optimistic.etherscan.io"],
        logo: Logos["OPT"],
        name: "OPT",
        blocksPerYear: 15017140,
        nativeTokenMarketAddress: "0xfcd8570ad81e6c77b8d252bebeba62ed980bd64d",
        unitrollerAddress: "0x0f390559f258eb8591c8e31cf0905e97cf36ace2",
        hundredAddress: "0x10010078a54396F62c96dF8532dc2B4847d47ED3",
        compoundLensAddress: "0xd513d22422a3062Bd342Ae374b4b9c20E0a9a074",
        multicallAddress: "0x19ead25619352ea106f25a1c870c0a4df65faa75"
    },
    "0x1252":
    {
        chainId: "0x1252",
        network: "IoTeX Testnet",
        symbol: "IOTX",
        rpcUrls: ["https://babel-api.testnet.iotex.io"],
        blockExplorerUrls: ["https://testnet.iotexscan.io/"],
        logo: Logos["IOTX"],
        name: "IOTX-T",
        blocksPerYear: 6307200,
        nativeTokenMarketAddress: "",
        unitrollerAddress: "0x8c6139ff1e9d7c1e32bdafd79948d0895ba0a831",
        hundredAddress: "0x10010078a54396F62c96dF8532dc2B4847d47ED3",
        compoundLensAddress: "0xd513d22422a3062Bd342Ae374b4b9c20E0a9a074",
        multicallAddress: "0x25bb701a0ce238faecaec56b437460a372d7f139"
    }
}

export { NETWORKS }
export type { Network }
