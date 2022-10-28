import React, { ReactNode } from "react"
import { useUiContext } from "../../Types/uiContext"
import "./navbar.css"

interface Props {
    children?: ReactNode
}

const NavbarMobile: React.FC<Props> = ({children}: Props) => {
    const {mobileMenuOpen} = useUiContext()
    return (
        <div className={`navbar-mobile-content ${mobileMenuOpen ? "navbar-mobile-content-open" : ""}`}>
            {children}
        </div>
    )
}

export default NavbarMobile