import { ethers} from "ethers"
import React, { useEffect,  useRef, useState } from "react"
import { COMPTROLLER_ABI, UNITROLLER_ADDRESS, CTOKEN_ABI, ORACLE_ABI, TOKEN_ABI, MKR_TOKEN_ABI, CETHER_ABI } from "../../constants"
import GeneralDetails from "../GeneralDetails/generalDetails"
import ETHlogo from "../../assets/images/ETH-logo.png"
import BigNumber from "bignumber.js"

import {eX} from "../../helpers"
import Markets from "../Markets/markets"
import EnterMarketDialog from "../Markets/MarketsDialogs/enterMarketDialog"
import SupplyMarketDialog from "../Markets/MarketsDialogs/supplyMarketDialog"
import BorrowMarketDialog from "../Markets/MarketsDialogs/borrowMarketsDialog"
import Modal from "../Modal/modal"


const blockTime = 13.5 // seconds
const mantissa = 1e18 // mantissa is the same even the underlying asset has different decimals
const blocksPerDay = (24 * 60 * 60) / blockTime
const daysPerYear = 365
const BN = BigNumber.clone({DECIMAL_PLACES: 18})
const MaxUint256 = ethers.constants.MaxUint256

const gasLimit = "250000";
// const gasLimitSupplyDai = "535024";
// const gasLimitSupplySnx = "450000";
// const gasLimitSupplySusd = "450000";
// const gasLimitWithdrawDai = "550000";
// const gasLimitWithdrawSnx = "550000";
// const gasLimitWithdrawSusd = "550000";
// const gasLimitWithdraw = "450000";
// const gasLimitEnable = "70000";
// const gasLimitEnableDai = "66537";
// const gasLimitBorrow = "702020";
// const gasLimitBorrowDai = "729897";
// const gasLimitRepayDai = "535024";
// const gasLimitRepaySusd = "400000";
// const gasLimitEnterMarket = "112020";

