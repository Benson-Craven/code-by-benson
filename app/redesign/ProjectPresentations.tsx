"use client"

import { Fragment, useEffect, useRef } from "react"
import Link from "next/link"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import {
    heldPresentationQuery,
    presentationProgress,
    projectPresentations,
    responsivePresentationProgress,
    responsiveStageFits,
} from "./projectPresentationData"
import styles from "./redesign.module.css"

export default function ProjectPresentations() {
    const rootRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger)
        const root = rootRef.current!
        const sections = Array.from(
            root.querySelectorAll<HTMLElement>("[data-project]"),
        )
        const media = gsap.matchMedia()
        let disposed = false
        media.add(
            {
                held: heldPresentationQuery,
                responsive: "(max-width: 1023px)",
                motion: "(prefers-reduced-motion: no-preference)",
            },
            (context) => {
                if (context.conditions?.motion)
                    sections.forEach((section) =>
                        gsap.from(
                            section.querySelectorAll("[data-title-letter]"),
                            {
                                yPercent: 110,
                                opacity: 0,
                                duration: 0.6,
                                stagger: 0.035,
                                ease: "power3.out",
                                scrollTrigger: {
                                    trigger: section,
                                    start: "top 80%",
                                    toggleActions: "play none none reverse",
                                },
                            },
                        ),
                    )
                if (
                    context.conditions?.responsive &&
                    context.conditions?.motion
                ) {
                    const cleanups = sections.map((section) => {
                        const heading =
                            section.querySelector<HTMLElement>("header")!
                        const devices = section.querySelector<HTMLElement>(
                            `.${styles.projectDevices}`,
                        )!
                        const browser = section.querySelector<HTMLElement>(
                            `.${styles.browserFrame}`,
                        )!
                        const slides = Array.from(
                            section.querySelectorAll<HTMLElement>(
                                "[data-responsive-slide]",
                            ),
                        )
                        const bubbles = Array.from(
                            section.querySelectorAll<HTMLElement>(
                                "[data-bubble]",
                            ),
                        )
                        const phone =
                            section.querySelector<HTMLElement>("[data-phone]")!
                        const phoneWrapper = phone.parentElement!
                        const clearPresentation = () => {
                            gsap.set(
                                [...slides, browser, ...bubbles, phoneWrapper],
                                {
                                    clearProps: "opacity",
                                },
                            )
                            gsap.set(phone, { clearProps: "transform" })
                        }
                        let trigger: ScrollTrigger | undefined
                        let flowTriggers: ScrollTrigger[] = []
                        const setup = () => {
                            trigger?.kill()
                            flowTriggers.forEach((item) => item.kill())
                            flowTriggers = []
                            clearPresentation()
                            section.dataset.responsive = "held"
                            const frogHeight =
                                section.querySelector<HTMLElement>(
                                    "[data-frog-slot]",
                                )!.offsetHeight
                            const bubbleBottom = parseFloat(
                                getComputedStyle(bubbles[0].parentElement!)
                                    .bottom,
                            )
                            const narration = Math.max(
                                frogHeight,
                                bubbleBottom +
                                    Math.max(
                                        ...bubbles.map(
                                            (bubble) => bubble.offsetHeight,
                                        ),
                                    ),
                            )
                            section.style.setProperty(
                                "--narration-height",
                                `${narration}px`,
                            )
                            const fits = responsiveStageFits(
                                innerHeight,
                                heading.offsetHeight,
                                devices.offsetHeight,
                                narration,
                            )
                            section.dataset.responsive = fits ? "held" : "flow"
                            if (!fits) {
                                slides.forEach((slide) => {
                                    const paint = () => {
                                        const rect =
                                            slide.getBoundingClientRect()
                                        gsap.set(slide, {
                                            opacity: Math.max(
                                                0,
                                                Math.min(
                                                    1,
                                                    (innerHeight - rect.top) /
                                                        (innerHeight * 0.2),
                                                    rect.bottom /
                                                        (innerHeight * 0.2),
                                                ),
                                            ),
                                        })
                                    }
                                    flowTriggers.push(
                                        ScrollTrigger.create({
                                            trigger: slide,
                                            start: "top bottom",
                                            end: "bottom top",
                                            onUpdate: paint,
                                            onRefresh: paint,
                                        }),
                                    )
                                    paint()
                                })
                                return
                            }
                            const paint = (progress: number) => {
                                const state =
                                    responsivePresentationProgress(progress)
                                const laptopOpacity = Math.min(
                                    1,
                                    state.slides
                                        .slice(0, 3)
                                        .reduce((sum, value) => sum + value, 0),
                                )
                                slides.slice(0, 3).forEach((slide, index) =>
                                    gsap.set(slide, {
                                        opacity:
                                            index < 3 && laptopOpacity > 0
                                                ? state.slides[index] /
                                                  laptopOpacity
                                                : state.slides[index],
                                    }),
                                )
                                gsap.set(browser, { opacity: laptopOpacity })
                                gsap.set(phoneWrapper, {
                                    opacity: state.phoneOpacity,
                                })
                                gsap.set(phone, {
                                    rotationY: state.phoneRotation,
                                })
                                bubbles.forEach((bubble, index) =>
                                    gsap.set(bubble, {
                                        opacity: state.bubbles[index],
                                    }),
                                )
                            }
                            trigger = ScrollTrigger.create({
                                trigger: section,
                                start: "top top",
                                end: () =>
                                    `+=${section.offsetHeight - innerHeight}`,
                                onUpdate: (self) => paint(self.progress),
                                onRefresh: (self) => paint(self.progress),
                            })
                            paint(trigger.progress)
                        }
                        const safeSetup = () => {
                            try {
                                setup()
                            } catch {
                                trigger?.kill()
                                flowTriggers.forEach((item) => item.kill())
                                delete section.dataset.responsive
                                clearPresentation()
                            }
                        }
                        safeSetup()
                        window.addEventListener("resize", safeSetup)
                        void document.fonts.ready.then(() => {
                            if (!disposed && section.dataset.responsive) {
                                safeSetup()
                                ScrollTrigger.refresh()
                            }
                        })
                        return () => {
                            window.removeEventListener("resize", safeSetup)
                            trigger?.kill()
                            flowTriggers.forEach((item) => item.kill())
                            delete section.dataset.responsive
                            section.style.removeProperty("--narration-height")
                            clearPresentation()
                        }
                    })
                    return () => cleanups.forEach((cleanup) => cleanup())
                }
                if (!context.conditions?.held) return
                sections.forEach((section) => {
                    section.dataset.held = "true"
                    const strip = section.querySelector<HTMLElement>(
                        "[data-screen-strip]",
                    )!
                    const phone =
                        section.querySelector<HTMLElement>("[data-phone]")!
                    const bubbles =
                        section.querySelectorAll<HTMLElement>("[data-bubble]")
                    const paint = (progress: number) => {
                        const state = presentationProgress(progress)
                        gsap.set(strip, { yPercent: (-state.screen * 100) / 3 })
                        gsap.set(phone, { rotationY: state.phoneRotation })
                        bubbles.forEach((bubble, index) =>
                            gsap.set(bubble, { opacity: state.bubbles[index] }),
                        )
                    }
                    ScrollTrigger.create({
                        trigger: section,
                        start: "top top",
                        end: () =>
                            `+=${section.offsetHeight - window.innerHeight}`,
                        onUpdate: (self) => paint(self.progress),
                        onRefresh: (self) => paint(self.progress),
                    })
                    paint(0)
                })
                return () =>
                    sections.forEach((section) => {
                        delete section.dataset.held
                        gsap.set(
                            section.querySelectorAll(
                                "[data-screen-strip], [data-phone]",
                            ),
                            { clearProps: "transform" },
                        )
                        gsap.set(section.querySelectorAll("[data-bubble]"), {
                            clearProps: "opacity",
                        })
                    })
            },
        )
        const refresh = () => {
            if (!disposed) ScrollTrigger.refresh()
        }
        const images = Array.from(root.querySelectorAll("img"))
        images.forEach((image) => {
            image.addEventListener("load", refresh)
            image.addEventListener("error", refresh)
        })
        void document.fonts.ready.then(refresh)
        const visibility = () => {
            gsap.getTweensOf(
                root.querySelectorAll("[data-title-letter]"),
            ).forEach((tween) => tween.paused(document.hidden))
        }
        document.addEventListener("visibilitychange", visibility)
        window.addEventListener("resize", refresh)
        refresh()
        return () => {
            disposed = true
            media.revert()
            document.removeEventListener("visibilitychange", visibility)
            window.removeEventListener("resize", refresh)
            images.forEach((image) => {
                image.removeEventListener("load", refresh)
                image.removeEventListener("error", refresh)
            })
        }
    }, [])

    return (
        <div ref={rootRef}>
            {projectPresentations.map((project) => (
                <section
                    key={project.slug}
                    className={styles.project}
                    data-project={project.slug}
                    data-side={project.side}
                    data-frog-section
                    aria-labelledby={`${project.slug}-title`}
                >
                    <div className={styles.projectStage}>
                        <header className={styles.projectHeading}>
                            <h2 id={`${project.slug}-title`}>
                                <span className="sr-only">{project.title}</span>
                                <span aria-hidden="true">
                                    {project.title
                                        .split(" ")
                                        .map((word, wordIndex) => (
                                            <Fragment key={wordIndex}>
                                                {wordIndex > 0 ? " " : null}
                                                <span
                                                    className={styles.titleWord}
                                                >
                                                    {Array.from(word).map(
                                                        (letter, index) => (
                                                            <span
                                                                data-title-letter
                                                                key={index}
                                                            >
                                                                {letter}
                                                            </span>
                                                        ),
                                                    )}
                                                </span>
                                            </Fragment>
                                        ))}
                                </span>
                            </h2>
                            <Link
                                href={project.href}
                                data-project-link
                                data-project-direction="open"
                                data-project-slug={project.slug}
                                data-project-tint={project.tint}
                            >
                                View project
                                <span className="sr-only">
                                    : {project.title}
                                </span>
                            </Link>
                        </header>
                        <div className={styles.projectDevices}>
                            <div className={styles.browserFrame}>
                                <div
                                    className={styles.browserBar}
                                    aria-hidden="true"
                                >
                                    <span>● ● ●</span>
                                    <span>{project.title}</span>
                                </div>
                                <div className={styles.desktopScreen}>
                                    <div
                                        className={styles.screenStrip}
                                        data-screen-strip
                                    >
                                        {project.desktop.map((media, index) => (
                                            <figure
                                                className={styles.desktopView}
                                                data-responsive-slide
                                                key={index}
                                            >
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={media.src}
                                                    alt={media.alt}
                                                    width={1440}
                                                    height={900}
                                                    loading="lazy"
                                                    data-project-cover={
                                                        index === 0
                                                            ? project.slug
                                                            : undefined
                                                    }
                                                    style={{
                                                        objectPosition:
                                                            media.position,
                                                    }}
                                                />
                                                <figcaption>
                                                    {media.label}
                                                </figcaption>
                                            </figure>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div
                                className={styles.phonePerspective}
                                aria-hidden="true"
                            >
                                <div className={styles.phone} data-phone>
                                    {(["front", "back"] as const).map(
                                        (face) => (
                                            <div
                                                className={styles.phoneFace}
                                                data-face={face}
                                                data-responsive-slide
                                                key={face}
                                            >
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={
                                                        project.phone[face].src
                                                    }
                                                    alt=""
                                                    width={1440}
                                                    height={900}
                                                    loading="lazy"
                                                    style={{
                                                        objectPosition:
                                                            project.phone[face]
                                                                .position,
                                                    }}
                                                />
                                                <span>
                                                    {project.phone[face].label}
                                                </span>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className={styles.projectNarrator}>
                            <div className={styles.bubbles}>
                                {project.bubbles.map((bubble) => (
                                    <p data-bubble key={bubble}>
                                        {bubble}
                                    </p>
                                ))}
                            </div>
                            <div
                                className={`${styles.frogSlot} ${styles.projectFrog}`}
                                data-frog-slot
                                aria-hidden="true"
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src="/frog-mascot/frog-static.png"
                                    alt=""
                                    width={320}
                                    height={336}
                                />
                            </div>
                        </div>
                    </div>
                </section>
            ))}
        </div>
    )
}
