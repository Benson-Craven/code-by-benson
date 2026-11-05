# Give project pages the animated frog and project dialogue

Date: 2026-11-04

## Decision

Replace the static corner frog on `/redesign/projects/[slug]` with a small client island, `ProjectFrog`, that reuses the existing renderer loader and adapter from the home page. The island keeps the `data-frog-layer` hook so the project transition still floods the viewport from the frog, and it renders the existing procedural rig rather than a second animation system.

The layer stays in the bottom-right corner and uses the redesign preview's scales, with the mobile size reduced by 30%: `clamp(154px, 47.6vw, 210px)` below 1024px and `clamp(240px, 23vw, 340px)` from 1024px, with the same 320:336 box as the rig. The renderer reserves 32px inside that box, so the layer sits 32px outside the right edge and 26px below the bottom edge, which brings the visible frog against the corner without clipping its feet. The static fallback is inset by the same 32px and moves with the layer. The fallback stays visible until the canvas is ready, then returns whenever the renderer is missing.

Each project gets five lines in `projectDialogue` in `frogDialogue.ts`. A line appears two seconds after the rig loads, stays for 5.2 seconds, and the next line follows after a random 4.5 to 10.5 second gap. Lines fade up from 14px below in 0.35 seconds, fade out in 0.35 seconds, and never repeat consecutively. The frog runs its existing 2.2 second talk animation while a line is visible.

The speech bubble sits above the layer, 8px or 16px inside the viewport's right edge, with a downward tail centred on the rig and its tip at the frog's head. It is up to 340px wide and white on ink in every section, so it reads on paper, tinted and dark backgrounds. The layer is `aria-hidden`, so the decorative speech is not announced and does not compete with the case-study copy.

## Fallbacks and trade-offs

The rig pauses when the tab is hidden. Reduced motion keeps the static frog and never starts the dialogue. A WebGL context loss or import failure hides the canvas, restores the fallback and clears the speech. Cleaning up the island removes listeners and the renderer, so moving between project pages does not leak a host.

Auto-fading decorative text can pass over page content for a few seconds at a time. The bubble is pointer-transparent, so links beneath it stay reachable, and reduced-motion visitors never see it. The corner rig still covers page content while scrolling, and the redesign scale leaves the desktop frog larger than the original static image. The 30% mobile reduction keeps the corner compact on phones. No route, content contract, evidence or public status changes.
