"use client"

import { Fragment, useEffect, useRef } from "react"
import Link from "next/link"
import PreviewMedia from "./PreviewMedia"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import {
    heldPresentationQuery,
    presentationProgress,
    projectPresentations,
    responsivePresentationProgress,
    responsiveStageSize,
} from "./projectPresentationData"

function animateFlowBubble(bubble: HTMLElement) {
    const paint = () => {
        const top =
            bubble.getBoundingClientRect().top -
            Number(gsap.getProperty(bubble, "y"))
        const enter = Math.max(
            0,
            Math.min(1, (innerHeight - top) / (innerHeight * 0.2)),
        )
        const exit = Math.max(
            0,
            Math.min(1, 1 - (top + bubble.offsetHeight) / (innerHeight * 0.2)),
        )
        gsap.set(bubble, {
            opacity: enter * (1 - exit),
            y: 20 * (1 - enter - exit),
        })
    }
    const trigger = ScrollTrigger.create({
        trigger: bubble,
        start: "top bottom",
        end: "bottom top",
        onUpdate: paint,
        onRefresh: paint,
    })
    paint()
    return trigger
}

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
                        const stage =
                            section.querySelector<HTMLElement>(
                                ".preview-stage",
                            )!
                        const browser = section.querySelector<HTMLElement>(
                            "[data-browser-frame]",
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
                            section.style.removeProperty("--device-height")
                            section.style.removeProperty("--narration-height")
                            gsap.set(
                                [...slides, browser, ...bubbles, phoneWrapper],
                                {
                                    clearProps: "opacity,transform",
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
                            const stageStyle = getComputedStyle(stage)
                            const spacing =
                                parseFloat(stageStyle.paddingTop) +
                                parseFloat(stageStyle.paddingBottom) +
                                parseFloat(
                                    getComputedStyle(heading).marginBottom,
                                ) +
                                parseFloat(stageStyle.rowGap) * 2
                            const deviceHeight = responsiveStageSize(
                                stage.clientHeight,
                                heading.offsetHeight,
                                narration,
                                spacing,
                            )
                            section.dataset.responsive =
                                deviceHeight === null ? "flow" : "held"
                            if (deviceHeight === null) {
                                clearPresentation()
                                bubbles.forEach((bubble) =>
                                    flowTriggers.push(
                                        animateFlowBubble(bubble),
                                    ),
                                )
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
                            section.style.setProperty(
                                "--device-height",
                                `${deviceHeight}px`,
                            )
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
                                        y: state.bubbleY[index],
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
                        let active = true
                        safeSetup()
                        window.addEventListener("resize", safeSetup)
                        window.addEventListener("orientationchange", safeSetup)
                        void document.fonts.ready.then(() => {
                            if (!disposed && active) {
                                safeSetup()
                                ScrollTrigger.refresh()
                            }
                        })
                        return () => {
                            active = false
                            window.removeEventListener("resize", safeSetup)
                            window.removeEventListener(
                                "orientationchange",
                                safeSetup,
                            )
                            trigger?.kill()
                            flowTriggers.forEach((item) => item.kill())
                            delete section.dataset.responsive
                            section.style.removeProperty("--narration-height")
                            clearPresentation()
                        }
                    })
                    return () => cleanups.forEach((cleanup) => cleanup())
                }
                if (!context.conditions?.held) {
                    if (context.conditions?.motion)
                        sections.forEach((section) => {
                            section
                                .querySelectorAll<HTMLElement>("[data-bubble]")
                                .forEach(animateFlowBubble)
                        })
                    return () => {
                        sections.forEach((section) => {
                            gsap.set(
                                section.querySelectorAll("[data-bubble]"),
                                {
                                    clearProps: "opacity,transform",
                                },
                            )
                        })
                    }
                }
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
                            gsap.set(bubble, {
                                opacity: state.bubbles[index],
                                y: state.bubbleY[index],
                            }),
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
                            clearProps: "opacity,transform",
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
                    className="preview-project group relative px-[max(4.72vw,24px)] py-16 text-preview-black grid-paper-columns [--grid-line:#fbfbf81f] data-[project=chronic-pain-recovery]:bg-[#08d9d6] data-[project=nibbles-with-nifa]:bg-[#ff2e63] data-[project=waxlist]:bg-[#ffe506] data-[project=waxlist]:[--grid-line:#0b0b0c0f]"
                    data-project={project.slug}
                    data-side={project.side}
                    data-frog-section
                    aria-labelledby={`${project.slug}-title`}
                >
                    <div className="preview-stage mx-auto max-w-[1600px]">
                        <header className="preview-heading mb-10 flex flex-wrap items-baseline justify-between gap-6">
                            <h2
                                id={`${project.slug}-title`}
                                className="max-w-[900px] text-[clamp(36px,4.4vw,80px)] font-medium leading-[1.05] tracking-[-0.2rem] text-white group-data-[project=waxlist]:text-preview-black"
                            >
                                <span className="sr-only">{project.title}</span>
                                <span aria-hidden="true">
                                    {project.title
                                        .split(" ")
                                        .map((word, wordIndex) => (
                                            <Fragment key={wordIndex}>
                                                {wordIndex > 0 ? " " : null}
                                                <span className="mb-[-0.12em] inline-block overflow-clip whitespace-nowrap pb-[0.12em] align-top">
                                                    {Array.from(word).map(
                                                        (letter, index) => (
                                                            <span
                                                                className="inline-block"
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
                                className="project-action shrink-0"
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
                        <div className="relative pb-12" data-project-devices>
                            <div
                                className="overflow-hidden rounded-xl border-2 border-[#1e1e1e] bg-preview-white text-[#1e1e1e]"
                                data-browser-frame
                            >
                                <div
                                    className="flex items-center gap-6 px-4 py-2 text-xs leading-[1.5] tracking-normal"
                                    aria-hidden="true"
                                >
                                    <span className="tracking-[4px] text-[#777]">
                                        ● ● ●
                                    </span>
                                    <span>{project.title}</span>
                                </div>
                                <div className="preview-desktop-screen">
                                    <div data-screen-strip>
                                        {project.desktop.map((media, index) => (
                                            <figure
                                                className="preview-desktop-view relative m-0 aspect-[1440/900] bg-[#e6e6e0]"
                                                data-responsive-slide
                                                key={index}
                                            >
                                                <PreviewMedia
                                                    className="absolute inset-0 h-full w-full object-cover"
                                                    media={media}
                                                    cover={
                                                        index === 0
                                                            ? project.slug
                                                            : undefined
                                                    }
                                                />
                                                <figcaption className="pointer-events-none absolute left-0 top-0 bg-preview-white px-3 py-1.5 text-sm leading-[1.5] tracking-normal text-[#1e1e1e]">
                                                    {media.label}
                                                </figcaption>
                                            </figure>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="preview-phone-perspective relative mb-0 ml-auto mr-0 mt-6 aspect-[9/18] w-[clamp(100px,16vw,190px)] [perspective:1000px] max-lg:mx-auto max-lg:mt-6 max-lg:aspect-auto max-lg:w-[min(180px,50vw)] max-lg:[perspective:none]">
                                <div
                                    className="preview-phone relative h-full w-full [transform-style:preserve-3d]"
                                    data-phone
                                >
                                    {(["front", "back"] as const).map(
                                        (face) => (
                                            <div
                                                className="preview-phone-face absolute inset-0 overflow-hidden rounded-[26px] border-[7px] border-preview-black bg-preview-white [backface-visibility:hidden] after:absolute after:left-[32%] after:top-[5px] after:h-2.5 after:w-[36%] after:rounded-xl after:bg-preview-black after:content-[''] data-[face=back]:[transform:rotateY(180deg)]"
                                                data-face={face}
                                                data-responsive-slide
                                                key={face}
                                            >
                                                <PreviewMedia
                                                    className="h-full w-full object-cover"
                                                    media={project.phone[face]}
                                                />
                                                <span className="pointer-events-none absolute inset-x-0 top-5 bg-preview-white p-2 text-center text-xs leading-[1.5] tracking-normal text-[#1e1e1e]">
                                                    {project.phone[face].label}
                                                </span>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="preview-narrator mt-9">
                            <div className="grid gap-4" data-bubbles>
                                {project.bubbles.map((bubble) => (
                                    <p
                                        className="showcase-dialogue"
                                        data-bubble
                                        key={bubble}
                                    >
                                        <span
                                            className="showcase-dialogue-tail"
                                            aria-hidden="true"
                                        />
                                        <span className="relative text-base md:text-2xl">
                                            {bubble}
                                        </span>
                                    </p>
                                ))}
                            </div>
                            <div
                                className="preview-frog-slot preview-project-frog relative mt-6 aspect-[320/336] w-[min(100%,var(--project-frog-size))] max-w-[640px] justify-self-start group-data-[side=right]:ml-auto"
                                data-frog-slot
                                aria-hidden="true"
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    className="h-full w-full object-contain [image-rendering:pixelated] group-data-[frog-ready=true]:invisible"
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
