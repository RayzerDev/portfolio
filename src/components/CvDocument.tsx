import React from 'react';
import {Circle, Document, Image, Line, Link, Page, Path, Rect, StyleSheet, Svg, Text, View} from '@react-pdf/renderer';

// ── Types ────────────────────────────────────────────────────────────────────
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

export interface CvDocumentProps {
    lang: 'fr' | 'en';
    workExperiences: WorkExperience[];
    degrees: Degree[];
    groupedSkills: GroupedSkills;
    hobbies: Hobby[];
    personalProjects: Project[];
    schoolProjects: Project[];
    portraitSrc?: string | null;
    portfolioUrl?: string;
    customTitle?: string;
    customDescription?: string;
}

// ── Palette light mode du portfolio ──────────────────────────────────────────
// --background: 0 0% 96%      → #f5f5f5
// --foreground: 225 49% 18%   → #172344
// --card:       0 0% 90%      → #e6e6e6
// --border:     0 0% 89.8%    → #e5e5e5
// --muted-foreground: 0 0% 45.1% → #737373
const C = {
    bg: '#f5f5f5',  // background (blanc cassé)
    card: '#ffffff',  // card (blanc)
    cardDark: '#eaecf3',  // zone interne légèrement bleutée
    accent: '#172344',  // dark navy (accent principal)
    accentL: '#2d4a8a',  // navy moyen (labels secondaires)
    accentXL: '#e8edf8',  // bleu très clair (texte sur fond accent sombre)
    fg: '#172344',  // texte principal
    fgMut: '#6b7280',  // texte atténué gris
    border: '#dde1ee',  // bordure
    white: '#ffffff',
};

// ── Icônes SVG Lucide directes ────────────────────────────────────────────────
function renderIcon(type: string, color = '#fff', size = 9) {
    switch (type) {
        case 'mail':
            return (
                <Svg width={size} height={size} viewBox="0 0 24 24">
                    <Rect x="2" y="4" width="20" height="16" rx="2" stroke={color} strokeWidth="2" fill="none"/>
                    <Path d="M2 7l10 7 10-7" stroke={color} strokeWidth="2" fill="none"/>
                </Svg>
            );
        case 'map-pin':
            return (
                <Svg width={size} height={size} viewBox="0 0 24 24">
                    <Path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke={color} strokeWidth="2" fill="none"/>
                    <Circle cx="12" cy="9" r="2.5" stroke={color} strokeWidth="2" fill="none"/>
                </Svg>
            );
        case 'globe':
            return (
                <Svg width={size} height={size} viewBox="0 0 24 24">
                    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none"/>
                    <Path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z" stroke={color} strokeWidth="2" fill="none"/>
                </Svg>
            );
        case 'github':
            return (
                <Svg width={size} height={size} viewBox="0 0 24 24">
                    <Path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </Svg>
            );
        case 'linkedin':
            return (
                <Svg width={size} height={size} viewBox="0 0 24 24">
                    <Rect x="2" y="2" width="20" height="20" rx="3" stroke={color} strokeWidth="2" fill="none"/>
                    <Line x1="8" y1="11" x2="8" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round"/>
                    <Line x1="8" y1="8" x2="8" y2="8.5" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
                    <Path d="M12 17v-4a2 2 0 0 1 4 0v4" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round"/>
                    <Line x1="12" y1="11" x2="12" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round"/>
                </Svg>
            );
        default:
            return null;
    }
}

// ── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
    page: {flexDirection: 'row', backgroundColor: C.bg, fontFamily: 'Helvetica'},

    // ── Sidebar ───────────────────────────────────────────────────────────
    sidebar: {width: '33.5%', backgroundColor: C.cardDark, paddingBottom: 10, minHeight: '100%'},
    sideHeader: {
        backgroundColor: C.accent,
        paddingTop: 20, paddingBottom: 14, paddingHorizontal: 14,
        alignItems: 'center', marginBottom: 10.5,
    },
    avatar: {width: 80, height: 80, borderRadius: 40, marginBottom: 7, borderWidth: 2.2, borderColor: C.white},
    avatarPlaceholder: {
        width: 80, height: 80, borderRadius: 40, backgroundColor: C.card,
        alignItems: 'center', justifyContent: 'center', marginBottom: 7,
        borderWidth: 2.2, borderColor: C.white,
    },
    avatarInitials: {fontSize: 25, fontFamily: 'Helvetica-Bold', color: C.accentXL},
    name: {fontSize: 16.5, fontFamily: 'Helvetica-Bold', color: C.white, textAlign: 'center', marginBottom: 2.5},
    jobTitle: {fontSize: 9.2, color: C.accentXL, textAlign: 'center', letterSpacing: 0.8, textTransform: 'uppercase'},

    sidePad: {paddingHorizontal: 13},
    sSection: {marginBottom: 10},
    sTitleRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 4.5},
    sTitleBar: {width: 3, height: 11.5, backgroundColor: C.accent, borderRadius: 1.5, marginRight: 5.5},
    sTitle: {
        fontSize: 9.6,
        fontFamily: 'Helvetica-Bold',
        color: C.accentL,
        textTransform: 'uppercase',
        letterSpacing: 0.9
    },
    divider: {borderBottomWidth: 1, borderBottomColor: C.border, marginBottom: 10},

    // Contact
    contactRow: {flexDirection: 'row', marginBottom: 4.2, alignItems: 'center'},
    contactIcon: {
        width: 18, height: 18, borderRadius: 4.5, backgroundColor: C.accent,
        alignItems: 'center', justifyContent: 'center', marginRight: 7,
    },
    contactInfo: {flex: 1},
    contactLabel: {fontSize: 6.6, color: C.fgMut, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 0.5},
    contactVal: {fontSize: 8.4, color: C.fg},
    contactLink: {fontSize: 8.4, color: C.accentL, textDecoration: 'underline'},

    // Compétences
    catBlock: {marginBottom: 5.2},
    catLabel: {
        fontSize: 8.2, fontFamily: 'Helvetica-Bold', color: C.accentL,
        textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2.4,
        borderLeftWidth: 2.2, borderLeftColor: C.accent, paddingLeft: 3.5,
    },
    tagsRow: {flexDirection: 'row', flexWrap: 'wrap', gap: 2.6},
    tag: {
        backgroundColor: C.card,
        paddingVertical: 1.8,
        paddingHorizontal: 5.5,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: C.border
    },
    tagText: {fontSize: 7.6, color: C.accentL, fontFamily: 'Helvetica-Bold'},

    // Hobbies & Langues
    hobbyItem: {marginBottom: 4.2},
    hobbyRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 0.6},
    hobbyDot: {width: 3.2, height: 3.2, borderRadius: 1.6, backgroundColor: C.accent, marginRight: 4.5},
    hobbyName: {fontSize: 8.6, fontFamily: 'Helvetica-Bold', color: C.fg},
    hobbyDesc: {fontSize: 7.5, color: C.fgMut, lineHeight: 1.25},

    // ── Main ──────────────────────────────────────────────────────────────
    main: {
        width: '66.5%', paddingTop: 16, paddingBottom: 10, paddingHorizontal: 15,
        backgroundColor: C.bg, minHeight: '100%',
    },
    mainHeader: {marginBottom: 7},
    mainName: {fontSize: 23.5, fontFamily: 'Helvetica-Bold', color: C.fg, marginBottom: 2},
    mainJob: {fontSize: 15, fontFamily: 'Helvetica-Bold', color: C.accent, letterSpacing: 0.5, marginBottom: 3.5},
    mainTagline: {fontSize: 9.2, color: C.fgMut, lineHeight: 1.42},
    headerLine: {borderBottomWidth: 1.5, borderBottomColor: C.border, marginTop: 6, marginBottom: 2},

    secBlock: {marginBottom: 11.5},
    secTitleRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 5},
    secTitleAccent: {width: 3.5, height: 13.5, backgroundColor: C.accent, borderRadius: 1.5, marginRight: 6.5},
    secTitle: {fontSize: 10.8, fontFamily: 'Helvetica-Bold', color: C.fg},

    // Cards expé / diplôme
    card: {marginBottom: 3.8},
    cardInner: {
        backgroundColor: C.card, borderRadius: 4.5, padding: 5.2,
        borderLeftWidth: 2.8, borderLeftColor: C.accent,
    },
    cardHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 1.5},
    cardTitle: {fontSize: 9.4, fontFamily: 'Helvetica-Bold', color: C.fg, flex: 1, paddingRight: 5},
    cardDate: {
        fontSize: 7.4, color: C.white, fontFamily: 'Helvetica-Bold',
        backgroundColor: C.accent, paddingVertical: 1.6, paddingHorizontal: 5, borderRadius: 2.5,
    },
    cardSub: {fontSize: 8.2, color: C.fgMut, marginBottom: 1.5},
    cardDesc: {fontSize: 7.2, color: C.fgMut, marginTop: 1, marginBottom: 2.2, lineHeight: 1.3},
    badge: {
        backgroundColor: C.card, paddingVertical: 1.8, paddingHorizontal: 5.5,
        borderRadius: 8, alignSelf: 'flex-start', borderWidth: 1, borderColor: C.border,
    },
    badgeText: {fontSize: 6.8, color: C.accentL, fontFamily: 'Helvetica-Bold'},

    // Grille projets
    projectsGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: 4.5},
    projectCard: {
        width: '49%', borderWidth: 1, borderColor: C.border, borderRadius: 4.5,
        padding: 5.2, backgroundColor: C.card, borderTopWidth: 2.2, borderTopColor: C.accent,
    },
    projectCardSch: {
        width: '49%', borderWidth: 1, borderColor: C.border, borderRadius: 4.5,
        padding: 5.2, backgroundColor: C.card, borderTopWidth: 2.2, borderTopColor: C.accentL,
    },
    projectHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 1.5},
    projectName: {fontSize: 8.8, fontFamily: 'Helvetica-Bold', color: C.fg, flex: 1, paddingRight: 3},
    projectDate: {
        fontSize: 6.6, color: C.accentL, backgroundColor: C.cardDark,
        paddingVertical: 1, paddingHorizontal: 3.5, borderRadius: 2,
    },
    projectDesc: {fontSize: 7.2, color: C.fgMut, lineHeight: 1.28},
    projectSkillsRow: {flexDirection: 'row', flexWrap: 'wrap', gap: 1.8, marginTop: 2.5},
    projectSkillTag: {
        backgroundColor: C.card, paddingVertical: 1.6, paddingHorizontal: 4.8,
        borderRadius: 6, borderWidth: 1, borderColor: C.border,
    },
    projectSkillTagText: {fontSize: 6.3, color: C.accentL, fontFamily: 'Helvetica-Bold'},
    projLabel: {
        fontSize: 8.4, fontFamily: 'Helvetica-Bold', color: C.fgMut,
        textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 3,
    },
    projLabelSch: {
        fontSize: 8.4, fontFamily: 'Helvetica-Bold', color: C.accentL,
        textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 3, marginTop: 5,
    },
});

