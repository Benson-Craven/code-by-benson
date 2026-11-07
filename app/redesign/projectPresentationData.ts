import { implementedPortfolioProjects } from "../data/portfolioProjects"
import { projectDetailPath } from "./projectNavigation"
import { projectTints } from "./projectDetailData"

export const heldPresentationQuery =
    "(min-width: 1024px) and (min-height: 700px) and (pointer: fine) and (prefers-reduced-motion: no-preference)"

export type PreviewMedia = {
    type?: "image" | "video"
    poster?: string
    src: string
    alt: string
    label: string
    position?: string
    width?: number
    height?: number
}
export type ProjectPresentationData = {
    slug: string
    title: string
    href: string
    tint: string
    side: "left" | "right"
    bubbles: [string, string, string]
    desktop: [PreviewMedia, PreviewMedia, PreviewMedia]
    phone: { front: PreviewMedia; back: PreviewMedia }
    // How much of the media set the homepage showcase renders. CPRIE cycles
    // all three desktop views and both phone faces, Waxlist cycles its three
    // desktop views with the front phone, and Nibbles shows its single live
    // view here while reserving extra desktop slots for its project page.
    showcase: { desktop: 1 | 3; phone: ("front" | "back")[] }
}
// Override individual device slots here. Omitted slots keep their existing media.
export const showcaseMedia: Record<
    string,
    {
        desktop?: Partial<Record<0 | 1 | 2, PreviewMedia>>
        mobile?: Partial<Record<"front" | "back", PreviewMedia>>
    }
> = {
    "chronic-pain-recovery": {
        desktop: {
            0: {
                type: "video",
                src: "/images/chronic-pain-recovery/cprie-hp-1-vid.mp4",
                width: 1470,
                height: 802,
                poster: implementedPortfolioProjects[0].cover.src,
                alt: "Chronic Pain Recovery desktop homepage walkthrough",
                label: "Homepage",
            },
            1: {
                type: "video",
                src: "/images/chronic-pain-recovery/cprie-hp-2.mp4",
                width: 1470,
                height: 802,
                poster: "/images/chronic-pain-recovery/conditions.webp",
                alt: "Chronic Pain Recovery conditions section showing image-backed cards for chronic pain, musculoskeletal, head and facial, and gastrointestinal concerns.",
                label: "Conditions",
            },
            2: {
                type: "video",
                src: "/images/chronic-pain-recovery/cprie-hp-3.mp4",
                width: 1470,
                height: 802,
                poster: "/images/chronic-pain-recovery/science.webp",
                alt: "Chronic Pain Recovery science section with an explanatory heading, summary, treatment image, signal explanation, and treatment-path card.",
                label: "Science",
            },
        },
        mobile: {
            front: {
                type: "video",
                src: "/images/chronic-pain-recovery/cprie-hp-1-mobile.mp4",
                poster: "/images/chronic-pain-recovery/cprie-hp-1-mobile-sc.png",
                alt: "Chronic Pain Recovery mobile homepage walkthrough",
                label: "Mobile homepage",
                position: "center top",
            },
            back: {
                type: "video",
                src: "/images/chronic-pain-recovery/cprie-hp-1-mobile-2.mp4",
                alt: "Chronic Pain Recovery mobile homepage",
                label: "Mobile homepage",
                position: "center top",
            },
        },
    },
    "nibbles-with-nifa": {
        desktop: {
            0: {
                type: "video",
                src: "/images/nibbles-with-nifa/nwn-hp-1.mp4",
                width: 1470,
                height: 802,
                poster: implementedPortfolioProjects[1].cover.src,
                alt: "Nibbles with Nifa desktop homepage walkthrough",
                label: "Homepage",
            },
            1: {
                type: "image",
                src: "/images/nibbles-with-nifa/recipes.webp",
                width: 1440,
                height: 900,
                alt: "Nibbles with Nifa recipe index with the heading 'What shall we eat?', a short introduction and three recipe cards.",
                label: "Recipes",
            },
            2: {
                type: "image",
                src: "/images/nibbles-with-nifa/travel-feature.webp",
                width: 1440,
                height: 900,
                alt: "Nibbles with Nifa travel feature with a Japan street photograph and a link to the travel stories.",
                label: "Travel",
            },
        },
        mobile: {
            front: {
                type: "video",
                src: "/images/nibbles-with-nifa/nwn-mobile-1.mp4",
                poster: "/images/nibbles-with-nifa/nwn-1.png",
                alt: "Nibbles with Nifa mobile homepage walkthrough",
                label: "Mobile homepage",
                position: "center top",
            },
        },
    },
    waxlist: {
        desktop: {
            0: {
                type: "video",
                src: "/images/waxlist/waxlist-1.mp4",
                width: 1470,
                height: 802,
                poster: implementedPortfolioProjects[2].cover.src,
                alt: "Waxlist desktop homepage walkthrough",
                label: "Homepage",
            },
            1: {
                type: "video",
                src: "/images/waxlist/waxlist-4.mp4",
                width: 1470,
                height: 802,
                alt: "Waxlist collection view with a grid of invented vinyl records, a featured record and the selected-record inspector.",
                label: "Collection",
            },
            2: {
                type: "video",
                src: "/images/waxlist/waxlist-3.mp4",
                width: 1470,
                height: 802,
                alt: "Waxlist privacy policy explaining what the app collects, how data is used, what it stores and how to delete account data.",
                label: "Privacy",
            },
        },
        mobile: {
            front: {
                type: "image",
                src: "/images/waxlist/waxlist-2.png",
                poster: implementedPortfolioProjects[2].cover.src,
                alt: "Waxlist mobile homepage walkthrough",
                label: "Mobile homepage",
                position: "center top",
            },
        },
    },
}

