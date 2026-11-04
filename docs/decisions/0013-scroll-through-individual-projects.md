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

## Responsive sequence and corner frog

2026-11-04: Below 1024px, use native scrolling and five equal beats: three laptop views, phone front, then phone back. Each beat lasts one viewport of scroll. Desktop views hold for 80% and crossfade for 20%. The phone enters after desktop view three, rotates from 0 to 180 degrees during the last 20% of beat four, and holds its back face in beat five. Wrapper opacity controls entrance and final fade; both faces stay opaque during the flip. The final view fades to the section background. Bubble text fades out before the next message fades in. The third message continues through both phone views. Desktop timing and the desktop phone flip remain unchanged.

A shared pure progress helper drives image opacity and frog speech selection. Responsive sticky sections occupy six viewport heights, leaving five viewport heights of scroll travel. Enable them after client setup, with a measured fit check for heading, device and narration plus spacing. Short viewports retain normal flow and scroll fades. Reduced motion and disabled JavaScript show all five images and all copy in order.

The existing frog controller owns viewport corner placement. Hero and footer use the right corner, About and Chronic Pain Recovery the left, Nibbles the right, and Waxlist the left. Travel starts when the next section reaches the viewport bottom and ends at 75% of viewport height. Speech fades during travel. Keep the existing artwork crop for Hero, About and footer, and hide body-mounted food below 1024px. Project frogs use an uncropped container at clamp(220px, 68vw, 300px), with 273:291 proportions from Figma Mobile View and Mobile View 2, nodes 122:51 and 122:63. Interpolate the crop height during section travel to avoid a jump. Place project bubbles inward above the shoulder with safe-area spacing. Measure the full frog and the actual bubble top when deciding whether the sticky stage fits. Static project frogs use the same dimensions. Footer artwork follows the frog; existing dialogue and trick behavior remain.

Use the approved reference placement and the plan's explicit timing defaults. The reference animation timing was not verified. Keep temporary media labels and defer replacement captures. WebGL failure restores static artwork independently of slide setup. Breakpoint changes, font completion and resizing remeasure layout and remove obsolete sequence styles.

2026-11-04: Below 768px, end the footer at one viewport. The corner frog and its speech are fixed to the viewport, so the footer's in-flow frog slot duplicates their space. Once the renderer is ready, collapse that slot and its gap and top-align the footer copy, keeping the existing top padding and heading-through-links positions. The footer keeps a 100svh minimum and grows when its copy is taller than a short viewport. The slot returns whenever the renderer is not ready, including reduced motion, disabled JavaScript and WebGL failure, so the static frog stays visible. Corner-frog layouts from 768px to 1023px keep the existing slot and space-between distribution.

2026-11-04: Below 768px, place the corner speech like the supplied reference. The hero greeting becomes a wide bubble above the frog, right-aligned with 24px margins and a downward tail centred on the frog's head. It keeps a 36px gap above the visible head and scales down below 360px so the 320px title stays clear. The footer dialogue rises to the frog's face with its right-pointing tail unchanged, but only from 360px width and 790px height upward, where the footer links leave room above it. Shorter or narrower phones keep the earlier bottom-left dialogue so its background does not cover the link text. Fixed frog placement, firefly flight, dialogue timing and the in-flow fallbacks are unchanged.

2026-11-04: Below 1024px, the About frog now matches the hero rather than using the smaller cropped left-corner pose. It keeps `clamp(220px, 68vw, 300px)` at 291/273 with the full body and is centred above the viewport bottom. The in-flow slot uses the same size and centres itself, so reduced-motion, disabled-JavaScript and WebGL-failure fallbacks agree with the animated pose. Hero, project and footer placement and the desktop About layout remain unchanged.

A decorative Irish tricolour on a pole is planted at the frog's right side. Six columns ripple with staggered delays, the wave pauses whenever the flag is not visible and stops under reduced motion. The flag fades with the corner speech, appears only while About owns the active corner and never follows the frog into the hero or project travel. The trade-off is that the full-size frog can pass over the paragraph's already-faded lines as About enters, and short landscape viewports still share the corner frog's height limits.