// ── Helpers ───────────────────────────────────────────────────────────────────
const MONTHS_FR = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function fmtDate(d: string, lang: 'fr' | 'en') {
    if (!d) return '';
    const parts = d.split('/');
    if (parts.length === 2) {
        const [m, y] = parts;
        const arr = lang === 'fr' ? MONTHS_FR : MONTHS_EN;
        return `${arr[parseInt(m, 10) - 1] ?? m} ${y}`;
    }
    return d;
}

const SKIP_FR = ['Outils', 'OS', 'Serveur applications', 'Langues'];
const SKIP_EN = ['Tools', 'OS', 'Application Servers', 'Languages'];

// ── Composant principal ───────────────────────────────────────────────────────
const CvDocument: React.FC<CvDocumentProps> = ({
                                                   lang, workExperiences, degrees, groupedSkills, hobbies,
                                                   personalProjects, schoolProjects, portraitSrc, portfolioUrl,
                                                   customTitle, customDescription,
                                               }) => {
    const skip = lang === 'en' ? SKIP_EN : SKIP_FR;
    const skills = Object.entries(groupedSkills).filter(([cat]) => !skip.includes(cat));

    const L = lang === 'fr' ? {
        job: 'Développeur Logiciel',
        tagline: 'Étudiant ingénieur en informatique à IMT Nord Europe, en alternance chez Lenrek Informatique.',
        exp: 'Expériences Professionnelles', edu: 'Formation',
        proj: 'Projets', perso: 'Personnels', school: 'Scolaires',
        skills: 'Compétences', hobbies: "Centres d'Intérêt", lieu: 'Lieu',
        langues: 'Langues',
    } : {
        job: 'Software Developer',
        tagline: 'Engineering student in computer science at IMT Nord Europe, on a work-study at Lenrek Informatique.',
        exp: 'Work Experiences', edu: 'Education',
        proj: 'Projects', perso: 'Personal', school: 'School',
        skills: 'Skills', hobbies: 'Hobbies', lieu: 'Location',
        langues: 'Languages',
    };

    const displayTagline = customDescription || L.tagline;
    customTitle = customTitle || L.job;

    const siteUrl = portfolioUrl || 'rayzerdev.vercel.app';

    const contactRows: { icon: string; label: string; val: string; link: string | null }[] = [
        {icon: 'mail', label: 'Email', val: 'louis.karamucki@outlook.fr', link: null},
        {icon: 'map-pin', label: L.lieu, val: 'Nord-Pas-De-Calais, France', link: null},
        {icon: 'globe', label: 'Portfolio', val: siteUrl, link: siteUrl},
        {icon: 'github', label: 'GitHub', val: 'github.com/RayzerDev', link: 'https://github.com/RayzerDev'},
        {
            icon: 'linkedin',
            label: 'LinkedIn',
            val: 'linkedin.com/in/louiskrmk',
            link: 'https://www.linkedin.com/in/louiskrmk/'
        },
    ];

    return (
        <Document title="CV - Louis Karamucki" author="Louis Karamucki">
            <Page size="A4" style={s.page}>

                {/* ═══════ SIDEBAR ═══════ */}
                <View style={s.sidebar}>
                    <View style={s.sideHeader}>
                        {portraitSrc
                            ? <Image style={s.avatar} src={portraitSrc}/>
                            : <View style={s.avatarPlaceholder}><Text style={s.avatarInitials}>LK</Text></View>
                        }
                        <Text style={s.name}>Louis Karamucki</Text>
                        <Text style={s.jobTitle}>{L.job}</Text>
                    </View>

                    <View style={s.sidePad}>
                        {/* Contact */}
                        <View style={s.sSection}>
                            <View style={s.sTitleRow}>
                                <View style={s.sTitleBar}/>
                                <Text style={s.sTitle}>Contact</Text>
                            </View>
                            {contactRows.map(({icon, label, val, link}) => (
                                <View key={label} style={s.contactRow}>
                                    <View style={s.contactIcon}>
                                        {renderIcon(icon, C.white, 9)}
                                    </View>
                                    <View style={s.contactInfo}>
                                        <Text style={s.contactLabel}>{label}</Text>
                                        {link
                                            ? <Link style={s.contactLink} src={link}>{val}</Link>
                                            : <Text style={s.contactVal}>{val}</Text>
                                        }
                                    </View>
                                </View>
                            ))}
                        </View>

                        <View style={s.divider}/>

                        {/* Compétences */}
                        <View style={s.sSection}>
                            <View style={s.sTitleRow}>
                                <View style={s.sTitleBar}/>
                                <Text style={s.sTitle}>{L.skills}</Text>
                            </View>
                            {skills.map(([cat, items]) => (
                                <View key={cat} style={s.catBlock}>
                                    <Text style={s.catLabel}>{cat}</Text>
                                    <View style={s.tagsRow}>
                                        {items.map(sk => (
                                            <View key={sk.id} style={s.tag}>
                                                <Text style={s.tagText}>{sk.nom}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            ))}
                        </View>

                        <View style={s.divider}/>

                        {/* Langues */}
                        <View style={s.sSection}>
                            <View style={s.sTitleRow}>
                                <View style={s.sTitleBar}/>
                                <Text style={s.sTitle}>{L.langues}</Text>
                            </View>
                            <View style={s.hobbyItem}>
                                <View style={s.hobbyRow}>
                                    <View style={s.hobbyDot}/>
                                    <Text style={s.hobbyName}>{lang === 'fr' ? 'Français' : 'French'}</Text>
                                </View>
                                <Text style={s.hobbyDesc}>{lang === 'fr' ? 'Langue maternelle' : 'Native speaker'}</Text>
                            </View>
                            <View style={s.hobbyItem}>
                                <View style={s.hobbyRow}>
                                    <View style={s.hobbyDot}/>
                                    <Text style={s.hobbyName}>{lang === 'fr' ? 'Anglais' : 'English'}</Text>
                                </View>
                                <Text style={s.hobbyDesc}>TOEIC 710 (B2)</Text>
                            </View>
                        </View>

                        <View style={s.divider}/>

                        {/* Hobbies */}
                        <View style={s.sSection}>
                            <View style={s.sTitleRow}>
                                <View style={s.sTitleBar}/>
                                <Text style={s.sTitle}>{L.hobbies}</Text>
                            </View>
                            {hobbies.map(h => (
                                <View key={h.id} style={s.hobbyItem}>
                                    <View style={s.hobbyRow}>
                                        <View style={s.hobbyDot}/>
                                        <Text style={s.hobbyName}>{h.nom}</Text>
                                    </View>
                                    <Text style={s.hobbyDesc}>{h.description}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>

                {/* ═══════ MAIN ═══════ */}
                <View style={s.main}>
                    <View style={s.mainHeader}>
                        <Text style={s.mainJob}>{customTitle}</Text>
                        <Text style={s.mainTagline}>{displayTagline}</Text>
                        <View style={s.headerLine}/>
                    </View>

                    {/* Expériences pro */}
                    <View style={s.secBlock}>
                        <View style={s.secTitleRow}>
                            <View style={s.secTitleAccent}/>
                            <Text style={s.secTitle}>{L.exp}</Text>
                        </View>
                        {workExperiences.map(e => (
                            <View key={e.id} style={s.card}>
                                <View style={s.cardInner}>
                                    <View style={s.cardHeader}>
                                        <Text style={s.cardTitle}>{e.nom}</Text>
                                        <Text
                                            style={s.cardDate}>{fmtDate(e.debut, lang)} – {fmtDate(e.fin, lang)}</Text>
                                    </View>
                                    <Text style={s.cardSub}>{e.entreprise} · {e.ville}</Text>
                                    {e.description && (
                                        <Text style={s.cardDesc}>{e.description}</Text>
                                    )}
                                    <View style={s.badge}><Text style={s.badgeText}>{e.type}</Text></View>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Formation */}
                    <View style={s.secBlock}>
                        <View style={s.secTitleRow}>
                            <View style={s.secTitleAccent}/>
                            <Text style={s.secTitle}>{L.edu}</Text>
                        </View>
                        {degrees.map(d => (
                            <View key={d.id} style={s.card}>
                                <View style={s.cardInner}>
                                    <View style={s.cardHeader}>
                                        <Text style={s.cardTitle}>{d.nom}</Text>
                                        <Text
                                            style={s.cardDate}>{fmtDate(d.debut, lang)} – {fmtDate(d.fin, lang)}</Text>
                                    </View>
                                    <Text style={s.cardSub}>{d.ecole} · {d.ville}</Text>
                                    {d.description && (
                                        <Text style={s.cardDesc}>{d.description}</Text>
                                    )}
                                    <View style={s.badge}><Text style={s.badgeText}>{d.type}</Text></View>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Projets */}
                    <View style={s.secBlock}>
                        <View style={s.secTitleRow}>
                            <View style={s.secTitleAccent}/>
                            <Text style={s.secTitle}>{L.proj}</Text>
                        </View>

                        <Text style={s.projLabel}>{L.perso}</Text>
                        <View style={s.projectsGrid}>
                            {personalProjects.map(p => (
                                <View key={p.id} style={s.projectCard}>
                                    <View style={s.projectHeader}>
                                        <Text style={s.projectName}>{p.nom}</Text>
                                        {p.date && <Text style={s.projectDate}>{fmtDate(p.date, lang)}</Text>}
                                    </View>
                                    <Text style={s.projectDesc}>{p.shortDescription}</Text>
                                    {p.skills && p.skills.length > 0 && (
                                        <View style={s.projectSkillsRow}>
                                            {p.skills.slice(0, 4).map(sk => (
                                                <View key={sk.id} style={s.projectSkillTag}>
                                                    <Text style={s.projectSkillTagText}>{sk.nom}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    )}
                                </View>
                            ))}
                        </View>

                        <Text style={s.projLabelSch}>{L.school}</Text>
                        <View style={s.projectsGrid}>
                            {schoolProjects.map(p => (
                                <View key={p.id} style={s.projectCardSch}>
                                    <View style={s.projectHeader}>
                                        <Text style={s.projectName}>{p.nom}</Text>
                                        {p.date && <Text style={s.projectDate}>{fmtDate(p.date, lang)}</Text>}
                                    </View>
                                    <Text style={s.projectDesc}>{p.shortDescription}</Text>
                                    {p.skills && p.skills.length > 0 && (
                                        <View style={s.projectSkillsRow}>
                                            {p.skills.slice(0, 4).map(sk => (
                                                <View key={sk.id} style={s.projectSkillTag}>
                                                    <Text style={s.projectSkillTagText}>{sk.nom}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    )}
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default CvDocument;
