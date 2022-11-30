import React from "react"
import Modal from "../Modal/modal"
import "./error.css"

interface Props{
    open: boolean,
    close: () => void,
    errorMessage?: string,
    button?: any
}


const Error: React.FC<Props> = ({open, close, errorMessage, button}: Props) => {
    return (
        
        <Modal open={open} close={close} title="Error" error={true}>
                <div className="error">
                    <div className="error-message">
                        
                        <span>{errorMessage}</span>
                    </div>
                    {button ? button : null}
                </div>
        </Modal>
)
}

export default Error
