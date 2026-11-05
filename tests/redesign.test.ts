import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"
import { frogPlacement, shouldRenderFrog } from "../app/redesign/frogPlacement"
import sitemap from "../app/sitemap"
import { foodTreatment, heartTreatment } from "../app/redesign/frogTreatment"
import { implementedPortfolioProjects } from "../app/data/portfolioProjects"

test("food waits for the first bubble, staggers in and fades as scrolling continues", () => {
    for (const index of [0, 1, 2]) {
        for (const progress of [-1, 0, 0.25, 0.325, 0.65, 1, 2])
            assert.ok(foodTreatment(progress, index).opacity < 1e-10)
        assert.equal(foodTreatment(0.5, index).opacity, 1)
        assert.ok(
            foodTreatment(0.6, index).opacity <
                foodTreatment(0.55, index).opacity,
        )
        const positions = [0, 0.35, 0.4, 0.5, 0.6, 0.7]
        assert.deepEqual(
            positions.map((p) => foodTreatment(p, index)),
            [...positions]
                .reverse()
                .map((p) => foodTreatment(p, index))
                .reverse(),
        )
    }
    assert.ok(foodTreatment(0.35, 0).opacity > 0)
    assert.equal(foodTreatment(0.35, 2).opacity, 0)
})

test("heart treatment fades at section boundaries and reverses with scrolling", () => {
    for (const index of [0, 1, 2]) {
        for (const progress of [-1, 0, 1, 2])
            assert.equal(heartTreatment(progress, index).opacity, 0)
        const forward = [0, 0.1, 0.2, 0.5, 0.9, 1].map((progress) =>
            heartTreatment(progress, index),
        )
        const reverse = [1, 0.9, 0.5, 0.2, 0.1, 0].map((progress) =>
            heartTreatment(progress, index),
        )
        assert.deepEqual(reverse.reverse(), forward)
        for (const state of forward) {
            assert.ok(state.opacity >= 0 && state.opacity <= 1)
            assert.ok(state.yPercent <= 0 && state.yPercent >= -140)
        }
    }
    assert.ok(heartTreatment(0.1, 0).opacity > 0)
    assert.notDeepEqual(heartTreatment(0.1, 0), heartTreatment(0.1, 1))
})

const anchors = [
    { x: 1100, y: 638, width: 292, height: 312, scroll: 0 },
    { x: 28, y: 1712, width: 292, height: 312, scroll: 1024 },
    { x: 1100, y: 2686, width: 292, height: 312, scroll: 2048 },
]

test("frog travels through the three reserved desktop positions in both directions", () => {
    assert.deepEqual(frogPlacement(anchors, -10, false), anchors[0])
    assert.deepEqual(frogPlacement(anchors, 3000, false), anchors[2])
    assert.equal(frogPlacement(anchors, 1024, false).x, 28)
    assert.equal(frogPlacement(anchors, 512, false).x, 564)
    assert.equal(frogPlacement(anchors, 1536, false).x, 564)
    assert.equal(frogPlacement(anchors, 512, false).y, 1175)
})

test("narrow screens keep the frog in a reserved slot", () => {
    for (const scroll of [0, 400, 800, 1200, 1600, 2100]) {
        assert.ok(anchors.includes(frogPlacement(anchors, scroll, true)))
    }
})

test("rendering stops for hidden tabs, reduced motion and offscreen positions", () => {
    assert.equal(shouldRenderFrog(false, false, 400, 312, 800), true)
    assert.equal(shouldRenderFrog(true, false, 400, 312, 800), false)
    assert.equal(shouldRenderFrog(false, true, 400, 312, 800), false)
    assert.equal(shouldRenderFrog(false, false, 800, 312, 800), false)
    assert.equal(shouldRenderFrog(false, false, -312, 312, 800), false)
    assert.equal(shouldRenderFrog(false, false, -311, 312, 800), true)
})

test("the homepage is the indexable redesign and project pages are listed", async () => {
    const urls = sitemap().map(({ url }) => url)

    assert.equal(urls[0], "https://benson.codes")
    assert.equal(
        urls.some((url) => url.includes("redesign")),
        false,
    )
    for (const { slug } of implementedPortfolioProjects) {
        assert.ok(urls.includes(`https://benson.codes/projects/${slug}`))
    }

    const source = await readFile(
        new URL("../app/(site)/page.tsx", import.meta.url),
        "utf8",
    )
    assert.doesNotMatch(source, /robots:/)
    assert.doesNotMatch(source, /Redesign preview/)
})

test("fallback is a nonempty PNG and all supplied modules are present", async () => {
    const png = await readFile(
        new URL("../public/frog-mascot/frog-static.png", import.meta.url),
    )
    assert.equal(png.subarray(1, 4).toString(), "PNG")
    assert.ok(png.length > 500)
    for (const file of [
        "src/frog-mascot.js",
        "src/character.js",
        "src/dither.js",
        "vendor/three.core.js",
        "vendor/three.module.js",
        "README.md",
        "demo.html",
    ]) {
        assert.ok(
            (
                await readFile(
                    new URL(`../public/frog-mascot/${file}`, import.meta.url),
                )
            ).length > 0,
        )
    }
})

