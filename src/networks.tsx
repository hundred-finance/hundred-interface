import Logos from './logos';

export enum MasterChefVersion {
  v1,
  v2,
}

type BackstopMasterChef = {
  address: string;
  version: MasterChefVersion;
  collaterals?: number;
};

type Network = {
  chainId: string;
  network: string;
  symbol: string;
  rpcUrls?: string[];
  blockExplorerUrls?: string[];
  logo: string;
  name: string;
  blocksPerYear: number;
  addLiquidity?: string;
  trade?: string;
  stakeLp?: string;
  nativeTokenMarketAddress: string;
  blockRpc?: string;
  unitrollerAddress: string;
  hundredAddress: string;
  compoundLensAddress: string;
  hundredLiquidityPoolAddress?: string;
  hndPoolPercent?: number;
  liquidity?: boolean;
  multicallAddress?: string;
  backstopMasterChef?: BackstopMasterChef;
  minterAddress?: string;
  gaugeControllerAddress?: string;
  airdropMulticallAddress?: string;
  maximillion?: string;
};

type NetworkData = {
  [key: string]: Network;
};

const NETWORKS: NetworkData = !process.env.REACT_APP_TEST_NETWORK
  ? {
      '0x1': {
        chainId: '0x1',
        network: 'Ethereum Mainnet',
        symbol: 'ETH',
        logo: Logos['ETH'],
        name: 'Ethereum',
        blocksPerYear: ((24 * 60 * 60) / 13.5) * 365,
        trade: 'https://app.balancer.fi/#/trade',
        addLiquidity: 'https://app.balancer.fi/#/pool/0x56b2811bf75bb258d2234af4f43b479bb55c3b46000200000000000000000091',
        nativeTokenMarketAddress: '0xfcd8570ad81e6c77b8d252bebeba62ed980bd64d',
        unitrollerAddress: '0x0f390559f258eb8591c8e31cf0905e97cf36ace2',
        hundredAddress: '0x10010078a54396f62c96df8532dc2b4847d47ed3',
        compoundLensAddress: '0xd513d22422a3062Bd342Ae374b4b9c20E0a9a074',
        maximillion: '0x97F3763F8C0bE87Cab0e99Ee4b7806acA772FeDA',
      },
      '0xa4b1': {
        chainId: '0xa4b1',
        network: 'Arbitrum One',
        symbol: 'AETH',
        rpcUrls: ['https://arb1.arbitrum.io/rpc'],
        blockExplorerUrls: ['https://arbiscan.io'],
        logo: Logos['ARBITRUM'],
        name: 'AETH',
        blocksPerYear: ((24 * 60 * 60) / 13.5) * 365,
        addLiquidity: 'https://app.dodoex.io/liquidity?network=arbitrum&poolAddress=0x65e17c52128396443d4a9a61eacf0970f05f8a20',
        trade: 'https://app.dodoex.io/exchange/WETH-HND?network=arbitrum',
        stakeLp: 'https://app.dodoex.io/mining?network=arbitrum&mining=0x52c7b4aa3f67d3533aaf1153430758c702a3594b',
        nativeTokenMarketAddress: '0x8e15a22853a0a60a0fbb0d875055a8e66cff0235',
        blockRpc: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
        unitrollerAddress: '0x0f390559f258eb8591c8e31cf0905e97cf36ace2',
        hundredAddress: '0x10010078a54396f62c96df8532dc2b4847d47ed3',
        compoundLensAddress: '0xd513d22422a3062Bd342Ae374b4b9c20E0a9a074',
        hundredLiquidityPoolAddress: '0x65E17c52128396443d4A9A61EaCf0970F05F8a20',
        backstopMasterChef: {
          address: '0x89db3B59381bC06FE9BF74532Afd777e5F78Ef02',
          version: MasterChefVersion.v1,
        },
        gaugeControllerAddress: '0xb4BAfc3d60662De362c0cB0f5e2DE76603Ea77D7',
        maximillion: '0x26596af66A10Cb6c6fe890273eD37980D50f2448',
      },
      '0xfa': {
        chainId: '0xfa',
        network: 'Fantom Opera',
        symbol: 'FTM',
        rpcUrls: ['https://rpc.ftm.tools/'],
        blockExplorerUrls: ['https://ftmscan.com/'],
        logo: Logos['FTM'],
        name: 'FTM',
        blocksPerYear: 24 * 60 * 60 * 365,
        nativeTokenMarketAddress: '0xfcd8570ad81e6c77b8d252bebeba62ed980bd64d',
        addLiquidity: 'https://app.beets.fi/#/pool/0xd57cda2caebb9b64bb88905c4de0f0da217a77d7000100000000000000000073',
        stakeLp: 'https://app.beets.fi/#/pool/0xd57cda2caebb9b64bb88905c4de0f0da217a77d7000100000000000000000073',
        trade: 'https://app.beets.fi/#/trade',
        unitrollerAddress: '0x0f390559f258eb8591c8e31cf0905e97cf36ace2',
        hundredAddress: '0x10010078a54396f62c96df8532dc2b4847d47ed3',
        compoundLensAddress: '0xd513d22422a3062Bd342Ae374b4b9c20E0a9a074',
        hundredLiquidityPoolAddress: '0x20dd72ed959b6147912c2e529f0a0c651c33c9ce',
        gaugeControllerAddress: '0xb1c4426C86082D91a6c097fC588E5D5d8dD1f5a8',
        hndPoolPercent: 0.6,
        liquidity: true,
        backstopMasterChef: {
          address: '0xf347b0e405249c78d8b261b7c493449b9275b946',
          version: MasterChefVersion.v2,
          collaterals: 5,
        },
        airdropMulticallAddress: '0x96a0eEa3a9cff74764b73A891c3b36a4F6B81181',
        maximillion: '0x9226f7304b547891eE257d64Cfb8F8c2a42b42BB',
      },
      '0x63564c40': {
        chainId: '0x63564c40',
        network: 'Harmony',
        symbol: 'ONE',
        rpcUrls: ['https://api.harmony.one', 'https://s1.api.harmony.one', 'https://s2.api.harmony.one', 'https://s3.api.harmony.one'],
        blockExplorerUrls: ['https://explorer.harmony.one/'],
        logo: Logos['ONE'],
        name: 'ONE',
        blocksPerYear: 15778476,
        nativeTokenMarketAddress: '0xbb93c7f378b9b531216f9ad7b5748be189a55807',
        unitrollerAddress: '0x0f390559f258eb8591c8e31cf0905e97cf36ace2',
        hundredAddress: '0x10010078a54396f62c96df8532dc2b4847d47ed3',
        compoundLensAddress: '0xd513d22422a3062Bd342Ae374b4b9c20E0a9a074',
        gaugeControllerAddress: '0xa8cD5D59827514BCF343EC19F531ce1788Ea48f8',
        trade: 'https://app.sushi.com/swap?inputCurrency=0x10010078a54396f62c96df8532dc2b4847d47ed3',
        addLiquidity: 'https://app.sushi.com/add/0x10010078a54396f62c96df8532dc2b4847d47ed3/ETH',
        maximillion: '0x2c7a9d9919f042C4C120199c69e126124d09BE7c',
      },
      '0x505': {
        chainId: '0x505',
        network: 'Moonriver',
        symbol: 'MOVR',
        rpcUrls: ['https://rpc.moonriver.moonbeam.network'],
        blockExplorerUrls: ['https://moonriver.moonscan.io/'],
        logo: Logos['MOVR'],
        name: 'MOVR',
        blocksPerYear: 2465386,
        nativeTokenMarketAddress: '0x42b458056f887fd665ed6f160a59afe932e1f559',
        unitrollerAddress: '0x0f390559f258eb8591c8e31cf0905e97cf36ace2',
        hundredAddress: '0x10010078a54396f62c96df8532dc2b4847d47ed3',
        multicallAddress: '0x9fdd7e3e2df5998c7866cd2471d7d30e04496dfa',
        compoundLensAddress: '0xd513d22422a3062Bd342Ae374b4b9c20E0a9a074',
        gaugeControllerAddress: '0xb4300e088a3ae4e624ee5c71bc1822f68bb5f2bc',
        trade: 'https://app.solarbeam.io/exchange/swap?inputCurrency=0x10010078a54396f62c96df8532dc2b4847d47ed3',
        addLiquidity: 'https://app.solarbeam.io/exchange/add/0x10010078a54396f62c96df8532dc2b4847d47ed3/ETH',
        maximillion: '0xbd193db8a909cAC57Cdb981Ea81B5dc270287F19',
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
    }
  : {
      '0x2a': {
        chainId: '0x2a',
        network: 'KOVAN Test Network',
        symbol: 'ETH',
        rpcUrls: ['https://kovan.infura.io/v3/undefined'],
        blockExplorerUrls: ['https://kovan.etherscan.io'],
        logo: Logos['ETH'],
        name: 'ETH',
        blocksPerYear: 2336000,
        nativeTokenMarketAddress: '0xfcd8570ad81e6c77b8d252bebeba62ed980bd64d',
        unitrollerAddress: '0x0f390559f258eb8591c8e31cf0905e97cf36ace2',
        hundredAddress: '0x10010054c81c8c01951E6A631dD228bB02d8D1e5',
        compoundLensAddress: '0xd513d22422a3062Bd342Ae374b4b9c20E0a9a074',
        minterAddress: '0x9fF0A743b7a4f3d9ed186CC1020b9162C11E0595',
        gaugeControllerAddress: '0xd6Cafd6d475A790634a548d7f43a6e420247BA61',
        //   maximillion: '',
      },
      '0x6357d2e0': {
        chainId: '0x6357d2e0',
        network: 'Harmony Testnet Shard 0',
        symbol: 'ETH',
        rpcUrls: ['https://api.s0.b.hmny.io'],
        blockExplorerUrls: ['https://explorer.testnet.harmony.one/'],
        logo: Logos['ONE'],
        name: 'ONE',
        blocksPerYear: 15017140,
        nativeTokenMarketAddress: '0xfCD8570AD81e6c77b8D252bEbEBA62ed980BD64D',
        unitrollerAddress: '0x0F390559F258eB8591C8e31Cf0905E97cf36ACE2',
        hundredAddress: '0x10010078a54396F62c96dF8532dc2B4847d47ED3',
        compoundLensAddress: '0xd513d22422a3062Bd342Ae374b4b9c20E0a9a074',
        multicallAddress: '0xd078799c53396616844e2fa97f0dd2b4c145a685',
        //   maximillion: '',
      },
      '0x45': {
        chainId: '0x45',
        network: 'Optimism Kovan',
        symbol: 'ETH',
        rpcUrls: ['https://kovan.optimism.io'],
        blockExplorerUrls: ['https://kovan-optimistic.etherscan.io'],
        logo: Logos['OPT'],
        name: 'OPT',
        blocksPerYear: 15017140,
        nativeTokenMarketAddress: '0xfcd8570ad81e6c77b8d252bebeba62ed980bd64d',
        unitrollerAddress: '0x0f390559f258eb8591c8e31cf0905e97cf36ace2',
        hundredAddress: '0x10010078a54396F62c96dF8532dc2B4847d47ED3',
        compoundLensAddress: '0xd513d22422a3062Bd342Ae374b4b9c20E0a9a074',
        multicallAddress: '0x19ead25619352ea106f25a1c870c0a4df65faa75',
        //   maximillion: '',
      },
      '0x1252': {
        chainId: '0x1252',
        network: 'IoTeX Testnet',
        symbol: 'IOTX',
        rpcUrls: ['https://babel-api.testnet.iotex.io'],
        blockExplorerUrls: ['https://testnet.iotexscan.io/'],
        logo: Logos['IOTX'],
        name: 'IOTX-T',
        blocksPerYear: 6307200,
        nativeTokenMarketAddress: '',
        unitrollerAddress: '0x8c6139ff1e9d7c1e32bdafd79948d0895ba0a831',
        hundredAddress: '0x10010078a54396F62c96dF8532dc2B4847d47ED3',
        compoundLensAddress: '0xd513d22422a3062Bd342Ae374b4b9c20E0a9a074',
        multicallAddress: '0x25bb701a0ce238faecaec56b437460a372d7f139',
        //   maximillion: '',
      },
    };

export { NETWORKS };
export type { Network };
