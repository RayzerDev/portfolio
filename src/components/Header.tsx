"use client";

import Link from "next/link";
import {Briefcase, Github, Home, LinkedinIcon, Mail, Wrench} from "lucide-react";
import {useCallback, useEffect, useRef, useState} from "react";
import {usePathname} from "next/navigation";
import {ModeToggle} from "@/components/ui/darkmodetoggle";
import {LanguageSwitcher} from "@/components/ui/LanguageSwitcher";
import {useTranslation} from "@/hooks/useTranslation";
import {useLanguage} from "@/context/LanguageContext";

const NAV_ITEMS = [
    {href: "/",         tKey: "nav.home",     Icon: Home},
    {href: "/skills",   tKey: "nav.skills",   Icon: Wrench},
    {href: "/projects", tKey: "nav.projects", Icon: Briefcase},
    {href: "/contact",  tKey: "nav.contact",  Icon: Mail},
] as const;

const glassClass = [
    "backdrop-blur-2xl",
    "saturate-150",
    "bg-background/30",
    "border border-white/20 dark:border-white/8",
    "shadow-[0_4px_24px_hsl(var(--primary)/0.10),0_1px_0_rgba(255,255,255,0.18)_inset]",
].join(" ");

const Sep = () => <div className="w-px h-4 bg-white/20 dark:bg-white/10 shrink-0 mx-0.5"/>;

export function Header() {
    const {t} = useTranslation();
    const {lang} = useLanguage();
    const pathname = usePathname();

    const navRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
    const [pill, setPill] = useState<{left: number; width: number} | null>(null);

    const mobileNavRef = useRef<HTMLDivElement>(null);
    const mobileItemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
    const [mobilePill, setMobilePill] = useState<{left: number; width: number} | null>(null);

    const activeIndex = NAV_ITEMS.findIndex(({href}) =>
        href === "/" ? pathname === "/" : pathname.startsWith(href)
    );

    const measurePill = useCallback(() => {
        const nav = navRef.current;
        const el = itemRefs.current[activeIndex];
        if (!nav || !el) return;
        const navRect = nav.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        setPill({left: elRect.left - navRect.left, width: elRect.width});
    }, [activeIndex]);

    const measureMobilePill = useCallback(() => {
        const nav = mobileNavRef.current;
        const el = mobileItemRefs.current[activeIndex];
        if (!nav || !el) return;
        const navRect = nav.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        setMobilePill({left: elRect.left - navRect.left, width: elRect.width});
    }, [activeIndex]);

    useEffect(() => {
        const raf = requestAnimationFrame(() => { measurePill(); measureMobilePill(); });
        return () => cancelAnimationFrame(raf);
    }, [measurePill, measureMobilePill, lang]);

    useEffect(() => {
        window.addEventListener("resize", measurePill);
        window.addEventListener("resize", measureMobilePill);
        return () => {
            window.removeEventListener("resize", measurePill);
            window.removeEventListener("resize", measureMobilePill);
        };
    }, [measurePill, measureMobilePill]);

    return (
        <header className="fixed top-4 left-0 right-0 z-[10000] px-4 flex items-start justify-center pointer-events-none">

            {/* ── Mobile : un seul pill tout-en-un ── */}
            <div className={`pointer-events-auto flex md:hidden items-center gap-0.5 rounded-full px-2 py-1.5 ${glassClass}`}>
                <div ref={mobileNavRef} className="relative flex items-center">
                    {mobilePill && (
                        <span
                            aria-hidden
                            className="absolute inset-y-0 rounded-full bg-white/20 dark:bg-white/10 pointer-events-none"
                            style={{
                                left: mobilePill.left,
                                width: mobilePill.width,
                                transition: "left 0.25s cubic-bezier(0.4,0,0.2,1), width 0.25s cubic-bezier(0.4,0,0.2,1)",
                            }}
                        />
                    )}
                    {NAV_ITEMS.map((item, i) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            ref={el => { mobileItemRefs.current[i] = el; }}
                            prefetch={false}
                            className={`group relative z-10 flex flex-col items-center justify-center gap-0.5 px-2.5 py-1.5 rounded-full transition-colors ${
                                i === activeIndex ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            <item.Icon size={16} strokeWidth={i === activeIndex ? 2.2 : 1.8}/>
                            <span className={`text-[10px] font-medium leading-none transition-opacity duration-150 ${
                                i === activeIndex ? "opacity-100" : "opacity-0 group-hover:opacity-60"
                            }`}>
                                {t(item.tKey)}
                            </span>
                        </Link>
                    ))}
                </div>
                <Sep/>
                <LanguageSwitcher/>
                <ModeToggle/>
            </div>

            {/* ── Desktop : nav pill centré ── */}
            <div className={`pointer-events-auto hidden md:flex items-center gap-1 rounded-full px-2 py-1.5 ${glassClass}`}>
                <div ref={navRef} className="relative flex items-center">
                    {pill && (
                        <span
                            aria-hidden
                            className="absolute inset-y-0 rounded-full bg-white/20 dark:bg-white/10 pointer-events-none"
                            style={{
                                left: pill.left,
                                width: pill.width,
                                transition: "left 0.25s cubic-bezier(0.4,0,0.2,1), width 0.25s cubic-bezier(0.4,0,0.2,1)",
                            }}
                        />
                    )}
                    {NAV_ITEMS.map((item, i) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            ref={el => {itemRefs.current[i] = el;}}
                            prefetch={false}
                            className={`group relative z-10 flex flex-col items-center justify-center gap-0.5 px-2.5 py-1.5 rounded-full transition-colors ${
                                i === activeIndex ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            <item.Icon size={16} strokeWidth={i === activeIndex ? 2.2 : 1.8}/>
                            <span className={`text-[10px] font-medium leading-none transition-opacity duration-150 ${
                                i === activeIndex ? "opacity-100" : "opacity-0 group-hover:opacity-60"
                            }`}>
                                {t(item.tKey)}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* ── Desktop : controls pill droite ── */}
            <div className={`pointer-events-auto hidden md:flex absolute right-4 top-0 items-center gap-0.5 rounded-full px-2 py-1.5 ${glassClass}`}>
                <Link href="https://github.com/RayzerDev" target="_blank" prefetch={false}
                      className="flex items-center justify-center w-8 h-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-white/15 transition-all">
                    <Github size={15}/>
                </Link>
                <Link href="https://www.linkedin.com/in/louiskrmk/" target="_blank" prefetch={false}
                      className="flex items-center justify-center w-8 h-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-white/15 transition-all">
                    <LinkedinIcon size={15}/>
                </Link>
                <Sep/>
                <LanguageSwitcher/>
                <ModeToggle/>
            </div>
        </header>
    );
}
