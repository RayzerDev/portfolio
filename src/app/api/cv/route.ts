import {NextRequest, NextResponse} from 'next/server';
import type {DocumentProps} from '@react-pdf/renderer';
import {renderToBuffer} from '@react-pdf/renderer';
import React from 'react';
import DataSingleton from '@/utils/dataUtils';
import CvDocument from '@/components/CvDocument';

export const dynamic = 'force-dynamic';

const CV_CACHE_TTL_MS = 60 * 60 * 1000; // 1h
const cvCache = new Map<string, { buffer: Buffer; ts: number }>();

// Helper pour créer l'élément sans conflit de types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createCvElement(props: Record<string, unknown>): React.ReactElement<DocumentProps> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return React.createElement(CvDocument as any, props) as React.ReactElement<DocumentProps>;
}

async function fetchPortraitBase64(): Promise<string | null> {
    try {
        const LINKEDIN_PHOTO_URL = 'https://media.licdn.com/dms/image/v2/D4E03AQFc4FwVacSiGQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1697200255783?e=1774483200&v=beta&t=7d3ERn7AZeix0QMsFWQRdWPIZaTuPtoeTnBIx4VwQB0';
        const res = await fetch(LINKEDIN_PHOTO_URL, {
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                Referer: 'https://www.linkedin.com/',
            },
        });
        if (!res.ok) return null;
        const buf = await res.arrayBuffer();
        const base64 = Buffer.from(buf).toString('base64');
        const mime = res.headers.get('content-type') || 'image/jpeg';
        return `data:${mime};base64,${base64}`;
    } catch {
        return null;
    }
}

export async function GET(request: NextRequest) {
    const {searchParams} = new URL(request.url);
    const lang = (searchParams.get('lang') === 'en' ? 'en' : 'fr') as 'fr' | 'en';
    const customTitle = searchParams.get('title') ?? undefined;
    const customDescription = searchParams.get('description') ?? undefined;

    // Serve from cache when no custom params are involved
    const cacheKey = lang;
    if (!customTitle && !customDescription) {
        const entry = cvCache.get(cacheKey);
        if (entry && Date.now() - entry.ts < CV_CACHE_TTL_MS) {
            return new NextResponse(entry.buffer, {
                status: 200,
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': `inline; filename="cv-louis-karamucki-${lang}.pdf"`,
                    'Cache-Control': 'public, max-age=3600',
                    'X-Cache': 'HIT',
                },
            });
        }
    }

    const dataService = DataSingleton.getInstance();

    const [workExperiences, degrees, groupedSkills, hobbies, allProjects, portraitSrc] = await Promise.all([
        dataService.getWorkExperiencesData(lang),
        dataService.getDegreesData(lang),
        dataService.groupSkillsByCategory(lang),
        dataService.getHobbiesData(lang),
        dataService.getProjectsData(lang),
        fetchPortraitBase64(),
    ]);

    const personalCat = lang === 'en' ? 'Personal Project' : 'Projet Personnel';
    const schoolCat = lang === 'en' ? 'School Project' : 'Projet Scolaire';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const personalProjects = allProjects.filter((p: any) => p.category === personalCat).slice(0, 4);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const schoolProjects = allProjects.filter((p: any) => p.category === schoolCat).slice(0, 4);

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

    const buffer = await renderToBuffer(element);

    // Populate cache for standard (no custom params) requests
    if (!customTitle && !customDescription) {
        cvCache.set(cacheKey, {buffer, ts: Date.now()});
    }

    const filename = `cv-louis-karamucki-${lang}.pdf`;

    return new NextResponse(buffer, {
        status: 200,
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="${filename}"`,
            'Cache-Control': 'public, max-age=3600',
            'X-Cache': 'MISS',
        },
    });
}
