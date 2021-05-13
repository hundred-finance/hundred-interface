import React, { useEffect } from "react"
import { HuLogoSpinner } from "../../assets/huIcons/huIcons"
import { Theme } from "../../theme"

interface Props{
    open: boolean,
    theme: Theme
}

const Spinner: React.FC<Props> = (props : Props) => {
    const style : React.CSSProperties ={
        position: 'fixed',
        minHeight: `${props.open ? '100%' : '0'}`,
        height: `${props.open ? '100%' : '0'}`,
        width: `${props.open ? '100%' : '0'}`,
        top: `${props.open ? '0' : '50%'}`,
        left: `${props.open ? '0' : '50%'}`,
        backgroundColor: `${props.theme ? props.theme.overlayBackground : 'rgba(0, 0, 0, 0.2)'}`,
        overflow: 'hidden',
        zIndex: 9999
    }

    const loader : React.CSSProperties ={
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: `${props.open ? 'block' : 'none'}`,
    }

    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        if(props.open){
            document.getElementsByTagName("body")[0].style.overflow = 'hidden'
        }
        else{
            document.getElementsByTagName("body")[0].style.overflow = 'auto'
        }
    }, [props.open]);

    return(
        props.open ? (
        <div style={style} >
            <HuLogoSpinner style={loader} width="80px" height="80px" color={props.theme.spinnerColor}/>
        </div>) : null
    )
}

export default Spinner