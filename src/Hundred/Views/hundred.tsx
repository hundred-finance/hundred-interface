import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import React, { useEffect, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { toast, ToastContainer } from 'react-toastify'
import Account from '../../Components/Account/account'
import Content from '../../Components/Content/content'
import Footer from '../../Components/Footer/footer'
import HundredMenu from '../../Components/HundredMenu/hundredMenu'
import Menu from '../../Components/Menu/menu'
import TabletMenu from '../../Components/Menu/tabletMenu'
import HundredMessage from '../../Components/MessageDialog/messageDialog'
import Modal from '../../Components/Modal/modal'
import NetworksMenu from '../../Components/NetworksMenu/networksMenu'
import Wallets from '../../Components/Wallets/wallets'
import Wrapper from '../../Components/Wrapper/wrapper'
import { GetConnector, getErrorMessage } from '../../Connectors/connectors'
import { MetamaskConnector, MetamaskNotFounfError } from '../../Connectors/metamask-connector'
import { xDefiConnector, XDEFIWalletNotDefaultError, XDEFIWalletNotFoundError } from '../../Connectors/xdefi-connector'
import NETWORKS, { Network } from '../../networks'
import { useGlobalContext } from '../../Types/globalContext'
import { MyHundredDataContext } from '../../Types/hundredDataContext'
import { useUiContext } from '../../Types/uiContext'
import useHndPrice from '../Data/hndPrice'
import useFetchData from '../Data/hundredData'

const Hundred: React.FC = () => {
  const { activate, error, chainId, account } = useWeb3React()
  const { setSpinnerVisible, darkMode, setOpenNetwork, isMobile, isTablet} = useUiContext()
  const { network, setNetwork, setAddress} = useGlobalContext()

  const [showError, setShowError] = useState(false)
  
  const [showGMessage, setShowGMessage] = useState<boolean>(false)
  const [gMessageText, setGMessageText] = useState<JSX.Element>()

  const openSwitchNetwork = () => {
    setShowError(false)
    setOpenNetwork(true)
}

  useHndPrice()

  const {comptrollerData, setComptrollerData, 
         marketsData, setMarketsData, 
         marketsSpinners, setMarketsSpinners, 
         gaugesV4Data, setGaugesV4Data, 
         generalData, setGeneralData, 
         hndBalance, setHndBalance,
         hndEarned, setHndEarned, 
         hndRewards, setHndRewards, 
         vehndBalance, setVehndBalance, 
         gaugeAddresses, setGaugeAddresses,
         hundredBalance, setHundredBalance,
         selectedMarket, setSelectedMarket, 
         selectedMarketSpinners, setSelectedMarketSpinners, 
         toggleSpinners, 
         updateMarket, 
         getMaxAmount, 
         getMaxRepayAmount, 
         convertUSDToUnderlyingToken} = useFetchData()


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

  useEffect(() => {
    if(chainId){
      const net = NETWORKS[chainId]
      if(net) {
        setNetwork(net)
        return
      }
    }
    const net = NETWORKS[42161]
    setNetwork(net)
}, [chainId])

useEffect(() => {
    if(error){
    console.log(error)
      setShowError(true)
    }
}, [error])

useEffect(() => {
    if(account) 
        setAddress(account)
    else if(!error) 
        setAddress("")
}, [account])
    
  return (
    <MyHundredDataContext.Provider value={({comptrollerData, setComptrollerData,
                                            marketsData, setMarketsData,
                                            marketsSpinners, setMarketsSpinners,
                                            gaugesV4Data, setGaugesV4Data,
                                            generalData, setGeneralData,
                                            hndBalance, setHndBalance,
                                            hndEarned, setHndEarned,
                                            hundredBalance, setHundredBalance,
                                            vehndBalance, setVehndBalance,
                                            hndRewards, setHndRewards,
                                            gaugeAddresses, setGaugeAddresses,
                                            selectedMarket, setSelectedMarket,
                                            selectedMarketSpinners, setSelectedMarketSpinners,
                                            toggleSpinners, setGMessage, updateMarket, 
                                            getMaxAmount, getMaxRepayAmount, convertUSDToUnderlyingToken})}>
    <>
        <Wrapper>
        {!isTablet && !isMobile ? 
                <Menu/>
                : <TabletMenu/>
              }
                
              <ErrorBoundary fallbackRender={errorFallback} onError={myErrorHandler}>
                <Content/>
              </ErrorBoundary>
              <Wallets/>
              <Account/>
              <NetworksMenu/>
              <HundredMenu/>
              <ToastContainer/>
            </Wrapper>
            <Footer/>
            {/* <SideMenu>
              { openAddress ? 
                  <AccountSettings/> 
                  : (openNetwork ? <NetworksView/> 
                  : openHundred ? 
                  <HundredMenu /> 
                  : openAirdrop ? 
                  <AirdropMenu/>
                  : null)
              }
            </SideMenu> */}
            <HundredMessage isOpen={showGMessage} onRequestClose={() => setShowGMessage(false)} contentLabel="Info" className={`${darkMode ? "mymodal-dark" : ""}`}
              message={gMessageText}/>
            {error instanceof UnsupportedChainIdError ? (
            <Modal open={showError} close={() => setShowError(false)} title="Error">
                <div className='modal-error'>
                    <div className='modal-error-message'>
                        <span>{getErrorMessage(error)}</span>
                        <><p>Please <span className='modal-error-switch'onClick={ openSwitchNetwork }>switch</span></p></>
                    </div>
                </div>
            </Modal>)
            : error instanceof XDEFIWalletNotFoundError || error instanceof XDEFIWalletNotDefaultError || error instanceof MetamaskNotFounfError? (
                <Modal open={showError} close={() => setShowError(false)} title="Error">
                    <div className='modal-error'>
                        <div className='modal-error-message'>
                            <span>{getErrorMessage(error)}</span>
                        </div>
                    </div>
                </Modal>) : null}
    </>
    </MyHundredDataContext.Provider>
  )
}

export default Hundred
