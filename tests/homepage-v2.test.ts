import assert from "node:assert/strict"
import { access, readFile } from "node:fs/promises"
import path from "node:path"
import test from "node:test"
import React, { createElement, type ComponentType } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { implementedPortfolioProjects } from "../app/data/portfolioProjects"
;(globalThis as typeof globalThis & { React: typeof React }).React = React

const approvedProjects = [
    "Chronic Pain Recovery",
    "Nibbles with Nifa",
    "Waxlist",
]

test("Selected Work renders the approved proof-first project order", async () => {
    assert.deepEqual(
        implementedPortfolioProjects.map(({ title }) => title),
        approvedProjects,
    )
    assert.deepEqual(
        implementedPortfolioProjects.map(({ order }) => order),
        [1, 2, 3],
    )

    for (const project of implementedPortfolioProjects) {
        assert.ok(project.summary.length > 0)
        assert.ok(project.ownership.role.length > 0)
        assert.ok(project.capabilities.length > 0)
        assert.ok(project.actions.some(({ kind }) => kind === "case-study"))
    }

    const selectedWorkModule =
        await import("../app/components/work/SelectedWork")
    const defaultExport = selectedWorkModule.default as unknown
    const SelectedWork =
        typeof defaultExport === "function"
            ? (defaultExport as ComponentType)
            : (defaultExport as { default: ComponentType }).default
    const html = renderToStaticMarkup(createElement(SelectedWork))
    const titlePositions = approvedProjects.map((title) => html.indexOf(title))

    assert.ok(titlePositions.every((position) => position >= 0))
    assert.deepEqual(
        titlePositions,
        [...titlePositions].sort((a, b) => a - b),
    )
    assert.equal(html.match(/<article\b/g)?.length, 3)
    assert.doesNotMatch(
        html,
        /Real-Time Market Dashboard|AAPL|BTCUSD|CASE STUDY PLACEHOLDER/i,
    )
})

test("every homepage project feature uses a real local cover", async () => {
    await Promise.all(
        implementedPortfolioProjects.map(({ cover }) =>
            access(path.join(process.cwd(), "public", cover.src.slice(1))),
        ),
    )

    for (const { cover } of implementedPortfolioProjects) {
        assert.ok(cover.alt.length > 0)
        assert.ok(cover.width > 0)
        assert.ok(cover.height > 0)
    }
})

test("the homepage is driven by v2 proof and excludes retired claim sections", async () => {
    const [pageSource, selectedWorkSource, projectFeatureSource] =
        await Promise.all([
            readFile(path.join(process.cwd(), "app/page.tsx"), "utf8"),
            readFile(
                path.join(
                    process.cwd(),
                    "app/components/work/SelectedWork.tsx",
                ),
                "utf8",
            ),
            readFile(
                path.join(
                    process.cwd(),
                    "app/components/work/ProjectFeature.tsx",
                ),
                "utf8",
            ),
        ])

    assert.match(selectedWorkSource, /implementedPortfolioProjects\.map/)
    assert.doesNotMatch(
        pageSource,
        /EngineeringApproach|TechnicalDepth|ProofStrip/,
    )
    assert.match(projectFeatureSource, /project\.cover\.src/)
    assert.match(projectFeatureSource, /project\.capabilities\.map/)

    const publicProjectCopy = JSON.stringify(implementedPortfolioProjects)

    assert.doesNotMatch(
        publicProjectCopy,
        /real-time market dashboard|AAPL|BTCUSD|case study placeholder|link placeholder/i,
    )
})
