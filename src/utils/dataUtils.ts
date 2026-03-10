import {promises as fs} from 'fs';
import path from 'path';

type Lang = 'fr' | 'en';

interface Projet {
    id: string;
    nom: string;
    nom_en?: string;
    imagePreview: string;
    category: string;
    category_en: string;
    description: string;
    description_en: string;
    shortDescription: string;
    shortDescription_en: string;
    competenceIds: string[];
    githubLink?: string;
    date?: string;
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

interface RawData {
    projects: any[];
    skills: Competence[];
    workExperiences: any[];
    degrees: any[];
    hobbies: any[];
}

class DataSingleton {
    private static instance: DataSingleton;

    private raw: RawData = {projects: [], skills: [], workExperiences: [], degrees: [], hobbies: []};

    // One promise per file — prevents duplicate concurrent reads
    private loaders = new Map<keyof RawData, Promise<void>>();

    // Projects require a join with skills; resolved and sorted once
    private resolvedProjects: Projet[] | null = null;
    private resolveProjectsPromise: Promise<void> | null = null;

    public static getInstance(): DataSingleton {
        if (!DataSingleton.instance) {
            DataSingleton.instance = new DataSingleton();
        }
        return DataSingleton.instance;
    }

    private load(fileName: string, key: keyof RawData): Promise<void> {
        if (!this.loaders.has(key)) {
            const p = fs
                .readFile(path.join(process.cwd(), 'src', 'data', fileName), 'utf8')
                .then(content => {
                    this.raw[key] = JSON.parse(content);
                })
                .catch(err => {
                    console.error(`Error reading ${fileName}:`, err);
                    this.raw[key] = [];
                });
            this.loaders.set(key, p);
        }
        return this.loaders.get(key)!;
    }

    private parseDate(dateStr: string | undefined): Date {
        if (!dateStr) return new Date(0);
        const [month, year] = dateStr.split('/').map(Number);
        if (!month || !year || isNaN(month) || isNaN(year)) return new Date(0);
        return new Date(year, month - 1);
    }

    // Loads projects + skills in parallel, joins via Map (O(1)), sorts by date desc — runs once
    private async ensureProjects(): Promise<Projet[]> {
        if (this.resolvedProjects) return this.resolvedProjects;

        if (!this.resolveProjectsPromise) {
            this.resolveProjectsPromise = Promise.all([
                this.load('projects.json', 'projects'),
                this.load('skills.json', 'skills'),
            ]).then(() => {
                const skillMap = new Map(this.raw.skills.map(s => [s.id, s]));
                this.resolvedProjects = this.raw.projects
                    .map(p => ({
                        ...p,
                        skills: ((p.competenceIds as string[]) || [])
                            .map(id => skillMap.get(id))
                            .filter((s): s is Competence => s !== undefined),
                    }))
                    .sort((a, b) => this.parseDate(b.date).getTime() - this.parseDate(a.date).getTime());
            });
        }

        await this.resolveProjectsPromise;
        return this.resolvedProjects!;
    }

    public async getProjectsData(lang: Lang = 'fr'): Promise<Projet[]> {
        const projects = await this.ensureProjects();
        if (lang === 'en') {
            return projects.map(p => ({
                ...p,
                nom: p.nom_en || p.nom,
                category: p.category_en || p.category,
                description: p.description_en || p.description,
                shortDescription: p.shortDescription_en || p.shortDescription,
            }));
        }
        return projects;
    }

    public async getSkillsData(): Promise<Competence[]> {
        await this.load('skills.json', 'skills');
        return this.raw.skills;
    }

    public async groupProjectsByCategory(lang: Lang = 'fr'): Promise<Record<string, Projet[]>> {
        const projects = await this.getProjectsData(lang);
        return projects.reduce<Record<string, Projet[]>>((acc, project) => {
            (acc[project.category] ??= []).push(project);
            return acc;
        }, {});
    }

    public async groupSkillsByCategory(lang: Lang = 'fr'): Promise<Record<string, {
        id: string;
        nom: string;
        image: string
    }[]>> {
        await this.load('skills.json', 'skills');
        return this.raw.skills.reduce<Record<string, { id: string; nom: string; image: string }[]>>((acc, skill) => {
            const cat = lang === 'en' ? (skill.categorie_en || skill.categorie) : skill.categorie;
            (acc[cat] ??= []).push({id: skill.id, nom: skill.nom, image: skill.image});
            return acc;
        }, {});
    }

    public async getWorkExperiencesData(lang: Lang = 'fr'): Promise<any[]> {
        await this.load('work_experiences.json', 'workExperiences');
        const sorted = [...this.raw.workExperiences].sort(
            (a, b) => this.parseDate(b.fin).getTime() - this.parseDate(a.fin).getTime()
        );
        if (lang === 'en') {
            return sorted.map(e => ({...e, nom: e.nom_en || e.nom, type: e.type_en || e.type}));
        }
        return sorted;
    }

    public async getDegreesData(lang: Lang = 'fr'): Promise<any[]> {
        await this.load('degrees.json', 'degrees');
        const sorted = [...this.raw.degrees].sort(
            (a, b) => this.parseDate(b.fin).getTime() - this.parseDate(a.fin).getTime()
        );
        if (lang === 'en') {
            return sorted.map(d => ({...d, nom: d.nom_en || d.nom, type: d.type_en || d.type}));
        }
        return sorted;
    }

    public async getHobbiesData(lang: Lang = 'fr'): Promise<any[]> {
        await this.load('hobbies.json', 'hobbies');
        if (lang === 'en') {
            return this.raw.hobbies.map(h => ({
                ...h,
                nom: h.nom_en || h.nom,
                description: h.description_en || h.description,
            }));
        }
        return this.raw.hobbies;
    }
}

export default DataSingleton;
