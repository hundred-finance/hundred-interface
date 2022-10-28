import React from "react"
import "./themeSwitch.css"
import { Sun, Moon } from "../../assets/assets";
import { useUiContext } from "../../Types/uiContext";

const ThemeSwitch: React.FC = () => {
    const {darkMode, setDarkMode} = useUiContext()
    const handleSwitchTheme = () => {
        setDarkMode(!darkMode)
    }
    return (
        <div className={`theme-switch ${darkMode ? "theme-switch-dark-mode" : ""}`} onClick={handleSwitchTheme}>
            <Moon/>
            <Sun/>
        </div>
    )
}

export default ThemeSwitch