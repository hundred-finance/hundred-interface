import React, { useEffect, useRef } from "react"
import { getShortenAddress } from "../../helpers"
import {ethers} from "ethers"
import "./style.css"

const AddressButton = (props) => {

    const setAddress = useRef(() => {})
    const setOpenAddress = useRef(() => {})
    const address = useRef()
    const setProvider = useRef(() => {})

    setAddress.current = props.setAddress
    setOpenAddress.current = props.setOpenAddress
    address.current = props.address
    setProvider.current = props.setProvider

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

      },[props.provider, props.setProvider])

    const handleConnect = async () => {
        if (window.ethereum) {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                window.ethereum.on('chainChanged', () => {
                    document.location.reload()
                })
                window.ethereum.on('accountsChanged', (accounts) => {
                    setAddress.current("")
                }) 
            } catch (error) {
              if (error.code === 4001) {
                // User rejected request
              }
          
              console.log(error)
            }
        }
        try {
            
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