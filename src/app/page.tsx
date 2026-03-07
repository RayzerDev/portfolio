"use client";

import {useEffect, useState} from "react";
import {Building, CalendarIcon, Code, Dumbbell, Gamepad, Guitar, LucideProps, MapPin, School} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {useTranslation} from "@/hooks/useTranslation";

const iconMap: Record<string, React.FC<LucideProps>> = {
    Dumbbell,
    Guitar,
    Gamepad,
    Code,
};

export default function Home() {
    const {t, lang} = useTranslation();
    const [workExperiences, setWorkExperiences] = useState<any[]>([]);
    const [degrees, setDegrees] = useState<any[]>([]);
    const [hobbies, setHobbies] = useState<any[]>([]);

    useEffect(() => {
        fetch(`/api/work-experiences?lang=${lang}`).then(r => r.json()).then(setWorkExperiences);
        fetch(`/api/degrees?lang=${lang}`).then(r => r.json()).then(setDegrees);
        fetch(`/api/hobbies?lang=${lang}`).then(r => r.json()).then(setHobbies);
    }, [lang]);

    return (
        <div className="container mx-auto py-12 px-4 md:px-6 lg:px-8">
            <section className="mb-12">
                <h1 className="text-6xl font-bold tracking-tight text-secondary">Louis Karamucki</h1>
                <p className="mt-4 max-w-[700px] text-muted-foreground md:text-xl">
                    {t("home.description")}
                </p>
            </section>
            <section className="mb-12">
                <h2 className="text-3xl font-bold tracking-tight text-secondary">{t("home.workExperiences")}</h2>
                <div className="mt-6 grid gap-6">
                    {workExperiences.map((experience => (
                            <div key={experience.id} className="rounded-md border bg-card p-4 shadow-sm border-border">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground">{experience.nom}</h3>
                                        <span
                                            className="inline-flex items-center rounded-full bg-primary px-2 py-1 text-sm font-medium text-primary-foreground">{experience.type}</span>
                                    </div>
                                    <div className="text-right whitespace-nowrap w-[150px]">
                                        <p className="text-sm text-primary-foreground flex items-center">
                                            <CalendarIcon
                                                className="mr-1 h-4 w-4 text-primary-foreground"/>
                                            {experience.debut} - {experience.fin}
                                        </p>
                                        <p className="text-sm text-primary-foreground flex items-center">
                                            <Building
                                                className="mr-1 h-4 w-4 text-primary-foreground"/>{experience.entreprise}
                                        </p>
                                        <p className="text-sm text-primary-foreground flex items-center">
                                            <MapPin
                                                className="mr-1 h-4 w-4 text-primary-foreground"/>{experience.ville}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
            <section className="mb-12">
                <h2 className="text-3xl font-bold tracking-tight text-secondary">{t("home.degrees")}</h2>
                <div className="mt-6 grid gap-6">
                    {degrees.map((degree => (
                            <div key={degree.id} className="rounded-md border bg-card p-4 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground">{degree.nom}</h3>
                                        <span
                                            className="inline-flex items-center rounded-full bg-primary px-2 py-1 text-sm font-medium text-primary-foreground">{degree.type}</span>
                                    </div>
                                    <div className="text-right whitespace-nowrap w-[150px]">
                                        <p className="text-sm text-primary-foreground flex items-center">
                                            <CalendarIcon className="mr-1 h-4 w-4 text-primary-foreground"/>
                                            {degree.debut} - {degree.fin}</p>
                                        <p className="text-sm text-primary-foreground flex items-center">
                                            <School
                                                className="mr-1 h-4 w-4 text-primary-foreground"/>{degree.ecole}
                                        </p>
                                        <p className="text-sm text-primary-foreground flex items-center">
                                            <MapPin className="mr-1 h-4 w-4 text-primary-foreground"/>
                                            {degree.ville}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
            <section className="mb-12">
                <h2 className="text-3xl font-bold tracking-tight text-secondary">{t("home.passions")}</h2>
                <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
                    {hobbies.map((hobby) => {
                        const Icon = iconMap[hobby.icon] ?? Code;
                        return (
                            <Card key={hobby.id}>
                                <CardTitle>{hobby.nom}</CardTitle>
                                <CardHeader><Icon className="w-12 h-12 m-auto text-secondary"/></CardHeader>
                                <CardContent>{hobby.description}</CardContent>
                            </Card>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
