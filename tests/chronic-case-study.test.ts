import assert from "node:assert/strict"
import { access } from "node:fs/promises"
import path from "node:path"
import test from "node:test"
import { validatePortfolioProject } from "../app/data/portfolio"
import { chronicPainRecoveryProject } from "../app/data/portfolioProjects"

test("Chronic Pain Recovery satisfies the Portfolio v2 project contract", () => {
    assert.deepEqual(validatePortfolioProject(chronicPainRecoveryProject), [])
    assert.equal(chronicPainRecoveryProject.slug, "chronic-pain-recovery")
    assert.equal(chronicPainRecoveryProject.status, "production")
    assert.equal(chronicPainRecoveryProject.caseStudy.decisions.length, 3)
    assert.equal(chronicPainRecoveryProject.evidence.stills.length, 3)

    assert.deepEqual(
        chronicPainRecoveryProject.actions.map(({ kind }) => kind),
        ["case-study", "live-site"],
    )
    assert.equal(
        chronicPainRecoveryProject.actions[1]?.href,
        "https://chronicpainrecovery.ie",
    )
})

test("Chronic Pain Recovery evidence exists and stays deferred", async () => {
    const assets = [
        chronicPainRecoveryProject.cover.src,
        ...chronicPainRecoveryProject.evidence.stills.map(({ src }) => src),
        chronicPainRecoveryProject.evidence.clip.src,
        chronicPainRecoveryProject.evidence.clip.poster,
        chronicPainRecoveryProject.seo.shareImage.src,
    ]

    await Promise.all(
        assets.map((src) =>
            access(path.join(process.cwd(), "public", src.slice(1))),
        ),
    )

    assert.equal(chronicPainRecoveryProject.evidence.clip.preload, "none")
    assert.equal(chronicPainRecoveryProject.evidence.clip.controls, true)
    assert.equal(chronicPainRecoveryProject.evidence.clip.playsInline, true)
    assert.equal(chronicPainRecoveryProject.evidence.clip.autoPlay, false)
    assert.ok(chronicPainRecoveryProject.evidence.clip.description.length > 0)
})
