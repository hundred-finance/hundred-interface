import { useWeb3React } from "@web3-react/core"
import { useEffect, useRef, useState } from "react"
import { Comptroller, getComptrollerData } from "../../Classes/comptrollerClass"
import { useGlobalContext } from "../../Types/globalContext"
import { useHundredDataContext } from "../../Types/hundredDataContext"
import { useUiContext } from "../../Types/uiContext"
import {GaugeV4, getBackstopGaugesData, getGaugesData} from "../../Classes/gaugeV4Class";
import { fetchData, fetchGeneralData } from "./fetchData"
import { CTokenInfo, CTokenSpinner, SpinnersEnum } from "../../Classes/cTokenClass"
import { BigNumber } from "../../bigNumber"
import { GeneralDetailsData, getGeneralDetails } from "../../Classes/generalDetailsClass"
import { BACKSTOP_MASTERCHEF_ABI, BACKSTOP_MASTERCHEF_ABI_V2, CETHER_ABI, COMPTROLLER_ABI, CTOKEN_ABI, GAUGE_V4_ABI, HUNDRED_ABI, TOKEN_ABI, VOTING_ESCROW_ABI } from "../../abi"
import { Contract, Provider } from "ethcall"
import { ethers } from "ethers"
import { delay } from "../../helpers"
import { MasterChefVersion } from "../../networks"
import _ from "lodash";

export enum UpdateTypeEnum{
    ClaimHndLegacy,
    ClaimHnd,
    ClaimLockHnd,
    EnableMarket,
    ApproveMarket,
    Supply,
    Withdraw,
    Repay,
    Borrow,
    ApproveBackstop,
    BackstopDeposit,
    BackstopWithdraw,
    BackstopClaim,
    ApproveStake,
    ApproveUnStake,
    Mint,
    ClaimRewards,
    Stake,
    Unstake
}

