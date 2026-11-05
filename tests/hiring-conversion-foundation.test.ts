import assert from "node:assert/strict"
import { createHash } from "node:crypto"
import { readdir, readFile } from "node:fs/promises"
import path from "node:path"
import test from "node:test"
import React, { createElement, type ComponentType } from "react"
import { renderToStaticMarkup } from "react-dom/server"
;(globalThis as typeof globalThis & { React: typeof React }).React = React

async function renderDefaultComponent(modulePath: string) {
    const importedModule = await import(modulePath)
    const defaultExport = importedModule.default as unknown
    const Component =
        typeof defaultExport === "function"
            ? (defaultExport as ComponentType)
            : (defaultExport as { default: ComponentType }).default

    return renderToStaticMarkup(createElement(Component))
}

async function readApplicationSource(directory: string): Promise<string> {
    const entries = await readdir(directory, { withFileTypes: true })
    const source = await Promise.all(
        entries.map(async (entry) => {
            const entryPath = path.join(directory, entry.name)

            if (entry.isDirectory()) {
                return readApplicationSource(entryPath)
            }

            return /\.[jt]sx?$/.test(entry.name)
                ? readFile(entryPath, "utf8")
                : ""
        }),
    )

    return source.join("\n")
}

test("the shared navigation and footer expose direct contact paths", async () => {
    const [footerHtml, headerHtml, mobileNavSource] = await Promise.all([
        renderDefaultComponent("../app/components/footer/SiteFooter"),
        renderDefaultComponent("../app/components/navigation/SiteHeader"),
        readFile(
            path.join(process.cwd(), "app/components/navigation/MobileNav.tsx"),
            "utf8",
        ),
    ])

    assert.match(headerHtml, /mailto:bensoncraven@hotmail\.co\.uk/)
    assert.match(mobileNavSource, /mailto:bensoncraven@hotmail\.co\.uk/)
    assert.match(headerHtml, /href="\/benson-craven-resume\.pdf"/)
    assert.match(mobileNavSource, /\/benson-craven-resume\.pdf/)
    assert.match(footerHtml, /href="\/benson-craven-resume\.pdf"/)
    assert.doesNotMatch(
        headerHtml,
        /href="mailto:bensoncraven@hotmail\.co\.uk"[^>]*target=/,
    )
    assert.match(footerHtml, /looking for a Frontend Engineer role/i)
    assert.match(footerHtml, /mailto:bensoncraven@hotmail\.co\.uk/)
    assert.match(footerHtml, /github\.com\/Benson-Craven/)
    assert.match(footerHtml, /linkedin\.com\/in\/benson-craven/)
    assert.match(footerHtml, /opens in a new tab/)
})

test("the approved resume is published at a stable path", async () => {
    const resume = await readFile(
        path.join(process.cwd(), "public/benson-craven-resume.pdf"),
    )

    assert.equal(resume.subarray(0, 5).toString("ascii"), "%PDF-")
    assert.equal(
        createHash("sha256").update(resume).digest("hex"),
        "6251295cd2ed9532d8fd12242c2ddd1e75b0d3c6b1f0957120aad149b7dbbd49",
    )
})

test("metadata and structured data use the confirmed public positioning", async () => {
    const [layoutSource, jsonLdHtml] = await Promise.all([
        readFile(path.join(process.cwd(), "app/layout.tsx"), "utf8"),
        renderDefaultComponent("../app/components/JsonLd"),
    ])

    assert.match(layoutSource, /Benson Craven \| Frontend Engineer/)
    assert.match(
        layoutSource,
        /Frontend Engineer in Cork building client websites, publishing tools and record-collection software with React, TypeScript and Next\.js/,
    )
    assert.doesNotMatch(layoutSource, /Product Engineer|real-time interfaces/i)
    assert.match(jsonLdHtml, /"jobTitle":"Frontend Engineer"/)
    assert.doesNotMatch(jsonLdHtml, /real-time interfaces/i)
})

test("Vercel Analytics is integrated for default pageviews only", async () => {
    const [layoutSource, applicationSource, packageSource] = await Promise.all([
        readFile(path.join(process.cwd(), "app/layout.tsx"), "utf8"),
        readApplicationSource(path.join(process.cwd(), "app")),
        readFile(path.join(process.cwd(), "package.json"), "utf8"),
    ])
    const packageJson = JSON.parse(packageSource) as {
        dependencies?: Record<string, string>
    }

    assert.ok(packageJson.dependencies?.["@vercel/analytics"])
    assert.match(
        layoutSource,
        /import \{ Analytics \} from "@vercel\/analytics\/next"/,
    )
    assert.match(layoutSource, /<Analytics \/>/)
    assert.doesNotMatch(
        applicationSource,
        /\btrack\s*\(|beforeSend|debug=|eventEndpoint|viewEndpoint/,
    )
})
