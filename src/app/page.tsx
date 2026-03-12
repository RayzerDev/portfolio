"use client";

import React, {useEffect, useState} from "react";
import {Building, CalendarIcon, Code, Dumbbell, Gamepad, Guitar, LucideProps, MapPin, School} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";
import {useTranslation} from "@/hooks/useTranslation";

const iconMap: Record<string, React.FC<LucideProps>> = {
    Dumbbell,
    Guitar,
    Gamepad,
    Code,
};

// Handles both MM/YY (experiences) and MM/YYYY (projects) formats
function formatDate(dateStr: string, lang: string): string {
    if (!dateStr) return '';
    const [month, year] = dateStr.split('/');
    if (!month || !year) return dateStr;
    const fullYear = year.length === 2 ? `20${year}` : year;
    const monthsFr = ['Jan.', 'Fév.', 'Mar.', 'Avr.', 'Mai', 'Juin', 'Juil.', 'Août', 'Sep.', 'Oct.', 'Nov.', 'Déc.'];
    const monthsEn = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'];
    const months = lang === 'en' ? monthsEn : monthsFr;
    return `${months[parseInt(month, 10) - 1] ?? month} ${fullYear}`;
}

function isOngoing(dateStr: string): boolean {
    const [month, year] = dateStr.split('/').map(Number);
    if (!month || !year) return false;
    const fullYear = year < 100 ? 2000 + year : year;
    return new Date(fullYear, month - 1) > new Date();
}

interface TimelineEntry {
    id: string;
    nom: string;
    type: string;
    debut: string;
    fin: string;
    subtitle: string;
    location: string;
}

function TimelineCard({entry, lang, presentLabel}: { entry: TimelineEntry; lang: string; presentLabel: string }) {
    const ongoing = isOngoing(entry.fin);
    const dateRange = `${formatDate(entry.debut, lang)} → ${ongoing ? presentLabel : formatDate(entry.fin, lang)}`;

    return (
        <div className="rounded-xl border border-border/60 bg-card/80 backdrop-blur-sm p-4 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-foreground leading-tight">{entry.nom}</h3>
                {ongoing && (
                    <span
                        className="shrink-0 inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 text-xs font-medium">
                        {presentLabel}
                    </span>
                )}
            </div>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 shrink-0"/>
                {entry.subtitle}
                <span className="text-border mx-0.5">·</span>
                <MapPin className="w-3.5 h-3.5 shrink-0"/>
                {entry.location}
            </p>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/60">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <CalendarIcon className="w-3 h-3 shrink-0"/>
                    {dateRange}
                </span>
                <span
                    className="inline-flex items-center rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs font-medium">
                    {entry.type}
                </span>
            </div>
        </div>
    );
}

function DegreeCard({entry, lang, presentLabel}: { entry: TimelineEntry; lang: string; presentLabel: string }) {
    const ongoing = isOngoing(entry.fin);
    const dateRange = `${formatDate(entry.debut, lang)} → ${ongoing ? presentLabel : formatDate(entry.fin, lang)}`;

    return (
        <div className="rounded-xl border border-border/60 bg-card/80 backdrop-blur-sm p-4 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-foreground leading-tight">{entry.nom}</h3>
                {ongoing && (
                    <span
                        className="shrink-0 inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 text-xs font-medium">
                        {presentLabel}
                    </span>
                )}
            </div>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                <School className="w-3.5 h-3.5 shrink-0"/>
                {entry.subtitle}
                <span className="text-border mx-0.5">·</span>
                <MapPin className="w-3.5 h-3.5 shrink-0"/>
                {entry.location}
            </p>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/60">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <CalendarIcon className="w-3 h-3 shrink-0"/>
                    {dateRange}
                </span>
                <span
                    className="inline-flex items-center rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs font-medium">
                    {entry.type}
                </span>
            </div>
        </div>
    );
}

function TimelineList({children}: { children: React.ReactNode }) {
    const items = React.Children.toArray(children);
    return (
        <div>
            {items.map((child, i) => (
                <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-primary ring-2 ring-background mt-[18px] shrink-0"/>
                        {i < items.length - 1 && (
                            <div className="w-0.5 flex-1 bg-border mt-1"/>
                        )}
                    </div>
                    <div className="flex-1 pb-3">{child}</div>
                </div>
            ))}
        </div>
    );
}

