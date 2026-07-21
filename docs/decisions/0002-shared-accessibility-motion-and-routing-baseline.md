# ADR 0002: Establish a shared accessibility, motion, and routing baseline

- Status: Accepted
- Date: 2026-07-14
- Decision owner: Benson Craven

## Context

Portfolio v2 will add project evidence and denser case-study content. The current shared shell first needs predictable focus, contrast, loading, motion, and not-found behaviour so later content tickets do not repeat or work around those concerns.

The existing paper, ink, and orange identity remains part of the design direction. The bright orange signal colour is suitable against the ink surface but does not provide sufficient contrast for small text or focus indicators against paper.

## Decision

- Keep the existing visual identity and add semantic text, border, surface, and focus utilities for paper and ink contexts.
- Use the darker signal colour for interactive text and focus indicators on paper, and the bright signal colour on ink.
- Provide one shared skip link and a programmatically focusable `main-content` target on the homepage, case studies, and not-found page.
- Keep the current mobile-navigation structure while adding focus entry, Escape dismissal, link dismissal, and trigger-focus restoration.
- Replace the third-party loading spinner with a small branded status that exposes `aria-busy`, status semantics, and readable loading text.
- Replace the JavaScript case-study progress dependency with CSS scroll-driven progress. Hide it when unsupported and for reduced motion rather than adding a JavaScript fallback.
- Treat hero shader rendering as one of three explicit modes: animated, static for reduced motion, or paused while off-screen or document-hidden. Test the mode decision independently from WebGL rendering.
- Restrict `/work/[slug]` to declared static parameters and use the application not-found boundary for undeclared work and missing routes.

## Consequences

### Positive

- Later case-study and homepage tickets inherit the same keyboard, contrast, loading, reduced-motion, and routing rules.
- The paper and ink surfaces retain their identity without relying on low-contrast orange treatments.
- Case-study progress no longer adds Framer Motion to the work-route client bundle.
- Shader rendering stops consuming animation frames when it is not useful and produces a stable reduced-motion frame.
- Unknown work URLs return a truthful HTTP 404 and are excluded from static route generation.

### Costs and constraints

- CSS scroll-driven progress is progressive enhancement and is intentionally absent in browsers that do not support scroll timelines.
- Shader pause/resume and menu focus behaviour still require manual browser verification in supported desktop and mobile environments.
- Bright orange must not be reused for small paper-surface text or focus without a new contrast review.
