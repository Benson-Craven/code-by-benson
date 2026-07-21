# ADR 0007: Use pageview-only analytics and contact-first hiring actions

Date: 2026-07-15
Status: Accepted

## Context

Portfolio v2 needs a clear route from project evidence to a hiring conversation and lightweight evidence that public pages are being viewed. The existing hero and navigation promoted GitHub as the primary secondary action, while the footer used broad opportunity language. Metadata also repeated unsupported real-time positioning that was no longer tied to the approved project set.

At the time of the initial decision, the approved resume PDF was not present in the repository or Git history, so a truthful resume action could not yet be published.

## Decision

- Use the existing direct email address as the primary hiring action in the hero and navigation.
- Keep GitHub and LinkedIn as supporting evidence in the footer.
- Describe availability as open to the right Frontend Engineer role without implying immediate or unconditional availability.
- Use the confirmed Frontend Engineer positioning consistently in visible copy, metadata, and structured data.
- Integrate the default `@vercel/analytics/next` `Analytics` component for pageviews only. Do not add custom events, callbacks, cookies, debug configuration, or tracking secrets.
- Defer resume actions until the approved PDF is supplied and can be served from a stable same-site path.

On 2026-07-15, Benson supplied the approved 2026 CV. The exact file is now served unchanged at `/benson-craven-resume.pdf` and linked from the hero, desktop and mobile navigation, and footer.

## Consequences

- Hiring managers can contact Benson directly from the first screen, desktop navigation, mobile navigation, and footer.
- GitHub remains available without acting as the main conversion path.
- Analytics remains within the deliberately narrow privacy and implementation scope.
- Enabling Web Analytics in the Vercel project remains an external administration step; this code change does not deploy or enable the service.
- The stable resume URL can be updated with a future approved document without changing public links.
