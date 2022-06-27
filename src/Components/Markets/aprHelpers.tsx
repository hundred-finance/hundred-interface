import {CTokenInfo} from "../../Classes/cTokenClass";
import {GaugeV4} from "../../Classes/gaugeV4Class";
import {BigNumber} from "../../bigNumber";

export function stakingApr(market: CTokenInfo|null|undefined, gauge: GaugeV4|null|undefined): string {

    if (!market || !gauge) {
        return "0.00%"
    }

    if (+gauge.userWorkingStakeBalance > 0) {
        if (gauge.generalData.backstopGauge) {
            return `${formatApr(market?.veHndBackstopAPR)}%`
        }
        return `${formatApr(market?.veHndAPR)}%`
    }


    if (gauge.generalData.backstopGauge) {
        return `${formatApr(market?.veHndBackstopAPR)}-${formatApr(market?.veHndBackstopMaxAPR)}%`
    }

    return `${formatApr(market?.veHndAPR)}-${formatApr(market?.veHndMaxAPR)}%`
}

export function formatApr(apr: BigNumber): string {
    return BigNumber.parseValue((+apr.toString() * 100).noExponents()).toRound(2, false, true)
}