import { depthItems, experience } from "@/app/data/experience"

export default function Experience() {
    return (
        <>
            <section id="experience" className="section-space bg-paper">
                <div className="mx-auto max-w-[1500px]">
                    <div className="mb-24 grid gap-6 md:mb-28 md:grid-cols-[0.55fr_1fr]">
                        <p className="text-xs font-medium uppercase tracking-[0.22em] text-signal-dark">
                            Experience
                        </p>
                        <h2 className="max-w-4xl text-[clamp(2.8rem,7vw,7rem)] font-medium leading-[0.9] tracking-[-0.05em] text-ink">
                            Practical delivery across product and platform work.
                        </h2>
                    </div>
                    <div className="grid border-t border-ink/18">
                        {experience.map((entry) => (
                            <article
                                key={`${entry.title}-${entry.company}`}
                                className="grid gap-8 border-b border-ink/18 py-12 md:grid-cols-[0.5fr_1fr] md:py-16"
                            >
                                <div>
                                    <h3 className="text-3xl font-medium tracking-tight text-ink md:text-5xl">
                                        {entry.title}
                                    </h3>
                                    <p className="mt-2 text-sm uppercase tracking-[0.16em] text-signal-dark">
                                        {entry.company}
                                    </p>
                                </div>
                                <div className="grid gap-6">
                                    <p className="max-w-3xl text-xl leading-relaxed text-ink/76">
                                        {entry.summary}
                                    </p>
                                    <ul className="grid gap-4 text-base leading-relaxed text-ink/68">
                                        {entry.points.map((point) => (
                                            <li
                                                key={point}
                                                className="grid grid-cols-[1rem_1fr] gap-3"
                                            >
                                                <span
                                                    aria-hidden="true"
                                                    className="mt-3 h-px bg-signal"
                                                />
                                                <span>{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
            <TechnicalDepth />
            <ProofStrip />
        </>
    )
}

function TechnicalDepth() {
    return (
        <section className="section-space bg-[#e7e1d6]">
            <div className="mx-auto max-w-[1500px]">
                <div className="mb-24 grid gap-6 md:mb-28 md:grid-cols-[0.55fr_1fr]">
                    <p className="text-xs font-medium uppercase tracking-[0.22em] text-signal-dark">
                        Technical Depth
                    </p>
                    <h2 className="max-w-4xl text-[clamp(2.6rem,6vw,6.2rem)] font-medium leading-[0.92] tracking-[-0.05em] text-ink">
                        Engineering beyond the happy path.
                    </h2>
                </div>
                <div className="grid border-t border-ink/18 md:grid-cols-3">
                    {depthItems.map((item) => (
                        <article
                            key={item.title}
                            className="border-b border-ink/18 py-12 md:border-r md:px-7 md:py-14 md:last:border-r-0"
                        >
                            <h3 className="mb-5 text-2xl font-medium tracking-tight text-ink">
                                {item.title}
                            </h3>
                            <p className="text-lg leading-relaxed text-ink/70">
                                {item.copy}
                            </p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}

function ProofStrip() {
    const items = [
        ["Currently", "Web Developer · First Page"],
        ["Focus", "React · TypeScript · Product Engineering"],
        ["Based", "Cork, Ireland"],
    ]

    return (
        <section className="bg-ink px-4 py-16 text-paper sm:px-6 md:py-20 lg:px-10">
            <div className="mx-auto grid max-w-[1500px] gap-5 md:grid-cols-3">
                {items.map(([label, value]) => (
                    <div
                        key={label}
                        className="grid gap-2 border-t border-paper/18 pt-4"
                    >
                        <span className="text-xs uppercase tracking-[0.18em] text-signal">
                            {label}
                        </span>
                        <span className="text-xl tracking-tight text-paper/88">
                            {value}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    )
}
