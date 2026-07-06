You are working on a complete rebuild of my personal portfolio website, `benson.codes`.

I am a frontend-focused developer based in Cork, Ireland. My main stack is React, Next.js, TypeScript and Tailwind. I also have experience with real-time systems, WebSockets/STOMP, Spring Boot, production deployment, SEO, analytics and CMS platforms.

I want you to design and implement a new portfolio from scratch inside the existing repository.

The goal is to position me as:

> A frontend-focused product engineer who combines strong visual judgement with technically complex frontend engineering.

Do not make this look like a generic developer portfolio, SaaS landing page, shadcn dashboard, crypto site, or component-library demo.

The visual direction should be:

- editorial
- technically sophisticated
- restrained
- slightly experimental
- highly polished
- warm and human rather than corporate
- inspired by independent design studios and product engineering portfolios
- custom-feeling rather than template-feeling

The site should use a custom interactive shader as the main hero visual identity.

## First: inspect the existing project

Before changing anything:

1. Inspect the full repository.
2. Identify:
    - framework and Next.js version
    - App Router vs Pages Router
    - Tailwind setup
    - existing fonts
    - animation libraries
    - Three.js / React Three Fiber dependencies
    - current component structure
    - current project data

3. Reuse useful infrastructure where appropriate.
4. Do not preserve outdated layouts merely for compatibility.
5. Prefer a clean rebuild of the homepage architecture.

Do not ask me for confirmation before proceeding. Make sensible decisions and implement the strongest version.

---

# Core visual concept

The homepage should be built around the idea:

> Complex systems, made legible.

The hero should use a custom animated WebGL shader that feels like a living signal field, interference pattern, topographic field, heat distortion, or analogue data signal.

It should NOT look like:

- a glowing portal
- a sci-fi HUD
- a crypto landing page
- a game UI
- an energy ring
- a generic aurora gradient
- a copied 21st.dev shader hero

The shader should feel custom and restrained.

Use:

- warm paper background
- near-black text
- burnt orange / vivid orange as the primary signal colour

Suggested palette:

```txt
Background: #F2EFE8
Primary text: #171714
Signal orange: #FF5722
Dark signal: #B92E12
Muted grey: #D8D2C8
```

You may refine these slightly if needed.

---

# Shader requirements

Use React Three Fiber and Three.js only if already installed or appropriate for the current project.

The shader should:

- occupy the hero background
- be visually concentrated mainly toward the right side of the viewport
- remain asymmetric
- move slowly
- use layered interference/noise patterns
- respond subtly to pointer movement
- avoid excessive brightness
- avoid a centred glowing object
- avoid literal rings
- avoid distracting from text
- fade or reduce intensity as the user scrolls away from the hero

The pointer should behave as an invisible influence field.

Use uniforms similar to:

```ts
time
pointer
intensity
colorBackground
colorSignal
```

The shader should be responsive and account for viewport aspect ratio.

The background should be static or near-static when the user has:

```css
prefers-reduced-motion: reduce;
```

Performance requirements:

- cap DPR, preferably around `[1, 1.5]`
- avoid unnecessary geometry subdivisions
- use a simple plane where possible
- avoid large numbers of meshes
- do not allocate new Three.js objects every frame
- do not trigger React state updates inside `useFrame`
- provide a graceful non-WebGL fallback
- ensure the site still looks good without WebGL

Keep the shader isolated inside a Client Component.

Do NOT turn the whole page into a Client Component.

Suggested architecture:

```txt
app/
  page.tsx

components/
  hero/
    Hero.tsx
    ShaderBackground.tsx
    SignalPlane.tsx
```

---

# Hero section

Create a high-impact first viewport.

Suggested content:

Eyebrow:

```txt
FRONTEND ENGINEER
```

Main heading:

```txt
I build interfaces
that make complex
systems feel simple.
```

Supporting copy:

```txt
Frontend-focused engineer working across React, TypeScript and real-time product experiences.
```

