"use client";

import {useEffect} from "react";
import {createPortal} from "react-dom";
import {X} from "lucide-react";
import {cn} from "@/lib/utils";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
}

export function Modal({open, onClose, children, className}: ModalProps) {
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [open, onClose]);

    if (!open) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[20000] flex items-end sm:items-center justify-center sm:p-4"
            aria-modal="true"
            role="dialog"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
                onClick={onClose}
            />
            {/* Panel */}
            <div className={cn(
                "relative z-10 w-full sm:max-w-4xl max-h-[92dvh] sm:max-h-[85vh] overflow-y-auto",
                "rounded-t-2xl sm:rounded-2xl",
                "bg-card/95 backdrop-blur-xl",
                "border border-border/60",
                "shadow-[0_24px_64px_rgba(0,0,0,0.35)]",
                "animate-in fade-in slide-in-from-bottom-4 sm:zoom-in-95 sm:slide-in-from-bottom-0 duration-300",
                className
            )}>
                <button
                    onClick={onClose}
                    className="absolute right-3 top-3 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
                    aria-label="Fermer"
                >
                    <X className="w-4 h-4"/>
                </button>
                {children}
            </div>
        </div>,
        document.body
    );
}
