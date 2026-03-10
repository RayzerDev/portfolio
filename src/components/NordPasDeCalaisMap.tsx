'use client';

import dynamic from 'next/dynamic';

// Leaflet doit être chargé uniquement côté client
const NordPasDeCalaisMapInner = dynamic(
    () => import('@/components/NordPasDeCalaisMapInner'),
    {ssr: false, loading: () => <div className="w-full h-64 rounded-xl bg-muted animate-pulse"/>}
);

export default function NordPasDeCalaisMap() {
    return <NordPasDeCalaisMapInner/>;
}


