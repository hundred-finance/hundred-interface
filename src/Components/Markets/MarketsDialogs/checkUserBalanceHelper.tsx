import { useWeb3React } from '@web3-react/core';
import { Provider, Contract} from 'ethcall';
import { GAUGE_V4_ABI, HUNDRED_ABI, CTOKEN_ABI } from '../../../abi';
import { useGlobalContext } from '../../../Types/globalContext';
import { useHundredDataContext } from '../../../Types/hundredDataContext';
import { BigNumber } from '../../../bigNumber';
import { GaugeV4 } from '../../../Classes/gaugeV4Class';

//check that user balance is updated on smart contracts before updating data
export async function checkUserBalanceIsUpdated(
    gaugeV4: GaugeV4 | null | undefined,
    tokenContract: Contract | null | undefined,
    currBalanceInput: any,
    action: string,
): Promise<boolean> {
    const { library, account } = useWeb3React();
    const { selectedMarket } = useHundredDataContext();
    const { network } = useGlobalContext();

    //STEP 1: ethcall setup
    const ethcallProvider = new Provider();
    await ethcallProvider.init(library); //library = provider
    let userBalanceIsUpdated = false;
    let newBalance: BigNumber;
    const currBalance = BigNumber.from(currBalanceInput);
    const call: any = [];
    //STEP 2: fetch user data
    if (network && selectedMarket) {
        if (gaugeV4) {
            const gaugeHelper = gaugeV4?.generalData.gaugeHelper;
            const lpTokenUnderlying = gaugeV4?.generalData.lpTokenUnderlying;
            const lpToken = gaugeV4?.generalData.lpToken;
            const gaugeAddress = gaugeV4?.generalData.address;
            if (action === 'stake' || action === 'unstake') {
                call.push(new Contract(gaugeV4.generalData.address, GAUGE_V4_ABI).balanceOf(account));
            } else if (action === 'claimHnd') {
                call.push(new Contract(network.hundredAddress, HUNDRED_ABI).balanceOf(account));
            } else if (action === 'approveStake') {
                if (gaugeHelper && lpTokenUnderlying !== '0x0') {
                    const cTokenContract = new Contract(lpTokenUnderlying, CTOKEN_ABI);
                    call.push(cTokenContract.allowance(account, gaugeHelper));
                } else {
                    const cTokenContract = new Contract(lpToken, CTOKEN_ABI);
                    call.push(cTokenContract.allowance(account, gaugeAddress));
                }
            } else if (action === 'approveUnstake') {
                if (gaugeHelper) {
                    const gaugeContract = new Contract(gaugeAddress, CTOKEN_ABI);
                    call.push(gaugeContract.allowance(account, gaugeHelper));
                } else {
                    const cTokenContract = new Contract(lpToken, CTOKEN_ABI);
                    call.push(cTokenContract.allowance(account, gaugeAddress));
                }
            }
        } else {
            if (tokenContract) {
                if (action === 'supply' || action === 'withdraw') {
                    call.push(tokenContract.getAccountSnapshot(account)); //returns array of 4 BigNumbers
                } else if (action === 'approveSupply') {
                    call.push(tokenContract.allowance(account, selectedMarket.pTokenAddress));
                }
            }
        }
        const newBalanceResult: BigNumber[] = await ethcallProvider.all(call);
        if (action === 'supply' || action === 'withdraw') {
            //Results from the web3@0.20 getAccountSnapshot call must be individually converted into a number or string.
            const getAccountSnapshotString = newBalanceResult[0].toString();
            const getAccountSnapshotArray = getAccountSnapshotString.split(',');
            newBalance = BigNumber.from(getAccountSnapshotArray[1]); //cTokenBalance
        } else {
            newBalance = BigNumber.from(newBalanceResult[0]); //allowance or balance
        }
        //STEP 3: check userBalance has been updated, if not, check again recursively
        if (newBalance.eq(currBalance) === false) {
            userBalanceIsUpdated = true;
            return userBalanceIsUpdated;
        } else if (newBalance.eq(currBalance)) {
            const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
            await delay(2000); //wait 2 seconds, run again
            if (gaugeV4) {
                return await checkUserBalanceIsUpdated(gaugeV4, undefined, currBalanceInput, action);
            } else {
                return await checkUserBalanceIsUpdated(undefined, tokenContract, currBalanceInput, action);
            }
        }
    }
    return false;
}
