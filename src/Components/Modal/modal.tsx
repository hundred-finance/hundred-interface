import React from "react"
import closeIcon from "../../assets/icons/closeIcon.png"
import { useUiContext } from "../../Types/uiContext"
import ReactDOM from "react-dom"
import "./modal.css"

interface Props {
    open: boolean,
    close: () => void,
    title: string,
    titleImg?: string,
    maxheight?: string,
    error?: boolean,
    children?: any,
}
    
const Modal: React.FC<Props> = ({open, close, title, titleImg, maxheight, error, children} : Props) => {
    const {darkMode} = useUiContext()
    const modalContainer = document.getElementById("modal") as Element

    const modal =
        <div className={`modal ${darkMode ? "dark" : "light"}`}>
            <div className="modal-background" onClick={close}></div>
            <div className="modal-wrapper" style={{maxHeight: maxheight ? maxheight : "82%"}}>
                <div className="modal-title">
                    
                    {titleImg ? <img src={titleImg} alt="" className="title-img"/> : null}
                    {error ? <span className="error"><span>!</span>{title}</span> : <span>{title}</span>}
                    <img src={closeIcon} alt="" onClick={close} className="modal-close"/>
                </div>
                <div className="seperator"/>
                {children}
                
            </div>
        </div>
    

    return (
        open ? ReactDOM.createPortal(modal, modalContainer) : null
    )
}

export default Modal
