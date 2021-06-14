import React from "react"
import { Network, NETWORKS } from "../../networks"
import "./networksView.css"

interface Props {
    network : Network | null
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

const NetworksView : React.FC<Props> = ({network} : Props) => {
    
    const handleNetworkClick = async (item: Network):Promise<void> => {
        if(item.chainId === "0x1" || item.chainId === "0x2a"){
            alert(`Please switch to ${item.network} from Metamask.`)
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
                                                blockExplorerUrls: item.blockExplorelUrls ? item.blockExplorelUrls : []
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
                        <div className={`network-item ${value.chainId === network?.chainId ? "network-selected" : ""}`} key={index} onClick={() => handleNetworkClick(value)}>
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