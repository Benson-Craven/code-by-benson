# Portfolio v2 Roadmap

Source: `docs/specs/portfolio-v2.md`
Status: Tickets 1–8 are complete locally. The user approved the canonical Nibbles with Nifa destination for public portfolio use on 2026-07-16; deployment remains a separate decision.
Execution: work one ticket at a time in numerical order; do not perform unrelated refactoring, deploy, commit, or push unless separately requested.

## Dependency graph

1. Portfolio content contract — no blockers.
2. Shared quality baseline — blocked by 1.
3. Chronic Pain Recovery case study — blocked by 2.
4. Nibbles with Nifa case study — blocked by 2.
5. Waxlist case study and market retirement — blocked by 2.
6. Proof-first homepage — blocked by 3, 4, and 5.
7. Hiring conversion path — blocked by 6.
8. Portfolio v2 release gate — blocked by 7.

Tickets 3–5 are separate reviewable project slices. They may be implemented independently after ticket 2, but the default plan is numerical order and ticket 6 cannot start until all three are complete.

## Ticket 1 — Establish the Portfolio v2 content contract and test seam

**Reviewable outcome:** The application has one typed, tested public-project contract that can safely drive every Portfolio v2 surface while preserving the current rendered site until later tickets migrate its content.

**Blocked by:** None — can start immediately.

**Status:** Completed 2026-07-14.

### Scope

- Define the shared public project and case-study model for summaries, status, ownership, collaborators, timeframe, stack, capabilities, links, decisions, outcomes, evidence media, social image, and content-updated date.
- Represent image and video evidence with semantic types and required accessibility/loading fields.
- Represent project actions by meaning rather than placeholder flags.
- Establish the exact public slug set and order: Chronic Pain Recovery, Nibbles with Nifa, Waxlist.
- Add the smallest compatible automated test command and contract tests at the typed content seam.
- Keep current rendering operational while the content is migrated ticket by ticket.

### Out of scope

- Rewriting case-study content.
- Adding final screenshots or clips.
- Changing homepage or case-study layouts.
- General test-framework expansion or unrelated data refactoring.

### Acceptance criteria

- [ ] The typed contract can express every required Portfolio v2 field without `any` or placeholder booleans.
- [ ] Public link types prevent `#` and distinguish case-study, live-site, source, resume, and contact actions.
- [ ] Waxlist is representable as unpublished with no live-site or public-source action.
- [ ] Nibbles collaboration credit and sanitised evidence requirements are representable.
- [ ] The exact public slug set and order are encoded and testable.
- [ ] Contract tests fail for duplicate/unknown slugs, placeholders, invalid links, missing evidence, missing metadata, or contradictory publication status.
- [ ] Existing pages still build while later content tickets remain unfinished.

### Automated verification

- Run the new content-contract test command.
- Run the TypeScript checker.
- Run the linter.
- Run the production build to prove the expanded contract has not broken current routes.

### Manual verification

- Review the model against every required spec field.
- Confirm no project claims, dates, outcomes, or URLs were invented to satisfy the type.
- Confirm the diff is limited to the contract, its consumers needed for compatibility, tests, and scripts.

## Ticket 2 — Repair the shared visual, accessibility, motion, and routing baseline

**Reviewable outcome:** The existing homepage and case-study shell share a keyboard-operable, contrast-safe, reduced-motion-aware baseline with truthful 404 behaviour before new project content is added.

**Blocked by:** Ticket 1.

**Status:** Completed 2026-07-15. Source, automated, contrast, route, responsive, skip-link, and mobile-keyboard checks passed. Normal-motion WebGL draws stop off-screen and while a real browser tab is hidden, then resume when visible again; reduced-motion mode selects the static renderer.

### Scope

- Replace invalid or non-generated Tailwind opacity/spacing utilities with valid, intentional tokens or arbitrary values.
- Establish contrast-safe text, border, surface, and focus treatments on paper and ink backgrounds.
- Add skip links and reliable main-content targets.
- Complete mobile navigation focus entry, Escape close, navigation close, and trigger-focus return.
- Replace the current visual-only loading spinner with an accessible branded status.
- Make removed and unknown work slugs return a real 404 and prevent undeclared dynamic slugs.
- Make case-study progress behaviour lightweight and reduced-motion safe.
- Render the hero shader statically for reduced motion and pause it when off-screen or when the document is hidden.

### Out of scope

- Homepage content restructuring.
- New case-study copy or evidence media.
- A new design system or broad component rewrite.
- Full browser automation infrastructure.

### Acceptance criteria

