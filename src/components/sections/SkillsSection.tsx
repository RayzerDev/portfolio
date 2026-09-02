"use client";

import Image from 'next/image';
import {useEffect, useState} from 'react';
import {useTranslation} from '@/hooks/useTranslation';
import {Skeleton} from '@/components/ui/skeleton';
import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {ChevronLeft, ChevronRight, Wrench} from "lucide-react";

const SKILLS_PER_PAGE = 6;

function SkillSkeleton() {
    return (
        <Card className="flex flex-col items-center p-4">
            <Skeleton className="h-[80px] w-[80px] rounded-md mb-2"/>
            <Skeleton className="h-4 w-20"/>
        </Card>
    );
}

function CategorySection({category, skills}: { category: string; skills: any[] }) {
    const [page, setPage] = useState(1);
    const [direction, setDirection] = useState<'right' | 'left'>('right');
    const totalPages = Math.ceil(skills.length / SKILLS_PER_PAGE);
    const paginated = skills.slice((page - 1) * SKILLS_PER_PAGE, page * SKILLS_PER_PAGE);

    const handlePrev = () => {
        if (page > 1) {
            setDirection('left');
            setPage(p => p - 1);
        }
    };

    const handleNext = () => {
        if (page < totalPages) {
            setDirection('right');
            setPage(p => p + 1);
        }
    };

    return (
        <div className="mb-10">
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-2xl font-bold tracking-tight text-secondary">{category}</h3>
                {totalPages > 1 && (
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={handlePrev}
                            disabled={page === 1}
                            aria-label="Previous page"
                        >
                            <ChevronLeft className="w-4 h-4"/>
                        </Button>
                        <span className="text-sm font-medium text-muted-foreground whitespace-nowrap tabular-nums">{page} / {totalPages}</span>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={handleNext}
                            disabled={page === totalPages}
                            aria-label="Next page"
                        >
                            <ChevronRight className="w-4 h-4"/>
                        </Button>
                    </div>
                )}
            </div>
            <div className="overflow-hidden p-1.5 -m-1.5">
                <div
                    key={`${category}-page-${page}`}
                    className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 ${
                        direction === 'right' ? 'animate-skill-slide-right' : 'animate-skill-slide-left'
                    }`}
                >
                    {paginated.map((skill: any) => (
                        <Card key={skill.id}
                              className="group rounded-xl border border-border/70 bg-card/80 backdrop-blur-sm hover:border-primary hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-200 cursor-default">
                            <CardContent className="flex flex-col items-center justify-center p-5 text-center h-full">
                                <div className="relative w-14 h-14 mb-3 transition-transform duration-200 group-hover:scale-110">
                                    <Image
                                        src={`/${skill.image}`}
                                        alt={skill.nom}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <p className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">{skill.nom}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function SkillsSection() {
    const {t, lang} = useTranslation();
    const [groupedSkills, setGroupedSkills] = useState<Record<string, any[]>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        setLoading(true);
        fetch(`/api/skills?lang=${lang}`)
            .then(r => r.json())
            .then(data => {
                if (active) {
                    setGroupedSkills(data);
                    setLoading(false);
                }
            })
            .catch(() => {
                if (active) setLoading(false);
            });
        return () => {
            active = false;
        };
    }, [lang]);

    return (
        <section id="skills" className="scroll-mt-24 mb-16 md:mb-24">
            <div className="flex items-center gap-3 mb-8">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Wrench className="h-5 w-5"/>
                </div>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-secondary">
                        {t("nav.skills")}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        {lang === 'fr' ? 'Technologies, frameworks et outils maîtrisés' : 'Technologies, frameworks and tools'}
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col gap-8">
                    {[1, 2, 3].map((cat) => (
                        <div key={cat} className="mb-6">
                            <Skeleton className="h-8 w-44 mb-5"/>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {[1, 2, 3, 4, 5, 6].map((i) => <SkillSkeleton key={i}/>)}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    {Object.entries(groupedSkills).map(([category, skills]) => (
                        <CategorySection key={category} category={category} skills={skills}/>
                    ))}
                </div>
            )}
        </section>
    );
}
