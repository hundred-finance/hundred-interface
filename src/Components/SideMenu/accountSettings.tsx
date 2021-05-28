import React, { useEffect, useRef } from "react"
import { getShortenAddress } from "../../helpers"
import "./accountSettings.css"
import {BigNumber, ethers} from "ethers"
import {Network} from "../../networks"
import {HUNDRED_ABI} from "../../abi"
import { Spinner } from "../../assets/huIcons/huIcons"
import {HundredBalance} from "../../Classes/hundredClass"

interface Props{
    setPctBalance: React.Dispatch<React.SetStateAction<HundredBalance | null>>,
    setPctEarned: React.Dispatch<React.SetStateAction<HundredBalance | null>>,
    pctBalance: HundredBalance | null,
    pctEarned: HundredBalance | null,
    pctSpinner: boolean,
    address: string,
    provider: ethers.providers.Web3Provider | null
    setSideMenu: React.Dispatch<React.SetStateAction<boolean>>,
    setOpenAddress: React.Dispatch<React.SetStateAction<boolean>>,
    setAddress: React.Dispatch<React.SetStateAction<string>>,
    handleCollect: () => void,
    network: Network | null
}


const AccountSettings: React.FC<Props> = (props: Props) => {
    
    const getPctBalance = useRef<() => Promise<HundredBalance | null> | null>(() : null => {return null})
    const getPctEarned = useRef<() => Promise<HundredBalance> | null>((): null => {return null})
    const setPctBalance = useRef<React.Dispatch<React.SetStateAction<HundredBalance | null>>>(props.setPctBalance)
    const setPctEarned = useRef<React.Dispatch<React.SetStateAction<HundredBalance | null>>>(props.setPctEarned)



    getPctBalance.current = async () => {
        if(props.network && props.provider){
            if (props.network.chainId === "0x2a")
                return new HundredBalance( BigNumber.from(0), 18, "HND")    
            const contract = new ethers.Contract(props.network.HUNDRED_ADDRESS, HUNDRED_ABI, props.provider)
            const balance = await contract.balanceOf(props.address)
            const decimals = await contract.decimals()
            const symbol = await contract.symbol()
            return new HundredBalance( balance, decimals, symbol)
        }
        return null
    }

    getPctEarned.current = async () => {
      //const contract = new ethers.Contract(COMPOUND_LENS_ADDRESS, COMPOUNT_LENS_ABI, props.provider)
      return new HundredBalance (BigNumber.from("0"), 18, "HND")//await contract.getCompBalanceMetadata(HUNDRED_ADDRESS, props.address)
    }

    useEffect(() => {
        const getPctBalances = async() => {
            const pct_temp = await getPctBalance?.current()
            const pct_earned = await getPctEarned?.current()
            
            setPctBalance?.current(pct_temp)
            setPctEarned?.current(pct_earned)
        }

        if (props.provider && props.address!=="")
            getPctBalances()
        else{
            setPctBalance.current(null)
        }

    }, [props.provider, props.address])

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
                <div className="account-settings-item-label"><label>100 Balance </label><span>{props.pctBalance ? props.pctBalance?.balance.gt(BigNumber.from(0)) ? props.pctBalance?.toFixed(4) : "0" : "--"}</span></div>
                <div className="account-settings-item-label"><label>100 Earned </label><span>{props.pctEarned ? props.pctEarned?.balance.gt(BigNumber.from(0)) ? props.pctEarned?.toFixed(4) : "0" : "--"}</span></div>
                <div className={`${props.pctSpinner ? "account-settings-item-button-disabled" : "account-settings-item-button"}`} onClick={() => !props.pctSpinner ? props.handleCollect() : null}>
                    {props.pctSpinner ? (<Spinner size={"20px"}/>) : "Collect"}</div>
            </div>
        </div>
    )
}

export default AccountSettings