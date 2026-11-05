"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createPixelatedImageCanvas, pixelCrossfade } from "./pixelDither"
import {
    floodGeometry,
    isElementVisible,
    projectCoverSelector,
    projectHeroSelector,
    projectIndexSelector,
    projectPageSelector,
    type FloodGeometry,
} from "./projectNavigation"

type Direction = "open" | "close"

type Navigation = {
    href: string
    slug: string
    direction: Direction
    tint: string
    link: HTMLAnchorElement
}

type CoverClone = {
    element: HTMLDivElement
    pixelLayer: HTMLCanvasElement | null
    pixelFrom: number
    pixelTo: number
}

type PageGhost = {
    element: HTMLDivElement
    startClip: string
    endClip: string
}

const GHOST_CLIP_MS = 900
const COVER_MORPH_MS = 900
const COVER_FADE_MS = 200
const DESTINATION_TIMEOUT_MS = 3000
const IMAGE_TIMEOUT_MS = 1200
const PIXEL_TIMEOUT_MS = 900
const GHOST_EASING = "cubic-bezier(0.65, 0, 0.35, 1)"
const COVER_EASING = "cubic-bezier(0.87, 0, 0.13, 1)"

function nextFrame() {
    return new Promise<void>((resolve) =>
        window.requestAnimationFrame(() => resolve()),
    )
}

function waitForElement(selector: string, timeout: number) {
    return new Promise<HTMLElement | null>((resolve) => {
        const started = performance.now()
        const check = () => {
            const element = document.querySelector<HTMLElement>(selector)
            if (element) {
                resolve(element)
                return
            }
            if (performance.now() - started >= timeout) {
                resolve(null)
                return
            }
            window.requestAnimationFrame(check)
        }
        check()
    })
}

function waitForPixelReady(element: HTMLElement, timeout: number) {
    if (element.dataset.pixelReady === "true") return Promise.resolve()

    return new Promise<void>((resolve) => {
        const started = performance.now()
        const check = () => {
            if (
                element.dataset.pixelReady === "true" ||
                performance.now() - started >= timeout
            ) {
                resolve()
                return
            }
            window.requestAnimationFrame(check)
        }
        check()
    })
}

async function play(
    element: HTMLElement,
    keyframes: Keyframe[],
    options: KeyframeAnimationOptions,
) {
    const animation = element.animate(keyframes, {
        fill: "forwards",
        ...options,
    })
    try {
        await animation.finished
    } catch {
        // A cancelled animation still leaves the transition cleanup to run.
    }
}

async function settleImage(element: HTMLElement) {
    const image =
        element instanceof HTMLImageElement
            ? element
            : element.querySelector<HTMLImageElement>("img")
    if (!image || (image.complete && image.naturalWidth > 0)) return

    await Promise.race([
        image.decode().catch(() => undefined),
        new Promise((resolve) => window.setTimeout(resolve, IMAGE_TIMEOUT_MS)),
    ])
}

function scrollInstantly(top: number) {
    const root = document.documentElement
    const previous = root.style.scrollBehavior
    root.style.scrollBehavior = "auto"
    window.scrollTo(0, top)
    root.style.scrollBehavior = previous
}

function visibleFrogRect(viewport: { width: number; height: number }) {
    const candidates = [
        document.querySelector<HTMLElement>("[data-frog-layer]"),
        ...Array.from(
            document.querySelectorAll<HTMLElement>("[data-frog-slot]"),
        ),
    ]

    for (const candidate of candidates) {
        if (candidate && isElementVisible(candidate, viewport)) {
            return candidate.getBoundingClientRect()
        }
    }

    return null
}

function clipAt(geometry: FloodGeometry, radius: number) {
    return `circle(${radius}px at ${geometry.x}px ${geometry.y}px)`
}

