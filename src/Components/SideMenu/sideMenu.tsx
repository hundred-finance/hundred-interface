import React, { ReactNode } from "react"
import "./sideMenu.css"

interface Props{
    open: boolean,
    setSideMenu: React.Dispatch<React.SetStateAction<boolean>>,
    setOpenAddress: React.Dispatch<React.SetStateAction<boolean>>,
    children: ReactNode,
    setOpenNetwork: React.Dispatch<React.SetStateAction<boolean>>
}

const SideMenu: React.FC<Props> = ({open, setSideMenu, setOpenAddress, children, setOpenNetwork} : Props) => {

    const handleClose = () => {
        setSideMenu(false)
        setOpenAddress(false)
        setOpenNetwork(false)
    }

    
    return (
        open ?(
        <div className="sideMenu">
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