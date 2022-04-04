import React from "react"
import closeIcon from "../../assets/icons/closeIcon.png"
import { useUiContext } from "../../Types/uiContext"
import ReactDOM from "react-dom"
import "./modal.css"

interface Props {
    open: boolean,
    close: () => void,
    title: string,
    children?: any
}
    
const Modal: React.FC<Props> = ({open, close, title, children} : Props) => {
    const {darkMode} = useUiContext()
    const modalContainer = document.getElementById("modal") as Element

    const modal =
        <div className={`modal ${darkMode ? "dark-theme" : ""}`}>
            <div className="modal-background" onClick={close}></div>
            <div className="modal-wrapper">
                <div className="modal-title">
                    <span>{title}</span>
                    <img src={closeIcon} alt="" onClick={close}/>
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    

    return (
        open ? ReactDOM.createPortal(modal, modalContainer) : null
    )
}

export default Modal
