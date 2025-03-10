import React, {useContext} from "react";
import { ThemeContext } from "./themeContext";

const ThemeToggle = () => {
    const {theme, toggleTheme} = useContext(ThemeContext);

    return(
        <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-200 dark:bg-gray-800">
            {theme === 'light' ? '🌞' : '🌜'}
        </button>
    )
}

export default ThemeToggle;