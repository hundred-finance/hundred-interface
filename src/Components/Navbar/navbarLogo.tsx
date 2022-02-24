import React from 'react';
import { HuLogo } from '../../assets/huIcons/huIcons';

interface Props {
    isMobile: boolean;
}

const NavbarLogo: React.FC<Props> = ({ isMobile }: Props) => {
    return (
        <div className="navbar-logo">
            <div className="navbar-logo-icon">
                <HuLogo size={isMobile ? '60px' : '80px'} darkMode={true} />
            </div>
            {/*<div className="navbar-logo-caption" style={{color: `${props.theme.text}`}}>
                <span style={{fontWeight:'bolder', userSelect:'none'}}>HUN</span><span style={{fontWeight:'leighter', userSelect:'none'}}>DRED</span>
                </div>*/}
        </div>
    );
};

export default NavbarLogo;
