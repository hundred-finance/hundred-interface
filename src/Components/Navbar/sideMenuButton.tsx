import React, { useState } from "react"

interface Props {
    setSideMenu: React.Dispatch<React.SetStateAction<boolean>>,

}

const SideMenuButton: React.FC<Props> = ({setSideMenu}: Props) => {
    const [hover, setHover] = useState(false)

    // const style = {
    //     //border: `0px solid ${props.theme.text}`,
    //     borderRadius: '10px',
    //     display: 'block',
    //     width: '0px',
    //     height: '40px',
    //     margin: '0 10px',
    //     position: 'relative',
    //     cursor: 'pointer',
    //     transition: 'all 0.2s ease-out',
    //     padding:"0 10px"
    // }

    // const dot1 = {
    //     display: 'block',
    //     width: '5px',
    //     height: '5px',
    //     // backgroundColor: `${props.theme.text}`,
    //     // border: `1px solid ${props.theme.text}`,
    //     borderRadius: '3px',
    //     position:'absolute',
    //     left: '50%',
    //     top: `${hover ? '15%' : '20%'}`,
    //     transform: 'translate(-50%, -20%)',
    //     transition: 'all 0.1s ease-in-out'
    // }

    // const dot2 = {
    //     display: 'block',
    //     width: '5px',
    //     height: '5px',
    //     // backgroundColor: `${props.theme.text}`,
    //     // border: `1px solid ${props.theme.text}`,
    //     borderRadius: '50%',
    //     position:'absolute',
    //     left: '50%',
    //     top:'50%',
    //     transform: 'translate(-50%, -50%)',
    //     transition: 'all 0.1s ease-in-out',
    // }

    // const dot3 = {
    //     display: 'block',
    //     width: '5px',
    //     height: '5px',
    //     // backgroundColor: `${props.theme.text}`,
    //     // border: `1px solid ${props.theme.text}`,
    //     borderRadius: '50%',
    //     position:'absolute',
    //     left: '50%',
    //     top:`${hover ? '85%' : '80%'}`,
    //     transform: 'translate(-50%, -80%)',
    //     transition: 'all 0.1s ease-in-out',
    // }

    return (
        <div className="menu-button" onClick={() => setSideMenu(true)} onMouseOver={() => setHover(true)} onMouseOut = {() => {setHover(false)}}>
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
        </div>
    )
}

export default SideMenuButton