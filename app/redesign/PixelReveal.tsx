"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/utils/cn"
import {
    paintPixelatedImage,
    paintPixelEdgeCover,
    preparePixelCover,
    revealProgress,
    type PixelCoverSource,
} from "./pixelDither"

type PixelRevealProps = {
    src: string
    tint: string
    reveal?: boolean
    delayMs?: number
    className?: string
}

const REVEAL_DURATION_MS = 760
const OPEN_DURATION_MS = 500

export default function PixelReveal({
    src,
    tint,
    reveal = false,
    delayMs = 0,
    className,
}: PixelRevealProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const host = canvas?.parentElement
        if (!canvas || !host) return
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
            return

        const image = host.querySelector<HTMLImageElement>("img")
        if (!image) return

        const link = host.closest("a")
        let source: PixelCoverSource | null = null
        let frame = 0
        let openFrame = 0
        let scrollFrame = 0
        let cancelled = false
        let visible = !reveal
        let started = false
        let open = 1
        let hovered = false
        let focused = false
        let observer: IntersectionObserver | null = null

        const paint = () => {
            if (!source) return

            if (reveal) {
                return
            }

            const rect = host.getBoundingClientRect()
            paintPixelEdgeCover(canvas, source, {
                rect,
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight,
                },
                open,
            })
        }

        const build = () => {
            const rect = host.getBoundingClientRect()
            if (rect.width < 1 || rect.height < 1) return false

            source = preparePixelCover(image, tint, rect.width, rect.height, {
                devicePixelRatio: window.devicePixelRatio,
                narrow: window.innerWidth < 768,
            })
            if (!source) return false

            if (reveal) {
                paintPixelatedImage(canvas, source, 0)
            } else {
                paint()
            }
            host.dataset.pixelReady = "true"
            return true
        }

        const animateReveal = () => {
            if (!source || cancelled) return

            const startAt = performance.now() + delayMs
            const tick = (now: number) => {
                if (cancelled || !source) return

                const progress = revealProgress(
                    Math.max(0, now - startAt),
                    REVEAL_DURATION_MS,
                )
                paintPixelatedImage(canvas, source, progress)

                if (progress < 1) {
                    frame = requestAnimationFrame(tick)
                    return
                }

                canvas.dataset.pixelComplete = "true"
                // The ready state keeps the canvas visible and outranks the
                // completed state in the cascade, so clear it to hand the hero
                // back to the real image.
                delete host.dataset.pixelReady
            }
            frame = requestAnimationFrame(tick)
        }

        const animateOpen = (target: number) => {
            if (reveal) return

            cancelAnimationFrame(openFrame)
            const from = open
            const startedAt = performance.now()
            const tick = (now: number) => {
                if (cancelled) return

                const progress = Math.min(
                    1,
                    (now - startedAt) / OPEN_DURATION_MS,
                )
                open = from + (target - from) * (1 - Math.pow(1 - progress, 3))
                paint()

                if (progress < 1) {
                    openFrame = requestAnimationFrame(tick)
                }
            }
            openFrame = requestAnimationFrame(tick)
        }

        const targetOpen = () => (hovered || focused ? 2 : 1)

        const scheduleScrollPaint = () => {
            if (scrollFrame || reveal) return
            scrollFrame = requestAnimationFrame(() => {
                scrollFrame = 0
                paint()
            })
        }

        const start = () => {
            if (started || cancelled || !visible) return
            if (!build()) return

            started = true
            if (reveal) animateReveal()
        }

        const prepare = () => {
            if (cancelled) return
            if (image.complete && image.naturalWidth > 0) {
                start()
                return
            }
            void image
                .decode()
                .then(start)
                .catch(() => undefined)
        }

        const onEnter = () => {
            hovered = true
            animateOpen(2)
        }
        const onLeave = () => {
            hovered = false
            animateOpen(targetOpen())
        }
        const onFocus = () => {
            focused = true
            animateOpen(2)
        }
        const onBlur = () => {
            focused = false
            animateOpen(targetOpen())
        }
        const onClick = () => animateOpen(2)

        const resizeObserver = new ResizeObserver(() => {
            if (!started) {
                start()
                return
            }
            if (!reveal) {
                source = null
                build()
            }
        })
        resizeObserver.observe(host)

        if (!reveal && link) {
            link.addEventListener("pointerenter", onEnter)
            link.addEventListener("pointerleave", onLeave)
            link.addEventListener("focus", onFocus)
            link.addEventListener("blur", onBlur)
            link.addEventListener("click", onClick)
            window.addEventListener("scroll", scheduleScrollPaint, {
                passive: true,
            })
        }

        if (reveal) {
            observer = new IntersectionObserver(
                (entries) => {
                    if (!entries.some((entry) => entry.isIntersecting)) return
                    observer?.disconnect()
                    visible = true
                    prepare()
                },
                { threshold: 0.15 },
            )
            observer.observe(host)
        } else {
            prepare()
        }

        return () => {
            cancelled = true
            cancelAnimationFrame(frame)
            cancelAnimationFrame(openFrame)
            cancelAnimationFrame(scrollFrame)
            observer?.disconnect()
            resizeObserver.disconnect()
            if (!reveal && link) {
                link.removeEventListener("pointerenter", onEnter)
                link.removeEventListener("pointerleave", onLeave)
                link.removeEventListener("focus", onFocus)
                link.removeEventListener("blur", onBlur)
                link.removeEventListener("click", onClick)
                window.removeEventListener("scroll", scheduleScrollPaint)
            }
            delete host.dataset.pixelReady
            delete canvas.dataset.pixelComplete
        }
    }, [src, tint, reveal, delayMs])

    return (
        <canvas
            ref={canvasRef}
            className={cn(
                "pointer-events-none absolute inset-0 z-[1] h-full w-full object-cover opacity-0 transition-opacity duration-[250ms] [image-rendering:pixelated] data-[pixel-complete=true]:opacity-0 group-data-[pixel-ready=true]/cover:opacity-100",
                className,
            )}
            data-pixel-canvas
            aria-hidden="true"
        />
    )
}
