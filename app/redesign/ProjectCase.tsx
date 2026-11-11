"use client"

import { useEffect, useRef, type CSSProperties } from "react"
import Link from "next/link"
import type { RedesignProjectPage } from "./projectDetailData"
import BrowserFrame from "./BrowserFrame"
import PreviewMedia from "./PreviewMedia"
import { showcaseMedia } from "./projectPresentationData"
import type { PreviewMedia as PreviewMediaData } from "./projectPresentationData"
import PixelReveal from "./PixelReveal"
import ProjectFrog from "./ProjectFrog"
import WordReveal from "./WordReveal"
import { projectDetailPath } from "./projectNavigation"

const contactEmail = "mailto:bensoncraven@hotmail.co.uk"

// Browser chrome stays truthful: published work shows its public host, and the
// unpublished project is labelled as a local build.
const frameHosts: Record<string, string> = {
    "chronic-pain-recovery": "chronicpainrecovery.ie",
    "nibbles-with-nifa": "nibbles-with-nifa.vercel.app",
    waxlist: "Local build",
}

export default function ProjectCase({
    project,
    nextProject,
    tint,
    nextTint,
    preview,
}: RedesignProjectPage) {
    const rootRef = useRef<HTMLDivElement>(null)
    const liveSite = project.actions.find(
        (action) => action.kind === "live-site",
    )
    const frameHost = frameHosts[project.slug] ?? "Local build"
    // The project page shows real product media only. Architecture diagrams
    // stay on the /work case studies, where they sit beside the decision they
    // explain.
    const desktopMedia = showcaseMedia[project.slug]?.desktop
    const wideMedia = desktopMedia?.[0]
    const pairMedia = [desktopMedia?.[1], desktopMedia?.[2]].filter(
        (media): media is PreviewMediaData => media !== undefined,
    )
    // Nibbles' clip opens on the homepage and then scrolls. In a 16:10 hero it
    // lands mid-scroll and cuts the site heading, so the hero keeps the real
    // still while the clip plays in the framed section below. Waxlist keeps its
    // cover still in the hero for the same reason: its clip starts on a moving
    // gradient.
    const heroMedia =
        project.slug === "chronic-pain-recovery" ? wideMedia : undefined
    // The reference pairs one claim with its product view. This uses the second
    // decision, which is the one the framed section illustrates.
    const narrative = project.caseStudy.decisions[1]

    useEffect(() => {
        const root = rootRef.current
        if (!root) return
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
            return

        const items = Array.from(
            root.querySelectorAll<HTMLElement>("[data-case-reveal]"),
        )
        if (items.length === 0) return

        items.forEach((item) => {
            const rect = item.getBoundingClientRect()
            if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
                item.dataset.visible = "true"
            }
        })
        root.dataset.reveal = "ready"

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return
                    ;(entry.target as HTMLElement).dataset.visible = "true"
                    observer.unobserve(entry.target)
                })
            },
            { rootMargin: "0px 0px -10% 0px", threshold: 0.04 },
        )

        items.forEach((item) => {
            if (item.dataset.visible !== "true") observer.observe(item)
        })

        return () => {
            observer.disconnect()
            delete root.dataset.reveal
            items.forEach((item) => delete item.dataset.visible)
        }
    }, [])

    return (
        <div
            ref={rootRef}
            className="preview-root group"
            data-redesign
            data-project-page={project.slug}
        >
            <a
                href="#project-main"
                className="fixed left-6 top-4 z-10 -translate-y-[200%] bg-preview-white p-3 text-preview-black focus:translate-y-0"
            >
                Skip to content
            </a>
            <main id="project-main" tabIndex={-1}>
                <article>
                    <header
                        className="relative bg-[var(--case-tint)] px-[max(4.72vw,24px)] pb-[clamp(64px,12svh,130px)] pt-[clamp(88px,12svh,150px)] text-preview-black grid-paper [--grid-line:#0b0b0c0a] max-md:pt-24"
                        style={{ "--case-tint": tint } as CSSProperties}
                    >
                        <div className="pointer-events-none fixed inset-x-0 top-0 z-[6] mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3 p-[16px_max(4.72vw,24px)] [&>*]:pointer-events-auto">
                            <Link
                                href="/#work"
                                className="project-action"
                                data-project-link
                                data-project-direction="close"
                                data-project-slug={project.slug}
                                data-project-tint={tint}
                            >
                                <span aria-hidden="true">←</span> All work
                            </Link>
                            {liveSite?.kind === "live-site" ? (
                                <a
                                    className="project-action"
                                    href={liveSite.href}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {liveSite.label}{" "}
                                    <span className="sr-only">
                                        {" "}
                                        (opens in a new tab)
                                    </span>
                                </a>
                            ) : null}
                        </div>

                        <div className="mx-auto grid max-w-[1600px] grid-cols-12 gap-x-5 pt-[clamp(36px,6vw,84px)] motion-safe:animate-case-hero-in">
                            <h1 className="col-span-full text-balance text-[clamp(52px,7.5vw,128px)] font-semibold leading-[0.9] tracking-[-0.045em] max-md:text-[clamp(42px,13vw,76px)] max-md:tracking-[-0.04em] md:col-span-10">
                                {project.title}
                            </h1>
                            <dl className="col-span-full mt-[clamp(24px,3.4vw,42px)] grid max-w-[760px] grid-cols-2 gap-x-5 gap-y-[18px] max-md:grid-cols-1 max-md:gap-[14px] md:col-span-10 md:grid-cols-3">
                                <div>
                                    <dt className="text-sm font-medium leading-[1.5] opacity-55">
                                        Year
                                    </dt>
                                    <dd className="mt-1 text-[clamp(16px,1.25vw,19px)] font-medium leading-[1.35]">
                                        {project.timeframe}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium leading-[1.5] opacity-55">
                                        Role
                                    </dt>
                                    <dd className="mt-1 text-[clamp(16px,1.25vw,19px)] font-medium leading-[1.35]">
                                        {project.ownership.role}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium leading-[1.5] opacity-55">
                                        Stack
                                    </dt>
                                    <dd className="mt-1 text-[clamp(16px,1.25vw,19px)] font-medium leading-[1.35]">
                                        {project.stack.join(" · ")}
                                    </dd>
                                </div>
                            </dl>
                            <figure
                                className="group/cover relative col-span-full mt-[clamp(28px,4vw,48px)] aspect-[16/10] overflow-hidden rounded-xl bg-preview-black md:col-span-8"
                                data-project-hero={project.slug}
                            >
                                {heroMedia ? (
                                    <PreviewMedia
                                        media={heroMedia}
                                        className="block h-full w-full object-cover"
                                    />
                                ) : (
                                    <>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            className="block h-full w-full object-cover"
                                            src={project.cover.src}
                                            alt={project.cover.alt}
                                            width={project.cover.width}
                                            height={project.cover.height}
                                            loading="eager"
                                            fetchPriority="high"
                                        />
                                    </>
                                )}
                                <PixelReveal
                                    src={project.cover.src}
                                    tint={tint}
                                    reveal
                                    delayMs={180}
                                />
                            </figure>
                        </div>
                    </header>

                    <section
                        className="bg-preview-white px-[max(4.72vw,24px)] py-[clamp(72px,14svh,168px)] text-preview-black grid-paper [--grid-line:#0b0b0c0a]"
                        aria-labelledby="project-context"
                    >
                        <div className="mx-auto max-w-[1600px]">
                            <WordReveal
                                text={preview.lead}
                                className="max-w-[1120px] text-[clamp(28px,3.3vw,56px)] font-semibold leading-[1.05] tracking-[-0.03em] max-md:text-xl max-md:leading-[1.35]"
                            />
                            <div className="mt-[clamp(32px,6vw,76px)] w-full md:ml-auto md:w-[min(100%,62%)]">
                                <h2 id="project-context" className="sr-only">
                                    Context
                                </h2>
                                <WordReveal
                                    text={preview.note}
                                    className="m-0 text-[clamp(20px,2vw,34px)] font-medium leading-[1.2] tracking-[-0.02em] max-md:text-xl max-md:leading-[1.35]"
                                />
                            </div>
                            <div className="mt-[clamp(48px,8vw,120px)] max-w-[760px] border-t border-[rgb(11_11_12_/_0.15)] pt-[clamp(28px,4vw,48px)]">
                                <p className="text-sm font-medium leading-[1.5] opacity-55">
                                    A note from me
                                </p>
                                <h3 className="mt-4 max-w-[540px] text-[clamp(26px,3vw,48px)] font-semibold leading-[1.02] tracking-[-0.03em]">
                                    {preview.personal.heading}
                                </h3>
                                <WordReveal
                                    text={preview.personal.body}
                                    className="mt-5 max-w-[680px] text-[clamp(20px,2vw,34px)] font-medium leading-[1.2] tracking-[-0.02em] max-md:text-xl max-md:leading-[1.35]"
                                />
                            </div>
                        </div>
                    </section>

                    <section
                        className="bg-[#e6e6e0] px-[max(4.72vw,24px)] py-[clamp(72px,14svh,168px)] text-preview-black grid-paper [--grid-line:#0b0b0c0a]"
                        aria-labelledby="project-screens"
                    >
                        <div className="mx-auto max-w-[1600px]">
                            {wideMedia ? (
                                <figure className="m-0 grid gap-3">
                                    <BrowserFrame label={frameHost}>
                                        <PreviewMedia
                                            media={wideMedia}
                                            className="block w-full"
                                        />
                                    </BrowserFrame>
                                </figure>
                            ) : null}

                            <div className="grid gap-5 py-[clamp(44px,10svh,120px)] md:grid-cols-2 md:items-start md:gap-5">
                                <h2
                                    id="project-screens"
                                    className="text-[clamp(28px,3.3vw,56px)] font-semibold leading-[1.05] tracking-[-0.03em]"
                                    data-case-reveal
                                >
                                    {narrative.title}
                                </h2>
                                <WordReveal
                                    text={narrative.approach}
                                    className="m-0 max-w-[760px] text-[clamp(20px,2vw,34px)] font-medium leading-[1.2] tracking-[-0.02em] max-md:text-xl max-md:leading-[1.35]"
                                />
                            </div>

                            {pairMedia.length > 0 ? (
                                <div className="grid gap-[clamp(28px,6vw,64px)] md:grid-cols-2 md:items-start md:gap-5">
                                    {pairMedia.map((media) => (
                                        <figure
                                            key={media.src}
                                            className="m-0 grid gap-3"
                                        >
                                            <BrowserFrame label={frameHost}>
                                                <PreviewMedia
                                                    media={media}
                                                    className="block w-full"
                                                />
                                            </BrowserFrame>
                                        </figure>
                                    ))}
                                </div>
                            ) : null}
                        </div>
                    </section>

                    <section
                        className="grid min-h-svh content-start bg-[var(--case-tint)] px-[max(4.72vw,24px)] pb-[clamp(48px,8svh,90px)] pt-[clamp(88px,14svh,170px)] text-preview-black grid-paper [--grid-line:#0b0b0c0a] max-md:min-h-0"
                        style={{ "--case-tint": nextTint } as CSSProperties}
                        aria-labelledby="project-next"
                    >
                        <div className="mx-auto grid w-full max-w-[1600px] gap-3">
                            <p
                                id="project-next"
                                className="text-sm leading-[1.5] opacity-55"
                            >
                                Next project
                            </p>
                            <Link
                                href={projectDetailPath(nextProject.slug)}
                                className="group/card grid gap-[clamp(20px,4vw,44px)] text-inherit no-underline hover:no-underline"
                                data-project-link
                                data-project-direction="open"
                                data-project-slug={nextProject.slug}
                                data-project-tint={nextTint}
                            >
                                <span className="flex items-baseline justify-between gap-4 text-balance text-[clamp(52px,7.5vw,128px)] font-semibold leading-[0.9] tracking-[-0.045em] max-md:text-[clamp(42px,13vw,76px)] max-md:tracking-[-0.04em]">
                                    {nextProject.title}
                                    <span aria-hidden="true">→</span>
                                </span>
                                <span
                                    className="preview-next-media block w-[min(100%,92svh)] max-w-[900px] overflow-hidden rounded-xl bg-preview-black max-md:w-full"
                                    data-project-cover={nextProject.slug}
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        className="block aspect-[3/2] h-auto w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:scale-[1.04] group-focus-visible/card:scale-[1.04] motion-reduce:transition-none"
                                        src={nextProject.cover.src}
                                        alt=""
                                        width={nextProject.cover.width}
                                        height={nextProject.cover.height}
                                        loading="lazy"
                                    />
                                </span>
                            </Link>
                        </div>
                    </section>
                </article>
            </main>

            <footer className="bg-preview-black px-[max(4.72vw,24px)] py-[clamp(44px,6vw,84px)] text-preview-white max-md:pb-[104px]">
                <div className="mx-auto flex max-w-[1600px] flex-wrap items-baseline justify-between gap-x-10 gap-y-6">
                    <a
                        className="text-[clamp(28px,3vw,44px)] font-semibold underline underline-offset-[0.12em]"
                        href={contactEmail}
                    >
                        Say hi
                    </a>
                    <div className="flex flex-wrap gap-6 text-base">
                        <a href="https://www.linkedin.com/in/benson-craven/">
                            LinkedIn
                        </a>
                        <a href="https://github.com/Benson-Craven">GitHub</a>
                        <Link
                            href="/#work"
                            data-project-link
                            data-project-direction="close"
                            data-project-slug={project.slug}
                            data-project-tint={tint}
                        >
                            All work
                        </Link>
                    </div>
                    <p className="text-[13px] opacity-55">
                        © 2026 Benson Craven
                    </p>
                </div>
            </footer>

            <ProjectFrog slug={project.slug} />
        </div>
    )
}
