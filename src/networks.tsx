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
        HUNDRED_ADDRESS: "0x10010054c81c8c01951E6A631dD228bB02d8D1e5",
        COMPOUND_LENS_ADDRESS: "0xd513d22422a3062Bd342Ae374b4b9c20E0a9a074",
    }
}

export { NETWORKS }
export type { Network }
