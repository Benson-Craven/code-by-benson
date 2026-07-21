export const portfolioProjectSlugs = [
    "chronic-pain-recovery",
    "nibbles-with-nifa",
    "waxlist",
] as const

export type PortfolioProjectSlug = (typeof portfolioProjectSlugs)[number]
export type ProjectStatus = "production" | "published" | "unpublished"

type LocalAssetPath = `/${string}`
type HttpsUrl = `https://${string}`
type ContactUrl = HttpsUrl | `mailto:${string}`

export type PortfolioAction =
    | {
          kind: "case-study"
          label: string
          href: `/work/${PortfolioProjectSlug}`
      }
    | {
          kind: "live-site" | "source"
          label: string
          href: HttpsUrl
      }
    | {
          kind: "resume"
          label: string
          href: `/${string}.pdf`
      }
    | {
          kind: "contact"
          label: string
          href: ContactUrl
      }

type PortfolioImageBase = {
    src: LocalAssetPath
    width: number
    height: number
    caption?: string
}

export type PortfolioContentImage = PortfolioImageBase & {
    decorative?: false
    alt: string
}

export type PortfolioDecorativeImage = PortfolioImageBase & {
    decorative: true
    alt: ""
}

export type PortfolioImage = PortfolioContentImage | PortfolioDecorativeImage

export type PortfolioImageEvidence = PortfolioContentImage & {
    kind: "image"
    id: string
    caption: string
}

export type PortfolioVideoEvidence = {
    kind: "video"
    id: string
    src: LocalAssetPath
    poster: LocalAssetPath
    caption: string
    description: string
    transcript?: string
    captionsSrc?: LocalAssetPath
    preload: "none"
    controls: true
    playsInline: true
    muted: true
    autoPlay: false
}

export type PortfolioEvidenceReference =
    | { kind: "decision"; id: string }
    | { kind: "media"; id: string }

export type PortfolioCapability = {
    label: string
    evidence: PortfolioEvidenceReference[]
}

export type PortfolioContributor = {
    name: string
    role: string
}

export type PortfolioDecision = {
    id: string
    title: string
    tradeoff: string
    approach: string
    rationale: string
    evidence: Extract<PortfolioEvidenceReference, { kind: "media" }>
}

export type PortfolioProject = {
    slug: PortfolioProjectSlug
    order: number
    title: string
    summary: string
    status: ProjectStatus
    availabilityLabel: string
    timeframe: string
    stack: string[]
    capabilities: PortfolioCapability[]
    ownership: {
        role: string
        responsibilities: string[]
        collaborators: PortfolioContributor[]
        boundaries: string[]
    }
    actions: PortfolioAction[]
    cover: PortfolioImage
    caseStudy: {
        context: string[]
        constraints: string[]
        decisions: [PortfolioDecision, PortfolioDecision, PortfolioDecision]
        proof: string
        outcomes: string[]
        reflection: string[]
    }
    evidence: {
        stills: [
            PortfolioImageEvidence,
            PortfolioImageEvidence,
            PortfolioImageEvidence,
        ]
        clip: PortfolioVideoEvidence
    }
    seo: {
        title: string
        description: string
        shareImage: PortfolioContentImage
    }
    updatedAt: `${number}-${number}-${number}`
}

const approvedSlugSet = new Set<string>(portfolioProjectSlugs)
const prohibitedPublicCopy = /\b(?:placeholder|todo|tbd)\b/i
const isoDate = /^\d{4}-\d{2}-\d{2}$/

const projectPolicies = {
    "chronic-pain-recovery": {
        status: "production",
        availabilityLabel: "Live production site",
        liveSites: ["https://chronicpainrecovery.ie"],
        sources: [],
    },
    "nibbles-with-nifa": {
        status: "published",
        availabilityLabel: "Published live site",
        liveSites: ["https://nibbles-with-nifa.vercel.app/"],
        sources: [],
    },
    waxlist: {
        status: "unpublished",
        availabilityLabel: "Development phase",
        liveSites: [],
        sources: [],
    },
} as const satisfies Record<
    PortfolioProjectSlug,
    {
        status: ProjectStatus
        availabilityLabel: string
        liveSites: readonly HttpsUrl[]
        sources: readonly HttpsUrl[]
    }