// The reference keeps the outgoing page on top and clips it away towards the
// mascot late in the transition, instead of covering it with a tint first. A
// clone of the page reproduces that: the real route can swap underneath while
// the reader still sees the page they clicked from.
function createPageGhost(geometry: FloodGeometry): PageGhost | null {
    const main = document.querySelector<HTMLElement>("main")
    const footer = document.querySelector<HTMLElement>("footer")
    if (!main && !footer) return null

    const page = document.querySelector<HTMLElement>("[data-redesign]")
    const background =
        (page && getComputedStyle(page).backgroundColor) ||
        getComputedStyle(document.body).backgroundColor
    const ghost = document.createElement("div")
    // The clone lives outside the page root, so it carries the root class to
    // keep the same font, palette and selection colours as the page it copies.
    ghost.className = "preview-root"
    ghost.dataset.redesign = ""
    ghost.dataset.transitionGhost = "true"
    ghost.setAttribute("aria-hidden", "true")
    ghost.style.cssText = [
        "position:fixed",
        "inset:0",
        "z-index:2147483000",
        "overflow:hidden",
        "pointer-events:none",
        `background:${background}`,
        `clip-path:${clipAt(geometry, geometry.to)}`,
        "will-change:clip-path",
    ].join(";")

    const layer = document.createElement("div")
    layer.style.cssText = `position:absolute;left:0;top:${-window.scrollY}px;width:100%`

    for (const node of [main, footer]) {
        if (!node) continue

        const clone = node.cloneNode(true) as HTMLElement
        clone.removeAttribute("id")
        clone.querySelectorAll("[id]").forEach((element) => {
            element.removeAttribute("id")
        })
        clone.querySelectorAll("canvas").forEach((element) => element.remove())
        clone.querySelectorAll<HTMLVideoElement>("video").forEach((video) => {
            const poster = video.getAttribute("poster")
            const image = document.createElement("img")
            if (poster) image.src = poster
            image.alt = ""
            image.style.cssText =
                "display:block;width:100%;height:auto;aspect-ratio:16/9;object-fit:cover;background:#0b0b0c"
            video.replaceWith(image)
        })
        clone
            .querySelectorAll<HTMLElement>("[data-case-reveal]")
            .forEach((element) => element.setAttribute("data-visible", "true"))
        clone.setAttribute("inert", "")
        clone.setAttribute("aria-hidden", "true")
        layer.append(clone)
    }

    ghost.append(layer)
    document.body.append(ghost)

    return {
        element: ghost,
        startClip: clipAt(geometry, geometry.to),
        endClip: clipAt(geometry, 0),
    }
}

function coverForLink(link: HTMLAnchorElement, slug: string) {
    const withinLink = link.querySelector<HTMLElement>(
        projectCoverSelector(slug),
    )
    if (withinLink) return withinLink

    const withinSection = link
        .closest<HTMLElement>("[data-project]")
        ?.querySelector<HTMLElement>(projectCoverSelector(slug))
    if (withinSection) return withinSection

    return document.querySelector<HTMLElement>(projectCoverSelector(slug))
}

async function createCoverClone(
    source: HTMLElement,
    rect: DOMRect,
    direction: Direction,
    tint: string,
): Promise<CoverClone | null> {
    const image =
        source instanceof HTMLImageElement
            ? source
            : source.querySelector<HTMLImageElement>("img")
    if (!image) return null

    await settleImage(source)

    const clone = document.createElement("div")
    clone.style.cssText = [
        "position:fixed",
        "z-index:2147483001",
        "overflow:hidden",
        "pointer-events:none",
        "background:#0b0b0c",
        `left:${rect.left}px`,
        `top:${rect.top}px`,
        `width:${rect.width}px`,
        `height:${rect.height}px`,
    ].join(";")

    const copy = document.createElement("img")
    copy.src = image.currentSrc || image.src
    copy.alt = ""
    copy.style.cssText =
        "display:block;width:100%;height:100%;object-fit:cover;object-position:top"
    clone.append(copy)

    const crossfade = pixelCrossfade(direction)
    const pixelLayer = createPixelatedImageCanvas(
        image,
        tint,
        rect.width,
        rect.height,
        {
            devicePixelRatio: window.devicePixelRatio,
            narrow: window.innerWidth < 768,
        },
    )

    if (pixelLayer) {
        pixelLayer.style.cssText = [
            "position:absolute",
            "inset:0",
            "width:100%",
            "height:100%",
            "object-fit:cover",
            "image-rendering:pixelated",
            "pointer-events:none",
            `opacity:${crossfade.from}`,
        ].join(";")
        clone.append(pixelLayer)
    }

    clone.setAttribute("aria-hidden", "true")
    document.body.append(clone)

    return {
        element: clone,
        pixelLayer,
        pixelFrom: crossfade.from,
        pixelTo: crossfade.to,
    }
}

