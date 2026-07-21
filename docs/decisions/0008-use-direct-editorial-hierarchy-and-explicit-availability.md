# ADR 0008: Use direct editorial hierarchy and explicit availability

Date: 2026-07-16
Status: Accepted

## Context

Portfolio v2 already had a credible proof-first project set, accessible shared shell, and a restrained paper, ink, and orange identity. A site-wide presentation review found that repeated uppercase kickers, oversized promotional headings, outlined metadata chips, animated link flourishes, and identical case-study section framing made otherwise specific work feel more templated than necessary.

The three projects also have materially different publication boundaries. A short status enum is useful for validation, but it cannot explain that Chronic Pain Recovery is live, Nibbles with Nifa is published while its public link is intentionally withheld, and Waxlist is an unpublished personal product.

## Decision

- Preserve the Satoshi typeface, paper/ink/orange palette, exact hero statement, three-project order, typed local content contract, and shared seven-part case-study narrative.
- Use direct functional headings for homepage and case-study sections instead of pairing repeated kickers with promotional slogans.
- Make direct email the visually leading hero and footer action. Keep work, resume, LinkedIn, and GitHub as supporting actions.
- Add a required `availabilityLabel` to each project while retaining `status` as the authoritative validated state.
- Present project role, stack, capability, and availability metadata as plain editorial text rather than pills or outlined chips.
- Add a decision index to every case study and keep decision detail in semantic description lists.
- Use one shared case-study renderer with varied layouts for context, ownership, constraints, decisions, proof, outcomes, and reflection rather than creating project-specific templates.
- Keep the existing shader and motion-state controls, but make the warm contour field more visible and protect headline readability through spatial masking.
- Do not add a new font, palette, route, animation dependency, or navigation architecture.

## Consequences

- The site retains its established identity while giving project evidence, availability, and hiring actions a clearer hierarchy.
- Project publication truth is visible in both homepage features and case-study headers and is enforced by the portfolio contract.
- Case studies remain structurally consistent for maintenance and navigation, but their sections no longer repeat one visual composition.
- The decision index adds three reliable in-page navigation targets per case study.
- Presentation changes can be verified through the shared renderer, contract tests, and viewport checks without introducing new runtime dependencies.
