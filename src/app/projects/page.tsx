import Image from "next/image";
import DataSingleton from "@/utils/dataUtils";

export default async function Projects() {

    const projects = await DataSingleton.getInstance().getProjectsData();

    return (
        <div>
            <h1>Projets</h1>
            <ul>
                {projects?.map((projet: any) => (
                    <li key={projet.id}>
                        <Image src={"/" + projet.image} alt={projet.nom} width={50} height={50} />
                        <h2>{projet.nom}</h2>
                        <p>{projet.description}</p>
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
                        <p>Techs: {projet.skills.map((skill: any) => skill.nom).join(', ')}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
