import React from 'react';

import './footer.css';
import {HuLogo} from "../../assets/huIcons/huIcons"

import discord from '../../assets/icons/discord.png'
import medium from '../../assets/icons/medium.png'
import github from '../../assets/icons/github.png'

interface Props{
    isMobile: boolean,
    darkMode: boolean
}

const Footer : React.FC<Props> = ({isMobile, darkMode} : Props) => {
    return (
        <div className='footer'>
            <div className='footer-content'>
                <div className='footer-logo'>
                    <HuLogo size={isMobile ? "60px" : "80px"} darkMode={darkMode}/>
                    <span className='footer-content-inc'> 2021 Hundred, Inc.</span>
                </div>
                <div className='footer-navbar'>
                    <a className='footer-link-item' href='https://snapshot.org/#/hnd.eth/' target="_blank" rel="noopener noreferrer">Governance</a>
                    <a className='footer-link-item' href="https://github.com/chainsulting/Smart-Contract-Security-Audits/blob/master/Percent%20Finance/02_Smart%20Contract%20Audit%20Percent%20Finance.pdf"
                        target="_blank"
                        rel="noopener noreferrer">Audit</a>
                    <a className='footer-link-item' href='https://github.com/hundred-finance' target="_blank" rel="noreferrer">Github</a>
                    <a className='footer-link-item' href='https://dashboard.hundred.finance' target="_blank" rel="noreferrer">Dashboard</a>
                </div>
                <div className='footer-right'>
                    <a href='https://medium.com/@hundred_finance' target="_blank" rel="noreferrer">
                        <img alt="Medium Icon" src={medium} className='footer-image' />
                    </a>
                    <a href='https://discord.gg/phK668J6dQ' target="_blank" rel="noreferrer">
                        <img alt="Discord Icon" src={discord} className='footer-image' />
                    </a>
                    <a href='https://github.com/hundred-finance' target="_blank" rel="noreferrer">
                        <img alt="Github Icon" src={github} className='footer-image' />
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Footer;