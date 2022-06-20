import React, { ReactNode } from "react"
import { useUiContext } from "../../Types/uiContext"
import "./sideMenu.css"

interface Props{
    children: ReactNode
}

const SideMenu: React.FC<Props> = ({children} : Props) => {
    const {sideMenu, setSideMenu, setOpenAddress, setOpenNetwork, setOpenAirdrop, setOpenHundred} = useUiContext()

    const handleClose = () => {
        setSideMenu(false)
        setOpenAddress(false)
        setOpenNetwork(false)
        setOpenHundred(false)
        setOpenAirdrop(false)
    }

    
    return (
        sideMenu ?(
        <div id="side-menu" className="sideMenu">
            <div className="sideMenu-overlay" onClick={() => handleClose()}>
            </div>
            <div className="sideMenu-wrapper">    
                <span className="close" onClick={() => handleClose()}>
                </span>
                <div className="sideMenu-content">
                    {children}
                </div>
            </div>
        </div>) : null
    )
}

export default SideMenu