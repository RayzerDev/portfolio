import Image from "next/image";
import DataSingleton from "@/utils/dataUtils";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";

export default async function Projects() {

    const projects = await DataSingleton.getInstance().getProjectsData();

    return (
        <div className="container mx-auto py-12 px-4 md:px-6 lg:px-8">
            <section className="mb-12">
                <h1 className="text-5xl font-bold tracking-tight text-foreground">Projets</h1>
                {projects?.map((projet: any) => (
                    <Card key={projet.id}>
                        <CardHeader>
                            <Image src={projet.image} alt={projet.nom} width={500} height={500}/>
                            <h2>{projet.nom}</h2>
                        </CardHeader>
                        <CardContent>
                            <p>{projet.description}</p>
                            <p>Techs: {projet.skills.map((skill: any) => skill.nom).join(', ')}</p>
                        </CardContent>
                        <CardFooter>
                            {projet.previewLink && (
                                <a href={projet.previewLink} target="_blank" rel="noopener noreferrer">
                                    Preview
                                </a>
                            )}
                            {projet.githubLink && (
                                <a href={projet.githubLink} target="_blank" rel="noopener noreferrer">
                                    GitHub
                                </a>
                            )}
                        </CardFooter>
                    </Card>
                ))}
            </section>
        </div>
    );
}
