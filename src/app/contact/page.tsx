"use client";

import {useState} from "react";
import {FileText, Github, Linkedin, Loader2, Mail, MapPin} from "lucide-react";
import {useTranslation} from "@/hooks/useTranslation";

const CONTACT_LINKS = [
    {
        icon: Mail,
        labelKey: "contact.emailLabel",
        value: "louis.karamucki@outlook.fr",
        href: "mailto:louis.karamucki@outlook.fr",
    },
    {
        icon: Linkedin,
        labelKey: "contact.linkedinLabel",
        value: "linkedin.com/in/louiskrmk",
        href: "https://www.linkedin.com/in/louiskrmk/",
    },
    {
        icon: Github,
        labelKey: "contact.githubLabel",
        value: "github.com/RayzerDev",
        href: "https://github.com/RayzerDev",
    },
    {
        icon: MapPin,
        labelKey: "contact.locationLabel",
        value: "Nord-Pas-De-Calais, France",
        href: null,
    },
];

export default function Contact() {
    const {t, lang} = useTranslation();
    const [cvLoading, setCvLoading] = useState(false);

    const handleCvDownload = async () => {
        // Open a blank window synchronously to avoid popup blockers
        const newWindow = window.open('', '_blank');

        if (!newWindow) {
            window.alert('Unable to open the CV in a new tab. Please allow popups for this site in your browser settings and try again.');
            return;
        }

        setCvLoading(true);
        try {
            const res = await fetch(`/api/cv?lang=${lang}`);

            if (!res.ok) {
                window.alert(`Failed to load the CV (Status: ${res.status}). Please try again later.`);
                newWindow.close();
                return;
            }

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            newWindow.location.href = url;
            setTimeout(() => URL.revokeObjectURL(url), 15000);
        } catch (error) {
            console.error('CV download error:', error);
            window.alert('An error occurred while loading the CV. Please try again later.');
            newWindow.close();
        } finally {
            setCvLoading(false);
        }
    };

    return (
        <div className="w-full">
            {/* ── Hero ── */}
            <section className="pt-8 pb-8 md:pt-16 md:pb-12">
                <div className="container mx-auto px-4 md:px-6 text-center max-w-2xl">
                    <h1 className="text-3xl font-bold tracking-tight sm:text-5xl md:text-6xl text-secondary">
                        {t("contact.title")}
                    </h1>
                    <p className="mt-3 text-base text-muted-foreground md:text-xl/relaxed hidden sm:block">
                        {t("contact.subtitle")}
                    </p>
                </div>
            </section>

            {/* ── Contact grid ── */}
            <section className="pb-8 md:pb-12">
                <div className="container mx-auto px-4 md:px-6 max-w-3xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {CONTACT_LINKS.map(({icon: Icon, labelKey, value, href}) => (
                            <div
                                key={labelKey}
                                className="flex items-center gap-4 rounded-xl border border-border/60 bg-card/80 backdrop-blur-sm p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                            >
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                                    <Icon className="h-5 w-5 text-primary"/>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-0.5">
                                        {t(labelKey)}
                                    </p>
                                    {href ? (
                                        <a
                                            href={href}
                                            target={href.startsWith("mailto") ? undefined : "_blank"}
                                            rel="noopener noreferrer"
                                            className="text-sm font-semibold text-foreground hover:text-primary transition-colors truncate block"
                                        >
                                            {value}
                                        </a>
                                    ) : (
                                        <p className="text-sm font-semibold text-foreground truncate">{value}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CV section ── */}
            <section className="pb-16 md:pb-28">
                <div className="container mx-auto px-4 md:px-6 max-w-3xl">
                    <div className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-8 md:p-10 shadow-sm flex flex-col md:flex-row items-center gap-6 md:gap-10">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                            <FileText className="h-7 w-7 text-primary"/>
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-2xl font-bold tracking-tight text-secondary">
                                {t("contact.cvTitle")}
                            </h2>
                            <p className="mt-1 text-muted-foreground">
                                {t("contact.cvSubtitle")}
                            </p>
                        </div>
                        <button
                            onClick={handleCvDownload}
                            disabled={cvLoading}
                            className="inline-flex h-11 items-center gap-2 justify-center rounded-lg bg-primary px-7 text-sm font-semibold
                            text-primary-foreground shadow hover:bg-primary/90 transition-colors focus-visible:outline-none
                            focus-visible:ring-2 focus-visible:ring-ring shrink-0 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {cvLoading
                                ? <Loader2 className="h-4 w-4 animate-spin"/>
                                : <FileText className="h-4 w-4"/>}
                            {cvLoading ? t("contact.cvGenerating") : t("contact.cvButton")}
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

