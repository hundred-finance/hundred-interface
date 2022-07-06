import { createContext, useContext } from "react";
import { BigNumber } from "../bigNumber";
import { Comptroller } from "../Classes/comptrollerClass";
import { CTokenInfo, CTokenSpinner, SpinnersEnum } from "../Classes/cTokenClass";
import { GaugeV4 } from "../Classes/gaugeV4Class";
import { GeneralDetailsData } from "../Classes/generalDetailsClass";

export type HundredDataContext = {
    comptrollerData: Comptroller | undefined, 
    setComptrollerData: (c : Comptroller | undefined) => void,
    marketsData: CTokenInfo[], 
    setMarketsData: (m: CTokenInfo[]) => void,
    marketsSpinners: CTokenSpinner[], 
    setMarketsSpinners: (s: CTokenSpinner[]) => void,
    gaugesV4Data: GaugeV4[], 
    setGaugesV4Data: (g: GaugeV4[]) => void,
    generalData: GeneralDetailsData | undefined,
    setGeneralData: (g: GeneralDetailsData | undefined) => void,
    selectedMarket: CTokenInfo | undefined,
    setSelectedMarket: (m: CTokenInfo | undefined) => void
    selectedMarketSpinners: CTokenSpinner | undefined, 
    setSelectedMarketSpinners: (s: CTokenSpinner | undefined) => void,
    toggleSpinners: (c: string, s: SpinnersEnum) => void,
    setGMessage: (message: string) => void
    updateMarket: any,
    getMaxAmount: (market: CTokenInfo, func?: string) => Promise<BigNumber>
}

export const MyHundredDataContext = createContext<HundredDataContext>({
    comptrollerData: undefined,
    setComptrollerData: () => undefined,
    marketsData: [],
    setMarketsData: () => undefined,
    marketsSpinners: [], 
    setMarketsSpinners: () => undefined,
    gaugesV4Data: [],
    setGaugesV4Data: () => undefined,
    generalData: undefined,
    setGeneralData: () => undefined,
    selectedMarket: undefined,
    setSelectedMarket: () => undefined,
    selectedMarketSpinners: undefined,
    setSelectedMarketSpinners: () => undefined,
    toggleSpinners: () => undefined,
    setGMessage: () => undefined,
    updateMarket: undefined,
    getMaxAmount: async () => BigNumber.from("0")
})

export const useHundredDataContext = () : HundredDataContext => useContext(MyHundredDataContext)