import React from "react"
import "./themeSwitch.css"
import { Sun, Moon } from "../../assets/huIcons/huIcons";
import { useUiContext } from "../../Types/uiContext";

const ThemeSwitch: React.FC = () => {
    const {darkMode, setDarkMode} = useUiContext()
    const handleSwitchTheme = () => {
        setDarkMode(!darkMode)
    }
    return (
        <div className={`theme-switch ${darkMode ? "theme-switch-dark-mode" : ""}`} onClick={handleSwitchTheme}>
            <div className={`switch-button ${darkMode ? "switch-button-dark-mode" : ""}`}></div>
            <Sun darkMode={darkMode} size="15px"/>
            <Moon darkMode={darkMode} size="15px"/>
        </div>
    )
}

export default ThemeSwitch