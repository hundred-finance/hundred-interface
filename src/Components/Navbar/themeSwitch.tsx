import React from "react"

import { ReactComponent as Sun } from '../../assets/sun.svg';
import { ReactComponent as Moon } from '../../assets/moon.svg';

interface Props{
    darkMode: boolean,
    setDarkMode: React.Dispatch<React.SetStateAction<boolean>>,
}

const ThemeSwitch: React.FC<Props> = ({darkMode, setDarkMode} : Props) => {
    return (
        <div className="theme-switch">
            <Sun className={`navbar-right-sun ${darkMode ? 'deactive' : 'active'}`} onClick={() => setDarkMode(false)} />
            <Moon className={`navbar-right-moon ${darkMode ? 'active' : 'deactive'}`} onClick={() => setDarkMode(true)} />
        </div>
    )
}

export default ThemeSwitch