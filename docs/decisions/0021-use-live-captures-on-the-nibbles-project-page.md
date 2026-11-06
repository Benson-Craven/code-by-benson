# Use live captures on the Nibbles project page

Date: 2026-11-06

## Decision

`/projects/nibbles-with-nifa` now shows the real homepage still in the hero, the
current desktop clip in the main browser frame, two live screenshots of the
recipe index and the travel feature in the half-width frames, and no separate
walkthrough section. The three architecture diagrams stay on the
`/work/nibbles-with-nifa` case study, where they explain specific decisions.

## Design

- The Nibbles desktop slots `1` and `2` in `showcaseMedia` hold the two
  screenshots. Slot `0` keeps the desktop clip that the homepage showcase
  already uses.
- `ProjectCase` reads `showcaseMedia[slug].desktop` for Chronic Pain Recovery and
  Nibbles with Nifa. Chronic Pain Recovery shows its clip in the hero and again
  in the large frame. Nibbles keeps the real homepage still in the hero because
  its clip starts at the top of the homepage and scrolls immediately, which
  crops badly in the 16:10 hero. The clip plays in the large frame below.
- The paired frames skip `PixelDevelop` because `PreviewMedia` already renders
  the real screenshots. The hero keeps its pixel reveal over the cover still.
- The separate walkthrough section is hidden for Nibbles, matching the Chronic
  Pain Recovery page. The new desktop clip lives in `showcaseMedia`; the case
  study keeps its original five-second walkthrough in `evidence.clip`.
- The screenshots are 1440x900 WebP captures of the current public site. They
  show the recipe index and the Japan travel feature, both of which read as
  finished pages without the seeded copy that other views still show.
- The preview note says the screenshots come from the current public site. It
  no longer says they come from a local development build.

## Trade-offs

- The public deployment still serves starter content. Other views show "Sample
  recipe" and "Untested demonstration copy", so the captures avoid those
  viewports. That keeps the page presentable but means the screenshots do not
  represent every page of the site.
- The live site changes independently of this repository. The captures are a
  snapshot and will age if Nifa publishes or restyles the pages.
- The clip appears in both the homepage showcase and the project page. Reusing
  it keeps the two presentations consistent, at the cost of a second download
  when a visitor sees both pages.
- Nibbles no longer has a walkthrough section on its project page. The clip is
  still available on the case study, and the project page is shorter than
  Waxlist's.

## Acceptance

- The project page renders the homepage still in the hero, the desktop clip in
  the large frame and the two screenshots in the paired frames at 1440, 768 and
  390 CSS pixels.
- The old five-second walkthrough section is absent from the Nibbles page.
- Reduced motion keeps the poster, the screenshots and the next-project card
  visible.
- The screenshot files exist, carry alt text and pass the existing media test.
