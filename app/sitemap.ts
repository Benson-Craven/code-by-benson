import { MetadataRoute } from "next"
import {
    implementedPortfolioProjects,
    portfolioHomepageUpdatedAt,
} from "./data/portfolioProjects"

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: "https://benson.codes",
            lastModified: new Date(
                `${portfolioHomepageUpdatedAt}T00:00:00.000Z`,
            ),
            changeFrequency: "monthly",
            priority: 1,
        },
        ...implementedPortfolioProjects.map((project) => ({
            url: `https://benson.codes/work/${project.slug}`,
            lastModified: new Date(`${project.updatedAt}T00:00:00.000Z`),
            changeFrequency: "monthly" as const,
            priority: 0.8,
        })),
        ...implementedPortfolioProjects.map((project) => ({
            url: `https://benson.codes/projects/${project.slug}`,
            lastModified: new Date(`${project.updatedAt}T00:00:00.000Z`),
            changeFrequency: "monthly" as const,
            priority: 0.8,
        })),
    ]
}
