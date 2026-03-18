import React, { createContext, useState, useContext, useEffect } from 'react';
import { translations } from '../utils/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [lang, setLang] = useState(localStorage.getItem('appLang') || 'en');

    useEffect(() => {
        localStorage.setItem('appLang', lang);
    }, [lang]);

    const t = (path) => {
        const keys = path.split('.');
        let result = translations[lang];

        for (const key of keys) {
            if (result[key] === undefined) {
                console.warn(`Translation key not found: ${path}`);
                return path;
            }
            result = result[key];
        }

        return result;
    };

    const toggleLanguage = () => {
        setLang((prev) => (prev === 'en' ? 'hi' : 'en'));
    };

    return (
        <LanguageContext.Provider value={{ lang, setLang, t, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
