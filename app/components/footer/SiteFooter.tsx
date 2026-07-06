import AnimatedLink from "../work/AnimatedLink"

export default function SiteFooter() {
    return (
        <footer className="bg-ink px-4 py-28 text-paper sm:px-6 md:py-40 lg:px-10 lg:py-44">
            <div className="mx-auto grid max-w-[1500px] gap-12 md:grid-cols-[1fr_0.55fr]">
                <div>
                    <p className="mb-5 text-xs font-medium uppercase tracking-[0.22em] text-signal">
                        Next
                    </p>
                    <h2 className="max-w-4xl text-[clamp(3.5rem,9vw,9rem)] font-medium leading-[0.85] tracking-[-0.06em]">
                        Let’s build something worth using.
                    </h2>
                </div>
                <div className="flex flex-col justify-end gap-8">
                    <p className="text-xl leading-relaxed text-paper/68">
                        I’m interested in frontend and product engineering
                        opportunities, particularly teams working on ambitious,
                        technically interesting products.
                    </p>
                    <div className="flex flex-wrap gap-x-7 gap-y-3">
                        <AnimatedLink
                            href="mailto:bensoncraven@hotmail.co.uk"
                            external
                            className="footer-link"
                        >
                            Email
                        </AnimatedLink>
                        <AnimatedLink
                            href="https://www.linkedin.com/in/benson-craven/"
                            external
                            className="footer-link"
                        >
                            LinkedIn
                        </AnimatedLink>
                        <AnimatedLink
                            href="https://github.com/Benson-Craven"
                            external
                            className="footer-link"
                        >
                            GitHub
                        </AnimatedLink>
                    </div>
                </div>
            </div>
        </footer>
    )
}
