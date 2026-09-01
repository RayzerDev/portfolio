"use client";

import Link from "next/link";
import {CalendarIcon, Github} from "lucide-react";
import {useEffect, useState} from "react";
import {useTranslation} from "@/hooks/useTranslation";
import {ImageLightbox, ZoomableImage} from "@/components/ui/ImageLightbox";

function formatDate(date: string | undefined, lang: string): string {
    if (!date) return '';
    const [month, year] = date.split('/');
    if (!month || !year) return date;
    const monthsFr = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    const monthsEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const arr = lang === 'en' ? monthsEn : monthsFr;
    return `${arr[parseInt(month, 10) - 1] ?? month} ${year}`;
}

export default function Project({params}: { params: { id: string } }) {
    const {t, lang} = useTranslation();
    const [project, setProject] = useState<any>(null);
    const [notFound, setNotFound] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);

    useEffect(() => {
        fetch(`/api/projects/${params.id}?lang=${lang}`)
            .then(r => {
                if (r.status === 404) {
                    setNotFound(true);
                    return null;
                }
                return r.json();
            })
            .then(data => {
                if (data) setProject(data);
            });
    }, [params.id, lang]);

    if (notFound) {
        return <h1 className="text-secondary">{t("projectDetail.notFound")}</h1>;
    }

    if (!project) return null;

    return (
        <>
            <section className="container mx-auto py-12 px-4 md:px-6 lg:px-8">
                <div
                    className="border bg-card text-card-foreground shadow-sm flex flex-col xl:flex-row gap-8 md:gap-12 px-4 md:px-6 pt-5 pb-5 rounded-2xl">
                    <div className="flex flex-col w-full">
                        <div className="flex items-start gap-3 mb-5">
                            <h2 className="text-3xl font-bold tracking-tighter text-secondary">{project.nom}</h2>
                            {project.date && (
                                <span
                                    className="flex items-center gap-1 text-xs text-primary-foreground bg-primary rounded-full px-2 py-0.5 whitespace-nowrap my-auto ml-auto">
                                    <CalendarIcon className="w-3.5 h-3.5"/>
                                    {formatDate(project.date, lang)}
                                </span>
                            )}
                        </div>
                        <div className="rounded-xl overflow-hidden shadow-sm border border-border/60">
                            <ZoomableImage
                                src={project.imagePreview}
                                alt={project.nom}
                                width={500}
                                height={500}
                                className="mx-auto"
                                onClick={() => setLightboxOpen(true)}
                            />
                        </div>
                    </div>
                <div className="lg:ml-10 flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-xl font-bold text-secondary">{t("projectDetail.description")}</h2>
                        <p className="text-muted-foreground">{project.description}</p>
                    </div>
                    {project.githubLink && (
                        <div className="flex flex-col gap-2">
                            <h2 className="text-xl font-bold text-secondary">{t("projectDetail.githubRepo")}</h2>
                            <Link href={project.githubLink}
                                  className="flex items-center gap-2 text-foreground" prefetch={false}
                                  target="_blank" rel="noopener noreferrer">
                                <Github className="w-5 h-5"/>
                                {project.githubLink}
                            </Link>
                        </div>
                    )}
                    <div className="flex flex-col gap-2">
                        <h2 className="text-xl font-bold text-secondary">{t("projectDetail.technologies")}</h2>
                        <div className="flex flex-wrap gap-2">
                            {(project.skills || []).map((skill: any) => (
                                <span key={skill.id}
                                      className="inline-flex items-center rounded-full bg-primary px-2 py-1 text-sm font-medium text-primary-foreground mr-1">{skill.nom}</span>
                            ))}
                        </div>
                    </div>
                    <Link href="/projects" className="mt-4 text-primary-foreground hover:underline">
                        {t("projectDetail.backToProjects")}
                    </Link>
                </div>
            </div>
        </section>

        {lightboxOpen && project?.imagePreview && (
            <ImageLightbox
                src={project.imagePreview}
                alt={project.nom}
                onClose={() => setLightboxOpen(false)}
            />
        )}
    </>
    );
}
