"use client";

import Image from "next/image";
import {CalendarIcon, ExternalLink, Github, Tag} from "lucide-react";
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

function ModalSkeleton() {
    return (
        <div className="flex flex-col sm:flex-row gap-0">
            <Skeleton className="w-full sm:w-1/2 aspect-video rounded-none rounded-tl-2xl sm:rounded-bl-2xl rounded-tr-2xl sm:rounded-tr-none shrink-0"/>
            <div className="flex flex-col gap-4 p-6 flex-1">
                <div className="flex gap-2">
                    <Skeleton className="h-5 w-24 rounded-full"/>
                    <Skeleton className="h-5 w-20 rounded-full"/>
                </div>
                <Skeleton className="h-8 w-3/4"/>
                <Skeleton className="h-4 w-full"/>
                <Skeleton className="h-4 w-full"/>
                <Skeleton className="h-4 w-2/3"/>
                <Skeleton className="h-10 w-48 rounded-lg mt-2"/>
                <div className="flex gap-2 flex-wrap mt-2">
                    <Skeleton className="h-6 w-16 rounded-full"/>
                    <Skeleton className="h-6 w-20 rounded-full"/>
                    <Skeleton className="h-6 w-14 rounded-full"/>
                </div>
            </div>
        </div>
    );
}

export function ProjectModal({projectId, onClose, lang, t}: ProjectModalProps) {
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [imgLoaded, setImgLoaded] = useState(false);

    useEffect(() => {
        if (!projectId) {
            setProject(null);
            return;
        }
        setLoading(true);
        setProject(null);
        setImgLoaded(false);
        fetch(`/api/projects/${projectId}?lang=${lang}`)
            .then(r => r.ok ? r.json() : null)
            .then(data => {
                setProject(data);
                setLoading(false);
            });
    }, [projectId, lang]);

    return (
        <Modal open={!!projectId} onClose={onClose}>
            {loading || !project ? (
                <ModalSkeleton/>
            ) : (
                <div className="flex flex-col sm:flex-row">
                    {/* Image */}
                    <div className="relative w-full sm:w-[45%] shrink-0 aspect-video sm:aspect-auto sm:min-h-[320px] bg-muted overflow-hidden rounded-t-2xl sm:rounded-tl-2xl sm:rounded-bl-2xl sm:rounded-tr-none">
                        {!imgLoaded && <Skeleton className="absolute inset-0 w-full h-full rounded-none"/>}
                        <Image
                            src={project.imagePreview}
                            alt={project.nom}
                            fill
                            className={`object-cover transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
                            onLoad={() => setImgLoaded(true)}
                        />
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-5 p-6 sm:p-7 flex-1 min-w-0">
                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-2">
                            {project.category && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-accent text-accent-foreground px-2.5 py-0.5 text-xs font-medium">
                                    <Tag className="w-3 h-3"/>
                                    {project.category}
                                </span>
                            )}
                            {project.date && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-medium">
                                    <CalendarIcon className="w-3 h-3"/>
                                    {formatDate(project.date, lang)}
                                </span>
                            )}
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-secondary leading-tight pr-8">
                            {project.nom}
                        </h2>

                        {/* Description */}
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                            {project.description}
                        </p>

                        {/* GitHub */}
                        {project.githubLink && (
                            <a
                                href={project.githubLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2.5 w-full rounded-lg border border-border/70 bg-muted/60 hover:bg-muted px-4 py-2.5 text-sm font-medium text-foreground hover:text-primary transition-colors"
                            >
                                <Github className="w-4 h-4 shrink-0"/>
                                <span className="flex-1 truncate">{project.githubLink.replace('https://', '')}</span>
                                <ExternalLink className="w-3.5 h-3.5 shrink-0 text-muted-foreground"/>
                            </a>
                        )}

                        {/* Technologies */}
                        {(project.skills || []).length > 0 && (
                            <div className="flex flex-col gap-2">
                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    {t("projectDetail.technologies")}
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                    {(project.skills || []).map((skill: any) => (
                                        <span
                                            key={skill.id}
                                            className="inline-flex items-center rounded-full border border-border/60 bg-background px-2.5 py-0.5 text-xs font-medium text-foreground"
                                        >
                                            {skill.nom}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </Modal>
    );
}
