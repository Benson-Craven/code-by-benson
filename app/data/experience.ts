export type ExperienceEntry = {
    title: string
    company: string
    period: string
    summary: string
}

export const experience: ExperienceEntry[] = [
    {
        title: "Frontend Developer",
        company: "First Page Australia",
        period: "Dec 2024 - July 2026",
        summary:
            "Build and improve more than 100 client and company-owned websites, covering custom frontend work, integrations, technical SEO and structured data. I joined the Melbourne team in person, and then worked with them as a contractor.",
    },
    {
        title: "Freelance Full Stack Developer",
        company: "Self-Employed",
        period: "Jan 2023 - Dec 2024",
        summary:
            "Built client applications with Next.js, TypeScript and Tailwind CSS, from requirements and acceptance criteria through deployment.",
    },
    {
        title: "Technical Consultant",
        company: "CGI UK Ltd",
        period: "July 2020 - Aug 2021",
        summary:
            "Worked on testing, automation and prototypes for safety-critical navigation systems using C, Python, Bash and Java.",
    },
]
