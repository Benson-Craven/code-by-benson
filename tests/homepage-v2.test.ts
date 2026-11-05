import assert from "node:assert/strict"
import { access, readFile } from "node:fs/promises"
import path from "node:path"
import test from "node:test"
import { implementedPortfolioProjects } from "../app/data/portfolioProjects"

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

test("the homepage renders the redesign from the typed project collection", async () => {
    const [pageSource, allWorkSource, presentationSource] = await Promise.all([
        readFile(path.join(process.cwd(), "app/(site)/page.tsx"), "utf8"),
        readFile(
            path.join(process.cwd(), "app/redesign/allWorkData.ts"),
            "utf8",
        ),
        readFile(
            path.join(process.cwd(), "app/redesign/projectPresentationData.ts"),
            "utf8",
        ),
    ])

    assert.match(pageSource, /<AllWork \/>/)
    assert.match(pageSource, /<ProjectPresentations \/>/)
    assert.doesNotMatch(
        pageSource,
        /SelectedWork|Experience|EngineeringApproach|TechnicalDepth|ProofStrip/,
    )
    assert.match(allWorkSource, /implementedPortfolioProjects\.map/)
    assert.match(presentationSource, /implementedPortfolioProjects\.map/)

    const publicProjectCopy = JSON.stringify(implementedPortfolioProjects)

    assert.doesNotMatch(
        publicProjectCopy,
        /real-time market dashboard|AAPL|BTCUSD|case study placeholder|link placeholder/i,
    )
})
