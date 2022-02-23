import React from "react"
import Modal from "react-modal"
import "./messageDialog.css"

Modal.setAppElement("#root")

interface Props{
    isOpen: boolean,
    onRequestClose: ()=> void,
    contentLabel: string,
    message: HTMLElement | HTMLElement[] | string | any,
    className?: string
    children?: React.ReactElement | React.ReactElement[]
}
const HundredMessage:React.FC<Props> = (props: Props) => {
    return(
        props.isOpen ? 
        <Modal isOpen={props.isOpen}
                onRequestClose={props.onRequestClose}
                contentLabel={props.contentLabel}
                className={`mymodal theme ${props.className ? props.className : ""}`}
                overlayClassName="myoverlay"
                shouldCloseOnOverlayClick={true}
                shouldCloseOnEsc={true}
                shouldFocusAfterRender={true}
                shouldReturnFocusAfterClose={true}
                closeTimeoutMS={50}>
                <HundredMessageTitle onRequestClose={props.onRequestClose} darkMode={props.className?.includes("mymodal-dark") ? true : false}>{props.contentLabel}</HundredMessageTitle>
                <HundredMessageItem>{props.message}</HundredMessageItem>
        </Modal>
        : null
    )
}

type TitleProps = {
    onRequestClose: () => void,
    darkMode: boolean
}

const HundredMessageTitle:React.FC<TitleProps> = ({onRequestClose, darkMode, children}) => {
    return (
        <div className="hundred-message-title title title18">
            {children}
            <svg className="closeBtn" onClick={onRequestClose} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 7L17 17" stroke={`${darkMode ? "white" : "black"}`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 17L17 7" stroke={`${darkMode ? "white" : "black"}`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
    )
}

type ItemProps = {
    disabled?: boolean,
    hover?: boolean,
    onClick?: () => void
}

const HundredMessageItem: React.FC<ItemProps> = ({disabled, hover, onClick, children}) => {
    return (
        <div className={`hundred-message-item ${disabled ? "hundred-message-item-disabled" : ""} ${hover && !disabled ? "hundred-message-item-hover" : ""}`} onClick={onClick}>
            {children}
        </div>
    )
}

export default HundredMessage