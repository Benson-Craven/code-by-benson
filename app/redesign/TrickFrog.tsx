"use client"

import { useEffect, useRef } from "react"
import { createFrog, loadFrog, type FrogInstance } from "./frogAdapter"
import { createFrogTricks } from "./frogTricks"
import FrogTrickArtwork from "./FrogTrickArtwork"

export default function TrickFrog() {
    const rootRef = useRef<HTMLDivElement>(null)
    const slotRef = useRef<HTMLDivElement>(null)
    const hostRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const statusRef = useRef<HTMLParagraphElement>(null)

    useEffect(() => {
        const root = rootRef.current!
        const slot = slotRef.current!
        const host = hostRef.current!
        const reduced = matchMedia("(prefers-reduced-motion: reduce)")
        const narrow = matchMedia("(max-width: 1023px)")
        let frog: FrogInstance | undefined
        let loading = false
        let disposed = false
        let failed = false
        const tricks = createFrogTricks({
            host,
            artwork: slot.querySelector<SVGSVGElement>(
                "[data-frog-trick-art]",
            )!,
            button: buttonRef.current!,
            status: statusRef.current!,
            footer: root,
            getFrog: () => frog,
            reduced: () => reduced.matches,
            narrow: () => narrow.matches,
            failed: () => failed,
        })

        function update() {
            const rect = slot.getBoundingClientRect()
            const running = Boolean(
                frog &&
                !failed &&
                !reduced.matches &&
                !document.hidden &&
                rect.top < innerHeight &&
                rect.bottom > 0,
            )
            frog?.setPaused(!running)
            tricks.update(running)
        }

        function destroyFrog() {
            frog?.canvas.removeEventListener("webglcontextlost", fail)
            frog?.destroy()
            frog = undefined
            delete slot.dataset.ready
        }

        function fail() {
            failed = true
            tricks.reset()
            destroyFrog()
            update()
        }

        async function preferences() {
            tricks.reset()
            if (reduced.matches) destroyFrog()
            update()
            if (disposed || frog || loading || failed || reduced.matches) return
            loading = true
            try {
                const frogModule = await loadFrog()
                if (disposed || reduced.matches) return
                frog = createFrog(frogModule, host)
                frog.canvas.addEventListener("webglcontextlost", fail)
                slot.dataset.ready = "true"
                update()
            } catch {
                if (!disposed) fail()
            } finally {
                loading = false
            }
        }

        const resize = new ResizeObserver(() => {
            frog?.resize()
            update()
        })
        resize.observe(slot)
        const visibility = new IntersectionObserver(update)
        visibility.observe(slot)
        document.addEventListener("visibilitychange", update)
        window.addEventListener("resize", update)
        reduced.addEventListener("change", preferences)
        void preferences()

        return () => {
            disposed = true
            resize.disconnect()
            visibility.disconnect()
            document.removeEventListener("visibilitychange", update)
            window.removeEventListener("resize", update)
            reduced.removeEventListener("change", preferences)
            tricks.destroy()
            destroyFrog()
        }
    }, [])

    return (
        <div ref={rootRef} className="flex min-w-0 flex-col items-center gap-8">
            <div
                ref={slotRef}
                className="group/frog relative aspect-[320/336] w-[min(68vw,340px)]"
                aria-hidden="true"
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/frog-mascot/frog-static.png"
                    alt=""
                    width={320}
                    height={336}
                    className="h-full w-full object-contain [image-rendering:pixelated] group-data-[ready=true]/frog:invisible"
                />
                <div
                    ref={hostRef}
                    className="pointer-events-none absolute inset-0 opacity-0 group-data-[ready=true]/frog:opacity-100"
                />
                <FrogTrickArtwork />
            </div>
            <button
                ref={buttonRef}
                type="button"
                className="min-h-12 rounded-full border border-preview-white/40 px-7 py-3 text-xl aria-disabled:opacity-60"
                aria-describedby="not-found-trick-status"
            >
                Do a trick
            </button>
            <p
                ref={statusRef}
                id="not-found-trick-status"
                role="status"
                className="min-h-12 max-w-xs text-center text-base text-preview-white/70"
            />
        </div>
    )
}
