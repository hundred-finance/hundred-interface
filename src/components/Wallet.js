import { useWeb3React } from "@web3-react/core"
import React from "react"
import injectedConnector from "../connectors"

const Wallet = () => {
    const { chainId, account, activate, active } = useWeb3React()
  
    const onClick = () => {
      activate(injectedConnector)
    }
  
    return (
      <div>
        <div>ChainId: {chainId}</div>
        <div>Account: {account}</div>
        {active ? (
          <div>✅ </div>
        ) : (
          <button type="button" onClick={onClick}>
            Connect
          </button>
        )}
      </div>
    )
  }

  export default Wallet