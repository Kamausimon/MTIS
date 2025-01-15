import React ,{createContext, useEffect, useState} from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({children}) => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    //toggle between light and dark theme
    const toggleTheme = () =>{
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    }

    //add or remove dark class to or from html element based on theme
    useEffect(()=>{
        const root = window.document.documentElement;
        if(theme === 'dark'){
            root.classList.add('dark');
        } else{
            root.classList.remove('dark');
        }
    }, [theme]);

    return(
        <ThemeContext.Provider value={{theme, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}