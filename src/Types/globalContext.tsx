import { createContext, useContext } from "react";
import { BigNumber } from "../bigNumber";
import { AirdropType } from "../Components/AirdropButton/airdropButton";
import { Network } from "../networks";

export type GlobalContext = {
    network: Network | null,
    setNetwork: (n: Network | null) => void,
    address: string,
    setAddress: (a: string) => void
    hndPrice: number, 
    setHndPrice: (p: number) => void
    hasClaimed: boolean, 
    setHasClaimed: (c: boolean) => void,
    airdrops: AirdropType[], 
    setAirdrops: (a: AirdropType[]) => void
    hndBalance: BigNumber | null, 
    setHndBalance: (b: BigNumber | null) => void
    hndEarned: BigNumber | null, 
    setHndEarned: (b: BigNumber | null) => void
    hundredBalance: BigNumber | null, 
    setHundredBalance: (b: BigNumber | null) => void
    vehndBalance: BigNumber | null, 
    setVehndBalance: (b: BigNumber | null) => void,
    hndRewards: BigNumber | null, 
    setHndRewards: (b: BigNumber | null) => void,
    updateEarned: boolean, 
    setUpdateEarned: (e: boolean) => void,
    gaugeAddresses: string[] | null,
    setGaugeAddresses: (g: string[] | null) => void
}

export const MyGlobalContext = createContext<GlobalContext>({
    network: null,
    setNetwork: () => undefined,
    address: "",
    setAddress: () => undefined,
    hndPrice: 0,
    setHndPrice: () => undefined,
    hasClaimed: false,
    setHasClaimed: () => undefined,
    airdrops: [],
    setAirdrops: () => undefined,
    hndBalance: null,
    setHndBalance: () => undefined,
    hndEarned: null,
    setHndEarned: () => undefined,
    hundredBalance: null,
    setHundredBalance: () => undefined,
    vehndBalance: null,
    setVehndBalance: () => undefined,
    hndRewards: null,
    setHndRewards: () => undefined,
    updateEarned: false, 
    setUpdateEarned: () => undefined,
    gaugeAddresses: null,
    setGaugeAddresses: () => undefined
})

export const useGlobalContext = () : GlobalContext => useContext(MyGlobalContext)