Metadata:

```txt
Based in Cork, Ireland
```

Primary actions:

```txt
View selected work
GitHub ↗
```

The heading should remain the dominant element.

Layout preference:

- left-aligned copy
- large editorial typography
- shader concentrated mostly right of centre
- generous negative space
- minimal rounded UI
- no giant pill buttons
- no glassmorphism

The hero should feel intentionally composed rather than vertically centred by default.

---

# Navigation

Create a minimal navigation.

Desktop:

```txt
Benson Craven          Work   Experience   About   GitHub ↗
```

Mobile:

Use a clean compact menu.

Avoid:

- huge full-screen menu animation
- excessive blur
- floating pill nav
- generic SaaS navbar appearance

Navigation should remain visually restrained.

---

# Section 1: Selected Work

Create a strong editorial project section featuring exactly three primary projects.

## Project 1

Title:

```txt
Chronic Pain Recovery
```

Description:

```txt
A production healthcare platform turning complex pain-science concepts into an accessible, discoverable patient experience.
```

Tags:

```txt
Next.js
TypeScript
SEO
Structured Data
```

Role:

```txt
Design, frontend engineering, deployment
```

Signals:

```txt
REAL CLIENT
PRODUCTION
2025–2026
```

Actions:

```txt
Read case study →
Visit live site ↗
```

Use existing project imagery from the repository if available.

---

## Project 2

Title:

```txt
Real-Time Market Dashboard
```

Description:

```txt
A React trading interface consuming streaming market updates from a Spring backend over WebSockets and STOMP.
```

Tags:

```txt
React
TypeScript
Spring Boot
WebSockets
```

Focus:

```txt
Real-time state, derived market data, resilient UI
```

Actions:

```txt
Read case study →
GitHub ↗
```

If no strong image exists, create the layout so a screenshot or video can be dropped in later.

---

## Project 3

Title:

```txt
Waxlist
```

Description:

```txt
A modern collection dashboard for vinyl enthusiasts, designed around faster browsing, collection insight and a cleaner alternative to legacy catalogue workflows.
```

Tags should reflect the actual implementation found in the repository.

Likely examples:

```txt
Next.js
TypeScript
Discogs API
Product Design
```

Do not claim integrations that are not actually implemented.

Actions:

```txt
Read case study →
View project ↗
```

---

# Project presentation

Do not use generic cards.

Avoid:

- three equal rounded cards in a row
- glass panels
- floating gradient borders
- oversized border-radius
- generic Bento grid styling

Instead use an editorial project layout:

- large project imagery
- strong numbering
- asymmetric grid
- clear metadata
- horizontal rules
- restrained hover motion

Possible structure:

```txt
01
CHRONIC PAIN RECOVERY

Large visual

Production healthcare platform...
Role...
Stack...

Read case study →
```

Then alternate visual alignment for subsequent projects.

---

# Section 2: Engineering approach

Use a heavily adapted version of the interaction pattern commonly known as “Sticky Scroll Reveal”.

Do not copy a 21st.dev or Aceternity example verbatim.

Use only three items:

## 01 Real-time interfaces

```txt
Streaming data, derived state and resilient UI behaviour.
```

Visual:

- animated quote rows
- live market UI preview
- small data visualisation

## 02 Production delivery

```txt
Deployment, structured data, analytics and ongoing operation.
```

Visual:

- Chronic Pain Recovery interface
- deployment or architecture metadata

## 03 Product engineering

```txt
Turning complex requirements into interfaces that feel obvious.
```

Visual:

- Waxlist interface
- filtering / collection interaction

Requirements:

- desktop can use sticky interaction
- mobile must fall back to a normal stacked layout
- maximum three items
- avoid excessive scroll length
- no 500vh sections
- keep motion subtle

---

# Section 3: Experience

Create a clean professional experience section.

Do not reproduce a full CV.

Include:

## Web Developer — First Page

Copy should communicate:

