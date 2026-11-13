import Link from "next/link"
import TrickFrog from "./redesign/TrickFrog"
import "./redesign/preview.css"

export default function NotFound() {
    return (
        <div className="preview-root bg-preview-black text-preview-white">
            <a
                href="#main-content"
                className="fixed left-6 top-4 z-10 -translate-y-[200%] bg-preview-white p-3 text-preview-black focus:translate-y-0"
            >
                Skip to content
            </a>
            <main
                id="main-content"
                tabIndex={-1}
                className="flex min-h-svh flex-col px-[max(4.72vw,24px)] py-8 grid-paper [--grid-line:#fbfbf80a] md:py-12"
            >
                <header className="flex items-center justify-between gap-6 text-lg">
                    <Link href="/" className="py-2 font-bold">
                        Benson Craven
                    </Link>
                    <p className="text-preview-white/60">
                        404 · Page not found
                    </p>
                </header>
                <div className="my-auto grid items-center gap-16 py-20 lg:grid-cols-[minmax(0,1fr)_40%] lg:gap-8">
                    <div>
                        <h1 className="max-w-3xl text-[clamp(64px,9.93vw,144px)] font-semibold leading-[0.9] tracking-[-0.04em]">
                            Well, this is awkward.
                        </h1>
                        <p className="mt-8 max-w-xl text-[clamp(24px,2.5vw,36px)] leading-snug">
                            I can&apos;t find that page. He can&apos;t either,
                            but he does know a trick.
                        </p>
                        <Link
                            href="/"
                            className="mt-10 inline-flex min-h-12 items-center gap-4 text-2xl underline decoration-preview-white/40 underline-offset-8"
                        >
                            Let&apos;s head home
                        </Link>
                    </div>
                    <TrickFrog />
                </div>
            </main>
        </div>
    )
}
