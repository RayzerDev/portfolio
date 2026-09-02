"use client";

import {useEffect, useState} from "react";
import {createPortal} from "react-dom";
import Image from "next/image";
import {X, ZoomIn} from "lucide-react";

interface ImageLightboxProps {
    src: string | null;
    alt?: string;
    onClose: () => void;
}

export function ImageLightbox({src, alt, onClose}: ImageLightboxProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!src) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                e.stopPropagation();
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown, {capture: true});
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", handleKeyDown, {capture: true});
            document.body.style.overflow = "";
        };
    }, [src, onClose]);

    if (!src || !mounted) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/92 backdrop-blur-lg p-4 sm:p-8 animate-in fade-in duration-200"
            onClick={(e) => {
                e.stopPropagation();
                onClose();
            }}
            role="dialog"
            aria-modal="true"
            aria-label={alt || "Image preview"}
        >
            {/* Close button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/30 hover:scale-110 active:scale-95 transition-all duration-150 backdrop-blur-md border border-white/30 shadow-2xl cursor-pointer"
                aria-label="Fermer"
            >
                <X className="h-6 w-6"/>
            </button>

            {/* Main image container */}
            <div
                className="relative max-w-6xl max-h-[92vh] w-full h-full flex flex-col items-center justify-center pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative w-full h-full max-h-[85vh] flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={src}
                        alt={alt || "Image en plein écran"}
                        className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] border border-white/15"
                    />
                </div>
                {alt && (
                    <p className="mt-3 text-sm font-medium text-white/90 text-center tracking-wide bg-black/60 px-5 py-2 rounded-full backdrop-blur-md border border-white/15 shadow-lg">
                        {alt}
                    </p>
                )}
            </div>
        </div>,
        document.body
    );
}

export function ZoomableImage({
    src,
    alt,
    className = "",
    fill = false,
    sizes = "(max-width: 768px) 100vw, 50vw",
    width,
    height,
    onClick,
}: {
    src: string;
    alt: string;
    className?: string;
    fill?: boolean;
    sizes?: string;
    width?: number;
    height?: number;
    onClick?: () => void;
}) {
    return (
        <div
            onClick={onClick}
            className="group relative cursor-zoom-in overflow-hidden w-full h-full"
            title="Cliquer pour agrandir l'image"
        >
            {fill ? (
                <Image src={src} alt={alt} fill sizes={sizes} className={className}/>
            ) : (
                <Image src={src} alt={alt} width={width || 500} height={height || 500} className={className}/>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all duration-200 flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-all duration-200 transform scale-90 group-hover:scale-100 flex items-center gap-1.5 bg-black/75 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm border border-white/20">
                    <ZoomIn className="w-3.5 h-3.5"/>
                    Agrandir
                </span>
            </div>
        </div>
    );
}
