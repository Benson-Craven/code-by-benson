import assert from "node:assert/strict"
import test from "node:test"
import React, { createElement, type ComponentType } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { implementedPortfolioProjects } from "../app/data/portfolioProjects"
;(globalThis as typeof globalThis & { React: typeof React }).React = React

test("Selected Work keeps project proof available without hover", async () => {
    const selectedWorkModule =
        await import("../app/components/work/SelectedWork")
    const defaultExport = selectedWorkModule.default as unknown
    const SelectedWork =
        typeof defaultExport === "function"
            ? (defaultExport as ComponentType)
            : (defaultExport as { default: ComponentType }).default
    const html = renderToStaticMarkup(createElement(SelectedWork))

    assert.equal(html.match(/<article\b/g)?.length, 3)
    assert.match(html, /data-project-preview=""[^>]*aria-hidden="true"/)

    for (const project of implementedPortfolioProjects) {
        const caseStudyAction = project.actions.find(
            ({ kind }) => kind === "case-study",
        )

        assert.ok(caseStudyAction)
        assert.match(html, new RegExp(`href="${caseStudyAction.href}"`))
        assert.match(html, new RegExp(project.title))
        assert.match(html, new RegExp(project.summary))
        assert.match(html, new RegExp(project.availabilityLabel))
        assert.match(html, new RegExp(project.ownership.role))

        for (const { label } of project.capabilities) {
            assert.match(html, new RegExp(label))
        }

        assert.equal(
            html.match(new RegExp(`alt="${project.cover.alt}"`, "g"))?.length,
            1,
        )
    }

    assert.doesNotMatch(html, /Lumina|Flux|Prism|Vertex|href="#"/)
})