const bubbles: [string, string, string][] = [
    [
        "Oh, this one's Chronic Pain Recovery! Benson built their website to help people find the support they need.",
        "He built the whole thing with Next.js, including all the clever bits you don't see behind the scenes.",
        "Go on, have a little look for yourself. I'll be here.",
    ],
    [
        "Ooh, this one's Nibbles with Nifa! It's all about good food, recipes and little adventures.",
        "Benson built it with Next.js and Sanity, so Nifa can add recipes and travel stories whenever she likes.",
        "I'm getting hungry just looking at it. Go on, have a nose around!",
    ],
    [
        "You'll like this one! Waxlist helps vinyl lovers discover records based on what they listen to on Spotify.",
        "Benson's been building it with Next.js, connecting Spotify and Discogs to help you find records worth adding to your collection.",
        "Careful, though. One minute you're browsing, the next you've got ten records on your wishlist. Don't blame me!",
    ],
]
export const projectPresentations: ProjectPresentationData[] =
    implementedPortfolioProjects.map((project, index) => {
        const cover: PreviewMedia = {
            ...project.cover,
            label: "Homepage",
            width: index === 0 ? 1440 : 1918,
            height: index === 0 ? 900 : index === 1 ? 951 : 900,
        }
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
        }
        const media = showcaseMedia[project.slug]
        const cyclesDesktop =
            project.slug === "chronic-pain-recovery" ||
            project.slug === "waxlist"
        const cyclesPhone = project.slug === "chronic-pain-recovery"
        return {
            slug: project.slug,
            title: project.title,
            href: projectDetailPath(project.slug),
            tint: projectTints[project.slug],
            side: index === 1 ? "right" : "left",
            bubbles: bubbles[index],
            desktop: [
                media?.desktop?.[0] ?? desktop[0],
                media?.desktop?.[1] ?? desktop[1],
                media?.desktop?.[2] ?? desktop[2],
            ],
            phone: {
                front: media?.mobile?.front ?? { ...phone },
                back: media?.mobile?.back ?? { ...phone },
            },
            showcase: {
                desktop: cyclesDesktop ? 3 : 1,
                phone: cyclesPhone ? ["front", "back"] : ["front"],
            },
        }
    })

const ramp = (value: number, start: number, end: number) =>
    Math.max(0, Math.min(1, (value - start) / (end - start)))

export function presentationProgress(progress: number) {
    const first = ramp(progress, 0.25, 0.4)
    const second = ramp(progress, 0.65, 0.8)
    return {
        bubbleY: [
            20 * (1 - ramp(progress, 0, 0.075) - ramp(first, 0, 0.5)),
            20 * (1 - ramp(first, 0.5, 1) - ramp(second, 0, 0.5)),
            20 * (1 - ramp(second, 0.5, 1) - ramp(progress, 0.92, 1)),
        ],
        screen: first + second,
        phoneRotation: first * 180,
        bubbles: [
            ramp(progress, 0, 0.075) * (1 - ramp(first, 0, 0.5)),
            ramp(first, 0.5, 1) * (1 - ramp(second, 0, 0.5)),
            ramp(second, 0.5, 1) * (1 - ramp(progress, 0.92, 1)),
        ],
    }
}

// Five equal scroll beats: laptop views first, then the two phone faces.
export function responsivePresentationProgress(progress: number) {
    const beat = Math.max(0, Math.min(5, progress * 5))
    const slides = Array.from(
        { length: 5 },
        (_, index) =>
            (index === 0 ? 1 : ramp(beat, index - 0.2, index)) *
            (1 - ramp(beat, index + 0.8, index + 1)),
    )
    const bubbles = [
        ramp(beat, 0, 0.1) * (1 - ramp(beat, 0.8, 0.9)),
        ramp(beat, 0.9, 1) * (1 - ramp(beat, 1.8, 1.9)),
        ramp(beat, 1.9, 2) * (1 - ramp(beat, 4.8, 5)),
    ]
    return {
        slides,
        bubbles,
        bubbleY: [
            20 * (1 - ramp(beat, 0, 0.1) - ramp(beat, 0.8, 0.9)),
            20 * (1 - ramp(beat, 0.9, 1) - ramp(beat, 1.8, 1.9)),
            20 * (1 - ramp(beat, 1.9, 2) - ramp(beat, 4.8, 5)),
        ],
        phoneOpacity: ramp(beat, 2.8, 3) * (1 - ramp(beat, 4.8, 5)),
        phoneRotation: ramp(beat, 3.8, 4) * 180,
    }
}

export function responsiveStageSize(
    viewport: number,
    heading: number,
    narration: number,
    spacing: number,
) {
    const available = viewport - heading - narration - spacing
    return available >= 180 ? Math.min(345, available) : null
}
