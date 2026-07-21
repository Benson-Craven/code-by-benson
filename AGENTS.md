# Project Instructions

## Startup

Before substantial work:

1. Read this file.
2. Read `.agent/CONTINUITY.md`.
3. Read `USER_REQUIREMENTS.md`.
4. Read `DESIGN.md`.
5. Inspect relevant existing files before proposing changes.

## Working principles

- Understand the existing implementation before editing it.
- Keep changes small, scoped and reversible.
- Reuse existing patterns before adding abstractions or dependencies.
- Do not invent requirements, data, results or metrics.
- Clearly separate confirmed facts from assumptions.
- Preserve accessibility, responsive behaviour, SEO and performance.
- Prefer simple solutions over clever ones.
- Do not modify unrelated files.

## Before implementation

Report:

- Goal
- Relevant existing behaviour
- Proposed approach
- Files likely to change
- Risks or assumptions
- Verification plan

Do not begin implementation until the task is sufficiently specified.

## During implementation

- Work on one ticket or clearly defined slice at a time.
- Keep business logic separate from presentation where practical.
- Add or update tests for meaningful behaviour.
- Avoid broad refactors unless required by the ticket.
- Record important technical decisions in `docs/decisions/`.

## Verification

Before completing work, run the relevant:

- Formatter
- Linter
- Type-checker
- Automated tests
- Production build

Also verify:

- Mobile layout
- Keyboard navigation
- Loading, empty and error states
- Reduced-motion behaviour where animation exists
- No secrets or debugging output were added

## Completion response

Provide:

1. What changed
2. Files changed
3. Decisions made
4. Verification performed
5. Remaining risks or follow-up work

Update `.agent/CONTINUITY.md` after meaningful progress.