function TimelineSkeleton({count}: { count: number }) {
    return (
        <div>
            {Array.from({length: count}).map((_, i) => (
                <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                        <Skeleton className="w-3 h-3 rounded-full mt-[18px] shrink-0"/>
                        {i < count - 1 && <div className="w-0.5 flex-1 bg-border/50 mt-1"/>}
                    </div>
                    <div className="flex-1 pb-3">
                        <div className="rounded-md border bg-card p-4 shadow-sm">
                            <div className="flex items-start justify-between gap-2">
                                <Skeleton className="h-5 w-40"/>
                            </div>
                            <Skeleton className="h-4 w-52 mt-2"/>
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                                <Skeleton className="h-3.5 w-36"/>
                                <Skeleton className="h-5 w-20 rounded-full"/>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function ProfilePhoto() {
    const [error, setError] = useState(false);
    if (error) return null;
    return (
        <div className="shrink-0 flex justify-center md:justify-end relative">
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl scale-110 pointer-events-none"/>
            <img
                src="/api/linkedin-photo"
                alt="Louis Karamucki"
                className="relative w-36 h-36 md:w-48 md:h-48 rounded-full object-cover border-4 border-primary/80 shadow-2xl shadow-primary/30"
                onError={() => setError(true)}
            />
        </div>
    );
}

function HobbySkeleton() {
    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-2">
                <Skeleton className="h-12 w-12 rounded-md"/>
                <Skeleton className="h-5 w-28 mt-2"/>
            </CardHeader>
            <CardContent><Skeleton className="h-4 w-full mb-1"/><Skeleton className="h-4 w-3/4"/></CardContent>
        </Card>
    );
}

export default function Home() {
    const {t, lang} = useTranslation();
    const [workExperiences, setWorkExperiences] = useState<any[]>([]);
    const [degrees, setDegrees] = useState<any[]>([]);
    const [hobbies, setHobbies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            fetch(`/api/work-experiences?lang=${lang}`).then(r => r.json()),
            fetch(`/api/degrees?lang=${lang}`).then(r => r.json()),
            fetch(`/api/hobbies?lang=${lang}`).then(r => r.json()),
        ]).then(([experiences, degs, hobs]) => {
            setWorkExperiences(experiences);
            setDegrees(degs);
            setHobbies(hobs);
            setLoading(false);
        });
    }, [lang]);

    const presentLabel = t("home.present");

    const workEntries: TimelineEntry[] = workExperiences.map(e => ({
        id: e.id,
        nom: e.nom,
        type: e.type,
        debut: e.debut,
        fin: e.fin,
        subtitle: e.entreprise,
        location: e.ville,
    }));

    const degreeEntries: TimelineEntry[] = degrees.map(d => ({
        id: d.id,
        nom: d.nom,
        type: d.type,
        debut: d.debut,
        fin: d.fin,
        subtitle: d.ecole,
        location: d.ville,
    }));

    return (
        <div className="container mx-auto py-12 px-4 md:px-6 lg:px-8">
            <section className="mb-16">
                <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/60 backdrop-blur-sm p-8 md:p-12 flex flex-col md:flex-row md:items-center gap-8 shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none"/>
                    <div className="flex-1 relative">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-secondary">
                            Louis Karamucki
                            <span className="block h-1 mt-3 w-20 bg-primary rounded-full"/>
                        </h1>
                        <p className="mt-4 max-w-[600px] text-muted-foreground md:text-xl">
                            {t("home.description")}
                        </p>
                    </div>
                    <ProfilePhoto/>
                </div>
            </section>

            <section className="mb-12">
                <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-secondary mb-5">
                            {t("home.workExperiences")}
                        </h2>
                        {loading
                            ? <TimelineSkeleton count={3}/>
                            : <TimelineList>
                                {workEntries.map(entry => (
                                    <TimelineCard key={entry.id} entry={entry} lang={lang} presentLabel={presentLabel}/>
                                ))}
                            </TimelineList>
                        }
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-secondary mb-5">
                            {t("home.degrees")}
                        </h2>
                        {loading
                            ? <TimelineSkeleton count={3}/>
                            : <TimelineList>
                                {degreeEntries.map(entry => (
                                    <DegreeCard key={entry.id} entry={entry} lang={lang} presentLabel={presentLabel}/>
                                ))}
                            </TimelineList>
                        }
                    </div>
                </div>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-secondary mb-5">{t("home.passions")}</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {loading
                        ? [1, 2, 3].map(i => <HobbySkeleton key={i}/>)
                        : hobbies.map((hobby) => {
                            const Icon = iconMap[hobby.icon] ?? Code;
                            return (
                                <Card key={hobby.id} className="flex flex-col">
                                    <CardHeader className="items-center text-center pb-2">
                                        <Icon className="w-12 h-12 text-primary mb-1"/>
                                        <CardTitle className="text-xl m-0 mt-1">{hobby.nom}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-center text-muted-foreground text-sm">
                                        {hobby.description}
                                    </CardContent>
                                </Card>
                            );
                        })
                    }
                </div>
            </section>
        </div>
    );
}
