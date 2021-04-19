import React, { useEffect, useRef } from "react"
import { getShortenAddress } from "../../helpers"
import {ethers} from "ethers"
import "./style.css"

const AddressButton = (props) => {

    const setAddress = useRef(() => {})
    const setOpenAddress = useRef(() => {})
    const address = useRef()

    setAddress.current = props.setAddress
    setOpenAddress.current = props.setOpenAddress
    address.current = props.address

    useEffect (()=>{
        const GetAccount= async () => {
          if(props.provider !== null){
            var account = await props.provider.listAccounts()
      
            if (account && account.length > 0){
                if(address.current !== ""){
                    const addr = account.find(element => element === address.current)
                    if(addr)
                        setAddress.current(addr)
                    else
                        setAddress.current("")
                }
                else
                    setAddress.current(account[0])
            }
          }
        }
      
        GetAccount()

      },[props.provider])

    const handleConnect = async () => {
        try {
            await window.ethereum.enable()
            const prov = new ethers.providers.Web3Provider(window.ethereum)
            props.setProvider(prov)
          }
          catch (err){
            console.log(err)
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