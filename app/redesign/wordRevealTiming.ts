// The reveal starts as a paragraph reaches the viewport bottom and finishes by
// the time it reaches the upper half. A fixed travel keeps long paragraphs from
// sitting faint for most of their journey into view.
const FADE_BASE = 0.12
const ENTER_AT_VIEWPORTS = 1
const TRAVEL_IN_VIEWPORTS = 0.45
const WORD_OVERLAP = 2

function clamp01(value: number) {
    return Math.max(0, Math.min(1, value))
}

export function wordRevealProgress(top: number, viewport: number) {
    const start = viewport * ENTER_AT_VIEWPORTS
    const span = Math.max(1, viewport * TRAVEL_IN_VIEWPORTS)
    return clamp01((start - top) / span)
}

export function wordRevealOpacity(
    progress: number,
    count: number,
    index: number,
) {
    const position = clamp01(progress) * (Math.max(0, count) + WORD_OVERLAP)
    return FADE_BASE + (1 - FADE_BASE) * clamp01(position - index)
}
