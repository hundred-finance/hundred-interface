import { ethers} from "ethers"
import React, { useEffect, useRef, useState } from "react"
import { COMPTROLLER_ABI, UNITROLLER_ADDRESS, CTOKEN_ABI, ORACLE_ABI, TOKEN_ABI, MKR_TOKEN_ABI } from "../../constants"
import GeneralDetails from "../GeneralDetails/generalDetails"
import ETHlogo from "../../assets/images/ETH-logo.png"
import BigNumber from "bignumber.js"

import {eX} from "../../helpers"
import Markets from "../Markets/markets"
import EnterMarketDialog from "../Markets/MarketsDialogs/enterMarketDialog"
import SupplyMarketDialog from "../Markets/MarketsDialogs/supplyMarketDialog"
import BorrowMarketDialog from "../Markets/MarketsDialogs/borrowMarketsDialog"
import Modal from "../Modal/modal"

const MaxUint256 = new BigNumber(2).pow(256).div(1)
const blockTime = 13.5
const mantissa = 1e18 // mantissa is the same even the underlying asset has different decimals
const blocksPerDay = (24 * 60 * 60) / blockTime
const daysPerYear = 365

const Content = (props) => {
    const modal = useRef(null)

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

    spinner.current = props.setSpinnerVisible
    updateRef.current = update

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

        const decimals = underlying.decimals
        const underlyingPrice = eX(underlying.price, underlying.decimals - 36)

        const accountSnapshot = await ctoken.getAccountSnapshot(props.address)
        const supplyBalanceInTokenUnit = eX(new BigNumber(accountSnapshot[1].toString()).times(accountSnapshot[3].toString()).toString(),-1 * decimals - 18)
        const supplyBalance = eX(supplyBalanceInTokenUnit.times(underlyingPrice), -1 * decimals -18)
        const borrowBalanceInTokenUnit = eX(new BigNumber(accountSnapshot[2].toString()).toString(),-1 * decimals)
        const borrowBalance = borrowBalanceInTokenUnit.times(isNaN(underlyingPrice) ? 0 : underlyingPrice)

        const cTokenTotalSupply = await ctoken.totalSupply()
        const exchangeRateStored = await ctoken.exchangeRateStored()
        const marketTotalSupply = eX(cTokenTotalSupply.mul(exchangeRateStored).toString(),-1 * decimals - 18).times(underlyingPrice)

        const totalBorrows = await ctoken.totalBorrows()
        const marketTotalBorrowInTokenUnit = eX(totalBorrows.toString(), -1 * decimals)
        const marketTotalBorrow = marketTotalBorrowInTokenUnit?.times(underlyingPrice)

        const isEnterMarket = comptrollerData.enteredMarkets.includes(address);

        const marktets = await comptrollerData.comptroller.markets(address)
        const collateralFactor = eX(marktets.collateralFactorMantissa.toString(), -18)

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
          decimals
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
        const contract = new ethers.Contract(address, TOKEN_ABI, props.provider);
        return{
          address,
          symbol: await contract.symbol(),
          name: await contract.name(),
          decimals: await contract.decimals(),
          totalSupply: await contract.totalSupply(),
          logo: `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`,
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
        let totalSupplyBalance = new BigNumber(0)
        let totalBorrowBalance = new BigNumber(0)
        let allMarketsTotalSupplyBalance = new BigNumber(0)
        let allMarketsTotalBorrowBalance = new BigNumber(0)
        let totalBorrowLimit = new BigNumber(0)
        let yearSupplyInterest = new BigNumber(0)
        let yearBorrowInterest = new BigNumber(0)
        let yearSupplyPctRewards = new BigNumber(0)
        let yearBorrowPctRewards = new BigNumber(0)
        let totalLiquidity = new BigNumber(0)

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

        return {
            totalSupplyBalance,
            totalBorrowBalance,
            allMarketsTotalSupplyBalance,
            allMarketsTotalBorrowBalance,
            totalBorrowLimit,
            totalBorrowLimitUsedPercent: totalBorrowBalance.div(totalBorrowLimit).times(100),
            yearSupplyInterest,
            yearBorrowInterest,
            netApy: yearSupplyInterest.minus(yearBorrowInterest).div(totalSupplyBalance),
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

        const interval = setInterval(() => {
          try{
            console.log("interval")
              GetData()
              setUpdate(true)
          }
          catch(err){
              console.log(err)
          }
      }, 600000);
        
        if(props.provider && props.address !== ""){
            try{
              spinner.current(true)
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

            setMarketsData(markets)
            //setGeneralData(data)
          }
          catch(err){
            console.log(err)
          }
          finally{
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
            spinner.current(false)
        }

        if (marketsData){
            GetGeneral()

        }
        else{
            setGeneralData(null)
        }
    },[marketsData])

    const enterMarketDialog = (market) => {
      setSelectedMarket(market)
      setOpenEnterMarket(true)
    }

    const closeMarketDialog = () => {
      setOpenEnterMarket(false)
      setSelectedMarket(null)
    }

    const handleEnterMarket = async(address, symbol) => {
      spinner.current(true)
      var market = marketsData.find(m => m.symbol === symbol)
      if (market){
        try{
          let addr = [market.pTokenaddress]
          const signer = props.provider.getSigner()
          const signedComptroller = comptrollerData.comptroller.connect(signer)
          const tx = await signedComptroller.enterMarkets(addr)
          const receipt = await tx.wait()

          if(receipt.status){
            var comptroller =  await getComptrollerData.current()
            setComptrollerData(comptroller)  
            setOpenEnterMarket(false)
          } 
        }
        catch (err){
          console.log(err)
        }
      }
      spinner.current(false)
    }

    const handleExitMarket = async (address, symbol) => {
      spinner.current(true)

      var market = marketsData.find(m => m.symbol === symbol)
      if (market){
        try{
          const signer = props.provider.getSigner()
          const signedComptroller = comptrollerData.comptroller.connect(signer)
          const tx = await signedComptroller.exitMarket(market.pTokenaddress)
          const receipt = await tx.wait()

          if(receipt.status){
            var comptroller =  await getComptrollerData.current()
            setComptrollerData(comptroller)  
            setOpenEnterMarket(false)
          } 
        }
        catch (err){
          console.log(err)
        }
      }
      spinner.current(false)
    }

    const supplyMarketDialog = (market) => {
      setSelectedMarket(market)
      setOpenSupplyDialog(true)
    }

    const closeSupplyMarketDialog = () =>{
      setOpenSupplyDialog(false)
      setSelectedMarket(null)
    }

    const handleEnable = async (market) => {
      

    }

    const handleSupply = () => {

    }

    const handleWithdraw = () => {

    }

    const borrowMarketDialog = (market) => {
      setSelectedMarket(market)
      setOpenBorrowMarketDialog(true)
    }

    const closeBorrowMarketDialog = () => {
      setOpenBorrowMarketDialog(false)
      setSelectedMarket(null)
  }

  const handleBorrow = () => {

  }

  const handleRepay = () => {

  }
    
    return (
        <div className="content">
            <GeneralDetails generalData={generalData}/>
            <Markets generalData = {generalData} marketsData = {marketsData} enterMarketDialog={enterMarketDialog} supplyMarketDialog={supplyMarketDialog} borrowMarketDialog={borrowMarketDialog}/>
            <EnterMarketDialog open={openEnterMarket} market={selectedMarket} generalData={generalData} closeMarketDialog = {closeMarketDialog} 
              handleEnterMarket={handleEnterMarket} handleExitMarket={handleExitMarket}/>
            <SupplyMarketDialog open={openSupplyMarketDialog} market={selectedMarket} generalData={generalData} closeSupplyMarketDialog = {closeSupplyMarketDialog} darkMode={props.darkMode} 
              handleEnable = {handleEnable} handleSupply={handleSupply} handleWithdraw={handleWithdraw}/>
            <BorrowMarketDialog open={openBorrowMarketDialog} market={selectedMarket} generalData={generalData} closeBorrowMarketDialog={closeBorrowMarketDialog} darkMode={props.darkMode}
              handleBorrow={handleBorrow} handleRepay={handleRepay}/>
            <Modal ref={modal}>
                hello
            </Modal>
        </div>
    )
}

export default Content