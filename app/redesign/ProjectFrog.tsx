"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import type { PortfolioProjectSlug } from "../data/portfolio"
import { createFrog, loadFrog, type FrogInstance } from "./frogAdapter"
import { pickProjectDialogue } from "./frogDialogue"
import { revealSpeech, type SpeechReveal } from "./speechDither"
import styles from "./redesign.module.css"

const FIRST_LINE_DELAY_MS = 2000
const GAP_MIN_MS = 4500
const GAP_MAX_MS = 10500
const LINE_DURATION_MS = 5200
const FADE_SECONDS = 0.35

export default function ProjectFrog({ slug }: { slug: PortfolioProjectSlug }) {
    const layerRef = useRef<HTMLDivElement>(null)
    const hostRef = useRef<HTMLDivElement>(null)
    const dialogueRef = useRef<HTMLParagraphElement>(null)
    const dialogueTextRef = useRef<HTMLSpanElement>(null)
    const pixelsRef = useRef<HTMLCanvasElement>(null)
    const shadowRef = useRef<HTMLSpanElement>(null)

    useEffect(() => {
        const layer = layerRef.current
        const host = hostRef.current
        const dialogue = dialogueRef.current
        const dialogueText = dialogueTextRef.current
        const pixels = pixelsRef.current
        const shadow = shadowRef.current
        if (!layer || !host || !dialogue || !dialogueText || !pixels || !shadow)
            return
        const container: HTMLDivElement = layer
        const hostElement: HTMLDivElement = host
        const bubble: HTMLParagraphElement = dialogue
        const bubbleText: HTMLSpanElement = dialogueText
        const revealCanvas: HTMLCanvasElement = pixels
        const bubbleShadow: HTMLSpanElement = shadow

        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
        let frog: FrogInstance | undefined
        let disposed = false
        let loading = false
        let failed = false
        let previous = ""
        let timer: ReturnType<typeof setTimeout> | undefined
        let fade: gsap.core.Tween | undefined
        let reveal: SpeechReveal | undefined

        function cancelReveal() {
            reveal?.cancel()
            reveal = undefined
            revealCanvas.hidden = true
        }

        const gap = () => GAP_MIN_MS + Math.random() * (GAP_MAX_MS - GAP_MIN_MS)

        function clearDialogue() {
            if (timer !== undefined) {
                clearTimeout(timer)
                timer = undefined
            }
            fade?.kill()
            fade = undefined
            cancelReveal()
            bubbleShadow.hidden = true
            bubble.style.removeProperty("opacity")
            bubbleText.style.removeProperty("opacity")
            bubble.hidden = true
            bubbleText.textContent = ""
        }

        function canSpeak() {
            return Boolean(
                frog &&
                !failed &&
                !disposed &&
                !document.hidden &&
                !reduced.matches,
            )
        }

        function schedule(delay: number) {
            if (!canSpeak() || timer !== undefined) return
            timer = setTimeout(show, delay)
        }

        function show() {
            timer = undefined
            if (!canSpeak()) return
            const next = pickProjectDialogue(slug, previous)
            if (!next) return
            previous = next
            cancelReveal()
            bubbleText.textContent = previous
            bubble.hidden = false
            bubble.style.opacity = "0"
            bubbleText.style.opacity = "0"
            bubbleShadow.hidden = true
            bubbleShadow.style.left = `${bubble.offsetLeft}px`
            bubbleShadow.style.top = `${bubble.offsetTop}px`
            bubbleShadow.style.width = `${bubble.offsetWidth}px`
            bubbleShadow.style.height = `${bubble.offsetHeight}px`
            reveal = revealSpeech(
                revealCanvas,
                bubble,
                () => {
                    bubble.style.opacity = "1"
                    bubbleShadow.hidden = false
                },
                () => {
                    bubbleText.style.opacity = "1"
                },
            )
            frog?.talk(2.2)
            timer = setTimeout(hide, LINE_DURATION_MS)
        }

        function hide() {
            timer = undefined
            if (!bubbleText.textContent) return
            cancelReveal()
            bubble.style.removeProperty("opacity")
            bubbleText.style.removeProperty("opacity")
            fade = gsap.to(bubble, {
                opacity: 0,
                duration: FADE_SECONDS,
                ease: "power2.in",
                overwrite: true,
                onComplete: () => {
                    bubble.hidden = true
                    bubbleShadow.hidden = true
                    bubbleText.textContent = ""
                    schedule(gap())
                },
            })
        }

        function resumeDialogue() {
            if (bubble.textContent || timer !== undefined) return
            schedule(previous ? gap() : FIRST_LINE_DELAY_MS)
        }

        function paint() {
            frog?.setPaused(
                Boolean(document.hidden || reduced.matches || failed),
            )
        }

        function fail() {
            failed = true
            clearDialogue()
            delete container.dataset.frogReady
            frog?.canvas.removeEventListener("webglcontextlost", fail)
            frog?.destroy()
            frog = undefined
        }

        async function ensureFrog() {
            if (frog || failed || loading || disposed || reduced.matches) return
            loading = true
            try {
                const frogModule = await loadFrog()
                if (disposed || reduced.matches) return
                frog = createFrog(frogModule, hostElement)
                frog.canvas.addEventListener("webglcontextlost", fail)
                frog.resize()
                paint()
                container.dataset.frogReady = "true"
                resumeDialogue()
            } catch {
                fail()
            } finally {
                loading = false
            }
        }

        function preferences() {
            if (reduced.matches) {
                clearDialogue()
                delete container.dataset.frogReady
                frog?.canvas.removeEventListener("webglcontextlost", fail)
                frog?.destroy()
                frog = undefined
            } else {
                void ensureFrog()
            }
        }

        function visibility() {
            paint()
            if (document.hidden) clearDialogue()
            else resumeDialogue()
        }

        const observer = new ResizeObserver(() => frog?.resize())
        observer.observe(container)
        document.addEventListener("visibilitychange", visibility)
        reduced.addEventListener("change", preferences)
        void ensureFrog()

        return () => {
            disposed = true
            clearDialogue()
            cancelReveal()
            observer.disconnect()
            document.removeEventListener("visibilitychange", visibility)
            reduced.removeEventListener("change", preferences)
            frog?.canvas.removeEventListener("webglcontextlost", fail)
            frog?.destroy()
            delete container.dataset.frogReady
        }
    }, [slug])

    return (
        <div
            ref={layerRef}
            className={styles.caseFrog}
            data-frog-layer
            aria-hidden="true"
        >
            <p
                ref={dialogueRef}
                className={styles.caseDialogue}
                data-project-dialogue
                hidden
            >
                <span
                    ref={dialogueTextRef}
                    className={styles.caseDialogueText}
                />
            </p>
            <span
                ref={shadowRef}
                className={styles.caseDialogueShadow}
                aria-hidden="true"
                hidden
            />
            <canvas
                ref={pixelsRef}
                className={styles.caseDialoguePixels}
                data-dialogue-pixels
                aria-hidden="true"
                hidden
            />
            <div ref={hostRef} className={styles.caseFrogHost} />
            {/* The fallback shares the canvas footprint until the rig loads. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                className={styles.caseFrogFallback}
                src="/frog-mascot/frog-static.png"
                alt=""
                width={320}
                height={336}
            />
        </div>
    )
}
