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

function getInitialLanguage(): Lang {
    if (typeof window === "undefined") return "fr";
    try {
        const stored = localStorage.getItem("lang") as Lang | null;
        if (stored === "fr" || stored === "en") return stored;
        return detectSystemLanguage();
    } catch {
        return "fr";
    }
}

const LanguageContext = createContext<LanguageContextType>({
    lang: "fr",
    setLang: () => {
    },
});

export function LanguageProvider({children}: { children: React.ReactNode }) {
    const [lang, setLangState] = useState<Lang>(getInitialLanguage);

    useEffect(() => {
        const current = getInitialLanguage();
        if (current !== lang) {
            setLangState(current);
        }
        if (typeof document !== "undefined") {
            document.documentElement.lang = current;
        }
    }, [lang]);

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
