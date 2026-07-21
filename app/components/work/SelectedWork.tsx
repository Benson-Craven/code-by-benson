import { implementedPortfolioProjects } from "@/app/data/portfolioProjects"
import ProjectShowcase from "./ProjectShowcase"

export default function SelectedWork() {
    const projects = implementedPortfolioProjects.map((project) => ({
        slug: project.slug,
        title: project.title,
        summary: project.summary,
        availabilityLabel: project.availabilityLabel,
        timeframe: project.timeframe,
        role: project.ownership.role,
        stack: project.stack,
        capabilities: project.capabilities.map(({ label }) => label),
        actions: project.actions,
        cover: project.cover,
    }))

    return (
        <section id="work" className="section-space bg-paper">
            <div className="mx-auto max-w-[1500px]">
                <h2 className="mb-14 text-[clamp(3rem,7vw,6.5rem)] font-medium leading-[0.9] tracking-[-0.05em] text-ink md:mb-16">
                    Selected work
                </h2>
                <ProjectShowcase projects={projects} />
            </div>
        </section>
    )
}