>

function hasText(value: string) {
    return value.trim().length > 0
}

function isLocalAssetPath(value: string) {
    return value.startsWith("/") && value !== "/" && !value.startsWith("//")
}

function isHttpsUrl(value: string) {
    try {
        return new URL(value).protocol === "https:"
    } catch {
        return false
    }
}

function isContactUrl(value: string) {
    if (isHttpsUrl(value)) {
        return true
    }

    return /^mailto:[^@\s]+@[^@\s]+\.[^@\s]+$/i.test(value)
}

function normalizeExternalUrl(value: string) {
    return new URL(value).href.replace(/\/$/, "")
}

function isValidDate(value: string) {
    if (!isoDate.test(value)) {
        return false
    }

    const parsed = new Date(`${value}T00:00:00.000Z`)

    return (
        !Number.isNaN(parsed.valueOf()) &&
        parsed.toISOString().startsWith(value)
    )
}

function collectStrings(value: unknown): string[] {
    if (typeof value === "string") {
        return [value]
    }

    if (Array.isArray(value)) {
        return value.flatMap(collectStrings)
    }

    if (value && typeof value === "object") {
        return Object.values(value).flatMap(collectStrings)
    }

    return []
}

function validateImage(
    image: PortfolioImage,
    project: PortfolioProject,
    label: string,
    errors: string[],
) {
    if (
        !isLocalAssetPath(image.src) ||
        (image.decorative === true ? image.alt !== "" : !hasText(image.alt)) ||
        (image.caption !== undefined && !hasText(image.caption)) ||
        !Number.isInteger(image.width) ||
        image.width <= 0 ||
        !Number.isInteger(image.height) ||
        image.height <= 0
    ) {
        errors.push(`${project.title} has incomplete ${label} image metadata.`)
    }
}

function validateAction(
    action: PortfolioAction,
    project: PortfolioProject,
    errors: string[],
) {
    const href = action.href as string
    const invalidBase =
        !hasText(action.label) || href === "#" || href.includes(" ")

    if (invalidBase) {
        errors.push(`${project.title} has an invalid action.`)
        return
    }

    if (
        action.kind === "case-study" &&
        action.href !== `/work/${project.slug}`
    ) {
        errors.push(
            `${project.title} has an invalid action for its case study.`,
        )
        return
    }

    if (
        (action.kind === "live-site" || action.kind === "source") &&
        !isHttpsUrl(action.href)
    ) {
        errors.push(`${project.title} has an invalid action URL.`)
        return
    }

    if (action.kind === "live-site" || action.kind === "source") {
        const policy = projectPolicies[project.slug]
        const approvedUrls =
            action.kind === "live-site" ? policy?.liveSites : policy?.sources
        const normalizedHref = normalizeExternalUrl(action.href)

        if (
            !approvedUrls?.some(
                (approvedUrl) =>
                    normalizeExternalUrl(approvedUrl) === normalizedHref,
            )
        ) {
            errors.push(
                `${project.title} has an unapproved or unrelated ${action.kind} action URL.`,
            )
            return
        }
    }

    if (
        action.kind === "resume" &&
        (!isLocalAssetPath(action.href) || !action.href.endsWith(".pdf"))
    ) {
        errors.push(`${project.title} has an invalid resume action.`)
        return
    }

    if (action.kind === "contact" && !isContactUrl(action.href)) {
        errors.push(`${project.title} has an invalid contact action.`)
    }
}

