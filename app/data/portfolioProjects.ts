import type { PortfolioProject } from "./portfolio"

export const portfolioHomepageUpdatedAt = "2026-11-04"

export const chronicPainRecoveryProject = {
    slug: "chronic-pain-recovery",
    order: 1,
    title: "Chronic Pain Recovery",
    summary:
        "A production healthcare website that organises pain science, treatment information and consultation routes for patients.",
    status: "production",
    availabilityLabel: "Live production site",
    timeframe: "2024 - 2026",
    stack: ["Next.js", "TypeScript"],
    capabilities: [
        {
            label: "Information architecture",
            evidence: [
                { kind: "decision", id: "questions-before-pages" },
                { kind: "media", id: "conditions-system" },
            ],
        },
        {
            label: "Accessible frontend",
            evidence: [
                { kind: "decision", id: "calm-trust-signals" },
                { kind: "media", id: "trust-and-services" },
            ],
        },
        {
            label: "SEO and structured data",
            evidence: [
                { kind: "decision", id: "semantic-production-layer" },
                { kind: "media", id: "science-structure" },
            ],
        },
        {
            label: "Production delivery",
            evidence: [
                { kind: "decision", id: "semantic-production-layer" },
                { kind: "media", id: "production-walkthrough" },
            ],
        },
    ],
    ownership: {
        role: "Design, frontend engineering, and deployment",
        responsibilities: [
            "Structured the information architecture and interface hierarchy.",
            "Built the responsive Next.js frontend and semantic content system.",
            "Prepared metadata, structured data, and the production deployment.",
        ],
        boundaries: [
            "This case study covers my design, frontend, search and deployment work. The medical guidance and treatment claims are not mine.",
            "All evidence comes from the client-approved public site. It contains no consultation or patient data.",
        ],
        collaborators: [],
    },
    actions: [
        {
            kind: "case-study",
            label: "Read case study",
            href: "/work/chronic-pain-recovery",
        },
        {
            kind: "live-site",
            label: "Visit live site",
            href: "https://chronicpainrecovery.ie",
        },
    ],
    cover: {
        src: "/images/chronic-pain-recovery/home.webp",
        alt: "Chronic Pain Recovery homepage with an orange consultation link, pain-science introduction and practitioner portrait.",
        width: 1440,
        height: 900,
    },
    caseStudy: {
        context: [
            "Chronic Pain Recovery explains persistent pain, treatment options and how to book a consultation.",
            "The source material is detailed and medically sensitive. The site had to make it easier to scan without simplifying the clinical claims.",
        ],
        constraints: [
            "Headings and consultation links had to stay measured. Urgency would be inappropriate for this subject.",
            "Long condition names and unfamiliar terms had to remain readable on phones as well as large screens.",
            "Metadata and structured data had to support search without turning the visible copy into search-first prose.",
        ],
        decisions: [
            {
                id: "questions-before-pages",
                title: "Start with the questions patients ask.",
                tradeoff:
                    "This structure creates more pages and editorial upkeep than one brochure page. It also gives conditions, treatments and consultations a clear home.",
                approach:
                    "I grouped the content into pain causes, recognisable conditions, treatment paths, practitioner context and consultation routes.",
                rationale:
                    "A reader can begin with a symptom or question instead of learning the site’s categories first.",
                evidence: { kind: "media", id: "conditions-system" },
            },
            {
                id: "calm-trust-signals",
                title: "Keep the interface calm.",
                tradeoff:
                    "Large type and generous spacing reduce how much fits on screen. That is preferable to crowding sensitive health information.",
                approach:
                    "I used direct headings, short supporting text and consistent consultation links, with no urgency cues or decorative motion.",
                rationale:
                    "People can scan the service without the interface adding pressure.",
                evidence: { kind: "media", id: "trust-and-services" },
            },
            {
                id: "semantic-production-layer",
                title: "Build semantics into the pages.",
                tradeoff:
                    "Headings, image descriptions, metadata and FAQ schema take time before launch. Adding them later would duplicate the work.",
                approach:
                    "I defined heading order, image descriptions, page metadata, FAQ schema, responsive images and reusable sections as part of each page.",
                rationale:
                    "One content structure serves readers, assistive technology and search engines.",
                evidence: { kind: "media", id: "science-structure" },
            },
        ],
        proof: "The live site includes pages for conditions, treatments, practitioner information, pain science, self-assessment, journal posts and consultations. Its HTML contains ordered headings, image descriptions, page metadata and FAQ schema. The screenshots below come from the public site.",
        outcomes: [
            "Launched the public site with routes from health information to consultation booking.",
            "Built reusable sections for treatments, locations, resources, journal posts and contact pages.",
            "Included ordered headings, image descriptions, search metadata and FAQ schema in the production pages.",
        ],
        reflection: [
            "Direct section titles and predictable consultation links did more work here than decorative features would have.",
            "New search or content work should still be reviewed against the accuracy and tone of the medical material.",
        ],
    },
    evidence: {
        stills: [
            {
                kind: "image",
                id: "conditions-system",
                src: "/images/chronic-pain-recovery/conditions.webp",
                alt: "Chronic Pain Recovery conditions section showing image-backed cards for chronic pain, musculoskeletal, head and facial, and gastrointestinal concerns.",
                caption:
                    "Condition cards group chronic pain, musculoskeletal, head and facial, and gastrointestinal concerns without renaming the clinical terms.",
                width: 1440,
                height: 900,
            },
            {
                kind: "image",
                id: "trust-and-services",
                src: "/images/chronic-pain-recovery/trust.webp",
                alt: "Chronic Pain Recovery page using a direct trust statement, consultation action, and spacious transition into services.",
                caption:
                    "A plain trust statement and consultation link lead into the service list.",
                width: 1440,
                height: 900,
            },
            {
                kind: "image",
                id: "science-structure",
                src: "/images/chronic-pain-recovery/science.webp",
                alt: "Chronic Pain Recovery science section with an explanatory heading, summary, treatment image, signal explanation, and treatment-path card.",
                caption:
                    "The science section pairs a short summary with signal explanations and treatment paths.",
                width: 1440,
                height: 900,
            },
        ],
        clip: {
            kind: "video",
            id: "production-walkthrough",
            src: "/media/chronic-pain-recovery-walkthrough.mp4",
            poster: "/images/chronic-pain-recovery/home.webp",
            caption:
                "Six-second silent walkthrough from the production homepage to the science section.",
            description:
                "The page moves from the homepage through patient questions and service information, then stops on the chronic-pain science section. No private client or user information is shown.",
            transcript:
                "Silent visual walkthrough. It begins on the Chronic Pain Recovery homepage, scrolls through public condition and service sections, and finishes on the section titled ‘What causes chronic pain?’. No speech or audio is present.",
            preload: "none",
            controls: true,
            playsInline: true,
            muted: true,
            autoPlay: false,
        },
    },
    seo: {
        title: "Chronic Pain Recovery case study",
        description:
            "Benson Craven’s design and frontend work for a production healthcare website covering pain science, treatments and consultations.",
        shareImage: {
            src: "/images/chronic-pain-recovery/home.webp",
            alt: "Chronic Pain Recovery production homepage case study by Benson Craven.",
            width: 1440,
            height: 900,
        },
    },
    updatedAt: "2026-07-16",
} satisfies PortfolioProject

