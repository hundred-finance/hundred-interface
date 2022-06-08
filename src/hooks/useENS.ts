import { UAuthConnector } from '@uauth/web3-react';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

const useENS = (address: string | null | undefined): { ensName: string | null } => {
    const [ensName, setENSName] = useState<string | null>(null);
    const { connector } = useWeb3React<ethers.providers.Web3Provider>()

    useEffect(() => {
        const resolveENS = async () => {
            if (address && connector && ethers.utils.isAddress(address)) {
                if(connector instanceof UAuthConnector){
                    (connector as UAuthConnector).uauth.user()
                    .then((user) => {
                        setENSName(user.sub)
                    })
                    .catch(() => {
                        console.log("No User Found")
                    })
                }
                else{
                    const provider = ethers.providers.getDefaultProvider();
                    const ensName = await provider.lookupAddress(address);
                    setENSName(ensName);
                }
            }
            else{
                setENSName(null)
            }
        };
        resolveENS();
    }, [address]);

    return { ensName };
};

export default useENS;
