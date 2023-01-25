import { createContext, useContext } from "react";
import { BigNumber } from "../bigNumber";
import { Comptroller } from "../Classes/comptrollerClass";
import { CTokenInfo, CTokenSpinner, SpinnersEnum } from "../Classes/cTokenClass";
import { GaugeV4 } from "../Classes/gaugeV4Class";
import { GeneralDetailsData } from "../Classes/generalDetailsClass";
import { UpdateTypeEnum } from "../Hundred/Data/hundredData";

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
    hndBalance: BigNumber,
    setHndBalance: (b: BigNumber) => void,
    hndEarned: BigNumber, 
    setHndEarned: (b: BigNumber) => void
    hundredBalance: BigNumber, 
    setHundredBalance: (b: BigNumber) => void
    vehndBalance: BigNumber, 
    setVehndBalance: (b: BigNumber) => void,
    hndRewards: BigNumber, 
    setHndRewards: (b: BigNumber) => void,
    tokenRewards: BigNumber,
    setTokenRewards: (b: BigNumber) => void,
    rewardTokenSymbol: string | undefined,
    setRewardTokenSymbol: (b: string|undefined) => void,
    gaugeAddresses: string[] | undefined,
    setGaugeAddresses: (g: string[] | undefined) => void,
    selectedMarket: CTokenInfo | undefined,
    setSelectedMarket: (m: CTokenInfo | undefined) => void
    selectedMarketSpinners: CTokenSpinner | undefined, 
    setSelectedMarketSpinners: (s: CTokenSpinner | undefined) => void,
    toggleSpinners: (c: string, s: SpinnersEnum) => void,
    setGMessage: (message: string) => void
    updateMarket: (market: CTokenInfo | GaugeV4 | null, updateType: UpdateTypeEnum, shouldReturn?: any) => Promise<void>,
    getMaxAmount: (market: CTokenInfo, func?: string) => Promise<BigNumber>
    getMaxRepayAmount: (market: CTokenInfo) => Promise<BigNumber>
    convertUSDToUnderlyingToken: (USD: string, market: CTokenInfo) => BigNumber
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
    hndBalance: BigNumber.from("0"),
    setHndBalance: () => undefined,
    hndEarned: BigNumber.from("0"), 
    setHndEarned: () => undefined,
    hundredBalance: BigNumber.from("0"), 
    setHundredBalance: () => undefined,
    vehndBalance: BigNumber.from("0"), 
    setVehndBalance: () => undefined,
    hndRewards: BigNumber.from("0"), 
    setHndRewards: () => undefined,
    tokenRewards: BigNumber.from("0"),
    setTokenRewards: () => undefined,
    rewardTokenSymbol: undefined,
    setRewardTokenSymbol: () => undefined,
    gaugeAddresses: undefined,
    setGaugeAddresses: () => undefined,
    selectedMarket: undefined,
    setSelectedMarket: () => undefined,
    selectedMarketSpinners: undefined,
    setSelectedMarketSpinners: () => undefined,
    toggleSpinners: () => undefined,
    setGMessage: () => undefined,
    updateMarket: async () => undefined,
    getMaxAmount: async () => BigNumber.from("0"),
    getMaxRepayAmount: async () => BigNumber.from("0"),
    convertUSDToUnderlyingToken: () => BigNumber.from("0"),
})

export const useHundredDataContext = () : HundredDataContext => useContext(MyHundredDataContext)