import Image from "next/image";
import DataSingleton from "@/utils/dataUtils";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

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
        <Card>
          <CardHeader>
            <Image src={`/portfolio${project.image}`}  alt={project.nom} width={500} height={500} />
            <h2>{project.nom}</h2>
          </CardHeader>
          <CardContent>
            <p>{project.description}</p>
            <p>Techs: {project.skills?.map((skill: any) => skill.nom).join(', ')}</p>
          </CardContent>
          <CardFooter>
            {project.previewLink && (
                <a href={project.previewLink} target="_blank" rel="noopener noreferrer">
                  Preview
                </a>
            )}
            {project.githubLink && (
                <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
            )}
          </CardFooter>
        </Card>
      </div>
  );
}