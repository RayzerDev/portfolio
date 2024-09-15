import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";
import Link from "next/link";
import {Avatar, AvatarImage} from "@/components/ui/avatar";

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
      <header className="bg-primary text-primary-foreground py-6 px-4 md:px-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/portfolio/logoDark.png" alt="LK" />
            </Avatar>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold">Louis Karamucki</h1>
              <p className="text-sm text-primary-foreground/80">RayzerDev</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-4">
            <Link href="/" className="text-sm font-medium hover:underline" prefetch={false}>
              Accueil
            </Link>
            <Link href="/about" className="text-sm font-medium hover:underline" prefetch={false}>
              A propos
            </Link>
            <Link href="/skills" className="text-sm font-medium hover:underline" prefetch={false}>
              Compétences
            </Link>
            <Link href="/projects" className="text-sm font-medium hover:underline" prefetch={false}>
              Projets
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:underline" prefetch={false}>
              Contact
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
