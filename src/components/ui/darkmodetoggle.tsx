"use client"

import {useEffect, useState} from "react";
import {useTheme} from "next-themes";
import {Monitor, Moon, Sun} from "lucide-react";
import {useLanguage} from "@/context/LanguageContext";

const THEMES = ["light", "dark", "system"] as const;
type Theme = typeof THEMES[number];
const ICONS: Record<Theme, React.ElementType> = {light: Sun, dark: Moon, system: Monitor};
const LABELS_FR: Record<Theme, string> = {light: "Clair", dark: "Sombre", system: "Système"};
const LABELS_EN: Record<Theme, string> = {light: "Light", dark: "Dark", system: "System"};

export function ModeToggle() {
    const {theme, setTheme} = useTheme();
    const {lang} = useLanguage();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) return <div className="w-8 h-8"/>;

    const current: Theme = THEMES.includes(theme as Theme) ? (theme as Theme) : "system";
    const Icon = ICONS[current];
    const next = THEMES[(THEMES.indexOf(current) + 1) % THEMES.length];
    const labels = lang === "fr" ? LABELS_FR : LABELS_EN;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        const x = e.clientX;
        const y = e.clientY;
        const doc = document.documentElement;
        doc.style.setProperty("--vt-x", `${x}px`);
        doc.style.setProperty("--vt-y", `${y}px`);

        if (!("startViewTransition" in document)) {
            setTheme(next);
            return;
        }
        (document as Document & { startViewTransition: (cb: () => void) => void })
            .startViewTransition(() => setTheme(next));
    };

    const actionText = lang === "fr" ? `Basculer vers le thème ${labels[next]}` : `Switch to ${labels[next]} theme`;

    return (
        <button
            onClick={handleClick}
            aria-label={actionText}
            title={actionText}
            className="flex items-center justify-center w-8 h-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
        >
            <Icon size={15}/>
        </button>
    );
}
