import type { Metadata } from "next"
import { notFound } from "next/navigation"
import PortfolioCaseStudy from "@/app/components/work/PortfolioCaseStudy"
import ScrollProgress from "@/app/components/work/ScrollProgress"
import {
    getNextImplementedPortfolioProject,
    getPortfolioProject,
    implementedPortfolioProjects,
} from "@/app/data/portfolioProjects"
import SiteFooter from "@/app/components/footer/SiteFooter"
import SiteHeader from "@/app/components/navigation/SiteHeader"

type WorkPageProps = {
    params: {
        slug: string
    }
}

export const dynamicParams = false

export function generateStaticParams() {
    return implementedPortfolioProjects.map(({ slug }) => ({ slug }))
}

export function generateMetadata({ params }: WorkPageProps): Metadata {
    const portfolioProject = getPortfolioProject(params.slug)

    if (!portfolioProject) {
        return {
            title: "Case Study Not Found",
        }
    }

    const url = `/work/${portfolioProject.slug}`

    return {
        title: portfolioProject.seo.title,
        description: portfolioProject.seo.description,
        alternates: {
            canonical: url,
        },
        openGraph: {
            title: portfolioProject.seo.title,
            description: portfolioProject.seo.description,
            type: "article",
            url,
            siteName: "Benson Craven",
            images: [
                {
                    url: portfolioProject.seo.shareImage.src,
                    width: portfolioProject.seo.shareImage.width,
                    height: portfolioProject.seo.shareImage.height,
                    alt: portfolioProject.seo.shareImage.alt,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: portfolioProject.seo.title,
            description: portfolioProject.seo.description,
            images: [portfolioProject.seo.shareImage.src],
        },
    }
}

export default function WorkPage({ params }: WorkPageProps) {
    const portfolioProject = getPortfolioProject(params.slug)

    if (!portfolioProject) {
        notFound()
    }

    const nextPortfolioProject = getNextImplementedPortfolioProject(params.slug)

    return (
        <>
            <ScrollProgress />
            <SiteHeader />
            <PortfolioCaseStudy
                project={portfolioProject}
                nextProject={nextPortfolioProject}
            />
            <SiteFooter />
        </>
    )
}
