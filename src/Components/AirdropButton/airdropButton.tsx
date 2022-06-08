import {ethers} from "ethers";
import React, {useEffect, useState} from "react";
import {BigNumber} from "../../bigNumber";
import {Network} from "../../networks";
import StarBpro from "../StarBpro/starBpro";
import {Airdrop} from "./airdropAddresses";
import {MerkleTree} from "merkletreejs";
import keccak256 from "keccak256";
import "./airdropButton.css"
import {AIRDROP_ABI, AIRDROP_V2_ABI} from "../../abi";
import {Spinner} from "../../assets/huIcons/huIcons";
import {Contract, Provider} from "ethcall";
import { useUiContext } from "../../Types/uiContext";
import { useGlobalContext } from "../../Types/globalContext";
import { useWeb3React } from "@web3-react/core";

interface Props{
    hasClaimed: boolean,
    setHasClaimed: React.Dispatch<React.SetStateAction<boolean>>,
    airdrops: AirdropType[],
    setAirdrops: React.Dispatch<React.SetStateAction<AirdropType[]>>
}

type AirdropAmount = {
    symbol: string,
    value: BigNumber
}

export type AirdropType = {
    amount: AirdropAmount[],
    hasClaimed: boolean,
    transactionData: { target: string; data: any; }
}

