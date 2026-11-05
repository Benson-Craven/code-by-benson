import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { implementedPortfolioProjects } from "@/app/data/portfolioProjects"
import { getRedesignProjectPage } from "../../../redesign/projectDetailData"
import ProjectCase from "../../../redesign/ProjectCase"

type ProjectPageProps = {
    params: {
        slug: string
    }
}

export const dynamicParams = false

export function generateStaticParams() {
    return implementedPortfolioProjects.map(({ slug }) => ({ slug }))
}

export function generateMetadata({ params }: ProjectPageProps): Metadata {
    const page = getRedesignProjectPage(params.slug)

    if (!page) {
        return {
            title: "Project not found",
        }
    }

    const url = `/projects/${page.project.slug}`
    const { seo } = page.project

    return {
        title: seo.title,
        description: seo.description,
        alternates: {
            canonical: url,
        },
        openGraph: {
            title: seo.title,
            description: seo.description,
            type: "article",
            url,
            siteName: "Benson Craven",
            images: [
                {
                    url: seo.shareImage.src,
                    width: seo.shareImage.width,
                    height: seo.shareImage.height,
                    alt: seo.shareImage.alt,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: seo.title,
            description: seo.description,
            images: [seo.shareImage.src],
        },
    }
}

export default function ProjectPage({ params }: ProjectPageProps) {
    const page = getRedesignProjectPage(params.slug)

    if (!page) {
        notFound()
    }

    return <ProjectCase {...page} />
}