const useFetchData = () => {
    const timeoutId = useRef<string | number | NodeJS.Timeout | undefined>()
    const networkId = useRef<number>()
    
    const compAccrued = useRef<BigNumber>()
    const firstLoad = useRef<boolean>(true)
    const errorsCount = useRef<number>(0)
    const update = useRef<boolean>(false)

    const [comptrollerData, setComptrollerData] = useState<Comptroller>()
    const [marketsData, setMarketsData] = useState<CTokenInfo[]>([])
    const [marketsSpinners, setMarketsSpinners] = useState<CTokenSpinner[]>([])
    const [gaugesV4Data, setGaugesV4Data] = useState<GaugeV4[]>([])
    const [generalData, setGeneralData] = useState<GeneralDetailsData>()
    const [selectedMarket, setSelectedMarket] = useState<CTokenInfo>()
    const [selectedMarketSpinners, setSelectedMarketSpinners] = useState<CTokenSpinner>()
    const [hndBalance, setHndBalance] = useState<BigNumber>(BigNumber.from("0"))
    const [hndEarned, setHndEarned] = useState<BigNumber>(BigNumber.from("0"))
    const [hundredBalance, setHundredBalance] = useState<BigNumber>(BigNumber.from("0"))
    const [vehndBalance, setVehndBalance] = useState<BigNumber>(BigNumber.from("0"))
    const [hndRewards, setHndRewards] = useState<BigNumber>(BigNumber.from("0"))
    const [gaugeAddresses, setGaugeAddresses] = useState<string[]>()

    const { setGMessage } = useHundredDataContext()

    const {network, hndPrice} = useGlobalContext()
    const { toastErrorMessage} = useUiContext()
    const {library, account, chainId} = useWeb3React()

    useEffect(() => {
        return () => {
            clearTimeout(Number(timeoutId.current))
        }
    }, [])

    useEffect(() => {
        stopUpdate()
        timeoutId.current = undefined
        firstLoad.current = true
        setComptrollerData(undefined)
        setMarketsData([])
        setGaugesV4Data([])
        setGeneralData(undefined)
        setSelectedMarket(undefined)
        setMarketsSpinners([])
        if(network ){
            if(account && library && network.chainId === chainId){
                networkId.current = {...network}.chainId
                //setSpinnerVisible(true)
                getComptroller()
            }
            else if(!chainId){
                networkId.current = {...network}.chainId
                //setSpinnerVisible(true)
                getComptroller()
            }
        }
    }, [library, network, account])

    useEffect(() => {
        if(comptrollerData){
            updateData()
        }
    }, [comptrollerData])

    useEffect(() => {
        if(compAccrued.current !== undefined && (marketsData.length > 0 || gaugesV4Data.length > 0) ){
            const markets = [...marketsData]
            const gauges = [...gaugesV4Data]
            const data = getGeneralDetails(markets, gauges, compAccrued.current)
            setGeneralData(data)
            setHndEarned(data.earned)
            if(selectedMarket){
                const selected = {...selectedMarket}
                const market = markets.find(x=> x.underlying.symbol === selected.underlying.symbol)
                if(market){
                    setSelectedMarket(market)
                }
            }
        }
    }, [marketsData, gaugesV4Data, compAccrued.current])

    useEffect(() => {
        if(marketsSpinners){
            if(selectedMarketSpinners){
                const selected = {...selectedMarketSpinners}
                const market = [...marketsSpinners].find(x => x.symbol === selected.symbol)
                if(market) setSelectedMarketSpinners(market)
            }
        }
    }, [marketsSpinners])

    const getComptroller = async () => {
        
        if(network){
            const net = {...network}
            const comptroller = library ? await getComptrollerData(library, net) : await getComptrollerData(new ethers.providers.JsonRpcProvider(net.networkParams.rpcUrls[0]), net) 
            setComptrollerData(comptroller)
        }
    }

    const updateMarkets = (markets: CTokenInfo[], hndBalance: BigNumber, hundredBalace: BigNumber, compaccrued: BigNumber, vehndBalance: BigNumber, hndRewards: BigNumber, gaugeAddresses: string[]): void =>{
        if(markets){
            compAccrued.current = compaccrued
          
          setMarketsData(markets)
          setHndBalance(hndBalance)
          setHundredBalance(hundredBalace)
          setVehndBalance(vehndBalance)
          setHndRewards(hndRewards)
          setGaugeAddresses(gaugeAddresses)
          if(selectedMarket && markets){
            const selected = {...selectedMarket}
            const market = [...markets].find(x=>x?.underlying.symbol === selected.underlying.symbol)
            if (market){
              setSelectedMarket(market)
            }
          }
        }
        update.current = false
      }

    const getData = async () => {
        if(network && comptrollerData){
            const comptroller = {...comptrollerData}
            const net = {...network}
            const provider = library ? library : new ethers.providers.JsonRpcProvider(net.networkParams.rpcUrls[0])
            const gauges = await getGaugesData(provider, account, net)
            const backstopGauges = await getBackstopGaugesData(provider, account, net)
            const gaugesData = [...gauges, ...backstopGauges]
            const markets = account ? await fetchData({ allMarkets: [...comptroller.allMarkets], userAddress: account, comptrollerData: comptroller, network: net, marketsData: marketsData, provider: library, hndPrice: hndPrice, gaugesData: gaugesData })
                                    : await fetchGeneralData({ allMarkets: [...comptroller.allMarkets], comptrollerData: comptroller, network: net, marketsData: marketsData, provider, hndPrice: hndPrice, gaugesData: gaugesData })

            setMarketsData(markets.markets)
            setGaugesV4Data(gaugesData)
            
            updateMarkets(markets.markets, markets.hndBalance, markets.hundredBalace, markets.comAccrued, markets.vehndBalance, markets.hndRewards, markets.gaugeAddresses)

            if(firstLoad.current){
                const spinners = markets.markets.map(m => {
                    return new CTokenSpinner(m.underlying.symbol)
                  })
                setMarketsSpinners(spinners)
                firstLoad.current = false
                //setSpinnerVisible(false)
                const oldGauges = await getGaugesData(library, account, net, true)
                if(oldGauges.length > 0){
                    const oldGaugeData: { symbol: string; stakeBalance: BigNumber }[] = []
                    let message = "You have "
                    oldGauges.forEach(g => {
                      if(+g.userStakeBalance.toString() > 0){
                        const market = markets.markets.find(m => m.pTokenAddress.toLowerCase() === g.generalData.lpToken.toLowerCase())
                        if(market){
                          const temp = {
                            symbol: `h${market.underlying.symbol}-Gauge`,
                            stakeBalance: g.userStakeBalance
                          }
                          oldGaugeData.push(temp)
                        }
                      }
                    })

                      oldGaugeData.forEach((g, index) => {
                        message += g.symbol + (index + 1 === oldGaugeData.length ? " " : ", ")
                      })
                      if(oldGaugeData.length > 0){
                        setGMessage(message)
                      }
                }
            }
        }
    }

    const updateData = async () => {
        try{
            update.current = true
            clearTimeout(Number(timeoutId.current))
            await getData()
            if(account && library) timeoutId.current = setTimeout(updateData, 10000)
            errorsCount.current = 0
        }
        catch(error: any){
            console.log(error)
            if(!firstLoad.current)
                timeoutId.current = setTimeout(updateData, (errorsCount.current < 2 ? errorsCount.current + 1 : errorsCount.current) * 10000 + 10000)
            else{
                if(errorsCount.current < 2)
                    timeoutId.current = setTimeout(updateData, (errorsCount.current + 1) * 1000)
                else if (errorsCount.current === 3)
                    timeoutId.current = setTimeout(updateData, 5000)
                else if (errorsCount.current === 7){
                    //if(firstLoad.current) setSpinnerVisible(false)
                    toastErrorMessage(`${error?.message.replace(".", "")} on Page Load\n${error?.data?.message}\nPlease refresh the page after a few minutes.`)
                }
                else
                    timeoutId.current = setTimeout(updateData, 10000)
            } 
            update.current = false
            errorsCount.current += 1
        }
    }

    const toggleSpinners = (symbol: string, spinner: SpinnersEnum) => {
        if(marketsSpinners){
          const spinners = [...marketsSpinners]
          const marketSpinners = spinners.find(s => s.symbol === symbol)
          if(marketSpinners){
            switch (spinner){
              case SpinnersEnum.enterMarket :
                marketSpinners.enterMarketSpinner = !marketSpinners.enterMarketSpinner
                break
              case SpinnersEnum.borrow : 
                marketSpinners.borrowSpinner = !marketSpinners.borrowSpinner
                break
              case SpinnersEnum.repay : 
                marketSpinners.repaySpinner = !marketSpinners.repaySpinner
                break
              case SpinnersEnum.supply :
                marketSpinners.supplySpinner = !marketSpinners.supplySpinner
                break
              case SpinnersEnum.withdraw :
                marketSpinners.withdrawSpinner = !marketSpinners.withdrawSpinner
                break
              case SpinnersEnum.stake :
                marketSpinners.stakeSpinner = !marketSpinners.stakeSpinner
                break
              case SpinnersEnum.unstake :
                marketSpinners.unstakeSpinner = !marketSpinners.unstakeSpinner
                break
              case SpinnersEnum.mint : 
                marketSpinners.mintSpinner = !marketSpinners.mintSpinner
                break
               case SpinnersEnum.rewards : 
                marketSpinners.rewardsSpinner = !marketSpinners.rewardsSpinner
                break
              case SpinnersEnum.backstopDeposit :
                marketSpinners.backstopDepositSpinner = !marketSpinners.backstopDepositSpinner
                break       
              case SpinnersEnum.backstopWithdraw : 
                marketSpinners.backstopWithdrawSpinner = !marketSpinners.backstopWithdrawSpinner
                break
              case SpinnersEnum.backstopClaim :
                marketSpinners.backstopClaimSpinner = !marketSpinners.backstopClaimSpinner
                break              
              }
            marketSpinners.spinner = marketSpinners.enableMainSpinner()
            setMarketsSpinners(spinners)
          }
        }
      }

    const stopUpdate = async () :Promise<void> => {
        let count = 0
        while(update.current && count < 20){
            delay(1.5)
            count++
        }
        if(timeoutId){
            clearTimeout(Number(timeoutId.current));
            timeoutId.current = undefined
            console.log("Update stopped")
        }
    }

    const startUpdate = () => {
        timeoutId.current = setTimeout(updateData, 10000)
    }

    const getMaxAmount = async (market: CTokenInfo, func?: string) : Promise<BigNumber> => {
        const m = {...market}
          if (m.isNativeToken && library) {
            const gasRemainder = BigNumber.parseValue("0.1")
            
            if(func === "repay" && library){
              const balance = m.underlying.walletBalance.subSafe(gasRemainder);
              return balance.gt(BigNumber.from("0")) ? balance : BigNumber.from("0") 
            }
            else if(func === "supply" && library){
              const balance = m.underlying.walletBalance.gt(BigNumber.from("0")) ? m.underlying.walletBalance.subSafe(gasRemainder) : m.underlying.walletBalance
            
              return balance.gt(BigNumber.from("0")) ? balance : BigNumber.from("0") 
            }
          }
          
        return m.underlying.walletBalance
    }

    const getMaxRepayAmount = async (market: CTokenInfo) : Promise<BigNumber> => {
        if(marketsData){
            const markets = [...marketsData]
            const m = markets.find(x=> x.underlying.symbol === market.underlying.symbol)
            if(m){
                let borrowBalanceInTokenUnit = m.borrowBalanceInTokenUnit
                if(m.isNativeToken){
                    const token = market.isNativeToken ? CETHER_ABI : CTOKEN_ABI;
                    const ctoken = new ethers.Contract(market.pTokenAddress, token, library);
                    
                    const accountSnapshot = await ctoken.getAccountSnapshot(account)
                    borrowBalanceInTokenUnit = BigNumber.from(accountSnapshot[2].toString(), m.underlying.decimals)
            
                }
                const borrowAPYPerDay = m.borrowApy.div(BigNumber.from('365'));
                const maxRepayFactor = BigNumber.from("1").addSafe(borrowAPYPerDay)// e.g. Borrow APY = 2% => maxRepayFactor = 1.0002
        
                const amount = BigNumber.parseValueSafe(borrowBalanceInTokenUnit.mulSafe(maxRepayFactor).toString(), m.underlying.decimals)
        
                return amount // The same as ETH for now. The transaction will use -1 anyway.
            }
        }
        return BigNumber.from("0")
      }

    function convertUSDToUnderlyingToken(USD: string, market: CTokenInfo ) : BigNumber{ //USD -> underlying token
        const underlyingToken = +USD / +market.underlying.price.toString(); 
        return BigNumber.parseValueSafe(underlyingToken.toString(), market.underlying.decimals);  
    }

    const updateMarket = async (market: CTokenInfo | GaugeV4 | null, updateType: UpdateTypeEnum, shouldReturn?: any): Promise<void> => {
        console.log("Begin Update Market - Try to stop Update")
        stopUpdate()
        console.log("Update Market")
        const net = {...network}
        if(network && net && net.chainId){
            await handleUpdateMarket(updateType, market, shouldReturn)
        }
        startUpdate()
    }

    const handleUpdateMarket = async (updateType: UpdateTypeEnum, market: CTokenInfo | GaugeV4 | null, shouldReturn?:any, count = 0) => {
        const net = {...network}
        if(network && net && net.chainId && networkId.current === net.chainId && account && library){
            try{
                if (count === 0) await delay(5)
                let res = false
                switch (updateType){
                    case UpdateTypeEnum.ClaimHndLegacy:
                        res = await handleUpdateClaimHndLegacy(net.chainId)
                        break
                    case UpdateTypeEnum.ClaimHnd:
                        res = await handleUpdateClaimHnd(net.chainId)
                        break
                    case UpdateTypeEnum.ClaimLockHnd:
                        res = await handleUpdateClaimLockHnd(net.chainId)
                        break
                    case UpdateTypeEnum.EnableMarket:
                        res = await handleUpdateEnableMarket(market as CTokenInfo, shouldReturn, net.chainId)
                        break
                    case UpdateTypeEnum.ApproveMarket:
                        res = await handleUpdateApproveMarket(market as CTokenInfo, net.chainId)
                        break
                    case UpdateTypeEnum.Supply:
                        res = await handleUpdateSupply(market as CTokenInfo, net.chainId)
                        break
                    case UpdateTypeEnum.Withdraw:
                        res = await handleUpdateWithdraw(market as CTokenInfo, net.chainId)
                        break
                    case UpdateTypeEnum.Borrow:
                        res = await handleUpdateBorrow(market as CTokenInfo, net.chainId)
                        break
                    case UpdateTypeEnum.Repay:
                        res = await handleUpdateRepay(market as CTokenInfo, net.chainId)
                        break
                    case UpdateTypeEnum.ApproveBackstop:
                        res = await handleUpdateApproveBackstopDeposit(market as CTokenInfo, net.chainId)
                        break
                    case UpdateTypeEnum.BackstopDeposit:
                        res = await handleUpdateBackstopDeposit(market as CTokenInfo, net.chainId)
                        break
                    case UpdateTypeEnum.BackstopWithdraw:
                        res = await handleUpdateBackstopWithdraw(market as CTokenInfo, net.chainId)
                        break
                    case UpdateTypeEnum.BackstopClaim:
                        res = await handleUpdateBackstopClaim(market as CTokenInfo, net.chainId)
                        break
                    case UpdateTypeEnum.ApproveStake:
                        res = await handleUpdateApproveStake(market as GaugeV4, net.chainId)
                        break
                    case UpdateTypeEnum.ApproveUnStake:
                        res = await handleUpdateApproveUnStake(market as GaugeV4, net.chainId)
                        break
                    case UpdateTypeEnum.Mint:
                        res = await handleUpdateMint(market as GaugeV4, net.chainId)
                        break
                    case UpdateTypeEnum.ClaimRewards:
                        res = await handleUpdateClaimRewards(market as GaugeV4, net.chainId)
                        break
                    case UpdateTypeEnum.Stake:
                        res = await handleUpdateStake(market as GaugeV4, net.chainId)
                        break
                    case UpdateTypeEnum.Unstake:
                        res = await handleUpdateUnStake(market as GaugeV4, net.chainId)
                }
                if (res) {
                    console.log("Market Updated")
                    return
                }
            }
            catch(error){
                console.error(error)
            }
            
            if(count < 10){
                console.log("Not should return - Retry", count)
                await delay(5)
                const c = count + 1
                await handleUpdateMarket(updateType, market, shouldReturn, c)
            }
            
        }
    }

    const handleUpdateClaimHndLegacy = async (chain: number) => {
        if(network && networkId.current === chain && account && library && marketsData && comptrollerData){
            const comptroller = {...comptrollerData}
            const markets = [...marketsData]
            const gauges = [...gaugesV4Data]
            const net = {...network}
            
            const ethcallComptroller = new Contract(net.unitrollerAddress, COMPTROLLER_ABI)
            const calls = [ethcallComptroller.compAccrued(account)]

            markets.forEach(m => {
                const contract = new Contract(m.pTokenAddress, CTOKEN_ABI) 
                calls.push(contract.totalSupply(),
                contract.balanceOf(account),
                comptroller.ethcallComptroller.compSpeeds(m.pTokenAddress), 
                comptroller.ethcallComptroller.compSupplyState(m.pTokenAddress), 
                comptroller.ethcallComptroller.compSupplierIndex(m.pTokenAddress, account),)
            })

            const res = await comptroller.ethcallProvider.all(calls)

            const compAccr = BigNumber.from(res[0], 18)
            res.splice(0,1)

            const resChunks = _.chunk(res, 5);
            const blockProvider : ethers.providers.Web3Provider = net.blockRpc ? new ethers.providers.JsonRpcProvider(net.blockRpc) : library
            const blockNum = await blockProvider.getBlockNumber()

            resChunks.forEach((x: any, index: number) => {
                const [totalSupply, cTokenBalanceOfUser, compSpeeds, compSupplyState, compSupplierIndex] = x
                if(+totalSupply > 0){
                    const newSupplyIndex = +compSupplyState.index + (blockNum - compSupplyState.block) * +compSpeeds * 1e36 / +totalSupply;           
                    markets[index].accrued = (+newSupplyIndex - +compSupplierIndex) * + cTokenBalanceOfUser / 1e36 
                }
            });
            
            const data = getGeneralDetails(markets, gauges, compAccr)
            console.log(`should return ${data.earned.toString()} (new earned) < ${hndEarned.toString()}`)
            if(+data.earned.toString() < +hndEarned.toString()){
                setHndEarned(data.earned)
                setMarketsData(markets)
                return true
            }
        }
        return false
    }

    const handleUpdateClaimHnd = async (chain: number) => {
        if(network && networkId.current === chain && account && library && gaugesV4Data && comptrollerData){
            const comptroller = {...comptrollerData}
            const balanceContract = new Contract(network.hundredAddress, HUNDRED_ABI)
            const calls = [balanceContract.balanceOf(account)]
            const gauges = [...gaugesV4Data]
            gauges.forEach( g => {
                const contract = new Contract(g.generalData.address, GAUGE_V4_ABI)
                calls.push(contract.claimable_tokens(account))
            })

            const res = await comptroller.ethcallProvider.all(calls)

            if(res.length === gauges.length + 1){
                const rewards = BigNumber.from(res[0], 18)
                res.splice(0, 1)
                if(+rewards.toString() > +hndBalance.toString()){
                    res.forEach((c, index) => {
                        if(+gauges[index].userClaimableHnd.toString() > 0){
                            const claimable = BigNumber.from(c, 18)
                            if(+gauges[index].userClaimableHnd.toString() > +claimable.toString())
                                gauges[index].userClaimableHnd = claimable
                            else return false
                        }
                    })
                    setHndBalance(rewards)
                    setHndRewards(BigNumber.from("0"))
                    setGaugesV4Data(gauges)
                    return true
                }
            }
        }
        return false
    }

    const handleUpdateClaimLockHnd = async (chain: number) => {
        if(network && networkId.current === chain && account && library && gaugesV4Data && comptrollerData){
            const net = {...network}
            if(net.votingAddress){
                const comptroller = {...comptrollerData}
                const votingContract = new Contract(net.votingAddress, VOTING_ESCROW_ABI); 
                const calls = [votingContract.balanceOf(account)]
                const gauges = [...gaugesV4Data]
                gauges.forEach( g => {
                    const contract = new Contract(g.generalData.address, GAUGE_V4_ABI)
                    calls.push(contract.claimable_tokens(account))
                })
                const res = await comptroller.ethcallProvider.all(calls)

                if(res.length === gauges.length + 1){
                    const veHnd = BigNumber.from(res[0], 18)
                    res.splice(0, 1)
                    if(+veHnd.toString() > +vehndBalance.toString()){
                        res.forEach((c, index) => {
                            if(+gauges[index].userClaimableHnd.toString() > 0){
                                const claimable = BigNumber.from(c, 18)
                                if(+gauges[index].userClaimableHnd.toString() > +claimable.toString())
                                    gauges[index].userClaimableHnd = claimable
                                else return false
                            }
                        })
                        setVehndBalance(vehndBalance)
                        setHndRewards(BigNumber.from("0"))
                        setGaugesV4Data(gauges)
                        return true
                    }
                }
            }
        }
        return false
    }

    const handleUpdateEnableMarket = async (market: CTokenInfo, shouldReturn: boolean, chain: number) => {
        if(network && networkId.current === chain && account && library){
            const net = {...network}
            const ethcallComptroller = new ethers.Contract(net.unitrollerAddress, COMPTROLLER_ABI, library)
            const enteredMarkets = await ethcallComptroller.getAssetsIn(account)
            const isEnterMarket = enteredMarkets.includes(market.pTokenAddress)
            if (isEnterMarket === shouldReturn && marketsData){
                    console.log("Should return", isEnterMarket)
                    const markets = [...marketsData]
                    const m = markets.find(x => x.underlying.symbol.toLowerCase() === market.underlying.symbol.toLowerCase())
                    if(m !== undefined && networkId.current === chain){
                        m.isEnterMarket = isEnterMarket
                        setMarketsData(markets)
                    }
                return true
            }
        }
        return false
    }

    const handleUpdateApproveMarket = async (market: CTokenInfo, chain: number) => {
        if(network && networkId.current === chain && account && library){
            const tokenContract = new ethers.Contract(market.underlying.address, TOKEN_ABI, library)
            const allowance = await tokenContract.allowance(account, market.pTokenAddress)
            const value = BigNumber.from(allowance, market.underlying.decimals)
            if(+value.toString() > +market.underlying.allowance.toString()){
                console.log("Should Return", value.toString())
                const markets = [...marketsData]
                const m = markets.find(x => x.underlying.symbol.toLowerCase() === market.underlying.symbol.toLowerCase())
                if(m !== undefined && networkId.current === chain){
                    m.underlying.allowance = value
                    setMarketsData(markets)
                    return true
                }
            }
        }
        return false
    }

    const handleUpdateSupply = async (market: CTokenInfo, chain: number) => {
        if(network && networkId.current === chain && account && library){
            const token = market.isNativeToken ? CETHER_ABI : CTOKEN_ABI;
            const ctoken = new ethers.Contract(market.pTokenAddress, token, library);
                    
            const accountSnapshot = await ctoken.getAccountSnapshot(account)
            const accountSnapshot1 = BigNumber.from(accountSnapshot[1].toString(), 18)
            const accountSnapshot3 = BigNumber.from(accountSnapshot[3].toString(), market.underlying.decimals)
            const supplyBalanceInTokenUnit = accountSnapshot1.mul(accountSnapshot3)

            if(+supplyBalanceInTokenUnit.toString() > +market.supplyBalanceInTokenUnit.toString()){
                console.log("Should Return", supplyBalanceInTokenUnit.toString())
                const markets = [...marketsData]
                const m = markets.find(x => x.underlying.symbol.toLowerCase() === market.underlying.symbol.toLowerCase())

                if(m !== undefined && networkId.current === chain && comptrollerData){
                    const comptroller = {...comptrollerData}
                    let underlyingPrice = market.underlying.price
                    let walletBalance = market.underlying.walletBalance
                    if(market.isNativeToken){
                        const [price] = await comptroller.ethcallProvider.all([comptroller.oracle.getUnderlyingPrice(market.pTokenAddress)])
                        const wallet = await library.getBalance(account)
                        underlyingPrice = BigNumber.from(price, 36-market.underlying.decimals)
                        walletBalance = BigNumber.from(wallet, market.underlying.decimals)
                    }
                    else{
                        const tokenContract = new Contract(market.underlying.address, TOKEN_ABI)
                        const [price, wallet] = await comptroller.ethcallProvider.all(
                            [comptroller.oracle.getUnderlyingPrice(market.pTokenAddress),
                             tokenContract.balanceOf(account)])

                        underlyingPrice = BigNumber.from(price, 36-market.underlying.decimals)
                        walletBalance = BigNumber.from(wallet, market.underlying.decimals)
                    }

                    if(+walletBalance.toString() < +market.underlying.walletBalance){
                        const supplyBalance = BigNumber.parseValue((+supplyBalanceInTokenUnit.toString() * +underlyingPrice.toString()).noExponents())
                        m.underlying.price = underlyingPrice
                        m.underlying.walletBalance = walletBalance
                        m.supplyBalance = supplyBalance
                        m.supplyBalanceInTokenUnit = supplyBalanceInTokenUnit

                        setMarketsData(markets)
                            
                        return true
                    }
                }
            }
        }
        return false
    }

    const handleUpdateWithdraw = async (market: CTokenInfo, chain: number) => {
        if(network && networkId.current === chain && account && library){
            const token = market.isNativeToken ? CETHER_ABI : CTOKEN_ABI;
            const ctoken = new ethers.Contract(market.pTokenAddress, token, library);
                
            const accountSnapshot = await ctoken.getAccountSnapshot(account)
            const accountSnapshot1 = BigNumber.from(accountSnapshot[1].toString(), 18)
            const accountSnapshot3 = BigNumber.from(accountSnapshot[3].toString(), market.underlying.decimals)
            const supplyBalanceInTokenUnit = accountSnapshot1.mul(accountSnapshot3)
            if(+supplyBalanceInTokenUnit.toString() < +market.supplyBalanceInTokenUnit.toString()){
                console.log("Should Return", supplyBalanceInTokenUnit.toString())
                const markets = [...marketsData]
                const m = markets.find(x => x.underlying.symbol.toLowerCase() === market.underlying.symbol.toLowerCase())
                if(m !== undefined && networkId.current === chain && comptrollerData){
                    const comptroller = {...comptrollerData}
                    let underlyingPrice = market.underlying.price
                    let walletBalance = market.underlying.walletBalance
                    if(market.isNativeToken){
                        const [price] = await comptroller.ethcallProvider.all([comptroller.oracle.getUnderlyingPrice(market.pTokenAddress)])
                        const wallet = await library.getBalance(account)
                        underlyingPrice = BigNumber.from(price, 36-market.underlying.decimals)
                        walletBalance = BigNumber.from(wallet, market.underlying.decimals)
                    }
                    else{
                        const tokenContract = new Contract(market.underlying.address, TOKEN_ABI)
                        const [price, wallet] = await comptroller.ethcallProvider.all(
                            [comptroller.oracle.getUnderlyingPrice(market.pTokenAddress),
                             tokenContract.balanceOf(account)])
                        underlyingPrice = BigNumber.from(price, 36-market.underlying.decimals)
                        walletBalance = BigNumber.from(wallet, market.underlying.decimals)
                    }
                    if(+walletBalance.toString() > +market.underlying.walletBalance){
                        const supplyBalance = BigNumber.parseValue((+supplyBalanceInTokenUnit.toString() * +underlyingPrice.toString()).noExponents())
                        m.underlying.price = underlyingPrice
                        m.underlying.walletBalance = walletBalance
                        m.supplyBalance = supplyBalance
                        m.supplyBalanceInTokenUnit = supplyBalanceInTokenUnit
                        setMarketsData(markets)
                        
                        return true
                    }
                }
            }
        }
        return false
    }

    const handleUpdateBorrow = async (market: CTokenInfo, chain: number) => {
        if(network && networkId.current === chain && account && library && comptrollerData){
            const comptroller = {...comptrollerData}
            const token = market.isNativeToken ? CETHER_ABI : CTOKEN_ABI;
            const ctoken = new Contract(market.pTokenAddress, token);
            
            const calls = [ctoken.getAccountSnapshot(account), 
                           comptroller.oracle.getUnderlyingPrice(market.pTokenAddress)]
            if(!market.isNativeToken){
                const tokenContract = new Contract(market.underlying.address, TOKEN_ABI)
                calls.push(tokenContract.balanceOf(account))
            }
            const res: any = await comptroller.ethcallProvider.all(calls)

            const borrowBalanceInTokenUnit = BigNumber.from(res[0][2], market.underlying.decimals)
            const price = BigNumber.from(res[1], 36-market.underlying.decimals)
            const wallet = market.isNativeToken 
                            ? await library.getBalance(account) 
                            : res[2]
            const walletBalance = BigNumber.from(wallet, market.underlying.decimals)

            if(+borrowBalanceInTokenUnit.toString() > +market.borrowBalanceInTokenUnit.toString() 
                && +walletBalance.toString() > +market.underlying.walletBalance.toString()){
                    const markets = [...marketsData]
                    const m = markets.find(x => x.underlying.symbol === market.underlying.symbol)
                    if(m){
                        m.underlying.walletBalance = walletBalance
                        m.underlying.price = price
                        m.borrowBalanceInTokenUnit = borrowBalanceInTokenUnit
                        m.borrowBalance = borrowBalanceInTokenUnit.mul(price)

                        setMarketsData(markets)
                        return true
                    }
            }
        }
        return false
    }

    const handleUpdateRepay = async (market: CTokenInfo, chain: number) => {
        if(network && networkId.current === chain && account && library && comptrollerData){
            const comptroller = {...comptrollerData}
            const token = market.isNativeToken ? CETHER_ABI : CTOKEN_ABI;
            const ctoken = new Contract(market.pTokenAddress, token);
            
            const calls = [ctoken.getAccountSnapshot(account), 
                           comptroller.oracle.getUnderlyingPrice(market.pTokenAddress)]
            if(!market.isNativeToken){
                const tokenContract = new Contract(market.underlying.address, TOKEN_ABI)
                calls.push(tokenContract.balanceOf(account))
            }
            const res: any = await comptroller.ethcallProvider.all(calls)

            const borrowBalanceInTokenUnit = BigNumber.from(res[0][2], market.underlying.decimals)
            const price = BigNumber.from(res[1], 36-market.underlying.decimals)
            const wallet = market.isNativeToken 
                            ? await library.getBalance(account) 
                            : res[2]
            const walletBalance = BigNumber.from(wallet, market.underlying.decimals)

            if(+borrowBalanceInTokenUnit.toString() < +market.borrowBalanceInTokenUnit.toString() 
                && +walletBalance.toString() < +market.underlying.walletBalance.toString()){
                    const markets = [...marketsData]
                    const m = markets.find(x => x.underlying.symbol === market.underlying.symbol)
                    if(m){
                        m.underlying.walletBalance = walletBalance
                        m.underlying.price = price
                        m.borrowBalanceInTokenUnit = borrowBalanceInTokenUnit
                        m.borrowBalance = borrowBalanceInTokenUnit.mul(price)

                        setMarketsData(markets)
                        return true
                    }
            }
        }
        return false
    }

    const handleUpdateApproveBackstopDeposit = async (market: CTokenInfo, chain: number) => {
        if(network && networkId.current === chain && account && library && market.backstop){
            const tokenContract = new ethers.Contract(market.underlying.address, TOKEN_ABI, library)
            const allowance = await tokenContract.allowance(account, {...network.backstopMasterChef}.address)
            const value = BigNumber.from(allowance, market.underlying.decimals)
            if(+value.toString() > +market.backstop?.allowance.toString()){
                console.log("Should Return", value.toString())
                const markets = [...marketsData]
                const m = markets.find(x => x.underlying.symbol.toLowerCase() === market.underlying.symbol.toLowerCase())
                if(m !== undefined && networkId.current === chain && m.backstop){
                    m.backstop.allowance = value
                    setMarketsData(markets)
                    
                    return true
                }
            }
        }
        return false
    }

    const handleUpdateBackstopDeposit = async (market: CTokenInfo, chain: number) => {
        if(network && networkId.current === chain && account && library && market.backstop && comptrollerData){
            const comptroller = {...comptrollerData}
            const net = {...network}
            const bstop = comptroller.backstopPools.find(x=>x.underlyingTokens.toLowerCase() === market.underlying.address.toLowerCase())
            
            if(bstop && net.backstopMasterChef){
                const backstopAbi = net.backstopMasterChef.version === MasterChefVersion.v1 ? BACKSTOP_MASTERCHEF_ABI : BACKSTOP_MASTERCHEF_ABI_V2
                const backstopMasterchef = new Contract(net.backstopMasterChef.address, backstopAbi)
            
                let value = BigNumber.from("0")
                let walletBalance = BigNumber.from("0")
            
                if(market.isNativeToken){
                    const [balance] = await comptroller.ethcallProvider.all([backstopMasterchef.userInfo(bstop.poolId, account)])
                    const wallet = await library.getBalance(account)
                    value = BigNumber.from((balance as any)[0], market.backstop.decimals)
                    walletBalance = BigNumber.from(wallet, market.underlying.decimals)
                }
                else{
                    const tokenContract = new Contract(market.underlying.address, TOKEN_ABI)
                    const [balance, wallet] = await comptroller.ethcallProvider.all(
                        [backstopMasterchef.userInfo(bstop.poolId, account),
                        tokenContract.balanceOf(account)])
                    value = BigNumber.from((balance as any)[0], market.backstop.decimals)
                    walletBalance = BigNumber.from(wallet, market.underlying.decimals)
                }

                if(+value.toString() > +market.backstop.userBalance.toString() && 
                    +walletBalance.toString() < +market.underlying.walletBalance){
                    console.log("Should Return", value.toString())
                    const markets = [...marketsData]
                    const m = markets.find(x=> x.underlying.address.toLowerCase() === market.underlying.address.toLowerCase())
                    if(m && m.backstop){
                        m.backstop.userBalance = value
                        m.underlying.walletBalance = walletBalance
                        setMarketsData(markets)
                        return true
                    }
                }
            }
        }
        return false
    }

    const handleUpdateBackstopWithdraw = async (market: CTokenInfo, chain: number) => {
        if(network && networkId.current === chain && account && library && market.backstop && comptrollerData){
            const comptroller = {...comptrollerData}
            const net = {...network}
            const bstop = comptroller.backstopPools.find(x=>x.underlyingTokens.toLowerCase() === market.underlying.address.toLowerCase())
            
            if(bstop && net.backstopMasterChef){
                const backstopAbi = net.backstopMasterChef.version === MasterChefVersion.v1 ? BACKSTOP_MASTERCHEF_ABI : BACKSTOP_MASTERCHEF_ABI_V2
                const backstopMasterchef = new Contract(net.backstopMasterChef.address, backstopAbi)
            
                let value = BigNumber.from("0")
                let walletBalance = BigNumber.from("0")
            
                if(market.isNativeToken){
                    const [balance] = await comptroller.ethcallProvider.all([backstopMasterchef.userInfo(bstop.poolId, account)])
                    const wallet = await library.getBalance(account)
                    value = BigNumber.from((balance as any)[0], market.backstop.decimals)
                    walletBalance = BigNumber.from(wallet, market.underlying.decimals)
                }
                else{
                    const tokenContract = new Contract(market.underlying.address, TOKEN_ABI)
                    const [balance, wallet] = await comptroller.ethcallProvider.all(
                        [backstopMasterchef.userInfo(bstop.poolId, account),
                        tokenContract.balanceOf(account)])
                    value = BigNumber.from((balance as any)[0], market.backstop.decimals)
                    walletBalance = BigNumber.from(wallet, market.underlying.decimals)
                }

                if(+value.toString() < +market.backstop.userBalance.toString() && 
                    +walletBalance.toString() > +market.underlying.walletBalance){
                    console.log("Should Return", value.toString())
                    const markets = [...marketsData]
                    const m = markets.find(x=> x.underlying.address.toLowerCase() === market.underlying.address.toLowerCase())
                    if(m && m.backstop){
                        m.backstop.userBalance = value
                        m.underlying.walletBalance = walletBalance
                        setMarketsData(markets)
                        return true
                    }
                }
            }
        }
        return false
    }

    const handleUpdateBackstopClaim = async(market: CTokenInfo, chain: number) => {
        if(network && networkId.current === chain && account && library && comptrollerData){
            const backstopMasterChef = {...network.backstopMasterChef}
            const comptroller = {...comptrollerData}
            if(backstopMasterChef && backstopMasterChef.address && market.backstop){
                const backstopAbi = backstopMasterChef.version === MasterChefVersion.v1 ? BACKSTOP_MASTERCHEF_ABI : BACKSTOP_MASTERCHEF_ABI_V2
                const backstopMasterchef = new Contract(backstopMasterChef.address, backstopAbi)
                const balanceContract = new Contract(network.hundredAddress, HUNDRED_ABI)

                const [balance, pending] = await comptroller.ethcallProvider.all(
                    [ balanceContract.balanceOf(account), 
                      backstopMasterchef.pendingHundred(market.backstop.pool.poolId, account)]
                )
                const hundredBalance = BigNumber.from(balance, 18)
                const pendingHnd = BigNumber.from(pending, market.backstop.decimals)
                if(+hundredBalance.toString() > +hndBalance.toString() && +pendingHnd.toString() < +market.backstop.pendingHundred.toString()){
                    setHndBalance(hundredBalance)
                    const markets = [...marketsData]
                    const m = markets.find(x=> x.underlying.symbol === market.underlying.symbol)
                    if(m && m.backstop){
                        m.backstop.pendingHundred = pendingHnd
                        setMarketsData(markets)
                        return true
                    }
                }
            }
        }
        return false
    }

    const handleUpdateApproveStake = async (gauge: GaugeV4, chain: number) => {
        if(network && networkId.current === chain && account && library){
                const tokenContract = gauge.generalData.gaugeHelper 
                    ? gauge.generalData.backstopGauge 
                    ? new ethers.Contract(gauge.generalData.lpBackstopTokenUnderlying ? gauge.generalData.lpBackstopTokenUnderlying : "", CTOKEN_ABI, library)
                    : new ethers.Contract(gauge.generalData.lpTokenUnderlying, CTOKEN_ABI, library)
                    : new ethers.Contract(gauge.generalData.lpToken, CTOKEN_ABI, library)

                const allowance = gauge.generalData.gaugeHelper 
                    ? await tokenContract.allowance(account, gauge.generalData.gaugeHelper)
                    : await tokenContract.allowance(account, gauge.generalData.address)

                const value = BigNumber.from(allowance, gauge.lpTokenDecimals)

                if(+value.toString() > +gauge.userAllowance.toString()){
                    console.log("Should Return", value.toString())
                    const gauges = [...gaugesV4Data]
                    const g = gauges.find(x => x.generalData.address.toLowerCase() === gauge.generalData.address.toLowerCase())
                    if(g !== undefined && networkId.current === chain){
                        g.userAllowance = value

                        setGaugesV4Data(gauges)
                        
                        return true
                    }
                }
        }
        return false
    }

    const handleUpdateApproveUnStake = async (gauge: GaugeV4, chain: number) => {
        if(network && networkId.current === chain && account && library){
            if(gauge.generalData.gaugeHelper){
                const tokenContract = new ethers.Contract(gauge.generalData.address, TOKEN_ABI, library)
                const allowance = await tokenContract.allowance(account, gauge.generalData.gaugeHelper)
                const value = BigNumber.from(allowance, gauge.gaugeTokenDecimals)
                if(+value.toString() > +gauge.userGaugeHelperAllowance.toString()){
                    console.log("Should Return", value.toString())
                    const gauges = [...gaugesV4Data]
                    const g = gauges.find(x => x.generalData.address.toLowerCase() === gauge.generalData.address.toLowerCase())
                    if(g !== undefined && networkId.current === chain){
                        g.userGaugeHelperAllowance = value
                        setGaugesV4Data(gauges)
                        
                        return true
                    }
                }
            }
            else return true
        }
        return false
    }

    const handleUpdateMint = async (gaugeV4: GaugeV4, chain: number) => {
        if(network && networkId.current === chain && library && account){
                if(gaugeV4 && comptrollerData){
                    const comptroller = {...comptrollerData}
                    const balanceContract = new Contract(network.hundredAddress, HUNDRED_ABI)
                    const contract = new Contract(gaugeV4.generalData.address, GAUGE_V4_ABI)
                    const [balance, value] = await comptroller.ethcallProvider.all
                                        ([balanceContract.balanceOf(account), contract.claimable_tokens(account)])
                    const claimable = BigNumber.from(value, 18)
                    const hundred = BigNumber.from(balance, 18)
                    if(+claimable.toString() < +gaugeV4.userClaimableHnd.toString() && +hundred.toString() > +hndBalance.toString()){
                        console.log("Should Return", claimable.toString())
                        const gauges = [...gaugesV4Data]
                        const g = gauges.find(x => x.generalData.address.toLowerCase() === gaugeV4.generalData.address.toLowerCase())
                        if(g && networkId.current === chain){
                            setHndBalance(hundred)
                            g.userClaimableHnd = claimable
                            setGaugesV4Data(gauges)
                            return true
                        }
                    }
                }
            }
            return false
        }
    
    const handleUpdateClaimRewards = async (gaugeV4: GaugeV4, chain: number) => {
        if(network && networkId.current === chain && library && account){
                if(gaugeV4){
                    const contract = new ethers.Contract(gaugeV4.generalData.address, GAUGE_V4_ABI, library)
                    const value = await contract.claimable_reward(account, gaugeV4.reward_token)
                    const claimableReward = BigNumber.from(value, 18)
                    if(+claimableReward.toString() < +gaugeV4.claimable_reward.toString()){
                        console.log("Should Return", claimableReward.toString())
                        const gauges = [...gaugesV4Data]
                        const g = gauges.find(x => x.generalData.address.toLowerCase() === gaugeV4.generalData.address.toLowerCase())
                        if(g && networkId.current === chain){
                            g.claimable_reward = claimableReward
                            setGaugesV4Data(gauges)
                            return true
                        }
                    }
                }
            }
            return false
        }

    const handleUpdateStake = async (gaugeV4: GaugeV4, chain: number) => {
        if(network && networkId.current == chain && library && account && gaugeV4){
            const contract = new ethers.Contract(gaugeV4.generalData.address, GAUGE_V4_ABI, library)
            const value = await contract.balanceOf(account)
            const userStaked = BigNumber.from(value, gaugeV4.gaugeTokenDecimals)
            if(+userStaked.toString() > +gaugeV4.userStakeBalance.toString()){
                console.log("Should Return", userStaked.toString())
                const gauges = [...gaugesV4Data]
                const gauge = gauges.find(x=> x.generalData.address.toLowerCase() === gaugeV4.generalData.address.toLowerCase())
                const markets = [...marketsData]
                const market = gauge?.generalData.backstopGauge 
                    ? markets.find(x => x.pTokenAddress.toLowerCase() === gauge.generalData.lpTokenUnderlying.toLowerCase())
                    : markets.find(x => x.underlying.address.toLowerCase() === gaugeV4.generalData.lpTokenUnderlying.toLowerCase())
                if(market && gauge && networkId.current === chain){
                    let walletBalance = market.underlying.walletBalance
                    if(market.isNativeToken){
                        const wallet = await library.getBalance(account)
                        walletBalance = BigNumber.from(wallet, market.underlying.decimals)
                    }
                    else{
                        const tokenContract = new ethers.Contract(market.underlying.address, TOKEN_ABI, library)
                        const balance = await tokenContract.balanceOf(account)
                        walletBalance = BigNumber.from(balance, market.underlying.decimals)
                    }

                    if(+walletBalance.toString() < +market.underlying.walletBalance){
                        market.underlying.walletBalance = walletBalance
                        setMarketsData(markets)
                        gauge.userStakeBalance = userStaked
                        gauge.userStakedTokenBalance = userStaked._value
                        setGaugesV4Data(gauges)       
                        return true
                    }
                }
            }
        }
        return false
    }

    const handleUpdateUnStake = async (gaugeV4: GaugeV4, chain: number) => {
        if(network && networkId.current == chain && library && account && gaugeV4){
            const contract = new ethers.Contract(gaugeV4.generalData.address, GAUGE_V4_ABI, library)
            const value = await contract.balanceOf(account)
            const userStaked = BigNumber.from(value, gaugeV4.gaugeTokenDecimals)
            if(+userStaked.toString() < +gaugeV4.userStakeBalance.toString()){
                console.log("Should Return", userStaked.toString())
                const gauges = [...gaugesV4Data]
                const gauge = gauges.find(x=> x.generalData.address.toLowerCase() === gaugeV4.generalData.address.toLowerCase())
                const markets = [...marketsData]
                //gaugesV4Data?.find(g => g?.generalData.lpTokenUnderlying.toLowerCase() === market.pTokenAddress.toLowerCase())
                const market = gauge?.generalData.backstopGauge 
                    ? markets.find(x => x.pTokenAddress.toLowerCase() === gauge.generalData.lpTokenUnderlying.toLowerCase())
                    : markets.find(x=> x.underlying.address.toLowerCase() === gaugeV4.generalData.lpTokenUnderlying.toLowerCase())
                if(market && gauge && networkId.current === chain){
                    let walletBalance = market.underlying.walletBalance
                    if(market.isNativeToken){
                        const wallet = await library.getBalance(account)
                        walletBalance = BigNumber.from(wallet, market.underlying.decimals)
                    }
                    else{
                        const tokenContract = new ethers.Contract(market.underlying.address, TOKEN_ABI, library)
                        const balance = await tokenContract.balanceOf(account)
                        walletBalance = BigNumber.from(balance, market.underlying.decimals)
                    }

                    if(+walletBalance.toString() > +market.underlying.walletBalance){
                        market.underlying.walletBalance = walletBalance
                        setMarketsData(markets)
                        gauge.userStakeBalance = userStaked
                        gauge.userStakedTokenBalance = userStaked._value
                        setGaugesV4Data(gauges)       
                        return true
                    }
                }
            }
        }
        return false
    }
    
     //check that user balance is updated on smart contracts before updating data
    const checkUserBalanceIsUpdated = async (
        currBalanceInput: any,
        action: string,
        tokenContract?: Contract | null | undefined
        ): Promise<any> => { 
        //STEP 1: ethcall setup
        const ethcallProvider = new Provider();
        await ethcallProvider.init(library); //library = provider
        let newBalance: BigNumber;
        const currBalance = BigNumber.from(currBalanceInput);
        const call: any = [];
        //STEP 2: fetch user data
        const selected = {...selectedMarket}
        if (network && selected) {
    
        const gaugeV4 = gaugesV4Data
            ? [...gaugesV4Data].find((x) => x?.generalData.lpTokenUnderlying === selected.underlying?.address)
            : null
    
            if (tokenContract) {
                if (action === "supply" || action === 'withdraw') {
                    call.push(tokenContract.getAccountSnapshot(account)); //returns array of 4 BigNumbers
                } else if (action === 'approveSupply') {
                    call.push(tokenContract.allowance(account, selected.pTokenAddress));
                }            
            } else if (gaugeV4) {
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
                //missing case for borrow and repay
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
            if (!newBalance.eq(currBalance)) return true;
            const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
            await delay(2000); //wait 2 seconds, run again
            if (gaugeV4) {
                return await checkUserBalanceIsUpdated(currBalanceInput, action);
            } else {
                return await checkUserBalanceIsUpdated(currBalanceInput, action, tokenContract);
            }
        }
    }

     return{comptrollerData, setComptrollerData, 
            marketsData, setMarketsData, 
            marketsSpinners, setMarketsSpinners, 
            gaugesV4Data, setGaugesV4Data, 
            generalData, setGeneralData, 
            hndBalance, setHndBalance,
            hndEarned, setHndEarned, 
            hndRewards, setHndRewards, 
            hundredBalance, setHundredBalance, 
            vehndBalance, setVehndBalance,
            gaugeAddresses, setGaugeAddresses, 
            selectedMarket, setSelectedMarket, 
            selectedMarketSpinners, setSelectedMarketSpinners, 
            toggleSpinners, 
            updateMarket, 
            getMaxAmount, 
            getMaxRepayAmount, 
            checkUserBalanceIsUpdated, 
            convertUSDToUnderlyingToken
        }
 }

 export default useFetchData