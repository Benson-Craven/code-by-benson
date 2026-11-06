export type FrogAnchor = {
    x: number
    y: number
    width: number
    height: number
    scroll: number
}

/**
 * The renderer crops its circular badge from a fixed point measured from the
 * host's left and bottom edges. Keep these in step with `BADGE` in
 * `public/frog-mascot/src/frog-mascot.js`.
 */
export const frogBadgeGeometry = {
    x: 100,
    yFromBottom: 152,
    radius: 61.5,
} as const

/**
 * The badge stays while All Work has passed the viewport's middle and the
 * footer has not yet reached the top. The footer is part of the same run, so
 * the frog can hand over to its footer slot without a second transition.
 */
export function workBadgeActive(
    workTop: number,
    footerTop: number,
    viewportHeight: number,
) {
    // Leave the badge once the footer covers a fifth of the viewport.
    return workTop < viewportHeight / 2 && footerTop > viewportHeight * 0.8
}

/**
 * Docking starts once the footer is less than 15% into the viewport. The gap
 * between this and `workBadgeActive` stops the badge flickering on and off
 * around the release point.
 */
export function workBadgeStarts(
    workTop: number,
    footerTop: number,
    viewportHeight: number,
) {
    return workTop < viewportHeight / 2 && footerTop > viewportHeight * 0.85
}

/** Layer offsets that place the renderer's badge circle on a viewport point. */
export function workBadgePosition(
    pointX: number,
    pointY: number,
    layerHeight: number,
) {
    return {
        x: pointX - frogBadgeGeometry.x,
        y: pointY - (layerHeight - frogBadgeGeometry.yFromBottom),
        centreX: pointX,
        centreY: pointY,
    }
}

/** Layer offsets that dock the badge circle in the bottom-right corner. */
export function workBadgeDock(
    viewportWidth: number,
    viewportHeight: number,
    layerHeight: number,
    inset: number,
) {
    return workBadgePosition(
        viewportWidth - inset - frogBadgeGeometry.radius,
        viewportHeight - inset - frogBadgeGeometry.radius,
        layerHeight,
    )
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

/**
 * The About frog carries a decorative tricolour on every layout. Mobile only
 * plants it while About owns the corner frog, matching the speech fade.
 * Desktop fades it in over the last fifth of the approach, then fades it out as
 * the next section enters, so it never follows the frog into a project.
 */
export function aboutFlagOpacity({
    aboutActive,
    introTop,
    introBottom,
    viewportHeight,
    cornerActive,
    cornerIndex,
    cornerSpeech,
    reduced,
}: {
    aboutActive: boolean
    introTop: number
    introBottom: number
    viewportHeight: number
    cornerActive: boolean
    cornerIndex: number
    cornerSpeech: number
    reduced: boolean
}) {
    if (reduced || !aboutActive) return 0
    if (cornerActive) return cornerIndex === 1 ? cornerSpeech : 0
    const enter = Math.max(
        0,
        Math.min(1, (viewportHeight * 0.2 - introTop) / (viewportHeight * 0.2)),
    )
    // Fade out over the first quarter of the next section's entry.
    const exit = Math.max(
        0,
        Math.min(
            1,
            (introBottom - viewportHeight * 0.75) / (viewportHeight * 0.25),
        ),
    )
    return Math.min(enter, exit)
}

/**
 * The hero greeting holds through the first third of the hero, then fades out
 * and drifts up before the frog's slot changes at 60%. Driving it from scroll
 * position keeps the motion reversible when the user scrolls back up.
 */
export const heroGreetingDrift = 16

export function heroGreetingExit(scroll: number, heroHeight: number) {
    const start = heroHeight * 0.35
    const end = heroHeight * 0.6
    const progress = Math.max(
        0,
        Math.min(1, (scroll - start) / Math.max(1, end - start)),
    )
    const offset = -heroGreetingDrift * progress
    return {
        opacity: 1 - progress,
        // Avoid returning negative zero at the start of the range.
        offset: offset === 0 ? 0 : offset,
    }
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
