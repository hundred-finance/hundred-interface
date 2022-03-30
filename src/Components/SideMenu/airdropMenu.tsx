import React from "react"
import "./airdropMenu.css"
import {ethers} from "ethers"
import { DoneIcon, MoneyBagIcon, Spinner } from "../../assets/huIcons/huIcons"
import { AirdropType } from "../AirdropButton/airdropButton"
import { AIRDROP_V2_ABI } from "../../abi"
import { fireworks } from "../Fireworks/fireworks"
import { useUiContext } from "../../Types/uiContext"
import { useGlobalContext } from "../../Types/globalContext"
import { useWeb3React } from "@web3-react/core"

interface Props{
    airdrops: AirdropType[],
    setAirdrops: React.Dispatch<React.SetStateAction<AirdropType[]>>,
    address: string,
}


const AirdropMenu: React.FC<Props> = (props: Props) => {
    const {airdropSpinner, setAirdropSpinner, toastSuccessMessage, toastErrorMessage} = useUiContext()
    const { library } = useWeb3React()
    const { network } = useGlobalContext()

    const handleClaimAll = async() => {
        const airdrops = props.airdrops.filter(x=>!x.hasClaimed)
        if(library && network && network.airdropMulticallAddress){
            try{
                const signer = library.getSigner()
                const contract = new ethers.Contract(network.airdropMulticallAddress, AIRDROP_V2_ABI, signer)
                const data = airdrops.map(a => a.transactionData)
                setAirdropSpinner(true)
                const tx = await contract.multicall(data)
                const receipt = await tx.wait()
                console.log(receipt)
                fireworks("side-menu")
                const temp = [...props.airdrops]
                temp.forEach(a=> a.hasClaimed = true)
                props.setAirdrops(temp)
                toastSuccessMessage("Airdrop Claim Completed Successfully", true, 5000)
            }
            catch(error: any){
                console.log(error)
                toastErrorMessage(error.message, true, 5000)
            }
            finally{
                setAirdropSpinner(false)
            }
        }
    }

    return (
        <div className="airdrop-menu">
            {
                props.airdrops.filter(x=> !x.hasClaimed).length > 0 ?
                <>
                    <div className="airdrop-menu-label">
                        Unclaimed Airdrop
                    </div>
                    <div className="airdrop-unclaimed">
                        {
                            props.airdrops.filter(x=>!x.hasClaimed).map((a, index) => {
                                return(
                                    <div key={index} className="airdrop-menu-item">
                                        <div className="airdrop-menu-item-values" >
                                            {a.amount.map((am, index2) => 
                                                
                                                    <div key={`a-${index2}`}>{am.value.toRound(2, true, true)} {am.symbol}
                                                    </div>
                                                
                                            )}
                                        </div>
                                        <MoneyBagIcon style={{paddingRight:"5px", paddingLeft: "5px"}} size="30px" color="#ddd"/>
                                    </div>)
                            })
                        }
                    </div>
                    <div className="airdrop-menu-item">
                        <button className={`${airdropSpinner ? "airdrop-menu-item-button-disabled" : "airdrop-menu-item-button"}`} onClick={() =>airdropSpinner ? null : handleClaimAll()}>
                           {airdropSpinner ? (<Spinner size={"25px"}/>) : "Claim All"}
                        </button> 
                    </div>
                </>
                : null
            }
            {
                props.airdrops.filter(x=> x.hasClaimed).length > 0 ?
                <>
                    <div className="airdrop-menu-label">
                        Airdrop History
                    </div>
                    {
                        <div className="airdrop-history">
                            {
                                props.airdrops.filter(x=>x.hasClaimed).map((a, index) => {
                                    return(
                                        <div key={index} className="airdrop-menu-item">
                                            <div className="airdrop-menu-item-values" >
                                                {a.amount.map((am, index) => {
                                                    return (
                                                        <div key={index}>{am.value.toRound(2, true,  true)} {am.symbol}</div>
                                                    )
                                                })}
                                            </div>
                                            <DoneIcon style={{paddingRight:"5px", paddingLeft: "5px"}} size="25px"/> 
                                        </div>
                                    )
                                })
                            }
                        </div>
                    }
                </>
                :null
            }
        </div>
    )
}

export default AirdropMenu