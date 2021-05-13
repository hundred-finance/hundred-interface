import React, { ReactNode } from "react"
import "./navbar.css"

interface Props{
    children?: ReactNode
}

const NavBarRight: React.FC<Props> = ({children} : Props) => {
    return (
        <div className="navbar-right">
            {children}
        </div>
    )
}

export default NavBarRight