import Image from "next/image"
import type { ReactNode } from "react"
import type { PortfolioProject } from "@/app/data/portfolio"
import AnimatedLink from "./AnimatedLink"

type PortfolioCaseStudyProps = {
    project: PortfolioProject
    nextProject?: Pick<PortfolioProject, "slug" | "title">
}

export default function PortfolioCaseStudy({
    project,
    nextProject,
}: PortfolioCaseStudyProps) {
    const liveSite = project.actions.find(({ kind }) => kind === "live-site")
    const clipDescriptionId = `${project.slug}-clip-description`

    return (
        <main id="main-content" tabIndex={-1}>
            <article>
                <header className="px-4 pb-20 pt-28 sm:px-6 md:pb-28 md:pt-36 lg:px-10">
                    <div className="mx-auto grid max-w-[1500px] gap-12 md:gap-16">
                        <div className="border-ink-subtle flex flex-wrap items-center justify-between gap-4 border-b pb-5">
                            <AnimatedLink href="/#work">
                                Selected work
                            </AnimatedLink>
                            <p className="text-ink-muted max-w-xl text-right text-sm leading-relaxed">
                                {project.availabilityLabel} ·{" "}
                                {project.timeframe}
                            </p>
                        </div>

                        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(20rem,0.38fr)] lg:items-end lg:gap-16">
                            <div>
                                <p className="mb-5 text-sm font-medium text-signal-dark">
                                    Case study
                                </p>
                                <h1 className="max-w-6xl text-[clamp(3.6rem,10vw,10rem)] font-medium leading-[0.84] tracking-[-0.062em] text-ink">
                                    {project.title}
                                </h1>
                            </div>
                            <div className="grid gap-7">
                                <p className="text-ink-secondary text-xl leading-relaxed md:text-2xl">
                                    {project.summary}
                                </p>
                                <ul
                                    aria-label="Capabilities demonstrated"
                                    className="text-ink-muted flex flex-wrap gap-x-4 gap-y-2 text-sm"
                                >
                                    {project.capabilities.map(({ label }) => (
                                        <li key={label}>{label}</li>
                                    ))}
                                </ul>
                                {liveSite?.kind === "live-site" ? (
                                    <div>
                                        <AnimatedLink
                                            href={liveSite.href}
                                            external
                                            emphasis="lead"
                                        >
                                            {liveSite.label}
                                        </AnimatedLink>
                                    </div>
                                ) : null}
                            </div>
                        </div>

                        <nav aria-label="Case study decisions">
                            <ol className="grid gap-5 sm:grid-cols-3 sm:gap-8">
                                {project.caseStudy.decisions.map(
                                    (decision, index) => (
                                        <li key={decision.id}>
                                            <a
                                                href={`#${project.slug}-${decision.id}`}
                                                className="focus-ring group grid gap-2 text-ink transition-colors duration-200 hover:text-signal-dark focus-visible:text-signal-dark"
                                            >
                                                <span className="text-sm text-signal-dark">
                                                    {String(index + 1).padStart(
                                                        2,
                                                        "0",
                                                    )}
                                                </span>
                                                <span className="max-w-sm text-base font-medium leading-snug">
                                                    {decision.title}
                                                </span>
                                            </a>
                                        </li>
                                    ),
                                )}
                            </ol>
                        </nav>

                        <figure className="grid gap-3">
                            <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                                <Image
                                    src={project.cover.src}
                                    alt={project.cover.alt}
                                    fill
                                    priority
                                    sizes="(min-width: 1600px) 1500px, 100vw"
                                    className="object-cover"
                                />
                            </div>
                            {project.cover.caption ? (
                                <figcaption className="text-ink-muted max-w-4xl text-sm leading-relaxed">
                                    {project.cover.caption}
                                </figcaption>
                            ) : null}
                        </figure>
                    </div>
                </header>

                <section
                    aria-labelledby={`${project.slug}-context`}
                    className="px-4 py-24 sm:px-6 md:py-32 lg:px-10"
                >
                    <div className="mx-auto max-w-4xl">
                        <h2
                            id={`${project.slug}-context`}
                            className="mb-10 text-[clamp(2.8rem,6vw,5.5rem)] font-medium leading-[0.92] tracking-[-0.05em] text-ink"
                        >
                            Context
                        </h2>
                        <div className="grid gap-6">
                            {project.caseStudy.context.map((paragraph) => (
                                <p
                                    key={paragraph}
                                    className="text-ink-secondary text-xl leading-relaxed md:text-2xl"
                                >
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </div>
                </section>

                <section
                    aria-labelledby={`${project.slug}-ownership`}
                    className="bg-ink px-4 py-24 text-paper sm:px-6 md:py-32 lg:px-10"
                >
                    <div className="mx-auto grid max-w-[1500px] gap-14 lg:grid-cols-[0.72fr_1fr] lg:gap-20">
                        <div>
                            <h2
                                id={`${project.slug}-ownership`}
                                className="mb-10 text-[clamp(2.8rem,6vw,5.5rem)] font-medium leading-[0.92] tracking-[-0.05em]"
                            >
                                Ownership
                            </h2>
                            <h3 className="max-w-2xl text-2xl font-medium leading-tight md:text-4xl">
                                {project.ownership.role}
                            </h3>
                            <p className="text-paper-muted mt-6 text-sm leading-relaxed">
                                {project.stack.join(" · ")}
                            </p>
                        </div>
                        <div className="grid content-start gap-10">
                            <ul className="grid gap-5">
                                {project.ownership.responsibilities.map(
                                    (responsibility) => (
                                        <li
                                            key={responsibility}
                                            className="text-paper-secondary text-xl leading-relaxed"
                                        >
                                            {responsibility}
                                        </li>
                                    ),
                                )}
                            </ul>
                            {project.ownership.collaborators.length > 0 ? (
                                <ul
                                    aria-label="Collaborators"
                                    className="grid gap-3"
                                >
                                    {project.ownership.collaborators.map(
                                        ({ name, role }) => (
                                            <li
                                                key={`${name}-${role}`}
                                                className="text-paper-secondary text-sm leading-relaxed"
                                            >
                                                <span className="font-medium text-paper">
                                                    {name}
                                                </span>{" "}
                                                · {role}
                                            </li>
                                        ),
                                    )}
                                </ul>
                            ) : null}
                            <div className="grid gap-3">
                                <h3 className="sr-only">
                                    Ownership boundaries
                                </h3>
                                {project.ownership.boundaries.map(
                                    (boundary) => (
                                        <p
                                            key={boundary}
                                            className="text-paper-muted text-sm leading-relaxed"
                                        >
                                            {boundary}
                                        </p>
                                    ),
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <section
                    aria-labelledby={`${project.slug}-constraints`}
                    className="px-4 py-24 sm:px-6 md:py-32 lg:px-10"
                >
                    <div className="mx-auto max-w-[1500px]">
                        <h2
                            id={`${project.slug}-constraints`}
                            className="mb-12 text-[clamp(2.8rem,6vw,5.5rem)] font-medium leading-[0.92] tracking-[-0.05em] text-ink"
                        >
                            Constraints
                        </h2>
                        <ol className="grid gap-x-12 gap-y-10 md:grid-cols-2">
                            {project.caseStudy.constraints.map(
                                (constraint, index) => (
                                    <li
                                        key={constraint}
                                        className="grid content-start gap-3"
                                    >
                                        <span
                                            aria-hidden="true"
                                            className="text-sm font-medium text-signal-dark"
                                        >
                                            {String(index + 1).padStart(2, "0")}
                                        </span>
                                        <span className="text-ink-secondary text-xl leading-relaxed md:text-2xl">
                                            {constraint}
                                        </span>
                                    </li>
                                ),
                            )}
                        </ol>
                    </div>
                </section>

                <section
                    aria-labelledby={`${project.slug}-decisions`}
                    className="px-4 pb-24 sm:px-6 md:pb-36 lg:px-10"
                >
                    <div className="mx-auto max-w-[1500px]">
                        <h2
                            id={`${project.slug}-decisions`}
                            className="mb-16 text-[clamp(2.8rem,6vw,5.5rem)] font-medium leading-[0.92] tracking-[-0.05em] text-ink md:mb-24"
                        >
                            Decisions
                        </h2>

                        <div className="grid gap-24 md:gap-32">
                            {project.caseStudy.decisions.map(
                                (decision, index) => {
                                    const evidence =
                                        project.evidence.stills.find(
                                            ({ id }) =>
                                                id === decision.evidence.id,
                                        )

                                    return (
                                        <section
                                            key={decision.id}
                                            aria-labelledby={`${project.slug}-${decision.id}`}
                                            className="grid gap-8"
                                        >
                                            <div className="grid max-w-5xl gap-4">
                                                <span className="text-sm font-medium text-signal-dark">
                                                    {String(index + 1).padStart(
                                                        2,
                                                        "0",
                                                    )}
                                                </span>
                                                <h3
                                                    id={`${project.slug}-${decision.id}`}
                                                    className="scroll-mt-24 text-[clamp(2.5rem,5vw,5rem)] font-medium leading-[0.94] tracking-[-0.05em] text-ink"
                                                >
                                                    {decision.title}
                                                </h3>
                                            </div>

                                            {evidence ? (
                                                <figure className="grid gap-3">
                                                    <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                                                        <Image
                                                            src={evidence.src}
                                                            alt={evidence.alt}
                                                            fill
                                                            loading="lazy"
                                                            sizes="(min-width: 1600px) 1500px, 100vw"
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <figcaption className="text-ink-muted max-w-4xl text-sm leading-relaxed">
                                                        {evidence.caption}
                                                    </figcaption>
                                                </figure>
                                            ) : null}

                                            <dl className="grid gap-8 md:grid-cols-3 md:gap-10">
                                                <DecisionDetail label="Approach">
                                                    {decision.approach}
                                                </DecisionDetail>
                                                <DecisionDetail label="Trade-off">
                                                    {decision.tradeoff}
                                                </DecisionDetail>
                                                <DecisionDetail label="Why">
                                                    {decision.rationale}
                                                </DecisionDetail>
                                            </dl>
                                        </section>
                                    )
                                },
                            )}
                        </div>
                    </div>
                </section>

                <section
                    aria-labelledby={`${project.slug}-proof`}
                    className="bg-paper-alt px-4 py-24 sm:px-6 md:py-32 lg:px-10"
                >
                    <div className="mx-auto grid max-w-[1500px] gap-10">
                        <div className="grid max-w-4xl gap-7">
                            <h2
                                id={`${project.slug}-proof`}
                                className="text-[clamp(2.8rem,6vw,5.5rem)] font-medium leading-[0.92] tracking-[-0.05em] text-ink"
                            >
                                Proof
                            </h2>
                            <p className="text-ink-secondary text-lg leading-relaxed md:text-xl">
                                {project.caseStudy.proof}
                            </p>
                        </div>

                        <figure className="grid gap-4">
                            <video
                                controls={project.evidence.clip.controls}
                                preload={project.evidence.clip.preload}
                                playsInline={project.evidence.clip.playsInline}
                                muted={project.evidence.clip.muted}
                                autoPlay={project.evidence.clip.autoPlay}
                                poster={project.evidence.clip.poster}
                                aria-describedby={clipDescriptionId}
                                className="aspect-video w-full bg-ink"
                            >
                                <source
                                    src={project.evidence.clip.src}
                                    type="video/mp4"
                                />
                                {project.evidence.clip.captionsSrc ? (
                                    <track
                                        kind="captions"
                                        src={project.evidence.clip.captionsSrc}
                                        srcLang="en"
                                        label="English"
                                        default
                                    />
                                ) : null}
                                Your browser does not support embedded video.
                            </video>
                            <figcaption className="text-ink-secondary max-w-4xl text-sm leading-relaxed">
                                {project.evidence.clip.caption}
                            </figcaption>
                            <p
                                id={clipDescriptionId}
                                className="text-ink-muted max-w-4xl text-sm leading-relaxed"
                            >
                                {project.evidence.clip.description}
                            </p>
                            {project.evidence.clip.transcript ? (
                                <details className="max-w-4xl pt-2">
                                    <summary className="focus-ring cursor-pointer text-sm font-medium text-ink">
                                        Text description
                                    </summary>
                                    <p className="text-ink-secondary mt-4 text-sm leading-relaxed">
                                        {project.evidence.clip.transcript}
                                    </p>
                                </details>
                            ) : null}
                        </figure>
                    </div>
                </section>

                <section
                    aria-labelledby={`${project.slug}-outcomes`}
                    className="bg-ink px-4 py-24 text-paper sm:px-6 md:py-32 lg:px-10"
                >
                    <div className="mx-auto grid max-w-[1500px] gap-12 md:grid-cols-[0.42fr_1fr] md:gap-20">
                        <h2
                            id={`${project.slug}-outcomes`}
                            className="text-[clamp(2.8rem,6vw,5.5rem)] font-medium leading-[0.92] tracking-[-0.05em]"
                        >
                            Outcomes
                        </h2>
                        <ul className="grid content-end gap-7">
                            {project.caseStudy.outcomes.map((outcome) => (
                                <li
                                    key={outcome}
                                    className="text-paper-secondary text-xl leading-relaxed md:text-2xl"
                                >
                                    {outcome}
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                <section
                    aria-labelledby={`${project.slug}-reflection`}
                    className="px-4 py-24 sm:px-6 md:py-32 lg:px-10"
                >
                    <div className="mx-auto max-w-4xl">
                        <h2
                            id={`${project.slug}-reflection`}
                            className="mb-10 text-[clamp(2.8rem,6vw,5.5rem)] font-medium leading-[0.92] tracking-[-0.05em] text-ink"
                        >
                            Reflection
                        </h2>
                        <div className="grid gap-6">
                            {project.caseStudy.reflection.map((paragraph) => (
                                <p
                                    key={paragraph}
                                    className="text-ink-secondary text-xl leading-relaxed md:text-2xl"
                                >
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                        <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4">
                            {nextProject ? (
                                <AnimatedLink
                                    href={`/work/${nextProject.slug}`}
                                    emphasis="lead"
                                >
                                    Next case study · {nextProject.title}
                                </AnimatedLink>
                            ) : null}
                            {liveSite?.kind === "live-site" ? (
                                <AnimatedLink href={liveSite.href} external>
                                    {liveSite.label}
                                </AnimatedLink>
                            ) : null}
                            <AnimatedLink href="/#work">
                                All selected work
                            </AnimatedLink>
                        </div>
                    </div>
                </section>
            </article>
        </main>
    )
}

function DecisionDetail({
    label,
    children,
}: {
    label: string
    children: ReactNode
}) {
    return (
        <div>
            <dt className="text-ink-muted mb-3 text-sm font-medium">{label}</dt>
            <dd className="text-ink-secondary text-lg leading-relaxed">
                {children}
            </dd>
        </div>
    )
}
