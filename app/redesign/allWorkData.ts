import { implementedPortfolioProjects } from "../data/portfolioProjects"
import { getProjectTint } from "./projectDetailData"
import { projectDetailPath } from "./projectNavigation"

export type AllWorkProject = {
    slug: string
    title: string
    timeframe: string
    href: string
    tint: string
    cover: {
        src: string
        alt: string
        width: number
        height: number
    }
    layout: "wide" | "half"
}

// The reference grid alternates wide and half-width cards on phones. Three
// projects produce one wide card followed by a pair, and one even row on
// desktop.
export const allWorkProjects: AllWorkProject[] =
    implementedPortfolioProjects.map((project, index) => ({
        slug: project.slug,
        title: project.title,
        timeframe: project.timeframe,
        href: projectDetailPath(project.slug),
        tint: getProjectTint(project.slug),
        cover: {
            src: project.cover.src,
            alt: project.cover.alt,
            width: project.cover.width,
            height: project.cover.height,
        },
        layout: index === 0 ? "wide" : "half",
    }))

export function allWorkCountLabel(count = allWorkProjects.length) {
    return `${count} ${count === 1 ? "project" : "projects"}`
}
