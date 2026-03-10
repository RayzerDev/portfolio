"use client";

import Link from "next/link";
import Image from "next/image";
import {Github, LinkedinIcon, Menu, X} from "lucide-react";
import {useState} from "react";
import {ModeToggle} from "@/components/ui/darkmodetoggle";
import {LanguageSwitcher} from "@/components/ui/LanguageSwitcher";
import {useTranslation} from "@/hooks/useTranslation";

export function Header() {
    const {t} = useTranslation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const NavLinks = ({
                          className = "", onClick = () => {
        }
                      }) => (
        <>
            <Link href="/skills" className={`text-lg font-medium hover:scale-110 transition ${className}`}
                  prefetch={false} onClick={onClick}>
                {t("nav.skills")}
            </Link>
            <Link href="/projects" className={`text-lg font-medium hover:scale-110 transition ${className}`}
                  prefetch={false} onClick={onClick}>
                {t("nav.projects")}
            </Link>
            <Link href="/contact" className={`text-lg font-medium hover:scale-110 transition ${className}`}
                  prefetch={false} onClick={onClick}>
                {t("nav.contact")}
            </Link>
            <div className={`flex items-center justify-center gap-4`}>
                <Link href="https://github.com/RayzerDev"
                      className={`text-lg font-medium hover:scale-110 transition ${className}`}
                      prefetch={false} target="_blank" onClick={onClick}>
                    <Github/>
                </Link>
                <Link href="https://www.linkedin.com/in/louiskrmk/"
                      className={`text-lg font-medium hover:scale-110 transition ${className}`} prefetch={false}
                      target="_blank" onClick={onClick}>
                    <LinkedinIcon/>
                </Link>
            </div>
        </>
    );

    return (
        <header
            className="bg-background text-foreground py-6 px-4 md:px-6 gap-4 sticky top-0 z-[10000] shadow-sm border-b border-border">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center gap-4 ml-2">
                    <Link href="/" className="text-lg font-medium hover:scale-110 transition" prefetch={false}>
                        <Image src="/logo.svg" alt="LK" width={160} height={160}/>
                    </Link>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-4 flex-wrap justify-center ml-8">
                    <NavLinks/>
                    <LanguageSwitcher/>
                    <ModeToggle/>
                </nav>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center gap-4">
                    <LanguageSwitcher/>
                    <ModeToggle/>
                    <button onClick={toggleMenu} className="p-2">
                        {isMenuOpen ? <X size={24}/> : <Menu size={24}/>}
                    </button>
                </div>
            </div>

            {/* Mobile Nav Overlay */}
            {isMenuOpen && (
                <div
                    className="md:hidden absolute top-full left-0 right-0 bg-background border-t border-border p-4 flex flex-col gap-4 shadow-lg items-center animate-in slide-in-from-top-5">
                    <NavLinks className="w-full text-center py-2" onClick={() => setIsMenuOpen(false)}/>
                </div>
            )}
        </header>
    );
}
