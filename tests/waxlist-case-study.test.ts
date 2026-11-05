import assert from "node:assert/strict"
import { access, readFile } from "node:fs/promises"
import path from "node:path"
import test from "node:test"
import { validatePortfolioProject } from "../app/data/portfolio"
import {
    getPortfolioProject,
    implementedPortfolioProjects,
    portfolioHomepageUpdatedAt,
    waxlistProject,
} from "../app/data/portfolioProjects"
import sitemap from "../app/sitemap"

test("Waxlist satisfies the Portfolio v2 project contract without publication actions", () => {
    assert.deepEqual(validatePortfolioProject(waxlistProject), [])
    assert.equal(waxlistProject.slug, "waxlist")
    assert.equal(waxlistProject.status, "unpublished")
    assert.equal(waxlistProject.caseStudy.decisions.length, 3)
    assert.equal(waxlistProject.evidence.stills.length, 3)
    assert.match(waxlistProject.cover.caption, /invented/i)

    assert.deepEqual(
        waxlistProject.actions.map(({ kind }) => kind),
        ["case-study"],
    )
})

test("Waxlist evidence exists, is deferred, and discloses invented media", async () => {
    const assets = [
        waxlistProject.cover.src,
        ...waxlistProject.evidence.stills.map(({ src }) => src),
        waxlistProject.evidence.clip.src,
        waxlistProject.evidence.clip.poster,
        waxlistProject.seo.shareImage.src,
    ]

    await Promise.all(
        assets.map((src) =>
            access(path.join(process.cwd(), "public", src.slice(1))),
        ),
    )

    assert.equal(waxlistProject.evidence.clip.preload, "none")
    assert.equal(waxlistProject.evidence.clip.controls, true)
    assert.equal(waxlistProject.evidence.clip.playsInline, true)
    assert.equal(waxlistProject.evidence.clip.autoPlay, false)
    assert.match(waxlistProject.caseStudy.proof, /invented/i)
})

test("the approved public work set excludes the market dashboard everywhere", () => {
    const approvedSlugs = [
        "chronic-pain-recovery",
        "nibbles-with-nifa",
        "waxlist",
    ]
    const publicSlugs = implementedPortfolioProjects.map(({ slug }) => slug)
    const sitemapEntries = sitemap()
    const sitemapUrls = sitemapEntries.map(({ url }) => url)

    assert.deepEqual(publicSlugs, approvedSlugs)
    assert.equal(getPortfolioProject("real-time-market-dashboard"), undefined)
    assert.match(portfolioHomepageUpdatedAt, /^\d{4}-\d{2}-\d{2}$/)
    assert.notEqual(sitemapEntries[0]?.lastModified, undefined)
    assert.deepEqual(
        sitemapUrls.filter((url) => url.includes("/work/")),
        approvedSlugs.map((slug) => `https://benson.codes/work/${slug}`),
    )
    assert.deepEqual(
        sitemapUrls.filter((url) => url.includes("/projects/")),
        approvedSlugs.map((slug) => `https://benson.codes/projects/${slug}`),
    )
    assert.deepEqual(
        sitemapEntries.map(({ lastModified }) =>
            lastModified instanceof Date
                ? lastModified.toISOString().slice(0, 10)
                : lastModified,
        ),
        [
            portfolioHomepageUpdatedAt,
            ...implementedPortfolioProjects.map(({ updatedAt }) => updatedAt),
            ...implementedPortfolioProjects.map(({ updatedAt }) => updatedAt),
        ],
    )
})

test("the work route is driven only by the approved portfolio collection", async () => {
    const routeSource = await readFile(
        path.join(process.cwd(), "app/work/[slug]/page.tsx"),
        "utf8",
    )

    assert.match(routeSource, /implementedPortfolioProjects/)
    assert.match(routeSource, /getPortfolioProject/)
    assert.doesNotMatch(routeSource, /caseStudies|getCaseStudy|<CaseStudy/)
})

test("Waxlist public copy avoids release claims and sensitive values", () => {
    const publicCopy = JSON.stringify(waxlistProject)

    assert.doesNotMatch(publicCopy, /access token|refresh token|client secret/i)
    assert.doesNotMatch(publicCopy, /live product|production release/i)
    assert.doesNotMatch(publicCopy, /placeholder|github\.com|"href":"#"/i)
    assert.match(publicCopy, /unpublished/i)
})
