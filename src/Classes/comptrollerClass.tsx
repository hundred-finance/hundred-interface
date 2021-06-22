import {ethers} from 'ethers'
import { COMPTROLLER_ABI, ORACLE_ABI } from '../abi'
import { Network } from '../networks'

export class Comptroller{
    address : string
    comptroller: ethers.Contract
    oracle: ethers.Contract
    allMarkets: string[]
    enteredMarkets: string[]

    constructor(address: string, comptroller: ethers.Contract, oracle: ethers.Contract, allMarkets: string[], enteredMarkets: string[]){
        this.address = address
        this.comptroller = comptroller
        this.oracle = oracle
        this.allMarkets = allMarkets
        this.enteredMarkets = enteredMarkets
    }
}

export const getComptrollerData = async (provider: ethers.providers.Web3Provider, userAddress: string, network: Network): Promise<Comptroller> => {
      const comptroller = new ethers.Contract(network.UNITROLLER_ADDRESS, COMPTROLLER_ABI, provider)
      const oracleAddress = await comptroller.oracle()
      const oracle = new ethers.Contract(oracleAddress, ORACLE_ABI, provider)
      const allMarkets =  await comptroller.getAllMarkets()
      const enteredMarkets = await comptroller.getAssetsIn(userAddress)

      return new Comptroller(network.UNITROLLER_ADDRESS, comptroller, oracle, allMarkets, enteredMarkets)
  }
