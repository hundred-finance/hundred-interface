import React, { ReactNode } from "react"
import { useUiContext } from "../../Types/uiContext"
import "./wrapper.css"

interface Props {
    children?: ReactNode
}

const Wrapper: React.FC<Props> = (props:Props) => {
    const {sideMenu} = useUiContext()
    return (
        <section className={`wrapper ${sideMenu ? "wrapper-side" : ""}`}>
            {props.children}
        </section>
    )
}

export default Wrapper