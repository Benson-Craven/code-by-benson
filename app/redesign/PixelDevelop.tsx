"use client"

import { useEffect, useRef } from "react"
import { paintDevelopedImage, preparePixelSilhouette } from "./pixelDither"

type PixelDevelopProps = {
    // The reference holds the hero silhouette back by 0.2 seconds.
    delayMs?: number
    // A poster is needed when the media is a video rather than an image.
    poster?: string
}

const DEVELOP_MS = 600
const RESOLVE_MS = 700

const easeInQuad = (progress: number) => progress * progress
const easeOutQuad = (progress: number) => 1 - (1 - progress) * (1 - progress)

// Media on the reference project pages develops as a two-colour pixel
// silhouette, hands over to the real screenshot, then dissolves. This keeps
// that sequence without a scroll library: it runs once when the frame enters.
export default function PixelDevelop({
    delayMs = 0,
    poster,
}: PixelDevelopProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const host = canvas?.parentElement
        if (!canvas || !host) return
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
            return

        const media = host.querySelector<HTMLImageElement | HTMLVideoElement>(
            "img, video",
        )
        if (!media) return

        const source =
            poster ??
            (media instanceof HTMLVideoElement
                ? media.poster
                : media.currentSrc || media.src)
        if (!source) return

        let cancelled = false
        let frame = 0
        let observer: IntersectionObserver | null = null
        let started = false

        const animate = async () => {
            const image = new Image()
            image.src = source
            try {
                await image.decode()
            } catch {
                return
            }
            if (cancelled) return

            const rect = media.getBoundingClientRect()
            const silhouette = preparePixelSilhouette(
                image,
                rect.width,
                rect.height,
                {
                    devicePixelRatio: window.devicePixelRatio,
                    narrow: window.innerWidth < 768,
                },
            )
            if (!silhouette) return

            const paint = (develop: number, resolve: number) =>
                paintDevelopedImage(canvas, silhouette, { develop, resolve })

            paint(0, 0)
            media.style.opacity = "0"
            host.dataset.developReady = "true"

            const startAt = performance.now() + delayMs
            let phase: "develop" | "resolve" = "develop"
            let resolveStart = 0

            const tick = (now: number) => {
                if (cancelled) return

                if (phase === "develop") {
                    const progress = Math.min(
                        1,
                        Math.max(0, now - startAt) / DEVELOP_MS,
                    )
                    paint(easeInQuad(progress), 0)

                    if (progress < 1) {
                        frame = window.requestAnimationFrame(tick)
                        return
                    }

                    media.style.removeProperty("opacity")
                    phase = "resolve"
                    resolveStart = now
                    frame = window.requestAnimationFrame(tick)
                    return
                }

                const progress = Math.min(1, (now - resolveStart) / RESOLVE_MS)
                paint(1, easeOutQuad(progress))

                if (progress < 1) {
                    frame = window.requestAnimationFrame(tick)
                    return
                }

                host.dataset.developComplete = "true"
            }

            frame = window.requestAnimationFrame(tick)
        }

        observer = new IntersectionObserver(
            (entries) => {
                if (started) return
                if (!entries.some((entry) => entry.isIntersecting)) return
                started = true
                observer?.disconnect()
                observer = null
                void animate()
            },
            { threshold: 0.15 },
        )
        observer.observe(host)

        return () => {
            cancelled = true
            window.cancelAnimationFrame(frame)
            observer?.disconnect()
            if (host.isConnected) {
                delete host.dataset.developReady
                delete host.dataset.developComplete
            }
            if (media.isConnected) media.style.removeProperty("opacity")
        }
    }, [delayMs, poster])

    return (
        <canvas
            ref={canvasRef}
            className="pointer-events-none absolute inset-0 z-[3] h-full w-full opacity-0 transition-opacity duration-200 [image-rendering:pixelated] data-[develop-complete=true]:opacity-0 group-data-[develop-ready=true]/media:opacity-100 motion-reduce:transition-none"
            data-develop-canvas
            aria-hidden="true"
        />
    )
}
