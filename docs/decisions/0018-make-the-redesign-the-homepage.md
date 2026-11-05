# Make the redesign the homepage

Date: 2026-11-04

## Decision

Serve the redesign at `/` as the site's homepage. The previous Portfolio v2 homepage no longer renders, and `app/page.tsx` is gone.

Project pages move from `/redesign/projects/[slug]` to `/projects/[slug]`. `/redesign` and `/redesign/projects/[slug]` permanently redirect to `/` and `/projects/[slug]` through `next.config.mjs`. Browsers keep the fragment when following the redirect, so an old `/redesign#work` link lands on `/#work`.

The new homepage and project pages are indexable. The homepage inherits the root metadata, canonical `https://benson.codes/` and `index, follow`. Project pages use the typed `seo` title, description, share image and canonical `/projects/<slug>`. The sitemap now lists both `/work/<slug>` and `/projects/<slug>`, and the homepage content date moves to 2026-11-04.

The homepage content ships as designed: hero, intro, the three project presentations, the All work grid and the contact footer. The experience chronology, résumé action and selected-work roster from the previous homepage are not part of it.

## Structure

A route group, `app/(site)`, now owns the front-door routes. Its layout holds the persistent `ProjectTransition` controller and the polite route status region, and wraps both the homepage and `/projects/[slug]`. The old `/work`, not-found and other routes stay outside that group, so the transition controller does not attach to them.

The implementation components, hooks and styles stay in `app/redesign/`. Only the route entries moved. `ProjectCase` moved from a page folder to `app/redesign/ProjectCase.tsx`, and the project URL helpers now build and parse `/projects/...`. This keeps the route change small and avoids a second visual system.

## Trade-offs

The redesign was built as an isolated `noindex` preview in ADR 0012 and its project routes were kept out of the sitemap in ADR 0014. This decision supersedes those route and indexability choices.

`/work/[slug]` is deliberately unchanged, so the site now has two presentational versions of each case study and both are indexed. Retiring `/work`, redirecting it to `/projects`, and deleting the unused homepage components and their tests is a sensible follow-up, but it is a separate migration and was not part of this change.

The homepage no longer links the résumé or shows the employment chronology. That is the shipped design, not an accidental omission. The résumé remains published at `/benson-craven-resume.pdf`.

## Acceptance

- `/` returns 200 and renders the redesign with the root indexable metadata.
- `/projects/<slug>` returns 200 with its typed metadata and canonical.
- `/redesign` and `/redesign/projects/<slug>` return 308 to the new routes and preserve fragments.
- `/work/<slug>` keeps its previous markup and metadata.
- The sitemap contains the homepage, the `/work` set and the `/projects` set; no `/redesign` URL appears.
- The transition, focus return and reduced-motion fallback still work from the homepage.

## Follow-up

On 2026-11-05 the unused previous-homepage tree was deleted: `About`, `Experience`, `Hero`, `LocalTime`, `ShaderBackground`, `shaderMotion`, `ProjectFeature`, `ProjectShowcase` and `SelectedWork`, together with `app/data/experience.ts` and their stale tests. No route imported them after the redesign became the homepage. `/work/[slug]` is still unchanged and still indexed, so retiring it remains a separate migration.

`public/images/portrait.avif` is now unreferenced by application code. It was kept because it is original personal media, not generated code, and removing it is a content decision rather than file cleanup.
