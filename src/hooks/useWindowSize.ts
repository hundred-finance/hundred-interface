import { useLayoutEffect } from "react"
import { useGlobalContext } from "../Types/globalContext"
import { useUiContext } from "../Types/uiContext"


export interface Size {
    width: number
    height: number
}

const useWindowSize = () : void => {
    const {show, setIsMobile, setIsTablet, setScale} = useUiContext()
    const {hasClaimed} = useGlobalContext()

    useLayoutEffect(() => {
        const updateSize = () => {
            if(show){
                if (window.innerWidth < (!hasClaimed ? 750 : 925)){
                  setIsMobile(true)
                  setIsTablet(false)
                  if(window.innerWidth < 331)
                    setScale(true)
                }
                else if (window.innerWidth < (!hasClaimed ? 1064 : 1192)){
                  setScale(false)
                  setIsTablet(true)
                  setIsMobile(false)
                }
                else {
                    setScale(false)
                    setIsTablet(false)
                }
              }
          }

        window.onresize = updateSize
    }, [])
}

export default useWindowSize