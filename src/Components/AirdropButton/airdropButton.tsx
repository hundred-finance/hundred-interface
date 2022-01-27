import {ethers} from "ethers";
import React, {useEffect, useState} from "react";
import {BigNumber} from "../../bigNumber";
import {Network} from "../../networks";
import StarBpro from "../StarBpro/starBpro";
import {Airdrop} from "./airdropAddresses";
import {MerkleTree} from "merkletreejs";
import keccak256 from "keccak256";
import "./airdropButton.css"
import {AIRDROP_ABI} from "../../abi";
import {Spinner} from "../../assets/huIcons/huIcons";
import {Contract, Provider} from "ethcall";

interface Props{
    network: Network | null,
    address: string,
    hasClaimed: boolean,
    setHasClaimed: React.Dispatch<React.SetStateAction<boolean>>,
    provider: ethers.providers.Web3Provider | null
}

type AirdropType = {
    amount: BigNumber,
    contract: string,
    merkle: MerkleTree,
    symbol: string,
    hasClaimed: boolean
}

const AirdropButton: React.FC<Props> = (props : Props) => {
    const [airdrop, setAirdrop] = useState<AirdropType[]>([])
    const [totalAmount, setTotalAmount] = useState<BigNumber>(BigNumber.from("0"))
    const [spinner, setSpinner] = useState<boolean>(false)

    useEffect(() => {
        const hasClaimedCall = async (calls: any[], ethcallProvider: Provider) => {
            try{
                return await ethcallProvider.all(calls)
            }
            catch{
                console.log("error")
                setTimeout(async () => await hasClaimedCall(calls, ethcallProvider), 1000)
            }
        }

        const getAirdrop = async (network: Network, userAddress: string, provider: ethers.providers.Web3Provider) => {
            const airdrop = Airdrop[network.chainId]
            const calls: any[] = []
            if(airdrop){
                const airdrops: AirdropType[] = []
                Object.values(airdrop).map(a => {
                    const hasAirdrop = Object.keys(a.accounts).find(x => x.toLowerCase() === userAddress.toLowerCase())
                    if (hasAirdrop)
                    {
                        const contract = new Contract(a.contract, AIRDROP_ABI)
                        calls.push(contract.hasClaimed(userAddress))
                        const merkle = new MerkleTree(
                            Object.entries(a.accounts).map(([address, tokens]) =>
                                generateLeaf(
                                    ethers.utils.getAddress(address),
                                    tokens.toString()
                                )
                            ),
                            keccak256,
                            { sortPairs: true }
                        )
                        const airdropValue: AirdropType = {
                            amount: BigNumber.from(a.accounts[hasAirdrop], 18),
                            contract: a.contract,
                            merkle: merkle,
                            symbol: a.symbol,
                            hasClaimed: false
                        }
                        airdrops.push(airdropValue)
                    }
                })
    
                const ethcallProvider = new Provider()
                await ethcallProvider.init(provider)
                if(network.multicallAddress) {
                    ethcallProvider.multicallAddress = network.multicallAddress
                }
    
                const hasClaimed = await hasClaimedCall(calls, ethcallProvider)

                if(hasClaimed && airdrops && airdrops.length > 0 && hasClaimed.length === airdrops.length){
                    airdrops.forEach((x, index) => {
                            x.hasClaimed = hasClaimed[index]
                    })
                }
                const claimable = airdrops.filter(x => !x.hasClaimed)
                
                setAirdrop(claimable)
                
            }
        } 
        
    
        if(props.network && props.address !== "" && props.provider && props.provider !== undefined){
            
            try{
                
                getAirdrop(props.network, props.address, props.provider)
                
            }
            catch(err){
                console.log(err)
                setAirdrop([])
            }
        }
        
    }, [props.provider, props.network])

    useEffect(() => {
        const claimable = airdrop?.filter(x=> !x.hasClaimed)
        airdropAmount(claimable)
    }, [airdrop])
    
    function generateLeaf(address: string, value: string): Buffer {
        return Buffer.from(
            ethers.utils
                .solidityKeccak256(["address", "uint256"], [address, value])
                .slice(2),
            "hex"
        );
    }

    const airdropAmount = (airdrops: AirdropType[]): void => {
        if(airdrops.length > 0){
            let amount = 0
            airdrops.forEach(x => amount = amount + +x.amount.toString())
            setTotalAmount(BigNumber.parseValue(amount.noExponents()))
            if(amount > 0) props.setHasClaimed(true)
            return
        }

        props.setHasClaimed(false)
        setTotalAmount(BigNumber.from("0"))
    };

    const handleClaim = async () : Promise<void> => {
        
        if (props.provider && airdrop) {
            const airdrops = [...airdrop]
            
            setSpinner(true)
            for(let i=0; i < airdrops.length; i++){
                if(props.provider){
                    try{
                        const leaf: Buffer = generateLeaf(props.address, airdrops[i].amount?._value.toString());
                        const proof = airdrops[i].merkle.getHexProof(leaf)
                        const signer = props.provider.getSigner()
                        const airContract = new ethers.Contract(airdrops[i].contract, AIRDROP_ABI, signer)
                        const tx = await airContract.claim(props.address, airdrops[i].amount._value, proof);
                        await tx.wait();
                        airdrops[i].hasClaimed = true
                    }
                    catch{}
                }
            }
            
            setAirdrop(airdrops.filter(x=> !x.hasClaimed))
            setSpinner(false)
        }
    }
    
      return (
            airdrop && airdrop.length > 0 && +totalAmount.toString() > 0 && props.hasClaimed ? 
            <div className={`airdrop-button ${!spinner ? "airdrop-button-hover" : "airdrop-button-spinner"}`} onClick={() => spinner ? null : handleClaim()}>
                <div className="airdrop-button-content">
                    <span className="airdrop-name"><StarBpro active={true} backstop={false}/></span>
                    <span className="airdrop-amount">{totalAmount.toRound(2)} {airdrop[0].symbol}</span>
                </div>
                {spinner ? 
                    <div className="airdrop-spinner"><Spinner size={"30px"}/></div>
                    : null
                }
            </div>
            : null
        )
}

export default AirdropButton