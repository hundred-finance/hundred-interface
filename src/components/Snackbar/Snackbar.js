import React, { useEffect} from "react"
import "./Snackbar.css"

const Snackbar = (props) => {
    
    useEffect(()=>{
        function handleOpen(){
            if (props.open){
                setTimeout(() => {
                    props.close()}, props.timeout);
            }
        }

        handleOpen()
    }, [props.open])


    return (
        <div className={`snackbar ${props.open ? "snackbar-open" : ""}`}>
            {props.message}
        </div>
    )
}

export default Snackbar