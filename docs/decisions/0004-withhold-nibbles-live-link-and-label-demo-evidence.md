# 0004 — Withhold the Nibbles live link and label demo evidence

- Date: 2026-07-14
- Status: Superseded by ADR 0009

The evidence-labelling decision remains in force. The live-link withholding decision was superseded on 2026-07-16 when the user explicitly directed the portfolio to use the canonical public URL.

## Context

The Nibbles with Nifa frontend is publicly reachable, but its current Sanity dataset mixes a partially authored travel entry with seeded or incomplete recipe, article, shop, and kitchen content. The public pages include missing media and filler metadata, so the deployment does not yet meet the Portfolio v2 requirement for an approved real-content destination.

The case study still needs visual evidence, while Studio sessions, draft material, internal editorial annotations, and credentials must remain outside the portfolio.

## Decision

- Publish the Nibbles case study without a live-site action.
- Capture interface evidence only from an isolated local build running the repository's explicit demo content source.
- Label the interface cover, clip, captions, and proof statement as local development-demo evidence rather than current public content.
- Use sanitised architecture diagrams derived from the inspected content store, preview configuration, schema rules, and route-level tests to show the Studio readiness workflow and public/preview boundary without showing authenticated Studio screens.
- Reconsider the canonical live-site action only after the public dataset contains approved real content.

## Consequences

- Hiring reviewers can inspect the interface and the engineering decisions without being sent to an unfinished editorial release.
- The evidence does not expose unpublished Sanity content or authenticated tooling, while the decision diagrams remain inspectable and mapped to the implementation seams they describe.
- The case study must distinguish implemented system outcomes from editorial launch readiness.
- Enabling the live link remains a later content-approval task, not a code assumption.
