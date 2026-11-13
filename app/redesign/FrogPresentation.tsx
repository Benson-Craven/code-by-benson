"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import Lenis from "lenis"
import "lenis/dist/lenis.css"
import { createFrog, loadFrog, type FrogInstance } from "./frogAdapter"
import {
    aboutFlagOpacity,
    frogPlacement,
    cornerFrogPlacement,
    heroGreetingDrift,
    heroGreetingExit,
    shouldRenderFrog,
    workBadgeActive,
    workBadgeDock,
    workBadgeStarts,
    type FrogAnchor,
} from "./frogPlacement"
import {
    heldPresentationQuery,
    presentationProgress,
    responsivePresentationProgress,
} from "./projectPresentationData"
import { foodTreatment, heartTreatment } from "./frogTreatment"
import { createFrogTricks } from "./frogTricks"
import FrogFood from "./FrogFood"
import FrogFlag from "./FrogFlag"
import { pickAllWorkDialogue, pickFooterDialogue } from "./frogDialogue"
import { cn } from "@/utils/cn"

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
        const work = root.querySelector<HTMLElement>("[data-frog-work]")!
        const badge = layer.querySelector<HTMLElement>("[data-frog-badge]")!
        const button =
            root.querySelector<HTMLButtonElement>("[data-frog-trick]")!
        const footer = sections[sections.length - 1]
        const artwork = root.querySelector<SVGSVGElement>(
            "[data-frog-trick-art]",
        )!
        const status = root.querySelector<HTMLElement>(
            "[data-frog-trick-status]",
        )!
        const dialogue = root.querySelector<HTMLElement>(
            "[data-frog-dialogue]",
        )!
        // The badge carries its own bubble, so it is a sibling of the rendered
        // frog rather than the footer slot the other dialogue is anchored to.
        const workDialogue = layer.querySelector<HTMLElement>(
            "[data-frog-work-dialogue]",
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
                    if (tricks.busy) {
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
                badgeState === "off" &&
                (narrow.matches
                    ? footer.getBoundingClientRect().top <= innerHeight * 0.75
                    : rect.top >= 80 && rect.top < innerHeight * 0.8),
            )
            if (dialogueActive) scheduleDialogue()
            else clearDialogue()
        }
        let workDialogueTimer: ReturnType<typeof setTimeout> | undefined
        let workDialogueActive = false
        let previousWorkDialogue = ""
        function clearWorkDialogue() {
            clearTimeout(workDialogueTimer)
            workDialogueTimer = undefined
            gsap.killTweensOf(workDialogue)
            workDialogue.textContent = ""
            workDialogue.hidden = true
        }
        function showWorkDialogue() {
            previousWorkDialogue = pickAllWorkDialogue(previousWorkDialogue)
            workDialogue.textContent = previousWorkDialogue
            workDialogue.hidden = false
            gsap.fromTo(
                workDialogue,
                { opacity: 0, y: 10 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.35,
                    ease: "power2.out",
                    overwrite: true,
                },
            )
            frog?.talk(2.2)
            workDialogueTimer = setTimeout(() => {
                gsap.to(workDialogue, {
                    opacity: 0,
                    y: 10,
                    duration: 0.35,
                    ease: "power2.in",
                    overwrite: true,
                    onComplete: () => {
                        clearWorkDialogue()
                        scheduleWorkDialogue()
                    },
                })
            }, 5200)
        }
        function scheduleWorkDialogue() {
            if (!workDialogueActive || workDialogueTimer !== undefined) return
            workDialogueTimer = setTimeout(
                () => {
                    workDialogueTimer = undefined
                    if (!workDialogueActive) return
                    showWorkDialogue()
                },
                4500 + Math.random() * 6000,
            )
        }
        function updateWorkDialogue(running: boolean) {
            const active = Boolean(
                running &&
                badgeState === "on" &&
                frog &&
                !failed &&
                !reduced.matches &&
                !document.hidden,
            )
            if (active === workDialogueActive) return
            workDialogueActive = active
            if (active) scheduleWorkDialogue()
            else clearWorkDialogue()
        }
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
        // The hero bubble leaves with the first scroll. Every later return to
        // the top replays the return line's fade-up entrance and exit.
        let greetingPhase: "initial" | "returning" | "away" = "initial"
        const greetingMotion = { reveal: 1, offset: 0 }
        const returnGreeting = "Ready for another tour already?"
        let frog: FrogInstance | undefined
        let lenis: Lenis | undefined
        let anchors: FrogAnchor[] = []
        let disposed = false
        let failed = false
        let loading = false
        let aboutAnimation: gsap.core.Timeline | undefined
        let badgeState: "off" | "entering" | "on" | "leaving" = "off"
        let badgeTimeline: gsap.core.Timeline | undefined
        let smileCall: gsap.core.Tween | undefined
        const badgeMix = { value: 0 }
        let latestPlacement: FrogAnchor | undefined
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
        function renderGreeting(
            corner?: ReturnType<typeof cornerFrogPlacement>,
        ) {
            if (reduced.matches) {
                greeting.style.opacity = ""
                greeting.style.transform = ""
                return
            }
            let opacity: number
            let offset: number
            if (greetingPhase === "initial") {
                if (narrow.matches) {
                    // Phones keep the bubble fixed above the corner frog, so
                    // its existing speech fade drives the exit.
                    opacity = corner && corner.index === 0 ? corner.speech : 0
                    offset = -heroGreetingDrift * (1 - opacity)
                } else {
                    const exit = heroGreetingExit(
                        window.scrollY,
                        Math.max(1, sections[0].offsetHeight),
                    )
                    opacity = exit.opacity
                    offset = exit.offset
                }
            } else {
                opacity = greetingMotion.reveal
                offset = greetingMotion.offset
            }
            greeting.style.opacity = String(opacity)
            greeting.style.transform = `translateY(${offset}px)`
        }

        // The return line arrives from below and settles, then leaves upward.
        function showReturnGreeting() {
            greetingPhase = "returning"
            gsap.killTweensOf(greetingMotion)
            if (reduced.matches) {
                greetingMotion.reveal = 1
                greetingMotion.offset = 0
                renderGreeting()
                return
            }
            greetingMotion.reveal = 0
            greetingMotion.offset = heroGreetingDrift
            gsap.to(greetingMotion, {
                reveal: 1,
                offset: 0,
                duration: 0.5,
                ease: "power2.out",
                overwrite: true,
                onUpdate: () => renderGreeting(),
            })
        }

        function hideReturnGreeting() {
            greetingPhase = "away"
            gsap.killTweensOf(greetingMotion)
            if (reduced.matches) {
                greetingMotion.reveal = 0
                greetingMotion.offset = -heroGreetingDrift
                renderGreeting()
                return
            }
            gsap.to(greetingMotion, {
                reveal: 0,
                offset: -heroGreetingDrift,
                duration: 0.35,
                ease: "power2.in",
                overwrite: true,
                onUpdate: () => renderGreeting(),
            })
        }

        function reactToScroll(
            running: boolean,
            corner: ReturnType<typeof cornerFrogPlacement>,
            cornerActive: boolean,
        ) {
            if (window.scrollY > sections[0].offsetHeight * 0.6) leftTop = true
            const atTop = window.scrollY <= 40
            if (leftTop && atTop) {
                if (greetingPhase !== "returning") {
                    returned = true
                    greeting.textContent = returnGreeting
                    spokenBeat = ""
                    showReturnGreeting()
                }
            } else if (greetingPhase === "returning") {
                hideReturnGreeting()
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
            const flagOpacity = aboutFlagOpacity({
                aboutActive,
                introTop: introRect.top,
                introBottom: introRect.bottom,
                viewportHeight: innerHeight,
                cornerActive,
                cornerIndex: corner.index,
                cornerSpeech: corner.speech,
                reduced: reduced.matches,
            })
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

        function badgeInset() {
            return narrow.matches ? 20 : 24
        }

        // The layer's CSS top is 0 on desktop and the safe-area lift on phones.
        function layerBaseTop() {
            return parseFloat(getComputedStyle(layer).top) || 0
        }

        // The live normal placement in layer coordinates, so the exit can
        // chase the footer as the page keeps scrolling.
        function layerPlacement(): FrogAnchor {
            const responsive = narrow.matches && !reduced.matches
            const anchor =
                latestPlacement ??
                (responsive
                    ? cornerFrogPlacement(
                          sections.map(
                              (section) =>
                                  section.getBoundingClientRect().top + scrollY,
                          ),
                          scrollY,
                          innerWidth,
                          innerHeight,
                      )
                    : frogPlacement(anchors, window.scrollY, !held.matches))
            if (responsive) return anchor
            const rootRect = root.getBoundingClientRect()
            return {
                ...anchor,
                x: rootRect.left + anchor.x,
                y: rootRect.top + anchor.y,
            }
        }

        function resetBadge() {
            badgeTimeline?.kill()
            badgeTimeline = undefined
            smileCall?.kill()
            smileCall = undefined
            workDialogueActive = false
            clearWorkDialogue()
            badgeState = "off"
            delete root.dataset.frogDocked
            frog?.setSmiling(false)
            frog?.setBadge(false)
            badgeMix.value = 0
            gsap.killTweensOf([badge, badgeMix])
            gsap.set(badge, {
                opacity: 0,
                scale: 0.7,
                clearProps: "boxShadow",
            })
        }

        function enterBadge() {
            if (!frog || failed || reduced.matches || disposed) return
            badgeState = "entering"
            const rect = layer.getBoundingClientRect()
            const baseTop = layerBaseTop()
            const dock = workBadgeDock(
                innerWidth,
                innerHeight,
                rect.height || 1,
                badgeInset(),
            )
            root.dataset.frogDocked = "true"
            gsap.killTweensOf([layer, badge, badgeMix])
            // Keep the current screen position through the fixed switch.
            gsap.set(layer, { x: rect.left, y: rect.top - baseTop })
            badgeMix.value = 0
            frog.setBadgeMix(0)
            frog.setSmiling(false)
            badgeTimeline = gsap
                .timeline({
                    onComplete: () => {
                        badgeState = "on"
                        frog?.setSmiling(true)
                        smileCall = gsap.delayedCall(1.5, () =>
                            frog?.setSmiling(false),
                        )
                        // The first line lands with the arrival, then cycles.
                        workDialogueActive = !document.hidden
                        if (workDialogueActive) showWorkDialogue()
                    },
                })
                .to(
                    layer,
                    {
                        x: dock.x,
                        y: dock.y - baseTop,
                        duration: 0.72,
                        ease: "power3.inOut",
                    },
                    0,
                )
                .to(
                    badgeMix,
                    {
                        value: 1,
                        duration: 0.6,
                        ease: "power2.inOut",
                        onUpdate: () => frog?.setBadgeMix(badgeMix.value),
                    },
                    0,
                )
                .fromTo(
                    badge,
                    {
                        opacity: 0,
                        scale: 0.62,
                        boxShadow: "0 0 0 0 #fbfbf8, 0 0 0 0 #3a5de3",
                    },
                    {
                        opacity: 1,
                        scale: 1,
                        boxShadow: "0 0 0 4px #fbfbf8, 0 0 0 6px #3a5de3",
                        duration: 0.5,
                        ease: "back.out(1.7)",
                    },
                    0.08,
                )
        }

        function leaveBadge() {
            if (badgeState === "off") return
            badgeState = "leaving"
            smileCall?.kill()
            smileCall = undefined
            workDialogueActive = false
            clearWorkDialogue()
            frog?.setSmiling(false)
            const rect = layer.getBoundingClientRect()
            const baseTop = layerBaseTop()
            const start = {
                x: rect.left,
                y: rect.top - baseTop,
                width: rect.width,
                height: rect.height,
            }
            const move = { value: 0 }
            gsap.killTweensOf([layer, badge, badgeMix, move])
            badgeTimeline = gsap
                .timeline({
                    onComplete: () => {
                        badgeState = "off"
                        delete root.dataset.frogDocked
                        frog?.setBadge(false)
                        gsap.set(badge, {
                            opacity: 0,
                            scale: 0.7,
                            clearProps: "boxShadow",
                        })
                        position()
                    },
                })
                .to(
                    badge,
                    {
                        opacity: 0,
                        scale: 0.7,
                        duration: 0.3,
                        ease: "power2.in",
                    },
                    0,
                )
                .to(
                    badgeMix,
                    {
                        value: 0,
                        duration: 0.68,
                        ease: "power2.inOut",
                        onUpdate: () => frog?.setBadgeMix(badgeMix.value),
                    },
                    0,
                )
                .to(
                    move,
                    {
                        value: 1,
                        duration: 0.68,
                        ease: "power2.inOut",
                        onUpdate: () => {
                            // Retarget every frame so scrolling stays continuous.
                            const target = layerPlacement()
                            gsap.set(layer, {
                                x: start.x + (target.x - start.x) * move.value,
                                y: start.y + (target.y - start.y) * move.value,
                                width:
                                    start.width +
                                    (target.width - start.width) * move.value,
                                height:
                                    start.height +
                                    (target.height - start.height) * move.value,
                            })
                        },
                    },
                    0,
                )
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
            renderGreeting(corner)
            sections.forEach((section, index) => {
                const narration =
                    section.querySelector<HTMLElement>("[data-bubbles]")
                if (narration)
                    narration.style.opacity =
                        responsive && section.dataset.responsive === "held"
                            ? String(corner.index === index ? corner.speech : 0)
                            : ""
            })
            latestPlacement = placement
            const workRect = work.getBoundingClientRect()
            const footerRect = footer.getBoundingClientRect()
            const dockable = Boolean(frog) && !failed && !reduced.matches
            if (badgeState === "off") {
                if (
                    dockable &&
                    workBadgeStarts(workRect.top, footerRect.top, innerHeight)
                )
                    enterBadge()
            } else if (badgeState === "on" || badgeState === "entering") {
                if (
                    !dockable ||
                    !workBadgeActive(workRect.top, footerRect.top, innerHeight)
                )
                    leaveBadge()
            }
            if (badgeState === "off") {
                gsap.set(layer, {
                    x: placement.x,
                    y: placement.y,
                    width: placement.width,
                    height: placement.height,
                })
            } else if (badgeState === "on") {
                // Keep the circle docked through viewport resizes.
                const dock = workBadgeDock(
                    innerWidth,
                    innerHeight,
                    layer.getBoundingClientRect().height || 1,
                    badgeInset(),
                )
                gsap.set(layer, { x: dock.x, y: dock.y - layerBaseTop() })
            }
            const top =
                badgeState === "off"
                    ? responsive
                        ? placement.y
                        : root.getBoundingClientRect().top + placement.y
                    : layer.getBoundingClientRect().top
            const running = shouldRenderFrog(
                document.hidden,
                reduced.matches,
                top,
                placement.height,
                window.innerHeight,
            )
            tricks.update(running)
            updateDialogue(running)
            updateWorkDialogue(running)
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
            resetBadge()
            delete root.dataset.frogReady
            frog?.canvas.removeEventListener("webglcontextlost", fail)
            frog?.destroy()
            frog = undefined
            layer.style.visibility = "hidden"
            tricks.reset()
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
            tricks.reset()
            // A preference change can land mid-tween, so settle the greeting
            // before scroll position decides which state it should show.
            gsap.killTweensOf(greetingMotion)
            if (greetingPhase === "returning") {
                greetingMotion.reveal = 1
                greetingMotion.offset = 0
            } else if (greetingPhase === "away") {
                greetingMotion.reveal = 0
                greetingMotion.offset = -heroGreetingDrift
            }
            if (reduced.matches) {
                resetBadge()
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
            smoothScroll()
            position()
        }

        const tricks = createFrogTricks({
            host,
            artwork,
            button,
            status,
            footer,
            getFrog: () => frog,
            reduced: () => reduced.matches,
            narrow: () => narrow.matches,
            failed: () => failed,
            beforeTrick: () => {
                clearDialogue()
                scheduleDialogue()
            },
        })

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
            tricks.destroy()
            gsap.ticker.remove(tick)
            lenis?.destroy()
            aboutAnimation?.kill()
            resetBadge()
            gsap.killTweensOf(greetingMotion)
            gsap.killTweensOf([layer, host, ...hearts, ...foods])
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
            greeting.style.transform = ""
            flag.style.opacity = ""
            delete flag.dataset.visible
            sections.forEach((section) => {
                const narration =
                    section.querySelector<HTMLElement>("[data-bubbles]")
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
                className="preview-frog-layer pointer-events-none invisible absolute left-0 top-0 z-[2] h-[336px] w-80"
                data-frog-layer
                aria-hidden="true"
            >
                {/* The paper disc and ring behind the renderer's circular crop. */}
                <div
                    className="preview-frog-badge pointer-events-none"
                    data-frog-badge
                />
                <div
                    ref={hostRef}
                    className="preview-frog-host pointer-events-none h-full w-full"
                />
                {/* Spoken only while docked; the footer has its own bubble. */}
                <p
                    className="preview-frog-work-dialogue speech-tail-down pointer-events-none m-0 rounded-[20px] bg-preview-white px-4 py-3 text-[clamp(16px,1.5vw,19px)] font-semibold leading-[1.3] text-preview-black"
                    data-frog-work-dialogue
                    hidden
                />
                <FrogFood />
                <FrogFlag />
                <div className="pointer-events-none absolute inset-0">
                    {[0, 1, 2].map((index) => (
                        <svg
                            key={index}
                            className={cn(
                                "absolute h-auto origin-center opacity-0",
                                index === 1
                                    ? "left-[44%] top-[18%] w-[14%]"
                                    : index === 2
                                      ? "left-[68%] top-[24%] w-[10%]"
                                      : "left-[22%] top-[24%] w-[12%]",
                            )}
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
