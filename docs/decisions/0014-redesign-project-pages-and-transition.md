# Open individual redesign projects with a cover morph

Date: 2026-11-04

## Decision

Add statically generated project pages at `/redesign/projects/[slug]` for the three approved projects. Each page restyles the existing typed case-study content: cover, year, role, stack, context, constraints, ownership, three decisions, proof clip, outcomes, reflection and the next project. The pages reuse the preview tints `#08d9d6`, `#ff2e63` and `#ffe506`, stay `noindex`, remain outside the sitemap, and do not change the published `/work/[slug]` pages.

Point the homepage "View project" action at the new route. Mark project links with `data-project-link`, `data-project-slug`, `data-project-direction` and `data-project-tint`. Mark the first homepage desktop screen and the next-project card with `data-project-cover`, and the destination hero image with `data-project-hero`.

## Transition

A persistent client controller in `app/redesign/layout.tsx` intercepts marked same-origin links in the document capture phase. On click it:

1. Finds the visible cover and the active frog, then measures the circle from the frog centre to the farthest viewport corner.
2. Locks document scrolling and appends a fixed tint flood plus an image clone of the cover.
3. Animates the flood from the frog radius to the full circle over 380ms.
4. Calls `router.push`, waits for the destination page and hero, scrolls to the top (open) or centres the project card (close), and decodes the hero image.
5. Animates the clone from the source rectangle to the hero rectangle over 750ms with `cubic-bezier(0.87, 0, 0.13, 1)`, hiding the live hero until it lands.
6. Reveals the hero, removes the clone, fades the flood over 250ms, restores scrolling, announces the route and moves focus to `#project-main` (open) or the project link (close).

"All work" and the footer link run the same controller in the close direction without a cover clone. The next-project card runs it in the open direction. A destination timeout of 3 seconds and an image timeout of 600ms keep the transition bounded; failures still fade the flood and leave the navigation in place.

## Why not native View Transitions

The reference site uses Astro's `ClientRouter` and the browser View Transitions API. Its router commits while the transition is paused, which allows a shared `view-transition-name` cover morph and a root `clip-path` flood.

Next 14 does not commit a client route inside a `startViewTransition` update callback. Awaiting the destination exceeded Chrome's update deadline, and wrapping `router.push` in `flushSync` still left the callback without the destination DOM. The controller therefore uses Web Animations API keyframes for both the flood and the clone. This works without the View Transitions API, does not depend on router timing, and keeps the visual sequence deterministic.

The trade-off is that the flying cover is an image clone rather than the live element. The clone uses the source image's `currentSrc`, so responsive sources match. The live hero is revealed at the same rectangle when the clone lands.

## Fallbacks and accessibility

Under `prefers-reduced-motion: reduce` the controller returns before intercepting, so the ordinary `Link` navigation runs with no overlay. Browsers without Web Animations support are not targetted by this preview; the markup and links remain usable without JavaScript. The flood and clone are `aria-hidden`; the layout provides a polite route status region. Focus moves only after the overlay is gone, so the sequence does not trap focus. The project page keeps the preview skip link, one `h1`, ordered section headings, descriptive image text and a described video with a transcript.

The fixed frog badge uses the same static pixel PNG as the existing fallback, so it does not create a WebGL context on project pages or risk a blank canvas during route changes.

## Acceptance

- Three static project routes exist and unknown slugs return 404.
- Homepage, next-project and close actions use the controller.
- Reduced motion and direct loads skip the overlay.
- The published `/work` routes, sitemap and robots output are unchanged.
- The project pages stay `noindex`.
