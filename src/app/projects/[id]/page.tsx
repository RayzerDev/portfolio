import Image from "next/image";
import Link from "next/link";
import DataSingleton from "@/utils/dataUtils";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, ExternalLink } from "lucide-react";

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
    return <div>Project not found</div>;
  }

  return (
      <div className="container mx-auto py-12 px-4 md:px-6 lg:px-8">
        <Link href="/projects" className="text-foreground hover:underline mb-4 inline-block">
          &larr; Retour aux projets
        </Link>
        <Card>
          <CardHeader>
            <Image src={`/portfolio${project.image}`} alt={project.nom} width={500} height={500} />
            <CardTitle>{project.nom}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{project.description}</p>
            <div className="mt-2.5">Techs: {project.skills?.map((skill: any) => (
                <span key={skill.id} className="inline-flex items-center rounded-full bg-primary px-2 py-1 text-sm font-medium text-primary-foreground mr-1">
              {skill.nom}
            </span>
            ))}</div>
          </CardContent>
          <CardFooter className="flex justify-between">
            {project.githubLink && (
                <Link href={project.githubLink} target="_blank" rel="noopener noreferrer" className="text-foreground hover:underline flex items-center">
                  <Github className="w-4 h-4 mr-1" />
                  GitHub
                </Link>
            )}
          </CardFooter>
        </Card>
      </div>
  );
}