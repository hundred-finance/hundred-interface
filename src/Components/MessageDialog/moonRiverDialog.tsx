import React, { useEffect, useState } from "react";
import { useUiContext } from "../../Types/uiContext";


const MoonriverMessage: React.FC= () => {
    const {darkMode} = useUiContext()

    const [isChecked, setIsChecked] = useState<boolean>(false)
    const checkmark = '✔';

    useEffect(() => {
        if(isChecked)
            window.localStorage.setItem("hundred-moonriver-dont-show", "true")
        else
            window.localStorage.removeItem("hundred-moonriver-dont-show")
    }, [isChecked])

    return <div>
        If you had supplied in the old Moonriver deployment, please use <a style={{color: "#2853ff"}} href="https://old.hundred.finance" target={"_blank"} rel="noreferrer">https://old.hundred.finance</a> to withdraw your funds.
        <div className="dont-show-checkbox" style={{paddingTop: "15px", display: "flex", alignItems: "center",  cursor:"pointer"}} onClick={() => setIsChecked(!isChecked)}>
            <div className="checkbox" style={{border: `1px solid ${darkMode ? "#fff" : "#000"}`, width: "20px", height: "20px", borderRadius: "5px", backgroundColor: `${isChecked ? "#2853ff" : ""}`, position:"relative"}} >
                {isChecked ? <span style={{color: "#fff", position: "absolute", top: "-3px", left: "4px"}}>{checkmark}</span> : ""}
            </div>
            <span style={{paddingLeft: "6px"}}>Don&apos;t Show again</span>
        </div>
    </div>
}

export default MoonriverMessage