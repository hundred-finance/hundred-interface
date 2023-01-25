import React, { useEffect, useState } from "react";
import { useUiContext } from "../../Types/uiContext";
import Modal from "../Modal/modal";

const OptimismMessage: React.FC= () => {
    const {darkMode, optimismMessage, setOptimismMessage} = useUiContext()

    const [isChecked, setIsChecked] = useState<boolean>(false)
    const [dontShow, setDontShow] = useState<boolean>(false)
    const checkmark = '✔';

    useEffect(() => {
        const ds = window.localStorage.getItem("hundred-optimism-dont-show")
        console.log(ds)
        if(ds && ds === "true")
        {
             setDontShow(true)
             setIsChecked(true)
        }
    }, [])

    useEffect(() => {
        if(isChecked)
            window.localStorage.setItem("hundred-optimism-dont-show", "true")
        else
            window.localStorage.removeItem("hundred-optimism-dont-show")
    }, [isChecked])

    const message = <div>
    Please visit <a style={{color: "#2853ff"}} href="https://v1.hundred.finance" target={"_blank"} rel="noreferrer">https://v1.hundred.finance</a> to Unstake, then Stake here.
    <div className="dont-show-checkbox" style={{paddingTop: "15px", display: "flex", alignItems: "center",  cursor:"pointer"}} onClick={() => setIsChecked(!isChecked)}>
        <div className="checkbox" style={{border: `1px solid ${darkMode ? "#fff" : "#000"}`, width: "20px", height: "20px", borderRadius: "5px", backgroundColor: `${isChecked ? "#2853ff" : ""}`, position:"relative"}} >
            {isChecked ? <span style={{color: "#fff", position: "absolute", top: "-3px", left: "4px"}}>{checkmark}</span> : ""}
        </div>
        <span style={{paddingLeft: "6px"}}>Don&apos;t Show again</span>
    </div>
</div>
    return !dontShow ?
    <Modal open={optimismMessage} close={() => setOptimismMessage(false)} title="info" error={false}>
                <div className="error">
                    <div className="error-message">
                        
                        <span>{message}</span>
                    </div>
                </div>
        </Modal>
    : null
}

export default OptimismMessage