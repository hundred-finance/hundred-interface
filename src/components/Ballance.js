import { useWeb3React } from "@web3-react/core"
import { formatEther } from "ethers/lib/utils"
import React from "react"
import useSWR from "swr"

const fetcher = (library) => (...args) => {
    const [method, ...params] = args
    console.log(method, params)
    return library[method](...params)
  }
  
const Balance = () => {
    const { account, library } = useWeb3React()
    const { data: balance } = useSWR(['getBalance', account, 'latest'], {
      fetcher: fetcher(library),
    })
    if(!balance) {
      return <div>...</div>
    }
    return <div>Balance: {parseFloat(formatEther(balance)).toPrecision(4)}</div>
  }

export default Balance