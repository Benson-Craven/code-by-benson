import { projects } from "@/app/data/projects"
import ProjectFeature from "./ProjectFeature"

export default function SelectedWork() {
    return (
        <section id="work" className="section-space bg-paper">
            <div className="mx-auto max-w-[1500px]">
                <div className="mb-24 grid gap-6 md:mb-28 md:grid-cols-[0.55fr_1fr] md:items-end">
                    <p className="text-xs font-medium uppercase tracking-[0.22em] text-signal-dark">
                        Selected Work
                    </p>
                    <h2 className="max-w-4xl text-[clamp(3rem,8vw,7.8rem)] font-medium leading-[0.88] tracking-[-0.055em] text-ink">
                        Interfaces for systems with real operational weight.
                    </h2>
                </div>
                <div>
                    {projects.map((project, index) => (
                        <ProjectFeature
                            key={project.slug}
                            project={project}
                            reverse={index % 2 === 1}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}
