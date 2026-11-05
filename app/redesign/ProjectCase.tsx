"use client"

import { useEffect, useRef, type CSSProperties } from "react"
import Link from "next/link"
import type { RedesignProjectPage } from "./projectDetailData"
import BrowserFrame from "./BrowserFrame"
import PixelDevelop from "./PixelDevelop"
import PixelReveal from "./PixelReveal"
import ProjectFrog from "./ProjectFrog"
import WordReveal from "./WordReveal"
import { projectDetailPath } from "./projectNavigation"
import styles from "./redesign.module.css"

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
    const videoRef = useRef<HTMLVideoElement>(null)
    const liveSite = project.actions.find(
        (action) => action.kind === "live-site",
    )
    const clip = project.evidence.clip
    const clipDescriptionId = `${project.slug}-project-clip-description`
    const frameHost = frameHosts[project.slug] ?? "Local build"
    const leadShot = project.evidence.stills[0]
    const pairShots = [project.evidence.stills[1], project.evidence.stills[2]]
    // The reference pairs one claim with its screenshots. This uses the second
    // decision, which is the one whose evidence sits in the half-width frames.
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

    // The reference plays its clip while it is in view. Keep that, but pause as
    // soon as the frame leaves and never start for reduced-motion readers.
    useEffect(() => {
        const video = videoRef.current
        if (!video) return
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
            return

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        void video.play().catch(() => undefined)
                    } else {
                        video.pause()
                    }
                })
            },
            { threshold: 0.6 },
        )
        observer.observe(video)
        return () => observer.disconnect()
    }, [])

    return (
        <div
            ref={rootRef}
            className={styles.preview}
            data-redesign
            data-project-page={project.slug}
        >
            <a href="#project-main" className={styles.skip}>
                Skip to content
            </a>
            <main id="project-main" tabIndex={-1}>
                <article>
                    <header
                        className={styles.caseHero}
                        style={{ "--case-tint": tint } as CSSProperties}
                    >
                        <div className={styles.caseTopbar}>
                            <Link
                                href="/#work"
                                className={styles.casePill}
                                data-project-link
                                data-project-direction="close"
                                data-project-slug={project.slug}
                                data-project-tint={tint}
                            >
                                <span aria-hidden="true">←</span> All work
                            </Link>
                            {liveSite?.kind === "live-site" ? (
                                <a
                                    className={styles.casePill}
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

                        <div className={styles.caseHeroInner}>
                            <h1 className={styles.caseTitle}>
                                {project.title}
                            </h1>
                            <dl className={styles.caseMeta}>
                                <div>
                                    <dt>Year</dt>
                                    <dd>{project.timeframe}</dd>
                                </div>
                                <div>
                                    <dt>Role</dt>
                                    <dd>{project.ownership.role}</dd>
                                </div>
                                <div>
                                    <dt>Stack</dt>
                                    <dd>{project.stack.join(" · ")}</dd>
                                </div>
                            </dl>
                            <figure
                                className={styles.caseCover}
                                data-project-hero={project.slug}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={project.cover.src}
                                    alt={project.cover.alt}
                                    width={project.cover.width}
                                    height={project.cover.height}
                                    loading="eager"
                                    fetchPriority="high"
                                />
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
                        className={styles.caseIntro}
                        aria-labelledby="project-context"
                    >
                        <div className={styles.caseSectionInner}>
                            <WordReveal
                                text={preview.lead}
                                className={styles.caseLead}
                            />
                            <div className={styles.caseIntroCopy}>
                                <h2 id="project-context" className="sr-only">
                                    Context
                                </h2>
                                <WordReveal text={preview.note} />
                            </div>
                        </div>
                    </section>

                    <section
                        className={styles.caseShots}
                        aria-labelledby="project-screens"
                    >
                        <div className={styles.caseSectionInner}>
                            <figure className={styles.caseShotWide}>
                                <BrowserFrame label={frameHost}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={leadShot.src}
                                        alt={leadShot.alt}
                                        width={leadShot.width}
                                        height={leadShot.height}
                                        loading="eager"
                                    />
                                    <PixelDevelop delayMs={120} />
                                </BrowserFrame>
                            </figure>

                            <div className={styles.caseShotHeader}>
                                <h2 id="project-screens" data-case-reveal>
                                    {narrative.title}
                                </h2>
                                <WordReveal text={narrative.approach} />
                            </div>

                            <div className={styles.caseShotPair}>
                                {pairShots.map((still) => (
                                    <figure
                                        key={still.id}
                                        className={styles.caseShotHalf}
                                    >
                                        <BrowserFrame label={frameHost}>
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={still.src}
                                                alt={still.alt}
                                                width={still.width}
                                                height={still.height}
                                                loading="lazy"
                                            />
                                            <PixelDevelop delayMs={80} />
                                        </BrowserFrame>
                                    </figure>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section
                        className={styles.caseClipSection}
                        aria-labelledby="project-clip"
                    >
                        <h2 id="project-clip" className="sr-only">
                            Walkthrough
                        </h2>
                        <figure className={styles.caseClipFrame}>
                            <BrowserFrame label={frameHost}>
                                <video
                                    ref={videoRef}
                                    controls={clip.controls}
                                    preload={clip.preload}
                                    playsInline={clip.playsInline}
                                    muted={clip.muted}
                                    poster={clip.poster}
                                    aria-describedby={clipDescriptionId}
                                >
                                    <source src={clip.src} type="video/mp4" />
                                    {clip.captionsSrc ? (
                                        <track
                                            kind="captions"
                                            src={clip.captionsSrc}
                                            srcLang="en"
                                            label="English"
                                            default
                                        />
                                    ) : null}
                                    Your browser does not support embedded
                                    video.
                                </video>
                                <PixelDevelop poster={clip.poster} />
                            </BrowserFrame>
                            <p id={clipDescriptionId} className="sr-only">
                                {clip.description}
                            </p>
                        </figure>
                    </section>

                    <section
                        className={styles.caseNext}
                        style={{ "--case-tint": nextTint } as CSSProperties}
                        aria-labelledby="project-next"
                    >
                        <div className={styles.caseSectionInner}>
                            <p
                                id="project-next"
                                className={styles.caseNextLabel}
                            >
                                Next project
                            </p>
                            <Link
                                href={projectDetailPath(nextProject.slug)}
                                className={styles.caseNextCard}
                                data-project-link
                                data-project-direction="open"
                                data-project-slug={nextProject.slug}
                                data-project-tint={nextTint}
                            >
                                <span className={styles.caseNextTitle}>
                                    {nextProject.title}
                                    <span aria-hidden="true">→</span>
                                </span>
                                <span
                                    className={styles.caseNextMedia}
                                    data-project-cover={nextProject.slug}
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
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

            <footer className={styles.caseFooter}>
                <div className={styles.caseFooterRow}>
                    <a className={styles.caseEmail} href={contactEmail}>
                        Say hi
                    </a>
                    <div className={styles.caseFooterLinks}>
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
                    <p className={styles.caseCopyright}>© 2026 Benson Craven</p>
                </div>
            </footer>

            <ProjectFrog slug={project.slug} />
        </div>
    )
}
