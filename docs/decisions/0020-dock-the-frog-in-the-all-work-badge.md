# Dock the frog in a circle badge over All Work

Date: 2026-11-05

## Decision

While the All Work section crosses the viewport's middle, the live frog leaves
its reserved slot and docks into a small circular badge in the bottom-right
corner. When the footer covers a fifth of the viewport, the badge releases the
frog back into its normal scroll-linked travel, and the frog continues to the
footer slot from there. The blend makes the release continuous instead of a
snap.

The reference is `sebg.ch`: its mascot sits in a paper disc with a colour ring
for the work section. The local frog renderer already ships the circular framing
as `setBadge(on)`. This change adds `setBadgeMix(0…1)` so the renderer can blend
between the full-body pose and the badge instead of snapping the crop on or off.

## Design

- **Circle.** 123px across: the renderer crops a circle of that size at
  `(100px, host height - 152px)` in canvas coordinates. A paper disc is anchored
  to the same point, with a 4px paper gap and a 2px `#3a5de3` ring drawn as
  `box-shadow`. The ring echoes the preview's blue rather than a project tint.
- **Placement.** Bottom-right, with a 24px inset on desktop and 20px on phones.
  The reference uses bottom-left; on this site the frog's own corner is the
  right, and the right corner clears the work-card titles and the footer
  heading.
- **Blend.** `setBadgeMix` interpolates the frog's position and scale between
  the normal layout and the badge framing. The shader crop opens from the badge
  point at the full-body end, and the badge point stays fixed at the badge end
  so the paper ring cannot drift from the crop. Hover, idle and emotes stay off
  for the whole blend.
- **Entry.** The layer keeps its current screen position through the switch to
  fixed positioning, then moves to the corner over 0.72s while the mix runs
  0 → 1 over 0.6s. The frog visibly shrinks into the circle as the disc scales
  in. On arrival it smiles for 1.5 seconds and speaks its first line.
- **Dialogue.** The badge carries its own bubble above the circle. A line lands
  with the dock, then `allWorkDialogue` cycles without consecutive repeats until
  the hand-off. The bubble sits inside the fixed frog layer, its right edge and
  tail aligned to `frogBadgeGeometry`, and clears on undock, a hidden tab,
  renderer failure or reduced motion.
- **Hand-off.** The badge stays while the work section has passed the viewport
  middle and the footer is still more than 24px from the top. From there the
  exit runs the mix 1 → 0 while the layer chases the live normal placement
  every frame, so it lands exactly in the footer slot even if the page is still
  scrolling. The disc fades as the circle opens.
- **Hysteresis.** Re-docking needs the footer below the viewport's middle. That
  half-viewport band keeps small scrolls inside the contact section from
  flickering the badge on and off.
- **Reduced motion.** The frog layer is hidden, so none of this runs.

## Hooks

- `data-frog-work` marks the All Work section as the badge owner.
- `data-frog-docked="true"` on the preview root switches the layer to fixed
  positioning and removes the mobile corner crop while docked.
- `data-frog-badge` is the paper disc behind the shader's crop.

## Trade-offs

- The circle size and offset are fixed in the renderer, so the disc geometry
  and the shader crop have to stay in step. Both sides carry a comment.
- The renderer faces the frog front and disables hover, idle and emotes in
  badge mode. The docked state uses `talk()` and `setSmiling()` for its reaction
  instead of the usual pointer behaviour.
- The exit chases the live placement rather than a fixed target, which keeps
  the hand-off continuous while scrolling but means the move is re-evaluated on
  every animation frame for about two-thirds of a second.
- The badge stays over the contact section while the footer arrives. The
  footer dialogue is paused while docked, because its bubble points at the empty
  slot; the badge bubble takes over until the hand-off.
- The hand-off begins 24px before the footer reaches the top. The last few
  pixels are absorbed by the live target chase.

## Acceptance

- The badge docks at the bottom-right with the same circle centre at 1440,
  1024, 768, 390 and 320 CSS pixels, with no horizontal overflow.
- Entry shrinks the frog into the circle; release grows it back into its
  normal travelling pose; both run without a pose snap.
- The release starts when the footer covers 20% of the viewport, and the badge
  is gone before the footer fills the screen.
- The frog continues to the footer slot through the existing scroll travel.
- While docked the badge speaks its own lines in a bubble that stays inside the
  viewport at every width, and the footer dialogue resumes after the hand-off.
- Reduced motion never docks the frog.
- Scrolling back up re-docks the frog once the footer passes the viewport
  middle, and a work card can still be opened mid-dock.
- Formatting, lint, typecheck, the full test suite and an isolated production
  build pass.
