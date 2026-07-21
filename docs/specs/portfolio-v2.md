# Portfolio v2 Specification

Status: confirmed for implementation planning
Last updated: 2026-07-14

## Problem and desired outcome

The current portfolio has a strong visual identity and a working Next.js foundation, but it does not yet give a hiring manager enough trustworthy evidence to assess Benson’s engineering judgement quickly. Two public project entries contain explicit placeholder language, Waxlist links to `#`, Nibbles with Nifa is missing, and the homepage repeats broad capability claims rather than tying skills to project decisions and outcomes.

Portfolio v2 should make Benson legible as a credible mid-level Frontend Engineer to a product-team hiring manager. Within a short review, the visitor should understand what Benson builds, what he personally owned, how he handled constraints, and where the evidence can be inspected. The release should feel like a refinement of the existing portfolio rather than a new visual brand.

The desired first-release outcome is:

- a concise, proof-first homepage;
- three complete, truthful case studies in a deliberate order;
- clear ownership and collaboration credit;
- an obvious path to a resume, contact details, and current availability;
- an accessible, responsive, indexable, and performant production build; and
- no placeholders, invented metrics, dead links, or implied publication states.

## Repository baseline

The requirements below are grounded in the audited checkout:

| Observed current state                                                                                                                                                 | Repository evidence                                                                                                                |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Next.js 14 App Router, React 18, strict TypeScript, Tailwind CSS, Framer Motion                                                                                        | `package.json`, `tsconfig.json`, `tailwind.config.ts`                                                                              |
| The homepage renders Header, Hero, Selected Work, Engineering Approach, Experience, About, and Footer                                                                  | `app/page.tsx`                                                                                                                     |
| Work pages are generated from a local case-study collection at `/work/[slug]`                                                                                          | `app/work/[slug]/page.tsx`, `app/data/caseStudies.ts`                                                                              |
| Project summaries and case-study bodies are split across two local TypeScript collections                                                                              | `app/data/projects.ts`, `app/data/caseStudies.ts`                                                                                  |
| Current public work includes Chronic Pain Recovery, Real-Time Market Dashboard, and Waxlist                                                                            | `app/data/projects.ts`                                                                                                             |
| Market and Waxlist entries contain placeholder signals; Waxlist includes `href: "#"`                                                                                   | `app/data/projects.ts`, `app/data/caseStudies.ts`                                                                                  |
| The current homepage repeats broad proof claims in Engineering Approach, Technical Depth, and Proof Strip                                                              | `app/components/approach/StickyApproach.tsx`, `app/components/experience/Experience.tsx`                                           |
| Global metadata, robots, sitemap, JSON-LD, and a dynamic Open Graph image already exist                                                                                | `app/layout.tsx`, `app/robots.ts`, `app/sitemap.ts`, `app/components/JsonLd.tsx`, `app/opengraph-image.tsx`                        |
| The hero’s paper/ink/orange identity, portrait, local time, and shader are already implemented                                                                         | `app/components/hero/Hero.tsx`, `app/components/hero/LocalTime.tsx`, `app/components/hero/ShaderBackground.tsx`, `app/globals.css` |
| Shared accessibility issues include no homepage skip target, incomplete mobile-menu keyboard handling, low-contrast focus orange, and a spinner without a status label | `app/page.tsx`, `app/components/navigation/MobileNav.tsx`, `app/globals.css`, `app/loading.tsx`                                    |
| Unknown work slugs can render a not-found body without a real 404 response                                                                                             | `app/work/[slug]/page.tsx` and observed local production response                                                                  |
| The static image directory is about 40 MiB, although the active redesign directly references only the Chronic cover and portrait there                                 | `public/images`, references found under `app/`                                                                                     |

`USER_REQUIREMENTS.md` and `DESIGN.md` were not present in this checkout during the audit. This specification records only repository observations and decisions confirmed in the portfolio interview.

## Audience

### Primary audience

Product-team hiring managers and engineering leads reviewing candidates for frontend engineering roles.

They need to determine quickly:

- whether Benson can own meaningful product work;
- whether he can explain technical and product decisions clearly;
- whether his React, TypeScript, Next.js, integration, accessibility, SEO, and performance skills are evidenced rather than listed;
- whether he can work responsibly with clients and collaborators; and
- how to contact him or review his resume.

### Secondary audience

Recruiters and potential collaborators who need a concise summary of role fit, experience, location, availability, and representative work.

### Positioning

