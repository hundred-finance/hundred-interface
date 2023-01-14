import { ethers } from "ethers";
import { BigNumber } from "../../bigNumber"
import { GaugeV4 } from "../../Classes/gaugeV4Class"

export type hndRewardsDataType = {
    totalHndRewards: BigNumber,
    secondaryTokenRewards: BigNumber,
    secondaryTokenSymbol: string | undefined,
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
    let totalHndRewards = 0
    let totalSecondaryTokenRewards = 0
    let secondaryTokenSymbol = undefined;
    for (let i = 0; i < claimableGauges.length; i++) {
        gaugeAddresses[i] = (claimableGauges[i].generalData.address);

        totalHndRewards += +claimableGauges[i].userClaimableHnd.toString()
        totalSecondaryTokenRewards += +claimableGauges[i].claimable_reward.toString()
        secondaryTokenSymbol = claimableGauges[i].reward_token_symbol;
    }

    return {
        totalHndRewards: BigNumber.parseValue(totalHndRewards.noExponents()),
        secondaryTokenRewards: BigNumber.parseValue(totalSecondaryTokenRewards.noExponents()),
        secondaryTokenSymbol: secondaryTokenSymbol,
        gaugeAddresses: gaugeAddresses
    }
}