export const nibblesWithNifaProject = {
    slug: "nibbles-with-nifa",
    order: 2,
    title: "Nibbles with Nifa",
    summary:
        "A Next.js and Sanity site where Nifa can write recipes and travel stories, preview them and decide when they are ready for readers.",
    status: "published",
    availabilityLabel: "Published live site",
    timeframe: "2026",
    stack: ["Next.js", "TypeScript", "Sanity", "React"],
    capabilities: [
        {
            label: "Content architecture",
            evidence: [
                { kind: "decision", id: "explicit-content-source" },
                { kind: "media", id: "content-source-boundary" },
            ],
        },
        {
            label: "Sanity workflow",
            evidence: [
                { kind: "decision", id: "editorial-readiness" },
                { kind: "media", id: "editorial-readiness-workflow" },
            ],
        },
        {
            label: "Preview security",
            evidence: [
                { kind: "decision", id: "separate-trust-zones" },
                { kind: "media", id: "preview-public-boundary" },
            ],
        },
        {
            label: "Accessible frontend",
            evidence: [
                { kind: "decision", id: "editorial-readiness" },
                { kind: "media", id: "editorial-readiness-workflow" },
                { kind: "media", id: "interface-walkthrough" },
            ],
        },
    ],
    ownership: {
        role: "Engineering and product architecture",
        responsibilities: [
            "Modelled recipes, articles and editorial states in Sanity, with published content as the only production source.",
            "Built the homepage, recipe, article, archive and preview routes in Next.js.",
            "Added validation and route tests for publication state, provider failure, metadata and accessible media.",
        ],
        collaborators: [
            {
                name: "Nifa",
                role: "Editorial direction, writing, photography and day-to-day publishing.",
            },
        ],
        boundaries: [
            "I built the software. Nifa owns the editorial direction, writing, photography and food and travel perspective.",
            "The case-study media was captured locally. It contains no Studio session, unpublished entry, credential or internal note.",
        ],
    },
    actions: [
        {
            kind: "case-study",
            label: "Read case study",
            href: "/work/nibbles-with-nifa",
        },
        {
            kind: "live-site",
            label: "Visit live site",
            href: "https://nibbles-with-nifa.vercel.app/",
        },
    ],
    cover: {
        src: "/images/nibbles-with-nifa/nwn-sc.png",
        alt: "Nibbles with Nifa homepage with recipe and travel photography beneath the publication title.",
        width: 1440,
        height: 900,
    },
    caseStudy: {
        context: [
            "Nibbles with Nifa is Nifa’s food and travel site. She needed to write and update recipes and articles without asking a developer to rebuild each page.",
            "I built the publishing flow in Sanity and Next.js. It accepts rough ideas, but only sends finished, published entries to the public site.",
        ],
        constraints: [
            "Nifa needed to handle routine editing on her MacBook without developer help.",
            "A recipe can begin as a short note, but a public recipe needs quantities, timing, ordered steps, attribution and image text.",
            "The first release had to stay on the existing free stack, so publishing remains manual.",
            "A failed or empty Sanity response must not be replaced with sample content.",
        ],
        decisions: [
            {
                id: "explicit-content-source",
                title: "Keep sample content out of production.",
                tradeoff:
                    "Maintaining separate Sanity and sample sources adds code. It prevents local test entries from appearing on the live site.",
                approach:
                    "All pages read through one content store. Production accepts Sanity only and returns real empty or error states instead of substitute entries.",
                rationale:
                    "The public site should show what Nifa published, even if that means an empty page or a visible error.",
                evidence: { kind: "media", id: "content-source-boundary" },
            },
            {
                id: "editorial-readiness",
                title: "Give recipes a separate ready state.",
                tradeoff:
                    "Nifa has one more field to set. In return, rough notes can stay in Sanity without meeting every public recipe requirement.",
                approach:
                    "A recipe moves from idea to cooked draft to ready. Quantities, timing, steps, authorship and image text become required at ready.",
                rationale:
                    "Capture stays quick, but a public recipe cannot omit the details needed to cook or understand it.",
                evidence: {
                    kind: "media",
                    id: "editorial-readiness-workflow",
                },
            },
            {
                id: "separate-trust-zones",
                title: "Keep preview routes private.",
                tradeoff:
                    "Signed preview routes and separate fetch settings add setup. They stop drafts from sharing public caching and metadata.",
                approach:
                    "Public queries use Sanity’s published perspective and exclude draft IDs. Preview uses a signed enable route, no-store data and noindex metadata.",
                rationale:
                    "Nifa can review a real page before publishing it, while readers and search engines receive only public content.",
                evidence: { kind: "media", id: "preview-public-boundary" },
            },
        ],
        proof: "Public queries exclude draft IDs and require the ready state for recipes. Production uses Sanity’s published perspective and rejects local sample content. Preview runs through a signed route with no-store data and noindex metadata. Route tests cover drafts, provider failures, metadata and private editorial fields. The screenshots and clip were captured locally; the live site is linked above.",
        outcomes: [
            "Nifa can write and publish recipes and articles without page-by-page developer work.",
            "Recipes, travel stories, media, authors, SEO fields, tags and related content share reusable models and renderers.",
            "Production excludes drafts, internal fields and local sample content.",
            "Route tests cover public pages, authenticated preview, missing entries, provider failures, metadata and mixed media.",
        ],
        reflection: [
            "The useful split was simple: make capture forgiving and make publication strict.",
        ],
    },
    evidence: {
        stills: [
            {
                kind: "image",
                id: "content-source-boundary",
                src: "/images/nibbles-with-nifa/content-source-boundary.svg",
                alt: "Content-source diagram: production Sanity content passes through published and ready filters into public routes; local fixture content is rejected in production.",
                caption:
                    "Production reads published Sanity content. Local sample entries use the same renderers but cannot run in production.",
                width: 1440,
                height: 900,
            },
            {
                kind: "image",
                id: "editorial-readiness-workflow",
                src: "/images/nibbles-with-nifa/editorial-readiness-workflow.svg",
                alt: "Editorial workflow diagram: a sparse recipe idea moves through a cooked draft and a strict ready gate before native publication makes it eligible for a public route.",
                caption:
                    "One Sanity document moves from a short idea to a cooked draft, then gains the required recipe and accessibility fields at ready.",
                width: 1440,
                height: 900,
            },
            {
                kind: "image",
                id: "preview-public-boundary",
                src: "/images/nibbles-with-nifa/preview-public-boundary.svg",
                alt: "Trust-boundary diagram: published, cacheable, indexable public routes are separated from signed, no-store, no-index authenticated preview routes.",
                caption:
                    "Public and preview routes reuse page layouts but have separate access, caching and indexing rules.",
                width: 1440,
                height: 900,
            },
        ],
        clip: {
            kind: "video",
            id: "interface-walkthrough",
            src: "/media/nibbles-with-nifa-interface-walkthrough.mp4",
            poster: "/images/nibbles-with-nifa/home.webp",
            caption:
                "Five-second silent walkthrough of the homepage, recipe and article layouts, recorded locally.",
            description:
                "The clip opens on the Nibbles with Nifa homepage, moves through an example recipe and ends on an example article. No Studio session or unpublished Sanity content appears.",
            transcript:
                "Silent visual walkthrough. It starts on the Nibbles with Nifa development homepage. It opens an example Miso mushroom pasta recipe and shows its ingredients and method. It ends on an example article titled ‘A corner-shop haul turned dinner’. No speech or audio is present.",
            preload: "none",
            controls: true,
            playsInline: true,
            muted: true,
            autoPlay: false,
        },
    },
    seo: {
        title: "Nibbles with Nifa case study",
        description:
            "Benson Craven’s Next.js and Sanity work for Nibbles with Nifa, covering recipes, editorial readiness, preview and public routes.",
        shareImage: {
            src: "/images/nibbles-with-nifa/home.webp",
            alt: "Nibbles with Nifa homepage with recipe and travel photography beneath the publication title.",
            width: 1440,
            height: 900,
        },
    },
    updatedAt: "2026-07-16",
} satisfies PortfolioProject