- Public title: **Frontend Engineer**.
- Level signal: credible mid-level ownership without inflated seniority claims.
- Core proposition: **“I build interfaces that make complex systems feel simple.”**
- Supporting proof should come from project decisions, production context, collaboration, and verifiable artefacts rather than generic skill ratings or unsupported metrics.

## User stories

1. As a hiring manager, I want to understand Benson’s role and level from the first screen, so that I can decide whether to continue reviewing.
2. As a hiring manager, I want the strongest work first, so that limited review time is spent on representative evidence.
3. As an engineering lead, I want each case study to distinguish context, ownership, constraints, decisions, proof, outcomes, and reflection, so that I can evaluate judgement rather than visual polish alone.
4. As an engineering lead, I want technical skills connected to real project decisions, so that I can judge whether the claimed experience is credible.
5. As a reviewer, I want screenshots and short interaction clips with explanatory captions, so that I can understand the evidence without opening another product.
6. As a reviewer, I want external links to represent the project’s actual publication state, so that I am never sent to a placeholder or unrelated site.
7. As a reviewer, I want collaboration credit to be explicit, so that I understand what Benson owned and what collaborators contributed.
8. As a keyboard user, I want to reach content, navigation, media controls, and calls to action in a predictable order, so that the site is fully operable without a pointer.
9. As a motion-sensitive visitor, I want animation and smooth scrolling reduced when I request reduced motion, so that the portfolio remains comfortable to use.
10. As a mobile visitor, I want case-study text, evidence media, navigation, and actions to fit a narrow viewport without loss of information, so that I can review the portfolio on any device.
11. As a recruiter, I want a concise experience timeline, resume, location, availability, and contact path, so that I can assess logistics and follow up.
12. As a visitor arriving from search or a shared link, I want a unique title, description, canonical URL, and social image for each public page, so that I know which project I am opening.
13. As Benson, I want portfolio content in typed local data, so that I can update work safely without operating a CMS.
14. As Benson, I want pageview analytics without custom tracking requirements, so that I can understand traffic while keeping the first release simple and privacy-conscious.

## Information architecture

### Public routes

1. `/` — employer-focused portfolio homepage.
2. `/work/chronic-pain-recovery` — client healthcare case study.
3. `/work/nibbles-with-nifa` — collaborative editorial product case study.
4. `/work/waxlist` — unpublished product case study.
5. `/sitemap.xml` and `/robots.txt` — generated discovery routes.
6. A static resume PDF linked from the homepage and footer.

No standalone skills, services, blog, or resume HTML page is required for the first release.

### Homepage content order

1. Global header and skip link.
2. Hero: role, retained headline, concise supporting copy, portrait/local-time signal, primary work action.
3. Selected work, in this exact order:
    1. Chronic Pain Recovery
    2. Nibbles with Nifa
    3. Waxlist
4. Compact experience timeline with verified role dates.
5. Short about, availability, resume, and contact block.
6. Global footer.

Engineering Approach, Technical Depth, and Proof Strip should not remain as three separate homepage sections. Useful claims from them may be retained only where they are concise, non-duplicative, and connected to project or experience evidence.

### Case-study navigation

- Every selected-work item links to its case study.
- Case studies provide a route back to selected work and a next-case-study path following the same three-project order.
- The sequence loops only if it remains clear and useful; a simple end state linking to all work is acceptable.
- Removed or unknown slugs return a real 404 and are excluded from metadata and the sitemap.

## Content and data requirements

Use one typed local TypeScript content model as the public source of truth for homepage project summaries, case-study routes, metadata, sitemap entries, evidence media, and project links.

Each public project must define:

- stable slug, display order, title, summary, and status;
- timeframe, Benson’s role, collaborators and their credited roles where applicable;
- stack and evidence-linked capability labels;
- cover image and case-study social/share image;
- exactly three decision records using the fixed case-study structure below;
- outcomes that are qualitative or substantiated, never invented metrics;
- one cover image, three evidence stills, and one short evidence clip;
- semantic actions such as case study, live site, source, or resume rather than placeholder flags; and
- a stable content-updated date for sitemap metadata.

Link rules:

- Chronic Pain Recovery may link to its verified production site.
- Nibbles with Nifa may link to its canonical public site only after its real public content is confirmed release-ready. Demo copy, draft content, Studio credentials, preview tokens, permission notes, and unpublished material must never appear in the portfolio.
- Waxlist is not published. It must have no live-product CTA and no public-source CTA in v2. Its case study may use approved, sanitised evidence and must label the product truthfully as unpublished.
- The Real-Time Market Dashboard is removed from public data, routes, next-project navigation, sitemap output, and homepage content.
- No public action may use `#`, a generic profile in place of a project source, an unrelated deployment, or placeholder copy.

