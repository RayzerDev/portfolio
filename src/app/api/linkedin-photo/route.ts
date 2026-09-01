import {NextResponse} from 'next/server';
import {promises as fs} from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const localPath = path.join(process.cwd(), 'public', 'images', 'profile.jpg');
        const buffer = await fs.readFile(localPath);
        return new NextResponse(new Uint8Array(buffer), {
            status: 200,
            headers: {
                'Content-Type': 'image/jpeg',
                'Cache-Control': 'public, max-age=86400',
            },
        });
    } catch {
        return new NextResponse(null, {status: 404});
    }
}

