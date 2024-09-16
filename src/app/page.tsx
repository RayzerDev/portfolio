import Image from "next/image";

export default function Home() {
  return (
      <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
              <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_550px]">
                  <div className="flex flex-col justify-center space-y-4">
                      <div className="space-y-2">
                          <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">Louis Karamucki</h1>
                          <p className="max-w-[600px] text-muted-foreground md:text-xl">
                              En 3ème année de BUT Informatique.
                              Découvrez mon parcours, mes compétences ainsi que mes projets.
                          </p>
                      </div>
                  </div>
                  <Image
                      src="/portfolio/blob.svg"
                      width="550"
                      height="550"
                      alt="Logo"
                  />
              </div>
          </div>
      </section>
  );
}
