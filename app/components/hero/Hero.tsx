import Image from "next/image"
import Link from "next/link"
import LocalTime from "./LocalTime"
import AnimatedLink from "../work/AnimatedLink"
import ShaderBackground from "./ShaderBackground"

export default function Hero() {
    return (
        <section className="relative isolate min-h-[100svh] overflow-hidden border-b border-ink/10 bg-paper pt-16">
            <ShaderBackground />
            <div className="relative z-10 mx-auto grid min-h-[calc(100svh-4rem)] max-w-[1500px] content-between gap-16 px-4 pb-8 pt-12 sm:px-6 md:gap-20 md:pt-[4.5rem] lg:px-10">
                <div>
                    <p className="mb-7 text-xs font-medium uppercase tracking-[0.22em] text-signal-dark">
                        Frontend Engineer
                    </p>
                    <h1 className="text-balance text-[clamp(2.3rem,8.2vw,8rem)] font-medium leading-[0.88] tracking-[-0.048em] text-ink sm:tracking-[-0.055em]">
                        I build interfaces that make complex systems feel
                        simple.
                    </h1>
                </div>
                <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(19rem,0.42fr)] lg:items-end lg:gap-20">
                    <div className="grid max-w-3xl gap-8">
                        <p className="text-ink-secondary max-w-[43ch] text-xl leading-relaxed tracking-tight md:text-2xl">
                            I’m Benson{" "}
                            <Link
                                href="/#about"
                                className="focus-ring inline-flex align-baseline"
                                aria-label="Jump to the about section"
                            >
                                <Image
                                    src="/images/portrait.avif"
                                    alt="Portrait of Benson Craven"
                                    width={34}
                                    height={34}
                                    className="border-ink-subtle mx-1 inline-block size-8 rounded-full border object-cover align-[-0.28em] sm:size-[2.125rem]"
                                />
                            </Link>{" "}
                            I take product requirements through to responsive,
                            accessible interfaces with React, TypeScript and
                            Next.js.
                        </p>
                        <div className="flex flex-col items-start gap-5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8">
                            <AnimatedLink
                                href="mailto:bensoncraven@hotmail.co.uk"
                                external
                            >
                                bensoncraven@hotmail.co.uk
                            </AnimatedLink>
                            <AnimatedLink href="#work">
                                View selected work
                            </AnimatedLink>
                            <AnimatedLink href="/benson-craven-resume.pdf">
                                Resume
                            </AnimatedLink>
                        </div>
                    </div>
                    <div className="border-ink-faint text-ink-muted grid gap-3 border-t pt-5 text-xs leading-snug sm:grid-cols-2 lg:grid-cols-1">
                        <span>Based in Cork, Ireland</span>
                        <LocalTime />
                    </div>
                </div>
            </div>
        </section>
    )
}
