"use client";

import {useLanguage} from "@/context/LanguageContext";

const LANGS = [
    {code: "fr" as const, label: "FR", aria: "Français"},
    {code: "en" as const, label: "EN", aria: "English"},
];

export function LanguageSwitcher() {
    const {lang, setLang} = useLanguage();

    return (
        <div className="flex items-center gap-0.5 bg-muted rounded-full p-0.5">
            {LANGS.map(({code, label, aria}) => (
                <button
                    key={code}
                    onClick={() => setLang(code)}
                    aria-label={aria}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                        lang === code
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                    {label}
                </button>
            ))}
        </div>
    );
}
