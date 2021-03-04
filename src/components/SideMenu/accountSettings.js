import BigNumber from "bignumber.js"
import React, { useEffect, useState, useRef } from "react"
import { getShortenAddress, zeroStringIfNullish } from "../../helpers"
import "./style.css"
import {ethers} from "ethers"
import {PCT_ADDRESS, PCT_ABI, COMPOUND_LENS_ADDRESS, COMPOUNT_LENS_ABI} from "../../constants"

const AccountSettings = (props) => {
    const [pctBalance, setPctBalance] = useState(null)
    const [pctEarned, setPctEarned] = useState(null)

    const getPctBalance = useRef(() => {})
    const getPctEarned = useRef(() => {})


    getPctBalance.current = async () => {
      console.log("get pct")
      const contract = new ethers.Contract(PCT_ADDRESS, PCT_ABI, props.provider)
      console.log(contract)
      return {
        pct_balance : await contract.balanceOf(props.address),
        decimals : await contract.decimals(),
        symbol : await contract.symbol()
      }
    }

    getPctEarned.current = async () => {
      const contract = new ethers.Contract(COMPOUND_LENS_ADDRESS, COMPOUNT_LENS_ABI, props.provider)
      return await contract.getCompBalanceMetadata(PCT_ADDRESS, props.address)
    }

    useEffect(() => {
        const getPctBalances = async() => {
            var pct_temp = await getPctBalance?.current()
            var pct_earned = await getPctEarned?.current()
            setPctBalance(pct_temp)
            setPctEarned(pct_earned)
        }

        if (props.provider && props.address!=="")
            getPctBalances()
        else{
            setPctBalance(null)
        }

    }, [props.provider, props.address])

    const handleDisconnect = () => {
        props.setSideMenu(false) 
        props.setOpenAddress(false)
        props.setAddress("")
    }

    const handleCollect = () => {

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
                <div className="account-settings-item-label"><label>PCT Balance </label><span>{pctBalance ? `${zeroStringIfNullish(new BigNumber(pctBalance.pct_balance).decimalPlaces(4).toString())}`: "--"}</span></div>
                <div className="account-settings-item-label"><label>PCT Earned </label><span>{pctEarned ? `${zeroStringIfNullish(new BigNumber(pctEarned).decimalPlaces(4).toString())}` : "--"}</span></div>
                <div className="account-settings-item-button" onClick={() => handleCollect()}>Collect</div>
            </div>
        </div>
    )
}

export default AccountSettings