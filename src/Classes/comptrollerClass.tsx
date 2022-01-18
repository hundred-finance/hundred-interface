import {ethers} from 'ethers'
import { Call, Contract, Provider } from 'ethcall'
import { BACKSTOP_MASTERCHEF_ABI, BACKSTOP_MASTERCHEF_ABI_V2, BPRO_ABI_V2, COMPTROLLER_ABI, ORACLE_ABI } from '../abi'
import { MasterChefVersion, Network } from '../networks'
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

    const backstop = network.backstopMasterChef
    const backstopAbi = network.backstopMasterChef && network.backstopMasterChef.version === MasterChefVersion.v1 ? BACKSTOP_MASTERCHEF_ABI : BACKSTOP_MASTERCHEF_ABI_V2
    
    if(backstop){
        const backstopContract = new Contract(backstop.address, backstopAbi)
        calls.push(backstopContract.poolLength())
    }
    const data = await ethcallProvider.all(calls) 
    const oracleAddress = data[0]
    const allMarkets = data[1]

    const backstopPools = []
    if(backstop){
        const poolLength = data[2] 
        console.log("PoolLength2: " + poolLength)
        const backstopContract = new Contract(backstop.address, backstopAbi)
        const backStopCall = []
        for(let i=0; i<poolLength; i++){
            backStopCall.push(backstopContract.lpTokens(i), backstopContract.underlyingTokens(i))
        }
        const backstopData = await ethcallProvider.all(backStopCall)
        
        if(backstopData && backstopData.length === 2 * poolLength){
            for(let i=0; i<backstopData.length / 2; i++){
                const backstopPool: BackstopPool = {
                    poolId: i,
                    lpTokens: backstopData[i*2],
                    underlyingTokens: backstopData[(i*2)+1]
                }
                backstopPools.push(backstopPool)
            }

            if(network.backstopMasterChef?.version === MasterChefVersion.v2){
                const tokenCall:Call[] = []
                const collateralsCount = network.backstopMasterChef.collaterals ? network.backstopMasterChef.collaterals : 0
                backstopPools.forEach(x => {
                    const tokenContract = new Contract(x.lpTokens, BPRO_ABI_V2)
                    for (let i=0; i< collateralsCount; i++){
                        tokenCall.push(tokenContract.collaterals(i))
                    }
                })
                const collaterals = await ethcallProvider.all(tokenCall)
                backstopPools.forEach(x=> {
                    const collateralsData = []
                    for(let i=0; i<collateralsCount; i++)
                        collateralsData.push(collaterals[i])
                    collaterals.splice(0,5)
                    x.collaterals = collateralsData
                })

                console.log(backstopPools[0].collaterals)
            }
        }
    }

    const comptroller = new ethers.Contract(network.unitrollerAddress, COMPTROLLER_ABI, provider)
    
    const oracle = new Contract(oracleAddress, ORACLE_ABI)
    console.log("ok")
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
