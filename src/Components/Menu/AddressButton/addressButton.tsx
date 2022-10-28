import React from 'react';
import { getShortenAddress } from '../../../helpers';
import { useUiContext } from '../../../Types/uiContext';
import { useWeb3React } from '@web3-react/core';
import { providers } from 'ethers';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import Button from '../../Button/button';

const AddressButton: React.FC = () => {
    const {setShowWallets, setMobileMenuOpen, setAccountOpen} = useUiContext()
    const { account } = useWeb3React<providers.Web3Provider>()
    //const { address} = useGlobalContext()

    //const { ensName } = useENS(address);

    const openAccount = () => {
        setMobileMenuOpen(false)
        setAccountOpen(true)
    }

    const openWallets = () => {
        setMobileMenuOpen(false)
        setShowWallets(true)
    }

    return (
        account ? 
            <Button onClick={() => openAccount()} arrow={true} image={<Jazzicon diameter={30} seed={jsNumberForAddress(account)} />}>
                {getShortenAddress(account)}
            </Button>
        :
            <Button onClick={() => openWallets()}>
                <span>Connect</span>
            </Button>
    )
}

export default AddressButton;
