import React, { useRef } from "react"
import { getShortenAddress } from "../../helpers"
import "./style.css"

const AddressButton = (props) => {

    const setAddress = useRef(() => {})
    const setOpenAddress = useRef(() => {})
    const address = useRef()

    setAddress.current = props.setAddress
    setOpenAddress.current = props.setOpenAddress
    address.current = props.address

    const handleConnect = async () => {
        if (window.ethereum) {
            try {
                var accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                if (accounts && accounts.length > 0)
                    setAddress.current( accounts[0])

                window.ethereum.on('chainChanged', (chainId) => {
                    props.setNetwork(chainId)
                })
                window.ethereum.on('accountsChanged', (accounts) => {
                    if (accounts && accounts.length > 0){
                        props.setAddress(accounts[0])
                    }
                    else
                        props.setAddress("")
                }) 
            } catch (error) {
              if (error.code === 4001) {
                // User rejected request
              }
          
              console.log(error)
            }
        }
    }

    const handleAddress = () => {
        setOpenAddress.current(true)
        props.setSideMenu(true)
    }

    return (
        <div className="address-button" onClick={() => props.address ? handleAddress() : handleConnect()}>
            {
                props.address ? 
                    (<div className="address">
                        
                            {getShortenAddress(props.address)}
                            <span className="arrow">&#9660;</span>
                        
                    </div>) : <span>Connect</span>
            }
        </div>
    )
}

export default AddressButton