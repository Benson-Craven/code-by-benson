# ADR 0003: Use current public evidence for Chronic Pain Recovery

- Status: Accepted
- Date: 2026-07-14
- Decision owner: Benson Craven

## Context

The repository contained one older Chronic Pain Recovery screen in duplicate PNG and AVIF formats and no evidence clip. Portfolio v2 requires one cover, three meaningful stills, and one click-to-play clip, while prohibiting invented results, private client data, and recreated mockups presented as production proof.

Client permission for public portfolio use is confirmed in the Portfolio v2 specification. The approved production destination is `https://chronicpainrecovery.ie`.

## Decision

- Capture the current public production interface rather than manufacture replacement screens.
- Use a reduced-motion desktop render at 1440 by 900 pixels for the cover and three WebP evidence stills: the homepage, conditions system, trust/services transition, and science structure.
- Use a six-second, silent H.264 scroll from the homepage to the science section as the evidence clip. Keep the clip at 960 by 540 pixels, provide a poster and nearby text description/transcript, use native controls, set `preload="none"`, and never autoplay it.
- End the walkthrough before the public footer so business contact details are not part of the portfolio evidence. Include no consultation, patient, credential, token, draft, or private client data.
- Base claims on observed repository content and the current public interface. Keep outcomes qualitative. The production HTML was checked for semantic headings, descriptive images, search metadata, and FAQ structured data; no traffic, conversion, clinical, or treatment-result metrics are claimed.
- Add Chronic Pain Recovery as the first implemented project in the shared Portfolio v2 data module. Keep the two legacy case-study routes operational until their own tickets migrate them.
- Keep the shared case-study renderer project-neutral. Require and render explicit ownership boundaries, and expose an optional next-project seam that activates as later approved studies join the implemented collection.

## Consequences

### Positive

- Hiring evidence reflects the current public product rather than an unsupported mockup.
- Media requirements are satisfied with small, responsive assets and a deferred clip under 1 MiB.
- The case study makes Benson’s implementation ownership visible without claiming medical authorship or treatment outcomes.
- Nibbles with Nifa and Waxlist can reuse the same renderer without inheriting healthcare or production-only language.

### Costs and constraints

- The evidence is a dated record of the public site and should be recaptured if the production interface changes materially.
- A silent scroll proves layout and information architecture, not private workflows or quantitative outcomes.
- Until Tickets 4 and 5 are complete, only Chronic Pain Recovery uses the Portfolio v2 renderer and its end state links back to all selected work rather than to an unfinished case study.
