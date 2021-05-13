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
                    <a className='footer-link-item' href='/'>Governance</a>
                    <a className='footer-link-item' href='/'>Audit</a>
                    <a className='footer-link-item' href='/'>Github</a>
                    <a className='footer-link-item' href='/'>Dashboard</a>
                </div>
                <div className='footer-right'>
                    <a href='/'>
                        <img alt="Medium Icon" src={medium} className='footer-image' />
                    </a>
                    <a href='/'>
                        <img alt="Discord Icon" src={discord} className='footer-image' />
                    </a>
                    <a href='/'>
                        <img alt="Github Icon" src={github} className='footer-image' />
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Footer;