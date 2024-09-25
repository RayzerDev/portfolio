import Image from "next/image";
import Link from "next/link";
import DataSingleton from "@/utils/dataUtils";
import { GithubIcon } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export async function generateStaticParams() {
    const dataSingleton = DataSingleton.getInstance();
    const projects = await dataSingleton.getProjectsData();

    return projects.map(project => ({
        id: project.id
    }));
}

export default async function Project({ params }: { params: { id: string } }) {
    const dataSingleton = DataSingleton.getInstance();
    const projects = await dataSingleton.getProjectsData();
    const project = projects.find(p => p.id === params.id);

    if (!project) {
        return <div>Projet non trouvé</div>;
    }

    return (
        <section className="container mx-auto py-12 px-4 md:px-6 lg:px-8">
            <div
                className="border bg-card text-card-foreground shadow-sm flex flex-col xl:flex-row gap-8 md:gap-12 px-4 md:px-6 pt-5 pb-5">
                <div className="flex flex-col w-full">
                    <h2 className="text-3xl font-bold tracking-tighter text-secondary mb-5">{project.nom}</h2>
                    <Carousel className="max-w-[75%] lg:max-w-[100%] m-auto lg:mx-auto"
                              opts={{
                                  loop: true,
                              }}>
                        <CarouselContent>
                            {project.images.map((image, index) => (
                                <CarouselItem key={index}
                                              className="lg:pl-14">
                                    <Image
                                        src={`/portfolio${image}`}
                                        width={500}
                                        height={500}
                                        alt={`Projet ${project.nom} - Image ${index + 1}`}
                                    />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="lg:ml-10"/>
                        <CarouselNext/>
                    </Carousel>
                </div>
                <div className="lg:ml-10 flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-xl font-bold text-secondary">Description</h2>
                        <p className="text-muted-foreground">
                            {project.description}
                        </p>
                    </div>
                    {project.githubLink && (
                        <div className="flex flex-col gap-2">
                            <h2 className="text-xl font-bold text-secondary">Dépôt GitHub</h2>
                            <Link href={project.githubLink}
                                  className="flex items-center gap-2 text-foreground break-words" prefetch={false}>
                                <GithubIcon className="w-5 h-5"/>
                                <span className="break-all">{project.githubLink}</span>
                            </Link>
                        </div>
                    )}
                    <div className="flex flex-col gap-2">
                        <h2 className="text-xl font-bold text-secondary">Technologies utilisées</h2>
                        <div className="flex flex-wrap gap-2">
                            {project.skills.map((skill) => (
                                <span key={skill.id}
                                      className="inline-flex items-center rounded-full bg-primary px-2 py-1 text-sm font-medium text-primary-foreground mr-1">{skill.nom}</span>
                            ))}
                        </div>
                    </div>
                    <Link href="/projects" className="mt-4 text-primary-foreground hover:underline">
                        &larr; Retour aux projets
                    </Link>
                </div>
            </div>
        </section>
    );
}