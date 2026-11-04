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

export const responsiveFrogSides = [
    "right",
    "center",
    "left",
    "right",
    "left",
    "right",
] as const

export function cornerFrogPlacement(
    sectionTops: number[],
    scroll: number,
    width: number,
    height: number,
) {
    // The intro matches the hero size and is centred above the viewport bottom.
    const size = Math.max(220, Math.min(300, width * 0.68))
    const frog = { width: size, height: size * (291 / 273) }
    const xFor = (index: number) => {
        const side = responsiveFrogSides[index]
        if (side === "center") return (width - frog.width) / 2
        return side === "left" ? 0 : width - frog.width
    }
    const cropHeight = frog.height
    let index = 0
    let x = xFor(0)
    let speech = 1
    for (let i = 1; i < sectionTops.length; i++) {
        const progress = Math.max(
            0,
            Math.min(1, (scroll - sectionTops[i] + height) / (height * 0.25)),
        )
        if (progress <= 0) break
        index = progress < 0.5 ? i - 1 : i
        const eased = progress * progress * (3 - 2 * progress)
        x = xFor(i - 1) + (xFor(i) - xFor(i - 1)) * eased
        speech =
            progress < 0.5
                ? Math.max(0, 1 - progress * 4)
                : Math.max(0, (progress - 0.75) * 4)
    }
    return {
        x,
        y: height - cropHeight,
        width: frog.width,
        height: frog.height,
        cropHeight,
        scroll,
        index,
        speech,
    }
}
