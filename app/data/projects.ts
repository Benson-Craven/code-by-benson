export type ProjectAction = {
    label: string
    href: string
    external?: boolean
    placeholder?: boolean
}

export type Project = {
    slug: string
    number: string
    title: string
    description: string
    tags: string[]
    roleLabel: string
    role: string
    signals: string[]
    image?: {
        src: string
        alt: string
    }
    visualType: "image" | "market" | "waxlist"
    actions: ProjectAction[]
}

export const projects: Project[] = [
    {
        slug: "chronic-pain-recovery",
        number: "01",
        title: "Chronic Pain Recovery",
        description:
            "A production healthcare platform turning complex pain-science concepts into an accessible, discoverable patient experience.",
        tags: ["Next.js", "TypeScript", "SEO", "Structured Data"],
        roleLabel: "Role",
        role: "Design, frontend engineering, deployment",
        signals: ["REAL CLIENT", "PRODUCTION", "2025-2026"],
        image: {
            src: "/images/chronic-pain-recovery.avif",
            alt: "Chronic Pain Recovery website interface preview",
        },
        visualType: "image",
        actions: [
            {
                label: "Read case study",
                href: "/work/chronic-pain-recovery",
                placeholder: true,
            },
            {
                label: "Visit live site",
                href: "https://chronicpainrecovery.ie",
                external: true,
            },
        ],
    },
    {
        slug: "real-time-market-dashboard",
        number: "02",
        title: "Real-Time Market Dashboard",
        description:
            "A React trading interface consuming streaming market updates from a Spring backend over WebSockets and STOMP.",
        tags: ["React", "TypeScript", "Spring Boot", "WebSockets"],
        roleLabel: "Focus",
        role: "Real-time state, derived market data, resilient UI",
        signals: ["STREAMING UI", "SYSTEMS", "CASE STUDY PLACEHOLDER"],
        visualType: "market",
        actions: [
            {
                label: "Read case study",
                href: "/work/real-time-market-dashboard",
                placeholder: true,
            },
            {
                label: "GitHub",
                href: "https://github.com/Benson-Craven",
                external: true,
            },
        ],
    },
    {
        slug: "waxlist",
        number: "03",
        title: "Waxlist",
        description:
            "A modern collection dashboard for vinyl enthusiasts, designed around faster browsing, collection insight and a cleaner alternative to legacy catalogue workflows.",
        tags: ["Next.js", "TypeScript", "Discogs API", "Product Design"],
        roleLabel: "Focus",
        role: "Collection browsing, filtering and product interaction",
        signals: ["PRODUCT DESIGN", "COLLECTION UX", "LINK PLACEHOLDER"],
        visualType: "waxlist",
        actions: [
            {
                label: "Read case study",
                href: "/work/waxlist",
                placeholder: true,
            },
            {
                label: "View project",
                href: "#",
                placeholder: true,
            },
        ],
    },
]
