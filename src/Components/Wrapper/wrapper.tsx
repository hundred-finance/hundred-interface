import React, { ReactNode } from 'react';
import './wrapper.css';

interface Props {
    sideMenu: boolean;
    children?: ReactNode;
}

const Wrapper: React.FC<Props> = (props: Props) => {
    return <section className={`wrapper ${props.sideMenu ? 'wrapper-side' : ''}`}>{props.children}</section>;
};

export default Wrapper;
