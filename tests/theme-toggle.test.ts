import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
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

test("the shared navigation exposes an accessible theme toggle", async () => {
    const headerHtml = await renderDefaultComponent(
        "../app/components/navigation/SiteHeader",
    )

    assert.match(headerHtml, /<button[^>]*aria-label="Switch to light mode"/)
    assert.match(headerHtml, /<button[^>]*aria-pressed="true"/)
    assert.match(headerHtml, /<span[^>]*aria-hidden="true"[^>]*><svg/)
})

test("the root layout restores a saved theme and defaults to dark", async () => {
    const layoutSource = await readFile(
        path.join(process.cwd(), "app/layout.tsx"),
        "utf8",
    )

    assert.match(layoutSource, /localStorage\.getItem\("benson-theme"\)/)
    assert.match(layoutSource, /: "dark";/)
    assert.doesNotMatch(layoutSource, /prefers-color-scheme/)
    assert.match(layoutSource, /classList\.toggle\("dark", isDark\)/)
    assert.match(layoutSource, /classList\.add\("dark"\)/)
    assert.match(layoutSource, /suppressHydrationWarning/)
})

test("theme colors are driven by light and dark design tokens", async () => {
    const [globalStyles, tailwindConfig] = await Promise.all([
        readFile(path.join(process.cwd(), "app/globals.css"), "utf8"),
        readFile(path.join(process.cwd(), "tailwind.config.ts"), "utf8"),
    ])

    assert.match(globalStyles, /:root\.dark\s*{/)
    assert.match(globalStyles, /--paper-rgb:\s*23 23 20/)
    assert.match(globalStyles, /--ink-rgb:\s*242 239 232/)
    assert.match(tailwindConfig, /rgb\(var\(--paper-rgb\)/)
    assert.match(tailwindConfig, /rgb\(var\(--ink-rgb\)/)
})
