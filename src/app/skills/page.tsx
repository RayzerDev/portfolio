"use client";

import Image from 'next/image';
import {useEffect, useState} from 'react';
import {useTranslation} from '@/hooks/useTranslation';
import {Skeleton} from '@/components/ui/skeleton';
import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {ChevronLeft, ChevronRight} from "lucide-react";

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
    const totalPages = Math.ceil(skills.length / SKILLS_PER_PAGE);
    const paginated = skills.slice((page - 1) * SKILLS_PER_PAGE, page * SKILLS_PER_PAGE);

    return (
        <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold tracking-tight text-secondary">{category}</h2>
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
                        <span className="text-sm text-muted-foreground whitespace-nowrap">{page} / {totalPages}</span>
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {paginated.map((skill: any) => (
                    <Card key={skill.id}
                          className="hover:shadow-md hover:scale-105 hover:border-primary transition-all duration-200 cursor-default">
                        <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full">
                            <div className="relative w-16 h-16 mb-3">
                                <Image
                                    src={`/${skill.image}`}
                                    alt={skill.nom}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <p className="font-medium text-sm">{skill.nom}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default function Skills() {
    const {lang} = useTranslation();
    const [groupedSkills, setGroupedSkills] = useState<Record<string, any[]>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/skills?lang=${lang}`)
            .then(r => r.json())
            .then(data => {
                setGroupedSkills(data);
                setLoading(false);
            });
    }, [lang]);

    if (loading) {
        return (
            <div className="container mx-auto py-12 px-4 md:px-6 lg:px-8">
                <section className="flex-col">
                    {[1, 2, 3].map((cat) => (
                        <div key={cat} className="mb-12">
                            <Skeleton className="h-9 w-48 mb-6"/>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {[1, 2, 3, 4, 5, 6].map((i) => <SkillSkeleton key={i}/>)}
                            </div>
                        </div>
                    ))}
                </section>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-12 px-4 md:px-6 lg:px-8">
            <section>
                {Object.entries(groupedSkills).map(([category, skills]) => (
                    <CategorySection key={category} category={category} skills={skills}/>
                ))}
            </section>
        </div>
    );
}