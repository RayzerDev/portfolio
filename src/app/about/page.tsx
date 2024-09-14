import DataSingleton from "@/utils/dataUtils";
import {Building, CalendarIcon, Code, Dumbbell, Gamepad, Guitar, LocateIcon, MapPin, School} from "lucide-react";

export default async function About() {

    const dataSingleton = DataSingleton.getInstance();
    const workExperiences = await dataSingleton.getWorkExperiencesData();
    const degrees = await dataSingleton.getDegreesData();

    return (
        <div className="container mx-auto py-12 px-4 md:px-6 lg:px-8">
            <section className="mb-12">
                <h1 className="text-5xl font-bold tracking-tight text-foreground">A propos</h1>
                <p className="mt-4 max-w-[700px] text-muted-foreground md:text-xl">
                    Je suis Louis KARAMUCKI. Je suis développeur logiciel chez Lenrek Informatique en alternance,
                    tout en suivant un BUT Informatique à Lens jusqu'en 2025.
                </p>
            </section>
            <section className="mb-12">
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Expériences Professionnelles</h2>
                <div className="mt-6 grid gap-6">
                    {workExperiences.map((experience => (
                            <div className="rounded-md border bg-card p-4 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground">{experience.nom}</h3>
                                        <span
                                            className="inline-flex items-center rounded-full bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">{experience.type}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-muted-foreground flex items-center">
                                            <CalendarIcon
                                                className="mr-1 h-4 w-4 text-muted-foreground"/>{experience.debut} - {experience.fin}
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
                                <p className="mt-2 text-muted-foreground">
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </section>
            <section className="mb-12">
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Diplômes</h2>
                <div className="mt-6 grid gap-6">
                    {degrees.map((degree => (
                            <div className="rounded-md border bg-card p-4 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground">{degree.nom}</h3>
                                        <span
                                            className="inline-flex items-center rounded-full bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">{degree.type}</span>
                                    </div>
                                    <div className="text-right">
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
                                <p className="mt-2 text-muted-foreground">
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </section>
            <section className="mb-12">
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Passions</h2>
                <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="rounded-md border bg-card p-4 shadow-sm">
                        <h3 className="text-lg font-semibold text-foreground">Sport</h3>
                        <Dumbbell
                            className="w-2/6 h-2/6 m-auto"/>
                        <p className="mt-2 text-muted-foreground">
                            J'aime tout type de sports. Je pratique de la musculation, le foot, et le Jiu-Jitsu.
                            J'ai déjà réalisé 2 compétitions régionales.
                        </p>
                    </div>
                    <div className="rounded-md border bg-card p-4 shadow-sm">
                        <h3 className="text-lg font-semibold text-foreground">Guitare</h3>
                        <Guitar
                            className="w-2/6 h-2/6 m-auto"/>
                        <p className="mt-2 text-muted-foreground">
                            Je fais de la guitare depuis mes 4 ans. Les Red Hot Chili Peppers m'ont beaucoup
                            influencé, notamment John Frusciante. J'ai pu jouer dans 2 concerts.
                        </p>
                    </div>
                    <div className="rounded-md border bg-card p-4 shadow-sm">
                        <h3 className="text-lg font-semibold text-foreground">Jeux</h3>
                        <Gamepad
                            className="w-2/6 h-2/6 m-auto"/>
                        <p className="mt-2 text-muted-foreground">
                            Je joue aussi à des jeux comme Rainbow Six Siege, Ready or Not et FIFA.
                        </p>
                    </div>
                    <div className="rounded-md border bg-card p-4 shadow-sm">
                        <h3 className="text-lg font-semibold text-foreground">Jeux</h3>
                        <Code
                            className="w-2/6 h-2/6 m-auto"/>
                        <p className="mt-2 text-muted-foreground">
                            J'ai des projets de développement pendant mon temps libre pour découvrir un peu les
                            différents langages de programmations que vous retrouverez sur ce portfolio.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}