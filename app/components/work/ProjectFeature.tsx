import type { Project } from "@/app/data/projects"
import AnimatedLink from "./AnimatedLink"
import ProjectMeta from "./ProjectMeta"
import ProjectVisual from "./ProjectVisual"

type ProjectFeatureProps = {
    project: Project
    reverse?: boolean
}

export default function ProjectFeature({
    project,
    reverse = false,
}: ProjectFeatureProps) {
    return (
        <article className="border-t border-ink/18 py-16 md:py-24">
            <div
                className={`grid gap-8 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)] lg:gap-12 ${
                    reverse ? "lg:[&>*:first-child]:order-2" : ""
                }`}
            >
                <div className="flex flex-col justify-between gap-10">
                    <div>
                        <div className="mb-6 flex items-start justify-between gap-5">
                            <span className="text-sm font-medium text-signal">
                                {project.number}
                            </span>
                            <ul className="flex flex-wrap justify-end gap-2">
                                {project.signals.map((signal) => (
                                    <li
                                        key={signal}
                                        className="border border-ink/16 px-2.5 py-1 text-[0.63rem] font-medium uppercase tracking-[0.16em] text-ink/58"
                                    >
                                        {signal}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <h3 className="max-w-2xl text-[clamp(2.4rem,6vw,5.8rem)] font-medium leading-[0.9] tracking-[-0.05em] text-ink">
                            {project.title}
                        </h3>
                    </div>
                    <div className="grid gap-6">
                        <p className="max-w-xl text-lg leading-relaxed text-ink/74 md:text-xl">
                            {project.description}
                        </p>
                        <ProjectMeta
                            label={project.roleLabel}
                            value={project.role}
                            tags={project.tags}
                        />
                        <div className="flex flex-wrap gap-x-7 gap-y-3 pt-1">
                            {project.actions.map((action) => (
                                <AnimatedLink
                                    key={action.label}
                                    href={action.href}
                                    external={action.external}
                                >
                                    {action.label}
                                </AnimatedLink>
                            ))}
                        </div>
                    </div>
                </div>
                <ProjectVisual project={project} />
            </div>
        </article>
    )
}
