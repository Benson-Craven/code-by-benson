import assert from "node:assert/strict"
import { access } from "node:fs/promises"
import path from "node:path"
import test from "node:test"
import { validatePortfolioProject } from "../app/data/portfolio"
import { nibblesWithNifaProject } from "../app/data/portfolioProjects"

test("Nibbles with Nifa satisfies the Portfolio v2 project contract", () => {
    assert.deepEqual(validatePortfolioProject(nibblesWithNifaProject), [])
    assert.equal(nibblesWithNifaProject.slug, "nibbles-with-nifa")
    assert.equal(nibblesWithNifaProject.status, "published")
    assert.equal(nibblesWithNifaProject.caseStudy.decisions.length, 3)
    assert.equal(nibblesWithNifaProject.evidence.stills.length, 3)

    assert.deepEqual(
        nibblesWithNifaProject.actions.map(({ kind }) => kind),
        ["case-study", "live-site"],
    )
    assert.equal(
        nibblesWithNifaProject.actions.find(({ kind }) => kind === "live-site")
            ?.href,
        "https://nibbles-with-nifa.vercel.app/",
    )
    assert.ok(
        nibblesWithNifaProject.ownership.collaborators.some(
            ({ name, role }) => name === "Nifa" && role.length > 0,
        ),
    )
})

test("Nibbles evidence exists, stays deferred, and discloses local capture", async () => {
    const assets = [
        nibblesWithNifaProject.cover.src,
        ...nibblesWithNifaProject.evidence.stills.map(({ src }) => src),
        nibblesWithNifaProject.evidence.clip.src,
        nibblesWithNifaProject.evidence.clip.poster,
        nibblesWithNifaProject.seo.shareImage.src,
    ]

    await Promise.all(
        assets.map((src) =>
            access(path.join(process.cwd(), "public", src.slice(1))),
        ),
    )

    assert.equal(nibblesWithNifaProject.evidence.clip.preload, "none")
    assert.equal(nibblesWithNifaProject.evidence.clip.controls, true)
    assert.equal(nibblesWithNifaProject.evidence.clip.playsInline, true)
    assert.equal(nibblesWithNifaProject.evidence.clip.autoPlay, false)
    assert.match(nibblesWithNifaProject.caseStudy.proof, /captured locally/i)
})

test("Nibbles public copy excludes private editorial fields and production claims", () => {
    const publicCopy = JSON.stringify(nibblesWithNifaProject)

    assert.doesNotMatch(publicCopy, /permission notes?/i)
    assert.doesNotMatch(publicCopy, /preview token/i)
    assert.doesNotMatch(publicCopy, /private draft/i)
    assert.doesNotMatch(publicCopy, /production launch/i)
})
