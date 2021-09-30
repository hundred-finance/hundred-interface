import {ethers} from 'ethers'
import { Contract, Provider } from 'ethcall'
import { COMPTROLLER_ABI, ORACLE_ABI } from '../abi'
import { Network } from '../networks'

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

    constructor(address: string, ethcallComptroller: Contract, comptroller: ethers.Contract, oracle: Contract, allMarkets: string[], provider: Provider){
        this.address = address
        this.ethcallComptroller = ethcallComptroller
        this.comptroller = comptroller
        this.oracle = oracle
        this.allMarkets = allMarkets
        this.ethcallProvider = provider
    }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getComptrollerData = async (provider: any, network: Network): Promise<Comptroller> => {
    const ethcallProvider = new Provider()
    await ethcallProvider.init(provider)
    const ethcallComptroller = new Contract(network.UNITROLLER_ADDRESS, COMPTROLLER_ABI)

    const [oracleAddress, allMarkets] = await ethcallProvider.all([ethcallComptroller.oracle(), ethcallComptroller.getAllMarkets()]) 
    const comptroller = new ethers.Contract(network.UNITROLLER_ADDRESS, COMPTROLLER_ABI, provider)
    //   const oracleAddress = await comptroller.oracle()
       const oracle = new Contract(oracleAddress, ORACLE_ABI)
    //   const allMarkets =  await comptroller.getAllMarkets()
    //   const enteredMarkets = await comptroller.getAssetsIn(userAddress)
   
    return new Comptroller(network.UNITROLLER_ADDRESS, ethcallComptroller, comptroller, oracle, allMarkets, ethcallProvider)
  }

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getComptrollerData2 = async (provider: any, userAddress: string, network: Network): Promise<Comptroller2> => {
    const ethcallProvider = new Provider()
    await ethcallProvider.init(provider)
    const ethcallComptroller = new Contract(network.UNITROLLER_ADDRESS, COMPTROLLER_ABI)

    const [oracleAddress, allMarkets, enteredMarkets] = await ethcallProvider.all([ethcallComptroller.oracle(), ethcallComptroller.getAllMarkets(), ethcallComptroller.getAssetsIn(userAddress)]) 
    const comptroller = new ethers.Contract(network.UNITROLLER_ADDRESS, COMPTROLLER_ABI, provider)
    //   const oracleAddress = await comptroller.oracle()
       const oracle = new ethers.Contract(oracleAddress, ORACLE_ABI, provider)
    //   const allMarkets =  await comptroller.getAllMarkets()
    //   const enteredMarkets = await comptroller.getAssetsIn(userAddress)
   
    return new Comptroller2(network.UNITROLLER_ADDRESS, ethcallComptroller, comptroller, oracle, allMarkets, enteredMarkets, ethcallProvider)
  }
