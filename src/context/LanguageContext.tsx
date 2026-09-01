"use client";

import React, {createContext, useContext, useEffect, useState} from "react";

type Lang = "fr" | "en";

interface LanguageContextType {
    lang: Lang;
    setLang: (lang: Lang) => void;
}

function detectSystemLanguage(): Lang {
    if (typeof window === "undefined" || !navigator?.language) return "fr";
    const navLang = (navigator.languages?.[0] || navigator.language).toLowerCase();
    return navLang.startsWith("fr") ? "fr" : "en";
}

const LanguageContext = createContext<LanguageContextType>({
    lang: "fr",
    setLang: () => {
    },
});

export function LanguageProvider({children}: { children: React.ReactNode }) {
    const [lang, setLangState] = useState<Lang>("fr");

    useEffect(() => {
        const stored = localStorage.getItem("lang") as Lang | null;
        if (stored === "fr" || stored === "en") {
            setLangState(stored);
            document.documentElement.lang = stored;
        } else {
            const detected = detectSystemLanguage();
            setLangState(detected);
            document.documentElement.lang = detected;
        }
    }, []);

    const setLang = (newLang: Lang) => {
        setLangState(newLang);
        localStorage.setItem("lang", newLang);
        if (typeof document !== "undefined") {
            document.documentElement.lang = newLang;
        }
    };

    return (
        <LanguageContext.Provider value={{lang, setLang}}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}
