import React from "react"
import { getShortenAddress } from "../../helpers"
import "./accountSettings.css"

interface Props{
    address: string,
    setSideMenu: React.Dispatch<React.SetStateAction<boolean>>,
    setOpenAddress: React.Dispatch<React.SetStateAction<boolean>>,
    setAddress: React.Dispatch<React.SetStateAction<string>>,
}


const AccountSettings: React.FC<Props> = (props: Props) => {
    const handleDisconnect = () => {
        props.setSideMenu(false) 
        props.setOpenAddress(false)
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