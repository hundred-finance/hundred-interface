import React from 'react';
import './themeSwitch.css';
import { Sun, Moon } from '../../assets/huIcons/huIcons';

// import { ReactComponent as Sun } from '../../assets/sun.svg';
// import { ReactComponent as Moon } from '../../assets/moon.svg';

interface Props {
    darkMode: boolean;
    setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
    setOpenMenu?: React.Dispatch<React.SetStateAction<boolean>>;
}

const ThemeSwitch: React.FC<Props> = ({ darkMode, setDarkMode, setOpenMenu }: Props) => {
    const handleOpenMenu = () => {
        setDarkMode(!darkMode);
        if (setOpenMenu) {
            setOpenMenu(false);
        }
    };
    return (
        <div className={`theme-switch ${darkMode ? 'theme-switch-dark-mode' : ''}`} onClick={() => handleOpenMenu()}>
            <div className={`switch-button ${darkMode ? 'switch-button-dark-mode' : ''}`}></div>
            <Sun darkMode={darkMode} size="15px" />
            <Moon darkMode={darkMode} size="15px" />
        </div>
    );
};

export default ThemeSwitch;
