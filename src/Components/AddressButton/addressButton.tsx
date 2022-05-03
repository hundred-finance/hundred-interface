import React, { useEffect, useRef, useState } from 'react';
import { getShortenAddress } from '../../helpers';
import './style.css';
import useENS from '../../hooks/useENS';
import Davatar from '@davatar/react';
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

interface Props {
    address: string;
    setAddress: React.Dispatch<React.SetStateAction<string>>;
}

const AddressButton: React.FC<Props> = (props: Props) => {
    const {setOpenAddress, setSideMenu, setOpenNetwork, setSwitchModal} = useUiContext()
    const { chainId, account, activate, error} = useWeb3React<ethers.providers.Web3Provider>()
    const { setNetwork, network} = useGlobalContext()

    const [showModal, setShowModal] = useState(false)
    const [showError, setShowError] = useState(false)

    const setAddress = useRef<React.Dispatch<React.SetStateAction<string>> | null>(null);
    const address = useRef<string>();
    const { ensName } = useENS(props.address);

    setAddress.current = props.setAddress;
    address.current = props.address;

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
        console.log(error)
        if(error){
          setShowError(true)
        }
    }, [error])

    useEffect(() => {
        if(account) 
            props.setAddress(account)
        else if(!error) 
            props.setAddress("")
    }, [account])

    return (
        <>
            <div className="address-button" onClick={() => (account ? handleAddress() : setShowModal(true))}>
                {account ? (
                    <div className="address">
                        <Davatar size={30} address={account} generatedAvatarType="jazzicon" />
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
