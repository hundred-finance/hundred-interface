import { useWeb3React } from "@web3-react/core"
import { ethers } from "ethers"
import React, { useEffect } from "react"
import { getShortenAddress } from "../../helpers"
import { useGlobalContext } from "../../Types/globalContext"
import { useUiContext } from "../../Types/uiContext"
import Button from "../Button/button"
import Modal from "../Modal/modal"
import "./account.css"

const Account: React.FC = () => {
    const {accountOpen, setAccountOpen} = useUiContext()
    const {address, setAddress, network} = useGlobalContext()
    const { connector, deactivate, account} = useWeb3React<ethers.providers.Web3Provider>()

    const handleDisconnect = () => {
        try{
            (connector as any).close()
        }
        catch{}
    
        window.localStorage.removeItem("provider")
        deactivate()

        setAccountOpen(false)
        setAddress("")
    }

    useEffect(() => {
        if (account)
            setAddress("0xd491447348c474af15c40839d3e0056a80fec352")
    }, [account])

    return (
        <Modal open={accountOpen} close={() => setAccountOpen(false)} title="Address" maxheight="220px">
                <div className="account-settings">
                    <div className="account-settings-address">
                        <div className="network-logo">
                            <img src={network?.logo} alt="" />
                        </div>
                        <span>{getShortenAddress(address)}</span>
                    </div>
                    <Button onClick={() => handleDisconnect()}>
                        <span>Disconnect</span>
                    </Button>
                    
                </div>
        </Modal>
    )
}

export default Account