import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"
import {
    aboutFlagOpacity,
    frogBadgeGeometry,
    frogPlacement,
    heroGreetingDrift,
    heroGreetingExit,
    shouldRenderFrog,
    workBadgeActive,
    workBadgeDock,
    workBadgePosition,
    workBadgeStarts,
} from "../app/redesign/frogPlacement"
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

test("the hero greeting fades up as the hero scrolls away", () => {
    // The bubble holds through the first third of the hero.
    for (const scroll of [-200, 0, 100, 349]) {
        const exit = heroGreetingExit(scroll, 1000)
        assert.equal(exit.opacity, 1)
        assert.equal(exit.offset, 0)
    }
    // It fades and drifts up before the frog changes slots at 60%.
    assert.deepEqual(heroGreetingExit(475, 1000), {
        opacity: 0.5,
        offset: -heroGreetingDrift / 2,
    })
    for (const scroll of [600, 1200, 4000]) {
        assert.deepEqual(heroGreetingExit(scroll, 1000), {
            opacity: 0,
            offset: -heroGreetingDrift,
        })
    }
    // Scrolling back up reverses the exit instead of replaying it.
    assert.ok(
        heroGreetingExit(500, 1000).opacity >
            heroGreetingExit(550, 1000).opacity,
    )
    // Short heroes keep a finite, bounded range.
    const short = heroGreetingExit(720, 720)
    assert.ok(short.opacity >= 0 && short.opacity <= 1)
    assert.ok(short.offset <= 0 && short.offset >= -heroGreetingDrift)
})

