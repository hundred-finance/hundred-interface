import React, { useEffect, useRef } from "react"
import { Network } from "../../../networks"
import { useGlobalContext } from "../../../Types/globalContext"
import { useUiContext } from "../../../Types/uiContext"
import Button from "../../Button/button"


const NetworkButton : React.FC = () => {
    const {setOpenNetwork, setMobileMenuOpen} = useUiContext()
    const {network} = useGlobalContext()
    const netWorkRef = useRef<Network | null>(null)
    netWorkRef.current = network

    useEffect(() => {
        const temp = {...network} as Network
        if(temp)
            netWorkRef.current = temp
    }, [network])
    
    const handleOpenNetworks = () :void => {
        setMobileMenuOpen(false)
            setOpenNetwork(true)
    }

    return (
        netWorkRef.current ? 
            <Button onClick={() => handleOpenNetworks()} arrow={true} image={<img src={netWorkRef.current?.logo} alt=""/>}>
                {netWorkRef.current?.network}
            </Button>
        : 
        <Button onClick={() => handleOpenNetworks()} arrow={true}>
                <span className="network-name">Networks</span>
        </Button>
    )
}

export default NetworkButton