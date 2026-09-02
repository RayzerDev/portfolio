import React from 'react';
import {Document, Link, Page, StyleSheet, Text, View} from '@react-pdf/renderer';

interface WorkExperience {
    id: string;
    nom: string;
    type: string;
    entreprise: string;
    ville: string;
    debut: string;
    fin: string;
    description?: string;
}

interface Degree {
    id: string;
    nom: string;
    type: string;
    ecole: string;
    ville: string;
    debut: string;
    fin: string;
    description?: string;
}

interface Hobby {
    id: string;
    nom: string;
    description: string;
}

interface Project {
    id: string;
    nom: string;
    shortDescription: string;
    category: string;
    githubLink?: string;
    date?: string;
    skills?: { id: string; nom: string }[];
}

interface GroupedSkills {
    [category: string]: { id: string; nom: string; image: string }[];
}

export interface CvAtsDocumentProps {
    lang: 'fr' | 'en';
    workExperiences: WorkExperience[];
    degrees: Degree[];
    groupedSkills: GroupedSkills;
    hobbies: Hobby[];
    personalProjects: Project[];
    schoolProjects: Project[];
    portfolioUrl?: string;
    customTitle?: string;
    customDescription?: string;
}

// ── ATS Clean Monochrome & Navy Palette ──────────────────────────────────────
const C = {
    text: '#111827',
    muted: '#374151',
    accent: '#0f172a',
    line: '#94a3b8',
    link: '#1d4ed8',
};

const styles = StyleSheet.create({
    page: {
        paddingTop: 24,
        paddingBottom: 22,
        paddingHorizontal: 30,
        backgroundColor: '#ffffff',
        fontFamily: 'Helvetica',
        color: C.text,
        fontSize: 8.5,
        lineHeight: 1.3,
    },

    // ── Header ───────────────────────────────────────────────────────────────
    header: {
        textAlign: 'center',
        marginBottom: 8,
        borderBottomWidth: 1.5,
        borderBottomColor: C.accent,
        paddingBottom: 7,
    },
    name: {
        fontSize: 18,
        fontFamily: 'Helvetica-Bold',
        color: C.accent,
        letterSpacing: 0.5,
        marginBottom: 2,
        textTransform: 'uppercase',
    },
    jobTitle: {
        fontSize: 10.5,
        fontFamily: 'Helvetica-Bold',
        color: '#1e3a8a',
        marginBottom: 4,
    },
    contactRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 6,
        fontSize: 7.8,
        color: C.muted,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    contactLink: {
        color: C.link,
        textDecoration: 'none',
    },
    separator: {
        marginHorizontal: 3,
        color: C.line,
    },

    // ── Section ──────────────────────────────────────────────────────────────
    section: {
        marginBottom: 7.5,
    },
    sectionTitle: {
        fontSize: 9.5,
        fontFamily: 'Helvetica-Bold',
        color: C.accent,
        textTransform: 'uppercase',
        letterSpacing: 0.6,
        borderBottomWidth: 1,
        borderBottomColor: C.line,
        paddingBottom: 1.5,
        marginBottom: 3.5,
    },

    // ── Summary ──────────────────────────────────────────────────────────────
    summaryText: {
        fontSize: 8.2,
        color: C.text,
        lineHeight: 1.35,
        textAlign: 'justify',
    },

    // ── Item Blocks (Experience / Education) ──────────────────────────────────
    item: {
        marginBottom: 4,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 1,
    },
    itemTitle: {
        fontSize: 8.8,
        fontFamily: 'Helvetica-Bold',
        color: C.text,
        flex: 1,
        paddingRight: 6,
    },
    itemDates: {
        fontSize: 7.8,
        fontFamily: 'Helvetica-Bold',
        color: C.muted,
        textAlign: 'right',
    },
    itemSub: {
        fontSize: 8,
        color: C.muted,
        marginBottom: 1.5,
    },
    itemDesc: {
        fontSize: 7.8,
        color: C.text,
        lineHeight: 1.28,
        textAlign: 'justify',
    },

    // ── Projects ─────────────────────────────────────────────────────────────
    projectItem: {
        marginBottom: 3.5,
    },
    projectHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 1,
    },
    projectName: {
        fontSize: 8.5,
        fontFamily: 'Helvetica-Bold',
        color: C.text,
    },
    projectCategory: {
        fontSize: 7.5,
        color: C.muted,
        fontFamily: 'Helvetica-Oblique',
        marginLeft: 4,
    },
    projectTech: {
        fontSize: 7.4,
        color: '#1e3a8a',
        fontFamily: 'Helvetica-Bold',
        marginTop: 1,
    },

    // ── Skills & Languages Lines ─────────────────────────────────────────────
    skillLine: {
        flexDirection: 'row',
        marginBottom: 2.2,
        fontSize: 8,
    },
    skillLabel: {
        fontFamily: 'Helvetica-Bold',
        color: C.text,
        width: '26%',
    },
    skillValues: {
        color: C.muted,
        width: '74%',
        lineHeight: 1.25,
    },
});

