import {ethers} from 'ethers'
import { Contract, Provider } from 'ethcall'
import { BACKSTOP_MASTERCHEF_ABI, COMPTROLLER_ABI, ORACLE_ABI } from '../abi'
import { Network } from '../networks'
import { BackstopPool } from './backstopClass'

export class Comptroller2{
    address : string
    ethcallComptroller: Contract
    comptroller: ethers.Contract
    oracle: ethers.Contract
    allMarkets: string[]
    enteredMarkets: string[]
    ethcallProvider: Provider

    constructor(address: string, ethcallComptroller: Contract, comptroller: ethers.Contract, oracle: ethers.Contract, allMarkets: string[], enteredMarkets: string[], provider: Provider){
        this.address = address
        this.ethcallComptroller = ethcallComptroller
        this.comptroller = comptroller
        this.oracle = oracle
        this.allMarkets = allMarkets
        this.enteredMarkets = enteredMarkets
        this.ethcallProvider = provider
    }
}

export class Comptroller{
    address : string
    ethcallComptroller: Contract
    comptroller: ethers.Contract
    oracle: Contract
    allMarkets: string[]
    ethcallProvider: Provider
    backstopPools: BackstopPool[]

    constructor(address: string, ethcallComptroller: Contract, comptroller: ethers.Contract, oracle: Contract, 
        allMarkets: string[], provider: Provider, backstopPools: BackstopPool[]){
        this.address = address
        this.ethcallComptroller = ethcallComptroller
        this.comptroller = comptroller
        this.oracle = oracle
        this.allMarkets = allMarkets
        this.ethcallProvider = provider
        this.backstopPools = backstopPools
    }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getComptrollerData = async (provider: any, network: Network): Promise<Comptroller> => {
    const ethcallProvider = new Provider()
    await ethcallProvider.init(provider)
    if(network.multicallAddress) {
        ethcallProvider.multicallAddress = network.multicallAddress
    }

    const ethcallComptroller = new Contract(network.unitrollerAddress, COMPTROLLER_ABI)

    const calls = [ethcallComptroller.oracle(), ethcallComptroller.getAllMarkets()]

    if(network.backstopMasterChef){
        const backstop = new Contract(network.backstopMasterChef, BACKSTOP_MASTERCHEF_ABI)
        calls.push(backstop.poolLength())
    }
console.log(calls)
    const data = await ethcallProvider.all(calls) 
    console.log(data)
    const oracleAddress = data[0]
    const allMarkets = data[1]

    const backstopPools = []
    if(network.backstopMasterChef){
        const poolLength = data[2] 
        const backstop = new Contract(network.backstopMasterChef, BACKSTOP_MASTERCHEF_ABI)
        const backStopCall = []
        for(let i=0; i<poolLength; i++){
            backStopCall.push(backstop.lpTokens(i), backstop.underlyingTokens(i))
        }
        const backstopData = await ethcallProvider.all(backStopCall)
        console.log(backstopData)
        if(backstopData && backstopData.length === 2 * poolLength){
            for(let i=0; i<backstopData.length / 2; i++){
                const backstopPool: BackstopPool = {
                    poolId: i,
                    lpTokens: backstopData[i*2],
                    underlyingTokens: backstopData[(i*2)+1]
                }
                backstopPools.push(backstopPool)
            }
        }
    }

    console.log(backstopPools)

    const comptroller = new ethers.Contract(network.unitrollerAddress, COMPTROLLER_ABI, provider)
    
    const oracle = new Contract(oracleAddress, ORACLE_ABI)
    
    return new Comptroller(network.unitrollerAddress, ethcallComptroller, comptroller, oracle, allMarkets, ethcallProvider, backstopPools)
  }

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getComptrollerData2 = async (provider: any, userAddress: string, network: Network): Promise<Comptroller2> => {
    const ethcallProvider = new Provider()
    await ethcallProvider.init(provider)
    const ethcallComptroller = new Contract(network.unitrollerAddress, COMPTROLLER_ABI)

    const [oracleAddress, allMarkets, enteredMarkets] = await ethcallProvider.all([ethcallComptroller.oracle(), ethcallComptroller.getAllMarkets(), ethcallComptroller.getAssetsIn(userAddress)]) 
    const comptroller = new ethers.Contract(network.unitrollerAddress, COMPTROLLER_ABI, provider)
    //   const oracleAddress = await comptroller.oracle()
       const oracle = new ethers.Contract(oracleAddress, ORACLE_ABI, provider)
    //   const allMarkets =  await comptroller.getAllMarkets()
    //   const enteredMarkets = await comptroller.getAssetsIn(userAddress)
   
    return new Comptroller2(network.unitrollerAddress, ethcallComptroller, comptroller, oracle, allMarkets, enteredMarkets, ethcallProvider)
  }
