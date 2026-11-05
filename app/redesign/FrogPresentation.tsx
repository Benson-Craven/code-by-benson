"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import Lenis from "lenis"
import "lenis/dist/lenis.css"
import { createFrog, loadFrog, type FrogInstance } from "./frogAdapter"
import {
    frogPlacement,
    cornerFrogPlacement,
    shouldRenderFrog,
    type FrogAnchor,
} from "./frogPlacement"
import {
    heldPresentationQuery,
    presentationProgress,
    responsivePresentationProgress,
} from "./projectPresentationData"
import styles from "./redesign.module.css"
import { foodTreatment, heartTreatment, frogTrick } from "./frogTreatment"
import FrogFood from "./FrogFood"
import FrogFlag from "./FrogFlag"
import { pickFooterDialogue } from "./frogDialogue"

export default function FrogPresentation() {
    const layerRef = useRef<HTMLDivElement>(null)
    const hostRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const layer = layerRef.current!
        const host = hostRef.current!
        const hearts = Array.from(
            layer.querySelectorAll<SVGSVGElement>("[data-frog-heart]"),
        )
        const foods = Array.from(
            layer.querySelectorAll<SVGSVGElement>("[data-frog-food]"),
        )
        const root = layer.closest<HTMLElement>("[data-redesign]")!
        const slots = Array.from(
            root.querySelectorAll<HTMLElement>("[data-frog-slot]"),
        )
        const sections = Array.from(
            root.querySelectorAll<HTMLElement>("[data-frog-section]"),
        )
        const button =
            root.querySelector<HTMLButtonElement>("[data-frog-trick]")!
        const footer = sections[sections.length - 1]
        const artwork = root.querySelector<SVGSVGElement>(
            "[data-frog-trick-art]",
        )!
        const firefly = artwork.querySelector<SVGGElement>("[data-firefly]")!
        const tongues = Array.from(
            artwork.querySelectorAll<SVGPathElement>("[data-frog-tongue]"),
        )
        const status = root.querySelector<HTMLElement>(
            "[data-frog-trick-status]",
        )!
        const setMessage = (text: string) => {
            status.textContent = text
        }
        const dialogue = root.querySelector<HTMLElement>(
            "[data-frog-dialogue]",
        )!
        let dialogueTimer: ReturnType<typeof setTimeout> | undefined
        let dialogueActive = false
        let previousDialogue = ""
        function clearDialogue() {
            clearTimeout(dialogueTimer)
            gsap.killTweensOf(dialogue)
            dialogueTimer = undefined
            dialogue.textContent = ""
            dialogue.hidden = true
        }
        function scheduleDialogue() {
            if (!dialogueActive || dialogueTimer !== undefined) return
            dialogueTimer = setTimeout(
                () => {
                    dialogueTimer = undefined
                    if (!dialogueActive) return
                    if (busy) {
                        scheduleDialogue()
                        return
                    }
                    previousDialogue = pickFooterDialogue(previousDialogue)
                    dialogue.textContent = previousDialogue
                    dialogue.hidden = false
                    gsap.fromTo(
                        dialogue,
                        { opacity: 0, y: 14 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.35,
                            ease: "power2.out",
                            overwrite: true,
                        },
                    )
                    frog?.talk(2.2)
                    dialogueTimer = setTimeout(() => {
                        gsap.to(dialogue, {
                            opacity: 0,
                            y: 14,
                            duration: 0.35,
                            ease: "power2.in",
                            overwrite: true,
                            onComplete: () => {
                                clearDialogue()
                                scheduleDialogue()
                            },
                        })
                    }, 5500)
                },
                4000 + Math.random() * 8000,
            )
        }
        function updateDialogue(running: boolean) {
            const rect = slots[slots.length - 1].getBoundingClientRect()
            dialogueActive = Boolean(
                running &&
                frog &&
                !failed &&
                !reduced.matches &&
                !document.hidden &&
                (narrow.matches
                    ? footer.getBoundingClientRect().top <= innerHeight * 0.75
                    : rect.top >= 80 && rect.top < innerHeight * 0.8),
            )
            if (dialogueActive) scheduleDialogue()
            else clearDialogue()
        }
        let footerSeen = false
        let clicks = 0
        let busy = false
        let caught = false
        const catchState = { reach: 0, returning: false }
        const flight = { x: 78, y: 23 }
        let flightTween: gsap.core.Tween | undefined
        const reduced = matchMedia("(prefers-reduced-motion: reduce)")
        const desktop = matchMedia("(min-width: 1024px) and (pointer: fine)")
        const narrow = matchMedia("(max-width: 1023px)")
        const held = matchMedia(heldPresentationQuery)
        const greeting = root.querySelector<HTMLElement>(
            "[data-frog-greeting]",
        )!
        const flag = root.querySelector<HTMLElement>("[data-frog-flag]")!
        let leftTop = false
        let returned = false
        let spokenBeat = ""
        let frog: FrogInstance | undefined
        let lenis: Lenis | undefined
        let anchors: FrogAnchor[] = []
        let disposed = false
        let failed = false
        let loading = false
        let hop: gsap.core.Timeline | undefined
        let aboutAnimation: gsap.core.Timeline | undefined
        const originalScrollBehavior =
            document.documentElement.style.scrollBehavior
        document.documentElement.style.scrollBehavior = "auto"

        const tick = (time: number) => lenis?.raf(time * 1000)
        function smoothScroll() {
            gsap.ticker.remove(tick)
            lenis?.destroy()
            lenis = undefined
            if (desktop.matches && !reduced.matches && !document.hidden) {
                lenis = new Lenis({
                    autoRaf: false,
                    syncTouch: false,
                    anchors: true,
                })
                gsap.ticker.lagSmoothing(0)
                gsap.ticker.add(tick)
            }
        }
        function reactToScroll(
            running: boolean,
            corner: ReturnType<typeof cornerFrogPlacement>,
            cornerActive: boolean,
        ) {
            if (window.scrollY > sections[0].offsetHeight * 0.6) leftTop = true
            if (leftTop && window.scrollY <= 40 && !returned) {
                returned = true
                greeting.textContent = "Ready for another tour already?"
                spokenBeat = ""
            }
            const project = sections.find((section) => {
                const rect = section.getBoundingClientRect()
                return (
                    section.dataset.project &&
                    rect.top <= innerHeight * 0.35 &&
                    rect.bottom > innerHeight * 0.35
                )
            })
            const treatmentActive =
                running && project?.dataset.project === "chronic-pain-recovery"
            const projectRect = project?.getBoundingClientRect()
            const treatmentProgress =
                project && projectRect
                    ? held.matches && project.dataset.held === "true"
                        ? -projectRect.top /
                          Math.max(1, project.offsetHeight - innerHeight)
                        : (innerHeight * 0.35 - projectRect.top) /
                          project.offsetHeight
                    : 0
            hearts.forEach((heart, index) => {
                gsap.set(
                    heart,
                    treatmentActive
                        ? heartTreatment(treatmentProgress, index)
                        : { opacity: 0 },
                )
            })
            const firstBubble =
                project?.querySelector<HTMLElement>("[data-bubble]")
            const foodProgress =
                held.matches && project?.dataset.held === "true"
                    ? treatmentProgress
                    : firstBubble
                      ? 0.325 +
                        ((innerHeight * 0.65 -
                            firstBubble.getBoundingClientRect().bottom) /
                            innerHeight) *
                            0.325
                      : 0
            foods.forEach((food, index) => {
                gsap.set(
                    food,
                    running && project?.dataset.project === "nibbles-with-nifa"
                        ? foodTreatment(foodProgress, index)
                        : { opacity: 0 },
                )
            })
            let beat =
                window.scrollY <= 40 ? (returned ? "return" : "hello") : ""
            if (project) {
                const rect = project.getBoundingClientRect()
                const bubbles = Array.from(
                    project.querySelectorAll<HTMLElement>("[data-bubble]"),
                )
                let index = 0
                if (
                    (held.matches && project.dataset.held === "true") ||
                    project.dataset.responsive === "held"
                ) {
                    const progress = Math.max(
                        0,
                        Math.min(
                            1,
                            -rect.top /
                                Math.max(1, project.offsetHeight - innerHeight),
                        ),
                    )
                    const opacities = (
                        narrow.matches
                            ? responsivePresentationProgress(progress)
                            : presentationProgress(progress)
                    ).bubbles
                    index = opacities.findIndex((opacity) => opacity > 0.5)
                } else {
                    index = bubbles.reduce(
                        (best, bubble, i) =>
                            Math.abs(
                                bubble.getBoundingClientRect().top -
                                    innerHeight * 0.5,
                            ) <
                            Math.abs(
                                bubbles[best].getBoundingClientRect().top -
                                    innerHeight * 0.5,
                            )
                                ? i
                                : best,
                        0,
                    )
                }
                if (index >= 0) beat = `${project.dataset.project}-${index}`
            }
            const intro = root.querySelector<HTMLElement>("#intro")!
            const introRect = intro.getBoundingClientRect()
            const aboutActive =
                introRect.top <= innerHeight * 0.35 &&
                introRect.bottom > innerHeight * 0.35
            // Keep the planted flag with the intro only, never across travel.
            const flagOpacity =
                cornerActive && corner.index === 1 && aboutActive
                    ? corner.speech
                    : 0
            flag.style.opacity = String(flagOpacity)
            flag.dataset.visible = String(flagOpacity > 0)
            if (aboutActive && !project) beat = "about"
            const gazeTarget = project
                ? project.querySelector<HTMLElement>("[data-screen-strip]")
                : aboutActive
                  ? intro.querySelector<HTMLElement>("p")
                  : null
            if (gazeTarget) {
                const target = gazeTarget.getBoundingClientRect()
                const face = host.getBoundingClientRect()
                frog?.setAttention(
                    Math.max(
                        -1,
                        Math.min(
                            1,
                            (face.left +
                                face.width / 2 -
                                target.left -
                                target.width / 2) /
                                Math.max(face.width, 1),
                        ),
                    ),
                    project
                        ? -0.25
                        : Math.max(
                              -1,
                              Math.min(
                                  1,
                                  (target.top +
                                      target.height / 2 -
                                      face.top -
                                      face.height / 2) /
                                      Math.max(face.height, 1),
                              ),
                          ),
                )
            } else {
                frog?.setAttention(null)
            }
            if (beat !== "about" || reduced.matches || failed) {
                resetAboutAnimation()
            } else if (aboutAnimation) {
                if (running) aboutAnimation.resume()
                else aboutAnimation.pause()
            }
            // A beat fires once, even when many scroll events arrive during a hold.
            if (running && frog && beat && beat !== spokenBeat) {
                frog.talk(2.2)
                if (beat === "about") {
                    resetAboutAnimation()
                    aboutAnimation = gsap
                        .timeline()
                        .add(
                            gsap
                                .timeline({ repeat: 1, repeatDelay: 0.2 })
                                .to(host, {
                                    y: -64,
                                    duration: 0.26,
                                    ease: "power2.out",
                                })
                                .to(host, {
                                    y: 0,
                                    duration: 0.32,
                                    ease: "power2.in",
                                }),
                        )
                        .call(() => frog?.setSmiling(true), [], 2.2)
                        .call(() => frog?.setSmiling(false), [], 4.2)
                }
                spokenBeat = beat
            }
            if (!beat && !project) spokenBeat = ""
        }
        function resetAboutAnimation() {
            if (!aboutAnimation) return
            aboutAnimation.kill()
            aboutAnimation = undefined
            frog?.setSmiling(false)
            gsap.set(host, { y: 0 })
        }
        function drawCatch() {
            if (!frog) return
            const mouth = frog.mouthScreenPos()
            const hostRect = host.getBoundingClientRect()
            const artRect = artwork.getBoundingClientRect()
            if (!artRect.width || !artRect.height) return
            const x =
                ((hostRect.left + mouth.x - artRect.left) / artRect.width) * 100
            const y =
                ((hostRect.top + mouth.y - artRect.top) / artRect.height) * 105
            const tipX = x + (flight.x - x) * catchState.reach
            const tipY = y + (flight.y - y) * catchState.reach
            tongues.forEach((tongue) =>
                tongue.setAttribute(
                    "d",
                    catchState.reach > 0 ? `M${x} ${y}L${tipX} ${tipY}` : "",
                ),
            )
            if (catchState.returning)
                firefly.setAttribute("transform", `translate(${tipX} ${tipY})`)
        }
        function resetTrick() {
            hop?.kill()
            busy = false
            button.removeAttribute("aria-disabled")
            catchState.reach = 0
            tongues.forEach((tongue) => tongue.removeAttribute("d"))
            gsap.set(host, { y: 0 })
            gsap.set(firefly, { opacity: caught ? 0 : footerSeen ? 1 : 0 })
        }
        function fly() {
            if (disposed || caught) return
            const rect = artwork.getBoundingClientRect()
            const minX = Math.max(-47.5, ((8 - rect.left) / rect.width) * 100)
            const maxX = Math.min(
                147.5,
                ((innerWidth - 8 - rect.left) / rect.width) * 100,
            )
            const start = { ...flight }
            const end = {
                x: minX + Math.random() * (maxX - minX),
                y: narrow.matches
                    ? -45 + Math.random() * 90
                    : -55 + Math.random() * 180,
            }
            const control = {
                x: gsap.utils.clamp(
                    minX,
                    maxX,
                    (start.x + end.x) / 2 + (Math.random() - 0.5) * 60,
                ),
                y: gsap.utils.clamp(
                    -55,
                    125,
                    (start.y + end.y) / 2 + (Math.random() - 0.5) * 60,
                ),
            }
            const progress = { value: 0 }
            flightTween = gsap.to(progress, {
                value: 1,
                duration:
                    3.5 +
                    Math.hypot(end.x - start.x, end.y - start.y) / 30 +
                    Math.random() * 1.5,
                ease: "sine.inOut",
                onUpdate: () => {
                    const t = progress.value
                    const remaining = 1 - t
                    flight.x =
                        remaining ** 2 * start.x +
                        2 * remaining * t * control.x +
                        t ** 2 * end.x
                    flight.y =
                        remaining ** 2 * start.y +
                        2 * remaining * t * control.y +
                        t ** 2 * end.y
                    firefly.setAttribute(
                        "transform",
                        `translate(${flight.x} ${flight.y})`,
                    )
                },
                onComplete: fly,
            })
        }
        function updateFirefly(running: boolean) {
            const rect = footer.getBoundingClientRect()
            const visible = rect.top < innerHeight && rect.bottom > 0
            if (visible && !footerSeen) {
                footerSeen = true
                firefly.setAttribute("transform", "translate(78 23)")
                gsap.set(firefly, { opacity: 1 })
            }
            const flying =
                visible &&
                !document.hidden &&
                !reduced.matches &&
                !caught &&
                !failed
            artwork.dataset.fluttering = String(flying)
            if (flying) {
                if (flightTween) flightTween.resume()
                else fly()
            } else flightTween?.pause()
            if (hop && busy) {
                if (running && visible) hop.resume()
                else hop.pause()
            }
        }
        function position() {
            if (disposed || anchors.length === 0) return
            readAnchors()
            const corner = cornerFrogPlacement(
                sections.map(
                    (section) => section.getBoundingClientRect().top + scrollY,
                ),
                scrollY,
                innerWidth,
                innerHeight,
            )
            const responsive = narrow.matches && !reduced.matches
            root.dataset.cornerFrog = String(responsive)
            const placement = responsive
                ? corner
                : frogPlacement(anchors, window.scrollY, !held.matches)
            root.style.setProperty("--active-corner-size", `${corner.width}px`)
            root.style.setProperty(
                "--active-corner-height",
                `${corner.height}px`,
            )
            root.style.setProperty(
                "--active-corner-crop",
                `${corner.cropHeight}px`,
            )
            root.style.setProperty("--corner-x", `${corner.x}px`)
            artwork.style.opacity = responsive
                ? String(
                      corner.index === sections.length - 1 ? corner.speech : 0,
                  )
                : ""
            greeting.style.opacity = responsive
                ? String(corner.index === 0 ? corner.speech : 0)
                : ""
            sections.forEach((section, index) => {
                const narration = section.querySelector<HTMLElement>(
                    `.${styles.bubbles}`,
                )
                if (narration)
                    narration.style.opacity =
                        responsive && section.dataset.responsive === "held"
                            ? String(corner.index === index ? corner.speech : 0)
                            : ""
            })
            gsap.set(layer, {
                x: placement.x,
                y: placement.y,
                width: placement.width,
                height: placement.height,
            })
            const top = responsive
                ? placement.y
                : root.getBoundingClientRect().top + placement.y
            const running = shouldRenderFrog(
                document.hidden,
                reduced.matches,
                top,
                placement.height,
                window.innerHeight,
            )
            updateFirefly(running)
            updateDialogue(running)
            frog?.setPaused(!running)
            reactToScroll(running, corner, responsive)
            layer.style.visibility =
                frog && !failed && !reduced.matches ? "visible" : "hidden"
        }
        function readAnchors() {
            const rootRect = root.getBoundingClientRect()
            anchors = slots.flatMap((slot, index) => {
                const rect = slot.getBoundingClientRect()
                const anchor = {
                    x: rect.left - rootRect.left,
                    y: rect.top - rootRect.top,
                    width: rect.width,
                    height: rect.height,
                    scroll:
                        sections[index].getBoundingClientRect().top +
                        window.scrollY,
                }
                // Sticky slots move in document coordinates throughout their hold.
                // Read their current rect on each scroll instead of caching it.
                if (held.matches && sections[index].dataset.held === "true") {
                    return [
                        anchor,
                        {
                            ...anchor,
                            scroll:
                                anchor.scroll +
                                sections[index].offsetHeight -
                                window.innerHeight,
                        },
                    ]
                }
                return [anchor]
            })
        }
        function measure() {
            readAnchors()
            position()
            frog?.resize()
        }
        function fail() {
            failed = true
            dialogueActive = false
            clearDialogue()
            resetAboutAnimation()
            delete root.dataset.frogReady
            frog?.canvas.removeEventListener("webglcontextlost", fail)
            frog?.destroy()
            frog = undefined
            layer.style.visibility = "hidden"
            resetTrick()
            flightTween?.pause()
            artwork.dataset.fluttering = "false"
        }
        async function ensureFrog() {
            if (frog || failed || loading || reduced.matches || disposed) return
            loading = true
            try {
                const frogModule = await loadFrog()
                if (disposed || reduced.matches) return
                frog = createFrog(frogModule, host)
                frog.canvas.addEventListener("webglcontextlost", fail)
                root.dataset.frogReady = "true"
                measure()
            } catch {
                fail()
            } finally {
                loading = false
            }
        }
        function preferences() {
            resetAboutAnimation()
            resetTrick()
            if (reduced.matches) {
                frog?.canvas.removeEventListener("webglcontextlost", fail)
                frog?.destroy()
                frog = undefined
                delete root.dataset.frogReady
            }
            smoothScroll()
            position()
            void ensureFrog()
        }
        function visibility() {
            if (document.hidden) hop?.pause()
            else if (hop && hop.progress() < 1) hop.resume()
            smoothScroll()
            position()
        }
        function trick() {
            if (busy) return
            clearDialogue()
            scheduleDialogue()
            if (clicks >= 4) {
                setMessage("Sighs...")
                return
            }
            if (reduced.matches || !frog || failed) {
                setMessage(
                    "The frog is resting. Tricks need animation enabled.",
                )
                return
            }
            const action = frogTrick(++clicks)
            setMessage("")
            frog.wake()
            busy = true
            button.setAttribute("aria-disabled", "true")
            const complete = (text: string) => {
                busy = false
                button.removeAttribute("aria-disabled")
                setMessage(text)
                frog?.setAttention(null)
            }
            if (action === "catch") {
                caught = true
                flightTween?.kill()
                artwork.dataset.fluttering = "false"
                catchState.returning = false
                frog.setAttention(-0.5, -0.3)
                hop = gsap
                    .timeline({
                        onUpdate: drawCatch,
                        onComplete: () => {
                            tongues.forEach((tongue) =>
                                tongue.removeAttribute("d"),
                            )
                            gsap.set(firefly, { opacity: 0 })
                            frog?.talk(0.4)
                            complete("Gulp!")
                        },
                    })
                    .to(
                        catchState,
                        { reach: 1, duration: 0.22, ease: "power2.in" },
                        0.2,
                    )
                    .set(catchState, { returning: true })
                    .to(
                        catchState,
                        { reach: 0, duration: 0.3, ease: "power2.in" },
                        "+=0.08",
                    )
                return
            }
            hop = gsap
                .timeline({ onComplete: () => complete("One small hop!") })
                .to(host, { y: -64, duration: 0.26, ease: "power2.out" })
                .to(host, { y: 0, duration: 0.32, ease: "power2.in" })
        }
        const observer = new ResizeObserver(measure)
        observer.observe(root)
        slots.forEach((slot) => observer.observe(slot))
        window.addEventListener("scroll", position, { passive: true })
        window.addEventListener("resize", measure)
        document.addEventListener("visibilitychange", visibility)
        reduced.addEventListener("change", preferences)
        desktop.addEventListener("change", preferences)
        narrow.addEventListener("change", measure)
        held.addEventListener("change", measure)
        void document.fonts.ready.then(() => {
            if (!disposed) measure()
        })
        button.addEventListener("click", trick)
        measure()
        preferences()
        return () => {
            disposed = true
            dialogueActive = false
            clearDialogue()
            observer.disconnect()
            window.removeEventListener("scroll", position)
            window.removeEventListener("resize", measure)
            document.removeEventListener("visibilitychange", visibility)
            reduced.removeEventListener("change", preferences)
            desktop.removeEventListener("change", preferences)
            narrow.removeEventListener("change", measure)
            held.removeEventListener("change", measure)
            button.removeEventListener("click", trick)
            gsap.ticker.remove(tick)
            lenis?.destroy()
            hop?.kill()
            aboutAnimation?.kill()
            flightTween?.kill()
            gsap.killTweensOf([
                layer,
                host,
                firefly,
                catchState,
                ...hearts,
                ...foods,
            ])
            artwork.dataset.fluttering = "false"
            button.removeAttribute("aria-disabled")
            frog?.canvas.removeEventListener("webglcontextlost", fail)
            frog?.destroy()
            delete root.dataset.frogReady
            delete root.dataset.cornerFrog
            root.style.removeProperty("--active-corner-size")
            root.style.removeProperty("--active-corner-height")
            root.style.removeProperty("--active-corner-crop")
            root.style.removeProperty("--corner-x")
            artwork.style.opacity = ""
            greeting.style.opacity = ""
            flag.style.opacity = ""
            delete flag.dataset.visible
            sections.forEach((section) => {
                const narration = section.querySelector<HTMLElement>(
                    `.${styles.bubbles}`,
                )
                if (narration) narration.style.opacity = ""
            })
            document.documentElement.style.scrollBehavior =
                originalScrollBehavior
            gsap.ticker.lagSmoothing(500, 33)
        }
    }, [])

    return (
        <>
            <div
                ref={layerRef}
                className={styles.frogLayer}
                data-frog-layer
                aria-hidden="true"
            >
                <div ref={hostRef} className={styles.frogHost} />
                <FrogFood />
                <FrogFlag />
                <div className={styles.frogHearts}>
                    {[0, 1, 2].map((index) => (
                        <svg
                            key={index}
                            data-frog-heart
                            viewBox="0 0 16 15"
                            focusable="false"
                            shapeRendering="crispEdges"
                        >
                            <path
                                fill="#38152c"
                                d="M2 0h4v2h4V0h4v2h2v6h-2v2h-2v2h-2v2H6v-2H4v-2H2V8H0V2h2Z"
                            />
                            <path
                                fill="#ef5b83"
                                d="M2 2h4v2h4V2h4v6h-2v2h-2v2H6v-2H4V8H2Z"
                            />
                            <path fill="#ffbdcc" d="M3 3h3v2H3Z" />
                        </svg>
                    ))}
                </div>
            </div>
        </>
    )
}
