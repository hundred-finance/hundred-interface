import React from "react"
import { Network, NETWORKS } from "../../networks"
import "./networksView.css"

interface Props {
    network : Network | null
}

interface SwitchEthereumChainParameter {
    chainId: string
}

interface AddEthereumChainParameter {
    chainId: string; // A 0x-prefixed hexadecimal string
    chainName: string;
    nativeCurrency: {
      name: string;
      symbol: string; // 2-6 characters long
      decimals: 18;
    };
    rpcUrls: string[];
    blockExplorerUrls?: string[];
    iconUrls?: string[]; // Currently ignored.
  }

  type errorType = {
      code: number
  }

const NetworksView : React.FC<Props> = ({network} : Props) => {

    const switchNetwork = async(item: Network):Promise<void> => {
        try {
            const net: SwitchEthereumChainParameter = { chainId : item.chainId }
            if (window.ethereum){
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [net]
                })
            }
        } catch (error) {
            if((error as errorType).code !== 4001)
                handleNetworkClick(item)
        }
    }
    
    const handleNetworkClick = async (item: Network):Promise<void> => {
        if(item.chainId === "0x1" || item.chainId === "0x2a"){
            return
        }

        const net: AddEthereumChainParameter = {chainId : item.chainId,
                                                chainName: item.network,
                                                nativeCurrency:{
                                                    name: item.symbol,
                                                    symbol: item.symbol,
                                                    decimals: 18
                                                },
                                                rpcUrls: item.rpcUrls ? item.rpcUrls : [],
                                                blockExplorerUrls: item.blockExplorerUrls ? item.blockExplorerUrls : []
                                            }
        
        if (window.ethereum) {
            try {
              await window.ethereum.request({ 
                  method: 'wallet_addEthereumChain',
                  params: [net]
                })
            }
            catch(err){
                console.log(err)
            }
        }
    }
    return (
        <div className="networks-view">
            <div className="networks-caption">Networks</div>
            {
                Object.values(NETWORKS).map(( value, index) => {
                    return(
                        <div className={`network-item ${value.chainId === network?.chainId ? "network-selected" : ""}`} key={index} onClick={() => value.chainId === network?.chainId ? null : switchNetwork(value)}>
                            <img src={value.logo} className="network-logo" alt="" />
                            <span>{value.network}</span>
                        </div>  
                    ) 
                })
            }
        </div>
    )
}

export default NetworksView