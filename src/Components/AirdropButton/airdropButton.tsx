import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { BigNumber } from "../../bigNumber";
import { Network } from "../../networks";
import StarBpro from "../StarBpro/starBpro";
import { Airdrop } from "./airdropAddresses";
import {MerkleTree} from "merkletreejs";
import keccak256 from "keccak256";
import "./airdropButton.css"
import { AIRDROP_ABI } from "../../abi";
import { Spinner } from "../../assets/huIcons/huIcons";

interface Props{
    network: Network | null,
    address: string,
    hasClaimed: boolean,
    setHasClaimed: React.Dispatch<React.SetStateAction<boolean>>,
    provider: ethers.providers.Web3Provider | null
}

const AirdropButton: React.FC<Props> = (props : Props) => {
    const [airdropAmount, setAirdropAmount] = useState<BigNumber | null>(BigNumber.from("0"))
    const [airdropSymbol, setAirdropSymbol] = useState<string>("")
    const [airdropContract, setAirDropContract] = useState<string>("")
    const [spinner, setSpinner] = useState<boolean>(false)
    const [merkleTree, setMerkleTree] = useState<MerkleTree>()
    
    useEffect(() => {
        if(props.address && props.network && props.provider){
            const airdrop = props.network ? Airdrop[props.network?.chainId] : null
            const accounts = airdrop ? airdrop.accounts : null
            const hasAirdrop= accounts && props.address!=="" ? Object.keys(accounts).find(x=> x.toLowerCase() === props.address.toLowerCase()) : null
            const amount = hasAirdrop && accounts ? accounts[hasAirdrop] : null
            if(airdrop && amount) {
                setAirdropSymbol(airdrop.symbol)
                setAirdropAmount(BigNumber.from(amount, 18))
                setAirDropContract(airdrop.contract)
                getHasClaimed(airdrop.contract, props.address, props.provider)
                const merkle = new MerkleTree(
                    Object.entries(Airdrop[props.network?.chainId].accounts).map(([address, tokens]) =>
                        generateLeaf(
                            ethers.utils.getAddress(address),
                            tokens.toString()
                        )
                    ),
                    keccak256,
                    { sortPairs: true }
                )

                setMerkleTree(merkle)                
            }
        }
        
    }, [props.address, props.network, props.provider])

    const getHasClaimed = async (contractAddress: string, userAddress: string, provider: ethers.providers.Web3Provider) : Promise<void> => {
        const airContract = new ethers.Contract(contractAddress, AIRDROP_ABI, provider)
        const hasClaimed = await airContract.hasClaimed(userAddress)
        props.setHasClaimed(hasClaimed)
    }
    
    function generateLeaf(address: string, value: string): Buffer {
        return Buffer.from(
            ethers.utils
                .solidityKeccak256(["address", "uint256"], [address, value])
                .slice(2),
            "hex"
        );
    }

    const handleClaim = async () : Promise<void> => {
        try{
            if(airdropAmount && merkleTree && props.provider && airdropContract !== ""){
                const leaf: Buffer = generateLeaf(props.address, airdropAmount?._value.toString());
                const proof = merkleTree.getHexProof(leaf)
                const signer = props.provider.getSigner()
                const airContract = new ethers.Contract(airdropContract, AIRDROP_ABI, signer)
                console.log(airdropAmount._value)
                setSpinner(true)
                const tx = await airContract.claim(props.address, airdropAmount._value, proof)
                console.log(tx)
                const receipt = await tx.wait()
                console.log(receipt)
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
    
    if(props.address === "" || !props.network || !airdropAmount || props.hasClaimed)
        return null
    else {
        return (
            <div className={`airdrop-button ${!spinner ? "airdrop-button-hover" : "airdrop-button-spinner"}`} onClick={() => spinner ? null : handleClaim()}>
                <div className="airdrop-button-content">
                    <span className="airdrop-name"><StarBpro active={true} backstop={false}/></span>
                    <span className="airdrop-amount">{airdropAmount.toRound(2)} {airdropSymbol}</span>
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