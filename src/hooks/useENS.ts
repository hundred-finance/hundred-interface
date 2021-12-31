import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

const useENS = (address: string | null | undefined): { ensName: string | null } => {
    const [ensName, setENSName] = useState<string | null>(null);

    useEffect(() => {
        const resolveENS = async () => {
            if (address && ethers.utils.isAddress(address)) {
                const provider = new ethers.providers.JsonRpcProvider(
                    'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
                );
                const ensName = await provider.lookupAddress(address);
                setENSName(ensName);
            }
        };
        resolveENS();
    }, [address]);

    return { ensName };
};

export default useENS;
