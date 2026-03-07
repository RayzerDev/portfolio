"use client";

import Link from "next/link";
import Image from "next/image";
import {Github, LinkedinIcon} from "lucide-react";
import {ModeToggle} from "@/components/ui/darkmodetoggle";
import {LanguageSwitcher} from "@/components/ui/LanguageSwitcher";
import {useTranslation} from "@/hooks/useTranslation";

export function Header() {
    const {t} = useTranslation();

    return (
        <header className="bg-primary text-foreground py-6 px-4 md:px-6 gap-4">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center gap-4 ml-2">
                    <Link href="/" className="text-lg font-medium hover:scale-110 transition" prefetch={false}>
                        <Image src="/logo.svg" alt="LK" width={160} height={160}/>
                    </Link>
                </div>
                <nav className="flex items-center gap-4 flex-wrap justify-center ml-8">
                    <Link href="/skills" className="text-lg font-medium hover:scale-110 transition" prefetch={false}>
                        {t("nav.skills")}
                    </Link>
                    <Link href="/projects" className="text-lg font-medium hover:scale-110 transition" prefetch={false}>
                        {t("nav.projects")}
                    </Link>
                    <Link href="/contact" className="text-lg font-medium hover:scale-110 transition" prefetch={false}>
                        {t("nav.contact")}
                    </Link>
                    <Link href="https://github.com/RayzerDev" className="text-lg font-medium hover:scale-110 transition"
                          prefetch={false} target="_blank">
                        <Github/>
                    </Link>
                    <Link href="https://www.linkedin.com/in/louiskrmk/"
                          className="text-lg font-medium hover:scale-110 transition" prefetch={false} target="_blank">
                        <LinkedinIcon/>
                    </Link>
                    <LanguageSwitcher/>
                    <ModeToggle/>
                </nav>
            </div>
        </header>
    );
}
