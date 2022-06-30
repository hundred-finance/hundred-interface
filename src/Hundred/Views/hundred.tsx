import { useWeb3React } from '@web3-react/core'
import React, { useEffect, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { toast, ToastContainer } from 'react-toastify'
import { SpinnersEnum } from '../../Classes/cTokenClass'
import Content from '../../Components/Content/content'
import Footer from '../../Components/Footer/footer'
import Menu from '../../Components/Menu/menu'
import TabletMenu from '../../Components/Menu/tabletMenu'
import HundredMessage from '../../Components/MessageDialog/messageDialog'
import AccountSettings from '../../Components/SideMenu/accountSettings'
import AirdropMenu from '../../Components/SideMenu/airdropMenu'
import HundredMenu from '../../Components/SideMenu/hundredMenu'
import NetworksView from '../../Components/SideMenu/networksView'
import SideMenu from '../../Components/SideMenu/sideMenu'
import Wrapper from '../../Components/Wrapper/wrapper'
import { GetConnector } from '../../Connectors/connectors'
import { MetamaskConnector } from '../../Connectors/metamask-connector'
import { xDefiConnector } from '../../Connectors/xdefi-connector'
import { Network } from '../../networks'
import { useGlobalContext } from '../../Types/globalContext'
import { MyHundredDataContext } from '../../Types/hundredDataContext'
import { useUiContext } from '../../Types/uiContext'
import useHndPrice from '../Data/hndPrice'
import useFetchData from '../Data/hundredData'

const Hundred: React.FC = () => {
  const { activate } = useWeb3React()
  const {isMobile, isTablet, openAddress, openNetwork, 
         openHundred, openAirdrop,  setSpinnerVisible, darkMode} = useUiContext()
  const { network} = useGlobalContext()
  
  const [showGMessage, setShowGMessage] = useState<boolean>(false)
  const [gMessageText, setGMessageText] = useState<JSX.Element>()

  useHndPrice()

  const {comptrollerData, setComptrollerData, marketsData, setMarketsData, marketsSpinners,
    setMarketsSpinners, gaugesV4Data, setGaugesV4Data, generalData, setGeneralData,
   selectedMarket, setSelectedMarket, selectedMarketSpinners, setSelectedMarketSpinners, updateMarket} = useFetchData()


  const setGMessage = (message: string) => {
    setGMessageText(gaugeMessage(message))
    setShowGMessage(true)
  }

  const gaugeMessage = (message: string) => {
    return (
      <div>
        <p>{message} on <a style={{color: "#2853ff"}} href="https://old.hundred.finance" target={"_blank"} rel="noreferrer">https://old.hundred.finance</a>.</p>
        <p>Please unstake from there and stake on the main site.</p>
      </div>
    )
  }

  useEffect(() => {
    const net = window.localStorage.getItem("hundred-network")
    const prov = window.localStorage.getItem("hundred-provider")
    
    let tempNet: Network | null = null

    if(net)
      tempNet = JSON.parse(net) as Network

    if(prov) 
    {
      const con = GetConnector(+prov, tempNet ? tempNet.chainId : undefined)
      if (con instanceof xDefiConnector && window.ethereum && window.ethereum.__XDEFI)
        activate(con)
      else if (con instanceof MetamaskConnector && window.ethereum && !window.ethereum.__XDEFI)
        activate(con)
      else activate(con)
    }
    
    setSpinnerVisible(false)
    
  }, [])

  useEffect(() => {
    window.localStorage.setItem("hundred-network", JSON.stringify(network))
    
  }, [network])

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


  const myErrorHandler = (error: Error, info: {componentStack: string}) => {
    console.log(error)
    console.log(info)
    toast.error('An error has occurred, please check console log.', {
      position: "top-right",
      autoClose: 10000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      });
  }
  
  const errorFallback = () => {
    return(
      <ErrorBoundary fallbackRender={errorFallback} onError={myErrorHandler}>
        <Content />
      </ErrorBoundary>
    )
  }
    
  return (
    <MyHundredDataContext.Provider value={({comptrollerData, setComptrollerData,
                                            marketsData, setMarketsData,
                                            marketsSpinners, setMarketsSpinners,
                                            gaugesV4Data, setGaugesV4Data,
                                            generalData, setGeneralData,
                                            selectedMarket, setSelectedMarket,
                                            selectedMarketSpinners, setSelectedMarketSpinners,
                                            toggleSpinners, setGMessage, updateMarket})}>
    <>
        <Wrapper>
            {!isTablet && !isMobile ? 
                <Menu/>
                : <TabletMenu/>
              }
              <ErrorBoundary fallbackRender={errorFallback} onError={myErrorHandler}>
                <Content/>
              </ErrorBoundary>
              <ToastContainer/>
            </Wrapper>
            <Footer/>
            <SideMenu>
              { openAddress ? 
                  <AccountSettings/> 
                  : (openNetwork ? <NetworksView/> 
                  : openHundred ? 
                  <HundredMenu /> 
                  : openAirdrop ? 
                  <AirdropMenu/>
                  : null)
              }
            </SideMenu>
            <HundredMessage isOpen={showGMessage} onRequestClose={() => setShowGMessage(false)} contentLabel="Info" className={`${darkMode ? "mymodal-dark" : ""}`}
              message={gMessageText}/>
    </>
    </MyHundredDataContext.Provider>
  )
}

export default Hundred