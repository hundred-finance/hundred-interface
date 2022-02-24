import React, { useRef, useEffect } from 'react';
import './messageModal.css';
import closeIcon from '../../assets/icons/closeIcon.png';

interface Props {
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    showNetworks: React.Dispatch<React.SetStateAction<boolean>>;
}

const MessageModal: React.FC<Props> = (props) => {
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        if (props.show) {
            document.getElementsByTagName('body')[0].style.overflow = 'hidden';
        } else {
            document.getElementsByTagName('body')[0].style.overflow = 'auto';
            props.setShow(false);
        }

        function handleClickOutside(event: any): void {
            if (ref && ref.current && !ref.current.contains(event.target)) {
                props.setShow(false);
            }
        }

        // Bind the event listener
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref, props.show]);

    const handleButtonClick = () => {
        if (props)
            // eslint-disable-next-line react/prop-types
            props?.showNetworks(true);
    };

    return props.show ? (
        <div className={`dialog ${props.show ? 'open-dialog' : ''}`}>
            <div ref={ref} className="message-box">
                <img src={closeIcon} alt="Close Icon" className="dialog-close" onClick={() => props.setShow(false)} />
                <div className="message-box-content">
                    <div className="message-box-text">We are on Arbitrum. Please switch.</div>
                    <div className="message-box-action">
                        <button className="message-box-button" onClick={handleButtonClick}>
                            Switch to Arbitrum
                        </button>
                    </div>
                </div>
            </div>
        </div>
    ) : null;
};

export default MessageModal;
