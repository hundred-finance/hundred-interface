import {CTokenInfo} from "../../Classes/cTokenClass";
import {GaugeV4} from "../../Classes/gaugeV4Class";
import {BigNumber} from "../../bigNumber";

export function stakingApr(market: CTokenInfo|null, gauge: GaugeV4|null|undefined): string {

    if (!market || !gauge) {
        return "0.00%"
    }

    if (+gauge.userWorkingStakeBalance > 0) {
        return `${formatApr(market?.veHndAPR)}%`
    }

    return `${formatApr(market?.veHndAPR)}-${formatApr(market?.veHndMaxAPR)}%`
}

export function formatApr(apr: BigNumber): string {
    return BigNumber.parseValue((+apr.toString() * 100).noExponents()).toRound(2, false, true)
}