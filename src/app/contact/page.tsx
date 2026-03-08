"use client";

import Link from "next/link";
import {LocateIcon, MailIcon} from "lucide-react";
import {useTranslation} from "@/hooks/useTranslation";
import NordPasDeCalaisMap from "@/components/NordPasDeCalaisMap";

export default function Contact() {
    const {t, lang} = useTranslation();
    return (
        <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container grid gap-8 px-4 md:px-6 lg:grid-cols-2 lg:gap-12 mx-auto">
                {/* Colonne gauche : infos + carte */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-secondary">{t("contact.title")}</h2>
                        <p className="text-muted-foreground md:text-xl/relaxed">
                            {t("contact.subtitle")}
                        </p>
                        <div className="flex items-center gap-4">
                            <MailIcon className="w-6 h-6 text-secondary"/>
                            <a href="mailto:louis.karamucki@outlook.fr"
                               className="text-primary-foreground hover:underline">
                                louis.karamucki@outlook.fr
                            </a>
                        </div>
                        <div className="flex items-center gap-4">
                            <LocateIcon className="w-6 h-6 text-secondary"/>
                            <span className="text-primary-foreground">Nord-Pas-De-Calais, France</span>
                        </div>
                        <NordPasDeCalaisMap/>
                    </div>
                </div>

                {/* Colonne droite : CV */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-secondary">{t("contact.cvTitle")}</h2>
                        <p className="text-muted-foreground md:text-xl/relaxed">
                            {t("contact.cvSubtitle")}
                        </p>
                    </div>
                    <Link
                        href={`/api/cv?lang=${lang}`}
                        target="_blank"
                        download
                        className="inline-flex h-10 items-center justify-center rounded-md bg-card px-8 text-sm font-medium
                text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none
                focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                        prefetch={false}
                    >
                        {t("contact.cvButton")}
                    </Link>
                </div>
            </div>
        </section>
    )
}
