"use client"

import { useEffect, useMemo, useRef } from "react"

type WordRevealProps = {
    text: string
    className?: string
}

// The reference site reveals body copy word by word as it scrolls. Words start
// faint and reach full opacity in reading order, and the effect reverses when
// the reader scrolls back. Without JavaScript, or with reduced motion, the text
// renders at full opacity.
export default function WordReveal({ text, className }: WordRevealProps) {
    const hostRef = useRef<HTMLParagraphElement>(null)
    const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text])

    useEffect(() => {
        const host = hostRef.current
        if (!host) return

        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
        const spans = Array.from(
            host.querySelectorAll<HTMLElement>("[data-word]"),
        )
        if (spans.length === 0) return

        let frame = 0

        const reset = () => {
            spans.forEach((span) => span.style.removeProperty("opacity"))
        }

        const update = () => {
            frame = 0
            if (reduced.matches) return

            const rect = host.getBoundingClientRect()
            const viewport = window.innerHeight
            const start = viewport * 0.8
            const span = viewport * 0.35 + rect.height
            const progress = Math.min(
                1,
                Math.max(0, (start - rect.top) / Math.max(1, span)),
            )

            // A small overlap per word keeps the leading edge soft instead of
            // switching a whole word at once.
            const position = progress * (spans.length + 3)

            spans.forEach((word, index) => {
                const value = Math.min(1, Math.max(0, position - index))
                word.style.opacity = String(0.12 + 0.88 * value)
            })
        }

        const schedule = () => {
            if (frame) return
            frame = window.requestAnimationFrame(update)
        }

        const onMotionChange = () => {
            if (reduced.matches) {
                reset()
                return
            }
            schedule()
        }

        update()
        window.addEventListener("scroll", schedule, { passive: true })
        window.addEventListener("resize", schedule)
        reduced.addEventListener("change", onMotionChange)
        void document.fonts?.ready.then(schedule).catch(() => undefined)

        return () => {
            window.cancelAnimationFrame(frame)
            window.removeEventListener("scroll", schedule)
            window.removeEventListener("resize", schedule)
            reduced.removeEventListener("change", onMotionChange)
            reset()
        }
    }, [text])

    return (
        <p ref={hostRef} className={className} data-word-reveal>
            {words.map((word, index) => (
                <span key={`${word}-${index}`} data-word>
                    {word}
                    {index < words.length - 1 ? " " : null}
                </span>
            ))}
        </p>
    )
}
