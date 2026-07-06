export type ExperienceEntry = {
    title: string
    company: string
    summary: string
    points: string[]
}

export const experience: ExperienceEntry[] = [
    {
        title: "Web Developer",
        company: "First Page",
        summary:
            "Delivering production web changes across React-based applications, WordPress, Shopify, Webflow and other client platforms in a high-throughput agency environment.",
        points: [
            "Ship and QA production content, UI and technical SEO changes across diverse client stacks.",
            "Implement structured data, semantic content architecture and performance-conscious frontend changes.",
            "Work independently across unfamiliar codebases and CMS environments under daily delivery targets.",
        ],
    },
    {
        title: "Earlier systems experience",
        company: "CGI",
        summary:
            "Systems-oriented software work in established codebases, with emphasis on testing, technical documentation and engineering discipline.",
        points: [
            "Worked within structured engineering processes across mature software environments.",
            "Contributed to testing and documentation practices for maintainable delivery.",
            "Built habits around clarity, traceability and careful changes in existing systems.",
        ],
    },
]

export const depthItems = [
    {
        title: "Real-time interfaces",
        copy: "WebSocket subscriptions, stale-state handling, derived data and resilient connection states.",
    },
    {
        title: "Production delivery",
        copy: "Deployment, analytics, structured data, SEO and ongoing maintenance.",
    },
    {
        title: "Product-minded frontend",
        copy: "Component boundaries, interaction details, responsive behaviour and accessible UI states.",
    },
]
