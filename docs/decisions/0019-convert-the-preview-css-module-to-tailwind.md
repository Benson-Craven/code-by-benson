# Convert the preview CSS module to Tailwind

Date: 2026-11-05

## Decision

The redesign's styling now lives in Tailwind utilities. `app/redesign/redesign.module.css` is deleted.

Presentation moves onto the elements: layout, grids, spacing, type ramps, colours, frames, phone faces, the work grid and the case-study pages. Values that the design fixes in place use arbitrary utilities (`text-[clamp(64px,9.93vw,180px)]`), so the rendered result stays identical rather than snapping to Tailwind's default scale.

Three tokens moved into `tailwind.config.ts`: the fixed preview palette (`preview.blue`, `preview.white`, `preview.black`), the Funnel Sans family, and the three keyframe animations (`flagWave`, `fireflyFlicker`, `caseHeroIn`). Two custom utilities, `.grid-paper` and `.grid-paper-columns`, draw the 80px section grid, which was duplicated across six selectors.

## What remains as CSS

`app/redesign/preview.css` keeps 33 hooks and about 670 lines. It is a plain stylesheet imported by `app/(site)/layout.tsx`, not a CSS module. Four groups of rules justify it:

- **Font faces.** `@font-face` has no utility form.
- **The page root.** The route transition clones the page root outside React, so the clone cannot inherit utility classes. `:where(.preview-root)` carries the font, palette, selection colours and the `--project-frog-size` token. `:where()` keeps its specificity at zero so utilities still win.
- **Cross-cutting link and button states.** Focus outline, hover underline and `touch-action` apply to every link and button. Repeating them on each element would let them drift.
- **The corner-frog and sticky-stage engines.** These combine runtime CSS variables (`--active-corner-size`, `--active-corner-height`, `--active-corner-crop`, `--corner-x`, set by `FrogPresentation`) with three or four simultaneous media conditions. As utilities they would be unreadable, and the user chose a hybrid conversion for exactly this reason.

## Cascade rules

Base utilities beat the retained layer because base rules use `:where()`. State and media rules keep real specificity because they intentionally override the utilities they replace. Speech-tail rules follow the original file order: the desktop tail, the tablet side tail, then the phone tail back to downward. Reordering them silently changes the bubble on phones.

## Element hooks

The retained layer needs stable selectors, so elements that take part in it keep semantic class names next to their utilities: `preview-root`, `preview-project`, `preview-stage`, `preview-desktop-view`, `case-frog`, and so on. DOM lookups that used hashed module names now use data attributes instead: `[data-project-devices]`, `[data-browser-frame]` and `[data-bubbles]`. Those are stable across styling changes.

## Trade-offs

- The CSS bundle is smaller (57.6 KB to 53.8 KB of compiled CSS) but not dramatically so: Tailwind utilities are verbose, and the retained engine is unchanged.
- JSX class strings are long, especially the responsive type ramps. Prettier sorts them, but reading a rule now means reading the element.
- Four tests that read the module's text were repointed at component markers, `preview.css` and `tailwind.config.ts`. They now guard the same behaviour without depending on a file that no longer exists.
- The two style systems scale differently. A change to the sticky stage should still go in `preview.css`; a change to a section's spacing belongs in its JSX.

## Acceptance

- The rendered geometry matches the previous build exactly: home scroll height 14,503 / 12,989 / 22,207 / 18,862 / 13,181px at 1440 / 1024 / 768 / 390 / 320, and project pages 5,548 / 4,800 / 3,846px at 1440 / 768 / 390.
- Frog slot positions, work-grid column widths, sticky-stage screens, phone faces, speech bubbles and tails match the baseline screenshots.
- Horizontal overflow is unchanged from the baseline (1px at 1440, 12px at 1024, from the decorative flag; zero below 1024).
- Reduced motion hides the frog layer, keeps the static frogs visible and leaves the flag still.
- Keyboard focus still reveals the skip link and draws the 3px outline.
- Formatting, lint, typecheck, all 85 tests and an isolated production build pass.
