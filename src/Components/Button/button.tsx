import React, { ReactNode } from "react";
import { Spinner } from "../../assets/huIcons/huIcons";
import { useUiContext } from "../../Types/uiContext";
import "./button.css"

interface Props {
    onClick?: () => void
    arrow?: boolean
    small?: boolean
    large?: boolean
    loading?: boolean
    active?: boolean
    image?: any
    disabled?: boolean
    rectangle?:boolean
    searchText?: boolean
    children?: ReactNode
}


const Button: React.FC<Props> = ({onClick, arrow, small, large, loading, active, image, disabled, rectangle, searchText, children}:Props) => {
    const {isMobile, isTablet} = useUiContext()

    return(
        <div className={`button ${disabled || loading ? "button-disabled" : ""} 
                        ${small ? "button-small" : ""} ${!isMobile || !isTablet ? "button-xsmall" : ""} 
                        ${rectangle ? `button-rectangle ${large ? "button-rectangle-large" : ""}` : ""}
                        ${active ? "button-active" : ""}
                        ${searchText ? "search-text-button" : ""}`} 
                        onClick={loading || disabled ? () => null : onClick}>
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