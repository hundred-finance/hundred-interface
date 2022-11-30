import React from "react"
import "./airdropMenu.css"
import {ethers} from "ethers"
import { DoneIcon, MoneyBagIcon, Spinner } from "../../assets/huIcons/huIcons"
import { AIRDROP_V2_ABI } from "../../abi"
import { fireworks } from "../Fireworks/fireworks"
import { useUiContext } from "../../Types/uiContext"
import { useGlobalContext } from "../../Types/globalContext"
import { useWeb3React } from "@web3-react/core"
import {ExecuteWithExtraGasLimit} from "../../Classes/TransactionHelper";

const AirdropMenu: React.FC = () => {
    const {airdropSpinner, setAirdropSpinner, toastSuccessMessage, toastErrorMessage} = useUiContext()
    const { library } = useWeb3React()
    const { network, airdrops, setAirdrops  } = useGlobalContext()

    const handleClaimAll = async() => {
        const airdropsData = airdrops.filter(x=>!x.hasClaimed)
        if(library && network && network.airdropMulticallAddress){
            try{
                const signer = library.getSigner()
                const contract = new ethers.Contract(network.airdropMulticallAddress, AIRDROP_V2_ABI, signer)
                const data = airdropsData.map(a => a.transactionData)
                setAirdropSpinner(true)
                const receipt = await ExecuteWithExtraGasLimit(contract, "multicall", [data])
                console.log(receipt)
                fireworks("side-menu")
                const temp = [...airdrops]
                temp.forEach(a=> a.hasClaimed = true)
                setAirdrops(temp)
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
                [...airdrops].filter(x=> !x.hasClaimed).length > 0 ?
                <>
                    <div className="airdrop-menu-label">
                        Unclaimed Airdrop
                    </div>
                    <div className="airdrop-unclaimed">
                        {
                            [...airdrops].filter(x=>!x.hasClaimed).map((a, index) => {
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
                [...airdrops].filter(x=> x.hasClaimed).length > 0 ?
                <>
                    <div className="airdrop-menu-label">
                        Airdrop History
                    </div>
                    {
                        <div className="airdrop-history">
                            {
                                [...airdrops].filter(x=>x.hasClaimed).map((a, index) => {
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