const AirdropButton: React.FC<Props> = (props : Props) => {
    const {setOpenAirdrop, setSideMenu, airdropSpinner} = useUiContext()
    const { library, chainId } = useWeb3React()
    const {network, address} = useGlobalContext()

    const [totalAmount, setTotalAmount] = useState<AirdropAmount[]>([])

    const parseAirdropAmount = (value: string | string[], symbols: string[]) : AirdropAmount[] => {
        if(Array.isArray(value)){
            const amount = value.map((v, index) => {
                const airdropAmount: AirdropAmount = {
                    value : BigNumber.from(v, 18),
                    symbol: symbols[index]
                }
                return airdropAmount
            })
            return amount
        }
        const airdropAmount: AirdropAmount = {
            value : BigNumber.from(value, 18),
            symbol: symbols[0]
        }
        return [airdropAmount]
        
    }

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

        const getAirdrop = async (network: Network, userAddress: string, provider: any) => {
            const airdrop = Airdrop[network.chainId]
            const calls: any[] = []
            if(airdrop){
                const airdrops: AirdropType[] = []
                Object.values(airdrop).map(a => {
                    const hasAirdrop = Object.keys(a.accounts).find(x => x.toLowerCase() === userAddress.toLowerCase())
                    if (hasAirdrop)
                    {       
                        const merkle = new MerkleTree(
                            Object.entries(a.accounts).map(([address, tokens]) =>
                                generateLeaf(
                                    ethers.utils.getAddress(address),
                                    tokens
                                )
                            ),
                            keccak256,
                            { sortPairs: true }
                        )

                        const leaf: Buffer = generateLeaf(userAddress, a.accounts[hasAirdrop]);
                        const proof = merkle.getHexProof(leaf)
                        
                        const amounts = parseAirdropAmount(a.accounts[hasAirdrop], a.symbol)
                        let transactionData: { target: string; data: any; } = {target: "", data: ""}
                        if(a.dropId !== undefined){
                            const contract = new Contract(a.contract, AIRDROP_V2_ABI)
                            calls.push(contract.hasClaimed(userAddress, a.dropId))
                            const airdropcontract = new ethers.Contract(a.contract, AIRDROP_V2_ABI, provider)
                            const transactionAmount = amounts.map(a=> a.value._value)
                            transactionData = {
                                target: airdropcontract.address,
                                data: airdropcontract.interface.encodeFunctionData("claim",
                                [
                                    userAddress,
                                    transactionAmount,
                                    proof,
                                    a.dropId
                                ])
                            }
                        }
                        else{
                            const contract = new Contract(a.contract, AIRDROP_ABI)
                            calls.push(contract.hasClaimed(userAddress))
                            const airdropcontract = new ethers.Contract(a.contract, AIRDROP_ABI, provider)
                            const amounts = parseAirdropAmount(a.accounts[hasAirdrop], a.symbol)
                            
                            transactionData = {
                                target: airdropcontract.address,
                                data: airdropcontract.interface.encodeFunctionData("claim",
                                [
                                    userAddress,
                                    amounts[0].value._value,
                                    proof
                                ])
                            }
                        }

                        const airdropValue: AirdropType = {
                            amount: parseAirdropAmount(a.accounts[hasAirdrop], a.symbol),
                            transactionData: transactionData,
                            hasClaimed: false,
                        }
                        airdrops.push(airdropValue)
                    }
                })
    
                const ethcallProvider = new Provider()
                await ethcallProvider.init(provider)
                if(network.multicallAddress) {
                    ethcallProvider.multicall = {
                        address: network.multicallAddress,
                        block: 0
                    }
                }
    
                const hasClaimed: any[] = await hasClaimedCall(calls, ethcallProvider) as any
                if(hasClaimed && airdrops && airdrops.length > 0 && hasClaimed.length === airdrops.length){
                    airdrops.forEach((x, index) => {
                            x.hasClaimed = hasClaimed[index]
                    })
                }

                props.setAirdrops(airdrops)
                
            }
        } 
        
        props.setAirdrops([])
        props.setHasClaimed(false)
        setTotalAmount([])
        if(library && network && network.chainId === chainId && address !== ""){
            try{
                
                    getAirdrop(network, address, library)
                
                
            }
            catch(err){
                console.log(err)
                props.setAirdrops([])
            }
        }
        
    }, [library, network])

    useEffect(() => {
        if([...props.airdrops].length > 0){
            const airdrops = [...props.airdrops]
            airdropAmount(airdrops)
            props.setHasClaimed(true)
        }
    }, [props.airdrops])
    
    function generateLeaf(address: string, value: string | string[]): Buffer {
        return Buffer.from(
            ethers.utils
                .solidityKeccak256(["address", Array.isArray(value) ? "uint256[]" : "uint256"], [address, value])
                .slice(2),
            "hex"
        );
    }
    
    const airdropAmount = (airdrops: AirdropType[]): void => {
        const temp = airdrops.filter(x=>!x.hasClaimed).map(x=>x.amount).concat()
        if(temp.length > 0){
            const amounts: AirdropAmount[] = []
            temp.forEach(air => {
                air.forEach(am => {
                    const airamount: AirdropAmount={
                        value: am.value,
                        symbol: am.symbol
                    }
                    amounts.push(airamount)
                })
            })
            const unique = amounts.filter((value, index, self) => {
                return self.findIndex(x => x.symbol === value.symbol) === index
            })
            const totalAmounts:AirdropAmount[] = []
            unique.forEach(x=>{
                const temp = amounts.filter(a => a.symbol === x.symbol)
                let sum = 0
                temp.forEach(t => {
                    sum += +t.value.toString()
                })
                const airamount: AirdropAmount = {
                    value: BigNumber.parseValue(sum.noExponents()),
                    symbol: x.symbol
                }
                totalAmounts.push(airamount)
            })
            
            setTotalAmount(totalAmounts)
            return
        }
        setTotalAmount([])
    };

    const handleOpenAirdropMenu = () =>{
        setOpenAirdrop(true)
        setSideMenu(true)
    }
    
      return (
            [...props.airdrops].length > 0 && props.hasClaimed ? 
            <div className={`airdrop-button ${!airdropSpinner ? "airdrop-button-hover" : "airdrop-button-spinner"}`} onClick={() => airdropSpinner ? null : handleOpenAirdropMenu()}>
                <div className="airdrop-button-content">
                    {[...totalAmount].length > 0 ? 
                        <>
                            <span className="airdrop-name"><StarBpro active={true} backstop={false}/></span>
                            <span className="airdrop-amount">
                                {[...totalAmount].map((x, index) => {
                                    return <div key={index}>{x.value.toRound(2, true, true)} {x.symbol}</div>
                            })}
                            </span>
                        </>
                        : <span style={{flex: 1}}>Airdrop</span>
                    }
                    
                </div>
                {airdropSpinner ? 
                    <div className="airdrop-spinner"><Spinner size={"30px"}/></div>
                    : null
                }
            </div>
            : null
        )
}

export default AirdropButton