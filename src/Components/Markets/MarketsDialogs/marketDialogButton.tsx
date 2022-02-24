import React, { ReactNode } from 'react';
import './marketDialogButton.css';

interface Props {
    disabled: boolean;
    children: ReactNode;
    onClick: () => void;
    className?: string;
}

const MarketDialogButton: React.FC<Props> = (props: Props) => {
    return (
        <div className={`market-dialog-button ${props.className ? props.className : ''}`}>
            <button disabled={props.disabled} onClick={() => props.onClick()}>
                {props.children}
            </button>
        </div>
    );
};

export default MarketDialogButton;