- [ ] No known invalid custom opacity or spacing class remains in active Portfolio v2 surfaces.
- [ ] Text and visible focus meet the spec’s contrast requirements on light and dark surfaces.
- [ ] Skip links work on the homepage and case-study shell.
- [ ] The mobile menu is fully operable with keyboard alone and restores focus when closed.
- [ ] Loading exposes a meaningful assistive status.
- [ ] An unknown work slug returns HTTP 404 rather than a soft 404.
- [ ] Reduced-motion mode removes non-essential progress/entrance motion and renders one static shader frame.
- [ ] Normal motion pauses shader rendering when the hero is not visible or the page is hidden.

### Automated verification

- Run content-contract tests, TypeScript checks, lint, and the production build.
- Start the production build locally and assert 200 for an existing route and 404 for an unknown work slug.
- If an accessibility test seam is added, run it against the shared shell without snapshotting implementation details.

### Manual verification

- Keyboard-test skip links, desktop navigation, mobile menu open/close, Escape, focus order, focus return, and loading state.
- Inspect light and dark focus/text treatments with a contrast checker.
- Toggle reduced motion and verify smooth scrolling and continuous effects stop.
- Scroll the hero out of view and hide/restore the tab while checking that animation work pauses and resumes appropriately.

## Ticket 3 — Publish the Chronic Pain Recovery evidence case study

**Reviewable outcome:** A hiring manager can review one complete, production-client case study that demonstrates clarity, trust, semantic frontend work, SEO, and delivery through specific decisions and approved evidence.

**Blocked by:** Ticket 2.

**Status:** Completed 2026-07-14.

### Scope

- Migrate Chronic Pain Recovery to the shared Portfolio v2 contract.
- Rewrite the narrative into context, ownership, constraints, three key decisions, proof, substantiated outcomes, and reflection.
- Make Benson’s design, frontend engineering, and deployment ownership explicit.
- Add one approved cover, three evidence stills, and one short click-to-play clip with captions/description and safe metadata.
- Retain the verified Chronic Pain Recovery production-site action.
- Add unique case-study metadata and a relevant share image.

### Out of scope

- Changes to the client’s production site.
- New client claims, testimonials, health claims, or unverified metrics.
- Reworking the shared case-study layout beyond what this evidence requires.
- Changes to the other two projects.

### Acceptance criteria

- [ ] The study follows the complete fixed case-study structure with exactly three decisions.
- [ ] Copy leads with clarity and trust in a sensitive healthcare context.
- [ ] Role, constraints, decisions, and outcomes are specific and conservative.
- [ ] One cover, three evidence stills, and one click-to-play clip render with required accessibility and loading behaviour.
- [ ] Public media has client permission and contains no private client or user data.
- [ ] The live-site action points to the approved Chronic Pain Recovery production site.
- [ ] Metadata and share imagery are unique and accurate.

### Automated verification

- Run contract tests and assert the Chronic slug has complete content and evidence.
- Run TypeScript checks, lint, and the production build.
- Verify the generated Chronic route returns 200 and exposes the expected canonical URL and media attributes.

### Manual verification

- Review every outcome and technical claim against available project evidence.
- Inspect image crops, captions, alternative text, poster, controls, transcript/description, and no-autoplay behaviour.
- Test the case study at narrow mobile and desktop widths with keyboard and reduced motion.
- Open the external client link and confirm it is the intended destination.

## Ticket 4 — Publish the Nibbles with Nifa evidence case study

**Reviewable outcome:** A hiring manager can review a complete collaborative case study showing Benson’s editorial product architecture and engineering work while clearly crediting Nifa and protecting private content.

**Blocked by:** Ticket 2.

**Status:** Completed 2026-07-14.

### Scope

- Add Nibbles with Nifa to the shared public project collection and case-study route.
- Build the narrative around the editorial product system, self-service Sanity workflow, preview/publish readiness, and published-content boundary.
- Credit Benson for engineering and product architecture and Nifa for editorial direction and creator work.
- Add one approved cover, three sanitised evidence stills, and one short click-to-play clip.
- Add unique metadata and a relevant share image.
- Add the canonical public-site action only after the real-content public release is confirmed safe and approved.

### Out of scope

- Changes to the Nibbles with Nifa application, Sanity schemas, Studio, content, hosting, or deployment.
- Publishing drafts, entering editorial content, or completing the Nibbles release on behalf of its editor.
- Exposing preview tokens, private drafts, permission notes, credentials, or internal configuration.
- Rewriting shared portfolio infrastructure unrelated to this study.