test("presentations preserve project order, project links and replaceable media", async () => {
    const { projectPresentations } =
        await import("../app/redesign/projectPresentationData")
    assert.deepEqual(
        projectPresentations.map(({ slug }) => slug),
        ["chronic-pain-recovery", "nibbles-with-nifa", "waxlist"],
    )
    assert.deepEqual(
        projectPresentations.map(({ side }) => side),
        ["left", "right", "left"],
    )
    for (const project of projectPresentations) {
        assert.equal(project.href, `/projects/${project.slug}`)
        assert.equal(project.bubbles.length, 3)
        assert.equal(project.desktop.length, 3)
        assert.notEqual(project.phone.front, project.phone.back)
        for (const media of [
            ...project.desktop,
            project.phone.front,
            project.phone.back,
        ]) {
            assert.ok(
                (
                    await readFile(
                        new URL(`../public${media.src}`, import.meta.url),
                    )
                ).length > 0,
            )
        }
        assert.match(project.phone.front.label, /Temporary/)
        if (project.slug !== "chronic-pain-recovery") {
            assert.ok(
                project.desktop.every(({ label }) =>
                    label.includes("Temporary"),
                ),
            )
        }
    }
    assert.match(
        projectPresentations[1].bubbles.join(" "),
        /Nifa owns.*editorial/,
    )
    assert.match(projectPresentations[2].bubbles.join(" "), /unpublished/)
})

test("project beats hold, transition, reverse and fade before release", async () => {
    const { presentationProgress: progress } =
        await import("../app/redesign/projectPresentationData")
    for (const value of [0, 0.25]) assert.equal(progress(value).screen, 0)
    for (const value of [0.4, 0.5, 0.65])
        assert.equal(progress(value).screen, 1)
    for (const value of [0.8, 0.92, 1]) assert.equal(progress(value).screen, 2)
    assert.ok(Math.abs(progress(0.325).phoneRotation - 90) < 0.001)
    assert.equal(progress(0.8).phoneRotation, 180)
    assert.deepEqual(progress(1).bubbles, [0, 0, 0])
    for (let i = 0; i <= 100; i++) {
        assert.ok(
            progress(i / 100).bubbles.filter((opacity) => opacity > 0).length <=
                1,
        )
    }
    const forward = [0, 0.325, 0.5, 0.725, 1].map(progress)
    assert.deepEqual([1, 0.725, 0.5, 0.325, 0].map(progress).reverse(), forward)
    const held = [
        { x: 24, y: 2500, width: 160, height: 168, scroll: 1800 },
        { x: 24, y: 2500, width: 160, height: 168, scroll: 3800 },
        { x: 1100, y: 4500, width: 160, height: 168, scroll: 4600 },
    ]
    assert.equal(frogPlacement(held, 2800, false).x, 24)
    assert.equal(frogPlacement(held, 2800, false).y, 2500)
    assert.equal(frogPlacement(held, 4200, false).x, 562)
    assert.equal(frogPlacement(held, 4600, false).x, 1100)
})

test("resizing the frog repaints the cleared canvas before returning", async () => {
    const modulePath = "../public/frog-mascot/src/dither.js"
    const { DitherRenderer } = await import(modulePath)
    let visible = true
    const renderer = {
        pixelRatio: 2,
        scene: {},
        camera: { updateProjectionMatrix() {} },
        renderer: {
            setPixelRatio() {},
            setSize() {
                visible = false
            },
        },
        target: { setSize() {} },
        canvas: { style: {} },
        dither: { setSize() {} },
        pixel: {
            setSize() {},
            uniforms: { uTexel: { value: { set() {} } } },
        },
        render() {
            visible = true
        },
    }
    for (const width of [320, 280, 240, 280, 320]) {
        DitherRenderer.prototype.resize.call(renderer, width, width * 1.05)
        assert.equal(
            visible,
            true,
            `Canvas is blank after resizing to ${width}px`,
        )
    }
})

test("page-directed attention can be released and speech drives the rig", async () => {
    const modulePath = "../public/frog-mascot/src/frog-mascot.js"
    const { FrogMascot } = await import(modulePath)
    let activity = 0
    let duration = 0
    let blinks = 0
    const frog = {
        attention: null as null | { x: number; y: number },
        noteActivity() {
            activity++
        },
        character: {
            api: {
                talk(seconds: number) {
                    duration = seconds
                },
                blink() {
                    blinks++
                },
            },
        },
    }
    for (const direction of [-1, 1]) {
        FrogMascot.prototype.setAttention.call(frog, direction, -0.25)
        assert.deepEqual(frog.attention, { x: direction, y: -0.25 })
    }
    FrogMascot.prototype.setAttention.call(frog, null)
    assert.equal(frog.attention, null)
    assert.equal(activity, 2)
    FrogMascot.prototype.talk.call(frog, 2.2)
    assert.equal(duration, 2.2)
    assert.equal(blinks, 1)
    assert.equal(activity, 3)
})

