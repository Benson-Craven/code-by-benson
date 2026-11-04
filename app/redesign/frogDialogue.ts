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

export function pickFooterDialogue(previous: string, random = Math.random()) {
    const choices = footerDialogue.filter((line) => line !== previous)
    return choices[
        Math.min(
            choices.length - 1,
            Math.max(0, Math.floor(random * choices.length)),
        )
    ]
}