const Content = (props) => {
    const modal = useRef(null)

    const [logos, setLogos] = useState(null)
    const [comptrollerData, setComptrollerData] = useState(null)
    const [marketsData, setMarketsData] = useState(null)
    const [generalData, setGeneralData] = useState(null)
    const [selectedMarket, setSelectedMarket] = useState(null)
    const [openEnterMarket, setOpenEnterMarket] = useState(false)
    const [openSupplyMarketDialog, setOpenSupplyDialog] = useState(false)
    const [openBorrowMarketDialog, setOpenBorrowMarketDialog] = useState(false)
    const [update, setUpdate] = useState(false)

    const getComptrollerData = useRef(() =>{})
    const getCTokenInfo = useRef(() => {})
    const getGeneralDetails = useRef(() => {})
    const spinner = useRef(null)
    const updateRef = useRef(null)
    const marketsRef = useRef(null)
    const selectedMarketRef = useRef(null)

    spinner.current = props.setSpinnerVisible
    updateRef.current = update
    marketsRef.current = marketsData
    selectedMarketRef.current = selectedMarket

    getComptrollerData.current = async () => {
        const comptroller = new ethers.Contract(UNITROLLER_ADDRESS, COMPTROLLER_ABI, props.provider)
        const oracleAddress = await comptroller.oracle()
        return{
            address : UNITROLLER_ADDRESS,
            comptroller,
            oracle : new ethers.Contract(oracleAddress, ORACLE_ABI, props.provider),
            allMarkets: await comptroller.getAllMarkets(),
            enteredMarkets: await comptroller.getAssetsIn(props.address)
        }
      }

     getCTokenInfo.current = async (address, isEther) => {
        const ctoken = new ethers.Contract(address, CTOKEN_ABI, props.provider);

        const underlyingAddress = isEther ? null : await ctoken.underlying()
       
        const underlying = await getUnderlying(underlyingAddress, address)
        const und = ethers.utils.formatUnits(underlying.price, 36-18)
        const und2 = ethers.utils.parseUnits(und,18)
        const decimals = underlying.decimals
        const underlyingPrice = new BN(eX(underlying.price, underlying.decimals - 36))

        const accountSnapshot = await ctoken.getAccountSnapshot(props.address)
        const supplyBalanceInTokenUnit = new BN(new BigNumber(accountSnapshot[1].toString()).times(new BigNumber(accountSnapshot[3].toString()).div(new BigNumber("10").pow(new BigNumber(decimals + 18)))))
        const supplyBalance = supplyBalanceInTokenUnit.times(underlyingPrice)

        const borrowBalanceInTokenUnit = eX(new BigNumber(accountSnapshot[2].toString()).toString(),-1 * decimals)
        const borrowBalance = borrowBalanceInTokenUnit.times(underlyingPrice)

        const cTokenTotalSupply = await ctoken.totalSupply()
        const exchangeRateStored = await ctoken.exchangeRateStored()
        const marketTotalSupply = eX(cTokenTotalSupply.mul(exchangeRateStored).toString(),-1 * decimals - 18).times(underlyingPrice)

        const totalBorrows = await ctoken.totalBorrows()
        const marketTotalBorrowInTokenUnit = eX(totalBorrows.toString(), -1 * decimals)
        const marketTotalBorrow = marketTotalBorrowInTokenUnit?.times(underlyingPrice)

        const isEnterMarket = comptrollerData.enteredMarkets.includes(address);

        const markets = await comptrollerData.comptroller.markets(address)
        const collateralFactor = new BigNumber(markets.collateralFactorMantissa.toString()).div(new BigNumber("10").pow(new BigNumber(18)))
        
        const supplyRatePerBlock = await ctoken.supplyRatePerBlock()
        const supplyApy = new BigNumber(Math.pow((supplyRatePerBlock.toNumber() / mantissa) * blocksPerDay + 1, daysPerYear - 1) - 1)

        const borrowRatePerBlock = await ctoken.borrowRatePerBlock()
        const borrowApy = new BigNumber(Math.pow((borrowRatePerBlock.toNumber() / mantissa) * blocksPerDay + 1,daysPerYear - 1) - 1)

        const cash = await ctoken.getCash() 
        const underlyingAmount = eX(cash, -1 * decimals);

        const liquidity = +underlyingAmount * +underlyingPrice
        
        const underlyingAllowance = eX(underlying.allowance, -1 * decimals)
        
        const speed = await comptrollerData.comptroller.compSpeeds(address)
        const pctSpeed = eX(speed.toString(), -18);

        return {
          pTokenaddress : address,
          underlyingAddress,
          symbol: underlying.symbol,
          logoSource: underlying.logo,
          supplyApy,
          borrowApy,
          underlyingAllowance,
          walletBalance: eX(underlying.walletBalance, -1 * decimals),
          supplyBalanceInTokenUnit,
          supplyBalance,
          marketTotalSupply,
          borrowBalanceInTokenUnit,
          borrowBalance,
          marketTotalBorrowInTokenUnit,
          marketTotalBorrow,
          isEnterMarket,
          underlyingAmount,
          underlyingPrice,
          liquidity,
          collateralFactor,
          pctSpeed,
          decimals,
          spinner: false,
          supplySpinner: false,
          withdrawSpinner: false,
          borrowSpinner: false,
          repaySpinner: false
        }
      }

      const getUnderlying = async (underlyingAddress, ptoken) => {  
        if (!underlyingAddress)
          return await getEtherInfo(ptoken)
        else if (underlyingAddress.toLowerCase() === "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2")
          return await getMakerInfo(underlyingAddress)
        else 
          return await getTokenInfo(underlyingAddress, ptoken)
      }

      const getEtherInfo = async (ptoken) => {
        return{
          address: "0x0",
          symbol: "ETH",
          name: "Ethereum",
          decimals: 18,
          totalSupply: 0,
          logo: ETHlogo,
          price: await comptrollerData.oracle.getUnderlyingPrice(ptoken),
          walletBalance: await props.provider.getBalance(props.address),
          allowance: MaxUint256,
        }
      }

      const getTokenInfo = async(address, ptoken) => {
        const contract = new ethers.Contract(address, TOKEN_ABI, props.provider)
        const tempSymbol = await contract.symbol()
        const logo = tempSymbol === "WETH" ? ETHlogo : logos?.find(x=>x.symbol.toLowerCase() === tempSymbol.toLowerCase())?.logoURI
        return{
          address,
          symbol : tempSymbol,
          name: await contract.name(),
          decimals: await contract.decimals(),
          totalSupply: await contract.totalSupply(),
          logo, //`https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`,
          price: await comptrollerData.oracle.getUnderlyingPrice(ptoken),
          walletBalance: await contract.balanceOf(props.address),
          allowance: await contract.allowance(props.address, ptoken),
          balance: await contract.balanceOf(props.address)
        }
      }

      const getMakerInfo = async (address) => {
        const contract = new ethers.Contract(address, MKR_TOKEN_ABI, props.provider)
        var decimals = await contract.decimals()
        return{
          address: address,
          symbol: ethers.utils.parseBytes32String(await contract.symbol()),
          name: ethers.utils.parseBytes32String(await contract.name()),
          decimals: decimals/1,
          totalSupply: await contract.totalSupply()
        }
      }

      const getPctPrice = async () => {
        const response = await fetch(
            "https://api.coingecko.com/api/v3/simple/price?ids=percent&vs_currencies=usd"
            // "https://api.coingecko.com/api/v3/simple/price?ids=compound-governance-token&vs_currencies=usd"
          );
          const data = await response.json();
          return new BigNumber(data?.percent?.usd);
      }

      getGeneralDetails.current = async () => {
        const pctPrice = await getPctPrice()
        let totalSupplyBalance = new BN(0)
        let totalBorrowBalance = new BN(0)
        let allMarketsTotalSupplyBalance = new BN(0)
        let allMarketsTotalBorrowBalance = new BN(0)
        let totalBorrowLimit = new BN(0)
        let yearSupplyInterest = new BN(0)
        let yearBorrowInterest = new BN(0)
        let yearSupplyPctRewards = new BN(0)
        let yearBorrowPctRewards = new BN(0)
        let totalLiquidity = new BN(0)
        

        marketsData.map((market) => {            
            totalSupplyBalance = totalSupplyBalance.plus(market?.supplyBalance)
            totalBorrowBalance = totalBorrowBalance.plus(market?.borrowBalance)
            

            if (market?.marketTotalSupply?.isGreaterThan(0)) {
                allMarketsTotalSupplyBalance = allMarketsTotalSupplyBalance.plus(market?.marketTotalSupply)
            }
      
            if (market?.marketTotalBorrow?.isGreaterThan(0)) {
                allMarketsTotalBorrowBalance = allMarketsTotalBorrowBalance.plus(market?.marketTotalBorrow)
            }

            totalBorrowLimit = totalBorrowLimit.plus(market?.isEnterMarket ? market?.supplyBalance.times(market?.collateralFactor) : 0)

            yearSupplyInterest = yearSupplyInterest.plus(market?.supplyBalance.times(market?.supplyApy).div(100))
            yearBorrowInterest = yearBorrowInterest.plus(market?.borrowBalance.times(market?.borrowApy).div(100))

            if (market.liquidity > 0) {
                totalLiquidity = totalLiquidity.plus(new BigNumber(market?.liquidity))
            }
            return 0
        })

          const netApy = yearSupplyInterest.minus(yearBorrowInterest).div(totalSupplyBalance)
        
        return {
            totalSupplyBalance,
            totalBorrowBalance,
            allMarketsTotalSupplyBalance,
            allMarketsTotalBorrowBalance,
            totalBorrowLimit,
            totalBorrowLimitUsedPercent: totalBorrowBalance.div(totalBorrowLimit).times(100),
            yearSupplyInterest,
            yearBorrowInterest,
            netApy,
            totalSupplyPctApy: yearSupplyPctRewards?.div(totalSupplyBalance),
            totalBorrowPctApy: yearBorrowPctRewards?.div(totalBorrowBalance),
            pctPrice,
            totalLiquidity
        }
      }

    useEffect(() => {
        const GetData = async () => {
            
            var comptroller =  await getComptrollerData.current()
            setComptrollerData(comptroller)    
            
        }

        const GetLogos = async() => {
          try{
            const url = 'https://tokens.coingecko.com/uniswap/all.json'
            const response = await fetch(url)
            const data = await response.json()
            setLogos(data?.tokens)
          }
          catch(err){
            console.log(err)
          }
        }

        const interval = setInterval(() => {
          try{
              GetData()
              setUpdate(true)
          }
          catch(err){
              console.log(err)
          }
      }, 60000);
        
        if(props.provider && props.address !== ""){
            try{
              spinner.current(true)
              GetLogos()
              GetData()
            }
            catch(err){
                console.log(err)
            }
            finally{
              spinner.current(false)
            }
        }
        else{
            try{
              setUpdate(false)
              clearInterval(interval)
            }
            catch(err){

            }
            setComptrollerData(null)
            setMarketsData(null)
        }

        return() => clearInterval(interval)

    },[props.provider, props.address])

    useEffect(() => {
        const GetMarkets = async() =>{
          try{
            if(!updateRef.current)
              spinner.current(true)
            
              var markets = await Promise.all(comptrollerData.allMarkets.filter((a) => {
                  if (a.toLowerCase() === "0xc98182014c90baa26a21e991bfec95f72bd89aed")
                     return false
                  return true
                    }).map(async (a) => {
                const isEther = a.toLowerCase() === "0x45f157b3d3d7c415a0e40012d64465e3a0402c64"
                return await getCTokenInfo.current(a, isEther)}))

           // var data = await getGeneralDetails(markets)
            if(marketsRef.current){
              markets.map((m) => {
                var market = marketsRef.current.find(x => x.symbol === m.symbol)
                if (market){
                  m.spinner = market.spinner
                  m.supplySpinner = market.supplySpinner
                  m.withdrawSpinner = market.withdrawSpinner
                  m.borrowSpinner = market.borrowSpinner
                  m.repaySpinner = market.repaySpinner
                }
                return true
              })
            }
            setMarketsData(markets)
            if(selectedMarketRef.current)
            {
              var market = markets.find(x=>x.symbol === selectedMarketRef.current.symbol)
              if (market)
                setSelectedMarket(market)
            }
            //setGeneralData(data)
          }
          catch(err){
            console.log(err)
            setUpdate(true)
            var comptroller =  await getComptrollerData.current()
            setComptrollerData(comptroller) 
          }
          finally{
            if(!updateRef.current)
            spinner.current(false)
          }
        }


        if(comptrollerData){
            GetMarkets()
        }
        else{
            //setGeneralData(null)
            setMarketsData(null)
        }
    }, [comptrollerData])

    useEffect (() => {
        const GetGeneral = async () => {
            if(!updateRef.current)
              spinner.current(true)
            var data = await getGeneralDetails.current()
            setGeneralData(data)
            if(!updateRef.current)
              spinner.current(false)
        }

        if (marketsData){
            GetGeneral()

        }
        else{
            setGeneralData(null)
        }
    },[marketsData])

    const getMaxAmount = async (symbol, walletBalance) => {
      if (symbol === "ETH") {
       
        let gasPrice = await props.provider.getGasPrice()
        var price = new BN(gasPrice.toString()).times(new BN(gasLimit)).div(new BigNumber("10").pow(new BigNumber(18)))
        var balance = walletBalance.minus(price)
        return balance
      } else {
        return walletBalance
      }
    }

    const getMaxRepayAmount = (symbol, borrowBalanceInTokenUnit, borrowApy) => {
      const maxRepayFactor = new BigNumber(1).plus(borrowApy / 100); // e.g. Borrow APY = 2% => maxRepayFactor = 1.0002
      if (symbol === "ETH") {
        return borrowBalanceInTokenUnit.times(maxRepayFactor).decimalPlaces(18); // Setting it to a bit larger, this makes sure the user can repay 100%.
      } else {
        return borrowBalanceInTokenUnit.times(maxRepayFactor).decimalPlaces(18); // The same as ETH for now. The transaction will use -1 anyway.
      }
    }

    const enterMarketDialog = (market) => {
      setSelectedMarket(market)
      setOpenEnterMarket(true)
    }

    const closeMarketDialog = () => {
      if(!props.spinnerVisible){
        setOpenEnterMarket(false)
        setSelectedMarket(null)
      }
    }

    const handleEnterMarket = async(address, symbol) => {
      spinner.current(true)
      var market = marketsRef.current.find(m => m.symbol === symbol)
      if (market){
        try{
          let addr = [market.pTokenaddress]
          const signer = props.provider.getSigner()
          const signedComptroller = comptrollerData.comptroller.connect(signer)
          const tx = await signedComptroller.enterMarkets(addr)
          market = marketsData.find(m => m.symbol === symbol)
          market.spinner = true
          console.log(tx)
          spinner.current(false)
          setOpenEnterMarket(false)
          const receipt = await tx.wait()

          market = marketsData.find(m => m.symbol === symbol)
          market.spinner = false
          market.isEnterMarket = true
          setUpdate(true)
          var comptroller =  await getComptrollerData.current()
          setComptrollerData(comptroller) 
          console.log(receipt)
           
        }
        catch (err){
          console.log(err)
          market = marketsRef.current.find(m => m.symbol === symbol)
          market.spinner = false 
        }
      }
      spinner.current(false)
    }

    const handleExitMarket = async (address, symbol) => {
      spinner.current(true)

      //var market = marketsData.find(m => m.symbol === symbol)
      // if (market){
      //   try{
      //     const signer = props.provider.getSigner()
      //     const signedComptroller = comptrollerData.comptroller.connect(signer)
      //     const tx = await signedComptroller.exitMarket(market.pTokenaddress)

      //     const receipt = await tx.wait()

      //     if(receipt.status){
      //       var comptroller =  await getComptrollerData.current()
      //       setComptrollerData(comptroller)  
      //       setOpenEnterMarket(false)
      //     } 
      //   }
      //   catch (err){
      //     console.log(err)
      //   }
      // }
      spinner.current(false)
    }
    
    const supplyMarketDialog = (market) => {
      setSelectedMarket(market)
      setOpenSupplyDialog(true)
    }

    const closeSupplyMarketDialog = () =>{
      if(!props.spinnerVisible){
        setOpenSupplyDialog(false)
        setSelectedMarket(null)
      }
    }

    const handleEnable = async (symbol, borrowDialog) => {
      spinner.current(true)
      var market = marketsRef.current.find(x=> x.symbol === symbol)
      if(market){
        try{
          borrowDialog ? market.repaySpinner = true : market.supplySpinner = true
          borrowDialog ? selectedMarketRef.current.repaySpinner = true : selectedMarketRef.current.supplySpinner = true
          const signer = props.provider.getSigner()
          const contract = new ethers.Contract(market.underlyingAddress, TOKEN_ABI, signer);
          const tx = await contract.approve(market.pTokenaddress, MaxUint256)
          spinner.current(false)
          console.log(tx)
          const receipt = await tx.wait()
          console.log(receipt)
        }
        catch(err){
          console.log(err)
          
        }
        finally{
          spinner.current(false)
          market = marketsRef.current.find(x=> x.symbol === symbol)
          borrowDialog ? market.repaySpinner = false : market.supplySpinner = false
          
          setUpdate(true)
          var comptroller =  await getComptrollerData.current()
          setComptrollerData(comptroller)  
          if (selectedMarketRef.current && selectedMarketRef.current.symbol === symbol)
            borrowDialog ? selectedMarketRef.current.repaySpinner = false : selectedMarketRef.current.supplySpinner = false
        }
      }
    }

    const handleSupply = async (symbol, amount) => {
      spinner.current(true)
      var market = marketsRef.current.find(x =>x.symbol === symbol)
      if(market){
        try{
          let am = market.isEther ? {value: ethers.utils.parseEther(amount)} : ethers.utils.parseUnits(amount, market.decimals)
          selectedMarketRef.current.supplySpinner = true
          market.supplySpinner = true
          const signer = props.provider.getSigner()
          const token = market.isEther ? CETHER_ABI : CTOKEN_ABI
          const ctoken = new ethers.Contract(market.pTokenaddress, token, signer)
          const tx = await ctoken.mint(am)

          spinner.current(false)
          

          console.log(tx)
          const receipt = await tx.wait()
          console.log(receipt)
        }
        catch(err){
          console.log(err)
        }
        finally{
          spinner.current(false)
          market = marketsRef.current.find(x =>x.symbol === symbol)
          market.supplySpinner = false

          setUpdate(true)
          var comptroller = await getComptrollerData.current()
          setComptrollerData(comptroller)
          if(selectedMarketRef.current && selectedMarketRef.current.symbol === symbol)
            selectedMarketRef.current.supplySpinner = false
        }
      }
    }

    const handleWithdraw = async (symbol, amount, max) => {
      console.log("max:" + max)
      spinner.current(true)
      var market = marketsRef.current.find(x=>x.symbol === symbol)
      if(market){
        try{
          const signer = props.provider.getSigner()
          const token = market.isEther ? CETHER_ABI : CTOKEN_ABI
          const ctoken = new ethers.Contract(market.pTokenaddress, token, signer)
          var withdraw = 0
          if (max){
            console.log("ok")
            const accountSnapshot = await ctoken.getAccountSnapshot(props.address)
            withdraw = ethers.BigNumber.from(accountSnapshot[1].toString()).mul(ethers.BigNumber.from(accountSnapshot[3].toString()))
            console.log(amount.toString())
          }
          else
          withdraw = ethers.utils.parseUnits(amount.toString(), market.decimals)
          
          console.log(withdraw.toString())
          
          selectedMarketRef.current.withdrawSpinner = true
          market.withdrawSpinner = true
          const tx = await ctoken.redeemUnderlying(withdraw)

          spinner.current(false)

          console.log(tx)
          const receipt = await tx.wait()
          console.log(receipt)
          
        }
        catch(err){
          console.log(err)
        }
        finally{
          spinner.current(false)
          market = marketsRef.current.find(x => x.symbol === symbol)
          market.withdrawSpinner = false
          setUpdate(true)
          var comptroller = await getComptrollerData.current()
          setComptrollerData(comptroller)
          if(selectedMarketRef.current && selectedMarketRef.current.symbol === symbol)
            selectedMarketRef.current.withdrawSpinner = false
        }
      }

    }

    const borrowMarketDialog = (market) => {
      setSelectedMarket(market)
      setOpenBorrowMarketDialog(true)
    }

    const closeBorrowMarketDialog = () => {
      if(!props.spinnerVisible){
        setOpenBorrowMarketDialog(false)
        setSelectedMarket(null)
      }
  }

  const handleBorrow = async (symbol, amount) => {
    spinner.current(true)
    var market = marketsRef.current.find(x => x.symbol === symbol)
    if(market){
      try{
        let am = ethers.utils.parseUnits(amount, market.decimals)
        selectedMarketRef.current.borrowSpinner = true
        market.borrowSpinner = true
        const signer = props.provider.getSigner()
        const token = market.isEther ? CETHER_ABI : CTOKEN_ABI
        const ctoken = new ethers.Contract(market.pTokenaddress, token, signer)
        const tx = await ctoken.borrow(am)

        spinner.current(false)

        console.log(tx)
        const receipt = await tx.wait()
        console.log(receipt)
      }
      catch(err){
        console.log(err)
      }
      finally{
        spinner.current(false)
        market = marketsRef.current.find(x => x.symbol === symbol)
        market.borrowSpinner = false
        setUpdate(true)
        var comptroller = await getComptrollerData.current()
        setComptrollerData(comptroller)
        if(selectedMarketRef.current && selectedMarketRef.current.symbol === symbol)
          selectedMarketRef.current.borrowSpinner = false
      }
    }
  }

  const handleRepay = async(symbol, amount, fullRepay) => {
    spinner.current(true)
    var market = marketsRef.current.find(x => x.symbol === symbol)
    if(market){
      try{
        let am = props.isEther ? {value: ethers.utils.parseEther(amount)} : (fullRepay ? MaxUint256 : ethers.utils.parseUnits(amount, market.decimals))
        selectedMarketRef.current.repaySpinner = true
        market.repaySpinner = true
        const signer = props.provider.getSigner()
        const token = market.isEther ? CETHER_ABI : CTOKEN_ABI
        const ctoken = new ethers.Contract(market.pTokenaddress, token, signer)
        const tx = await ctoken.repayBorrow(am)

        spinner.current(false)

        console.log(tx)
        const receipt = await tx.wait()
        console.log(receipt)
      }
      catch(err){
        console.log(err)
      }
      finally{
        spinner.current(false)
        market = marketsRef.current.find(x => x.symbol === symbol)
        market.repaySpinner = false
        setUpdate(true)
        var comptroller = await getComptrollerData.current()
        setComptrollerData(comptroller)
        if(selectedMarketRef.current && selectedMarketRef.current.symbol === symbol)
          selectedMarketRef.repaySpinner = false
      }
    }
  }
    
    return (
        <div className="content">
            <GeneralDetails generalData={generalData}/>
            <Markets generalData = {generalData} marketsData = {marketsData} enterMarketDialog={enterMarketDialog} supplyMarketDialog={supplyMarketDialog} borrowMarketDialog={borrowMarketDialog}/>
            <EnterMarketDialog open={openEnterMarket} market={selectedMarket} generalData={generalData} closeMarketDialog = {closeMarketDialog} 
              handleEnterMarket={handleEnterMarket} handleExitMarket={handleExitMarket}/>
            <SupplyMarketDialog open={openSupplyMarketDialog} market={selectedMarket} generalData={generalData} 
              closeSupplyMarketDialog = {closeSupplyMarketDialog} darkMode={props.darkMode} 
              handleEnable = {handleEnable} handleSupply={handleSupply} handleWithdraw={handleWithdraw} getMaxAmount={getMaxAmount} spinnerVisible={props.spinnerVisible}/>
            <BorrowMarketDialog open={openBorrowMarketDialog} market={selectedMarket} generalData={generalData} 
              closeBorrowMarketDialog={closeBorrowMarketDialog} darkMode={props.darkMode} getMaxAmount={getMaxAmount} handleEnable = {handleEnable}
              handleBorrow={handleBorrow} handleRepay={handleRepay} getMaxRepayAmount={getMaxRepayAmount} spinnerVisible={props.spinnerVisible}/>
            <Modal ref={modal}>
                hello
            </Modal>
        </div>
    )
}

export default Content