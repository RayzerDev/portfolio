"use client";

import Image from "next/image";
import {Globe} from "lucide-react";
import {useTranslation} from "@/hooks/useTranslation";

export function LanguagesSection() {
    const {t, lang} = useTranslation();

    const languagesList = [
        {
            id: "fr",
            flag: "/images/skills/fr.svg",
            name: lang === "fr" ? "Français" : "French",
            badge: lang === "fr" ? "Maternelle" : "Native",
            badgeVariant: "emerald" as const,
            level: lang === "fr" ? "Langue maternelle" : "Native language",
            description: lang === "fr"
                ? "Langue maternelle. Maîtrise complète de la communication écrite et orale."
                : "Native speaker. Full proficiency in written and spoken communication.",
        },
        {
            id: "en",
            flag: "/images/skills/gb.svg",
            name: lang === "fr" ? "Anglais" : "English",
            badge: "TOEIC 710 · B2",
            badgeVariant: "primary" as const,
            level: lang === "fr" ? "Niveau B2 opérationnel" : "Working proficiency B2",
            description: lang === "fr"
                ? "Certification officielle TOEIC obtenue avec 710 points (Niveau B2). Capacité à évoluer dans un environnement professionnel international et technique."
                : "Official TOEIC certification with 710 points (B2 level). Able to collaborate in an international technical and professional workplace.",
        },
    ];

    return (
        <section id="languages" className="scroll-mt-24 mb-16 md:mb-24">
            <div className="flex items-center gap-3 mb-8">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Globe className="h-5 w-5"/>
                </div>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-secondary">
                        {t("languages.title")}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        {t("languages.subtitle")}
                    </p>
                </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
                {languagesList.map((item) => (
                    <div
                        key={item.id}
                        className="group rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-6 shadow-sm hover:shadow-xl hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                    >
                        <div className="flex items-start gap-4">
                            <div className="relative w-14 h-14 shrink-0 rounded-2xl overflow-hidden shadow-sm border border-border/70 group-hover:scale-105 transition-transform duration-300">
                                <Image src={item.flag} alt={item.name} fill sizes="56px" className="object-cover"/>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-1">
                                    <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                                        {item.name}
                                    </h3>
                                    {item.badgeVariant === "emerald" ? (
                                        <span className="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 px-3 py-0.5 text-xs font-semibold shadow-xs">
                                            {item.badge}
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-3 py-0.5 text-xs font-semibold shadow-xs">
                                            {item.badge}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs font-medium text-muted-foreground">
                                    {item.level}
                                </p>
                            </div>
                        </div>

                        <p className="text-sm text-muted-foreground mt-4 pt-4 border-t border-border/50 leading-relaxed">
                            {item.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
