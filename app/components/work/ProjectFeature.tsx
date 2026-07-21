import Image from "next/image"
import type { PortfolioProject } from "@/app/data/portfolio"
import AnimatedLink from "./AnimatedLink"

type ProjectFeatureProps = {
    project: PortfolioProject
    reverse?: boolean
    priority?: boolean
}

export default function ProjectFeature({
    project,
    reverse = false,
    priority = false,
}: ProjectFeatureProps) {
    return (
        <article className="border-ink-subtle border-t py-16 md:py-24">
            <div
                className={`grid gap-8 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)] lg:gap-12 ${
                    reverse ? "lg:[&>*:first-child]:order-2" : ""
                }`}
            >
                <div className="flex flex-col justify-between gap-10">
                    <div>
                        <div className="mb-6 flex items-start justify-between gap-5">
                            <span className="text-sm font-medium text-signal-dark">
                                {String(project.order).padStart(2, "0")}
                            </span>
                            <p className="text-ink-muted max-w-xs text-right text-sm leading-relaxed">
                                {project.availabilityLabel} ·{" "}
                                {project.timeframe}
                            </p>
                        </div>
                        <h3 className="max-w-2xl text-[clamp(2.4rem,6vw,5.8rem)] font-medium leading-[0.9] tracking-[-0.05em] text-ink">
                            {project.title}
                        </h3>
                    </div>
                    <div className="grid gap-6">
                        <p className="text-ink-secondary max-w-xl text-lg leading-relaxed md:text-xl">
                            {project.summary}
                        </p>
                        <dl className="border-ink-subtle grid gap-4 border-t pt-5 sm:grid-cols-[0.7fr_1fr]">
                            <div>
                                <dt className="sr-only">Role</dt>
                                <dd className="text-ink-secondary max-w-sm text-sm leading-relaxed">
                                    {project.ownership.role}
                                </dd>
                            </div>
                            <div>
                                <dt className="sr-only">Technology</dt>
                                <dd>
                                    <ul className="text-ink-secondary flex flex-wrap gap-x-4 gap-y-2 text-sm">
                                        {project.stack.map((item) => (
                                            <li key={item}>{item}</li>
                                        ))}
                                    </ul>
                                </dd>
                            </div>
                        </dl>
                        <ul
                            aria-label="Capabilities shown"
                            className="text-ink-muted flex flex-wrap gap-x-4 gap-y-2 text-sm"
                        >
                            {project.capabilities.map(({ label }) => (
                                <li key={label}>{label}</li>
                            ))}
                        </ul>
                        <div className="flex flex-wrap gap-x-7 gap-y-3 pt-1">
                            {project.actions.map((action) => (
                                <AnimatedLink
                                    key={`${action.kind}-${action.label}`}
                                    href={action.href}
                                    external={
                                        action.kind === "live-site" ||
                                        action.kind === "source"
                                    }
                                    emphasis={
                                        action.kind === "case-study"
                                            ? "lead"
                                            : "supporting"
                                    }
                                >
                                    {action.label}
                                </AnimatedLink>
                            ))}
                        </div>
                    </div>
                </div>
                <figure className="grid content-start gap-3">
                    <div className="project-visual border-ink-subtle relative aspect-[16/10] overflow-hidden border bg-muted">
                        <Image
                            src={project.cover.src}
                            alt={project.cover.alt}
                            fill
                            priority={priority}
                            sizes="(min-width: 1024px) 54vw, 100vw"
                            className="object-cover"
                        />
                    </div>
                    {project.cover.caption ? (
                        <figcaption className="text-ink-muted max-w-2xl text-sm leading-relaxed">
                            {project.cover.caption}
                        </figcaption>
                    ) : null}
                </figure>
            </div>
        </article>
    )
}
