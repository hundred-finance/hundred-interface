import React, { useEffect, useRef } from "react"
import { getShortenAddress } from "../../helpers"
import {ethers} from "ethers"
import "./style.css"

const AddressButton = (props) => {

    var setAddress = useRef(() => {})
    var address = useRef()

    setAddress.current = props.setAddress
    address.current = props.address

    useEffect (()=>{
        const GetAccount= async () => {
          if(props.provider !== null){
            var account = await props.provider.listAccounts()
      
            if (account && account.length > 0){
                if(address.current !== ""){
                    const addr = account.find(element => element === address.current)//'0x87616fA850c87a78f307878f32D808dad8f4d401' 
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
        props.openAddress(true)
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