### Acceptance criteria

- [ ] The study follows the complete fixed case-study structure with exactly three decisions.
- [ ] Collaboration credit clearly distinguishes Benson’s and Nifa’s contributions.
- [ ] Evidence demonstrates the editorial workflow and public-content boundary without exposing private data.
- [ ] One cover, three evidence stills, and one click-to-play clip meet media accessibility and loading requirements.
- [ ] The study contains no demo claims presented as production facts and no unpublished editorial material.
- [ ] A live-site action is shown only after the canonical public site contains approved real content.
- [ ] Metadata and share imagery are unique and accurate.

### Automated verification

- Run contract tests and assert the Nibbles slug, credit fields, complete evidence, and publication-safe link state.
- Run TypeScript checks, lint, and the production build.
- Verify the generated Nibbles route returns 200 and exposes the expected canonical URL and media attributes.

### Manual verification

- Have the ownership and editorial credit reviewed for accuracy.
- Inspect every Studio/preview image and clip for drafts, tokens, personal data, permission notes, and secrets.
- Confirm the public Nibbles destination is real-content ready before enabling or approving its link.
- Test the case study at narrow mobile and desktop widths with keyboard and reduced motion.

## Ticket 5 — Publish Waxlist honestly and retire the market placeholder

**Reviewable outcome:** The public work set contains a complete, evidence-led Waxlist case study with an honest unpublished status, while the placeholder Real-Time Market Dashboard is absent from every public portfolio surface.

**Blocked by:** Ticket 2.

**Status:** Completed 2026-07-14.

### Scope

- Migrate Waxlist to the shared Portfolio v2 contract.
- Rewrite the narrative around the collector workflow, Benson’s ownership, consequential product/engineering decisions, current proof, substantiated outcomes, and reflection.
- Label Waxlist as unpublished and omit live-product and public-source actions.
- Add one approved cover, three sanitised evidence stills, and one short click-to-play clip.
- Add unique Waxlist metadata and a relevant share image.
- Remove the Real-Time Market Dashboard from public content, static routes, sitemap data, and next-project navigation.

### Out of scope

- Deploying or publishing Waxlist.
- Publishing the Waxlist source repository or adding a speculative live URL.
- Product work in the Waxlist repository.
- Reusing the market placeholder as a smaller project.
- Unrelated legacy component or asset cleanup.

### Acceptance criteria

- [ ] The Waxlist study follows the complete fixed case-study structure with exactly three decisions.
- [ ] Waxlist is visibly and consistently described as unpublished.
- [ ] No live-product, public-source, placeholder, generic GitHub, or unrelated deployment link is shown for Waxlist.
- [ ] One cover, three evidence stills, and one click-to-play clip are sanitised and meet media requirements.
- [ ] Evidence contains no credentials, tokens, private user data, or secrets.
- [ ] The market dashboard is absent from homepage data, public case-study routes, sitemap output, and next-project navigation.
- [ ] Requests to the removed market slug return HTTP 404.
- [ ] Waxlist metadata and share imagery are unique and accurate.

### Automated verification

- Run contract tests for the exact public project set, Waxlist publication/link invariants, and removal of the market slug.
- Run TypeScript checks, lint, and the production build.
- Verify Waxlist returns 200, while the former market route and an unknown work route return 404.
- Inspect generated sitemap output for only the approved routes.

### Manual verification

- Review Waxlist copy for accurate ownership, current status, and no implied production release.
- Inspect all screenshots and clips for private or sensitive information.
- Test media, keyboard, reduced-motion, mobile, and desktop behaviour.
- Confirm no CTA appears to offer a live product or public source.

## Ticket 6 — Refocus the homepage around project proof

**Reviewable outcome:** A hiring manager can scan a concise homepage and understand Benson’s positioning, strongest work, evidence-backed capabilities, and experience without repeated promotional sections.

**Blocked by:** Tickets 3, 4, and 5.

**Status:** Completed 2026-07-15. The approved CV verifies all three rendered official titles, employers, and date ranges; implementation and both final review axes are clean.

### Scope

- Retain the paper/ink/orange identity, hero headline, portrait, local time, and restrained motion.
- Tighten hero support copy and actions around Frontend Engineer positioning and selected work.
- Render the exact three-project order from the shared public content collection.
- Give every project feature a real cover, specific summary, role/status, evidence-linked capabilities, and valid actions.
- Replace synthetic dashboard visuals and sample values with actual evidence.
- Convert experience into a compact chronology with verified titles and dates.
- Remove or consolidate the separate Engineering Approach, Technical Depth, and Proof Strip sections.
- Keep about copy concise and avoid duplicating the hiring conversion block planned for ticket 7.

