import { useWeb3React } from "@web3-react/core"
import { WalletConnectConnector } from "@web3-react/walletconnect-connector"
import React from "react"
import { toHex } from "../../helpers"
import NETWORKS from "../../networks"
import { useGlobalContext } from "../../Types/globalContext"
import { useUiContext } from "../../Types/uiContext"
import Modal from "../Modal/modal"
import "./networksView.css"

const NetworksView : React.FC = () => {

    const { connector, library } = useWeb3React()
    const {network, setNetwork} = useGlobalContext()
    
    const {setOpenNetwork, setSideMenu, setSwitchModal, switchModal} = useUiContext()

    const switchNetwork = async (chain: number) => {
      if (connector instanceof WalletConnectConnector){
        setSwitchModal(true)
      }
      if (connector){
        try {
            if(library)
                await library.provider.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: toHex(chain) }]
                });
            else{
                const prov = await connector.getProvider()
                if(prov)
                    await prov.request({
                        method: "wallet_switchEthereumChain",
                        params: [{ chainId: toHex(chain) }]
                    });
            }
            setSwitchModal(false)
            setOpenNetwork(false)
            setSideMenu(false)
        } catch (switchError: any) {
          console.log(switchError)
          if (switchError.code === 4902) {
            try {
                if(library)
                    await library.provider.request({
                        method: "wallet_addEthereumChain",
                        params: [NETWORKS[chain].networkParams]
                    });
                else{
                    const prov = await connector.getProvider()
                    await prov.request({
                        method: "wallet_addEthereumChain",
                        params: [NETWORKS[chain].networkParams]
                    });
                }
                setSwitchModal(false)
                setOpenNetwork(false)
                setSideMenu(false)
            } catch (error) {
              console.log("Error" , error)
            }
          }
        }
      }
      else{
        setNetwork(NETWORKS[chain])
      }
    };
    
    return (
        <>
        <div className="networks-view">
            <div className="networks-caption">Networks</div>
            {
                Object.values(NETWORKS).map(( value, index) => {
                    return(
                        <div className={`network-item ${value.chainId === network?.chainId ? "network-selected" : ""}`} key={index} onClick={() => value.chainId === network?.chainId ? null : switchNetwork(value.chainId)}>
                            <img src={value.logo} className="network-logo" alt="" />
                            <span>{value.network}</span>
                        </div>  
                    ) 
                })
            }
        </div>
        <Modal open={switchModal} close={() => setSwitchModal(false)} title="Switch Network">
                <div className='modal-error'>
                    <div className='modal-error-message'>
                        <p>
                            Please switch from your wallet.
                        </p>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default NetworksView