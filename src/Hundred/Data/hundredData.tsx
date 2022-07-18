import { useWeb3React } from "@web3-react/core"
import { useEffect, useRef, useState } from "react"
import { Comptroller, getComptrollerData } from "../../Classes/comptrollerClass"
import { useGlobalContext } from "../../Types/globalContext"
import { useHundredDataContext } from "../../Types/hundredDataContext"
import { useUiContext } from "../../Types/uiContext"
import {GaugeV4, getBackstopGaugesData, getGaugesData} from "../../Classes/gaugeV4Class";
import { fetchData } from "./fetchData"
import { CTokenInfo, CTokenSpinner, SpinnersEnum } from "../../Classes/cTokenClass"
import { BigNumber } from "../../bigNumber"
import { GeneralDetailsData, getGeneralDetails } from "../../Classes/generalDetailsClass"
import { CETHER_ABI, COMPTROLLER_ABI, CTOKEN_ABI, GAUGE_V4_ABI, HUNDRED_ABI, TOKEN_ABI } from "../../abi"
import { Contract, Provider } from "ethcall"
import { ethers } from "ethers"
import { delay } from "../../helpers"

export enum UpdateTypeEnum{
    EnableMarket,
    ApproveMarket,
    Supply,
    Withdraw,
    ApproveStake,
    ApproveUnStake,
    Mint,
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

    const { setGMessage } = useHundredDataContext()

    const {network, hndPrice, setHndEarned, setHndBalance, setHundredBalance, setVehndBalance, setHndRewards, setGaugeAddresses} = useGlobalContext()
    const {setSpinnerVisible, toastErrorMessage} = useUiContext()
    const {library, chainId, account} = useWeb3React()

    useEffect(() => {
        return () => clearTimeout(Number(timeoutId.current));
    }, [])

    useEffect(() => {
        clearTimeout(Number(timeoutId.current));
        timeoutId.current = undefined
        firstLoad.current = true
        setComptrollerData(undefined)
        setMarketsData([])
        setGaugesV4Data([])
        setGeneralData(undefined)
        setSelectedMarket(undefined)
        setMarketsSpinners([])
        if(library && network && {...network}.chainId === chainId && account && account != ""){
            networkId.current = {...network}.chainId
            setSpinnerVisible(true)
            getComptroller()
        }
    }, [library, network, account])

    useEffect(() => {
        if(comptrollerData){
            updateData()
        }
    }, [comptrollerData])

