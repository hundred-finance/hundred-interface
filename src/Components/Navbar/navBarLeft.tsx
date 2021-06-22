import React, { ReactNode } from 'react';
import './navbar.css';

interface Props{
    children?: ReactNode
}

const NavBarLeft : React.FC<Props> = ({children} : Props) => (
    <div className='navbar-left'>
        {children}
    </div>
)

export default NavBarLeft