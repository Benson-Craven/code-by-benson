"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import {
    heldPresentationQuery,
    presentationProgress,
    projectPresentations,
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
                motion: "(prefers-reduced-motion: no-preference)",
            },
            (context) => {
                if (!context.conditions?.held) {
                    if (context.conditions?.motion)
                        sections.forEach((section) =>
                            gsap.from(section.querySelector("header"), {
                                opacity: 0,
                                y: 16,
                                duration: 0.35,
                                scrollTrigger: {
                                    trigger: section,
                                    start: "top 90%",
                                    toggleActions: "play none none reverse",
                                },
                            }),
                        )
                    return
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
        window.addEventListener("resize", refresh)
        refresh()
        return () => {
            disposed = true
            media.revert()
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
                                {project.title}
                            </h2>
                            <Link href={project.href}>
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
                                                key={index}
                                            >
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={media.src}
                                                    alt={media.alt}
                                                    width={1440}
                                                    height={900}
                                                    loading="lazy"
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
