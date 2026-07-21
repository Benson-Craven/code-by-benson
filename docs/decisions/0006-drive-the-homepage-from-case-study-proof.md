# ADR 0006: Drive the homepage from case-study proof

Date: 2026-07-14
Status: Accepted

## Context

The redesign homepage previously used a separate legacy project collection and repeated broad capability claims across Engineering Approach, Technical Depth, and Proof Strip sections. That structure made the page visually substantial but left hiring managers to connect the claims to project evidence themselves.

Portfolio v2 already has a validated public project collection with exact ordering, ownership, status, capabilities, actions, and evidence. Maintaining another homepage-specific content source would create drift and could reintroduce retired or unpublished destinations.

## Decision

Render Selected Work directly from `implementedPortfolioProjects`. Each feature presents the project cover, summary, ownership, status, stack, evidence-linked capabilities, and approved actions from that shared record.

Remove Engineering Approach, Technical Depth, and Proof Strip as standalone homepage sections. Keep experience as a compact chronology and About as a short product-focused summary.

## Consequences

- Homepage claims stay tied to the same validated evidence used by each case study.
- Project ordering and publication boundaries have one source of truth.
- The homepage becomes shorter and easier to scan without changing its visual identity.
- Employment titles and dates remain a separate factual boundary and must be confirmed before the experience chronology is accepted.