const MONTHS_FR = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function fmtDate(d: string, lang: 'fr' | 'en') {
    if (!d) return '';
    const parts = d.split('/');
    if (parts.length === 2) {
        const [m, y] = parts;
        const arr = lang === 'fr' ? MONTHS_FR : MONTHS_EN;
        return `${arr[parseInt(m, 10) - 1] ?? m} 20${y.length === 2 ? y : y.slice(-2)}`;
    }
    return d;
}

export const CvAtsDocument: React.FC<CvAtsDocumentProps> = ({
    lang,
    workExperiences,
    degrees,
    groupedSkills,
    hobbies,
    personalProjects,
    schoolProjects,
    portfolioUrl,
    customTitle,
    customDescription,
}) => {
    const isEn = lang === 'en';

    const L = isEn ? {
        defaultJob: 'Software Developer',
        defaultTagline: 'Engineering student in Computer Science at IMT Nord Europe, seeking software development opportunities. Experienced in full-stack web, mobile, and distributed systems.',
        secSummary: 'Professional Summary',
        secEdu: 'Education',
        secExp: 'Work Experience',
        secProjects: 'Key Projects',
        secSkills: 'Technical Skills',
        secLang: 'Languages & Interests',
        perso: 'Personal',
        school: 'Academic',
        techLabel: 'Technologies',
        languages: 'Languages',
        interests: 'Interests',
        frLang: 'French (Native)',
        enLang: 'English (TOEIC 710 · B2 Working Proficiency)',
        location: 'Nord-Pas-de-Calais, France',
    } : {
        defaultJob: 'Développeur Logiciel',
        defaultTagline: 'Étudiant en cycle ingénieur informatique à IMT Nord Europe (en alternance). Passionné par le génie logiciel, le développement web full-stack et les architectures logicielles modernes.',
        secSummary: 'Profil Professionnel',
        secEdu: 'Formation',
        secExp: 'Expériences Professionnelles',
        secProjects: 'Projets Significatifs',
        secSkills: 'Compétences Techniques',
        secLang: 'Langues & Centres d\'Intérêt',
        perso: 'Personnel',
        school: 'Académique',
        techLabel: 'Technologies',
        languages: 'Langues',
        interests: 'Centres d\'intérêt',
        frLang: 'Français (Langue maternelle)',
        enLang: 'Anglais (TOEIC 710 · Niveau B2 opérationnel)',
        location: 'Nord-Pas-de-Calais, France',
    };

    const targetTitle = customTitle || L.defaultJob;
    const summaryText = customDescription || L.defaultTagline;
    const siteUrl = portfolioUrl || 'rayzerdev.vercel.app';

    // Group skills into high-impact ATS categories
    const languagesSkills = (groupedSkills['Langages'] || groupedSkills['Languages'] || []).map(s => s.nom).join(', ');
    const frameworksSkills = (groupedSkills['Frameworks'] || []).map(s => s.nom).join(', ');
    const databaseSkills = (groupedSkills['SGBD'] || groupedSkills['Databases'] || []).map(s => s.nom).join(', ');
    const devopsSkills = (groupedSkills['DevOps'] || []).map(s => s.nom).join(', ');
    const toolsSkills = (groupedSkills['Outils'] || groupedSkills['Tools'] || []).map(s => s.nom).join(', ');
    const testingSkills = (groupedSkills['Tests'] || groupedSkills['Testing'] || []).map(s => s.nom).join(', ');

    const combinedProjects = [...personalProjects.slice(0, 2), ...schoolProjects.slice(0, 1)];
    const hobbiesList = hobbies.map(h => h.nom).join(', ');

    return (
        <Document title={`CV - Louis Karamucki - ${targetTitle}`} author="Louis Karamucki">
            <Page size="A4" style={styles.page}>
                {/* ── HEADER ── */}
                <View style={styles.header}>
                    <Text style={styles.name}>Louis Karamucki</Text>
                    <Text style={styles.jobTitle}>{targetTitle}</Text>
                    <View style={styles.contactRow}>
                        <Text style={styles.contactItem}>{L.location}</Text>
                        <Text style={styles.separator}>|</Text>
                        <Link style={styles.contactLink} src="mailto:louis.karamucki@outlook.fr">
                            louis.karamucki@outlook.fr
                        </Link>
                        <Text style={styles.separator}>|</Text>
                        <Link style={styles.contactLink} src={`https://${siteUrl}`}>
                            {siteUrl}
                        </Link>
                        <Text style={styles.separator}>|</Text>
                        <Link style={styles.contactLink} src="https://www.linkedin.com/in/louiskrmk/">
                            linkedin.com/in/louiskrmk
                        </Link>
                        <Text style={styles.separator}>|</Text>
                        <Link style={styles.contactLink} src="https://github.com/RayzerDev">
                            github.com/RayzerDev
                        </Link>
                    </View>
                </View>

                {/* ── SUMMARY ── */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{L.secSummary}</Text>
                    <Text style={styles.summaryText}>{summaryText}</Text>
                </View>

                {/* ── WORK EXPERIENCE ── */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{L.secExp}</Text>
                    {workExperiences.map(e => (
                        <View key={e.id} style={styles.item}>
                            <View style={styles.itemHeader}>
                                <Text style={styles.itemTitle}>
                                    {e.nom} – <Text style={{fontFamily: 'Helvetica', color: C.muted}}>{e.entreprise} ({e.ville})</Text>
                                </Text>
                                <Text style={styles.itemDates}>
                                    {fmtDate(e.debut, lang)} – {fmtDate(e.fin, lang)}
                                </Text>
                            </View>
                            <Text style={styles.itemSub}>{e.type}</Text>
                            {e.description && (
                                <Text style={styles.itemDesc}>{e.description}</Text>
                            )}
                        </View>
                    ))}
                </View>

                {/* ── EDUCATION ── */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{L.secEdu}</Text>
                    {degrees.map(d => (
                        <View key={d.id} style={styles.item}>
                            <View style={styles.itemHeader}>
                                <Text style={styles.itemTitle}>
                                    {d.nom} – <Text style={{fontFamily: 'Helvetica', color: C.muted}}>{d.ecole} ({d.ville})</Text>
                                </Text>
                                <Text style={styles.itemDates}>
                                    {fmtDate(d.debut, lang)} – {fmtDate(d.fin, lang)}
                                </Text>
                            </View>
                            {d.description && (
                                <Text style={styles.itemDesc}>{d.description}</Text>
                            )}
                        </View>
                    ))}
                </View>

                {/* ── KEY PROJECTS ── */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{L.secProjects}</Text>
                    {combinedProjects.map(p => (
                        <View key={p.id} style={styles.projectItem}>
                            <View style={styles.projectHeader}>
                                <Text style={styles.projectName}>
                                    {p.nom}
                                    <Text style={styles.projectCategory}>({p.category})</Text>
                                </Text>
                                {p.date && <Text style={styles.itemDates}>{fmtDate(p.date, lang)}</Text>}
                            </View>
                            <Text style={styles.itemDesc}>{p.shortDescription}</Text>
                            {p.skills && p.skills.length > 0 && (
                                <Text style={styles.projectTech}>
                                    {L.techLabel}: {p.skills.map(s => s.nom).join(', ')}
                                </Text>
                            )}
                        </View>
                    ))}
                </View>

                {/* ── TECHNICAL SKILLS ── */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{L.secSkills}</Text>
                    {languagesSkills ? (
                        <View style={styles.skillLine}>
                            <Text style={styles.skillLabel}>{isEn ? 'Languages:' : 'Langages :'}</Text>
                            <Text style={styles.skillValues}>{languagesSkills}</Text>
                        </View>
                    ) : null}
                    {frameworksSkills ? (
                        <View style={styles.skillLine}>
                            <Text style={styles.skillLabel}>{isEn ? 'Frameworks & Libs:' : 'Frameworks :'}</Text>
                            <Text style={styles.skillValues}>{frameworksSkills}</Text>
                        </View>
                    ) : null}
                    {databaseSkills ? (
                        <View style={styles.skillLine}>
                            <Text style={styles.skillLabel}>{isEn ? 'Databases:' : 'Bases de données :'}</Text>
                            <Text style={styles.skillValues}>{databaseSkills}</Text>
                        </View>
                    ) : null}
                    {devopsSkills || toolsSkills || testingSkills ? (
                        <View style={styles.skillLine}>
                            <Text style={styles.skillLabel}>{isEn ? 'DevOps, Tools & Tests:' : 'DevOps & Outils :'}</Text>
                            <Text style={styles.skillValues}>
                                {[devopsSkills, toolsSkills, testingSkills].filter(Boolean).join(', ')}
                            </Text>
                        </View>
                    ) : null}
                </View>

                {/* ── LANGUAGES & INTERESTS ── */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{L.secLang}</Text>
                    <View style={styles.skillLine}>
                        <Text style={styles.skillLabel}>{L.languages} :</Text>
                        <Text style={styles.skillValues}>{L.frLang} | {L.enLang}</Text>
                    </View>
                    {hobbiesList ? (
                        <View style={styles.skillLine}>
                            <Text style={styles.skillLabel}>{L.interests} :</Text>
                            <Text style={styles.skillValues}>{hobbiesList}</Text>
                        </View>
                    ) : null}
                </View>
            </Page>
        </Document>
    );
};

export default CvAtsDocument;
