import { promises as fs } from 'fs';
import path from 'path';
import Image from "next/image";
import DataSingleton from "@/utils/dataUtils";

export default async function Projects() {

  const skills = await DataSingleton.getInstance().getSkillsData();

  return (
      <div>
        <h1>skills</h1>
        <ul>
          {skills?.map((skill: any) => (
              <li key={skill.id}>
                  <Image src={"/" + skill.image} alt={skill.nom} width={50} height={50}/>
                  <p>{skill.nom}</p>
              </li>
          ))}
        </ul>
      </div>
  );
}
