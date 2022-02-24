import React, { ReactNode } from 'react';
import './navbar.css';

interface Props {
    isTablet: boolean;
    isMobile: boolean;
    children?: ReactNode;
}

const Navbar: React.FC<Props> = (props: Props) => {
    return (
        <div className={`navbar ${props.isTablet || props.isMobile ? 'navbar-mobile' : ''}`}>
            <div className="navbar-content">{props.children}</div>
        </div>
    );
};

export default Navbar;
