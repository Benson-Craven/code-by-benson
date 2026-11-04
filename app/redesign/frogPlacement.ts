export type FrogAnchor = {
    x: number
    y: number
    width: number
    height: number
    scroll: number
}

export function frogPlacement(
    anchors: FrogAnchor[],
    scroll: number,
    narrow: boolean,
): FrogAnchor {
    if (anchors.length === 0) throw new Error("A frog position is required")
    if (narrow) {
        return anchors.reduce((closest, anchor) =>
            Math.abs(anchor.scroll - scroll) < Math.abs(closest.scroll - scroll)
                ? anchor
                : closest,
        )
    }
    const nextIndex = anchors.findIndex((anchor) => anchor.scroll > scroll)
    if (nextIndex === 0) return anchors[0]
    if (nextIndex === -1) return anchors[anchors.length - 1]
    const from = anchors[nextIndex - 1]
    const to = anchors[nextIndex]
    const progress = Math.max(
        0,
        Math.min(
            1,
            (scroll - from.scroll) / Math.max(1, to.scroll - from.scroll),
        ),
    )
    const eased = progress * progress * (3 - 2 * progress)
    const mix = (a: number, b: number) => a + (b - a) * eased
    return {
        x: mix(from.x, to.x),
        y: mix(from.y, to.y),
        width: mix(from.width, to.width),
        height: mix(from.height, to.height),
        scroll,
    }
}

export function shouldRenderFrog(
    hidden: boolean,
    reduced: boolean,
    top: number,
    height: number,
    viewportHeight: number,
) {
    return !hidden && !reduced && top < viewportHeight && top + height > 0
}
