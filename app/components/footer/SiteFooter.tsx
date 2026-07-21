import AnimatedLink from "../work/AnimatedLink"

export default function SiteFooter() {
    return (
        <footer className="bg-ink px-4 py-28 text-paper sm:px-6 md:py-40 lg:px-10 lg:py-44">
            <div className="mx-auto grid max-w-[1500px] gap-12 md:grid-cols-[1fr_0.55fr]">
                <div>
                    <h2 className="max-w-4xl text-[clamp(3.5rem,9vw,8rem)] font-medium leading-[0.85] tracking-[-0.06em]">
                        Contact
                    </h2>
                </div>
                <div className="flex flex-col justify-end gap-8">
                    <p className="text-paper-muted text-xl leading-relaxed">
                        I’m looking for a Frontend Engineer role on a product
                        team that cares about accessibility, clear states and
                        what ships to users.
                    </p>
                    <div>
                        <AnimatedLink
                            href="mailto:bensoncraven@hotmail.co.uk"
                            external
                            emphasis="lead"
                            className="footer-link"
                        >
                            bensoncraven@hotmail.co.uk
                        </AnimatedLink>
                    </div>
                    <div className="flex flex-wrap gap-x-7 gap-y-3">
                        <AnimatedLink
                            href="/benson-craven-resume.pdf"
                            className="footer-link"
                        >
                            Resume
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
