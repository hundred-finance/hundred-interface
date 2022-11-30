import { createContext, useContext } from "react";
import { AirdropType } from "../Components/AirdropButton/airdropButton";
import { Network } from "../networks";

export type GlobalContext = {
    network: Network | null,
    setNetwork: (n: Network | null) => void,
    address: string,
    setAddress: (a: string) => void
    hndPrice: number, 
    setHndPrice: (p: number) => void
    terraUsd: number, 
    setTerraUsd: (p: number) => void
    hasClaimed: boolean, 
    setHasClaimed: (c: boolean) => void,
    airdrops: AirdropType[], 
    setAirdrops: (a: AirdropType[]) => void
    updateEarned: boolean, 
    setUpdateEarned: (e: boolean) => void,
}

export const MyGlobalContext = createContext<GlobalContext>({
    network: null,
    setNetwork: () => undefined,
    address: "",
    setAddress: () => undefined,
    hndPrice: 0,
    setHndPrice: () => undefined,
    terraUsd: 0, 
    setTerraUsd: () => undefined,
    hasClaimed: false,
    setHasClaimed: () => undefined,
    airdrops: [],
    setAirdrops: () => undefined,
    updateEarned: false, 
    setUpdateEarned: () => undefined
})

export const useGlobalContext = () : GlobalContext => useContext(MyGlobalContext)