function radiusFor(element: HTMLElement) {
    const frame = element.closest("figure")
    return getComputedStyle(frame ?? element).borderRadius
}

function markWorkTransition(link: HTMLAnchorElement, active: boolean) {
    const section = link.closest<HTMLElement>("#work")
    if (!section) return null

    const card = link.closest<HTMLElement>("[data-work-card]")

    if (active) {
        section.dataset.transitioning = "true"
        card?.setAttribute("data-active", "true")
    } else {
        delete section.dataset.transitioning
        card?.removeAttribute("data-active")
    }

    return section
}

function announce(direction: Direction) {
    const status = document.getElementById("redesign-route-status")
    if (!status) return

    const title = document
        .querySelector<HTMLElement>("#project-main h1")
        ?.textContent?.trim()

    status.textContent =
        direction === "open"
            ? `Opened ${title || "project"}.`
            : "Returned to all work."
}

function focusDestination(direction: Direction, slug: string) {
    if (direction === "open") {
        document.getElementById("project-main")?.focus({ preventScroll: true })
        return
    }

    document
        .querySelector<HTMLElement>(
            `[data-project-index] a[data-project-link][data-project-slug="${slug}"]`,
        )
        ?.focus({ preventScroll: true })
}

export default function ProjectTransition() {
    const router = useRouter()

    useEffect(() => {
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
        const root = document.documentElement
        let running = false

        const navigate = async ({
            href,
            slug,
            direction,
            tint,
            link,
        }: Navigation) => {
            running = true
            const viewport = {
                width: window.innerWidth,
                height: window.innerHeight,
            }
            const source =
                direction === "open"
                    ? coverForLink(link, slug)
                    : document.querySelector<HTMLElement>(
                          projectHeroSelector(slug),
                      )
            const sourceRect =
                source && isElementVisible(source, viewport)
                    ? source.getBoundingClientRect()
                    : null
            const destinationSelector =
                direction === "open"
                    ? `${projectPageSelector(slug)} ${projectHeroSelector(slug)}`
                    : projectIndexSelector(slug)
            const geometry = floodGeometry(visibleFrogRect(viewport), viewport)
            const ghost = createPageGhost(geometry)
            const previousOverflow = root.style.overflow
            let clone: CoverClone | null = null
            let destination: HTMLElement | null = null

            if (!ghost) {
                // Without a page to hold on screen the transition has nothing to
                // show, so let the router navigate normally.
                running = false
                return
            }

            try {
                if (direction === "open") markWorkTransition(link, true)

                clone =
                    source && sourceRect
                        ? await createCoverClone(
                              source,
                              sourceRect,
                              direction,
                              tint,
                          )
                        : null

                root.style.overflow = "hidden"
                router.push(href)

                destination = await waitForElement(
                    destinationSelector,
                    DESTINATION_TIMEOUT_MS,
                )
                if (!destination) return

                if (direction === "close") {
                    const rect = destination.getBoundingClientRect()
                    scrollInstantly(
                        rect.top +
                            window.scrollY -
                            (window.innerHeight - rect.height) / 2,
                    )
                } else {
                    scrollInstantly(0)
                }

                await nextFrame()
                await nextFrame()
                await settleImage(destination)
                if (direction === "close") {
                    await waitForPixelReady(destination, PIXEL_TIMEOUT_MS)
                }

                // The outgoing page stays visible for the whole clip, so it is
                // the last thing to leave the screen.
                const ghostClip = play(
                    ghost.element,
                    [
                        { clipPath: ghost.startClip },
                        { clipPath: ghost.endClip },
                    ],
                    { duration: GHOST_CLIP_MS, easing: GHOST_EASING },
                )

                let coverMorph: Promise<void> = Promise.resolve()
                if (
                    clone &&
                    sourceRect &&
                    source &&
                    destination &&
                    isElementVisible(destination, viewport)
                ) {
                    const target = destination.getBoundingClientRect()
                    destination.style.visibility = "hidden"

                    const morph = play(
                        clone.element,
                        [
                            {
                                left: `${sourceRect.left}px`,
                                top: `${sourceRect.top}px`,
                                width: `${sourceRect.width}px`,
                                height: `${sourceRect.height}px`,
                                borderRadius: radiusFor(source),
                            },
                            {
                                left: `${target.left}px`,
                                top: `${target.top}px`,
                                width: `${target.width}px`,
                                height: `${target.height}px`,
                                borderRadius: radiusFor(destination),
                            },
                        ],
                        { duration: COVER_MORPH_MS, easing: COVER_EASING },
                    )
                    const pixelFade = clone.pixelLayer
                        ? play(
                              clone.pixelLayer,
                              [
                                  { opacity: clone.pixelFrom },
                                  { opacity: clone.pixelTo },
                              ],
                              {
                                  duration: COVER_MORPH_MS,
                                  easing: COVER_EASING,
                              },
                          )
                        : Promise.resolve()

                    coverMorph = Promise.all([morph, pixelFade]).then(
                        () => undefined,
                    )
                }

                await Promise.all([ghostClip, coverMorph])

                if (destination) destination.style.visibility = ""
                if (clone) {
                    await play(
                        clone.element,
                        [{ opacity: 1 }, { opacity: 0 }],
                        { duration: COVER_FADE_MS, easing: "ease-out" },
                    )
                }
            } catch {
                // Navigation has already started; cleanup still restores the page.
            } finally {
                clone?.element.remove()
                ghost.element.remove()
                if (source && source.isConnected) {
                    source.style.visibility = ""
                }
                if (destination) destination.style.visibility = ""
                if (direction === "open") markWorkTransition(link, false)

                root.style.overflow = previousOverflow

                running = false
                window.dispatchEvent(new Event("redesign:transition-end"))
                announce(direction)
                window.requestAnimationFrame(() =>
                    focusDestination(direction, slug),
                )
            }
        }

        const onClick = (event: MouseEvent) => {
            if (running || event.defaultPrevented || event.button !== 0) return
            if (
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey
            )
                return

            const target = event.target
            if (!(target instanceof Element)) return

            const link = target.closest<HTMLAnchorElement>(
                "a[data-project-link]",
            )
            if (
                !link ||
                link.target === "_blank" ||
                link.hasAttribute("download")
            )
                return

            const href = link.getAttribute("href")
            const slug = link.dataset.projectSlug
            if (!href || !slug || !href.startsWith("/")) return
            if (reduced.matches) return
            if (href === window.location.pathname) return

            const direction: Direction =
                link.dataset.projectDirection === "close" ? "close" : "open"

            event.preventDefault()
            event.stopPropagation()
            void navigate({
                href,
                slug,
                direction,
                tint: link.dataset.projectTint || "#fbfbf8",
                link,
            })
        }

        document.addEventListener("click", onClick, true)
        return () => document.removeEventListener("click", onClick, true)
    }, [router])

    return null
}
