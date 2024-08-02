import {createContext, useEffect, useState} from 'react'

export const THEME_KEY = 'peedef-theme';

export const themeDefinitions = {
    light: 'light',
    dark: 'dark',
}

export const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(themeDefinitions.light)

    // Load theme dari session storage
    useEffect(() => {
        const savedTheme = sessionStorage.getItem(THEME_KEY);
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []);

    // Save theme ke session storage
    useEffect(() => {
        sessionStorage.setItem(THEME_KEY, theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => {
            return prevTheme === themeDefinitions.light ? themeDefinitions.dark : themeDefinitions.light
        });
    };

    return <ThemeContext.Provider value={{theme, toggleTheme}} >
        { children }
    </ThemeContext.Provider>
}