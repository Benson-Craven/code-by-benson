# 0005 — Use synthetic local evidence for unpublished Waxlist

- Date: 2026-07-14
- Status: Accepted

## Context

Waxlist is an implemented but unpublished personal product. Its authenticated workspace can contain real Spotify account details, Discogs collection and wantlist records, shelf locations, notes, marketplace evidence, and provider configuration. The Portfolio v2 case study needs credible interface and engineering proof without implying a public release or exposing private data.

The repository already contains stronger evidence than the old public placeholder: a persistent app shell and shared record inspector, deterministic Spotify-to-Discogs matching with a reliable-confidence threshold, explicit unknown delivered-cost states, exact-want Seller Scout grouping, official Discogs import, cached collection search, shelf tools, and collection-health checks.

## Decision

- Publish Waxlist as an `unpublished` Portfolio v2 case study with no live-product or public-source action.
- Capture the cover and short walkthrough from an isolated local Waxlist copy that excludes environment files and uses an invented session, a non-routable database configuration, intercepted local API responses, and three synthetic collection records.
- Use three sanitised SVG diagrams derived from inspected repository seams for the collector-workspace architecture, confidence-first matching, and truthful buying-evidence decisions.
- State the unpublished and synthetic-evidence boundaries in visible case-study copy, alternative text, captions, the proof section, and metadata.
- Remove the Real-Time Market Dashboard placeholder from public homepage data, case-study data, generated routes, next-project navigation, and sitemap output.

## Consequences

- Hiring reviewers can inspect a real implemented interface and specific engineering decisions without gaining access to Waxlist or its repository.
- The portfolio makes no deployment, production-usage, or public-availability claim for Waxlist.
- Screens and clips remain reproducible without real Spotify, Discogs, database, or collection data.
- A future live or source action requires a separate publication decision and an approved destination; it must not be inferred from this case study.
