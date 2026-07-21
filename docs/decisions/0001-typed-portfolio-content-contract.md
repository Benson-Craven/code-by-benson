# ADR 0001: Use a typed local portfolio content contract

- Status: Accepted
- Date: 2026-07-14
- Decision owner: Benson Craven

## Context

The current portfolio keeps homepage project summaries and case-study narratives in separate TypeScript collections. Those collections can drift, currently include placeholder states, and do not express the evidence, ownership, accessibility, SEO, publication, or link invariants required by Portfolio v2.

Portfolio v2 needs one maintainable content seam that can eventually drive the homepage, work routes, metadata, sitemap, and next-project navigation. The first contract ticket must not invent unfinished project content or force an all-at-once migration of the current rendered pages.

## Decision

- Define the Portfolio v2 project shape and validation in one local TypeScript module.
- Encode the approved public order and final public status for Chronic Pain Recovery, Nibbles with Nifa, and Waxlist.
- Use discriminated action types for case-study, live-site, source, resume, and contact links.
- Keep an explicit allowlist for currently approved project destinations. Chronic Pain Recovery may link to its production site, Nibbles may link to its canonical public site only in the final published state, and Waxlist has no approved public destination.
- Model meaningful and decorative images separately so alternative-text intent is explicit. Require three meaningful evidence stills and one accessible, deferred evidence clip per case study.
- Link capability claims and decisions to evidence IDs and validate those references at runtime. Keep IDs as author-friendly strings for the first release; introduce branded IDs or a content builder only if authoring errors justify the added abstraction.
- Use Node’s test runner through `tsx` for TypeScript contract tests. Keep TypeScript checking as a separate script.
- Leave the existing rendered project and case-study collections in place until their roadmap tickets migrate complete, approved content to the new contract.
- Publish a stable, explicit homepage content-update date from the same portfolio module so sitemap metadata remains content-derived instead of changing at build time.

## Consequences

### Positive

- Content completeness, project order, status, links, media requirements, metadata, and evidence references have one testable boundary.
- Placeholder copy, unrelated destinations, contradictory publication states, and unresolved evidence can fail before release.
- Later page and case-study tickets can migrate incrementally without changing the contract shape each time.

### Costs and constraints

- `tsx` is added as a development dependency so the TypeScript contract can be tested on the repository’s supported Node versions.
- Approved status or destination changes require an intentional contract-policy and test update.
- Evidence references are validated at runtime rather than being fully inferred across the content collection at compile time.
- The legacy collections remain temporarily and must be removed only after all public consumers use the new source of truth.

Migration completed 2026-07-15: the homepage, work routes, metadata, next-project navigation, and sitemap now consume the approved portfolio collection, so the legacy public project and case-study collections were removed.
