import { useWeb3React } from "@web3-react/core"
import { ethers } from "ethers"
import React from "react"
import { getShortenAddress } from "../../helpers"
import { useGlobalContext } from "../../Types/globalContext"
import { useUiContext } from "../../Types/uiContext"
import "./accountSettings.css"

const AccountSettings: React.FC = () => {
    const {setSideMenu, setOpenAddress} = useUiContext()
    const {address, setAddress} = useGlobalContext()
    const { connector, deactivate} = useWeb3React<ethers.providers.Web3Provider>()

    const handleDisconnect = () => {
        try{
            (connector as any).close()
        }
        catch{}
    
        window.localStorage.removeItem("provider")
        deactivate()

        setSideMenu(false) 
        setOpenAddress(false)
        setAddress("")
    }

    return (
        <div className="account-settings">
            <div className="account-settings-item">
                <hr/>
                <div className="account-settings-item-label"><label>Address </label><span>{getShortenAddress(address)}</span></div>
                <div className="account-settings-item-button" onClick={() => handleDisconnect()}>Disconnect</div>
            </div>
        </div>
    )
}

export default AccountSettings