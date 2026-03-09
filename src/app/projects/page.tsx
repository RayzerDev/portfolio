"use client";

import Image from "next/image";
import Link from "next/link";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
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

function ProjectImage({src, alt}: { src: string; alt: string }) {
    const [loaded, setLoaded] = useState(false);
    return (
        <div className="relative w-full aspect-video overflow-hidden rounded-md bg-muted">
            {!loaded && <Skeleton className="absolute inset-0 w-full h-full rounded-md"/>}
            <Image
                src={src}
                alt={alt}
                width={500}
                height={500}
                className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
                onLoad={() => setLoaded(true)}
            />
        </div>
    );
}

function ProjectCardSkeleton() {
    return (
        <Card className="flex flex-col">
            <div className="flex items-start justify-between p-6 pb-0">
                <Skeleton className="h-6 w-32"/>
                <Skeleton className="h-5 w-20 rounded-full"/>
            </div>
            <CardHeader className="pt-2">
                <Skeleton className="w-full aspect-video rounded-md"/>
            </CardHeader>
            <CardContent>
                <Skeleton className="h-4 w-full mb-2"/>
                <Skeleton className="h-4 w-3/4 mb-2"/>
                <Skeleton className="h-4 w-1/2 mb-4"/>
                <div className="flex gap-2">
                    <Skeleton className="h-6 w-16 rounded-full"/>
                    <Skeleton className="h-6 w-16 rounded-full"/>
                    <Skeleton className="h-6 w-16 rounded-full"/>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Skeleton className="h-4 w-24"/>
                <Skeleton className="h-4 w-16"/>
            </CardFooter>
        </Card>
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
        <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-4xl font-semibold text-secondary">{categorie}</h2>
                {totalPages > 1 && (
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setPage(p => p - 1)}
                            disabled={page === 1}
                        >
                            <ChevronLeft className="w-4 h-4"/>
                        </Button>
                        <span className="text-sm text-muted-foreground">{page} / {totalPages}</span>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setPage(p => p + 1)}
                            disabled={page === totalPages}
                        >
                            <ChevronRight className="w-4 h-4"/>
                        </Button>
                    </div>
                )}
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginated.map((projet) => (
                    <Card key={projet.id} className="flex flex-col">
                        <button className="flex-1 text-left" onClick={() => onSelectProject(projet.id)}>
                            <div className="flex items-start justify-between">
                                <CardTitle className="text-secondary">{projet.nom}</CardTitle>
                                {projet.date && (
                                    <span className="flex items-center gap-1 text-xs text-primary-foreground bg-primary rounded-full px-2 py-0.5 whitespace-nowrap m-5">
                                        <CalendarIcon className="w-3 h-3"/>
                                        {formatDate(projet.date, lang)}
                                    </span>
                                )}
                            </div>
                            <CardHeader className="pt-2">
                                <ProjectImage src={projet.imagePreview} alt={projet.nom}/>
                            </CardHeader>
                            <CardContent>
                                <p className="sm:h-[100px]">{projet.shortDescription}</p>
                                <div className="mt-2.5 sm:h-[56px]">
                                    Techs: {(projet.skills || []).map((skill: any) => (
                                    <span key={skill.id}
                                          className="inline-flex items-center rounded-full bg-primary px-2 py-1 text-sm font-medium text-primary-foreground mr-1">
                                        {skill.nom}
                                    </span>
                                ))}
                                </div>
                            </CardContent>
                        </button>
                        <CardFooter className="flex justify-between">
                            <button
                                onClick={() => onSelectProject(projet.id)}
                                className="text-foreground hover:underline flex items-center">
                                <ExternalLink className="w-4 h-4 mr-1"/>
                                {t("projects.seeProject")}
                            </button>
                            {projet.githubLink && (
                                <Link href={projet.githubLink}
                                      className="text-foreground hover:underline flex items-center"
                                      target="_blank">
                                    <Github className="w-4 h-4 mr-1"/>
                                    GitHub
                                </Link>
                            )}
                        </CardFooter>
                    </Card>
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

    if (loading) {
        return (
            <div className="container mx-auto py-12 px-4 md:px-6 lg:px-8">
                <section className="mb-12">
                    {[1, 2].map((cat) => (
                        <div key={cat} className="mb-8">
                            <Skeleton className="h-9 w-48 mb-4"/>
                            <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[1, 2, 3].map((i) => <ProjectCardSkeleton key={i}/>)}
                            </div>
                        </div>
                    ))}
                </section>
            </div>
        );
    }

    return (
        <>
            <div className="container mx-auto py-12 px-4 md:px-6 lg:px-8">
                <section className="mb-12">
                    {Object.entries(groupedProjects).map(([categorie, projets]) => (
                        <CategorySection
                            key={categorie}
                            categorie={categorie}
                            projets={projets}
                            t={t}
                            lang={lang}
                            onSelectProject={setSelectedProjectId}
                        />
                    ))}
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