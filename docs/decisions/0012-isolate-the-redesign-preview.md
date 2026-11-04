# Isolate the redesign preview

Date: 2026-11-03

## Decision

Add `/redesign` as a separate, noindex preview. Keep the homepage, case studies, saved themes and existing Framer Motion consumers intact. Defer project presentation.

The design source is the high-fidelity Figma context and screenshots for file `1NM0R1I91dhHCR22kqvf16`, frames `3:13`, `33:11` and `36:23`, retrieved on 2026-11-03. The approved plan overrides the stock frog placeholder with the supplied procedural frog, adds a blue grid and uses `#0B0B0C` for the footer. Blue `#3A5DE3` and off-white `#FBFBF8` match the frame context. Preserve the supplied copy.

Self-host normal and italic variable Funnel Sans from Google Fonts with its OFL licence. Use a CSS module to isolate colours, typography and responsive layouts from saved themes. Keep the existing explicit sitemap unchanged.

Copy the complete local frog package into `public/frog-mascot`. Retain both renderer modes and both vendored Three.js modules with their licence headers. Extend only the copied component with container fitting, pause control, synchronous snapshot capture and disposal of both postprocessing passes. Do not modify the source workspace. The fallback PNG is captured from this actual rig through `capture.html`.

Use one animated instance, moving between measured slots on desktop. Mobile uses discrete reserved slots to prevent the frog crossing text. Reduced motion uses static images without loading WebGL or starting Lenis. Loading and WebGL failure also show static images. Canvas pointer events are disabled; the existing window pointer listener preserves following. The native button triggers one GSAP hop and announces completion.

Lenis runs only with a fine pointer on desktop, with native touch scrolling, driven by the GSAP ticker in milliseconds as described in the [official integration](https://github.com/darkroomengineering/lenis#gsap-scrolltrigger). Scroll positions are measured directly, so ScrollTrigger is unnecessary. Remove the ticker, listeners, observers and GPU resources on route exit. Pause frog rendering when hidden or offscreen. Temporarily disable the root CSS smooth scroll while mounted and restore it on cleanup.

## Trade-offs

The intro paragraph now uses ScrollTrigger for a word-by-word opacity reveal, as requested on 2026-11-03. Frog positioning still measures scroll directly. A separate client component owns the text animation and reverts it on unmount or a reduced-motion preference change. Text remains fully visible before JavaScript runs and when reduced motion is enabled.

The public package is unbundled to reuse its supplied Three.js and remain portable. It adds a separate module download when animation is enabled. The two vendored files total roughly 2 MB before transfer compression. Static fallback users do not fetch them.

`USER_REQUIREMENTS.md` and `DESIGN.md` remain absent. The explicit redesign plan governs this preview; the older Portfolio v2 specification continues to govern existing routes.
