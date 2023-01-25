import Modal from "../Modal/modal"
import React from "react"
import mm from '../../assets/icons/mm.png'
import wc from '../../assets/icons/wc.png'
import cbw from '../../assets/icons/cbw.png'
import ud from '../../assets/icons/unstoppable.png'
import xdefi from "../../assets/icons/XDEFIWallet.jpeg"
import { connectrorsEnum, GetConnector } from "../../Connectors/connectors"
import { useUiContext } from "../../Types/uiContext"
import { useWeb3React } from "@web3-react/core"
import { providers } from "ethers"
import { useGlobalContext } from "../../Types/globalContext"
import "./wallets.css"

const Wallets: React.FC = () =>{
    const {showWallets, setShowWallets} = useUiContext()
    const {network} = useGlobalContext()
    const { activate } = useWeb3React<providers.Web3Provider>()

    const handleConnect = (c: any) => {
        setShowWallets(false)
        const con = GetConnector(c, network ? network.chainId : undefined)
        console.log(con)
      //   setActivatingConnector(con)
        try{
            activate( con )
          window.localStorage.setItem("hundred-provider", c)
        }
        catch(err){
          console.log(err)
        }
    }

    return(
        <Modal open={showWallets} close={() => setShowWallets(false)} title="Connect Wallet">
                <div className='wallets'>
                    <div className='wallet-item' onClick={() => handleConnect(connectrorsEnum.Metamask)}>
                        <div className='wallet-item-icon'>
                            <img src={mm} alt=""/>
                        </div>
                        <div className='wallet-item-name'>Metamask</div>
                    </div>
                    <div className='wallet-item' onClick={() => handleConnect(connectrorsEnum.WalletConnect)}>
                        <div className='wallet-item-icon'>
                            <img src={wc} alt=""/>
                        </div>
                        <div className='wallet-item-name'>Wallet Connect</div>
                    </div>
                    <div className='wallet-item' onClick={() => handleConnect(connectrorsEnum.Coinbase)}>
                        <div className='wallet-item-icon'>
                            <img src={cbw} alt=""/>
                        </div>
                        <div className='wallet-item-name'>Coinbase Wallet</div>
                    </div>
                    <div className='wallet-item' onClick={() => handleConnect(connectrorsEnum.Unstoppable)}>
                        <div className='wallet-item-icon'>
                            <img src={ud} alt=""/>
                        </div>
                        <div className='wallet-item-name'>Unstoppable Domains</div>
                    </div>
                    <div className='wallet-item' onClick={() => handleConnect(connectrorsEnum.xDefi)}>
                        <div className='wallet-item-icon'>
                            <img src={xdefi} alt=""/>
                        </div>
                        <div className='wallet-item-name'>xDefi Wallet</div>
                    </div>
                </div>
            </Modal>
    )
}

export default Wallets
