import { useWeb3React } from '@web3-react/core'
import React, { useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { toast, ToastContainer } from 'react-toastify'
import Content from '../../Components/Content/content'
import Footer from '../../Components/Footer/footer'
import Menu from '../../Components/Menu/menu'
import TabletMenu from '../../Components/Menu/tabletMenu'
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
import { useUiContext } from '../../Types/uiContext'
import useHndPrice from '../Data/hndPrice'

const Hundred: React.FC = () => {
  const { activate } = useWeb3React()
  const {isMobile, isTablet, openAddress, openNetwork, 
         openHundred, openAirdrop,  setSpinnerVisible} = useUiContext()
  const { network} = useGlobalContext()
  useHndPrice()

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
    
  return (
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
    </>
  )
}

export default Hundred
