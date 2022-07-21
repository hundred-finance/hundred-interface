import { Contract } from "ethcall"
import {VOTING_ESCROW_ABI} from "../../abi"
import { BigNumber } from "../../bigNumber"
import { Comptroller } from "../../Classes/comptrollerClass"
import { Network } from "../../networks"

export type votingDataType = {
    vehndBalance: BigNumber
}

export const fetchVotingData = async(
{ userAddress, comptrollerData, network, }: 
{userAddress: string; comptrollerData: Comptroller; network: Network;}) : Promise<votingDataType> => {
    const votingCalls = []
    if (network.votingAddress) {   
        const votingContract = new Contract(network.votingAddress, VOTING_ESCROW_ABI); 
        votingCalls.push(votingContract.balanceOf(userAddress))
    }
    const votingResult = await comptrollerData.ethcallProvider.all(votingCalls)
  
    const vehndBalance = votingResult[0] ? BigNumber.from(votingResult[0], 18) : BigNumber.from("0")
    return {vehndBalance:vehndBalance}
}