## Page and component requirements

### Global shell

- Preserve the existing restrained paper, ink, and orange identity, Satoshi typography, broad spacing rhythm, and large editorial headings.
- Keep navigation concise: Work, Experience, About, Resume, and the most useful contact or GitHub action.
- Add a visible-on-focus skip link to the homepage and case-study main content.
- Use a consistent, high-contrast focus treatment across light and dark surfaces.
- Provide an accessible loading state and a branded not-found state.

### Hero

- Retain the exact headline: “I build interfaces that make complex systems feel simple.”
- Identify Benson as a Frontend Engineer based in Cork, Ireland.
- Keep the current portrait and local-time detail because they add specific, human context.
- Keep supporting copy short and aligned with product-facing React, TypeScript, Next.js, integration, and interaction work.
- Primary action: view selected work. Secondary actions should be limited to the highest-value hiring paths.
- Retain the shader only if it meets motion and performance requirements.

### Selected work

- Show exactly three project features in the approved order.
- Each feature includes title, concise problem/outcome summary, Benson’s role, status, evidence-linked capability labels, cover image, and a case-study action.
- External actions appear only when a valid, approved project destination exists.
- Replace synthetic dashboard previews and unexplained sample values with real project evidence.

### Experience timeline

- Use a compact chronological presentation rather than another large promotional section.
- Include verified role title, employer, dates, and a concise delivery summary.
- Use **Frontend Engineer** consistently as the portfolio positioning; employment titles may preserve their verified official wording.
- Do not invent dates. Source them from the approved resume or direct confirmation before implementation is accepted.

### About, availability, and hiring actions

- Keep the personal summary concise and product-focused.
- State that Benson is open to the right roles without implying an urgent or absolute availability commitment.
- Provide a direct resume PDF link and a reliable contact action.
- Keep GitHub as supporting evidence, not the main conversion path.

### Case-study page

- Render the fixed narrative structure in a consistent order.
- Show role, timeframe, status, stack, capabilities, and collaboration credit near the top.
- Interleave explanatory text and evidence media so each artefact supports a nearby decision.
- Provide meaningful media captions and alternative text.
- Avoid sticky or multi-column reading patterns on narrow screens.
- Preserve a clear back-to-work path and next-case-study action.

### Evidence media

- Each study includes one cover image, three evidence stills, and one short clip.
- Images have intrinsic dimensions, appropriate responsive sizes, efficient formats, and specific alt text. Decorative imagery uses empty alt text.
- Clips are click-to-play, never autoplay, and use a poster image, native controls, `preload="none"`, `playsInline`, and muted playback by default.
- Each clip has captions where speech or meaningful audio exists and a nearby text description or transcript sufficient to understand the interaction without playback.
- Do not expose client data, user data, private drafts, credentials, tokens, unpublished editorial content, or internal permission notes.

## Case-study structure

Every case study follows the same decisions-and-evidence structure:

1. **Context** — the product, audience, and problem.
2. **Ownership** — Benson’s responsibilities, collaborators, and explicit boundaries.
3. **Constraints** — technical, product, content, privacy, client, or delivery limits.
4. **Key decisions** — exactly three consequential decisions, each explaining:
    - the problem or trade-off;
    - the selected approach;
    - why it was chosen; and
    - the supporting screenshot or clip.
5. **Proof** — the evidence gallery and links that a reviewer can inspect.
6. **Outcomes** — substantiated results or concrete delivered capabilities. Qualitative outcomes are preferred to invented numbers.
7. **Reflection** — what Benson learned, what he would improve, or what comes next.

### Chronic Pain Recovery emphasis

- Lead with clarity and trust in a sensitive healthcare context.
- Show how content structure, semantic implementation, accessibility, SEO, and production delivery supported patient understanding.
- Keep claims conservative and substantiated. Client permission for public use is confirmed.

### Nibbles with Nifa emphasis

- Lead with the editorial product system and self-service publishing workflow.
- Credit Benson with engineering and product architecture.
- Credit Nifa with editorial direction and creator work.
- Use sanitised evidence of the Studio, preview, publish-readiness, and published-content boundary without exposing drafts or private configuration.
- The portfolio release waits until the Nibbles public site contains approved real content and is safe to link.

### Waxlist emphasis

- Lead with the collector workflow and the product decisions that make record discovery and collection management more useful.
- Be explicit that Waxlist is unpublished.
- Use sanitised product stills and a short interaction clip as evidence.
- Do not include a live-site link, public-source link, deployment promise, or simulated production claim.

