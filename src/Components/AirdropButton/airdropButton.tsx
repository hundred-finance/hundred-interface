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
    const [airdrop, setAirdrop] = useState<AirdropType[] | null>()
    const [airdrop1Amount, setAirdrop1Amount] = useState<BigNumber | null>(BigNumber.from("0"))
    const [airdrop2Amount, setAirdrop2Amount] = useState<BigNumber | null>(BigNumber.from("0"))
    const [airdropSymbol, setAirdropSymbol] = useState<string>("")
    const [airdrop1Contract, setAirDrop1Contract] = useState<string>("")
    const [airdrop2Contract, setAirDrop2Contract] = useState<string>("")
    const [spinner, setSpinner] = useState<boolean>(false)
    const [merkleTree1, setMerkleTree1] = useState<MerkleTree>()
    const [merkleTree2, setMerkleTree2] = useState<MerkleTree>()
    const [hasClaimed1, setHasClaimed1] = useState<boolean>(true)
    const [hasClaimed2, setHasClaimed2] = useState<boolean>(true)

    useEffect(() => {
        const getAirdrop = async (network: Network, userAddress: string, provider: ethers.providers.Web3Provider) => {
            const airdrop = Airdrop[network.chainId]
            const calls: any[] = []
            if(airdrop){
                const airdrops = Object.values(airdrop).map(a => {
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
                        return airdropValue
                    }
                    return
                })
    
                const ethcallProvider = new Provider()
                await ethcallProvider.init(provider)
                if(network.multicallAddress) {
                    ethcallProvider.multicallAddress = network.multicallAddress
                }
    
                const hasClaimed = await ethcallProvider.all(calls)
                console.log(hasClaimed)
                if(hasClaimed && airdrops && hasClaimed.length === airdrops.length){
                    airdrops.forEach((x, index) => {
                        if(x)
                            x.hasClaimed = !hasClaimed[index]
                    })
                }
            }
        } 
        


        if(props.address != "" && props.network && props.provider){
            
            getAirdrop(props.network, "0x87616fA850c87a78f307878f32D808dad8f4d401", props.provider)
            
            const airdrop1 = props.network && Airdrop[props.network.chainId] ? Airdrop[props.network.chainId].airdrop1 : null
            const airdrop2 = props.network && Airdrop[props.network.chainId] ? Airdrop[props.network.chainId].airdrop2 : null
            const accounts1 = airdrop1 ? airdrop1.accounts : null
            const accounts2 = airdrop2 ? airdrop2.accounts : null
            const hasAirdrop1= accounts1 ? Object.keys(accounts1).find(x=> x.toLowerCase() === props.address.toLowerCase()) : null
            const hasAirdrop2= accounts2 ? Object.keys(accounts2).find(x=> x.toLowerCase() === props.address.toLowerCase()) : null
            const amount1 = hasAirdrop1 && accounts1 ? accounts1[hasAirdrop1] : null
            const amount2 = hasAirdrop2 && accounts2 ? accounts2[hasAirdrop2] : null

            if(airdrop1 && amount1) {
                setAirdropSymbol(airdrop1.symbol)
                setAirdrop1Amount(BigNumber.from(amount1, 18))
                setAirDrop1Contract(airdrop1.contract)
                getHasClaimed(airdrop1.contract, props.address, props.provider)
                    .then(claimed => setHasClaimed1(claimed))
                    .then(() => props.setHasClaimed(hasClaimed1 && hasClaimed2))
                const merkle = new MerkleTree(
                    Object.entries(airdrop1.accounts).map(([address, tokens]) =>
                        generateLeaf(
                            ethers.utils.getAddress(address),
                            tokens.toString()
                        )
                    ),
                    keccak256,
                    { sortPairs: true }
                )

                setMerkleTree1(merkle)
            }

            if(airdrop2 && amount2) {
                setAirdropSymbol(airdrop2.symbol)
                setAirdrop2Amount(BigNumber.from(amount2, 18))
                setAirDrop2Contract(airdrop2.contract)
                getHasClaimed(airdrop2.contract, props.address, props.provider)
                    .then(claimed => setHasClaimed2(claimed))
                    .then(() => props.setHasClaimed(hasClaimed1 && hasClaimed2))
                const merkle = new MerkleTree(
                    Object.entries(airdrop2.accounts).map(([address, tokens]) =>
                        generateLeaf(
                            ethers.utils.getAddress(address),
                            tokens.toString()
                        )
                    ),
                    keccak256,
                    { sortPairs: true }
                )

                setMerkleTree2(merkle)
            }
        }
        
    }, [props.address, props.network, props.provider])

    const getHasClaimed = async (contractAddress: string, userAddress: string, provider: ethers.providers.Web3Provider) : Promise<boolean> => {
        const airContract = new ethers.Contract(contractAddress, AIRDROP_ABI, provider)
        return await airContract.hasClaimed(userAddress)
    }
    
    function generateLeaf(address: string, value: string): Buffer {
        return Buffer.from(
            ethers.utils
                .solidityKeccak256(["address", "uint256"], [address, value])
                .slice(2),
            "hex"
        );
    }

    const airdropAmount = (): BigNumber => {
        const amount1 = airdrop1Amount && !hasClaimed1 ? +airdrop1Amount.toString() : 0
        const amount2 = airdrop2Amount && !hasClaimed2 ? +airdrop2Amount.toString() : 0

        console.log(hasClaimed1)
        console.log(hasClaimed2)
        return BigNumber.parseValue((amount1 + amount2).noExponents())
    };

    const handleClaim = async () : Promise<void> => {
        try{

            if (props.provider) {

                if(!hasClaimed1 && airdrop1Amount && merkleTree1 && airdrop1Contract !== ""){

                    const leaf: Buffer = generateLeaf(props.address, airdrop1Amount?._value.toString());
                    const proof = merkleTree1.getHexProof(leaf)
                    const signer = props.provider.getSigner()
                    const airContract = new ethers.Contract(airdrop1Contract, AIRDROP_ABI, signer)

                    const tx = await airContract.claim(props.address, airdrop1Amount._value, proof);
                    await tx.wait();
                }

                if(!hasClaimed2 && airdrop2Amount && merkleTree2 && airdrop2Contract !== ""){

                    const leaf: Buffer = generateLeaf(props.address, airdrop2Amount._value.toString());
                    const proof = merkleTree2.getHexProof(leaf)
                    const signer = props.provider.getSigner()
                    const airContract = new ethers.Contract(airdrop2Contract, AIRDROP_ABI, signer)

                    const tx = await airContract.claim(props.address, airdrop2Amount._value, proof);
                    await tx.wait();
                }

                setSpinner(true)
                props.setHasClaimed(true)
            }
        }
        catch(error){
            console.log(error)
        }
        finally{
            setSpinner(false)
        }
        
      }
    
    if(props.address === "" || !props.network || !props.provider || !(+airdropAmount().toString() > 0) || props.hasClaimed)
        return null
    else {
        return (
            <div className={`airdrop-button ${!spinner ? "airdrop-button-hover" : "airdrop-button-spinner"}`} onClick={() => spinner ? null : handleClaim()}>
                <div className="airdrop-button-content">
                    <span className="airdrop-name"><StarBpro active={true} backstop={false}/></span>
                    <span className="airdrop-amount">{airdropAmount().toRound(2)} {airdropSymbol}</span>
                </div>
                {spinner ? 
                    <div className="airdrop-spinner"><Spinner size={"30px"}/></div>
                    : null
                }
            </div>
        )
    }
}

export default AirdropButton