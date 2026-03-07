"use client";

import React, {createContext, useContext, useEffect, useState} from "react";

type Lang = "fr" | "en";

interface LanguageContextType {
    lang: Lang;
    setLang: (lang: Lang) => void;
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
        }
    }, []);

    const setLang = (newLang: Lang) => {
        setLangState(newLang);
        localStorage.setItem("lang", newLang);
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
