import AnimatedLink from "../work/AnimatedLink"
import ShaderBackground from "./ShaderBackground"

export default function Hero() {
    return (
        <section className="relative isolate min-h-[100svh] overflow-hidden border-b border-ink/10 bg-paper pt-16">
            <ShaderBackground />
            <div className="relative z-10 mx-auto grid min-h-[calc(100svh-4rem)] max-w-[1500px] content-between px-4 pb-8 pt-12 sm:px-6 md:pt-18 lg:px-10">
                <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(300px,0.6fr)]">
                    <div className="max-w-5xl">
                        <p className="mb-7 text-xs font-medium uppercase tracking-[0.22em] text-signal-dark">
                            Frontend Engineer
                        </p>
                        <h1 className="max-w-[7.7ch] text-[clamp(2.85rem,11.4vw,9.6rem)] font-medium leading-[0.88] tracking-[-0.045em] text-ink text-balance sm:max-w-[10.8ch] sm:text-[clamp(4rem,11.5vw,9.6rem)] sm:tracking-[-0.05em] lg:leading-[0.84]">
                            I build interfaces that make complex systems feel
                            simple.
                        </h1>
                    </div>
                    <div className="flex min-w-0 max-w-md flex-col justify-end gap-8 justify-self-start pb-1 lg:max-w-sm lg:justify-self-end xl:max-w-md">
                        <p className="max-w-[30ch] text-xl leading-snug tracking-tight text-ink/78 md:text-2xl">
                            Frontend-focused engineer working across React,
                            TypeScript and real-time product experiences.
                        </p>
                        <div className="grid min-w-0 gap-5 border-l border-ink/20 pl-5">
                            <p className="text-xs font-medium uppercase tracking-[0.18em] text-ink/56">
                                Based in Cork, Ireland
                            </p>
                            <div className="flex flex-wrap gap-x-7 gap-y-3">
                                <AnimatedLink href="#work">
                                    View selected work
                                </AnimatedLink>
                                <AnimatedLink
                                    href="https://github.com/Benson-Craven"
                                    external
                                >
                                    GitHub
                                </AnimatedLink>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-12 grid gap-4 border-t border-ink/12 pt-5 text-[0.68rem] uppercase leading-snug tracking-[0.16em] text-ink/54 sm:grid-cols-3 sm:text-xs">
                    <span>Complex systems, made legible.</span>
                    <span>React · Next.js · TypeScript</span>
                    <span className="sm:text-right">
                        Product detail · Production discipline
                    </span>
                </div>
            </div>
        </section>
    )
}
