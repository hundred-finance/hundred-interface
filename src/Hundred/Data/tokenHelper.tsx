import { BigNumber } from "../../bigNumber"
import { ethers } from "ethers"
import { CTokenInfo } from "../../Classes/cTokenClass"

const gasLimit = "250000";

export const getMaxAmount = async (market: CTokenInfo, provider: ethers.providers.Web3Provider): Promise<BigNumber> => {
    if (market.isNativeToken) {
      const gasPrice = BigNumber.from(await provider.getGasPrice())
      const price = gasPrice.mul(BigNumber.from(gasLimit))
      const balance = market.underlying.walletBalance.sub(price)
      return balance
    } 
    
      return market.underlying.walletBalance
  }

  export const getMaxRepayAmount = (market: CTokenInfo) : BigNumber => {
    const maxRepayFactor = BigNumber.from("1").add(market.borrowApy); // e.g. Borrow APY = 2% => maxRepayFactor = 1.0002
    if (market.isNativeToken) {
      return market.borrowBalanceInTokenUnit//.times(maxRepayFactor).decimalPlaces(18); // Setting it to a bit larger, this makes sure the user can repay 100%.
    }
    return market.borrowBalanceInTokenUnit.mul(maxRepayFactor); // The same as ETH for now. The transaction will use -1 anyway.
  }