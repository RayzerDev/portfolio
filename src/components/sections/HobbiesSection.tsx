"use client";

import React, {useEffect, useState} from "react";
import {Code, Dumbbell, Gamepad, Guitar, Heart, LucideProps, Target} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";
import {useTranslation} from "@/hooks/useTranslation";

const iconMap: Record<string, React.FC<LucideProps>> = {
    Dumbbell,
    Guitar,
    Gamepad,
    Code,
    Target,
};

function HobbySkeleton() {
    return (
        <Card className="flex flex-col items-center p-6 rounded-2xl border-border/60">
            <Skeleton className="h-14 w-14 rounded-2xl mb-4"/>
            <Skeleton className="h-6 w-32 mb-3"/>
            <Skeleton className="h-4 w-full mb-1.5"/>
            <Skeleton className="h-4 w-4/5"/>
        </Card>
    );
}

export function HobbiesSection() {
    const {t, lang} = useTranslation();
    const [hobbies, setHobbies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        setLoading(true);
        fetch(`/api/hobbies?lang=${lang}`)
            .then(r => r.json())
            .then(data => {
                if (active) {
                    setHobbies(data);
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
        <section id="passions" className="scroll-mt-24 mb-16 md:mb-24">
            <div className="flex items-center gap-3 mb-8">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Heart className="h-5 w-5"/>
                </div>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-secondary">
                        {t("passions.title")}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        {t("passions.subtitle")}
                    </p>
                </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading
                    ? [1, 2, 3].map((i) => <HobbySkeleton key={i}/>)
                    : hobbies.map((hobby) => {
                        const Icon = iconMap[hobby.icon] ?? Code;
                        return (
                            <Card
                                key={hobby.id}
                                className="group flex flex-col rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-6 shadow-sm hover:shadow-xl hover:border-primary/40 hover:-translate-y-1 transition-all duration-300"
                            >
                                <CardHeader className="items-center text-center p-0 pb-4">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3 group-hover:scale-110 group-hover:bg-primary/15 transition-all duration-300">
                                        <Icon className="w-7 h-7"/>
                                    </div>
                                    <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                                        {hobby.nom}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0 text-center text-muted-foreground text-sm leading-relaxed">
                                    {hobby.description}
                                </CardContent>
                            </Card>
                        );
                    })
                }
            </div>
        </section>
    );
}