### Out of scope

- A new visual identity or homepage concept.
- Additional projects, testimonials, services, a blog, or a standalone skills page.
- Inventing employment dates or outcomes.
- Resume, analytics, and final contact-path work assigned to ticket 7.

### Acceptance criteria

- [ ] The first screen identifies Benson as a Frontend Engineer and retains the confirmed headline and personal signals.
- [ ] Selected work shows exactly Chronic Pain Recovery, Nibbles with Nifa, and Waxlist in that order.
- [ ] Project features contain real evidence and valid actions with no synthetic metrics or placeholders.
- [ ] Skills/capabilities shown on the homepage are supported by a nearby project or experience item.
- [ ] Experience is compact, chronological, and uses only verified dates and titles.
- [ ] Engineering Approach, Technical Depth, and Proof Strip no longer repeat the same unsupported claims as separate large sections.
- [ ] The homepage remains coherent and readable from 320 px through large desktop widths.

### Automated verification

- Run contract tests, TypeScript checks, lint, and the production build.
- Assert the homepage renders the exact approved project titles/order and excludes known placeholder/market text.
- Check active source for prohibited placeholders and synthetic preview values.

### Manual verification

- Perform a hiring-manager scan: role, strongest work, ownership, and evidence should be understandable without reading every paragraph.
- Compare mobile, tablet, and desktop layout for hierarchy, wrapping, media crops, and horizontal overflow.
- Keyboard-test the full homepage and inspect focus order after section consolidation.
- Review employment dates and titles against the approved resume or direct confirmation.

## Ticket 7 — Complete the hiring conversion path

**Reviewable outcome:** A qualified reviewer can move from portfolio evidence to a working resume, contact method, and truthful availability signal, while Benson receives privacy-conscious pageview analytics.

**Blocked by:** Ticket 6.

**Status:** Completed 2026-07-15. The approved PDF is published unchanged at `/benson-craven-resume.pdf`; stable resume links, availability, direct email paths, supporting GitHub/LinkedIn links, public positioning, and pageview-only Vercel Analytics are implemented and both final review axes are clean.

### Scope

- Publish the approved resume PDF as a stable static asset and link it from high-value homepage/footer locations.
- Add concise “open to the right roles” availability copy.
- Provide a reliable direct contact action and retain GitHub as supporting evidence.
- Make Frontend Engineer positioning and employment-title wording consistent across metadata, visible copy, and structured data.
- Add Vercel Web Analytics pageviews only.
- Update footer/navigation actions where required for the final hiring path.

### Out of scope

- A contact form, CRM, newsletter, scheduling integration, or downloadable portfolio bundle.
- Resume rewriting or generation.
- Custom analytics events, paid analytics features, heatmaps, advertising, or cookie-based tracking.
- Deployment or Vercel project administration.

### Acceptance criteria

- [ ] The resume link opens the approved PDF from a stable same-site URL.
- [ ] Availability copy is visible, concise, and does not overpromise.
- [ ] A reviewer can reach a working contact method from the homepage and footer.
- [ ] GitHub is present as supporting evidence rather than the only conversion action.
- [ ] Public title/positioning is consistent, while verified official employment titles remain accurate.
- [ ] Vercel Web Analytics is integrated for pageviews only.
- [ ] No custom event code, tracking cookies, debug analytics, or secret configuration is added.

### Automated verification

- Run contract tests, TypeScript checks, lint, and the production build.
- Assert the resume asset returns 200 and key internal actions use valid destinations.
- Verify the analytics integration builds without requiring custom-event configuration.
- Search the diff for custom event calls, placeholder links, debug output, and accidental secrets.

### Manual verification

- Open the resume from each rendered link and inspect the published file.
- Test contact and GitHub actions, including visible external-link behaviour.
- Review availability wording and title consistency as a hiring manager.
- Confirm no cookie banner or interactive delay is introduced by pageview analytics.

## Ticket 8 — Meet the Portfolio v2 release gate

**Reviewable outcome:** The complete local production build has recorded evidence that it meets the agreed content, routing, accessibility, responsive, SEO, reduced-motion, and performance bar and is ready for a separate deployment decision.

**Blocked by:** Ticket 7.

**Status:** Local release-gate verification completed 2026-07-15. The canonical Nibbles with Nifa external link was approved and enabled locally on 2026-07-16. Deployment remains a separate decision.

### Scope

