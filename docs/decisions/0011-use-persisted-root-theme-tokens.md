# ADR 0011: Use persisted root theme tokens

Date: 2026-07-21
Status: Accepted

## Context

The shared portfolio shell used fixed paper, ink, orange, and muted Tailwind colours. A site-wide light and dark control needs to update every existing semantic surface without duplicating theme state across pages or replacing the established visual identity.

The animated header control also needs to avoid a light-theme flash, respect reduced motion, and keep the WebGL hero aligned with the document theme.

## Decision

- Store the explicit user choice under `benson-theme` and apply it to the root document.
- Default to dark when the user has not made a choice.
- Restore the theme in the document head before page content renders.
- Drive the existing paper, alternate-paper, ink, signal, and muted Tailwind colours from root CSS channels so current semantic utilities switch together.
- Keep the orange contrast pairing surface-aware when paper and ink invert.
- Read the same theme channels in the hero shader and redraw only when its existing motion mode allows rendering.
- Keep the toggle icon-only with a changing accessible name, pressed state, 44-pixel target, and zero-duration animation for reduced motion.

## Consequences

- One control in the shared header changes the homepage, case studies, loading state, and not-found route without a page-level provider.
- Theme choice persists across navigation and reloads, while first-time visitors start in dark mode.
- Future palette changes must update both the hex values and space-separated RGB channels in `app/globals.css`.
- Visual review remains necessary for the two palettes and the animated sun-to-moon transition.
