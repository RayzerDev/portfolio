"use client";

import Image from 'next/image';
import {useEffect, useState} from 'react';
import {useTranslation} from '@/hooks/useTranslation';

export default function Skills() {
    const {lang} = useTranslation();
    const [groupedSkills, setGroupedSkills] = useState<Record<string, any[]>>({});

    useEffect(() => {
        fetch(`/api/skills?lang=${lang}`).then(r => r.json()).then(setGroupedSkills);
    }, [lang]);

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