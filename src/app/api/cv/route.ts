import {NextRequest, NextResponse} from 'next/server';
import type {DocumentProps} from '@react-pdf/renderer';
import {renderToBuffer} from '@react-pdf/renderer';
import React from 'react';
import DataSingleton from '@/utils/dataUtils';
import CvDocument from '@/components/CvDocument';

export const dynamic = 'force-dynamic';

const CV_CACHE_TTL_MS = 60 * 60 * 1000; // 1h
const cvCache = new Map<string, { buffer: Buffer; ts: number }>();

import path from 'path';
import {promises as fs} from 'fs';

// Helper pour créer l'élément sans conflit de types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createCvElement(props: Record<string, unknown>): React.ReactElement<DocumentProps> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (CvDocument as any)(props) as React.ReactElement<DocumentProps>;
}

async function fetchPortraitBase64(): Promise<string | null> {
    try {
        const localPath = path.join(process.cwd(), 'public', 'images', 'profile.jpg');
        const buf = await fs.readFile(localPath);
        const base64 = buf.toString('base64');
        return `data:image/jpeg;base64,${base64}`;
    } catch {
        return null;
    }
}

export async function GET(request: NextRequest) {
    const {searchParams} = new URL(request.url);
    const lang = (searchParams.get('lang') === 'en' ? 'en' : 'fr') as 'fr' | 'en';
    // Limit string lengths to prevent payload injection / memory bloat
    const rawTitle = searchParams.get('title');
    const rawDesc = searchParams.get('description');
    const customTitle = rawTitle ? rawTitle.slice(0, 150).trim() : undefined;
    const customDescription = rawDesc ? rawDesc.slice(0, 500).trim() : undefined;

    const photoParam = searchParams.get('photo') ?? searchParams.get('picture') ?? searchParams.get('withPhoto');
    const includePhoto = photoParam === null ? true : !['false', '0', 'no', 'none', 'off'].includes(photoParam.toLowerCase());

    const isDev = process.env.NODE_ENV !== 'production';

    const dataService = DataSingleton.getInstance();

    const [workExperiences, degrees, groupedSkills, hobbies, allProjects, portraitSrc] = await Promise.all([
        dataService.getWorkExperiencesData(lang),
        dataService.getDegreesData(lang),
        dataService.groupSkillsByCategory(lang),
        dataService.getHobbiesData(lang),
        dataService.getProjectsData(lang),
        includePhoto ? fetchPortraitBase64() : Promise.resolve(null),
    ]);

    const personalCat = lang === 'en' ? 'Personal Project' : 'Projet Personnel';
    const schoolCat = lang === 'en' ? 'School Project' : 'Projet Scolaire';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const personalProjects = allProjects.filter((p: any) => p.category === personalCat).slice(0, 2);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const schoolProjects = allProjects.filter((p: any) => p.category === schoolCat).slice(0, 2);

    const element = createCvElement({
        lang,
        workExperiences,
        degrees,
        groupedSkills,
        hobbies,
        personalProjects,
        schoolProjects,
        portraitSrc,
        portfolioUrl: 'rayzerdev.vercel.app',
        customTitle,
        customDescription,
    });

    try {
        const buffer = await renderToBuffer(element);

        const filename = `cv-louis-karamucki-${lang}.pdf`;

        return new NextResponse(new Uint8Array(buffer), {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `inline; filename="${filename}"`,
                'Cache-Control': isDev
                    ? 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0'
                    : 'public, s-maxage=3600, stale-while-revalidate=86400',
                'Pragma': isDev ? 'no-cache' : 'public',
                'X-Content-Type-Options': 'nosniff',
            },
        });
    } catch (err) {
        console.error('CV render error:', err);
        return new NextResponse(String(err), {status: 500});
    }
}
