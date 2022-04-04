import {ethers} from "ethers";

export const ExecuteWithExtraGasLimit = async (
    contract: ethers.Contract,
    functionName: string,
    args: Array<any>,
    spinner?: () => void
) : Promise<any> => {
    const txGas = await contract.estimateGas[functionName](...args)
    const tx = await contract[functionName](...args, { gasLimit: txGas})
    if (spinner) spinner()
    return await tx.wait()
}

export const ExecutePayableWithExtraGasLimit = async (
    contract: ethers.Contract,
    value: ethers.BigNumber,
    functionName: string,
    args: Array<any>,
    spinner?: ()=>void
) : Promise<any> => {
    const txGas = await contract.estimateGas[functionName](...args, { value: value })
    const tx = await contract[functionName](...args, { gasLimit: txGas, value: value })
    if(spinner) spinner()
    return await tx.wait()
}