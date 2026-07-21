# ADR 0009: Use the canonical Nibbles public URL

Date: 2026-07-16
Status: Accepted

## Context

ADR 0004 withheld the Nibbles with Nifa live-site action while its public destination awaited explicit approval. The user has now directed the portfolio to use `https://nibbles-with-nifa.vercel.app/` as the correct public URL.

The case-study cover and walkthrough remain locally captured development evidence and must not be presented as captures of the public dataset.

## Decision

- Add a `Visit live site` action for Nibbles with Nifa using the supplied canonical URL exactly, including its trailing slash.
- Present the project availability as `Published live site`.
- Keep the existing local-capture disclosures and public/private content boundaries.
- Retain the destination in the project allowlist so unrelated URLs still fail contract validation.

## Consequences

- The homepage and Nibbles case study now expose the approved public destination.
- The rendered destination, project data, and validation policy share one exact canonical value.
- ADR 0004 remains the history for the evidence boundary but no longer governs link visibility.
