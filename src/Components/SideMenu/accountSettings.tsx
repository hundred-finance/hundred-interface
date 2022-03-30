import { useWeb3React } from "@web3-react/core"
import { ethers } from "ethers"
import React from "react"
import { getShortenAddress } from "../../helpers"
import { useUiContext } from "../../Types/uiContext"
import "./accountSettings.css"

interface Props{
    address: string,
    setAddress: React.Dispatch<React.SetStateAction<string>>,
}


const AccountSettings: React.FC<Props> = (props: Props) => {
    const {setSideMenu, setOpenAddress} = useUiContext()
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
        props.setAddress("")
    }

    return (
        <div className="account-settings">
            <div className="account-settings-item">
                <hr/>
                <div className="account-settings-item-label"><label>Address </label><span>{getShortenAddress(props.address)}</span></div>
                <div className="account-settings-item-button" onClick={() => handleDisconnect()}>Disconnect</div>
            </div>
        </div>
    )
}

export default AccountSettings