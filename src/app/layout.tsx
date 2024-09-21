import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Github, LinkedinIcon } from "lucide-react";
import {ThemeProvider} from "next-themes";
import {ModeToggle} from "@/components/ui/darkmodetoggle";

const inter = Inter({ subsets: ["latin"] });

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
          disableTransitionOnChange
      >
        <div className="flex flex-col min-h-[100dvh]">
          <header className="bg-primary text-foreground py-6 px-4 md:px-6 gap-4 ">
            <div className="container mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/" className="text-lg font-medium hover:scale-110 transition" prefetch={false}>
                  <Image src="/portfolio/logo.svg" alt="LK" width={160} height={160} />
                </Link>
              </div>
              <nav className="flex items-center gap-4 flex-wrap justify-center ml-8">
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
                  <Github />
                </Link>
                <Link href="https://www.linkedin.com/in/louiskrmk/" className="text-lg font-medium hover:scale-110 transition" prefetch={false}>
                  <LinkedinIcon />
                </Link>
                <ModeToggle />
              </nav>
            </div>
          </header>
          <main className={inter.className}>{children}</main>
        </div>
      </ThemeProvider>
      </body>
      </html>
  );
}