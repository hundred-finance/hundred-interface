import React from "react"
import hundredCoin from "../../../assets/icons/HND 1.png"
import "./hundredButton.css"
import { useUiContext } from "../../../Types/uiContext"
import Button from "../../Button/button"

const HundredButton : React.FC = () => {
    const {setOpenHundred, setMobileMenuOpen} = useUiContext()
    
    
    const handleOpenHundred = () :void => {
        setMobileMenuOpen(false)
            setOpenHundred(true)
    }

    
        return (
            <Button onClick={() => handleOpenHundred()} arrow={true} image={<img src={hundredCoin} alt=""/>}>
                HND
            </Button>
        )
}

export default HundredButton