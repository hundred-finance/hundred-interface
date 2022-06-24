import React, { useEffect, useRef, useState} from "react"
import "./hundredMenu.css"
import { Spinner } from "../../assets/huIcons/huIcons"
import { Network } from "../../networks"
import { BigNumber } from "../../bigNumber"
import { useUiContext } from "../../Types/uiContext"
import { useGlobalContext } from "../../Types/globalContext"
import { Contract } from 'ethers'
import { useWeb3React } from "@web3-react/core"
import { ExecuteWithExtraGasLimit } from "../../Classes/TransactionHelper"
import { COMPTROLLER_ABI, HUNDRED_ABI, MINTER_ABI, VOTING_ESCROW_ABI } from "../../abi"

const HundredMenu: React.FC = () => {
    const [hndSpinner, setHndSpinner] = useState<boolean>(false)
    const { library } = useWeb3React()

    const { setSpinnerVisible} = useUiContext()
    const {network, hndPrice, hndBalance, hndEarned, 
           hundredBalance, hndRewards, vehndBalance, address, 
           setUpdateEarned, gaugeAddresses, updateEarned} = useGlobalContext()

    const networkRef = useRef<Network | null>(null)
    networkRef.current = network

    useEffect(() => {
        networkRef.current = {...network} as any
    }, [network])

    const [tvl, setTvl] = useState<BigNumber | null>(null)

    useEffect(() => {
        if(networkRef.current  && networkRef.current.hundredLiquidityPoolAddress && hundredBalance){
            if(networkRef.current.liquidity){
                const temp = +hundredBalance.toString() / (networkRef.current.hndPoolPercent ? networkRef.current.hndPoolPercent : 1) *hndPrice
                setTvl(BigNumber.parseValue(temp.noExponents()))
            }
            else{
                const temp = +hundredBalance.toString() * 2 * hndPrice
                setTvl(BigNumber.parseValue(temp.noExponents()))
            }
        }
        else setTvl(null)
    }, [hndPrice, hundredBalance])


  useEffect(() => {
    if(!updateEarned){
      setHndSpinner(false)
    }
  }, [updateEarned])


    const handleCollect = async (): Promise<void> => {
        if(library && network){
          try{
            setHndSpinner(true)
            setSpinnerVisible(true)
            const signer = library.getSigner()
            const comptroller = new Contract(network.unitrollerAddress, COMPTROLLER_ABI, signer)
            const receipt = await ExecuteWithExtraGasLimit(comptroller, "claimComp", [address], () => setSpinnerVisible(false))
            
            console.log(receipt)
            setUpdateEarned(true)
            //await getHndBalances(provider)
          }
          catch(err){
            console.log(err)
            setHndSpinner(false)
            setSpinnerVisible(false)
          }
          finally{
            setHndSpinner(false)
            setSpinnerVisible(false)
          }
        }
      }

      const handleClaimHnd = async (): Promise<void> => {
        if(library && network){
          try{
            setHndSpinner(true)
            setSpinnerVisible(true)
    
            const signer = library.getSigner()
            let mintAddress = ''
            network.lendly ? network.minterAddressLendly ? mintAddress = network.minterAddressLendly : null: null;
            network.minterAddress ? mintAddress = network.minterAddress : null; 
    
            const minter = new Contract(mintAddress, MINTER_ABI, signer)
            const receipt = await ExecuteWithExtraGasLimit(minter, "mint_many", [gaugeAddresses], () => setSpinnerVisible(false))
            console.log(receipt)
            setUpdateEarned(true)
          }
          catch(err){
            console.log(err)
            setHndSpinner(false)
            setSpinnerVisible(false)
          }
          finally{
            setHndSpinner(false)
            setSpinnerVisible(false)
          }
        }}
    
     const handleClaimLockHnd = async (): Promise<void> => {
        if(library && network && address){
          try{
            setHndSpinner(true)
            setSpinnerVisible(true)
            await handleClaimHnd()
    
            const signer = library.getSigner()
            if (network.votingAddress) 
            {   
            
             const votingContract = new Contract(network.votingAddress, VOTING_ESCROW_ABI, signer); 
             const balanceContract = new Contract(network.hundredAddress, HUNDRED_ABI, library)
             const rewards = await balanceContract.balanceOf(address)
             const receipt = await ExecuteWithExtraGasLimit(votingContract, "increase_amount", [rewards], () => setSpinnerVisible(false))
             
             console.log(receipt)
             setUpdateEarned(true)
            }
          }
          catch(err){
            console.log(err)
            setHndSpinner(false)
            setSpinnerVisible(false)
          }
          finally{
            setHndSpinner(false)
            setSpinnerVisible(false)
          }
        }}

    return (
        <div className="hundred-menu">
            <hr/>
            <div className="hundred-menu-item">
                <div className="hundred-menu-item-label"><label>HND Price </label><span>${BigNumber.parseValue(hndPrice.toString()).toRound(2, true, true)}</span></div>
                {tvl ? <div className="hundred-menu-item-label"><label>{networkRef.current?.liquidity ? "Liquidity" : "TVL"}</label><span>${tvl.toRound(2, true, true)}</span></div> : null}
                {networkRef.current  && networkRef.current.trade ? <div className="hundred-menu-item-label"><a className="hundred-menu-link" href={networkRef.current.trade} target="_blank" rel="noreferrer">Trade</a></div> : null}
                {networkRef.current  && networkRef.current.addLiquidity ? <div className="hundred-menu-item-label"><a className="hundred-menu-link" href={networkRef.current.addLiquidity} target="_blank" rel="noreferrer">Add Liquidity</a></div> : null}
                {networkRef.current  && networkRef.current.stakeLp ? <div className="hundred-menu-item-label"><a className="hundred-menu-link" href={networkRef.current.stakeLp} target="_blank" rel="noreferrer">Stake LP</a></div> : null}
            </div>
            <div className="hundred-menu-item">
                <hr/>
                <div className="hundred-menu-item-label"><label>HND Balance </label><span>{hndBalance ? (hndBalance.gt(BigNumber.from(0)) ? hndBalance.toRound(2, true, true) : "0.00") : "--"}</span></div>
                <div className="hundred-menu-item-label"><label>veHND Balance </label><span>{vehndBalance ? (vehndBalance.gt(BigNumber.from(0)) ? vehndBalance.toRound(2, true, true) : "0.00") : "--"}</span></div>
                <div className="hundred-menu-item-label"><label>HND Earned </label><span>{hndRewards ? (hndRewards.gt(BigNumber.from(0)) ? hndRewards.toRound(2, true, true) : "0.00") : "--"}</span></div>
               
                <div className= {`${!hndSpinner ? "hundred-menu-item-button" : "hundred-menu-item-button-disabled"}`} onClick={() => handleClaimHnd()}>{hndSpinner ? (<Spinner size={"25px"}/>) : "Claim HND"}</div>
                <div className= {`${!hndSpinner ? "hundred-menu-item-button" : "hundred-menu-item-button-disabled"}`} onClick={() => handleClaimLockHnd()}>{hndSpinner ? (<Spinner size={"25px"}/>) : "Claim and Lock HND"}</div>

                {hndEarned && +hndEarned.toString() > 0 ? 
                    <><div className="hundred-menu-item-label"><label>HND Earned (Legacy)</label><span>{hndEarned ? hndEarned?.gt(BigNumber.from(0)) ? hndEarned?.toRound(2, true, true) : "0.00" : "--"}</span></div>
                    <div className={`${hndSpinner ? "hundred-menu-item-button-disabled" : "hundred-menu-item-button"}`} onClick={() => !hndSpinner ? handleCollect() : null}>
                        {hndSpinner ? (<Spinner size={"25px"}/>) : "Claim Legacy HND"}</div></> : null
                }
            </div>
        </div>
    )
}

export default HundredMenu