## Responsive behaviour

The first release must work at representative widths from 320 px through large desktop layouts.

- At 320–767 px, use a single-column reading order, full-width media within the content gutter, non-sticky metadata, and actions that wrap without clipping.
- At tablet widths, introduce columns only when reading order and touch targets remain clear.
- At desktop widths, retain the existing generous max-width layout and editorial scale without creating excessively long text lines.
- Project media preserves aspect ratio and never causes horizontal scrolling or layout shift.
- Headings use fluid sizes with safe line lengths and no clipped words.
- Navigation remains operable at zoomed text sizes; the mobile menu must not depend on hover.
- Interactive targets should be at least 44 by 44 CSS pixels where practical.
- Test at minimum: 320, 390, 768, 1024, and 1440 CSS pixels, plus 200% browser zoom on a desktop viewport.

## Accessibility and reduced-motion behaviour

- Meet WCAG 2.2 AA expectations for the implemented pages and content.
- Normal text must meet 4.5:1 contrast; large text must meet 3:1; focus indicators and meaningful UI boundaries must meet applicable non-text contrast.
- Use the darker signal colour for small orange text on paper. Do not use the current bright orange as the only focus indicator on paper where it lacks contrast.
- Provide one logical `h1` per page and a meaningful heading hierarchy.
- Use semantic landmarks and a skip link targeting the main content on every page shell.
- The mobile menu must announce expanded state, move focus into the opened menu, close on Escape, close on navigation, and return focus to its trigger.
- All actions must be reachable and visible by keyboard with no keyboard trap.
- Images, videos, captions, transcripts, and external-link labels follow the evidence-media requirements above.
- Loading states expose a text status to assistive technology. Unknown routes expose a real not-found response.
- With `prefers-reduced-motion: reduce`, smooth scrolling is disabled, entrance and progress animations are removed or made instantaneous, hover motion is non-essential, and the shader renders a static frame.
- Without reduced motion, continuous shader work pauses when the hero is outside the viewport or the document is hidden.
- No important information depends on animation, colour alone, hover, or audio.

## SEO requirements

- The homepage and each public case study have a unique title, description, canonical URL, and relevant Open Graph/Twitter image.
- Case-study metadata is derived from the same typed public content used to render the page.
- The sitemap contains only the homepage and the three approved public case-study routes, with stable last-modified values from content rather than the current time on every build.
- Removed and unknown project slugs return HTTP 404 and are not indexed.
- Keep and update the existing Person JSON-LD only with truthful current information; add project/article structured data only if the values can be maintained accurately.
- All page links use descriptive labels. Placeholder, generic, unrelated, and dead project links are prohibited.
- The production hostname remains `https://benson.codes`.

## Performance requirements

- Mobile Lighthouse targets are Performance 90 or higher and Accessibility 95 or higher on the homepage and the Nibbles with Nifa case study, tested against a production build.
- Preserve server-rendered content and keep client components limited to interactions that require them.
- New images use Next.js image optimisation or an equivalent responsive path, explicit dimensions, suitable `sizes`, and compressed AVIF/WebP/JPEG assets.
- Evidence videos use a compressed web delivery format, poster images, click-to-play controls, and `preload="none"`.
- The hero shader must cap rendering resolution, respect reduced motion, and stop work when off-screen or when the document is hidden.
- Remove Framer Motion from simple case-study progress behaviour if the same result can be achieved with CSS or a smaller native implementation; remove the dependency only if no retained feature uses it.
- Avoid shipping synthetic previews or client-side effects that do not strengthen hiring evidence.
- Broad deletion of the legacy `public/images` archive is not required, but every asset used by v2 must be intentional and optimised.
- The production build must complete without lint or TypeScript errors and without secrets or debugging output.

## Analytics requirements

- Add Vercel Web Analytics pageviews only.
- Do not require custom events, heatmaps, advertising identifiers, or a cookie-based analytics product for v2.
- Analytics must not block rendering or introduce a consent requirement under the chosen configuration.

## Testing decisions

The main automated seam is the typed public portfolio collection. It should be consumed by homepage features, static route generation, page metadata, next-project navigation, and sitemap generation. Contract tests at this seam should prove the exact public project set and catch placeholders, invalid links, missing evidence, duplicate slugs, inconsistent status, and missing SEO fields.

Use route-level or production-server checks for externally visible behaviour:

- the homepage and three approved case studies return 200;
- removed and unknown work slugs return 404;
- metadata and sitemap contain only approved public pages;
- resume and approved external project links resolve as intended; and
- media markup exposes the required accessible and loading behaviour.

