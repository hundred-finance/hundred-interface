import BigNumber from "bignumber.js"
import React, { useEffect, useRef } from "react"
import { getShortenAddress, zeroStringIfNullish } from "../../helpers"
import "./style.css"
import {ethers} from "ethers"
import {PCT_ABI, NETWORKS} from "../../constants"
import { Spinner } from "../../assets/huIcons/huIcons"

const AccountSettings = (props) => {
    
    const getPctBalance = useRef(() => {})
    const getPctEarned = useRef(() => {})
    const setPctBalance = useRef(() => {})
    const setPctEarned = useRef(() => {})

    setPctBalance.current = props.setPctBalance
    setPctEarned.current = props.setPctEarned

    getPctBalance.current = async () => {
      const contract = new ethers.Contract(NETWORKS[window.ethereum.chainId].HUNDRED_ADDRESS, PCT_ABI, props.provider)
      console.log(contract)
      return {
        pct_balance : await contract.balanceOf(props.address),
        decimals : await contract.decimals(),
        symbol : await contract.symbol()
      }
    }

    getPctEarned.current = async () => {
      //const contract = new ethers.Contract(COMPOUND_LENS_ADDRESS, COMPOUNT_LENS_ABI, props.provider)
      return 0//await contract.getCompBalanceMetadata(HUNDRED_ADDRESS, props.address)
    }

    useEffect(() => {
        const getPctBalances = async() => {
            var pct_temp = await getPctBalance?.current()
            var pct_earned = await getPctEarned?.current()
            setPctBalance.current(pct_temp)
            setPctEarned.current(pct_earned)
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
                <div className="account-settings-item-label"><label>100 Balance </label><span>{props.pctBalance ? `${zeroStringIfNullish(new BigNumber(props.pctBalance.pct_balance).decimalPlaces(4).toString())}`: "--"}</span></div>
                <div className="account-settings-item-label"><label>100 Earned </label><span>{props.pctEarned ? `${zeroStringIfNullish(new BigNumber(props.pctEarned).decimalPlaces(4).toString())}` : "--"}</span></div>
                <div className={`${props.pctSpinner ? "account-settings-item-button-disabled" : "account-settings-item-button"}`} onClick={() => !props.pctSpinner ? props.handleCollect() : null}>
                    {props.pctSpinner ? (<Spinner size={"20px"}/>) : "Collect"}</div>
            </div>
        </div>
    )
}

export default AccountSettings