function validateProjectIdentity(
    project: PortfolioProject,
    projectLabel: string,
    errors: string[],
) {
    if (
        !hasText(project.title) ||
        !hasText(project.summary) ||
        !hasText(project.timeframe) ||
        !hasText(project.ownership.role)
    ) {
        errors.push(`${projectLabel} is missing required project content.`)
    }

    if (!hasText(project.availabilityLabel)) {
        errors.push(`${projectLabel} is missing availability copy.`)
    }

    if (
        collectStrings(project).some((value) =>
            prohibitedPublicCopy.test(value),
        )
    ) {
        errors.push(`${projectLabel} contains placeholder copy.`)
    }

    if (
        project.stack.length === 0 ||
        project.stack.some((item) => !hasText(item))
    ) {
        errors.push(`${projectLabel} must include a verified stack.`)
    }

    if (
        project.ownership.responsibilities.length === 0 ||
        project.ownership.responsibilities.some((item) => !hasText(item))
    ) {
        errors.push(`${projectLabel} must include verified responsibilities.`)
    }

    if (
        project.ownership.boundaries.length === 0 ||
        project.ownership.boundaries.some((item) => !hasText(item))
    ) {
        errors.push(
            `${projectLabel} must include an explicit ownership boundary.`,
        )
    }

    if (
        project.slug === "nibbles-with-nifa" &&
        !project.ownership.collaborators.some(
            ({ name, role }) =>
                name.trim().toLowerCase() === "nifa" && hasText(role),
        )
    ) {
        errors.push(`${projectLabel} must include Nifa's collaboration credit.`)
    }
}

function validateProjectActions(
    project: PortfolioProject,
    projectLabel: string,
    errors: string[],
) {
    const caseStudyActions = project.actions.filter(
        ({ kind }) => kind === "case-study",
    )

    if (caseStudyActions.length !== 1) {
        errors.push(`${projectLabel} must include one case-study action.`)
    }

    project.actions.forEach((action) => validateAction(action, project, errors))

    if (
        project.status === "unpublished" &&
        project.actions.some(
            ({ kind }) => kind === "live-site" || kind === "source",
        )
    ) {
        errors.push(
            `${projectLabel}: unpublished projects cannot link to a live site or public source.`,
        )
    }

    const projectPolicy = projectPolicies[project.slug]

    if (projectPolicy && project.status !== projectPolicy.status) {
        errors.push(
            `${projectLabel} must use the approved ${projectPolicy.status} status.`,
        )
    }

    if (
        projectPolicy &&
        hasText(project.availabilityLabel) &&
        project.availabilityLabel !== projectPolicy.availabilityLabel
    ) {
        errors.push(`${projectLabel} must use its approved availability copy.`)
    }
}

function validateProjectSeo(
    project: PortfolioProject,
    projectLabel: string,
    errors: string[],
) {
    validateImage(project.cover, project, "cover", errors)
    validateImage(project.seo.shareImage, project, "share", errors)

    if (
        !hasText(project.seo.title) ||
        !hasText(project.seo.description) ||
        !project.seo.shareImage
    ) {
        errors.push(`${projectLabel} has missing SEO metadata.`)
    }

    if (!isValidDate(project.updatedAt)) {
        errors.push(`${projectLabel} has an invalid content-updated date.`)
    }
}

function validateNarrative(
    project: PortfolioProject,
    projectLabel: string,
    errors: string[],
) {
    const narrativeLists = [
        project.caseStudy.context,
        project.caseStudy.constraints,
        project.caseStudy.outcomes,
        project.caseStudy.reflection,
    ]

    if (
        narrativeLists.some(
            (items) =>
                items.length === 0 || items.some((item) => !hasText(item)),
        ) ||
        !hasText(project.caseStudy.proof)
    ) {
        errors.push(
            `${projectLabel} has incomplete case-study narrative content.`,
        )
    }

    if (project.caseStudy.decisions.length !== 3) {
        errors.push(`${projectLabel} must include exactly three decisions.`)
    }

    const decisionIds = new Set<string>()

    project.caseStudy.decisions.forEach((decision) => {
        if (
            !hasText(decision.id) ||
            !hasText(decision.title) ||
            !hasText(decision.tradeoff) ||
            !hasText(decision.approach) ||
            !hasText(decision.rationale)
        ) {
            errors.push(`${projectLabel} has an incomplete decision.`)
        }

        if (decisionIds.has(decision.id)) {
            errors.push(`${projectLabel} has a duplicate decision id.`)
        }

        decisionIds.add(decision.id)
    })

    return decisionIds
}

