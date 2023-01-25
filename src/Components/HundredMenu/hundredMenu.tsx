import React, { useEffect, useRef, useState} from "react"
import "./hundredMenu.css"
import { Network } from "../../networks"
import { BigNumber } from "../../bigNumber"
import { useUiContext } from "../../Types/uiContext"
import { useGlobalContext } from "../../Types/globalContext"
import { Contract } from 'ethers'
import { useWeb3React } from "@web3-react/core"
import { ExecuteWithExtraGasLimit } from "../../Classes/TransactionHelper"
import {  HUNDRED_ABI, MINTER_ABI, VOTING_ESCROW_ABI } from "../../abi"
import { useHundredDataContext } from "../../Types/hundredDataContext"
import { UpdateTypeEnum } from "../../Hundred/Data/hundredData"
import Modal from "../Modal/modal"
import hundredCoin from "../../assets/icons/HND 1.png"
import ButtonLink from "../Button/buttonLink"
import Button from "../Button/button"

const HundredMenu: React.FC = () => {
    const mounted = useRef<boolean>(false)
    
    const { library, account } = useWeb3React()
    const {hndBalance, hundredBalance, hndRewards, tokenRewards, rewardTokenSymbol, vehndBalance, gaugeAddresses, updateMarket} = useHundredDataContext()

    const { claimLegacyHnd, claimHnd, setClaimHnd, claimLockHnd, setClaimLockHnd, toastErrorMessage, toastSuccessMessage, openHundred, setOpenHundred} = useUiContext()
    const {network, hndPrice} = useGlobalContext()

    const networkRef = useRef<Network | null>(null)
    networkRef.current = network

    useEffect(() => {
      mounted.current = true

      return(() => {
        mounted.current = false
      })
    })

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

    // const handleCollect = async (): Promise<void> => {
    //     if(library && network && account){
    //       try{
    //         setClaimLegacyHnd(true)
    //         setSpinnerVisible(true)

    //         const signer = library.getSigner()
    //         const comptroller = new Contract(network.unitrollerAddress, COMPTROLLER_ABI, signer)
    //         const tx = await ExecuteWithExtraGasLimit(comptroller, "claimComp", [account], 0)

    //         setSpinnerVisible(false)
    //         const receipt = await tx.wait()
            
    //         console.log(receipt)
    //         if(receipt.status === 1){
    //           toastSuccessMessage("Transaction completed successfully.\nUpdating contracts")
    //           await updateMarket(null, UpdateTypeEnum.ClaimHndLegacy)
    //         }
    //         else if(receipt.message){
    //           toastErrorMessage(`${receipt.message}`);  
    //         }
    //       }
    //       catch(error: any){
    //         console.log(error)
    //         toastErrorMessage(`${error?.message.replace(".", "")} on Hundred Claim Legacy`)
    //       }
    //       finally{
    //         setClaimLegacyHnd(false)
    //         setSpinnerVisible(false)
    //       }
    //     }
    //   }

      const handleClaimHnd = async (): Promise<void> => {
        if(library && network){
          try{
            setClaimHnd(true)
            //setSpinnerVisible(true)
    
            const signer = library.getSigner()
            let mintAddress = ''
            network.lendly ? network.minterAddressLendly ? mintAddress = network.minterAddressLendly : null: null;
            network.minterAddress ? mintAddress = network.minterAddress : null; 
    
            const minter = new Contract(mintAddress, MINTER_ABI, signer)
            const tx = await ExecuteWithExtraGasLimit(minter, "mint_many", [gaugeAddresses], 0)
            
            //setSpinnerVisible(false)
            
            const receipt = await tx.wait()
            console.log(receipt)
            if(receipt.status === 1){
              toastSuccessMessage("Transaction completed successfully.\nUpdating contracts")
              await updateMarket(null, UpdateTypeEnum.ClaimHnd)
            }
            else if(receipt.message){
              toastErrorMessage(`${receipt.message}`);  
            }
          }
          catch(error: any){
            console.log(error)
            toastErrorMessage(`${error?.message.replace(".", "")} on Hundred Claim`)
          }
          finally{
            setClaimHnd(false)
            //setSpinnerVisible(false)
          }
        }}
    
     const handleClaimLockHnd = async (): Promise<void> => {
        if(library && network && account){
          try{
            if (network.votingAddress) 
            {   
              setClaimLockHnd(true)
              //setSpinnerVisible(true)
            
              const signer = library.getSigner()
              let mintAddress = ''
              network.lendly ? network.minterAddressLendly ? mintAddress = network.minterAddressLendly : null: null;
              network.minterAddress ? mintAddress = network.minterAddress : null; 
    
              const minter = new Contract(mintAddress, MINTER_ABI, signer)
              const tx = await ExecuteWithExtraGasLimit(minter, "mint_many", [gaugeAddresses], 0)
            
              //setSpinnerVisible(false)
            
              const receipt1 = await tx.wait()
              if(receipt1.status === 1){
                //setSpinnerVisible(true)
                const votingContract = new Contract(network.votingAddress, VOTING_ESCROW_ABI, signer); 
                const balanceContract = new Contract(network.hundredAddress, HUNDRED_ABI, library)
                const rewards = await balanceContract.balanceOf(account)
                const tx2 = await ExecuteWithExtraGasLimit(votingContract, "increase_amount", [rewards], 0)
                
                //setSpinnerVisible(false)

                const receipt = await tx2.wait()
                console.log(receipt)
                if(receipt.status === 1){
                  toastSuccessMessage("Transaction completed successfully.\nUpdating contracts")
                  await updateMarket(null, UpdateTypeEnum.ClaimLockHnd)
                }
                else if(receipt.message){
                  toastErrorMessage(`${receipt.message}`);  
                }
              }
            }
          }
          catch(error: any){
            console.log(error)
            toastErrorMessage(`${error?.message.replace(".", "")} on Hundred Claim & Lock`)
          }
          finally{
            setClaimLockHnd(false)
            //setSpinnerVisible(false)
          }
        }}

    return (
      <Modal open={openHundred} close={() => setOpenHundred(false)} title="HND" titleImg={hundredCoin}>
        <div className="hundred-menu">
          <div className="hundred-price">
            ${BigNumber.parseValue(hndPrice.toString()).toRound(3, true, true)}
            {tvl ? <div className="tvl">TVL ${tvl.toRound(2, true, true)}</div> : null}
            <div className="links">
              {networkRef.current && networkRef.current.trade ? <ButtonLink label="Trade" url={networkRef.current.trade}/> : null}
              {networkRef.current && networkRef.current.addLiquidity ? <ButtonLink label="Add Liquidity" url={networkRef.current.addLiquidity}/> : null}
              {networkRef.current && networkRef.current.stakeLp ? <ButtonLink label="Stake LP" url={networkRef.current.stakeLp}/> : null}
            </div>
          </div>
          {account ? 
            <div className="hundred-menu-account">
                <div className="seperator"/>
                <div className="hundred-menu-account-item">
                  <label>HND Balance</label>
                  {hndBalance ? (hndBalance.gt(BigNumber.from(0)) ? hndBalance.toRound(2, true, true) : "0.00") : "--"}
                </div>
                <div className="hundred-menu-account-item">
                  <label>veHND Balance</label>
                  {vehndBalance ? (vehndBalance.gt(BigNumber.from(0)) ? vehndBalance.toRound(2, true, true) : "0.00") : "--"}
                </div>
                <div className="hundred-menu-account-item">
                  <label>HND Earned</label>
                  {hndRewards ? (hndRewards.gt(BigNumber.from(0)) ? +hndRewards.toRound(2, true, true) === 0 ? ">0.00" : hndRewards.toRound(2, true, true) : "0.00") : "--"}
                </div>
                { rewardTokenSymbol ?
                    <div className="hundred-menu-account-item">
                      <label>{rewardTokenSymbol} Earned</label>
                      {tokenRewards ? (tokenRewards.gt(BigNumber.from(0)) ? +tokenRewards.toRound(2, true, true) === 0 ? ">0.00" : tokenRewards.toRound(2, true, true) : "0.00") : "--"}
                    </div>
                : '' }
                <div className="hundred-menu-account-item">
                  <Button onClick={() => handleClaimHnd()} small={true} disabled={!claimHnd && !claimLockHnd && !claimLegacyHnd && hndRewards && +hndRewards?.toString() > 0 ? false : true} loading={claimHnd}>
                      Claim rewards
                  </Button>
                  <Button onClick={() => handleClaimLockHnd()} small={true} disabled={!claimHnd && !claimLockHnd && !claimLegacyHnd && hndRewards && +hndRewards?.toString() > 0 ? false : true} loading={claimLockHnd}>
                    Claim & Lock HND
                  </Button>
                </div>
            </div>
          : null}
        </div>
      </Modal>
    )
}

export default HundredMenu