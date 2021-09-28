import React, { useRef } from "react"
import { getShortenAddress } from "../../helpers"
import {Network, NETWORKS} from "../../networks"
import Jazzicon, { jsNumberForAddress } from "react-jazzicon"
import "./style.css"

interface Props{
    address: string,
    setAddress: React.Dispatch<React.SetStateAction<string>>,
    setOpenAddress: React.Dispatch<React.SetStateAction<boolean>>,
    setNetwork: React.Dispatch<React.SetStateAction<Network | null>>,
    setSideMenu: React.Dispatch<React.SetStateAction<boolean>>
}

const AddressButton: React.FC<Props> = (props: Props) => {

    const setAddress = useRef<React.Dispatch<React.SetStateAction<string>> | null>(null)
    const setOpenAddress = useRef<React.Dispatch<React.SetStateAction<boolean>> | null>(null)
    const address = useRef<string>()

    setAddress.current = props.setAddress
    setOpenAddress.current = props.setOpenAddress
    address.current = props.address

    const handleConnect = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                if (accounts && accounts.length > 0 && setAddress.current)
                    setAddress.current( accounts[0])

                window.ethereum.on('chainChanged', (chainId: string) => {
                    const net = NETWORKS[chainId]
                    if (net)
                        props.setNetwork(net)
                })
                window.ethereum.on('accountsChanged', (accounts: string[]) => {
                    if (accounts && accounts.length > 0){
                        props.setAddress(accounts[0])
                    }
                    else
                        props.setAddress("")
                }) 
            } catch (error: any) {
              if (error.code === 4001) {
                // User rejected request
              }
          
              console.log(error)
            }
        }
    }

    const handleAddress = () => {
        if(setOpenAddress.current)
            setOpenAddress.current(true)
        props.setSideMenu(true)
    }

    return (
        <div className="address-button" onClick={() => props.address ? handleAddress() : handleConnect()}>
            {
                props.address ? 
                    (<div className="address">
                            <Jazzicon diameter={20} seed={jsNumberForAddress(props.address)} />
                            {getShortenAddress(props.address)}
                            <span className="arrow">&#9660;</span>
                        
                    </div>) : <span>Connect</span>
            }
        </div>
    )
}

export default AddressButton