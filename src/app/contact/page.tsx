import Link from "next/link";
import {LocateIcon, MailIcon} from "lucide-react";

export default function Contact() {
    return (
        <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container grid gap-8 px-4 md:px-6 lg:grid-cols-2 lg:gap-12 mx-auto">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-secondary">Contactez-moi</h2>
                        <p className="text-muted-foreground md:text-xl/relaxed">
                            N&apos;hésitez pas à me contacter pour toute demande ou collaboration.
                        </p>
                        <div className="flex items-center gap-4">
                            <MailIcon className="w-6 h-6 text-secondary"/>
                            <a href="mailto:louis.karamucki@outlook.fr"
                               className="text-primary-foreground hover:underline">
                                louis.karamucki@outlook.fr
                            </a>
                        </div>
                        <div className="flex items-center gap-4">
                            <LocateIcon className="w-6 h-6 text-secondary"/>
                            <span className="text-primary-foreground">Nord-Pas-De-Calais, France</span>
                        </div>
                    </div>

                </div>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-secondary">Télécharger
                            mon CV</h2>
                        <p className="text-muted-foreground md:text-xl/relaxed">
                            Cliquez sur le bouton ci-dessous pour télécharger mon CV au format PDF.
                        </p>
                    </div>
                    <Link
                        href="https://drive.google.com/file/d/1R2NlawC4Pe7JuSoMppkOclkfvtlaw-mh/view?usp=sharing"
                        target="_blank"
                        download
                        className="inline-flex h-10 items-center justify-center rounded-md bg-card px-8 text-sm font-medium
                text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none
                focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                        prefetch={false}
                    >
                        Visualiser CV
                    </Link>
                </div>
            </div>
        </section>
    )
}
