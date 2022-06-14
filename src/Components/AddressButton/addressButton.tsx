import React, { useEffect, useState } from 'react';
import { getShortenAddress } from '../../helpers';
import './style.css';
import useENS from '../../hooks/useENS';
import { useUiContext } from '../../Types/uiContext';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import Modal from '../Modal/modal';
import mm from '../../assets/icons/mm.png'
import wc from '../../assets/icons/wc.png'
import cbw from '../../assets/icons/cbw.png'
import ud from '../../assets/icons/unstoppable.png'
import { useGlobalContext } from '../../Types/globalContext';
import { ethers } from 'ethers';
import { connectrorsEnum, GetConnector, getErrorMessage } from '../../Connectors/connectors';
import NETWORKS from '../../networks';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

const AddressButton: React.FC = () => {
    const {setOpenAddress, setSideMenu, setOpenNetwork, setSwitchModal} = useUiContext()
    const { chainId, account, activate, error, connector} = useWeb3React<ethers.providers.Web3Provider>()
    const { setNetwork, network, address, setAddress} = useGlobalContext()

    const [showModal, setShowModal] = useState(false)
    const [showError, setShowError] = useState(false)

    const { ensName } = useENS(address);

    const handleAddress = () => {
        setOpenAddress(true);
        setSideMenu(true);
    };

    const openSwitchNetwork = () => {
        setShowError(false)
        setSideMenu(true)
        setOpenNetwork(true)
    }

    const handleConnect = (c: any) => {
        setShowModal(false)
        const con = GetConnector(c, network ? network.chainId : undefined)
      //   setActivatingConnector(con)
        try{
          activate( con )
          window.localStorage.setItem("hundred-provider", c)
          console.log(connector)
        }
        catch(err){
          console.log(err)
        }
    }

    useEffect(() => {
        console.log(connector)
    }, [connector])

    useEffect(() => {
        setSwitchModal(false)
        setOpenNetwork(false)
        setSideMenu(false)
      if(chainId){
        const net = NETWORKS[chainId]
        if(net) setNetwork(net)
        else console.log("Unsuported Network")
      }
      else setNetwork(null)
    }, [chainId])
  
    useEffect(() => {
        if(error){
        console.log(error)
          setShowError(true)
        }
    }, [error])

    useEffect(() => {
        if(account) 
            setAddress(account)
        else if(!error) 
            setAddress("")
    }, [account])

    return (
        <>
            <div className="address-button" onClick={() => (account ? handleAddress() : setShowModal(true))}>
                {account ? (
                    <div className="address">
                        <Jazzicon diameter={30} seed={jsNumberForAddress(account)} />
                        {ensName || getShortenAddress(account)}
                        <span className="arrow">&#9660;</span>
                    </div>
                ) : (
                    <span>Connect</span>
                )}
            </div>
            <Modal open={showModal} close={() => setShowModal(false)} title="Connect Wallet">
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
                </div>
            </Modal>
            <Modal open={showError} close={() => setShowError(false)} title="Error">
                <div className='modal-error'>
                    <div className='modal-error-message'>
                        <span>{getErrorMessage(error)}</span>
                        {error instanceof UnsupportedChainIdError ? (
                            <><p>Please <span className='modal-error-switch'onClick={ openSwitchNetwork }>switch</span></p></>
                        ) : null}
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default AddressButton;
