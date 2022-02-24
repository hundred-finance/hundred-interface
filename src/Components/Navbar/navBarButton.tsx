import React from 'react';
import './navbarButton.css';

interface Props {
    menuOpen: boolean;
    setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const NavBarButton: React.FC<Props> = (props: Props) => {
    const handleClick = (): void => {
        props.setMenuOpen(!props.menuOpen);
    };

    return (
        <div className={`navbar-button ${props.menuOpen ? 'navbar-button-clicked' : ''}`} onClick={() => handleClick()}>
            <span className="bar bar1"></span>
            <span className="bar bar2"></span>
            <span className="bar bar3"></span>
        </div>
    );
};

export default NavBarButton;
