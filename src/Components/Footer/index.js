import React from 'react';

import './style.css';
import {HuLogo} from "../../assets/huIcons/huIcons"

const Footer = (props) => {
    return (
        <div className='footer'>
            <div className='footer-content'>
                <div className='footer-left'>
                    <div className='footer-logo'>
                        <HuLogo size={props.isMobile ? "60px" : "80px"} darkMode={props.darkMode}/>
                    </div>
                    <div className='footer-left-navbar'>
                        <a className='footer-link-item' href='/'>Governance</a>
                        <a className='footer-link-item' href='/'>Audit</a>
                        <a className='footer-link-item' href='/'>Github</a>
                        <a className='footer-link-item' href='/'>Dashboard</a>
                    </div>
                </div>
                <div className='footer-right'>
                    <a href='/'>
                        <img alt="Medium Icon" src='/medium.png' className='footer-image' />
                    </a>
                    <a href='/'>
                        <img alt="Discord Icon" src='/discord.png' className='footer-image' />
                    </a>
                    <a href='/'>
                        <img alt="Github Icon" src='/github.png' className='footer-image' />
                    </a>
                </div>
            </div>
            <div className='footer-content-inc'>
                2021 Hundred, Inc.
            </div>
        </div>
    )
}

export default Footer;