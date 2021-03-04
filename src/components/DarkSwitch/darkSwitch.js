import React from "react"
import "./style.css"

const DarkSwitch = (props) => {
    const style = {
        position: 'relative'
    }

    const toggle = {
        position: 'absolute',
        border: '1px solid #f3f3f3',
        width: '60px',
        height: '25px',
        top: '50%',
        transform: 'translateY(-50%)',
        right: '0',
        borderRadius: '25px',
        backgroundColor: `${props.darkMode ? '#333' : "#f3f3f3"}`,
        transition: 'background-color 0.2s ease-in-out 0.1s',
        cursor: 'pointer'
    }

    const toggleButton = {
        position: 'absolute',
        height: '21px',
        width: '21px',
        backgroundColor: `${!props.darkMode ? '#333' : "#f3f3f3"}`,
        borderRadius: '50%',
        marginLeft:'2px',
        marginTop:'2px',
        marginRight:'2px',
        transition: 'all 0.2s ease-in-out',
        left:`${props.darkMode ? 'calc(100% - 27px)' : '0'}`
        
    }


    return (
        <div style={style}>
            <label>{props.darkMode ? "Dark Mode" : "Light Mode"}
                
            </label>
            <span style={toggle} onClick={()=>props.setDarkMode(!props.darkMode)}>
                    <span style={toggleButton}></span>
                </span>
            
        </div>
    )
}

export default DarkSwitch