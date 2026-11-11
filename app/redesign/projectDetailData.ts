import {
    getPortfolioProject,
    implementedPortfolioProjects,
} from "../data/portfolioProjects"
import type { PortfolioProject, PortfolioProjectSlug } from "../data/portfolio"

// Each project keeps the colour it already uses in the scroll presentations.
export const projectTints: Record<PortfolioProjectSlug, string> = {
    "chronic-pain-recovery": "#08d9d6",
    "nibbles-with-nifa": "#ff2e63",
    waxlist: "#ffe506",
}

export type ProjectPreviewCopy = {
    // A short fact about the project, then first-person copy in the voice the
    // reference site uses on its project pages.
    lead: string
    note: string
    // A short, human aside. It stays first-person and grounded in the case
    // study facts rather than adding new claims about the work.
    personal: {
        heading: string
        body: string
    }
}

// Preview-only wording. Every claim restates facts already held in the typed
// portfolio content, and the evidence notes stay with the media they describe.
export const projectPreviewCopy: Record<
    PortfolioProjectSlug,
    ProjectPreviewCopy
> = {
    "chronic-pain-recovery": {
        lead: "Chronic Pain Recovery helps people understand persistent pain and find a route into treatment.",
        note: "I designed the information architecture, built the Next.js frontend and shipped the site to production. It starts from the questions patients actually ask, so conditions, treatments and consultation routes sit in the order people look for them.",
        personal: {
            heading: "The quiet parts did the most work.",
            body: "Chronic Pain Recovery was never going to win anyone over with motion or colour. The job was to make a difficult subject feel less heavy, so the work went into the page order and the heading wording. The orange consultation link is the one bright thing, and it is bright for a reason.",
        },
    },
    "nibbles-with-nifa": {
        lead: "Nibbles with Nifa is a recipe site where Nifa publishes what she actually cooks.",
        note: "I built the Next.js frontend and the Sanity content model, and Nifa writes and publishes the recipes. Drafts stay private until a recipe is ready. The screenshots here come from the current public site.",
        personal: {
            heading: "The best part was handing it over.",
            body: "I built the publishing flow so Nifa can write a recipe, mark it ready and put it live without asking me to touch a template. The strict ready state does the boring checking, so a rough note can still become something a reader can cook from. She owns the food and the words.",
        },
    },
    waxlist: {
        lead: "Waxlist is a record-collecting app for people who buy second-hand vinyl.",
        note: "I designed the product and built the app: one workspace for the collection, shelf and buying notes, with Spotify albums matched to Discogs releases. It is still in development, and these stills come from a local build with invented records.",
        personal: {
            heading: "I would rather show less than guess.",
            body: "Waxlist is the kind of project where the unglamorous decisions do the real work. A record has to be right before price means anything, so 75 is the line for a reliable match. Missing shipping stays missing. I would rather show less than dress up a weak match as a bargain.",
        },
    },
}

export type RedesignProjectPage = {
    project: PortfolioProject
    nextProject: PortfolioProject
    tint: string
    nextTint: string
    preview: ProjectPreviewCopy
}

export function getProjectTint(slug: PortfolioProjectSlug) {
    return projectTints[slug]
}

export function getRedesignProjectPage(
    slug: string,
): RedesignProjectPage | undefined {
    const project = getPortfolioProject(slug)
    if (!project) return undefined

    const index = implementedPortfolioProjects.findIndex(
        (item) => item.slug === project.slug,
    )
    const nextProject =
        implementedPortfolioProjects[
            (index + 1) % implementedPortfolioProjects.length
        ]

    return {
        project,
        nextProject,
        tint: getProjectTint(project.slug),
        nextTint: getProjectTint(nextProject.slug),
        preview: projectPreviewCopy[project.slug],
    }
}
