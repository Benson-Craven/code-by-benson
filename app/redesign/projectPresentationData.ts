import { implementedPortfolioProjects } from "../data/portfolioProjects"

export const heldPresentationQuery =
    "(min-width: 1024px) and (min-height: 700px) and (pointer: fine) and (prefers-reduced-motion: no-preference)"

type PreviewMedia = {
    src: string
    alt: string
    label: string
    position?: string
}
export type ProjectPresentationData = {
    slug: string
    title: string
    href: string
    side: "left" | "right"
    bubbles: [string, string, string]
    desktop: [PreviewMedia, PreviewMedia, PreviewMedia]
    phone: { front: PreviewMedia; back: PreviewMedia }
}
const bubbles: [string, string, string][] = [
    [
        "A healthcare website that helps patients find pain science, treatment information and consultation routes.",
        "Benson designed the interface, built the Next.js frontend and prepared the production deployment.",
        "Reusable sections bring headings, image descriptions and FAQ schema into the page structure.",
    ],
    [
        "A food and travel site for Nifa's recipes and stories. Nifa owns the writing, photography and editorial direction.",
        "Benson built the Next.js frontend and Sanity content architecture, including private previews.",
        "A separate recipe ready state lets Nifa keep rough notes without publishing incomplete recipes.",
    ],
    [
        "An unpublished record-collecting app that brings collection, shelf and buying information together.",
        "Benson built the product interface, server-side Spotify OAuth, Discogs integration and Postgres storage.",
        "Deterministic matching scores release confidence before price and availability rank buying options.",
    ],
]
export const projectPresentations: ProjectPresentationData[] =
    implementedPortfolioProjects.map((project, index) => {
        const cover: PreviewMedia = { ...project.cover, label: "Homepage" }
        const desktop: ProjectPresentationData["desktop"] =
            index === 0
                ? ([
                      cover,
                      ...["conditions-system", "science-structure"].map(
                          (id) => {
                              const still = project.evidence.stills.find(
                                  (item) => item.id === id,
                              )!
                              return {
                                  src: still.src,
                                  alt: still.alt,
                                  label:
                                      id === "conditions-system"
                                          ? "Conditions"
                                          : "Science",
                              }
                          },
                      ),
                  ] as ProjectPresentationData["desktop"])
                : (["top", "center", "bottom"].map((position, i) => ({
                      ...cover,
                      position,
                      label: `Temporary cover view ${i + 1} of 3`,
                  })) as ProjectPresentationData["desktop"])
        const phone = {
            ...cover,
            position: "center top",
            label: "Temporary phone crop",
        }
        return {
            slug: project.slug,
            title: project.title,
            href: project.actions.find(
                (action) => action.kind === "case-study",
            )!.href,
            side: index === 1 ? "right" : "left",
            bubbles: bubbles[index],
            desktop,
            phone: { front: { ...phone }, back: { ...phone } },
        }
    })

const ramp = (value: number, start: number, end: number) =>
    Math.max(0, Math.min(1, (value - start) / (end - start)))

export function presentationProgress(progress: number) {
    const first = ramp(progress, 0.25, 0.4)
    const second = ramp(progress, 0.65, 0.8)
    return {
        screen: first + second,
        phoneRotation: first * 180,
        bubbles: [
            1 - ramp(first, 0, 0.5),
            ramp(first, 0.5, 1) * (1 - ramp(second, 0, 0.5)),
            ramp(second, 0.5, 1) * (1 - ramp(progress, 0.92, 1)),
        ],
    }
}