test("the hero greeting replays its fade-up on every return to the top", async () => {
    const presentation = await readFile(
        new URL("../app/redesign/FrogPresentation.tsx", import.meta.url),
        "utf8",
    )
    assert.match(presentation, /Ready for another tour already\?/)
    assert.match(presentation, /heroGreetingExit\(/)
    assert.match(
        presentation,
        /greeting\.style\.transform = `translateY\(\$\{offset\}px\)`/,
    )
    // The return line rises into place, then leaves upward when scrolling.
    assert.match(presentation, /greetingMotion\.offset = heroGreetingDrift/)
    assert.match(presentation, /offset: -heroGreetingDrift/)
    // Every visit to the top replays the entrance, not just the first.
    assert.match(presentation, /greetingPhase !== "returning"/)
    assert.match(presentation, /showReturnGreeting\(\)/)
    assert.match(presentation, /hideReturnGreeting\(\)/)
    // Reduced motion clears the inline motion instead of animating.
    assert.match(
        presentation,
        /if \(reduced\.matches\) \{\s*greeting\.style\.opacity = ""/,
    )
})

test("rendering stops for hidden tabs, reduced motion and offscreen positions", () => {
    assert.equal(shouldRenderFrog(false, false, 400, 312, 800), true)
    assert.equal(shouldRenderFrog(true, false, 400, 312, 800), false)
    assert.equal(shouldRenderFrog(false, true, 400, 312, 800), false)
    assert.equal(shouldRenderFrog(false, false, 800, 312, 800), false)
    assert.equal(shouldRenderFrog(false, false, -312, 312, 800), false)
    assert.equal(shouldRenderFrog(false, false, -311, 312, 800), true)
})

test("the frog leaves the badge once the footer is 20% into the viewport", () => {
    // Docking starts when the work section reaches the middle.
    assert.equal(workBadgeStarts(600, 2400, 1000), false)
    assert.equal(workBadgeStarts(500, 2400, 1000), false)
    assert.equal(workBadgeStarts(499, 2400, 1000), true)
    // It stays until the footer covers a fifth of the viewport.
    assert.equal(workBadgeActive(-200, 900, 1000), true)
    assert.equal(workBadgeActive(-200, 801, 1000), true)
    assert.equal(workBadgeActive(-200, 800, 1000), false)
    assert.equal(workBadgeActive(-200, 0, 1000), false)
    // Scrolling back up out of All Work also releases it.
    assert.equal(workBadgeActive(500, 900, 1000), false)
    // A small band above the release point keeps it from flickering.
    assert.equal(workBadgeStarts(-200, 800, 1000), false)
    assert.equal(workBadgeStarts(-200, 850, 1000), false)
    assert.equal(workBadgeStarts(-200, 851, 1000), true)
})

test("the badge circle docks in the bottom-right corner whatever the layer size", () => {
    for (const [width, height, inset] of [
        [320, 700, 20],
        [390, 844, 20],
        [1024, 800, 24],
        [1440, 1000, 24],
    ] as const) {
        for (const layerHeight of [234, 283, 348]) {
            const dock = workBadgeDock(width, height, layerHeight, inset)
            assert.equal(
                dock.x + frogBadgeGeometry.x,
                width - inset - frogBadgeGeometry.radius,
            )
            assert.equal(
                dock.y + layerHeight - frogBadgeGeometry.yFromBottom,
                height - inset - frogBadgeGeometry.radius,
            )
            assert.equal(dock.centreX, width - inset - frogBadgeGeometry.radius)
            assert.equal(
                dock.centreY,
                height - inset - frogBadgeGeometry.radius,
            )
        }
    }
    // The entry flight starts from a viewport point, not from the layer corner.
    const start = workBadgePosition(320, 480, 348)
    assert.equal(start.x + frogBadgeGeometry.x, 320)
    assert.equal(start.y + 348 - frogBadgeGeometry.yFromBottom, 480)
    assert.equal(start.centreX, 320)
    assert.equal(start.centreY, 480)
})

test("the frog docks as a paper-ringed circle over the all work grid", async () => {
    const allWork = await readFile(
        new URL("../app/redesign/AllWork.tsx", import.meta.url),
        "utf8",
    )
    assert.match(allWork, /data-frog-work/)
    const presentation = await readFile(
        new URL("../app/redesign/FrogPresentation.tsx", import.meta.url),
        "utf8",
    )
    assert.match(presentation, /data-frog-badge/)
    assert.match(presentation, /data-frog-work-dialogue/)
    assert.match(presentation, /pickAllWorkDialogue/)
    assert.match(presentation, /workBadgeStarts\(/)
    assert.match(presentation, /root\.dataset\.frogDocked = "true"/)
    assert.match(presentation, /frog\.setBadgeMix\(0\)/)
    assert.match(presentation, /frog\?\.setBadgeMix\(badgeMix\.value\)/)
    assert.match(presentation, /frog\?\.setBadge\(false\)/)
    const css = await readFile(
        new URL("../app/redesign/preview.css", import.meta.url),
        "utf8",
    )
    assert.match(css, /\.preview-frog-badge\s*\{/)
    assert.match(css, /0 0 0 4px #fbfbf8/)
    // The ring echoes the preview's blue and sits outside a paper gap.
    assert.match(css, /0 0 0 6px #3a5de3/)
    assert.match(css, /\.preview-frog-work-dialogue\s*\{/)
    // The bubble is anchored to the same geometry as the cropped circle.
    assert.match(css, /right: calc\(100% - 161\.5px\)/)
    assert.match(css, /\.preview-root\[data-frog-docked="true"\]/)
    const adapter = await readFile(
        new URL("../app/redesign/frogAdapter.ts", import.meta.url),
        "utf8",
    )
    assert.match(adapter, /setBadge\(on: boolean\)/)
    assert.match(adapter, /setBadgeMix\(mix: number\)/)
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
        // Only the views with real media are listed. Nibbles has one desktop
        // capture; the other projects have three.
        assert.equal(
            project.desktop.length,
            project.slug === "nibbles-with-nifa" ? 1 : 3,
        )
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
        assert.ok(project.phone.front.label.trim().length > 0)
        if (project.slug === "waxlist") {
            assert.deepEqual(
                project.desktop.map(({ label }) => label),
                ["Homepage", "Collection", "Privacy"],
            )
            assert.deepEqual(
                project.desktop.map(({ type }) => type),
                ["video", "video", "video"],
            )
        }
    }
    assert.match(
        projectPresentations[1].bubbles.join(" "),
        /Nifa can add recipes and travel stories/,
    )
    assert.match(
        projectPresentations[2].bubbles.join(" "),
        /Benson's been building it/,
    )
})

test("showcase device slots select independent clips and images with fallbacks", async () => {
    const { projectPresentations, showcaseMedia } =
        await import("../app/redesign/projectPresentationData")
    const [cpr, nibbles, waxlist] = projectPresentations
    assert.deepEqual(cpr.showcase, {
        desktop: 3,
        phone: ["front", "back"],
    })
    assert.deepEqual(nibbles.showcase, {
        desktop: 1,
        phone: ["front"],
    })
    assert.deepEqual(waxlist.showcase, {
        desktop: 3,
        phone: ["front"],
    })
    assert.equal(cpr.desktop[0], showcaseMedia[cpr.slug].desktop?.[0])
    assert.equal(cpr.phone.front, showcaseMedia[cpr.slug].mobile?.front)
    assert.equal(cpr.phone.back, showcaseMedia[cpr.slug].mobile?.back)
    assert.equal(cpr.desktop[0].type, "video")
    assert.equal(cpr.phone.front.type, "video")
    assert.equal(cpr.phone.back.type, "video")
    assert.notEqual(cpr.desktop[0].src, cpr.phone.front.src)
    assert.notEqual(cpr.phone.front.src, cpr.phone.back.src)
    assert.notEqual(cpr.phone.front.poster, cpr.phone.back.src)
    // The three homepage views are genuinely different clips with their own stills.
    assert.deepEqual(
        cpr.desktop.map(({ label }) => label),
        ["Homepage", "Conditions", "Science"],
    )
    assert.equal(new Set(cpr.desktop.map(({ src }) => src)).size, 3)
    assert.deepEqual(
        cpr.desktop.map(({ poster }) => poster),
        [
            "/images/chronic-pain-recovery/home.webp",
            "/images/chronic-pain-recovery/conditions.webp",
            "/images/chronic-pain-recovery/science.webp",
        ],
    )
    assert.equal(nibbles.desktop.length, 1)
    assert.equal(nibbles.desktop[0].type, "video")
    assert.equal(
        nibbles.desktop[0].src,
        "/images/nibbles-with-nifa/nwn-des-1.mp4",
    )
    assert.equal(nibbles.phone.front.type, "video")
    assert.equal(
        nibbles.phone.front.src,
        "/images/nibbles-with-nifa/nwn-mb-1.mp4",
    )
    assert.equal(
        nibbles.phone.front.poster,
        "/images/nibbles-with-nifa/nwn-mb-sc-1.png",
    )
    assert.equal(
        nibbles.phone.back.src,
        implementedPortfolioProjects[1].cover.src,
    )
    // The project pages show real product media only. The architecture
    // diagrams stay on the /work case studies.
    for (const project of [nibbles, waxlist]) {
        for (const media of project.desktop) {
            assert.doesNotMatch(media.src, /\.svg$/)
        }
    }
    // Waxlist cycles the homepage, collection and privacy clips, with the two
    // new clips after the landing view.
    assert.deepEqual(
        waxlist.desktop.map(({ src }) => src),
        [
            "/images/waxlist/waxlist-1.mp4",
            "/images/waxlist/waxlist-4.mp4",
            "/images/waxlist/waxlist-3.mp4",
        ],
    )
    assert.deepEqual(
        waxlist.desktop.map(({ label }) => label),
        ["Homepage", "Collection", "Privacy"],
    )
    assert.equal(waxlist.phone.front.type, "image")
    for (const media of [
        ...cpr.desktop,
        cpr.phone.front,
        cpr.phone.back,
        ...nibbles.desktop,
        nibbles.phone.front,
        nibbles.phone.back,
        ...waxlist.desktop,
        waxlist.phone.front,
        waxlist.phone.back,
    ]) {
        for (const path of [media.src, media.poster].filter(Boolean)) {
            assert.ok(
                (await readFile(new URL(`../public${path}`, import.meta.url)))
                    .length > 0,
            )
        }
    }
})

test("desktop showcase follows the reference device proportions", async () => {
    const css = await readFile(
        new URL("../app/redesign/preview.css", import.meta.url),
        "utf8",
    )
    // sebg.ch's tour, measured at 1440x900: the frame keeps 7/8 of the column,
    // the phone 2/7 of the frame plus gutter, overhangs the frame's inner edge
    // by 1/7, and its foot hangs a quarter of the frame height below the frame.
    for (const marker of [
        /--showcase-frame: 87\.5%/,
        /--showcase-inset: 12\.5%/,
        /--showcase-phone: 23\.4%/,
        /--showcase-overhang: 12\.83%/,
        /width: var\(--showcase-phone\)/,
        /padding-bottom: var\(--showcase-hang/,
    ])
        assert.match(css, marker)
    assert.match(
        css,
        /left: calc\(var\(--showcase-inset\) - var\(--showcase-overhang\)\)/,
    )
    assert.match(
        css,
        /right: calc\(var\(--showcase-inset\) - var\(--showcase-overhang\)\)/,
    )
    const presentation = await readFile(
        new URL("../app/redesign/ProjectPresentations.tsx", import.meta.url),
        "utf8",
    )
    assert.match(
        presentation,
        /frame\.getBoundingClientRect\(\)\.height \* 0\.25/,
    )
    assert.match(presentation, /new ResizeObserver\(measureHang\)/)
    assert.match(presentation, /observer\.disconnect\(\)/)
    // The showcase spans the padded section like sebg.ch's tour, so large
    // screens keep the reference's share of the viewport.
    assert.match(presentation, /className="preview-stage mx-auto"/)
    assert.doesNotMatch(presentation, /preview-stage mx-auto max-w-/)
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
    assert.equal(progress(0).bubbles[0], 0)
    assert.equal(progress(0.0375).bubbles[0], 0.5)
    assert.equal(progress(0.075).bubbles[0], 1)
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

test("the badge blend clamps and only resets the pose when it re-enters", async () => {
    const modulePath = "../public/frog-mascot/src/frog-mascot.js"
    const { FrogMascot } = await import(modulePath)
    const applied: string[] = []
    const frog = {
        badgeMix: 0,
        badgeOn: false,
        opts: {} as { badge?: boolean },
        applyBadge() {
            applied.push("apply")
        },
    }
    const setMix = FrogMascot.prototype.setBadgeMix
    setMix.call(frog, 0.35)
    assert.equal(frog.badgeMix, 0.35)
    assert.equal(frog.badgeOn, true)
    assert.equal(frog.opts.badge, false)
    assert.deepEqual(applied, ["apply"])
    setMix.call(frog, 1)
    assert.equal(frog.badgeMix, 1)
    assert.equal(frog.opts.badge, true)
    assert.deepEqual(applied, ["apply"])
    setMix.call(frog, 0)
    assert.equal(frog.badgeMix, 0)
    assert.equal(frog.badgeOn, false)
    setMix.call(frog, 4)
    assert.equal(frog.badgeMix, 1)
    assert.deepEqual(applied, ["apply", "apply"])
    setMix.call(frog, -2)
    assert.equal(frog.badgeMix, 0)
    setMix.call(frog, Number.NaN)
    assert.equal(frog.badgeMix, 0)
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

test("the docked badge speaks its own All Work lines without repeats", async () => {
    const { allWorkDialogue, pickAllWorkDialogue } =
        await import("../app/redesign/frogDialogue")
    assert.ok(allWorkDialogue.length >= 4)
    assert.equal(new Set(allWorkDialogue).size, allWorkDialogue.length)
    for (const line of allWorkDialogue) {
        assert.match(line, /^[A-Z]/, `${line} should start a sentence`)
        assert.match(line, /[.!?]$/, `${line} should end a sentence`)
        assert.doesNotMatch(line, /[\u2013\u2014]/, `${line} has a dash`)
        assert.ok(line.length <= 80, `${line} is too long for the bubble`)
    }
    // Every value in 0..1 reaches exactly one line, in order.
    assert.deepEqual(
        allWorkDialogue.map((_, index) =>
            pickAllWorkDialogue("", index / allWorkDialogue.length),
        ),
        allWorkDialogue,
    )
    let previous = ""
    const seen = new Set<string>()
    for (let index = 0; index < 24; index++) {
        const next = pickAllWorkDialogue(previous, (index % 9) / 9 + 0.01)
        assert.ok(allWorkDialogue.includes(next))
        assert.notEqual(next, previous)
        seen.add(next)
        previous = next
    }
    assert.ok(seen.size > 1, "the badge should rotate its lines")
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
    assert.equal(progress(0).bubbles[0], 0)
    assert.equal(progress(0.01).bubbles[0], 0.5)
    assert.equal(progress(0.02).bubbles[0], 1)
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
    // Desktop tucks the flag in so it clears the About paragraph.
    assert.match(flag, /lg:right-\[-6%\]/)
    const presentation = await readFile(
        new URL("../app/redesign/FrogPresentation.tsx", import.meta.url),
        "utf8",
    )
    assert.match(presentation, /const flagOpacity = aboutFlagOpacity\({/)
    assert.match(presentation, /introTop: introRect\.top/)
    assert.match(presentation, /introBottom: introRect\.bottom/)
    assert.match(presentation, /cornerIndex: corner\.index/)
    assert.match(presentation, /flag\.style\.opacity = String\(flagOpacity\)/)
    assert.match(
        presentation,
        /flag\.dataset\.visible = String\(flagOpacity > 0\)/,
    )
    const flagSource = await readFile(
        new URL("../app/redesign/FrogFlag.tsx", import.meta.url),
        "utf8",
    )
    assert.match(flagSource, /animate-flag-wave/)
    assert.match(flagSource, /\[animation-play-state:paused\]/)
    assert.match(
        flagSource,
        /group-data-\[visible=true\]\/flag:\[animation-play-state:running\]/,
    )
    assert.match(flagSource, /motion-reduce:animate-none/)
    const config = await readFile(
        new URL("../tailwind.config.ts", import.meta.url),
        "utf8",
    )
    assert.match(config, /flagWave:/)
})

test("about flag follows About on desktop and the corner frog on mobile", () => {
    const desktop = {
        aboutActive: true,
        introTop: 0,
        introBottom: 1000,
        viewportHeight: 1000,
        cornerActive: false,
        cornerIndex: 1,
        cornerSpeech: 1,
        reduced: false,
    }
    assert.equal(aboutFlagOpacity(desktop), 1)
    // Desktop fades the flag in over the last fifth of the approach.
    assert.equal(aboutFlagOpacity({ ...desktop, introTop: 100 }), 0.5)
    assert.equal(aboutFlagOpacity({ ...desktop, introTop: 200 }), 0)
    assert.equal(aboutFlagOpacity({ ...desktop, introTop: 250 }), 0)
    // The flag fades out over the first quarter of the next section's entry.
    assert.equal(aboutFlagOpacity({ ...desktop, introBottom: 875 }), 0.5)
    assert.equal(aboutFlagOpacity({ ...desktop, introBottom: 750 }), 0)
    assert.equal(aboutFlagOpacity({ ...desktop, introBottom: 700 }), 0)
    assert.equal(aboutFlagOpacity({ ...desktop, aboutActive: false }), 0)
    assert.equal(aboutFlagOpacity({ ...desktop, reduced: true }), 0)
    // Mobile keeps the corner-speech contract and ignores the desktop offsets.
    const mobile = {
        ...desktop,
        introTop: 240,
        introBottom: 760,
        cornerActive: true,
        cornerSpeech: 0.4,
    }
    assert.equal(aboutFlagOpacity(mobile), 0.4)
    assert.equal(aboutFlagOpacity({ ...mobile, cornerIndex: 0 }), 0)
    assert.equal(aboutFlagOpacity({ ...mobile, cornerIndex: 2 }), 0)
})

test("responsive stages size devices before falling back to document flow", async () => {
    const { responsiveStageSize: size } =
        await import("../app/redesign/projectPresentationData")
    // Bubbles overlay devices; the 425px layout reserves the full-body frog.
    const frogHeight = Math.round(425 * 0.68 * (291 / 273))
    assert.equal(size(715, 96, frogHeight, 64), 247)
    assert.equal(size(600, 96, frogHeight, 64), null)
    assert.equal(size(600, 100, 256, 64), 180)
    assert.equal(size(599.9, 100, 256, 64), null)
    assert.equal(size(1000, 100, 256, 64), 345)
    assert.equal(size(390, 96, 365, 64), null)
    // Chrome measurements at 401 x 715 before adaptive sizing.
    assert.equal(size(715, 96, 364.527, 64), 190.473)
    assert.equal(size(715, 50, 364.527, 64), 236.473)
    assert.equal(size(844, 96, 365, 64), 319)
    assert.equal(size(874, 96, 365, 64), 345)
    // Font wrapping or a larger safe-area reservation can force flow again.
    assert.equal(size(715, 120, 365, 64), null)
    assert.equal(size(715, 96, 390, 64), null)
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

test("the project hero reveal hands the cover back to the real image", async () => {
    const reveal = await readFile(
        new URL("../app/redesign/PixelReveal.tsx", import.meta.url),
        "utf8",
    )

    // The ready utility outranks the completed utility, so completion has to
    // clear the ready flag or the pixel canvas covers the hero indefinitely.
    assert.match(reveal, /canvas\.dataset\.pixelComplete = "true"/)
    assert.match(reveal, /delete host\.dataset\.pixelReady/)
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
        "case-dialogue-shadow",
        'ease: "power2.in"',
    ]) {
        assert.ok(frog.includes(marker), `missing ${marker}`)
    }

    const css = await readFile(
        new URL("../app/redesign/preview.css", import.meta.url),
        "utf8",
    )
    assert.match(css, /\.case-dialogue \{/)
    assert.match(
        css,
        /\.case-frog\[data-frog-ready="true"\] \.case-frog-fallback/,
    )
    // Desktop restores the preview's corner scale; phones keep the reduction.
    assert.match(
        css,
        /@media \(min-width: 1024px\) \{\s*\.case-frog \{\s*--case-frog-size: clamp\(240px, 23vw, 340px\);/,
    )
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
        "WordReveal",
        "data-project-hero={project.slug}",
        "pairMedia.map",
        "const pairMedia =",
        "const wideMedia",
        "desktopMedia?.[1]",
        "preview.personal",
        "data-project-cover={nextProject.slug}",
    ]) {
        assert.ok(page.includes(marker), `missing ${marker}`)
    }

    // The project pages keep real product media and no longer fall back to the
    // architecture diagrams or end on a separate walkthrough clip.
    assert.doesNotMatch(page, /project\.evidence/)
    assert.doesNotMatch(page, /project-clip/)
    assert.doesNotMatch(page, /leadShot|pairShots|PixelDevelop/)

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
        "conic-gradient",
        "max-w-[62%]",
        "group/media",
        "text-ellipsis",
    ]) {
        assert.ok(frame.includes(marker), `missing ${marker}`)
    }
})

test("every project page section keeps the faint grid", async () => {
    const page = await readFile(
        new URL("../app/redesign/ProjectCase.tsx", import.meta.url),
        "utf8",
    )

    // The tinted header already carried the reference's 80px grid; every
    // section below it must carry the same faint line colour.
    const header = page.match(/<header\b[^>]*>/)?.[0] ?? ""
    assert.ok(header.includes("grid-paper"), "header lost its grid")
    assert.ok(
        header.includes("[--grid-line:#0b0b0c0a]"),
        "header lost its grid line colour",
    )

    const sections = page.match(/<section\b[^>]*>/g) ?? []
    assert.equal(sections.length, 3)
    for (const section of sections) {
        assert.ok(section.includes("grid-paper"), "section lost its grid")
        assert.ok(
            section.includes("[--grid-line:#0b0b0c0a]"),
            "section lost its grid line colour",
        )
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

    const caseSource = await readFile(
        new URL("../app/redesign/ProjectCase.tsx", import.meta.url),
        "utf8",
    )
    // Phones read body copy at one size, whatever the block.
    assert.equal(caseSource.match(/max-md:text-xl/g)?.length, 4)
    assert.doesNotMatch(caseSource, /caseClipNote/)
})

test("project pages carry a personal note and reveal it promptly", async () => {
    const { projectPreviewCopy } =
        await import("../app/redesign/projectDetailData")
    for (const copy of Object.values(projectPreviewCopy)) {
        assert.ok(copy.personal.heading.length > 0)
        assert.ok(copy.personal.body.length > 0)
        assert.doesNotMatch(copy.personal.body, /—/)
    }

    const { wordRevealOpacity, wordRevealProgress } =
        await import("../app/redesign/wordRevealTiming")
    const viewport = 900
    // The reveal starts as the paragraph reaches the viewport bottom.
    assert.equal(wordRevealProgress(viewport, viewport), 0)
    // It completes before the paragraph reaches the middle of the viewport.
    assert.ok(wordRevealProgress(viewport * 0.55, viewport) >= 0.999)
    assert.ok(wordRevealProgress(viewport * 0.75, viewport) > 0.5)
    // Words start faint rather than invisible, and the last one reaches full
    // strength by the end of the travel.
    assert.equal(wordRevealOpacity(0, 40, 0), 0.12)
    assert.ok(wordRevealOpacity(1, 40, 39) >= 0.999)
    assert.ok(wordRevealOpacity(0.5, 40, 10) > 0.12)
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
        new URL("../app/redesign/preview.css", import.meta.url),
        "utf8",
    )
    assert.match(css, /\.case-dialogue-shadow \{/)
    assert.match(css, /\.case-dialogue-pixels \{/)
    assert.match(css, /conic-gradient\(\s*#0b0b0c 25%/)
})

test("showcase speech rises into and out of each held beat", async () => {
    const { presentationProgress, responsivePresentationProgress } =
        await import("../app/redesign/projectPresentationData")
    for (const [progress, beats] of [
        [
            presentationProgress,
            [
                [0, 0.075, 0.25, 0.325],
                [0.325, 0.4, 0.65, 0.725],
                [0.725, 0.8, 0.92, 1],
            ],
        ],
        [
            responsivePresentationProgress,
            [
                [0, 0.02, 0.16, 0.18],
                [0.18, 0.2, 0.36, 0.38],
                [0.38, 0.4, 0.96, 1],
            ],
        ],
    ] as const) {
        beats.forEach(([start, entered, leaving, end], index) => {
            assert.ok(Math.abs(progress(start).bubbleY[index] - 20) < 1e-8)
            assert.ok(Math.abs(progress(entered).bubbleY[index]) < 1e-8)
            assert.ok(Math.abs(progress(leaving).bubbleY[index]) < 1e-8)
            assert.ok(Math.abs(progress(end).bubbleY[index] + 20) < 1e-8)
            const entry = progress((start + entered) / 2)
            const exit = progress((leaving + end) / 2)
            assert.ok(Math.abs(entry.bubbles[index] - 0.5) < 1e-8)
            assert.ok(Math.abs(exit.bubbles[index] - 0.5) < 1e-8)
            assert.ok(entry.bubbleY[index] > 0)
            assert.ok(exit.bubbleY[index] < 0)
        })
    }
})
