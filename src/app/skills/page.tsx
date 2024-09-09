import { promises as fs } from 'fs';
import path from 'path';
import Image from "next/image";

export default async function Projects() {
  const filePath = path.join(process.cwd(), 'src/data/skills.json');

  const file = await fs.readFile(filePath, 'utf8');

  const skills = JSON.parse(file);

  return (
      <div>
        <h1>skills</h1>
        <ul>
          {skills.map((skill: any) => (
              <li key={skill.id}>
                  <h2>{skill.nom}</h2>
                  <Image src={"/" + skill.image} alt={skill.nom} width={50} height={50}/>
                  <p>Techs: {skill.techs}</p>
                  {skill.previewLink && (
                      <a href={skill.previewLink} target="_blank" rel="noopener noreferrer">
                          Preview
                      </a>
                  )}
                  {skill.githubLink && (
                      <a href={skill.githubLink} target="_blank" rel="noopener noreferrer">
                          GitHub
                      </a>
                  )}
                  <p>Compétences: {skill.competenceIds.join(', ')}</p>
              </li>
          ))}
        </ul>
      </div>
  );
}