```txt
Delivering production web changes across React-based applications, WordPress, Shopify, Webflow and other client platforms in a high-throughput agency environment.
```

Points:

```txt
Ship and QA production content, UI and technical SEO changes across diverse client stacks.

Implement structured data, semantic content architecture and performance-conscious frontend changes.

Work independently across unfamiliar codebases and CMS environments under daily delivery targets.
```

## Earlier systems experience — CGI

Keep the wording factual and restrained.

Focus on:

- systems-oriented environment
- established codebases
- testing
- technical documentation
- engineering discipline

Do not invent achievements or metrics.

---

# Section 4: Technical depth

Create a section titled something like:

```txt
Engineering beyond the happy path
```

Use three editorial columns or stacked sections.

## Real-time interfaces

```txt
WebSocket subscriptions, stale-state handling, derived data and resilient connection states.
```

## Production delivery

```txt
Deployment, analytics, structured data, SEO and ongoing maintenance.
```

## Product-minded frontend

```txt
Component boundaries, interaction details, responsive behaviour and accessible UI states.
```

Do not use:

- skill percentage bars
- spinning technology logos
- giant logo clouds
- “90% React” style indicators

---

# Section 5: Experience proof / credibility strip

Create a compact proof section.

Possible content:

```txt
CURRENTLY
Web Developer · First Page

FOCUS
React · TypeScript · Product Engineering

BASED
Cork, Ireland
```

Or a similarly strong composition.

Do not invent numerical claims.

---

# Section 6: About

Keep this concise.

Suggested copy:

```txt
I’m Benson, a frontend-focused developer based in Cork. I enjoy the point where engineering and product design meet: turning complex behaviour into interfaces that feel obvious.

My background spans high-throughput production web work, independent product development and systems-oriented software environments. I work primarily with React, TypeScript and Next.js, with experience integrating backend services and real-time systems.
```

Add one subtle human detail if appropriate, but do not turn this into a long biography.

---

# Footer / final CTA

Replace generic freelance copy such as:

```txt
Have a project in mind?
```

with something more aligned to frontend and product engineering roles.

Use:

```txt
Let’s build something worth using.
```

Supporting copy:

```txt
I’m interested in frontend and product engineering opportunities, particularly teams working on ambitious, technically interesting products.
```

Links:

```txt
Email
LinkedIn
GitHub
```

The shader may subtly reappear in the footer at much lower intensity, but only if performance and visual balance remain good.

---

# 21st.dev component guidance

Use 21st.dev components only as interaction references or implementation starting points.

Do not make the site look assembled from marketplace components.

I want the following patterns considered:

## 1. Animated Link

Use or adapt a restrained animated link interaction for:

```txt
View case study ↗
Live site ↗
GitHub ↗
LinkedIn ↗
```

Desired behaviour:

- underline reveal
- small arrow translation
- subtle orange accent
- no exaggerated spring animation

## 2. Sticky Scroll Reveal

Use the interaction pattern only for the three-item Engineering Approach section.

Heavily restyle and adapt it.

## 3. Scroll Progress

Reserve for case-study pages.

Create a reusable component now if appropriate:

```txt
components/work/ScrollProgress.tsx
```

Use a thin progress line fixed to the top.

## 4. Scroll Media Expansion

Do not necessarily use on the homepage.

Create only if there is already strong video or media available.

Potential use:

- Market Dashboard case study
- Waxlist case study

## Avoid

Do not use:

- portfolio gallery components
- zoom parallax galleries
- 3D container scroll animations
- morphing job-title text
- generic full portfolio heroes
- generic shader hero components
- cursor trails
- excessive blob effects
- spotlight cards
- glassmorphism
- default Aceternity styling

---

# Motion direction

Motion should be:

- slow
- deliberate
- editorial
- physically believable
- subtle

Use motion primarily for:

- initial hero reveal
- animated links
- project-image hover
- sticky reveal transitions
- shader pointer influence
- scroll-linked shader fade

Avoid:

