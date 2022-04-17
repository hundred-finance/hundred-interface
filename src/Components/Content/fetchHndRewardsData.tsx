import { ethers } from "ethers";
import { BigNumber } from "../../bigNumber"
import { GaugeV4 } from "../../Classes/gaugeV4Class"

export type hndRewardsDataType = {
    totalHndRewards: BigNumber,
    gaugeAddresses: string[]
}

export const fetchHndRewards = async(
{ gaugesData }: {gaugesData: GaugeV4[]}) : Promise<hndRewardsDataType> => {
 const gaugeAddresses = Array(8).fill(ethers.constants.AddressZero);
 let result = 0
 for (let i = 0; i < gaugesData.length; i++) {
  gaugeAddresses[i] = (gaugesData[i].generalData.address);
  const hndNum = +gaugesData[i].userClaimableHnd.toString(); 
  result += hndNum
}

const totalHndRewards = BigNumber.parseValue(result.noExponents())

  return {
totalHndRewards: totalHndRewards,
gaugeAddresses: gaugeAddresses
}}