# ADR 0010: Use plain, specific portfolio copy

Date: 2026-07-16
Status: Accepted

## Context

The portfolio facts and evidence were sound, but much of the writing used abstract phrases, long balanced sentences and repeated product-language formulas. That made specific engineering work sound less personal and less credible.

`SLOP.md` calls for fewer words, real details and deliberate language. It also identifies em dashes, generic transformation claims and padded capability statements as common machine-written tells.

## Decision

- Keep the approved hero statement, employment facts, project status, ownership, URLs and evidence boundaries unchanged.
- Write short sentences around concrete objects, actions and constraints.
- Use first person where Benson made a decision or owns the work.
- Name the actual route, content state, provider value, threshold or interface when it matters.
- Remove em dashes and high-confidence filler phrases from public copy and metadata.
- Keep technical terms when they explain implementation; do not replace them with marketing language.
- Test the rendered homepage and every case study against the agreed high-confidence copy tells.

## Consequences

- The homepage and case studies sound more direct without losing technical detail.
- Claims remain tied to inspected code, public pages, tests or supplied employment facts.
- Future edits have a rendered-page regression for obvious wording drift, while human review remains necessary for tone and rhythm.
