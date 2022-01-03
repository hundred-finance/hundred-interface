import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

const useENS = (address: string | null | undefined): { ensName: string | null } => {
    const [ensName, setENSName] = useState<string | null>(null);

    useEffect(() => {
        const resolveENS = async () => {
            if (address && ethers.utils.isAddress(address)) {
                const provider = ethers.providers.getDefaultProvider();
                const ensName = await provider.lookupAddress(address);
                setENSName(ensName);
            }
        };
        resolveENS();
    }, [address]);

    return { ensName };
};

export default useENS;