export const waxlistProject = {
    slug: "waxlist",
    order: 3,
    title: "Waxlist",
    summary:
        "An unpublished record-collecting app that matches Spotify albums to Discogs releases and keeps collection, shelf and buying information in one workspace.",
    status: "unpublished",
    availabilityLabel: "Development phase",
    timeframe: "2026",
    stack: [
        "Next.js",
        "TypeScript",
        "Postgres",
        "Drizzle",
        "Spotify API",
        "Discogs API",
    ],
    capabilities: [
        {
            label: "Shared record workspace",
            evidence: [
                { kind: "decision", id: "persistent-collector-workspace" },
                { kind: "media", id: "collector-workspace" },
            ],
        },
        {
            label: "Discogs match confidence",
            evidence: [
                { kind: "decision", id: "confidence-before-buyability" },
                { kind: "media", id: "confidence-before-buyability" },
            ],
        },
        {
            label: "Missing shipping handling",
            evidence: [
                { kind: "decision", id: "unknown-stays-unknown" },
                { kind: "media", id: "truthful-buying-evidence" },
            ],
        },
        {
            label: "Spotify and Discogs integration",
            evidence: [
                { kind: "decision", id: "persistent-collector-workspace" },
                { kind: "media", id: "workspace-walkthrough" },
            ],
        },
    ],
    ownership: {
        role: "Product design and full-stack engineering",
        responsibilities: [
            "Defined the product model and designed the app shell, record inspector and responsive workflows.",
            "Built server-side Spotify OAuth, Discogs integration, deterministic matching, caching, rate-limit handling and Postgres storage.",
            "Implemented collection import, collection and Digging search, shelf locations, collection health, smart wants and buying checks.",
        ],
        collaborators: [],
        boundaries: [
            "Waxlist is an unpublished personal product. There is no public release, live service or production user base.",
            "The screenshots use invented records in an isolated local session. They contain no real account, collection, credential or provider data.",
        ],
    },
    actions: [
        {
            kind: "case-study",
            label: "Read case study",
            href: "/work/waxlist",
        },
    ],
    cover: {
        src: "/images/waxlist/homescreen.png",
        alt: "Waxlist collection workspace showing three invented records and the selected-record inspector.",
        width: 1440,
        height: 900,
        caption:
            "The three records are invented. No real account, collection or provider data appears in this screenshot.",
    },
    caseStudy: {
        context: [
            "Waxlist is a personal vinyl-collection app for Discogs users. It covers record-shop checks, shelf locations, collection maintenance and buying research.",
            "It starts with Spotify albums, finds likely Discogs releases and keeps the result in a private workspace. A collector can check whether a record is owned, wanted, duplicated or shelved before buying it.",
        ],
        constraints: [
            "Spotify and Discogs tokens must stay on the server. Rate limits and provider failures still need clear states in the interface.",
            "Albums, masters, exact releases, reissues and listings are different records, so a weak match cannot be shown as fact.",
            "Discogs does not always return shipping or final checkout totals. Missing costs must remain unknown.",
            "The app needs to support long desktop sessions and quick phone checks in record shops, including cached collection search on a poor connection.",
        ],
        decisions: [
            {
                id: "persistent-collector-workspace",
                title: "Keep record context between tools.",
                tradeoff:
                    "A shared selection model needs more state coordination than separate pages. It keeps the active record available while the collector changes tools.",
                approach:
                    "Dashboard, Collection, Wantlist, Digging, Shelf and Health sit inside one app shell. The shell owns the selected record and passes it to one inspector.",
                rationale:
                    "A collector can move from search to shelf location or buying notes without finding the same record again.",
                evidence: { kind: "media", id: "collector-workspace" },
            },
            {
                id: "confidence-before-buyability",
                title: "Match the record before ranking price.",
                tradeoff:
                    "A confidence threshold produces fewer automatic recommendations. It also stops a cheap but incorrect release from looking convincing.",
                approach:
                    "Spotify albums become deduplicated Discogs searches. Artist, title and vinyl format produce a confidence score, and only scores of 75 or higher become reliable matches. Weaker candidates stay available for review.",
                rationale:
                    "Price and availability can sort a strong match. They cannot repair a weak identity match.",
                evidence: {
                    kind: "media",
                    id: "confidence-before-buyability",
                },
            },
            {
                id: "unknown-stays-unknown",
                title: "Do not invent missing costs.",
                tradeoff:
                    "Withholding a delivered total and limiting Seller Scout to exact wanted releases returns less information. The alternative would be a guess.",
                approach:
                    "Item price, shipping, source, checked time and freshness are stored separately. Unknown shipping blocks the total. Seller Scout groups only observed listings for the exact wanted release, and Discogs remains responsible for final tax and checkout values.",
                rationale:
                    "The interface can compare the values Discogs returned without filling gaps with invented numbers.",
                evidence: {
                    kind: "media",
                    id: "truthful-buying-evidence",
                },
            },
        ],
        proof: "AppShell owns one selected-record model across Collection, Wantlist, Digging, Shelf and Health. The matcher uses a 75-point reliable threshold and keeps weaker candidates in a review path. Wishlist and Seller Scout tests confirm that unknown shipping is never treated as zero. The screenshots use invented records in an isolated local session with no live credentials or private collection data.",
        outcomes: [
            "Built an authenticated workspace with navigation, global search, one record inspector and clear sync and empty states.",
            "Added Discogs collection import, cached Collection and Digging search, shelf locations, collection-health checks and non-destructive record actions.",
            "Added deterministic Spotify-to-Discogs matching, confidence scores, weak-match review, caching, throttling and provider-error states.",
            "Added Seller Scout for exact wanted releases and blocked delivered totals when shipping is missing.",
        ],
        reflection: [
            "Uncertainty belongs in the data model. Match confidence, import state, stale prices, missing shelf locations and unknown shipping are all shown directly.",
            "A public release still needs deployment configuration, production migrations and browser testing with real Spotify and Discogs accounts. That is why this case study has no live-product or source link.",
        ],
    },
    evidence: {
        stills: [
            {
                kind: "image",
                id: "collector-workspace",
                src: "/images/waxlist/collector-workspace.svg",
                alt: "Architecture diagram showing Spotify and Discogs inputs entering one Waxlist app shell whose Collection, Wantlist, Digging, Shelf, and Health views share a selected-record inspector.",
                caption:
                    "One selection model keeps the active record available in Collection, Wantlist, Digging, Shelf and Health.",
                width: 1440,
                height: 900,
            },
            {
                kind: "image",
                id: "confidence-before-buyability",
                src: "/images/waxlist/confidence-before-buyability.svg",
                alt: "Matching diagram showing Spotify signals normalized into Discogs search units, scored for identity confidence, and gated at 75 before price and availability can rank them.",
                caption:
                    "Artist, title and format must produce a score of 75 before price or availability can rank a candidate.",
                width: 1440,
                height: 900,
            },
            {
                kind: "image",
                id: "truthful-buying-evidence",
                src: "/images/waxlist/truthful-buying-evidence.svg",
                alt: "Buying-evidence diagram showing a known item price plus unknown shipping producing no delivered total, followed by exact wanted releases grouped by seller before Discogs checkout.",
                caption:
                    "Unknown shipping blocks the delivered total. Seller Scout reports observed exact-release listings and leaves checkout values to Discogs.",
                width: 1440,
                height: 900,
            },
        ],
        clip: {
            kind: "video",
            id: "workspace-walkthrough",
            src: "/media/waxlist-workspace-walkthrough.mp4",
            poster: "/images/waxlist/collector-workspace.webp",
            caption:
                "Seven-second silent walkthrough of an isolated local Waxlist session using three synthetic collection records.",
            description:
                "The clip opens on Collection with an invented Blue Train record selected in the inspector. It moves to a Digging search with owned and shelf information, then finishes on the collection-health audit. No real account, collection or provider data appears.",
            transcript:
                "Silent visual walkthrough. An isolated Waxlist Collection view loads three invented records and selects Blue Train in the shared inspector. The view changes to Digging, searches for Blue Train, and shows owned, duplicate, shelf, and price-evidence signals. It finishes on Health with synthetic collection findings. No speech or audio is present.",
            preload: "none",
            controls: true,
            playsInline: true,
            muted: true,
            autoPlay: false,
        },
    },
    seo: {
        title: "Waxlist case study",
        description:
            "Benson Craven’s product and engineering work for Waxlist, covering Discogs collection tools, Spotify matching, shelf locations and buying checks.",
        shareImage: {
            src: "/images/waxlist/collector-workspace.webp",
            alt: "Waxlist Collection workspace with three invented records and the selected-record inspector.",
            width: 1440,
            height: 900,
        },
    },
    updatedAt: "2026-07-16",
} satisfies PortfolioProject

export const implementedPortfolioProjects = [
    chronicPainRecoveryProject,
    nibblesWithNifaProject,
    waxlistProject,
] as const

export function getPortfolioProject(slug: string) {
    return implementedPortfolioProjects.find((project) => project.slug === slug)
}

export function getNextImplementedPortfolioProject(slug: string) {
    const currentIndex = implementedPortfolioProjects.findIndex(
        (project) => project.slug === slug,
    )

    return currentIndex === -1
        ? undefined
        : implementedPortfolioProjects[currentIndex + 1]
}
