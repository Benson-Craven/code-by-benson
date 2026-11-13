import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import path from "node:path"
import test from "node:test"
import React, { createElement, type ComponentType } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import type { PortfolioProject } from "../app/data/portfolio"
import { implementedPortfolioProjects } from "../app/data/portfolioProjects"
;(globalThis as typeof globalThis & { React: typeof React }).React = React

async function renderDefaultComponent(
    modulePath: string,
    props: Record<string, unknown> = {},
) {
    const importedModule = await import(modulePath)
    const defaultExport = importedModule.default as unknown
    const Component =
        typeof defaultExport === "function"
            ? (defaultExport as ComponentType<Record<string, unknown>>)
            : (
                  defaultExport as {
                      default: ComponentType<Record<string, unknown>>
                  }
              ).default

    return renderToStaticMarkup(createElement(Component, props))
}

test("the homepage composes the redesign and exposes direct contact paths", async () => {
    const homepageSource = await readFile(
        path.join(process.cwd(), "app/(site)/page.tsx"),
        "utf8",
    )

    for (const marker of [
        "data-redesign",
        "<IntroParagraph",
        "<ProjectPresentations />",
        "<AllWork />",
        "<FrogPresentation />",
        'href="#work"',
        'href="#contact"',
        "mailto:bensoncraven@hotmail.co.uk",
        "https://www.linkedin.com/in/benson-craven/",
        "https://github.com/Benson-Craven",
        'aria-label="Main navigation"',
        "I build things",
    ]) {
        assert.ok(homepageSource.includes(marker), `missing ${marker}`)
    }

    assert.doesNotMatch(homepageSource, /<h2[^>]*>Experience<\/h2>/)
    assert.doesNotMatch(homepageSource, /<h2[^>]*>Selected work<\/h2>/)
    assert.doesNotMatch(homepageSource, /Redesign preview|robots:/)
})

test("arrow CTAs move in their pointing direction and respect reduced motion", async () => {
    const internalLink = await renderDefaultComponent(
        "../app/components/work/AnimatedLink",
        { href: "/#work", children: "View work" },
    )
    const externalLink = await renderDefaultComponent(
        "../app/components/work/AnimatedLink",
        {
            href: "https://example.com",
            children: "Visit site",
            external: true,
        },
    )

    assert.match(internalLink, /class="[^"]*\bfocus-ring\b[^"]*\bgroup\b/)
    assert.match(internalLink, /group-hover:translate-x-1/)
    assert.doesNotMatch(internalLink, /group-hover:-translate-y-1/)
    assert.match(internalLink, /motion-reduce:transform-none/)
    assert.match(externalLink, /group-hover:translate-x-1/)
    assert.match(externalLink, /group-hover:-translate-y-1/)
    assert.match(externalLink, /group-focus-visible:-translate-y-1/)
    assert.match(externalLink, /motion-reduce:transition-none/)
})

test("every case study exposes a decision index and the fixed narrative order", async () => {
    const narrativeHeadings = [
        "Context",
        "Ownership",
        "Constraints",
        "Decisions",
        "Proof",
        "Outcomes",
        "Reflection",
    ]

    for (const project of implementedPortfolioProjects) {
        const html = await renderDefaultComponent(
            "../app/components/work/PortfolioCaseStudy",
            { project: project as PortfolioProject },
        )

        const headingPositions = narrativeHeadings.map((heading) => {
            assert.match(html, new RegExp(`<h2[^>]*>\\s*${heading}\\s*</h2>`))

            return html.indexOf(`>${heading}</h2>`)
        })

        assert.deepEqual(
            headingPositions,
            [...headingPositions].sort((a, b) => a - b),
        )

        project.caseStudy.decisions.forEach(({ id, title }) => {
            const target = `${project.slug}-${id}`

            assert.match(html, new RegExp(`href="#${target}"`))
            assert.match(
                html,
                new RegExp(`id="${target}"[^>]*class="[^"]*scroll-mt-`),
            )
            assert.match(
                html,
                new RegExp(title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
            )
        })

        assert.equal(html.match(/href="#[^"]+"/g)?.length, 3)
        assert.match(html, /class="sr-only">Ownership boundaries<\/h3>/)
    }
})

test("the Nibbles case study does not present demo-site copy", async () => {
    const nibbles = implementedPortfolioProjects.find(
        ({ slug }) => slug === "nibbles-with-nifa",
    )

    assert.ok(nibbles)

    const html = await renderDefaultComponent(
        "../app/components/work/PortfolioCaseStudy",
        { project: nibbles as PortfolioProject },
    )
    const renderedCopy = html.replace(
        /\s(?:href|poster|src|srcset)="[^"]*"/gi,
        "",
    )

    assert.doesNotMatch(renderedCopy, /\bdemo\b/i)
})

test("public pages avoid high-confidence machine-written copy tells", async () => {
    const [layoutSource, openGraphImageSource] = await Promise.all([
        readFile(path.join(process.cwd(), "app/layout.tsx"), "utf8"),
        readFile(path.join(process.cwd(), "app/opengraph-image.tsx"), "utf8"),
    ])
    const renderedPages = [
        await readFile(path.join(process.cwd(), "app/(site)/page.tsx"), "utf8"),
        await readFile(path.join(process.cwd(), "app/not-found.tsx"), "utf8"),
        await renderDefaultComponent("../app/redesign/TrickFrog"),
        await renderDefaultComponent("../app/loading"),
    ]
    const redesignedCopy = await Promise.all(
        [
            "app/redesign/IntroParagraph.tsx",
            "app/redesign/projectPresentationData.ts",
            "app/redesign/projectDetailData.ts",
            "app/redesign/ProjectCase.tsx",
        ].map((file) => readFile(path.join(process.cwd(), file), "utf8")),
    )

    for (const project of implementedPortfolioProjects) {
        renderedPages.push(
            await renderDefaultComponent(
                "../app/components/work/PortfolioCaseStudy",
                { project: project as PortfolioProject },
            ),
        )
    }

    const publicCopy = [
        ...renderedPages,
        ...redesignedCopy,
        layoutSource,
        openGraphImageSource,
        ...implementedPortfolioProjects.map(({ seo }) => JSON.stringify(seo)),
    ].join(" ")
    const machineWrittenTells = [
        /—/,
        /\bdesigned to\b/i,
        /\bwent beyond\b/i,
        /\bsource of truth\b/i,
        /\bstructured path\b/i,
        /\bevidence-led\b/i,
        /\btruth-preserving\b/i,
        /\bturning complex\b/i,
        /\btechnically complex\b/i,
        /\bfeel obvious\b/i,
        /\bbackground spans\b/i,
        /\bcoherent public system\b/i,
        /\bclearer place in the journey\b/i,
        /\boperating layer\b/i,
        /\bcollector cockpit\b/i,
        /\bthe deepest\b/i,
        /\bthe strongest\b/i,
        /\bthe most useful\b/i,
        /\bpart of the collection\b/i,
        /\bdetails between design and implementation\b/i,
        /\bexplainable matching\b/i,
        /\btruthful buying evidence\b/i,
        /\bfull-stack delivery\b/i,
    ]

    for (const pattern of machineWrittenTells) {
        assert.doesNotMatch(publicCopy, pattern)
    }
})