- Run the complete automated verification suite and local production build.
- Verify approved routes, removed/unknown 404s, sitemap, robots, canonical metadata, share metadata, structured data, and resume response.
- Audit keyboard navigation, focus, media controls, headings, contrast, zoom, responsive layouts, loading, not-found, external links, and reduced motion.
- Run mobile Lighthouse against the homepage and Nibbles with Nifa case study using the production build.
- Optimise only v2 assets or code that prevent the agreed thresholds from being met.
- Record results and remaining external release dependencies in continuity.

### Out of scope

- New features, copy expansion, broad refactors, framework upgrades, or total legacy-asset cleanup.
- Product changes in any featured project repository.
- Publishing Nibbles content or publishing/deploying Waxlist.
- Deploying, committing, pushing, releasing, or opening a pull request.

### Acceptance criteria

- [x] The exact public route set and resume asset return successful responses from the local production server.
- [x] The former market slug and an unknown work slug return HTTP 404.
- [x] Sitemap, robots, canonical URLs, share metadata, and structured data match the approved public content.
- [x] No placeholder, demo-as-production, dead/unrelated link, fabricated metric, secret, private draft, or debug output remains.
- [x] Keyboard, focus, skip links, mobile menu, media controls, headings, contrast, and loading/not-found states pass manual review.
- [x] Layout passes at 320, 390, 768, 1024, and 1440 CSS pixels and at 200% zoom without horizontal overflow or hidden content.
- [x] Reduced-motion mode disables non-essential motion and continuous effects; normal motion pauses off-screen/hidden shader work.
- [x] Homepage mobile Lighthouse is at least 90 Performance and 95 Accessibility.
- [x] Nibbles mobile Lighthouse is at least 90 Performance and 95 Accessibility.
- [x] The user approved the canonical Nibbles external link for public portfolio use on 2026-07-16.
- [x] Waxlist remains truthfully unpublished with no live-product or public-source link.
- [x] Continuity records the exact checks, scores, caveats, and any external release dependencies.

### Recorded verification — 2026-07-15

- The isolated production build passed the complete automated suite, TypeScript, lint, and route/metadata probes. A final review added coverage for the single-source work route and stable homepage sitemap date, bringing the suite to 44 tests. Approved pages and the resume returned 200; the former market and unknown work routes returned 404.
- The four public pages had no horizontal overflow at 320, 390, 768, 1024, or 1440 CSS pixels. A physical 200% Chrome zoom check reflowed to the narrow layout without hidden content.
- Keyboard checks covered the skip link, native mobile-menu activation, first-link focus, Escape close, and trigger-focus restoration. Videos remained paused and user-controlled with text descriptions.
- A real browser-tab switch recorded zero WebGL draws while hidden and resumed drawing after restore. Reduced-motion tests select the static renderer and remove non-essential scroll motion.
- Mobile Lighthouse measured 97 Performance and 100 Accessibility for both the homepage and Nibbles with Nifa; FCP was 1.3 s, LCP 2.5 s, TBT 10 ms, and CLS 0 on both runs.

### Automated verification

- Run formatting if the repository has a configured formatter check.
- Run the full content/route test suite, TypeScript checker, linter, and production build.
- Run local production HTTP checks for all approved routes, the resume, former market route, and an unknown work route.
- Inspect sitemap and page metadata output.
- Run mobile Lighthouse for `/` and `/work/nibbles-with-nifa` and save the measured scores in the handoff.

### Manual verification

- Test the homepage and all three case studies with keyboard only.
- Test reduced motion, loading, not-found, video controls/captions/descriptions, and external links.
- Inspect every page at the required viewport widths and 200% zoom.
- Use a contrast checker for representative light/dark text, focus, and boundaries.
- Review every public image and clip for crop quality, legibility, permissions, sensitive data, and accurate captions.
- Confirm the final diff contains no unrelated application or generated-file changes.

## Release dependencies and notes

- The user explicitly approved `https://nibbles-with-nifa.vercel.app/` for public portfolio use on 2026-07-16. The portfolio work did not change or publish the Nibbles product itself.
- Waxlist is not published and does not block the portfolio case study. Its v2 evidence is local/sanitised, and its public case study deliberately has no live-product or source link.
- Verified employment dates and the approved resume PDF were supplied and accepted on 2026-07-15. The public asset retains the exact approved bytes and the homepage chronology uses its official role details.
- The v2 evidence images and clips were reviewed and sanitised during Tickets 3–5. Any replacement evidence would require the same approval pass.
- Production deployment remains a separate, explicitly authorised action after ticket 8.
