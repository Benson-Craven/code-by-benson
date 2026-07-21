import assert from "node:assert/strict"
import test from "node:test"
import { getShaderRenderingMode } from "../app/components/hero/shaderMotion"

test("animates only while motion is allowed and the hero is visible", () => {
    assert.equal(
        getShaderRenderingMode({
            reduceMotion: false,
            isIntersecting: true,
            documentVisibility: "visible",
        }),
        "animated",
    )
})

test("renders one static frame when reduced motion is requested", () => {
    assert.equal(
        getShaderRenderingMode({
            reduceMotion: true,
            isIntersecting: true,
            documentVisibility: "visible",
        }),
        "static",
    )
})

test("pauses when the hero is outside the viewport or the document is hidden", async (t) => {
    await t.test("outside viewport", () => {
        assert.equal(
            getShaderRenderingMode({
                reduceMotion: false,
                isIntersecting: false,
                documentVisibility: "visible",
            }),
            "paused",
        )
    })

    await t.test("hidden document", () => {
        assert.equal(
            getShaderRenderingMode({
                reduceMotion: false,
                isIntersecting: true,
                documentVisibility: "hidden",
            }),
            "paused",
        )
    })

    await t.test("hidden document with reduced motion", () => {
        assert.equal(
            getShaderRenderingMode({
                reduceMotion: true,
                isIntersecting: true,
                documentVisibility: "hidden",
            }),
            "paused",
        )
    })
})
