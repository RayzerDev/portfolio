import { promises as fs } from 'fs';
import path from 'path';

interface Projet {
    id: string;
    nom: string;
    imagePreview: string;
    images: string[];
    category: string;
    description: string;
    shortDescription: string;
    competenceIds: string[];
    githubLink?: string;
    skills: Competence[];
}

interface Competence {
    id: string;
    nom: string;
    niveau: string;
    categorie: string;
    image: string;
}

interface Data {
    projects: Projet[];
    skills: Competence[];
    workExperiences: any[];
    degrees: any[];
}

class DataSingleton {
    private static instance: DataSingleton;
    private data: Data = {
        projects: [],
        skills: [],
        workExperiences: [],
        degrees: []
    };

    private constructor() {}

    public static getInstance(): DataSingleton {
        if (!DataSingleton.instance) {
            DataSingleton.instance = new DataSingleton();
        }
        return DataSingleton.instance;
    }

    private async loadData(fileName: string, key: keyof Data) {
        try {
            const filePath = path.join(process.cwd(), 'src', 'data', fileName);
            const fileContent = await fs.readFile(filePath, 'utf8');
            this.data[key] = JSON.parse(fileContent);
        } catch (error) {
            console.error(`Erreur de lecture du fichier JSON: ${fileName}`, error);
            this.data[key] = [];
        }
    }

    public async getProjectsData() {
        if (this.data.projects.length === 0) {
            await this.loadData('projects.json', 'projects');
        }
        for (const project of this.data.projects) {
            project.skills = await this.getSkillsByProjectId(project.competenceIds);
        }
        return this.data.projects;
    }

    public async getSkillsData() {
        if (this.data.skills.length === 0) {
            await this.loadData('skills.json', 'skills');
        }
        return this.data.skills;
    }

    public async groupProjectsByCategory() {
        const groupedProjects: { [category: string]: Projet[] } = {};

        (await this.getProjectsData()).forEach(project => {
            const { category } = project;

            if (!groupedProjects[category]) {
                groupedProjects[category] = [];
            }

            groupedProjects[category].push(project);
        });

        return groupedProjects;
    }

    public async groupSkillsByCategory() {
        const groupedSkills: { [categorie: string]: { id: string, nom: string, image:string }[] }  = {};

        (await this.getSkillsData()).forEach(skill => {
            const { id, nom, categorie, image } = skill;

            if (!groupedSkills[categorie]) {
                groupedSkills[categorie] = [];
            }

            groupedSkills[categorie].push({ id, nom, image });
        });

        return groupedSkills;
    }

    public async getWorkExperiencesData() {
        if (this.data.workExperiences.length === 0) {
            await this.loadData('work_experiences.json', 'workExperiences');
        }
        return this.data.workExperiences.sort((a, b) => this.parseDate(b.fin).getTime() - this.parseDate(a.fin).getTime());
    }

    public async getDegreesData() {
        if (this.data.degrees.length === 0) {
            await this.loadData('degrees.json', 'degrees');
        }
        return this.data.degrees.sort((a, b) => this.parseDate(b.fin).getTime() - this.parseDate(a.fin).getTime());
    }

    private async getSkillsByProjectId(skillIds: string[]) {
        if (this.data.skills.length === 0) {
            await this.getSkillsData();
        }

        return this.data.skills?.filter(c => skillIds.includes(c.id)) || [];
    }

    private parseDate(dateStr: string): Date {
        const [month, year] = dateStr.split('/').map(Number);
        return new Date(year, month - 1);
    }
}

export default DataSingleton;
