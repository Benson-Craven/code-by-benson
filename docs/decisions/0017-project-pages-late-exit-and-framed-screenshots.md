# Match the reference project page: a late exit, pixel reveals and framed screenshots

Date: 2026-11-04

## Decision

`/redesign/projects/[slug]` now follows the shape of the reference project page at `sebg.ch/projects/jaeger-le-coultre`, measured at 1440x900 in Chrome. That page is 5,965px tall: a tinted hero with a title, a three-column meta list and an eight-column cover; one intro with a large lead and a single paragraph; a stone section holding a full-width browser frame and a two-up pair; a video frame centred in a `min-h-svh` section; and a full-height next-project section. The redesign page now uses the same order, the same 12-column rhythm and the same browser chrome, and measures 5,548px at the same viewport.

Three reference behaviours drive the implementation.

- **Late exit.** On the reference, the outgoing project page stays on top and is clipped by a reverse circular flood from the mascot over 0.9 seconds; it is still fully visible at 300ms. The transition now clones the outgoing `main` and `footer` into a fixed, inert layer, pushes the route underneath, then shrinks that clone's `clip-path` circle to the frog over 900ms with `cubic-bezier(0.65, 0, 0.35, 1)`. The previous approach covered the old page with tint after 380ms, which made it leave early.
- **Pixel entrance and exit.** Each screenshot frame carries a canvas that draws a two-colour silhouette from the image's luminance, develops it in over 600ms, hands over to the real image, then dissolves it out over 700ms. The hero keeps `PixelReveal`. The shared cover clone keeps its pixel crossfade.
- **Image layout.** Screenshots sit in a browser frame: a 32-36px chrome bar with three dots, a centred URL pill, a 12px radius and a 4px checkerboard shadow offset 6px. A full-width frame is followed by a heading and paragraph pair and then two half-width frames.
- **Speech bubbles.** The frog's dialogue takes the same treatment. On each line a canvas draws the bubble shape and its glyphs at the screenshot pixel grid, develops them over 420ms, reveals the real bubble surface, then dissolves the pixels over 520ms and fades the real text in before the dissolve ends. The bubble also carries the same 4px checkerboard shadow as the frames.
- **Word by word copy.** Body copy splits into words that start at 0.12 opacity and reach full opacity in reading order as the block crosses the viewport, reversing on scroll up. Without JavaScript or with reduced motion the text renders at full opacity.

Content is reduced to the reference's length. `projectDetailData` holds preview-only copy for each project: one factual lead sentence and one first-person note that restates facts already in the typed portfolio content. The note replaces the case-study context paragraph, and the middle section uses the second decision's title and approach. Screenshot captions and the clip caption are gone; the images keep descriptive alt text and the clip keeps its description for `aria-describedby` only. The transcript is omitted. Phones render the lead and body paragraphs at 20px, with weight and line height carrying the hierarchy instead of size. Constraints, ownership, decisions list, outcomes and reflection are not rendered on this preview route; the public `/work/[slug]` case studies still carry the full seven-part narrative and the content contract is unchanged.

The two action pills are fixed to the viewport, matching the reference's pinned chrome, and the preview skip link is now fixed so it stays reachable after scrolling.

## Fallbacks and trade-offs

The clone costs one DOM copy of the page per transition. Videos are replaced by their poster inside the clone, canvases are dropped, ids are removed and the clone is inert and aria-hidden, so it cannot be interacted with or announced. If the clone cannot be built the handler lets the router navigate normally.

The reference grows the destination page out of the mascot on open and shrinks the outgoing page on close. This implementation clips the outgoing page in both directions, because Next 14 cannot commit the destination inside a view transition update callback. The direction of the circle differs on open; the late departure does not.

The reference's three phone mockups are omitted because this portfolio has no mobile captures, and the browser-chrome host label reads "Local build" for unpublished Waxlist so the frame never implies a live destination. Reduced motion skips the clone, the develop canvases stay transparent and the real images remain visible. Removing the long narrative from the preview is a deliberate scope choice, and the full case studies remain the canonical reading route.
