import DataSingleton from "@/utils/dataUtils";
import {Building, CalendarIcon, Code, Dumbbell, Gamepad, Guitar, MapPin, School} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

export default async function Home() {
    const dataSingleton = DataSingleton.getInstance();
    const workExperiences = await dataSingleton.getWorkExperiencesData();
    const degrees = await dataSingleton.getDegreesData();

    return (
        <div className="container mx-auto py-12 px-4 md:px-6 lg:px-8">
            <section className="mb-12">
                <h1 className="text-6xl font-bold tracking-tight text-secondary">Louis Karamucki</h1>
                <p className="mt-4 max-w-[700px] text-muted-foreground md:text-xl">
                    En 3ème année de BUT Informatique.
                    Découvrez mon parcours, mes compétences ainsi que mes projets.
                </p>
            </section>
            <section className="mb-12">
                <h2 className="text-3xl font-bold tracking-tight text-secondary">Expériences Professionnelles</h2>
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
                                        <p className="text-sm text-muted-foreground flex items-center">
                                            <CalendarIcon
                                                className="mr-1 h-4 w-4 text-muted-foreground"/>
                                            {experience.debut} - {experience.fin}
                                        </p>
                                        <p className="text-sm text-muted-foreground flex items-center">
                                            <Building
                                                className="mr-1 h-4 w-4 text-muted-foreground"/>{experience.entreprise}
                                        </p>
                                        <p className="text-sm text-muted-foreground flex items-center">
                                            <MapPin
                                                className="mr-1 h-4 w-4 text-muted-foreground"/>{experience.ville}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
            <section className="mb-12">
                <h2 className="text-3xl font-bold tracking-tight text-secondary">Diplômes</h2>
                <div className="mt-6 grid gap-6">
                    {degrees.map((degree => (
                            <div key={degree.id} className="rounded-md border bg-card p-4 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-semibold text-foreground">{degree.nom}</h3>
                                        <span
                                            className="inline-flex items-center rounded-full bg-primary px-2 py-1 text-sm font-medium text-primary-foreground">{degree.type}</span>
                                    </div>
                                    <div className="text-right whitespace-nowrap w-[150px]">
                                        <p className="text-sm text-muted-foreground flex items-center">
                                            <CalendarIcon className="mr-1 h-4 w-4 text-muted-foreground"/>
                                            {degree.debut} - {degree.fin}</p>
                                        <p className="text-sm text-muted-foreground flex items-center">
                                            <School
                                                className="mr-1 h-4 w-4 text-muted-foreground"/>{degree.ecole}
                                        </p>
                                        <p className="text-sm text-muted-foreground flex items-center">
                                            <MapPin className="mr-1 h-4 w-4 text-muted-foreground"/>
                                            {degree.ville}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
            <section className="mb-12">
                <h2 className="text-3xl font-bold tracking-tight text-secondary">Passions</h2>
                <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
                    <Card>
                        <CardTitle>Sport</CardTitle>
                        <CardHeader><Dumbbell className="w-12 h-12 m-auto text-secondary"/></CardHeader>
                        <CardContent>
                            J&apos;aime tout type de sports. Je pratique de la musculation, le foot, et le Jiu-Jitsu.
                            J&apos;ai déjà réalisé 2 compétitions régionales.
                        </CardContent>
                    </Card>
                    <Card>
                        <CardTitle>Guitare</CardTitle>
                        <CardHeader><Guitar className="w-12 h-12 m-auto text-secondary"/></CardHeader>
                        <CardContent>
                            Je fais de la guitare depuis mes 4 ans. Les Red Hot Chili Peppers m&apos;ont beaucoup
                            influencé, notamment John Frusciante. J&apos;ai pu jouer dans 2 concerts.
                        </CardContent>
                    </Card>
                    <Card>
                        <CardTitle>Jeux</CardTitle>
                        <CardHeader>
                            <Gamepad className="w-12 h-12 m-auto text-secondary"/>
                        </CardHeader>
                        <CardContent>
                            Je joue aussi à des jeux comme Rainbow Six Siege, Ready or Not et FIFA.
                        </CardContent>
                    </Card>
                    <Card>
                        <CardTitle>Informatique</CardTitle>
                        <CardHeader>
                            <Code className="w-12 h-12 m-auto text-secondary"/>
                        </CardHeader>
                        <CardContent>
                            J&apos;ai des projets de développement pendant mon temps libre pour découvrir un peu les
                            différents langages de programmations que vous retrouverez sur ce portfolio.
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    );
}
