import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function LanguageToggle() {
    const { lang, toggleLanguage } = useLanguage();

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
        >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${lang === 'en' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400'
                }`}>EN</div>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${lang === 'hi' ? 'bg-orange-600 text-white' : 'bg-slate-700 text-slate-400'
                }`}>हि</div>
        </button>
    );
}
