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
    hndSpinner: boolean, 
    setHndSpinner: (h: boolean) => void,
    airdropSpinner: boolean,
    setAirdropSpinner: (a: boolean) => void
    toastSuccessMessage: (m: string, autoClose?: boolean, closeDelay?: number) => void,
    toastErrorMessage: (message: string, autoClose?: boolean, closeDelay?:number) => void,
    switchModal: boolean,
    setSwitchModal: (m: boolean) => void,
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
    hndSpinner: false,
    setHndSpinner: () => undefined,
    airdropSpinner: false,
    setAirdropSpinner : () => undefined,
    toastSuccessMessage : () => undefined,
    toastErrorMessage: () => undefined,
    switchModal: false,
    setSwitchModal: () => undefined
})

export const useUiContext = () : UiContext => useContext(MyUiContext)
