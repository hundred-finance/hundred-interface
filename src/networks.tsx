import Logos from "./logos"

type Network = {
    chainId: string,
    network: string,
    symbol: string,
    rpcUrls?: string[],
    blockExplorelUrls?: string[],
    logo: string,
    name: string,
    token: string,
    UNITROLLER_ADDRESS: string,
    HUNDRED_ADDRESS: string,
    COMPOUND_LENS_ADDRESS: string
}

type NetworkData = {
    [key:string]: Network
}

const NETWORKS: NetworkData = {
    "0x1" : {
        chainId: "0x1",
        network: "Ethereum Mainnet",
        symbol: "ETH",
        logo: Logos["ETH"],
        name: "Ethereum",
        token: "0xfcd8570ad81e6c77b8d252bebeba62ed980bd64d",
        UNITROLLER_ADDRESS: "0x0f390559f258eb8591c8e31cf0905e97cf36ace2",
        HUNDRED_ADDRESS: "0x10010054c81c8c01951e6a631dd228bb02d8d1e5",
        COMPOUND_LENS_ADDRESS: "0xd513d22422a3062Bd342Ae374b4b9c20E0a9a074"
    },
    "0x2a":
    {
        chainId: "0x2a",
        network: "KOVAN Test Network",
        symbol: "ETH",
        rpcUrls: ["https://kovan.infura.io/v3/undefined"],
        blockExplorelUrls: ["https://kovan.etherscan.io"],
        logo: Logos["ETH"],
        name: "ETH",
        token: "0xfcd8570ad81e6c77b8d252bebeba62ed980bd64d",
        UNITROLLER_ADDRESS: "0x0f390559f258eb8591c8e31cf0905e97cf36ace2",
        HUNDRED_ADDRESS: "0x100100745f72c0b072C55E7fe0750Ba212E380A7",
        COMPOUND_LENS_ADDRESS: "0xd513d22422a3062Bd342Ae374b4b9c20E0a9a074",
    },
    "0x64": {
        chainId: "0x64",
        network: "xDai", 
        symbol: "xDAI",
        rpcUrls: ["https://dai.poa.network"],
        blockExplorelUrls: ["https://blockscout.com/poa/xdai"],
        logo: Logos["XDAI"],
        name: "xDai",
        token: "0x090a00a2de0ea83def700b5e216f87a5d4f394fe",
        UNITROLLER_ADDRESS: "0x0F390559F258eB8591C8e31Cf0905E97cf36ACE2",
        HUNDRED_ADDRESS: "0x100100745f72c0b072C55E7fe0750Ba212E380A7",
        COMPOUND_LENS_ADDRESS: "0xd513d22422a3062Bd342Ae374b4b9c20E0a9a074",
    },
    "0x38": {
        chainId: "0x38",
        network: "Binance Smart Chain", 
        symbol: "BNB",
        rpcUrls: ["https://bsc-dataseed1.binance.org/"],
        blockExplorelUrls: ["https://bscscan.com/"],
        logo: Logos["BNB"], 
        name: "BNB", 
        token: "0xfcd8570ad81e6c77b8d252bebeba62ed980bd64d",
        UNITROLLER_ADDRESS: "0x0F390559F258eB8591C8e31Cf0905E97cf36ACE2", 
        HUNDRED_ADDRESS: "0x100100745f72c0b072C55E7fe0750Ba212E380A7",
        COMPOUND_LENS_ADDRESS: "0xd513d22422a3062Bd342Ae374b4b9c20E0a9a074",
    },
    "0x80": {
        chainId: "0x80",
        network: "Heco Mainet", 
        symbol: "HT",
        rpcUrls: ["https://http-mainnet-node.huobichain.com"],
        blockExplorelUrls: ["https://hecoinfo.com"],
        logo: Logos["HT"], 
        name: "Heco", 
        token: "0xfcd8570ad81e6c77b8d252bebeba62ed980bd64d",
        UNITROLLER_ADDRESS: "0x0F390559F258eB8591C8e31Cf0905E97cf36ACE2",
        HUNDRED_ADDRESS: "0x100100745f72c0b072C55E7fe0750Ba212E380A7",
        COMPOUND_LENS_ADDRESS: "0xd513d22422a3062Bd342Ae374b4b9c20E0a9a074",
    },  
    "0x89": {
        chainId: "0x89",
        network: "Polygon",
        symbol: "MATIC",
        rpcUrls:["https://rpc-mainnet.matic.network",
                 "https://rpc-mainnet.maticvigil.com",
                 "https://rpc-mainnet.matic.quiknode.pro",
                 "https://matic-mainnet.chainstacklabs.com",
                 "https://matic-mainnet-full-rpc.bwarelabs.com",
                 "https://matic-mainnet-archive-rpc.bwarelabs.com"],
        blockExplorelUrls: ["https://explorer.matic.network", "https://explorer-mainnet.maticvigil.com/"],
        logo: Logos["MATIC"],
        name: "Matic",
        token: "0xebd7f3349aba8bb15b897e03d6c1a4ba95b55e31",
        UNITROLLER_ADDRESS: "0xEdBA32185BAF7fEf9A26ca567bC4A6cbe426e499",
        HUNDRED_ADDRESS: "0xfCD8570AD81e6c77b8D252bEbEBA62ed980BD64D",
        COMPOUND_LENS_ADDRESS: "0xd513d22422a3062Bd342Ae374b4b9c20E0a9a074",
    }       
}

export { NETWORKS }
export type { Network }
