import Image from "next/image";
import Link from "next/link";
import DataSingleton from "@/utils/dataUtils";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, ExternalLink } from "lucide-react";

export default async function Projects() {
    const groupedProjects = await DataSingleton.getInstance().groupProjectsByCategory();

    return (
        <div className="container mx-auto py-12 px-4 md:px-6 lg:px-8">
            <section className="mb-12">
                {Object.keys(groupedProjects).map((categorie) => (
                    <div key={categorie} className="mb-8">
                        <h2 className="text-4xl font-semibold text-secondary mb-4">{categorie}</h2>
                        <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {groupedProjects[categorie].map((projet) => (
                                <Card key={projet.id}>
                                    <CardTitle className="text-secondary">{projet.nom}</CardTitle>
                                    <CardHeader>
                                        <Image src={`/portfolio${projet.imagePreview}`} alt={projet.nom} width={500} height={500} />
                                    </CardHeader>
                                    <CardContent>
                                        <p>{projet.shortDescription}</p>
                                        <div className="mt-2.5">Techs: {projet.skills.map((skill) => (
                                            <span key={skill.id}
                                                  className="inline-flex items-center rounded-full bg-primary px-2 py-1 text-sm font-medium text-primary-foreground mr-1">{skill.nom}</span>
                                        ))}</div>
                                    </CardContent>
                                    <CardFooter className="flex justify-between">
                                        <Link href={`/projects/${projet.id}`} className="text-foreground hover:underline flex items-center">
                                            <ExternalLink className="w-4 h-4 mr-1" />
                                            Voir le projet
                                        </Link>
                                        {projet.githubLink && (
                                            <Link href={projet.githubLink} className="text-foreground hover:underline flex items-center">
                                                <Github className="w-4 h-4 mr-1" />
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