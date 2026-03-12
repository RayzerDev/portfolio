"use client";

import Image from "next/image";
import {Skeleton} from "@/components/ui/skeleton";
import {Button} from "@/components/ui/button";
import {CalendarIcon, ChevronLeft, ChevronRight, ExternalLink, Github} from "lucide-react";
import {useEffect, useState} from "react";
import {useTranslation} from "@/hooks/useTranslation";
import {ProjectModal} from "@/components/ProjectModal";

const PROJECTS_PER_PAGE = 3;

function formatDate(date: string | undefined, lang: string): string {
    if (!date) return '';
    const [month, year] = date.split('/');
    if (!month || !year) return date;
    const monthsFr = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const arr = lang === 'en' ? monthsEn : monthsFr;
    return `${arr[parseInt(month, 10) - 1] ?? month} ${year}`;
}

function ProjectImage({src, alt, date, lang}: { src: string; alt: string; date?: string; lang: string }) {
    const [loaded, setLoaded] = useState(false);
    return (
        <div className="relative w-full aspect-video overflow-hidden bg-muted">
            {!loaded && <Skeleton className="absolute inset-0 w-full h-full rounded-none"/>}
            <Image
                src={src}
                alt={alt}
                width={600}
                height={340}
                className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${loaded ? "opacity-100" : "opacity-0"}`}
                onLoad={() => setLoaded(true)}
            />
            {date && (
                <span className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-black/50 backdrop-blur-sm text-white px-2.5 py-0.5 text-xs font-medium">
                    <CalendarIcon className="w-3 h-3"/>
                    {formatDate(date, lang)}
                </span>
            )}
        </div>
    );
}

function ProjectCardSkeleton() {
    return (
        <div className="rounded-xl border border-border/60 bg-card overflow-hidden flex flex-col">
            <Skeleton className="w-full aspect-video rounded-none"/>
            <div className="p-5 flex flex-col gap-3 flex-1">
                <Skeleton className="h-5 w-3/4"/>
                <Skeleton className="h-4 w-full"/>
                <Skeleton className="h-4 w-2/3"/>
                <div className="flex gap-2 mt-1">
                    <Skeleton className="h-5 w-16 rounded-full"/>
                    <Skeleton className="h-5 w-16 rounded-full"/>
                    <Skeleton className="h-5 w-16 rounded-full"/>
                </div>
            </div>
            <div className="px-5 pb-4 flex justify-between items-center border-t border-border/40 pt-3">
                <Skeleton className="h-4 w-20"/>
                <Skeleton className="h-4 w-24"/>
            </div>
        </div>
    );
}

function ProjectCard({projet, lang, t, onSelect}: {
    projet: any;
    lang: string;
    t: (k: string) => string;
    onSelect: (id: string) => void;
}) {
    return (
        <div
            className="group rounded-xl border border-border/60 bg-card overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-lg transition-all duration-200 cursor-pointer"
            onClick={() => onSelect(projet.id)}
        >
            {/* Image + date overlay */}
            <ProjectImage src={projet.imagePreview} alt={projet.nom} date={projet.date} lang={lang}/>

            {/* Body */}
            <div className="p-5 flex flex-col gap-2 flex-1">
                <h3 className="font-semibold text-base text-foreground leading-snug">
                    {projet.nom}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {projet.shortDescription}
                </p>
                {/* Skill chips */}
                {(projet.skills || []).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                        {(projet.skills || []).slice(0, 4).map((skill: any) => (
                            <span
                                key={skill.id}
                                className="inline-flex items-center rounded-full border border-border/60 bg-background px-2 py-0.5 text-xs text-muted-foreground"
                            >
                                {skill.nom}
                            </span>
                        ))}
                        {(projet.skills || []).length > 4 && (
                            <span className="inline-flex items-center rounded-full border border-border/60 bg-background px-2 py-0.5 text-xs text-muted-foreground">
                                +{projet.skills.length - 4}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div
                className="px-5 pb-4 pt-3 flex justify-between items-center border-t border-border/40"
                onClick={e => e.stopPropagation()}
            >
                <div>
                    {projet.githubLink ? (
                        <a
                            href={projet.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                            onClick={e => e.stopPropagation()}
                        >
                            <Github className="w-3.5 h-3.5"/>
                            GitHub
                        </a>
                    ) : <span/>}
                </div>
                <button
                    onClick={() => onSelect(projet.id)}
                    className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                >
                    <ExternalLink className="w-3.5 h-3.5"/>
                    {t("projects.seeProject")}
                </button>
            </div>
        </div>
    );
}

function CategorySection({categorie, projets, t, lang, onSelectProject}: {
    categorie: string;
    projets: any[];
    t: (key: string) => string;
    lang: string;
    onSelectProject: (id: string) => void;
}) {
    const [page, setPage] = useState(1);
    const totalPages = Math.ceil(projets.length / PROJECTS_PER_PAGE);
    const paginated = projets.slice((page - 1) * PROJECTS_PER_PAGE, page * PROJECTS_PER_PAGE);

    return (
        <div className="mb-12">
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-secondary">{categorie}</h2>
                    <span className="rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs font-semibold tabular-nums">
                        {projets.length}
                    </span>
                </div>
                {totalPages > 1 && (
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPage(p => p - 1)} disabled={page === 1}>
                            <ChevronLeft className="w-4 h-4"/>
                        </Button>
                        <span className="text-sm text-muted-foreground tabular-nums w-10 text-center">{page} / {totalPages}</span>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>
                            <ChevronRight className="w-4 h-4"/>
                        </Button>
                    </div>
                )}
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {paginated.map((projet) => (
                    <ProjectCard key={projet.id} projet={projet} lang={lang} t={t} onSelect={onSelectProject}/>
                ))}
            </div>
        </div>
    );
}

export default function Projects() {
    const {t, lang} = useTranslation();
    const [groupedProjects, setGroupedProjects] = useState<Record<string, any[]>>({});
    const [loading, setLoading] = useState(true);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/projects?lang=${lang}`)
            .then(r => r.json())
            .then(data => {
                setGroupedProjects(data);
                setLoading(false);
            });
    }, [lang]);

    return (
        <>
            <div className="w-full">
                {/* â”€â”€ Hero â”€â”€ */}
                <section className="pt-8 pb-8 md:pt-16 md:pb-12">
                    <div className="container mx-auto px-4 md:px-6 text-center max-w-2xl">
                        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl md:text-6xl text-secondary">
                            {t("projects.title")}
                        </h1>
                        <p className="mt-3 text-base text-muted-foreground md:text-xl/relaxed hidden sm:block">
                            {t("projects.subtitle")}
                        </p>
                    </div>
                </section>

                {/* â”€â”€ Grid â”€â”€ */}
                <section className="pb-16 md:pb-28">
                    <div className="container mx-auto px-4 md:px-6">
                        {loading ? (
                            <>
                                {[1, 2].map((cat) => (
                                    <div key={cat} className="mb-12">
                                        <Skeleton className="h-7 w-48 mb-5"/>
                                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                            {[1, 2, 3].map((i) => <ProjectCardSkeleton key={i}/>)}
                                        </div>
                                    </div>
                                ))}
                            </>
                        ) : (
                            Object.entries(groupedProjects).map(([categorie, projets]) => (
                                <CategorySection
                                    key={categorie}
                                    categorie={categorie}
                                    projets={projets}
                                    t={t}
                                    lang={lang}
                                    onSelectProject={setSelectedProjectId}
                                />
                            ))
                        )}
                    </div>
                </section>
            </div>

            <ProjectModal
                projectId={selectedProjectId}
                onClose={() => setSelectedProjectId(null)}
                lang={lang}
                t={t}
            />
        </>
    );

}
