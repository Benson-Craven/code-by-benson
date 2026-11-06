import Link from "next/link"
import FrogTrickArtwork from "../redesign/FrogTrickArtwork"
import FrogPresentation from "../redesign/FrogPresentation"
import ProjectPresentations from "../redesign/ProjectPresentations"
import AllWork from "../redesign/AllWork"
import IntroParagraph from "../redesign/IntroParagraph"
import { cn } from "@/utils/cn"

function FrogSlot({
    className,
    trick = false,
}: {
    className?: string
    trick?: boolean
}) {
    return (
        <div
            className={cn(
                "preview-frog-slot relative aspect-[320/336] max-w-[640px] justify-self-end",
                className,
            )}
            data-frog-slot
            aria-hidden="true"
        >
            {/* The fallback is rendered from the same procedural rig as the canvas. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                className="h-full w-full object-contain [image-rendering:pixelated] group-data-[frog-ready=true]:invisible"
                src="/frog-mascot/frog-static.png"
                alt=""
                width={320}
                height={336}
            />
            {trick && (
                <>
                    <p
                        className="preview-footer-dialogue speech-tail-down pointer-events-none absolute bottom-[90%] left-0 z-[4] m-0 w-full rounded-[20px] bg-preview-white px-5 py-4 text-[clamp(18px,1.7vw,24px)] font-semibold leading-[1.3] text-preview-black"
                        data-frog-dialogue
                        hidden
                    />
                    <FrogTrickArtwork />
                </>
            )}
        </div>
    )
}

export default function Redesign() {
    return (
        <div className="preview-root group" data-redesign>
            <a
                href="#redesign-main"
                className="fixed left-6 top-4 z-10 -translate-y-[200%] bg-preview-white p-3 text-preview-black focus:translate-y-0"
            >
                Skip to content
            </a>
            <main id="redesign-main" tabIndex={-1}>
                <section
                    className="preview-hero flex min-h-[max(720px,100svh)] flex-col justify-between bg-preview-blue px-[max(4.72vw,24px)] pb-[74px] pt-[46px] text-preview-white grid-paper [--grid-line:#fbfbf80a] max-md:px-6 max-md:pb-9 max-md:pt-7 md:min-h-svh md:py-[clamp(24px,5svh,46px)]"
                    data-frog-section
                    aria-labelledby="redesign-title"
                >
                    <header className="flex items-start justify-between gap-6 text-[22px] leading-[1.1] max-md:text-lg">
                        <Link href="/" className="flex flex-col">
                            <strong className="font-bold">Benson Craven</strong>
                            <span>Full-stack developer</span>
                        </Link>
                        <nav
                            aria-label="Main navigation"
                            className="flex gap-8 text-lg max-md:gap-3 max-md:text-base"
                        >
                            <a href="#work" className="py-2.5 max-md:hidden">
                                All work
                            </a>
                            <a href="#contact" className="py-2.5">
                                Get in touch
                            </a>
                        </nav>
                    </header>
                    <div className="grid grid-cols-[minmax(0,1fr)_40%] items-end gap-3 pt-40 max-lg:block max-md:pt-[120px] md:pt-[clamp(24px,5svh,64px)]">
                        <h1 className="mb-10 text-[clamp(64px,9.93vw,180px)] font-semibold leading-[0.8] tracking-[-0.35rem] max-md:m-0 max-md:w-full max-md:text-[clamp(53px,10.8vw,82px)] max-md:leading-[0.9] max-md:tracking-[-0.02em] max-[359px]:text-[clamp(47px,14.7vw,53px)]">
                            I build things
                            <br />
                            for the <em className="font-normal">web</em>.
                        </h1>
                        <div className="preview-hero-guide w-full min-w-0 max-lg:mt-10">
                            <p
                                className="preview-greeting speech-tail-down relative mb-[18px] rounded-[20px] bg-preview-white px-[22px] py-[18px] text-[clamp(20px,1.9vw,28px)] font-semibold leading-[1.25] text-preview-black"
                                data-frog-greeting
                            >
                                Oh, hey! Follow me, I&apos;ll show you what
                                Benson has been up to.
                            </p>
                            <FrogSlot className="ml-auto w-full md:w-[min(100%,var(--project-frog-size))]" />
                        </div>
                    </div>
                </section>
                <section
                    id="intro"
                    className="preview-intro relative grid min-h-[max(792px,110svh)] grid-cols-[36%_1fr] items-center gap-x-[5%] px-[max(4.72vw,24px)] pb-[74px] pt-[46px] grid-paper [--grid-line:#0b0b0c0a] max-lg:flex max-lg:flex-col max-md:min-h-[110svh] max-md:justify-center max-md:gap-10 max-md:px-6 max-md:pb-9 max-md:pt-20"
                    data-frog-section
                    aria-label="About Benson"
                >
                    <IntroParagraph className="col-start-2 max-w-[800px] py-[100px] text-[clamp(30px,3.33vw,60px)] font-medium leading-[1.25] tracking-[-0.1rem] max-md:p-0 max-md:text-[clamp(29px,5.5vw,40px)]" />
                    <FrogSlot className="absolute bottom-6 left-[2%] w-[36%] max-lg:relative max-lg:inset-auto max-lg:self-center" />
                </section>
                <ProjectPresentations />
                <AllWork />
            </main>
            <footer
                id="contact"
                className="preview-contact flex min-h-[max(720px,100svh)] flex-col justify-between bg-preview-black px-[max(4.72vw,24px)] pb-[74px] pt-[clamp(96px,13.9vw,200px)] text-preview-white grid-paper [--grid-line:#fbfbf80a] max-md:px-6 max-md:pb-9 max-md:pt-[88px] md:min-h-svh md:py-[clamp(24px,5svh,46px)]"
                data-frog-section
            >
                <div>
                    <h2 className="text-[clamp(64px,9.93vw,180px)] font-semibold leading-[0.9] tracking-[-0.3rem] max-md:text-[clamp(54px,10.8vw,82px)] md:text-[clamp(54px,min(9.93vw,12svh),180px)]">
                        Got something in mind?
                    </h2>
                    <p className="mt-9 text-[clamp(28px,3.47vw,58px)] md:mt-[clamp(16px,3svh,36px)]">
                        I&apos;m taking on new work
                    </p>
                    <a
                        className="mt-[68px] inline-block text-[clamp(52px,5.55vw,90px)] max-md:mt-10 md:mt-[clamp(20px,4svh,48px)]"
                        href="mailto:bensoncraven@hotmail.co.uk"
                    >
                        Say hi
                    </a>
                </div>
                <div className="preview-footer-bottom mt-[72px] grid grid-cols-[minmax(0,1fr)_40%] items-end gap-9 max-md:mt-[60px] max-md:flex max-md:flex-col max-md:items-center max-md:gap-10 md:mt-6">
                    <div className="grid max-w-[690px] grid-cols-2 items-center gap-x-8 gap-y-16 max-md:w-full max-md:gap-x-5 max-md:gap-y-7 md:gap-y-[clamp(24px,5svh,64px)] [&>:is(a,button)]:min-h-[44px] [&>:is(a,button)]:w-fit [&>:is(a,button)]:text-left [&>:is(a,button)]:text-[25px] max-md:[&>:is(a,button)]:text-[21px] [&>a:nth-child(-n+2)]:text-[clamp(28px,2.78vw,48px)] [&>a:nth-child(-n+2)]:font-bold">
                        <a href="https://www.linkedin.com/in/benson-craven/">
                            LinkedIn
                        </a>
                        <a href="https://github.com/Benson-Craven">GitHub</a>
                        <Link href="/">Benson Codes</Link>
                        <button type="button" data-frog-trick>
                            Do a trick
                        </button>
                        <span
                            data-frog-trick-status
                            role="status"
                            className="min-h-[1.5em] font-mono text-sm"
                        />
                    </div>
                    <FrogSlot
                        trick
                        className="w-full max-lg:ml-auto md:w-[min(100%,var(--project-frog-size))]"
                    />
                </div>
            </footer>
            <FrogPresentation />
        </div>
    )
}
