'use client';

import {useEffect, useRef} from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import npcGeoJSON from '@/data/nord-pas-de-calais.geojson';

// GeoJSON pré-fusionné (union topologique Nord 59 + Pas-de-Calais 62, sans frontière interne)
const NPC_GEOJSON = npcGeoJSON as GeoJSON.FeatureCollection;

export default function NordPasDeCalaisMapInner() {
    const mapRef = useRef<HTMLDivElement>(null);
    const instanceRef = useRef<L.Map | null>(null);

    useEffect(() => {
        if (!mapRef.current || instanceRef.current) return;

        const isDark = document.documentElement.classList.contains('dark');

        const map = L.map(mapRef.current, {
            center: [50.48, 2.55],
            zoom: 8,
            zoomControl: true,
            scrollWheelZoom: false,
            attributionControl: false,
            dragging: true,
        });
        instanceRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
        }).addTo(map);

        if (isDark) {
            const layers = mapRef.current.querySelector('.leaflet-tile-pane') as HTMLElement | null;
            if (layers) {
                layers.style.filter = 'invert(1) hue-rotate(180deg) brightness(0.8) contrast(0.9)';
            }
        }

        const accentColor = '#3b6fe0';

        L.geoJSON(NPC_GEOJSON, {
            style: () => ({
                color: accentColor,
                weight: 2.5,
                fillColor: accentColor,
                fillOpacity: isDark ? 0.22 : 0.14,
                lineJoin: 'round',
            }),
        }).addTo(map);

        const pulseIcon = L.divIcon({
            html: `
                <div style="position:relative;width:20px;height:20px;">
                    <div style="position:absolute;top:0;left:0;width:20px;height:20px;border-radius:50%;background:rgba(59,111,224,0.3);animation:pulse 1.8s ease-out infinite;"></div>
                    <div style="position:absolute;top:3px;left:3px;width:14px;height:14px;border-radius:50%;background:#3b6fe0;border:2px solid white;box-shadow:0 0 6px rgba(59,111,224,0.7);"></div>
                </div>
                <style>@keyframes pulse{0%{transform:scale(1);opacity:0.8}70%{transform:scale(2.2);opacity:0}100%{transform:scale(1);opacity:0}}</style>
            `,
            className: '',
            iconSize: [20, 20],
            iconAnchor: [10, 10],
        });

        L.marker([50.43, 2.82], {icon: pulseIcon})
            .addTo(map)
            .bindPopup(`<div style="font-family:system-ui;min-width:130px;text-align:center;"><strong style="font-size:13px;">Nord-Pas-de-Calais</strong><br/><span style="font-size:11px;color:#3b6fe0;">📍 Ma région</span></div>`);

        L.control.attribution({
            prefix: '© <a href="https://www.openstreetmap.org" target="_blank">OpenStreetMap</a>',
        }).addTo(map);

        return () => {
            map.remove();
            instanceRef.current = null;
        };
    }, []);

    return (
        <div
            ref={mapRef}
            className="w-full rounded-b-xl overflow-hidden"
            style={{height: 280}}
        />
    );
}