test("tricks catch once, hop three times, then only sigh", async () => {
    const { frogTrick } = await import("../app/redesign/frogTreatment")
    assert.deepEqual(
        Array.from({ length: 8 }, (_, i) => frogTrick(i + 1)),
        ["catch", "hop", "hop", "hop", "sigh", "sigh", "sigh", "sigh"],
    )
})

test("tongue origin follows the animated mouth in host coordinates", async () => {
    const modulePath = "../public/frog-mascot/src/frog-mascot.js"
    const characterPath = "../public/frog-mascot/src/character.js"
    const { FrogMascot } = await import(modulePath)
    const { buildCharacter, PALETTE } = await import(characterPath)
    const character = buildCharacter({ kind: "frog", colors: PALETTE })
    const frog = { character, height: 336 }
    const before = FrogMascot.prototype.mouthScreenPos.call(frog)
    character.root.position.set(30, 20, 0)
    const moved = FrogMascot.prototype.mouthScreenPos.call(frog)
    assert.ok(Math.abs(moved.x - before.x - 30) < 1e-6)
    assert.ok(Math.abs(moved.y - before.y + 20) < 1e-6)
    character.parts.head.rotation.y = 0.4
    const turned = FrogMascot.prototype.mouthScreenPos.call(frog)
    assert.notEqual(turned.x, moved.x)
    assert.ok(Number.isFinite(turned.y))
})

test("page smile ends speech and releases to a neutral expression", async () => {
    const modulePath = "../public/frog-mascot/src/frog-mascot.js"
    const characterPath = "../public/frog-mascot/src/character.js"
    const { FrogMascot } = await import(modulePath)
    const { buildCharacter, PALETTE } = await import(characterPath)
    const character = buildCharacter({ kind: "frog", colors: PALETTE })
    const frog = {
        character,
        pageSmiling: false,
        hover: { happy: false },
        noteActivity() {},
    }
    character.api.talk(2.2)
    FrogMascot.prototype.setSmiling.call(frog, true)
    assert.equal(frog.pageSmiling, true)
    assert.equal(character.api.state.happy, true)
    assert.equal(character.api.state.talk, 0)
    const smile = character.look.mouthState.smile
    FrogMascot.prototype.setSmiling.call(frog, false)
    assert.equal(frog.pageSmiling, false)
    assert.equal(character.api.state.happy, false)
    assert.ok(character.look.mouthState.smile < smile)
})

test("footer dialogue can select every line without consecutive repeats", async () => {
    const { footerDialogue, pickFooterDialogue } =
        await import("../app/redesign/frogDialogue")
    assert.equal(new Set(footerDialogue).size, footerDialogue.length)
    assert.deepEqual(
        footerDialogue.map((_, index) =>
            pickFooterDialogue("", index / footerDialogue.length),
        ),
        footerDialogue,
    )
    for (const previous of footerDialogue) {
        for (const random of [0, 0.25, 0.5, 0.75, 0.999, 1]) {
            const next = pickFooterDialogue(previous, random)
            assert.notEqual(next, previous)
            assert.ok(footerDialogue.includes(next))
        }
    }
})

test("each project page speaks its own lines without consecutive repeats", async () => {
    const { projectDialogue, pickProjectDialogue } =
        await import("../app/redesign/frogDialogue")
    const { implementedPortfolioProjects } =
        await import("../app/data/portfolioProjects")
    const slugs = implementedPortfolioProjects.map(({ slug }) => slug)

    assert.deepEqual(Object.keys(projectDialogue).sort(), [...slugs].sort())
    for (const slug of slugs) {
        const lines = projectDialogue[slug]
        assert.ok(lines.length >= 4, `${slug} needs a few lines`)
        assert.equal(new Set(lines).size, lines.length)
        for (const line of lines) {
            assert.match(line, /^[A-Z]/, `${line} should start a sentence`)
            assert.match(line, /[.!?]$/, `${line} should end a sentence`)
            assert.doesNotMatch(line, /[\u2013\u2014]/, `${line} has a dash`)
            assert.ok(line.length <= 80, `${line} is too long for the bubble`)
        }

        let previous = ""
        const seen = new Set<string>()
        for (let index = 0; index < 24; index++) {
            const next = pickProjectDialogue(
                slug,
                previous,
                (index % 9) / 9 + 0.01,
            )
            assert.ok(lines.includes(next))
            assert.notEqual(next, previous)
            seen.add(next)
            previous = next
        }
        assert.ok(seen.size > 1, `${slug} should rotate its lines`)
    }

    assert.equal(pickProjectDialogue("missing" as never, ""), "")
})

