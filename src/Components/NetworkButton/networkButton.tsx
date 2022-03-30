import React, { useEffect, useRef } from "react"
import { Network } from "../../networks"
import { useGlobalContext } from "../../Types/globalContext"
import { useUiContext } from "../../Types/uiContext"
import "./networkButton.css"

const NetworkButton : React.FC = () => {
    const {setOpenNetwork, setSideMenu} = useUiContext()
    const {network} = useGlobalContext()
    const netWorkRef = useRef<Network | null>(null)
    netWorkRef.current = network

    useEffect(() => {
        const temp = {...network} as Network
        if(temp)
            netWorkRef.current = temp
    }, [network])
    
    const handleOpenNetworks = () :void => {
            setOpenNetwork(true)
            setSideMenu(true)
    }



    if(netWorkRef.current){
        return (
            <div className="network-button" onClick={() => handleOpenNetworks()}>
            {
                <div className="network-button-content">
                    <img src={netWorkRef.current.logo} alt="" className="network-logo"/>
                    <span className="network-name">{netWorkRef.current.network}</span>
                    <span className="arrow">&#9660;</span>    
                </div>
            }
            </div>
        )
    }
    else return (
        <div className="network-button" onClick={() => handleOpenNetworks()}>
            <div className="network-button-content">
                <span className="network-name">Networks</span>
                <span className="arrow">&#9660;</span>    
            </div>
        </div>
    )
}

export default NetworkButton