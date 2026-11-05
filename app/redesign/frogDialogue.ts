import type { PortfolioProjectSlug } from "../data/portfolio"

export const footerDialogue = [
    "I live down here. The rent is reasonable.",
    "You've scrolled a long way. Rest your thumb.",
    "I'd offer you tea, but this is a pond.",
    "Benson does the coding. I supervise.",
    "My hobbies? Sitting. Occasionally hopping.",
    "That email goes to Benson. I have webbed feet.",
    "Between us, I came here for the snacks.",
    "Still here? Good. I like the company.",
]

// Each line stays close to the project it introduces, so the frog reads as a
// guide rather than a generic mascot repeating itself on every page.
export const projectDialogue: Record<PortfolioProjectSlug, string[]> = {
    "chronic-pain-recovery": [
        "Calm pages. No urgency here.",
        "Patients start with questions, not categories.",
        "Every heading on this site has a job.",
        "The medical copy belongs to the clinic. I keep it readable.",
        "Slow is a feature on this one.",
    ],
    "nibbles-with-nifa": [
        "Nifa writes. Benson builds. I approve the snacks.",
        "Rough notes can stay in the kitchen.",
        "Nothing half-baked reaches production.",
        "Preview first. Publish when it is ready.",
        "Drafts stay private. Recipes go public.",
    ],
    waxlist: [
        "Records first. Prices second.",
        "If the shipping is unknown, it stays unknown.",
        "A weak match is not a fact.",
        "This one is still in the workshop.",
        "I have shelves for shelves.",
    ],
}

function pickLine(lines: string[], previous: string, random: number) {
    const choices = lines.filter((line) => line !== previous)
    if (choices.length === 0) return ""
    return choices[
        Math.min(
            choices.length - 1,
            Math.max(0, Math.floor(random * choices.length)),
        )
    ]
}

export function pickFooterDialogue(previous: string, random = Math.random()) {
    return pickLine(footerDialogue, previous, random)
}

export function pickProjectDialogue(
    slug: PortfolioProjectSlug,
    previous: string,
    random = Math.random(),
) {
    return pickLine(projectDialogue[slug] ?? [], previous, random)
}
