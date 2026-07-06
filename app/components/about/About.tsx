export default function About() {
    return (
        <section id="about" className="section-space bg-paper">
            <div className="mx-auto grid max-w-[1500px] gap-10 md:grid-cols-[0.55fr_1fr]">
                <p className="text-xs font-medium uppercase tracking-[0.22em] text-signal-dark">
                    About
                </p>
                <div className="max-w-4xl">
                    <h2 className="mb-8 text-[clamp(2.7rem,6vw,6rem)] font-medium leading-[0.94] tracking-[-0.05em] text-ink">
                        A frontend engineer interested in the details people
                        actually feel.
                    </h2>
                    <div className="text-ink/74 grid gap-6 text-xl leading-relaxed md:text-2xl">
                        <p>
                            I’m Benson, a frontend-focused developer based in
                            Cork. I enjoy the point where engineering and
                            product design meet: turning complex behaviour into
                            interfaces that feel obvious.
                        </p>
                        <p>
                            My background spans high-throughput production web
                            work, independent product development and
                            systems-oriented software environments. I work
                            primarily with React, TypeScript and Next.js, with
                            experience integrating backend services and
                            real-time systems.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
