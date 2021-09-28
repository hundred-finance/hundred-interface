import React from "react"
import { useRef } from "react"
import { Network } from "../networks"
import "./hundredButton.css"

interface Props{
    network: Network | null,
    address: string,
    setOpenHundred: React.Dispatch<React.SetStateAction<boolean>>,
    setSideMenu: React.Dispatch<React.SetStateAction<boolean>>
}

const HundredButton : React.FC<Props> = (props : Props) => {
    const setOpenHundred = useRef<React.Dispatch<React.SetStateAction<boolean>> | null>(null)
    setOpenHundred.current = props.setOpenHundred

    const handleOpenHundred = () :void => {
        if(setOpenHundred.current){
            setOpenHundred.current(true)
            props.setSideMenu(true)
        }
    }

    if(props.address === "" || !props.network)
        return null
    else {
        return (
            <div className="hundred-button" onClick={() => handleOpenHundred()}>
            {
                <div className="hundred-button-content">
                    <span className="hundred-name">Hundred</span>
                    <span className="arrow">&#9660;</span>    
                </div>
            }
            </div>
        )
    }
}

export default HundredButton