test("responsive slides hold for 80 percent of each beat and crossfade in order", async () => {
    const { responsivePresentationProgress: progress } =
        await import("../app/redesign/projectPresentationData")
    for (let index = 0; index < 5; index++) {
        for (const fraction of [0, 0.4, 0.8]) {
            const state = progress((index + fraction) / 5)
            assert.ok(Math.abs(state.slides[index] - 1) < 1e-10)
            assert.equal(
                state.slides.filter((value) => value > 1e-10).length,
                1,
            )
        }
        const fade = progress((index + 0.9) / 5)
        assert.ok(Math.abs(fade.slides[index] - 0.5) < 1e-10)
        if (index < 4) assert.ok(Math.abs(fade.slides[index + 1] - 0.5) < 1e-10)
    }
    assert.deepEqual(progress(1).slides, [0, 0, 0, 0, 0])
    assert.deepEqual(progress(-1), progress(0))
    assert.deepEqual(progress(2), progress(1))
    const samples = Array.from({ length: 501 }, (_, index) => index / 500)
    const forward = samples.map(progress)
    assert.deepEqual(samples.reverse().map(progress).reverse(), forward)
    for (const state of forward) {
        assert.ok(state.bubbles.filter((value) => value > 1e-10).length <= 1)
        assert.ok(
            [...state.slides, ...state.bubbles].every(
                (value) => value >= 0 && value <= 1,
            ),
        )
    }
    for (const value of [0.4, 0.6, 0.8, 0.96])
        assert.ok(Math.abs(progress(value).bubbles[2] - 1) < 1e-10)
    assert.deepEqual(progress(1).bubbles, [0, 0, 0])
})

test("corner travel finishes at 75 percent viewport height and reverses", async () => {
    const { cornerFrogPlacement: place, responsiveFrogSides } =
        await import("../app/redesign/frogPlacement")
    const tops = [0, 1000, 2000, 8000, 14000, 20000]
    const sides = ["right", "center", "left", "right", "left", "right"] as const
    assert.deepEqual(responsiveFrogSides, sides)
    for (const width of [320, 390, 402, 425, 768, 1023]) {
        const first = place(tops, 0, width, 800)
        assert.equal(first.x + first.width, width)
        const project = place(tops, tops[2], width, 800)
        assert.equal(first.width, project.width)
        assert.equal(first.height, project.height)
        assert.equal(first.cropHeight, project.cropHeight)
        const middle = place(tops, 300, width, 800)
        assert.ok(middle.x > 0 && middle.x < first.x)
        assert.equal(middle.speech, 0)
        assert.equal(place(tops, 225, width, 800).speech, 0.5)
        assert.equal(place(tops, 375, width, 800).speech, 0.5)
        const arrived = place(tops, 400, width, 800)
        assert.equal(arrived.x, (width - arrived.width) / 2)
        assert.equal(arrived.speech, 1)
        assert.equal(arrived.index, 1)
        assert.ok(Math.abs(arrived.y + arrived.cropHeight - 800) < 1e-10)
        for (let index = 1; index < tops.length; index++) {
            const state = place(tops, tops[index] - 600, width, 800)
            const frogSide = sides[index]
            assert.equal(
                state.x,
                frogSide === "left"
                    ? 0
                    : frogSide === "center"
                      ? (width - state.width) / 2
                      : width - state.width,
            )
            assert.equal(state.index, index)
            if (index >= 1 && index <= 4) {
                const expectedWidth = Math.max(220, Math.min(300, width * 0.68))
                assert.equal(state.width, expectedWidth)
                assert.equal(state.height, expectedWidth * (291 / 273))
                assert.equal(state.cropHeight, state.height)
                assert.equal(state.y + state.height, 800)
            }
            if (index === 5) {
                assert.equal(state.width, project.width)
                assert.equal(state.height, project.height)
                assert.equal(state.cropHeight, project.cropHeight)
            }
        }
        const samples = [0, 200, 300, 400, 1500, 7500, 14000, 20000]
        assert.deepEqual(
            samples.map((scroll) => place(tops, scroll, width, 800)),
            samples
                .reverse()
                .map((scroll) => place(tops, scroll, width, 800))
                .reverse(),
        )
    }
})

test("intro frog matches the hero size and sits centred at the bottom", async () => {
    const { cornerFrogPlacement: place } =
        await import("../app/redesign/frogPlacement")
    const tops = [0, 1000, 2000, 3000, 4000, 5000]
    for (const width of [320, 360, 390, 402, 425, 600, 768, 1023]) {
        const height = 844
        const hero = place(tops, 0, width, height)
        const intro = place(tops, tops[1], width, height)
        assert.deepEqual(
            {
                width: intro.width,
                height: intro.height,
                cropHeight: intro.cropHeight,
            },
            {
                width: hero.width,
                height: hero.height,
                cropHeight: hero.cropHeight,
            },
        )
        assert.equal(intro.x, (width - intro.width) / 2)
        assert.ok(Math.abs(intro.y + intro.height - height) < 1e-10)
        assert.equal(intro.index, 1)
        assert.equal(intro.speech, 1)
    }
})

