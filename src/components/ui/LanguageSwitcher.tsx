"use client";

import {useLanguage} from "@/context/LanguageContext";

export function LanguageSwitcher() {
    const {lang, setLang} = useLanguage();

    return (
        <div className="flex items-center gap-1 text-sm font-medium">
            <button
                onClick={() => setLang("fr")}
                className={`px-2 py-1 rounded transition hover:scale-110 ${lang === "fr" ? "font-bold underline" : "opacity-60"}`}
                aria-label="Français"
            >
                FR
            </button>
            <span className="opacity-40">|</span>
            <button
                onClick={() => setLang("en")}
                className={`px-2 py-1 rounded transition hover:scale-110 ${lang === "en" ? "font-bold underline" : "opacity-60"}`}
                aria-label="English"
            >
                EN
            </button>
        </div>
    );
}
