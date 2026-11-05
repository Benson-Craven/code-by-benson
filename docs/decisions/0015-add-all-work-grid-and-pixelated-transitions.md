# Add an All work grid and pixelated project transitions

Date: 2026-11-04

## Decision

Add an "All work" section to the `/redesign` preview after the project tour. The grid is driven by the same `implementedPortfolioProjects` collection as the rest of the preview, so it keeps the approved three projects, order, titles, timeframes, links and tints. It renders a wide first card followed by two half-width cards on phones and three equal columns from 768px.

Each cover is a normal `<img>` with a decorative canvas overlay. The overlay samples the cover into a low-resolution grid and dithers it with a 4x4 Bayer matrix towards the viewport edges. The real image remains visible in the centre. Hovering or focusing a card expands the clear centre from `open = 1` to `open = 2`; the canvas is skipped entirely under `prefers-reduced-motion: reduce`, so the image and link remain the accessible fallback.

Clicking a card marks the section as transitioning, dims the other covers and starts the existing `ProjectTransition` controller. The controller now resolves the source cover from the clicked link, so the All work card, the next-project card and the tour's "View project" action each use their own visible cover.

## Pixelated entrance and exit

The controller builds both the smooth image clone and a full low-colour pixelated clone from the cover image. Opening starts with the pixelated clone visible and resolves it to the smooth image; closing starts smooth and resolves into pixels. The existing frog flood still covers the route change, and the clone fades into the destination after it lands. Project pages use the same renderer for a one-shot pixelated hero reveal, then fade the canvas away to the crisp image.

Closing links now carry `data-project-tint`, so the return flood uses the project tint rather than the paper fallback. The "All work" links target `/redesign#work`; the controller centres the matching card and moves focus back to it.

## Fallbacks and accessibility

The canvas is `aria-hidden`, has no pointer behaviour, and never replaces the image's alt text. Reduced-motion users do not get a canvas or the intercepted transition. Direct project loads skip the overlay. The grid uses one `h2`, semantic list markup, visible focus outlines, and real links, so it works without JavaScript. The preview remains `noindex` and outside the sitemap.

## Acceptance

- The All work grid shows the approved projects in order with exact links and tints.
- The grid has no horizontal overflow at 320, 390, 768 and 1440 CSS pixels.
- Hover, focus, keyboard Enter and reduced motion all keep the links usable.
- Opening and closing a project keeps the pixel crossfade, the frog flood and the focus return.
- No new dependencies and no changes to the published `/work` pages.
