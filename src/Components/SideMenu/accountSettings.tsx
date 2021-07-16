import React, { useEffect} from "react"
import { getShortenAddress } from "../../helpers"
import "./accountSettings.css"
import {BigNumber, ethers} from "ethers"
import {Network} from "../../networks"
import { Spinner } from "../../assets/huIcons/huIcons"
import {HundredBalance} from "../../Classes/hundredClass"

interface Props{
    hndBalance: HundredBalance | null,
    hndEarned: HundredBalance | null,
    hndSpinner: boolean,
    address: string,
    provider: ethers.providers.Web3Provider | null,
    network: Network | null,
    setSideMenu: React.Dispatch<React.SetStateAction<boolean>>,
    setOpenAddress: React.Dispatch<React.SetStateAction<boolean>>,
    setAddress: React.Dispatch<React.SetStateAction<string>>,
    handleCollect: () => Promise<void>,
    getHndBalances: (prv: any) => Promise<void>
}


const AccountSettings: React.FC<Props> = (props: Props) => {
    useEffect(() => {
        const getPctBalances = async() => {
            props.getHndBalances(props.provider)
            // props.getHndEarned()  
        }

        if (props.provider && props.address!=="")
            getPctBalances()
    }, [])

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
            <hr/>
            <div className="account-settings-item">
                <div className="account-settings-item-label"><label>HND Balance </label><span>{props.hndBalance ? (props.hndBalance.balance.gt(BigNumber.from(0)) ? props.hndBalance.toFixed(2) : "0") : "--"}</span></div>
                <div className="account-settings-item-label"><label>HND Earned </label><span>{props.hndEarned ? props.hndEarned?.balance.gt(BigNumber.from(0)) ? props.hndEarned?.toFixed(4) : "0" : "--"}</span></div>
                <div className={`${props.hndSpinner ? "account-settings-item-button-disabled" : "account-settings-item-button"}`} onClick={() => !props.hndSpinner ? props.handleCollect() : null}>
                    {props.hndSpinner ? (<Spinner size={"25px"}/>) : "Collect"}</div>
            </div>
        </div>
    )
}

export default AccountSettings