function validateEvidence(
    project: PortfolioProject,
    projectLabel: string,
    errors: string[],
) {
    if (project.evidence.stills.length !== 3) {
        errors.push(
            `${projectLabel} must include exactly three evidence stills.`,
        )
    }

    const mediaIds = new Set<string>()

    project.evidence.stills.forEach((still) => {
        validateImage(still, project, "evidence", errors)

        if (!hasText(still.id) || !hasText(still.caption)) {
            errors.push(
                `${projectLabel} has incomplete evidence still metadata.`,
            )
        }

        if (mediaIds.has(still.id)) {
            errors.push(`${projectLabel} has a duplicate media id.`)
        }

        mediaIds.add(still.id)
    })

    const clip = project.evidence.clip

    if (
        !hasText(clip.id) ||
        !isLocalAssetPath(clip.src) ||
        !isLocalAssetPath(clip.poster) ||
        !hasText(clip.caption) ||
        !hasText(clip.description) ||
        clip.preload !== "none" ||
        clip.controls !== true ||
        clip.playsInline !== true ||
        clip.muted !== true ||
        clip.autoPlay !== false ||
        (clip.captionsSrc !== undefined && !isLocalAssetPath(clip.captionsSrc))
    ) {
        errors.push(`${projectLabel} has incomplete accessible video metadata.`)
    }

    if (mediaIds.has(clip.id)) {
        errors.push(`${projectLabel} has a duplicate media id.`)
    }

    mediaIds.add(clip.id)

    return mediaIds
}

function validateEvidenceReferences(
    project: PortfolioProject,
    projectLabel: string,
    decisionIds: Set<string>,
    mediaIds: Set<string>,
    errors: string[],
) {
    project.caseStudy.decisions.forEach((decision) => {
        if (!mediaIds.has(decision.evidence.id)) {
            errors.push(
                `${projectLabel} has unresolved evidence for a decision.`,
            )
        }
    })

    if (project.capabilities.length === 0) {
        errors.push(
            `${projectLabel} must include evidence-linked capabilities.`,
        )
    }

    project.capabilities.forEach((capability) => {
        if (!hasText(capability.label) || capability.evidence.length === 0) {
            errors.push(`${projectLabel} has an unsupported capability.`)
        }

        capability.evidence.forEach((reference) => {
            const resolves =
                reference.kind === "decision"
                    ? decisionIds.has(reference.id)
                    : mediaIds.has(reference.id)

            if (!resolves) {
                errors.push(
                    `${projectLabel} has unresolved evidence for a capability.`,
                )
            }
        })
    })
}

function validateProject(project: PortfolioProject, errors: string[]) {
    const projectLabel = hasText(project.title) ? project.title : project.slug

    validateProjectIdentity(project, projectLabel, errors)
    validateProjectActions(project, projectLabel, errors)
    validateProjectSeo(project, projectLabel, errors)

    const decisionIds = validateNarrative(project, projectLabel, errors)
    const mediaIds = validateEvidence(project, projectLabel, errors)

    validateEvidenceReferences(
        project,
        projectLabel,
        decisionIds,
        mediaIds,
        errors,
    )
}

export function validatePortfolioProject(project: PortfolioProject): string[] {
    const errors: string[] = []

    if (!approvedSlugSet.has(project.slug)) {
        errors.push(`Portfolio has unknown slug "${project.slug}".`)
    } else {
        const expectedOrder = portfolioProjectSlugs.indexOf(project.slug) + 1

        if (project.order !== expectedOrder) {
            errors.push(`${project.title} has an invalid display order.`)
        }
    }

    validateProject(project, errors)

    return errors
}

export function validatePortfolio(
    projects: readonly PortfolioProject[],
): string[] {
    const errors: string[] = []
    const seen = new Set<string>()

    projects.forEach((project) => {
        if (seen.has(project.slug)) {
            errors.push(`Portfolio has duplicate slug "${project.slug}".`)
        }

        seen.add(project.slug)
    })

    const actualSlugs = projects.map(({ slug }) => slug)

    if (
        actualSlugs.length !== portfolioProjectSlugs.length ||
        actualSlugs.some((slug, index) => slug !== portfolioProjectSlugs[index])
    ) {
        errors.push(
            `Portfolio projects must use the approved order: ${portfolioProjectSlugs.join(", ")}.`,
        )
    }

    projects.forEach((project) => {
        errors.push(...validatePortfolioProject(project))
    })

    return errors
}
