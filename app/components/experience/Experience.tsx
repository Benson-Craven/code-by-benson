import { experience } from "@/app/data/experience"

export default function Experience() {
    return (
        <section id="experience" className="section-space bg-paper-alt">
            <div className="mx-auto max-w-[1500px]">
                <h2 className="mb-16 text-[clamp(3rem,7vw,6.5rem)] font-medium leading-[0.9] tracking-[-0.05em] text-ink md:mb-20">
                    Experience
                </h2>
                <ol className="border-ink-subtle grid border-t">
                    {experience.map((entry, index) => (
                        <li
                            key={`${entry.title}-${entry.company}`}
                            className="border-ink-subtle grid gap-6 border-b py-10 md:grid-cols-[4rem_minmax(15rem,0.55fr)_1fr] md:gap-8 md:py-12"
                        >
                            <span className="text-sm font-medium text-signal-dark">
                                {String(index + 1).padStart(2, "0")}
                            </span>
                            <div>
                                <h3 className="text-3xl font-medium tracking-tight text-ink md:text-4xl">
                                    {entry.title}
                                </h3>
                                <p className="mt-2 text-sm uppercase tracking-[0.16em] text-signal-dark">
                                    {entry.company}
                                </p>
                                <p className="text-ink-muted mt-2 text-sm uppercase tracking-[0.14em]">
                                    {entry.period}
                                </p>
                            </div>
                            <p className="text-ink-secondary max-w-3xl text-lg leading-relaxed md:text-xl">
                                {entry.summary}
                            </p>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    )
}
