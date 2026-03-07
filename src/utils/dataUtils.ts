import {promises as fs} from 'fs';
import path from 'path';

type Lang = 'fr' | 'en';

interface Projet {
    id: string;
    nom: string;
    imagePreview: string;
    category: string;
    category_en: string;
    description: string;
    description_en: string;
    shortDescription: string;
    shortDescription_en: string;
    competenceIds: string[];
    githubLink?: string;
    skills: Competence[];
}

interface Competence {
    id: string;
    nom: string;
    niveau: string;
    categorie: string;
    categorie_en: string;
    image: string;
}

interface Data {
    projects: Projet[];
    skills: Competence[];
    workExperiences: any[];
    degrees: any[];
    hobbies: any[];
}

class DataSingleton {
    private static instance: DataSingleton;
    private data: Data = {
        projects: [],
        skills: [],
        workExperiences: [],
        degrees: [],
        hobbies: []
    };

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

    public async getProjectsData(lang: Lang = 'fr') {
        if (this.data.projects.length === 0) {
            await this.loadData('projects.json', 'projects');
        }
        for (const project of this.data.projects) {
            project.skills = await this.getSkillsByProjectId(project.competenceIds);
            if (!project.skills) project.skills = [];
        }
        if (lang === 'en') {
            return this.data.projects.map(p => ({
                ...p,
                skills: p.skills || [],
                nom: (p as any).nom_en || p.nom,
                category: p.category_en || p.category,
                description: p.description_en || p.description,
                shortDescription: p.shortDescription_en || p.shortDescription,
            }));
        }
        return this.data.projects;
    }

    public async getSkillsData() {
        if (this.data.skills.length === 0) {
            await this.loadData('skills.json', 'skills');
        }
        return this.data.skills;
    }

    public async groupProjectsByCategory(lang: Lang = 'fr') {
        const groupedProjects: { [category: string]: Projet[] } = {};

        (await this.getProjectsData(lang)).forEach(project => {
            const category = lang === 'en' ? (project.category_en || project.category) : project.category;

            if (!groupedProjects[category]) {
                groupedProjects[category] = [];
            }

            groupedProjects[category].push(project);
        });

        return groupedProjects;
    }

    public async groupSkillsByCategory(lang: Lang = 'fr') {
        const groupedSkills: { [categorie: string]: { id: string, nom: string, image: string }[] } = {};

        (await this.getSkillsData()).forEach(skill => {
            const {id, nom, image} = skill;
            const categorie = lang === 'en' ? (skill.categorie_en || skill.categorie) : skill.categorie;

            if (!groupedSkills[categorie]) {
                groupedSkills[categorie] = [];
            }

            groupedSkills[categorie].push({id, nom, image});
        });

        return groupedSkills;
    }

    public async getWorkExperiencesData(lang: Lang = 'fr') {
        if (this.data.workExperiences.length === 0) {
            await this.loadData('work_experiences.json', 'workExperiences');
        }
        const sorted = this.data.workExperiences.sort((a, b) => this.parseDate(b.fin).getTime() - this.parseDate(a.fin).getTime());
        if (lang === 'en') {
            return sorted.map((e: any) => ({
                ...e,
                nom: e.nom_en || e.nom,
                type: e.type_en || e.type,
            }));
        }
        return sorted;
    }

    public async getDegreesData(lang: Lang = 'fr') {
        if (this.data.degrees.length === 0) {
            await this.loadData('degrees.json', 'degrees');
        }
        const sorted = this.data.degrees.sort((a, b) => this.parseDate(b.fin).getTime() - this.parseDate(a.fin).getTime());
        if (lang === 'en') {
            return sorted.map((d: any) => ({
                ...d,
                nom: d.nom_en || d.nom,
                type: d.type_en || d.type,
            }));
        }
        return sorted;
    }

    public async getHobbiesData(lang: Lang = 'fr') {
        if (this.data.hobbies.length === 0) {
            await this.loadData('hobbies.json', 'hobbies');
        }
        if (lang === 'en') {
            return this.data.hobbies.map((h: any) => ({
                ...h,
                nom: h.nom_en || h.nom,
                description: h.description_en || h.description,
            }));
        }
        return this.data.hobbies;
    }

    private async getSkillsByProjectId(skillIds: string[]) {
        if (this.data.skills.length === 0) {
            await this.getSkillsData();
        }
        return this.data.skills?.filter(c => skillIds?.includes(c.id)) || [];
    }

    private parseDate(dateStr: string): Date {
        const [month, year] = dateStr.split('/').map(Number);
        return new Date(year, month - 1);
    }
}

export default DataSingleton;
