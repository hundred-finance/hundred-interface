import React from "react"

const Wrapper = (props) => {
    const style = {
        width : '100%',
        height: '100%',
        position: 'relative',
        left: `${props.sideMenu ? "-220px" : "0"}`,
        top: '0',
        transition: 'all 0.2s ease-out',
    }

    return(
        <section style={style}>
            {props.children}
        </section>
    )
}

export default Wrapper