Prefer behaviour tests over snapshots of component implementation. Add the smallest test tooling compatible with the existing Next.js and TypeScript setup. Browser-level automation is optional for v2; the required responsive, keyboard, focus, media, reduced-motion, and Lighthouse checks may be performed manually and recorded in the release ticket.

## Scope

Portfolio v2 includes:

- the typed public project/case-study content model and its contract tests;
- a refined homepage using the existing visual identity;
- complete Chronic Pain Recovery, Nibbles with Nifa, and Waxlist case studies;
- removal of the Real-Time Market Dashboard from public portfolio surfaces;
- approved, optimised evidence media for each case study;
- compact experience, about, availability, resume, contact, and pageview analytics;
- the shared accessibility, responsive, SEO, routing, reduced-motion, and performance fixes required by this specification; and
- a passing local production release gate.

## Out of scope

- A new visual identity, design system rewrite, or wholesale component refactor.
- A CMS, blog, services catalogue, contact form, or standalone skills page.
- Creating or publishing unverified project metrics or testimonials.
- Deploying or publishing Waxlist, opening its source, or adding a live Waxlist link.
- Changes to the Chronic Pain Recovery, Nibbles with Nifa, or Waxlist product repositories.
- Publishing Nibbles drafts or private Studio/preview information.
- Restoring or rewriting the Real-Time Market Dashboard case study.
- Custom analytics events, paid analytics features, heatmaps, or experimentation tooling.
- Total cleanup of legacy components or the full static image archive.
- Framework upgrades, broad dependency upgrades, or unrelated refactoring.
- Production deployment of the portfolio; deployment requires separate explicit authorisation.

## Acceptance criteria

- [ ] The public homepage positions Benson as a Frontend Engineer and retains the confirmed hero headline, portrait, Cork location, and local-time detail.
- [ ] The homepage presents exactly Chronic Pain Recovery, Nibbles with Nifa, and Waxlist, in that order.
- [ ] The Real-Time Market Dashboard is absent from homepage content, public routes, case-study navigation, metadata, and sitemap output.
- [ ] All three approved case-study routes render the fixed context, ownership, constraints, three key decisions, proof, outcomes, and reflection structure.
- [ ] Each case study includes one optimised cover, three evidence stills, and one accessible click-to-play clip.
- [ ] Nibbles credits Benson and Nifa according to the confirmed ownership split and exposes no private editorial or technical information.
- [ ] The portfolio is not released until Nibbles links to approved real public content rather than demo or draft content.
- [ ] Waxlist is labelled unpublished and has no live-product or public-source link.
- [ ] No page contains placeholder labels, `href="#"`, unrelated project destinations, fabricated metrics, or unsupported outcome claims.
- [ ] Skills and capabilities shown on the homepage or case studies are connected to project or experience evidence.
- [ ] The experience timeline includes verified titles and dates, and the hiring path includes availability, a working resume PDF, and a reliable contact action.
- [ ] A typed public content contract supplies the homepage, work routes, metadata, navigation, and sitemap, with automated tests for its invariants.
- [ ] The homepage and approved case studies return 200; removed and unknown work slugs return HTTP 404.
- [ ] Every public page has unique metadata, canonical URL, relevant share image, logical headings, and descriptive links.
- [ ] The sitemap contains only the homepage and three approved case studies with stable content-derived last-modified values.
- [ ] Keyboard users can skip to content, operate navigation and media, see focus, close the mobile menu with Escape, and receive focus back at the trigger.
- [ ] Text, focus indicators, and meaningful UI boundaries meet the stated contrast requirements on light and dark surfaces.
- [ ] Reduced-motion mode disables non-essential motion and smooth scrolling and renders the shader statically; normal mode pauses the shader off-screen and when the document is hidden.
- [ ] Layout and content are usable without horizontal overflow at 320, 390, 768, 1024, and 1440 CSS pixels and at 200% zoom.
- [ ] V2 evidence images and clips are sized, compressed, lazy or deferred as appropriate, and do not cause avoidable layout shift.
- [ ] Vercel Web Analytics collects pageviews only; custom events are not required.
- [ ] Lint, TypeScript checks, automated tests, and the production build pass.
- [ ] Mobile Lighthouse scores are at least 90 Performance and 95 Accessibility on the homepage and Nibbles with Nifa case study.
- [ ] No secrets, private drafts, private client/user data, debug output, or accidental unrelated changes are included.
- [ ] No deployment, commit, push, or publication occurs as part of implementation unless separately authorised.