- constant bouncing
- excessive springs
- letter-by-letter animation everywhere
- parallax on every section
- scroll hijacking
- custom smooth scrolling unless genuinely necessary

Respect reduced-motion preferences.

---

# Typography

Inspect current fonts first.

Prefer:

- a strong grotesk / sans-serif for primary typography
- optional editorial serif accent
- small uppercase metadata
- generous line height
- tight large-heading tracking where appropriate

Do not use a generic Inter-only SaaS aesthetic unless no better existing font is available.

The typography should feel like a design-led engineering portfolio.

---

# Accessibility

Implement properly:

- semantic landmarks
- correct heading hierarchy
- keyboard-accessible navigation
- visible focus states
- reduced motion support
- meaningful alt text
- decorative shader ignored by assistive technology
- sufficient colour contrast
- no generic alt="Alt"
- no letter-by-letter DOM text that damages screen-reader output

For visual text effects, preserve a clean accessible reading order.

---

# Responsive behaviour

The design must feel intentionally designed at:

```txt
375px
768px
1024px
1440px
```

Do not simply stack desktop sections blindly.

Specific mobile expectations:

- shader remains visually useful but simpler
- typography scales carefully
- sticky sections become normal stacked content
- project metadata remains readable
- no horizontal overflow
- navigation remains compact
- touch targets remain comfortable

---

# SEO and metadata

Implement:

- strong page title
- description
- Open Graph metadata
- Twitter/X metadata where appropriate
- canonical URL if existing infrastructure supports it
- semantic project content

Suggested homepage title:

```txt
Benson Craven — Frontend Engineer
```

Suggested description:

```txt
Frontend-focused engineer building polished React and TypeScript products, production web platforms and real-time interfaces.
```

---

# Code quality

Requirements:

- TypeScript
- no `any` unless genuinely unavoidable
- no giant monolithic page component
- reusable project data model
- clear component boundaries
- avoid unnecessary dependencies
- avoid premature abstraction
- avoid client-side rendering for static content
- keep static content in Server Components where possible
- isolate animation and WebGL code
- no console errors
- no hydration warnings

Suggested structure:

```txt
components/
  hero/
    Hero.tsx
    ShaderBackground.tsx
    SignalPlane.tsx

  navigation/
    SiteHeader.tsx
    MobileNav.tsx

  work/
    SelectedWork.tsx
    ProjectFeature.tsx
    ProjectMeta.tsx
    ScrollProgress.tsx

  approach/
    EngineeringApproach.tsx
    StickyApproach.tsx

  experience/
    Experience.tsx

  about/
    About.tsx

  footer/
    SiteFooter.tsx

data/
  projects.ts
  experience.ts
```

Adjust to the actual repository architecture if another structure is more appropriate.

---

# Important design rule

The site should feel authored.

A developer familiar with:

- shadcn
- Aceternity
- 21st.dev
- Magic UI

should not be able to immediately identify every section as a copied component.

The custom shader should be the primary distinctive visual idea.

Everything else should support it.

---

# Implementation process

Proceed in this order:

1. Inspect repository and dependencies.
2. Create the new structural layout.
3. Build the hero and custom shader.
4. Build navigation.
5. Build Selected Work.
6. Build Engineering Approach sticky section.
7. Build Experience.
8. Build Technical Depth.
9. Build About and Footer.
10. Add responsive refinements.
11. Add reduced-motion handling.
12. Audit accessibility.
13. Audit performance.
14. Run lint/typecheck/build.
15. Fix all issues you introduce.

Where real project links or assets are unavailable, preserve clean placeholders in data files rather than inventing URLs.

Do not fabricate metrics, employers, technologies, outcomes or project integrations.

Use the existing repository and known project content wherever possible.

At the end, give me:

1. a concise summary of what you changed
2. the files created or modified
3. any remaining placeholders I need to replace
4. any performance or browser limitations
5. the exact commands to run locally

Begin by inspecting the repository, then implement the redesign.
