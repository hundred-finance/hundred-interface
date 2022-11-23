import React, { ReactNode } from "react";
import { Spinner } from "../../assets/huIcons/huIcons";
import { useUiContext } from "../../Types/uiContext";
import "./button.css"

interface Props {
    onClick?: () => void
    arrow?: boolean
    small?: boolean
    loading?: boolean
    image?: any
    disabled?: boolean
    rectangle?:boolean
    children?: ReactNode
}


const Button: React.FC<Props> = ({onClick, arrow, small, loading, image, disabled, rectangle, children}:Props) => {
    const {isMobile, isTablet} = useUiContext()

    return(
        <div className={`button ${disabled || loading ? "button-disabled" : ""} ${small ? "button-small" : ""} ${!isMobile || !isTablet ? "button-xsmall" : ""} ${rectangle ? "button-rectangle" : ""}`} onClick={loading || disabled ? () => null : onClick}>
            {image ? 
                <div className="button-image">
                    {image}
                </div>
                : null}
            {loading ? 
                <span>
                    <Spinner size={"30px"}/>
                </span> : 
                <span>
                    {children}
                </span>}
            {arrow ? <div className="arrow">&#9660;</div> : null}
        </div>
    )
}

export default Button