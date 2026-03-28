import {NextResponse} from 'next/server';

export const dynamic = 'force-dynamic';

// URL publique de la photo de profil LinkedIn (scraping non possible, on utilise une URL publique connue)
// Pour une photo dynamique, on redirige vers l'URL publique LinkedIn.
// Si LinkedIn bloque, le CV tombera sur le fallback initiales.
const LINKEDIN_PHOTO_URL = 'https://media.licdn.com/dms/image/v2/D4E03AQFc4FwVacSiGQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1697200255783?e=1776297600&v=beta&t=yzWylLn_-lGaVSFcrkhyrTZc4otLsSDQFancH4p9aQU';

export async function GET() {
    try {
        const res = await fetch(LINKEDIN_PHOTO_URL, {
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                Referer: 'https://www.linkedin.com/',
            },
            next: {revalidate: 3600}, // cache 1h
        });

        if (!res.ok) {
            return new NextResponse(null, {status: 404});
        }

        const buffer = await res.arrayBuffer();
        const contentType = res.headers.get('content-type') || 'image/jpeg';

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=3600',
            },
        });
    } catch {
        return new NextResponse(null, {status: 500});
    }
}

