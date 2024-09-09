import { promises as fs } from 'fs';
import path from 'path';
import Image from "next/image";

export default async function Projects() {
    const filePath = path.join(process.cwd(), 'src/data/projects.json');

    const file = await fs.readFile(filePath, 'utf8');

    const projects = JSON.parse(file);

    return (
        <div>
            <h1>Projets</h1>
            <ul>
                {projects.map((projet: any) => (
                    <li key={projet.id}>
                        <Image src={"/" + projet.image} alt={projet.nom} width={50} height={50} />
                        <h2>{projet.nom}</h2>
                        <p>{projet.description}</p>
                        <p>Techs: {projet.techs}</p>
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
                        <p>Compétences: {projet.competenceIds.join(', ')}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
