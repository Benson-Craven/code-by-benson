# Keep project pages to real product media and readable reveals

Date: 2026-11-11

## Decision

The individual project pages no longer show the architecture diagrams. They
show only real product captures. `/projects/waxlist` plays the homepage clip in
its wide frame and keeps the Collection and Privacy clips in the paired frames.
Its final walkthrough section is gone. `/projects/nibbles-with-nifa` keeps the
desktop clip in the wide frame and drops the paired frames, because the only
media left for those slots were diagrams.

The project pages also reveal body copy sooner, and each one carries a
first-person note under the context copy.

## Design

- `ProjectCase` reads `showcaseMedia[slug].desktop` for every project. Slot `0`
  fills the wide frame. Slots `1` and `2` fill the paired frames only when they
  exist. There is no `evidence.stills` fallback on this page.
- Waxlist slot `0` is `waxlist-1.mp4`. The hero still keeps the cover image
  because the clip starts on a moving gradient that reads poorly in the 16:10
  crop.
- The Waxlist walkthrough section and its video controller are removed. The
  case-study clip stays in the Proof section of `/work/waxlist`.
- Nibbles has one desktop entry. The old recipe-index and travel-feature
  captures belonged to the previous public design and were removed from
  `showcaseMedia`; the current media is the homepage still, the desktop clip and
  the mobile clip. With no current media for slots `1` and `2`, the paired
  frames do not render.
- `projectPresentations.desktop` is now `PreviewMedia[]` instead of a fixed
  three-tuple. It lists only media that exists, so the unused "Temporary cover
  view" placeholders are gone.
- `wordRevealTiming.ts` starts the reveal at the viewport bottom and completes it
  over 45% of the viewport, so the last word is full before the paragraph
  reaches the middle of the screen. The 0.12 starting opacity stays, which
  keeps the words faint rather than invisible.
- `projectPreviewCopy` gains a `personal` heading and body for every project.
  The copy stays grounded in the case-study facts and uses first person.

## Trade-offs

- The Nibbles project page is shorter and no longer has two half-width frames.
  The desktop clip still shows the homepage and a recipe page, so the page keeps
  real product evidence.
- The Waxlist project page downloads the homepage clip as well as the Collection
  and Privacy clips. The homepage showcase already loads that clip for Waxlist,
  so a visitor who sees both pages pays for it twice.
- The diagrams remain on the `/work` case studies, where each one sits beside
  the decision it explains. They are no longer used as project-page decoration.
- A faster reveal reduces the slow-burn effect. Body copy is readable earlier,
  which matters more than preserving the original timing.
- The walkthrough clip is only available on `/work/waxlist` now. The project
  page ends on the paired clips and the next-project card.

## Acceptance

- No project page uses an SVG diagram as project media.
- `/projects/waxlist` has no walkthrough section and no `evidence.clip` video.
- `/projects/nibbles-with-nifa` renders the wide desktop clip and no paired
  frames.
- Body copy reaches full opacity before its top passes roughly 55% of the
  viewport.
- Every project page renders a first-person note with a heading and body.
- Reduced motion keeps all copy, posters and the next-project card visible.
