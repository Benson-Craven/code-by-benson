# Scroll through individual projects

Date: 2026-11-03

## Decision

Place Chronic Pain Recovery, Nibbles with Nifa and Waxlist after About on `/redesign`. Frame `71:39` in Figma file `1NM0R1I91dhHCR22kqvf16` supplies the dark teal `#00324b`, Funnel Sans, off-white bubbles and overlapping device arrangement. The approved plan replaces the stock frog and watch imagery with the existing procedural frog and portfolio evidence.

Keep presentation data local to the preview. Reuse shared titles and case-study actions without changing the portfolio contract. Nifa retains editorial credit and Waxlist remains unpublished. The Chronic Pain Recovery screens use home, conditions and science evidence. Other desktop views and all phone crops are visibly temporary. Front and back phone media have independent slots.

Use a 350svh section and a viewport-height sticky stage only with a fine pointer, at least 1024px width and 700px height, and no reduced-motion preference. ScrollTrigger maps page scroll directly to three screen positions, bubble opacity and a 180-degree phone flip. The holds occupy 0–25%, 40–65% and 80–100% of the sticky duration. The final bubble fades over 92–100%. Both phone faces hide their backs.

The existing controller remains the sole writer of frog placement. It reads live slot rectangles during scrolling, adding start and end anchors for each sticky hold. One renderer and one Lenis instance remain. Project animation contexts revert on preference changes and navigation. Font and image completion and resizing refresh measurements.

## Fallbacks and trade-offs

Server-render every screenshot and bubble in ordinary flow. Sticky layout requires both the media query and the client activation attribute. Reduced motion and disabled JavaScript show static frogs and all copy without a flip. Bubbles remain in the accessibility tree without live announcements. Links sit outside clipped screens. Existing WebGL failure handling restores static frogs.

Temporary cover crops show layout rather than distinct product pages. Genuine desktop and phone captures remain deferred. The user requested fewer test files, so coverage stays in the existing redesign test file.
