"use client";

import Image from "next/image";
import Link from "next/link";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {CalendarIcon, ExternalLink, Github} from "lucide-react";
import {useEffect, useState} from "react";
import {useTranslation} from "@/hooks/useTranslation";

function formatDate(date: string | undefined, lang: string): string {
    if (!date) return '';
    const [month, year] = date.split('/');
    if (!month || !year) return date;
    const monthsFr = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const arr = lang === 'en' ? monthsEn : monthsFr;
    return `${arr[parseInt(month, 10) - 1] ?? month} ${year}`;
}

export default function Projects() {
    const {t, lang} = useTranslation();
    const [groupedProjects, setGroupedProjects] = useState<Record<string, any[]>>({});

    useEffect(() => {
        fetch(`/api/projects?lang=${lang}`).then(r => r.json()).then(setGroupedProjects);
    }, [lang]);

    return (
        <div className="container mx-auto py-12 px-4 md:px-6 lg:px-8">
            <section className="mb-12">
                {Object.keys(groupedProjects).map((categorie) => (
                    <div key={categorie} className="mb-8">
                        <h2 className="text-4xl font-semibold text-secondary mb-4">{categorie}</h2>
                        <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {groupedProjects[categorie].map((projet) => (
                                <Card key={projet.id} className="flex flex-col">
                                    <Link href={`/projects/${projet.id}`} className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <CardTitle className="text-secondary">{projet.nom}</CardTitle>
                                            {projet.date && (
                                                <span
                                                    className="flex items-center gap-1 text-xs text-primary-foreground bg-primary rounded-full px-2 py-0.5 whitespace-nowrap m-5">
                                                    <CalendarIcon className="w-3 h-3"/>
                                                    {formatDate(projet.date, lang)}
                                                </span>
                                            )}
                                        </div>
                                        <CardHeader className="pt-2">
                                            <Image src={`${projet.imagePreview}`} alt={projet.nom} width={500}
                                                   height={500}/>
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
                                    </Link>
                                    <CardFooter className="flex justify-between">
                                        <Link href={`/projects/${projet.id}`}
                                              className="text-foreground hover:underline flex items-center">
                                            <ExternalLink className="w-4 h-4 mr-1"/>
                                            {t("projects.seeProject")}
                                        </Link>
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
                ))}
            </section>
        </div>
    );
}