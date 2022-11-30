import { createContext, useContext } from "react";

export type TimersContext = {
    hndPriceTimer: string | number | NodeJS.Timeout | undefined,
    setHndPriceTimer: (h: string | number | NodeJS.Timeout | undefined) => void,
}

export const MyTimersContext = createContext<TimersContext>({
    hndPriceTimer: undefined,
    setHndPriceTimer: () => undefined,
})

export const useTimersContext = () : TimersContext => useContext(MyTimersContext)