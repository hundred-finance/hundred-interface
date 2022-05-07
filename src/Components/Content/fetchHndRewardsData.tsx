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

    const claimableGauges =
        gaugesData
            .filter(g => !g.generalData.backstopGauge)
            .filter(g => g.userClaimableHnd.gt(BigNumber.from(0)))
            .slice(0, 7);
    let result = 0
    for (let i = 0; i < claimableGauges.length; i++) {
        const hndNum = +claimableGauges[i].userClaimableHnd.toString();
        gaugeAddresses[i] = (claimableGauges[i].generalData.address);
        result += hndNum
    }

    const totalHndRewards = BigNumber.parseValue(result.noExponents())

    return {
        totalHndRewards: totalHndRewards,
        gaugeAddresses: gaugeAddresses
    }
}