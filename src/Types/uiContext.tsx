import { createContext, useContext } from "react";
import { lightTheme, Theme } from "../theme";

export type UiContext = {
    sideMenu: boolean,
    setSideMenu: (s: boolean) => void,
    darkMode: boolean,
    setDarkMode: (d: boolean) => void,
    spinnerVisible: boolean,
    setSpinnerVisible: (v: boolean) => void,
    isMobile: boolean,
    setIsMobile: (m: boolean) => void,
    isTablet: boolean,
    setIsTablet: (t: boolean) => void,
    show: boolean,
    setShow: (s: boolean) => void,
    theme: Theme,
    setTheme: (t: Theme) => void,
    openAddress: boolean, 
    setOpenAddress: (a: boolean) => void,
    openNetwork: boolean,
    setOpenNetwork: (n: boolean) => void,
    openHundred: boolean,
    setOpenHundred: (h: boolean) => void,
    openAirdrop: boolean,
    setOpenAirdrop: (a: boolean) => void,
    airdropSpinner: boolean,
    setAirdropSpinner: (a: boolean) => void
    toastSuccessMessage: (m: string, autoClose?: boolean, closeDelay?: number) => void,
    toastErrorMessage: (message: string, autoClose?: boolean, closeDelay?:number) => void,
    switchModal: boolean,
    setSwitchModal: (m: boolean) => void,
    scale: boolean, 
    setScale: (h: boolean) => void
    claimHnd: boolean,
    setClaimHnd: (c: boolean) => void,
    claimLockHnd: boolean,
    setClaimLockHnd: (c: boolean) => void
}

export const MyUiContext = createContext<UiContext>({
    sideMenu: false,
    setSideMenu: () => undefined,
    darkMode: false,
    setDarkMode: () => undefined,
    spinnerVisible: false,
    setSpinnerVisible: () => undefined,
    isMobile: false,
    setIsMobile: () => undefined,
    isTablet: false,
    setIsTablet: () => undefined,
    show: false,
    setShow: () => undefined,
    theme: lightTheme,
    setTheme: () => undefined,
    openAddress: false,
    setOpenAddress: () => undefined,
    openNetwork: false,
    setOpenNetwork: () => undefined,
    openHundred: false,
    setOpenHundred: () => undefined,
    openAirdrop: false,
    setOpenAirdrop: () => undefined,
    airdropSpinner: false,
    setAirdropSpinner : () => undefined,
    toastSuccessMessage : () => undefined,
    toastErrorMessage: () => undefined,
    switchModal: false,
    setSwitchModal: () => undefined,
    scale: false,
    setScale: () => undefined,
    claimHnd: false,
    setClaimHnd: () => undefined,
    claimLockHnd: false,
    setClaimLockHnd: () => undefined
})

export const useUiContext = () : UiContext => useContext(MyUiContext)