    useEffect(() => {
        if(marketsData.length > 0 && gaugesV4Data.length > 0 && compAccrued.current !== undefined){
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
            const comptroller = await getComptrollerData(library, net)
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
        if(network && account && comptrollerData){
            const comptroller = {...comptrollerData}
            const net = {...network}
            const gauges = await getGaugesData(library, account, net)
            const backstopGauges = await getBackstopGaugesData(library, account, net)

            const gaugesData = [...gauges, ...backstopGauges]

            const markets = await fetchData({ allMarkets: [...comptroller.allMarkets], userAddress: account, comptrollerData: comptroller, network: net, marketsData: marketsData, provider: library, hndPrice: hndPrice, gaugesData: gaugesData })
          
           
          
            setMarketsData(markets.markets)
            setGaugesV4Data(gaugesData)
          
            
            updateMarkets(markets.markets, markets.hndBalance, markets.hundredBalace, markets.comAccrued, markets.vehndBalance, markets.hndRewards, markets.gaugeAddresses)
            
            if(firstLoad.current){
                const spinners = markets.markets.map(m => {
                    return new CTokenSpinner(m.underlying.symbol)
                  })
                setMarketsSpinners(spinners)
                firstLoad.current = false
                setSpinnerVisible(false)
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
            clearTimeout(Number(timeoutId.current));
            await getData()
            timeoutId.current = setTimeout(updateData, 10000)
            errorsCount.current = 0
        }
        catch(error: any){
            if(!firstLoad.current)
                timeoutId.current = setTimeout(updateData, (errorsCount.current < 2 ? errorsCount.current + 1 : errorsCount.current) * 10000 + 10000)
            else{
                if(errorsCount.current < 2)
                    timeoutId.current = setTimeout(updateData, (errorsCount.current + 1) * 1000)
                else if (errorsCount.current === 3)
                    timeoutId.current = setTimeout(updateData, 5000)
                else if (errorsCount.current === 7){
                    if(firstLoad.current) setSpinnerVisible(false)
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
        if(market.isNativeToken) 
            await updateData()
        const tempMarket = [...marketsData].find(x=> x.underlying.symbol === market.underlying.symbol)
        const m = tempMarket ? tempMarket : market
        const borrowAPYPerDay = m.borrowApy.div(BigNumber.from('365'));
        const maxRepayFactor = BigNumber.from("1").addSafe(borrowAPYPerDay)// e.g. Borrow APY = 2% => maxRepayFactor = 1.0002
        
        const amount = BigNumber.parseValueSafe(m.borrowBalanceInTokenUnit.mulSafe(maxRepayFactor).toString(), m.underlying.decimals)
        
        return amount // The same as ETH for now. The transaction will use -1 anyway.
      }

    function convertUSDToUnderlyingToken(USD: string, market: CTokenInfo ) : BigNumber{ //USD -> underlying token
        const underlyingToken = +USD / +market.underlying.price.toString(); 
        return BigNumber.parseValueSafe(underlyingToken.toString(), market.underlying.decimals);  
    }

    const updateMarket = async (market: CTokenInfo, updateType: UpdateTypeEnum, shouldReturn: any): Promise<void> => {
        console.log("Begin Update Market - Try to stop Update")
        stopUpdate()
        console.log("Update Market")
        const net = {...network}
        if(network && net && net.chainId){
            await handleUpdateMarket(updateType, market, shouldReturn)
        }
        startUpdate()
    }

    const handleUpdateMarket = async (updateType: UpdateTypeEnum, market: CTokenInfo | GaugeV4, shouldReturn:any, count = 0) => {
        const net = {...network}
        if(network && net && net.chainId && networkId.current === net.chainId && account && library){
            try{
                if (count === 0) await delay(5)
                let res = false
                switch (updateType){
                    case UpdateTypeEnum.EnableMarket:
                        res = await handleUpdateEnableMarket(market as CTokenInfo, shouldReturn, net.chainId)
                        break
                    case UpdateTypeEnum.ApproveMarket:
                        res = await handleUpdateApproveSupply(market as CTokenInfo, net.chainId)
                        break
                    case UpdateTypeEnum.Supply:
                        res = await handleUpdateSupply(market as CTokenInfo, net.chainId)
                        break
                    case UpdateTypeEnum.Withdraw:
                        res = await handleUpdateWithdraw(market as CTokenInfo, net.chainId)
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

    const handleUpdateEnableMarket = async (market: CTokenInfo, shouldReturn: boolean, chain: number) => {
        if(network && networkId.current === chain && account && library){
            const net = {...network}
            const ethcallComptroller = new ethers.Contract(net.unitrollerAddress, COMPTROLLER_ABI, library)
            const enteredMarkets = await ethcallComptroller.getAssetsIn(account)
            const isEnterMarket = enteredMarkets.includes(market.pTokenAddress)
            if (isEnterMarket === shouldReturn && marketsData){
                    console.log("Should return", isEnterMarket)
                    const markets = [...marketsData]
                    const m = markets.find(x => x.underlying.symbol === market.underlying.symbol)
                    if(m !== undefined && networkId.current === chain){
                        m.isEnterMarket = isEnterMarket
                        setMarketsData(markets)
                    }
                return true
            }
        }
        return false
    }

    const handleUpdateApproveSupply = async (market: CTokenInfo, chain: number) => {
        if(network && networkId.current === chain && account && library){
            const tokenContract = new ethers.Contract(market.underlying.address, TOKEN_ABI, library)
            const allowance = await tokenContract.allowance(account, market.pTokenAddress)
            const value = BigNumber.from(allowance, market.underlying.decimals)
            if(+value.toString() > +market.underlying.allowance.toString()){
                console.log("Should Return", value.toString())
                const markets = [...marketsData]
                const m = markets.find(x => x.underlying.symbol === market.underlying.symbol)
                if(m !== undefined && networkId.current === chain){
                    m.underlying.allowance = value
                    setMarketsData(markets)
                    if(selectedMarket && {...selectedMarket}.underlying.symbol === m.underlying.symbol){
                        setSelectedMarket(m)
                    }
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
                const m = markets.find(x => x.underlying.symbol === market.underlying.symbol)

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
                const m = markets.find(x => x.underlying.symbol === market.underlying.symbol)
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

    const handleUpdateApproveStake = async (gauge: GaugeV4, chain: number) => {
        if(network && networkId.current === chain && account && library){
            const gaugeHelper = {...network}.gaugeHelper
                const tokenContract = gaugeHelper ? new ethers.Contract(gauge.generalData.lpTokenUnderlying, CTOKEN_ABI, library)
                                        : new ethers.Contract(gauge.generalData.lpToken, CTOKEN_ABI, library)
                const allowance = gaugeHelper ? await tokenContract.allowance(account, gaugeHelper)
                                  : await tokenContract.allowance(account, gauge.generalData.address)
                const value = BigNumber.from(allowance, gauge.lpTokenDecimals)
                if(+value.toString() > +gauge.userAllowance.toString()){
                    console.log("Should Return", value.toString())
                    const gauges = [...gaugesV4Data]
                    const g = gauges.find(x => x.generalData.address === gauge.generalData.address)
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
            const gaugeHelper = {...network}.gaugeHelper
            if(gaugeHelper){
                const tokenContract = new ethers.Contract(gauge.generalData.address, TOKEN_ABI, library)
                const allowance = await tokenContract.allowance(account, gaugeHelper)
                const value = BigNumber.from(allowance, gauge.gaugeTokenDecimals)
                if(+value.toString() > +gauge.userGaugeHelperAllowance.toString()){
                    console.log("Should Return", value.toString())
                    const gauges = [...gaugesV4Data]
                    const g = gauges.find(x => x.generalData.address === gauge.generalData.address)
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

    const handleUpdateMint =async (gaugeV4: GaugeV4, chain: number) => {
        if(network && networkId.current === chain && library && account){
                if(gaugeV4){
                    const contract = new ethers.Contract(gaugeV4.generalData.address, GAUGE_V4_ABI, library)
                    const value = await contract.claimable_tokens(account)
                    const claimable = BigNumber.from(value, 18)
                    if(+claimable.toString() < +gaugeV4.userClaimableHnd){
                        console.log("Should Return", claimable.toString())
                        const gauges = [...gaugesV4Data]
                        const g = gauges.find(x => x.generalData.address === gaugeV4.generalData.address)
                        if(g && networkId.current === chain){
                            g.userClaimableHnd = claimable
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
                const gauge = gauges.find(x=> x.generalData.address === gaugeV4.generalData.address)
                const markets = [...marketsData]
                const market = markets.find(x=> x.underlying.address === gaugeV4.generalData.lpTokenUnderlying)
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
                const gauge = gauges.find(x=> x.generalData.address === gaugeV4.generalData.address)
                const markets = [...marketsData]
                const market = markets.find(x=> x.underlying.address === gaugeV4.generalData.lpTokenUnderlying)
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

     return{comptrollerData, setComptrollerData, marketsData, setMarketsData, marketsSpinners,
        setMarketsSpinners, gaugesV4Data, setGaugesV4Data, generalData, setGeneralData,
       selectedMarket, setSelectedMarket, selectedMarketSpinners, setSelectedMarketSpinners, toggleSpinners, updateMarket, 
       getMaxAmount, getMaxRepayAmount, checkUserBalanceIsUpdated, convertUSDToUnderlyingToken}
 }

 export default useFetchData

 