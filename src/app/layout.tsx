import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import React from "react";
import {ThemeProvider} from "next-themes";
import {SpeedInsights} from "@vercel/speed-insights/next";
import {LanguageProvider} from "@/context/LanguageContext";
import {Header} from "@/components/Header";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "Portfolio de RayzerDev",
    description: "Portfolio de RayzerDev"
    ,
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr">
        <body>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
        >
            <LanguageProvider>
                <div className="flex flex-col min-h-[100dvh]">
                    <Header/>
                    <main className={`${inter.className} pt-24`}>{children}</main>
                </div>
            </LanguageProvider>
        </ThemeProvider>
        <SpeedInsights/>
        </body>
        </html>
    );
}