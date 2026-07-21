import Image from "next/image"

export default function About() {
    return (
        <section id="about" className="section-space bg-paper">
            <div className="mx-auto max-w-[1500px]">
                <h2 className="mb-16 text-[clamp(3rem,7vw,6.5rem)] font-medium leading-[0.9] tracking-[-0.05em] text-ink md:mb-20">
                    About
                </h2>
                <div className="grid gap-10 md:grid-cols-[minmax(16rem,0.62fr)_minmax(0,1fr)] md:items-start md:gap-16 lg:gap-24">
                    <figure className="grid max-w-xl gap-3">
                        <div className="relative aspect-[2/3] overflow-hidden bg-muted">
                            <Image
                                src="/images/portrait.avif"
                                alt="Portrait of Benson Craven"
                                fill
                                sizes="(min-width: 768px) 38vw, 100vw"
                                className="object-cover"
                            />
                        </div>
                    </figure>
                    <div className="text-ink-secondary grid max-w-4xl gap-6 text-xl leading-relaxed md:pt-1 md:text-2xl">
                        <p>
                            I’m Benson, a Frontend Engineer based in Cork. I
                            work on the awkward parts of products: unclear
                            states, dense content, unreliable data and the gap
                            between a design and its working implementation.
                        </p>
                        <p>
                            I build primarily with React, TypeScript and
                            Next.js, creating thoughtful, reliable digital
                            products from early requirements through to
                            deployment.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
