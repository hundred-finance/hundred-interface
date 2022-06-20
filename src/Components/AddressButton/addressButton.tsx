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
import xdefi from "../../assets/icons/XDEFIWallet.jpeg"
import { useGlobalContext } from '../../Types/globalContext';
import { providers } from 'ethers';
import { connectrorsEnum, GetConnector, getErrorMessage } from '../../Connectors/connectors';
import NETWORKS from '../../networks';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { XDEFIWalletNotDefaultError, XDEFIWalletNotFoundError } from '../../Connectors/xdefi-connector';
import { MetamaskNotFounfError } from '../../Connectors/metamask-connector';

const AddressButton: React.FC = () => {
    const {setOpenAddress, setSideMenu, setOpenNetwork, setSwitchModal} = useUiContext()
    const { chainId, account, activate, error} = useWeb3React<providers.Web3Provider>()
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
                    <div className='wallet-item' onClick={() => handleConnect(connectrorsEnum.xDefi)}>
                        <div className='wallet-item-icon'>
                            <img src={xdefi} alt=""/>
                        </div>
                        <div className='wallet-item-name'>xDefi Wallet</div>
                    </div>
                </div>
            </Modal>
            {error instanceof UnsupportedChainIdError ? (
            <Modal open={showError} close={() => setShowError(false)} title="Error">
                <div className='modal-error'>
                    <div className='modal-error-message'>
                        <span>{getErrorMessage(error)}</span>
                        <><p>Please <span className='modal-error-switch'onClick={ openSwitchNetwork }>switch</span></p></>
                    </div>
                </div>
            </Modal>)
            : error instanceof XDEFIWalletNotFoundError || error instanceof XDEFIWalletNotDefaultError || error instanceof MetamaskNotFounfError? (
                <Modal open={showError} close={() => setShowError(false)} title="Error">
                    <div className='modal-error'>
                        <div className='modal-error-message'>
                            <span>{getErrorMessage(error)}</span>
                        </div>
                    </div>
                </Modal>) : null}
        </>
    );
};

export default AddressButton;
