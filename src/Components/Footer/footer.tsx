import React from 'react';
import './footer.css';
import {HundredLogo, Discord, Immunefi, Medium, Twitter, Telegram } from "../../assets/assets"


const Footer : React.FC = () => {
    return (
        <footer className="footer_wrapper">
            <div className="footer_content">
                <div className="content_logo">
                    <HundredLogo width="150" height="27"/>
                    <p>@ 2021 Hundred, Inc.</p>
                </div>
                <div className="content">
                    <h4>Documents</h4>
                    <a href="https://docs.hundred.finance/support/faq" target={"_blank"} rel={"noreferrer"}><p>FAQ</p></a>
                    <a href="https://github.com/hundred-finance" target={"_blank"} rel={"noreferrer"}><p>Github</p></a>
                    <a href="https://github.com/chainsulting/Smart-Contract-Security-Audits/blob/master/Percent%20Finance/02_Smart%20Contract%20Audit%20Percent%20Finance.pdf" target={"_blank"} rel={"noreferrer"}>
                        <p>Audit Reports</p>
                    </a>
                    <a href="https://docs.hundred.finance" target={"_blank"} rel={"noreferrer"}><p>Whitepaper</p></a>
                    <a href="https://immunefi.com/bounty/hundredfinance/" target={"_blank"} rel={"noreferrer"}>
                        <div className="footer_logo">
                            <Immunefi/>
                        </div>
                        <p>Immunefi</p>
                    </a>
                </div>
                <div className="content">
                    <h4>Governance</h4>
                    <a href="https://snapshot.org/#/hundredfinance.eth" target={"_blank"} rel={"noreferrer"}><p>Snapshot</p></a>
                    <a href="https://forum.hundred.finance" target={"_blank"} rel={"noreferrer"}><p>Forum</p></a>
                    <a href="https://migration.hundred.finance" target={"_blank"} rel={"noreferrer"}><p>Migration</p></a>
                </div>
                <div className="content">
                    <h4>Community</h4>
                    <a href="https://blog.hundred.finance" target={"_blank"} rel={"noreferrer"}>
                        <div className="footer_logo">
                            <Medium/>
                        </div>
                        <p>Medium</p>
                    </a>
                    <a href="https://discord.com/invite/phK668J6dQ" target={"_blank"} rel={"noreferrer"}>
                        <div className="footer_logo">
                            <Discord/>
                        </div>
                        <p>Discord</p>
                    </a>
                    <a href="https://twitter.com/HundredFinance" target={"_blank"} rel={"noreferrer"}>
                        <div className="footer_logo">
                            <Twitter/>
                        </div>
                        <p>Twitter</p>
                    </a>
                    <a href="https://t.me/joinchat/z0gRXOqZAEQ1ZDRk" target={"_blank"} rel={"noreferrer"}>
                        <div className="footer_logo">
                            <Telegram/>
                        </div>
                        <p>Telegram</p>
                    </a>
                </div>
            </div>
        </footer>
    )
}

export default Footer;