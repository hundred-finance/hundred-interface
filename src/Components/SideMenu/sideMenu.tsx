import React, { ReactNode } from 'react';
import './sideMenu.css';

interface Props {
    open: boolean;
    setSideMenu: React.Dispatch<React.SetStateAction<boolean>>;
    setOpenAddress: React.Dispatch<React.SetStateAction<boolean>>;
    setOpenNetwork: React.Dispatch<React.SetStateAction<boolean>>;
    setOpenHundred: React.Dispatch<React.SetStateAction<boolean>>;
    setOpenAirdrop: React.Dispatch<React.SetStateAction<boolean>>;
    children: ReactNode;
}

const SideMenu: React.FC<Props> = ({
    open,
    setSideMenu,
    setOpenAddress,
    children,
    setOpenNetwork,
    setOpenAirdrop,
    setOpenHundred,
}: Props) => {
    const handleClose = () => {
        setSideMenu(false);
        setOpenAddress(false);
        setOpenNetwork(false);
        setOpenHundred(false);
        setOpenAirdrop(false);
    };

    return open ? (
        <div id="side-menu" className="sideMenu">
            <div className="sideMenu-overlay" onClick={() => handleClose()}></div>
            <div className="sideMenu-wrapper">
                <span className="close" onClick={() => handleClose()}></span>
                <div className="sideMenu-content">{children}</div>
            </div>
        </div>
    ) : null;
};

export default SideMenu;
