"use client";

import Image from "next/image";
import Link from "next/link";
import {CalendarIcon, Github} from "lucide-react";
import {useEffect, useState} from "react";
import {Skeleton} from "@/components/ui/skeleton";
import {Modal} from "@/components/ui/modal";

function formatDate(date: string | undefined, lang: string): string {
    if (!date) return '';
    const [month, year] = date.split('/');
    if (!month || !year) return date;
    const monthsFr = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    const monthsEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const arr = lang === 'en' ? monthsEn : monthsFr;
    return `${arr[parseInt(month, 10) - 1] ?? month} ${year}`;
}

interface ProjectModalProps {
    projectId: string | null;
    onClose: () => void;
    lang: string;
    t: (key: string) => string;
}

export function ProjectModal({projectId, onClose, lang, t}: ProjectModalProps) {
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!projectId) {
            setProject(null);
            return;
        }
        setLoading(true);
        setProject(null);
        fetch(`/api/projects/${projectId}?lang=${lang}`)
            .then(r => r.ok ? r.json() : null)
            .then(data => {
                setProject(data);
                setLoading(false);
            });
    }, [projectId, lang]);

    return (
        <Modal open={!!projectId} onClose={onClose}>
            <div className="flex flex-col xl:flex-row gap-8 p-6 pt-4">
                {loading || !project ? (
                    <>
                        <div className="flex flex-col w-full xl:w-1/2 gap-4">
                            <Skeleton className="h-8 w-48"/>
                            <Skeleton className="w-full aspect-video rounded-md"/>
                        </div>
                        <div className="flex flex-col gap-6 flex-1">
                            <Skeleton className="h-6 w-32"/>
                            <Skeleton className="h-4 w-full"/>
                            <Skeleton className="h-4 w-3/4"/>
                            <Skeleton className="h-4 w-1/2"/>
                            <div className="flex gap-2">
                                <Skeleton className="h-6 w-16 rounded-full"/>
                                <Skeleton className="h-6 w-16 rounded-full"/>
                                <Skeleton className="h-6 w-16 rounded-full"/>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex flex-col w-full xl:w-1/2">
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
                            <Image
                                className="mx-auto rounded-md"
                                src={project.imagePreview}
                                alt={project.nom}
                                width={500}
                                height={500}
                            />
                        </div>
                        <div className="flex flex-col gap-6 flex-1">
                            <div className="flex flex-col gap-2">
                                <h2 className="text-xl font-bold text-secondary">{t("projectDetail.description")}</h2>
                                <p className="text-muted-foreground">{project.description}</p>
                            </div>
                            {project.githubLink && (
                                <div className="flex flex-col gap-2">
                                    <h2 className="text-xl font-bold text-secondary">{t("projectDetail.githubRepo")}</h2>
                                    <Link href={project.githubLink}
                                          className="flex items-center gap-2 text-foreground break-words"
                                          target="_blank">
                                        <Github className="w-5 h-5 shrink-0"/>
                                        <span className="break-all">{project.githubLink}</span>
                                    </Link>
                                </div>
                            )}
                            <div className="flex flex-col gap-2">
                                <h2 className="text-xl font-bold text-secondary">{t("projectDetail.technologies")}</h2>
                                <div className="flex flex-wrap gap-2">
                                    {(project.skills || []).map((skill: any) => (
                                        <span key={skill.id}
                                              className="inline-flex items-center rounded-full bg-primary px-2 py-1 text-sm font-medium text-primary-foreground">
                                            {skill.nom}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
}
