# Show the Waxlist clips in the showcase and on the project page

Date: 2026-11-07

> Superseded in part by ADR 0023 (2026-11-11): the wide frame now plays the
> homepage clip and the separate walkthrough section is gone.

## Decision

The Waxlist showcase now cycles three desktop clips: the homepage, the
Collection view and the Privacy Policy. `/projects/waxlist` shows the Collection
and Privacy clips in its two half-width frames. The wide frame keeps the
architecture still, and the hero keeps the cover still.

## Design

- Waxlist desktop slots `1` and `2` in `showcaseMedia` hold the two new clips.
  Slot `1` is Collection and slot `2` is Privacy, so the section moves from the
  homepage to the product and then to the data policy.
- `projectPresentations` sets `showcase.desktop` to `3` for Waxlist. Its phone
  stays on the front face, so only the desktop strip grows from one view to
  three.
- `ProjectCase` reads slots `1` and `2` through `pairMedia`. The wide frame keeps
  `evidence.stills[0]`, the collector-workspace diagram, because the section's
  claim is about the shared workspace rather than a screen recording.
- The hero keeps `cover`, the homescreen still. The homepage clip starts with a
  moving gradient and is better left in the browser frame.
- Both clips carry descriptive alt text. The records are invented, matching the
  existing Waxlist evidence disclosure.

## Trade-offs

- The Waxlist section is now three held beats on desktop and adds two clips to
  the mobile sequence. The fixed 350svh section already reserves room for three
  desktop slides, so the scroll length does not change.
- The project page now downloads about 26 MB of new video. Both clips autoplay
  muted and loop like the existing preview media, so the page weight grows
  noticeably on a slow connection. No poster frames were supplied, so the first
  frame appears once metadata and the first bytes arrive.
- The two architecture diagrams that used to sit in the paired frames remain on
  `/work/waxlist`, where they explain the matching and buying decisions.

## Acceptance

- The homepage Waxlist section steps through Homepage, Collection and Privacy.
- `/projects/waxlist` shows Collection and Privacy in the paired frames, the
  workspace diagram in the wide frame and the cover still in the hero.
- Reduced motion keeps the existing static fallbacks and the next-project card.
- Contract and media tests cover the new slots and files.