test("irish flag keeps the tricolour, ripples and honours reduced motion", async () => {
    const flag = await readFile(
        new URL("../app/redesign/FrogFlag.tsx", import.meta.url),
        "utf8",
    )
    const colours = flag.match(/#169b62|#ffffff|#ff883e/g) ?? []
    assert.deepEqual(colours, [
        "#169b62",
        "#169b62",
        "#ffffff",
        "#ffffff",
        "#ff883e",
        "#ff883e",
    ])
    assert.match(flag, /data-frog-flag/)
    const presentation = await readFile(
        new URL("../app/redesign/FrogPresentation.tsx", import.meta.url),
        "utf8",
    )
    assert.match(
        presentation,
        /const flagOpacity =\s*cornerActive && corner\.index === 1 && aboutActive/,
    )
    assert.match(presentation, /flag\.style\.opacity = String\(flagOpacity\)/)
    assert.match(
        presentation,
        /flag\.dataset\.visible = String\(flagOpacity > 0\)/,
    )
    const css = await readFile(
        new URL("../app/redesign/redesign.module.css", import.meta.url),
        "utf8",
    )
    assert.match(css, /\.flagColumn\s*\{[^}]*animation: flagWave/)
    assert.match(css, /\.flagColumn\s*\{[^}]*animation-play-state: paused/)
    assert.match(
        css,
        /\.frogFlag\[data-visible="true"\] \.flagColumn\s*\{\s*animation-play-state: running/,
    )
    const reduced = css.slice(css.indexOf("@keyframes flagWave"))
    assert.match(
        reduced,
        /@media \(prefers-reduced-motion: reduce\)\s*\{\s*\.frogFlag\s*\{[^}]*\}\s*\.flagColumn\s*\{\s*animation: none;/,
    )
})

test("responsive sticky stages require room for the heading, device and narration", async () => {
    const { responsiveStageFits: fits } =
        await import("../app/redesign/projectPresentationData")
    assert.equal(fits(777, 120, 264, 200), true)
    assert.equal(fits(390, 120, 220, 200), false)
    assert.equal(fits(600, 100, 220, 200), true)
    assert.equal(fits(600, 101, 220, 200), false)
})

test("responsive phone flips solid faces in the final fifth of beat four", async () => {
    const { responsivePresentationProgress: progress } =
        await import("../app/redesign/projectPresentationData")
    for (const value of [0, 0.2, 0.4, 0.56]) {
        assert.ok(Math.abs(progress(value).phoneOpacity) < 1e-10)
        assert.equal(progress(value).phoneRotation, 0)
    }
    assert.ok(Math.abs(progress(0.58).phoneOpacity - 0.5) < 1e-10)
    for (const [value, rotation] of [
        [0.6, 0],
        [0.76, 0],
        [0.78, 90],
        [0.8, 180],
        [0.96, 180],
    ]) {
        const state = progress(value)
        assert.ok(Math.abs(state.phoneRotation - rotation) < 1e-10)
        assert.equal(state.phoneOpacity, 1)
        assert.deepEqual(state.slides.slice(0, 3), [0, 0, 0])
    }
    assert.ok(Math.abs(progress(0.98).phoneOpacity - 0.5) < 1e-10)
    assert.equal(progress(1).phoneOpacity, 0)
    assert.equal(progress(1).phoneRotation, 180)
})

test("the project flood starts at the frog and covers the farthest corner", async () => {
    const { floodGeometry } = await import("../app/redesign/projectNavigation")
    const geometry = floodGeometry(
        { left: 32, top: 640, width: 120, height: 126 },
        { width: 1280, height: 800 },
    )
    assert.equal(geometry.x, 92)
    assert.equal(geometry.y, 703)
    assert.equal(geometry.from, 63)
    const farthest = Math.max(
        Math.hypot(92, 703),
        Math.hypot(1280 - 92, 703),
        Math.hypot(92, 800 - 703),
        Math.hypot(1280 - 92, 800 - 703),
    )
    assert.equal(geometry.to, farthest)
    assert.ok(geometry.to > 1000)
})

test("without a frog the flood falls back to the bottom left corner", async () => {
    const { floodGeometry } = await import("../app/redesign/projectNavigation")
    assert.deepEqual(floodGeometry(null, { width: 390, height: 844 }), {
        x: 0,
        y: 844,
        from: 0,
        to: Math.hypot(390, 844),
    })
})

test("project detail paths resolve only for project pages", async () => {
    const { isProjectDetailPath, projectDetailPath, projectSlugFromPath } =
        await import("../app/redesign/projectNavigation")

    for (const slug of [
        "chronic-pain-recovery",
        "nibbles-with-nifa",
        "waxlist",
    ]) {
        assert.equal(projectDetailPath(slug), `/projects/${slug}`)
        assert.equal(projectSlugFromPath(projectDetailPath(slug)), slug)
        assert.equal(isProjectDetailPath(projectDetailPath(slug)), true)
    }
    assert.equal(projectSlugFromPath("/"), undefined)
    assert.equal(projectSlugFromPath("/work/waxlist"), undefined)
    assert.equal(isProjectDetailPath("/projects"), false)
    assert.equal(isProjectDetailPath("/projects/waxlist/extra"), false)
})

test("retired redesign URLs redirect to the new homepage and project routes", async () => {
    const { default: config } = await import("../next.config.mjs")
    const redirects = await (
        config as {
            redirects: () => Promise<
                { source: string; destination: string; permanent: boolean }[]
            >
        }
    ).redirects()

    assert.deepEqual(redirects, [
        { source: "/redesign", destination: "/", permanent: true },
        {
            source: "/redesign/projects/:slug",
            destination: "/projects/:slug",
            permanent: true,
        },
    ])
})

test("project pages reuse the tint and wrap to the next project", async () => {
    const { getRedesignProjectPage, projectTints } =
        await import("../app/redesign/projectDetailData")
    const expected = [
        ["chronic-pain-recovery", "nibbles-with-nifa"],
        ["nibbles-with-nifa", "waxlist"],
        ["waxlist", "chronic-pain-recovery"],
    ] as const

    for (const [slug, next] of expected) {
        const page = getRedesignProjectPage(slug)
        assert.ok(page)
        assert.equal(page.project.slug, slug)
        assert.equal(page.nextProject.slug, next)
        assert.equal(page.tint, projectTints[slug])
        assert.equal(page.nextTint, projectTints[next])
        assert.ok(page.project.cover.src.startsWith("/images/"))
        assert.ok(page.preview.lead.length > 0)
        assert.match(page.preview.note, /^I /)
    }
    assert.equal(getRedesignProjectPage("missing"), undefined)
})

test("project pages are indexable and listed in the sitemap", async () => {
    const urls = sitemap().map(({ url }) => url)
    const source = await readFile(
        new URL("../app/(site)/projects/[slug]/page.tsx", import.meta.url),
        "utf8",
    )

    assert.match(source, /export const dynamicParams = false/)
    assert.match(source, /alternates: \{\s*canonical: url,?\s*\}/)
    assert.doesNotMatch(source, /robots:/)

    for (const { slug } of implementedPortfolioProjects) {
        assert.ok(urls.includes(`https://benson.codes/projects/${slug}`))
    }
})

test("all work keeps the approved project order, links and grid rhythm", async () => {
    const { allWorkProjects, allWorkCountLabel } =
        await import("../app/redesign/allWorkData")
    const { implementedPortfolioProjects } =
        await import("../app/data/portfolioProjects")

    assert.deepEqual(
        allWorkProjects.map(({ slug }) => slug),
        implementedPortfolioProjects.map(({ slug }) => slug),
    )
    assert.deepEqual(
        allWorkProjects.map(({ href }) => href),
        implementedPortfolioProjects.map(({ slug }) => `/projects/${slug}`),
    )
    assert.deepEqual(
        allWorkProjects.map(({ layout }) => layout),
        ["wide", "half", "half"],
    )
    assert.equal(allWorkCountLabel(), "3 projects")
    assert.equal(allWorkCountLabel(1), "1 project")
    for (const project of allWorkProjects) {
        assert.match(project.tint, /^#[0-9a-f]{6}$/i)
        assert.ok(project.title.length > 0)
        assert.ok(project.timeframe.length > 0)
        assert.ok(project.cover.src.startsWith("/images/"))
    }
})

test("pixel dither exposes a deterministic bayer grid and tinted pixels", async () => {
    const {
        bayerThreshold,
        packColour,
        parseHexColour,
        pixelCellSize,
        pixelColour,
        pixelCrossfade,
        pixelGrid,
        pixelNoise,
        pixelEdgeVisible,
        normaliseLuminance,
        revealProgress,
    } = await import("../app/redesign/pixelDither")

    const thresholds = new Set(
        Array.from({ length: 16 }, (_, index) =>
            bayerThreshold(index % 4, Math.floor(index / 4)),
        ),
    )
    assert.equal(thresholds.size, 16)
    assert.equal(bayerThreshold(5, 9), bayerThreshold(1, 1))

    assert.deepEqual(parseHexColour("#08d9d6"), {
        red: 8,
        green: 217,
        blue: 214,
    })
    assert.equal(parseHexColour("not-a-colour"), null)

    assert.equal(pixelCellSize(1, false), 2)
    assert.equal(pixelCellSize(3, true), 4 / 3)
    assert.deepEqual(pixelGrid(440, 294, 2), {
        columns: 220,
        rows: 147,
        cellSize: 2,
    })

    const tint = packColour(8, 217, 214)
    const ink = packColour(11, 11, 12)
    assert.equal(pixelColour(0.8, 0.5, tint, ink), tint)
    assert.equal(pixelColour(0.2, 0.5, tint, ink), ink)
    assert.deepEqual(pixelCrossfade("open"), { from: 1, to: 0 })
    assert.deepEqual(pixelCrossfade("close"), { from: 0, to: 1 })

    assert.equal(pixelNoise(12, 4), pixelNoise(12, 4))
    const edgeSource = {
        columns: 700,
        rows: 400,
        cellSize: 2,
        tint,
        ink,
        luminance: new Float32Array(700 * 400).fill(0.5),
        pixelColours: new Uint32Array(700 * 400),
    }
    const edgeRect = { left: 20, top: 250, width: 1400, height: 800 }
    const edgeViewport = { width: 1440, height: 900 }
    assert.equal(
        pixelEdgeVisible(350, 200, edgeSource, {
            rect: edgeRect,
            viewport: edgeViewport,
        }),
        false,
    )
    assert.equal(
        pixelEdgeVisible(699, 399, edgeSource, {
            rect: edgeRect,
            viewport: edgeViewport,
            open: 1,
        }),
        true,
    )
    assert.equal(
        pixelEdgeVisible(699, 399, edgeSource, {
            rect: edgeRect,
            viewport: edgeViewport,
            open: 2,
        }),
        false,
    )

    assert.ok(pixelNoise(12, 4) >= 0 && pixelNoise(12, 4) < 1)
    assert.ok(pixelNoise(12, 4) !== pixelNoise(13, 4))

    const stretched = normaliseLuminance(
        Float32Array.from([0.6, 0.7, 0.8, 0.9]),
    )
    assert.equal(stretched[0], 0)
    assert.equal(stretched[3], 1)
    assert.ok(stretched[1] < stretched[2])

    assert.equal(revealProgress(0, 760), 0)
    assert.equal(revealProgress(760, 760), 1)
    let previous = 0
    for (const elapsed of [0, 100, 300, 500, 760]) {
        const progress = revealProgress(elapsed, 760)
        assert.ok(progress >= previous)
        previous = progress
    }
})

test("all work grid exposes the shared transition hooks and pixel covers", async () => {
    const source = await readFile(
        new URL("../app/redesign/AllWork.tsx", import.meta.url),
        "utf8",
    )

    for (const marker of [
        'id="work"',
        "data-project-index",
        "data-work-card",
        "data-project-link",
        'data-project-direction="open"',
        "data-project-cover",
        "data-project-tint",
        "<PixelReveal",
    ]) {
        assert.ok(source.includes(marker), `missing ${marker}`)
    }

    const page = await readFile(
        new URL("../app/(site)/page.tsx", import.meta.url),
        "utf8",
    )
    assert.match(page, /<AllWork \/>/)
    assert.match(page, /href="#work"/)
    assert.doesNotMatch(page, /data-redesign data-project-index/)
})

test("project pages reveal the hero as pixels and close back to all work", async () => {
    const source = await readFile(
        new URL("../app/redesign/ProjectCase.tsx", import.meta.url),
        "utf8",
    )

    assert.match(source, /data-project-hero=\{project\.slug\}/)
    assert.match(source, /<PixelReveal/)
    assert.match(source, /reveal/)
    assert.match(source, /href="\/#work"/)
})

test("project pages run the animated frog behind their dialogue layer", async () => {
    const projectCase = await readFile(
        new URL("../app/redesign/ProjectCase.tsx", import.meta.url),
        "utf8",
    )
    assert.match(projectCase, /<ProjectFrog slug=\{project\.slug\} \/>/)
    assert.doesNotMatch(projectCase, /frog-static\.png/)

    const frog = await readFile(
        new URL("../app/redesign/ProjectFrog.tsx", import.meta.url),
        "utf8",
    )
    for (const marker of [
        "loadFrog",
        "createFrog",
        "pickProjectDialogue",
        "data-project-dialogue",
        "data-frog-layer",
        "prefers-reduced-motion: reduce",
        "webglcontextlost",
        "visibilitychange",
        "revealSpeech",
        "data-dialogue-pixels",
        "caseDialogueShadow",
        'ease: "power2.in"',
    ]) {
        assert.ok(frog.includes(marker), `missing ${marker}`)
    }

    const css = await readFile(
        new URL("../app/redesign/redesign.module.css", import.meta.url),
        "utf8",
    )
    assert.match(css, /\.caseDialogue \{/)
    assert.match(css, /\.caseFrog\[data-frog-ready="true"\] \.caseFrogFallback/)
})

test("the transition resolves covers from the clicked card and crossfades pixels", async () => {
    const source = await readFile(
        new URL("../app/redesign/ProjectTransition.tsx", import.meta.url),
        "utf8",
    )

    for (const marker of [
        "coverForLink(link, slug)",
        "createCoverClone",
        "pixelCrossfade",
        "waitForPixelReady",
        "markWorkTransition",
        'closest<HTMLElement>("#work")',
        "pixelLayer",
    ]) {
        assert.ok(source.includes(marker), `missing ${marker}`)
    }

    const reveal = await readFile(
        new URL("../app/redesign/PixelReveal.tsx", import.meta.url),
        "utf8",
    )
    assert.match(reveal, /prefers-reduced-motion: reduce/)
    assert.match(reveal, /data-pixel-canvas/)
})

test("screenshots develop as a two-colour silhouette and dissolve", async () => {
    const { pixelDevelopVisible } = await import("../app/redesign/pixelDither")

    const visible = (develop: number, resolve: number) => {
        let count = 0
        for (let row = 0; row < 40; row += 1) {
            for (let column = 0; column < 40; column += 1) {
                if (pixelDevelopVisible(column, row, 40, 40, develop, resolve))
                    count += 1
            }
        }
        return count
    }

    // Nothing is painted before the frame is in view.
    assert.equal(visible(0, 0), 0)
    // The silhouette fills in as it develops, then clears as it resolves.
    const half = visible(0.5, 0)
    const full = visible(1, 0)
    assert.ok(half > 0)
    assert.ok(full > half)
    assert.equal(visible(1, 1), 0)
    assert.ok(visible(1, 0.3) < full)
})

test("project pages frame screenshots and keep only the short narrative", async () => {
    const page = await readFile(
        new URL("../app/redesign/ProjectCase.tsx", import.meta.url),
        "utf8",
    )

    for (const marker of [
        "BrowserFrame",
        "PixelDevelop",
        "WordReveal",
        "data-project-hero={project.slug}",
        "caseShotWide",
        "caseShotPair",
        "caseClipSection",
        "data-project-cover={nextProject.slug}",
    ]) {
        assert.ok(page.includes(marker), `missing ${marker}`)
    }

    // Captions were the bulk of the remaining copy; alt text keeps the detail.
    assert.doesNotMatch(page, /<figcaption/)

    // The long case-study narrative stays on the public /work routes.
    for (const dropped of [
        "Constraints",
        "Ownership",
        "Outcomes",
        "Reflection",
    ]) {
        assert.ok(!page.includes(`>${dropped}<`), `${dropped} still rendered`)
        assert.ok(!page.includes(`"${dropped}"`), `${dropped} still rendered`)
    }

    const frame = await readFile(
        new URL("../app/redesign/BrowserFrame.tsx", import.meta.url),
        "utf8",
    )
    for (const marker of [
        "caseFrameShadow",
        "caseFrameBar",
        "caseFrameUrl",
        "caseFrameMedia",
    ]) {
        assert.ok(frame.includes(marker), `missing ${marker}`)
    }
})

test("the outgoing page is clipped away late instead of covered in tint", async () => {
    const source = await readFile(
        new URL("../app/redesign/ProjectTransition.tsx", import.meta.url),
        "utf8",
    )

    for (const marker of [
        "createPageGhost",
        "ghost.dataset.transitionGhost",
        "GHOST_CLIP_MS",
        "ghost.startClip",
        "ghost.endClip",
        "cubic-bezier(0.65, 0, 0.35, 1)",
        'clone.querySelectorAll("canvas")',
        'querySelectorAll<HTMLVideoElement>("video")',
        'clone.setAttribute("inert", "")',
    ]) {
        assert.ok(source.includes(marker), `missing ${marker}`)
    }

    assert.ok(!source.includes("FLOOD_COVER_MS"))
    assert.doesNotMatch(source, /createFlood/)
})

test("project copy reveals word by word and reads at one size on phones", async () => {
    const wordReveal = await readFile(
        new URL("../app/redesign/WordReveal.tsx", import.meta.url),
        "utf8",
    )
    for (const marker of [
        "data-word",
        "prefers-reduced-motion: reduce",
        "requestAnimationFrame",
        '"scroll"',
        "document.fonts",
    ]) {
        assert.ok(wordReveal.includes(marker), `missing ${marker}`)
    }

    const css = await readFile(
        new URL("../app/redesign/redesign.module.css", import.meta.url),
        "utf8",
    )
    const phoneBlock = css.slice(css.indexOf("@media (max-width: 767px)"))
    assert.match(
        phoneBlock,
        /\.caseLead,\s*\n\s*\.caseIntroCopy p,\s*\n\s*\.caseShotHeader p \{\s*\n\s*font-size: 20px/,
    )
    assert.doesNotMatch(css, /\.caseClipNote/)
})

test("the frog speech bubble develops like a screenshot frame", async () => {
    const speech = await readFile(
        new URL("../app/redesign/speechDither.ts", import.meta.url),
        "utf8",
    )
    for (const marker of [
        "buildSpeechSilhouette",
        "paintSpeechSilhouette",
        "revealSpeech",
        "DEVELOP_MS",
        "RESOLVE_MS",
        "pixelDevelopVisible",
        "canvas.hidden = true",
    ]) {
        assert.ok(speech.includes(marker), `missing ${marker}`)
    }

    const css = await readFile(
        new URL("../app/redesign/redesign.module.css", import.meta.url),
        "utf8",
    )
    assert.match(css, /\.caseDialogueShadow \{/)
    assert.match(css, /\.caseDialoguePixels \{/)
    assert.match(css, /conic-gradient\(\s*var\(--black\) 25%/)
})
