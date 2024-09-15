import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import {Github, LinkedinIcon} from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Portfolio",
  description: "RayzerDev's portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
    <body>
    <div className="flex flex-col min-h-[100dvh]">
      <header className="bg-primary text-foreground py-6 px-4 md:px-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image src="/portfolio/logoWhite.png" alt="LK"
                   style={{
                     width: '25%'
                   }}
                   width={1}
                   height={1}/>
          </div>
          <nav className="hidden md:flex items-center gap-4">
            <Link href="/" className="text-lg font-medium hover:scale-110 transition" prefetch={false}>
              Accueil
            </Link>
            <Link href="/about" className="text-lg font-medium hover:scale-110 transition" prefetch={false}>
              A propos
            </Link>
            <Link href="/skills" className="text-lg font-medium hover:scale-110 transition" prefetch={false}>
              Compétences
            </Link>
            <Link href="/projects" className="text-lg font-medium hover:scale-110 transition" prefetch={false}>
              Projets
            </Link>
            <Link href="/contact" className="text-lg font-medium hover:scale-110 transition" prefetch={false}>
              Contact
            </Link>
            <Link href="https://github.com/RayzerDev" className="text-lg font-medium hover:scale-110 transition" prefetch={false}>
              <LinkedinIcon></LinkedinIcon>
            </Link>
            <Link href="https://www.linkedin.com/in/louiskrmk/" className="text-lg font-medium hover:scale-110 transition" prefetch={false}>
              <Github></Github>
            </Link>
          </nav>
        </div>
      </header>
      <main className={inter.className}>{children}</main>
    </div>
    </body>
    </html>
);
}
