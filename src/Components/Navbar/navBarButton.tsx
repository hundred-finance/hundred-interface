import React, { useState } from "react"
import './navbarButton.css'

interface Props {
    setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const NavBarButton: React.FC<Props> = (props: Props) => {
    const [clicked, setClicked] = useState<boolean>(false)

    return (
        <div className={`navbar-button ${clicked ? "navbar-button-clicked" : ""}`} onClick={() =>{ setClicked(!clicked); props.setMenuOpen(!clicked)}}>
            <span className="bar bar1"></span>
            <span className="bar bar2"></span>
            <span className="bar bar3"></span>
        </div>
    )
}

export default NavBarButton