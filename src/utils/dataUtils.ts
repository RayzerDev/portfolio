import { promises as fs } from 'fs';
import path from 'path';

interface Projet {
    id: string;
    nom: string;
    image: string;
    categorie: string;
    description: string;
    techs: string;
    previewLink?: string;
    githubLink?: string;
    skills: String[];
}

interface Competence {
    id: string;
    nom: string;
    niveau: string;
}

interface Data {
    projects?: Projet[];
    skills?: Competence[];
    workExperiences?: any[];
    degrees?: any[];
}

class DataSingleton {
    private static instance: DataSingleton;
    private data: Data = {};

    private constructor() {}

    public static getInstance(): DataSingleton {
        if (!DataSingleton.instance) {
            DataSingleton.instance = new DataSingleton();
        }
        return DataSingleton.instance;
    }

    private async loadData(fileName: string, key: keyof Data) {
        try {
            const filePath = path.join(process.cwd(), 'public', 'data', fileName);
            const fileContent = await fs.readFile(filePath, 'utf8');
            this.data[key] = JSON.parse(fileContent);
        } catch (error) {
            console.error(`Erreur de lecture du fichier JSON: ${fileName}`, error);
        }
    }

    public async getProjectsData() {
        if (!this.data.projects) {
            await this.loadData('projects.json', 'projects');
        }
        return this.data.projects;
    }

    public async getSkillsData() {
        if (!this.data.skills) {
            await this.loadData('skills.json', 'skills');
        }
        return this.data.skills;
    }

    public async getWorkExperiencesData() {
        if (!this.data.workExperiences) {
            await this.loadData('work_experiences.json', 'workExperiences');
        }
        return this.data.workExperiences;
    }

    public async getDegreesData() {
        if (!this.data.degrees) {
            await this.loadData('degrees.json', 'degrees');
        }
        return this.data.degrees;
    }

    public async getCompetencesByProjectId(skillIds: string[]) {
        if (!this.data.skills) {
            await this.getSkillsData();
        }

        return this.data.skills?.filter(c => skillIds.includes(c.id)) || [];
    }
}

export default DataSingleton;
