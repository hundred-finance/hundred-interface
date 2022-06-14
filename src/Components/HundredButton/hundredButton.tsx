import React from "react"
import Logos from "../../logos"
import "./hundredButton.css"
import { useUiContext } from "../../Types/uiContext"
import { useGlobalContext } from "../../Types/globalContext"

const HundredButton : React.FC = () => {
    const {setOpenHundred, setSideMenu} = useUiContext()
    const {network, address} = useGlobalContext()
    
    const handleOpenHundred = () :void => {
            setOpenHundred(true)
            setSideMenu(true)
    }

    if(address === "" || !{...network})
        return null
    else {
        return (
            <div className="hundred-button" onClick={() => handleOpenHundred()}>
            {
                <div className="hundred-button-content">
                    <img src={Logos["HND"]} alt="" className="hundred-logo"/>
                    <span className="hundred-name">HND</span>
                    <span className="arrow">&#9660;</span>    
                </div>
            }
            </div>
        )
    }
}

export default HundredButton