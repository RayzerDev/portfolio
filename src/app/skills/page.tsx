"use client";

import Image from 'next/image';
import {useEffect, useState} from 'react';
import {useTranslation} from '@/hooks/useTranslation';
import {Skeleton} from '@/components/ui/skeleton';

function SkillSkeleton() {
    return (
        <div className="flex-col text-center">
            <Skeleton className="h-[100px] w-[100px] rounded-md" />
            <Skeleton className="h-4 w-16 mt-2 mx-auto" />
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
                <section className="flex-row mb-12">
                    {[1, 2, 3].map((cat) => (
                        <div key={cat} className="flex-col mb-8">
                            <Skeleton className="h-8 w-40 mb-4" />
                            <div className="flex flex-wrap gap-4 justify-center">
                                {[1, 2, 3, 4, 5, 6].map((i) => <SkillSkeleton key={i} />)}
                            </div>
                        </div>
                    ))}
                </section>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-12 px-4 md:px-6 lg:px-8">
            <section className="flex-row mb-12">
                {Object.entries(groupedSkills).map(([category, skills]) => (
                    <div key={category} className="flex-col mb-8">
                        <h2 className="text-3xl font-bold tracking-tight text-secondary mb-2">{category}</h2>
                        <div className="flex flex-wrap gap-4 justify-center">
                            {skills.map((skill: any) => (
                                <div key={skill.id} className="flex-col text-center">
                                    <Image
                                        src={`/${skill.image}`}
                                        alt={skill.nom}
                                        width={100}
                                        height={100}
                                    />
                                    <p className="mt-1">{skill.nom}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
}