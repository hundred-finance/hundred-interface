import React, { ReactNode } from "react"
import "./navbar.css"

interface Props{
    children?: ReactNode
}

const NavBarLinks: React.FC<Props> = ({children} : Props) => {
    return (
        <div className="navbar-links">
            <ul className="navbar-links-list">
                {children}
            </ul>
        </div>
    )
}

export default NavBarLinks