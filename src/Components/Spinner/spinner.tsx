import React, { useEffect } from "react"
import { HuLogoSpinner } from "../../assets/huIcons/huIcons"
import { useUiContext } from "../../Types/uiContext"

const Spinner: React.FC = () => {
    const {spinnerVisible, theme} = useUiContext()

    const style : React.CSSProperties ={
        position: 'fixed',
        minHeight: `${spinnerVisible ? '100%' : '0'}`,
        height: `${spinnerVisible ? '100%' : '0'}`,
        width: `${spinnerVisible ? '100%' : '0'}`,
        top: `${spinnerVisible ? '0' : '50%'}`,
        left: `${spinnerVisible ? '0' : '50%'}`,
        backgroundColor: `${theme ? theme.overlayBackground : 'rgba(0, 0, 0, 0.2)'}`,
        overflow: 'hidden',
        zIndex: 9999
    }

    const loader : React.CSSProperties ={
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: `${spinnerVisible ? 'block' : 'none'}`,
    }

    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        if(spinnerVisible){
            document.getElementsByTagName("body")[0].style.overflow = 'hidden'
        }
        else{
            document.getElementsByTagName("body")[0].style.overflow = 'auto'
        }
    }, [spinnerVisible]);

    return(
        spinnerVisible ? (
        <div style={style} >
            <HuLogoSpinner style={loader} width="80px" height="80px" color={theme.spinnerColor}/>
        </div>) : null
    )
}

export default Spinner