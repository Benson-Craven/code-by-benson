"use client"

import Image from "next/image"
import Link from "next/link"
import {
    useEffect,
    useRef,
    useState,
    type FocusEvent,
    type PointerEvent,
} from "react"
import AnimatedLink from "./AnimatedLink"

type ShowcaseAction = {
    kind: "case-study" | "live-site" | "source"
    label: string
    href: string
}

export type ProjectShowcaseItem = {
    slug: string
    title: string
    summary: string
    availabilityLabel: string
    timeframe: string
    role: string
    stack: readonly string[]
    capabilities: readonly string[]
    actions: readonly ShowcaseAction[]
    cover: {
        src: string
        alt: string
        caption?: string
    }
}

type ProjectShowcaseProps = {
    projects: readonly ProjectShowcaseItem[]
}

type Position = { x: number; y: number }

const previewGap = 24
const viewportPadding = 16
const previewMediaQuery =
    "(min-width: 1024px) and (hover: hover) and (pointer: fine)"

export default function ProjectShowcase({ projects }: ProjectShowcaseProps) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null)
    const previewRef = useRef<HTMLDivElement>(null)
    const animationRef = useRef<number | null>(null)
    const currentPositionRef = useRef<Position>({ x: 0, y: 0 })
    const targetPositionRef = useRef<Position>({ x: 0, y: 0 })
    const hasPointerPositionRef = useRef(false)

    useEffect(() => {
        return () => {
            if (animationRef.current !== null) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [])

    const writePreviewPosition = ({ x, y }: Position) => {
        if (previewRef.current) {
            previewRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
        }
    }

    const animatePreview = () => {
        const current = currentPositionRef.current
        const target = targetPositionRef.current
        const next = {
            x: current.x + (target.x - current.x) * 0.18,
            y: current.y + (target.y - current.y) * 0.18,
        }

        currentPositionRef.current = next
        writePreviewPosition(next)

        if (
            Math.abs(target.x - next.x) > 0.25 ||
            Math.abs(target.y - next.y) > 0.25
        ) {
            animationRef.current = requestAnimationFrame(animatePreview)
        } else {
            currentPositionRef.current = target
            writePreviewPosition(target)
            animationRef.current = null
        }
    }

    const positionPreview = (clientX: number, clientY: number) => {
        const previewWidth = previewRef.current?.offsetWidth ?? 336
        const previewHeight = previewRef.current?.offsetHeight ?? 210
        const roomOnRight = clientX + previewGap + previewWidth
        const x =
            roomOnRight <= window.innerWidth - viewportPadding
                ? clientX + previewGap
                : clientX - previewWidth - previewGap
        const y = Math.min(
            Math.max(clientY - previewHeight / 2, viewportPadding),
            window.innerHeight - previewHeight - viewportPadding,
        )
        const target = {
            x: Math.max(viewportPadding, x),
            y: Math.max(viewportPadding, y),
        }

        targetPositionRef.current = target

        if (
            !hasPointerPositionRef.current ||
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
            hasPointerPositionRef.current = true
            currentPositionRef.current = target
            writePreviewPosition(target)

            if (animationRef.current !== null) {
                cancelAnimationFrame(animationRef.current)
                animationRef.current = null
            }

            return
        }

        if (animationRef.current === null) {
            animationRef.current = requestAnimationFrame(animatePreview)
        }
    }

    const handlePointerMove = (
        index: number,
        event: PointerEvent<HTMLElement>,
    ) => {
        if (
            event.pointerType !== "mouse" ||
            !window.matchMedia(previewMediaQuery).matches
        ) {
            return
        }

        setActiveIndex(index)
        positionPreview(event.clientX, event.clientY)
    }

    const handlePointerLeave = (
        index: number,
        event: PointerEvent<HTMLElement>,
    ) => {
        if (event.currentTarget.closest("a") === document.activeElement) {
            handleFocus(index)
            return
        }

        setActiveIndex(null)
        hasPointerPositionRef.current = false

        if (animationRef.current !== null) {
            cancelAnimationFrame(animationRef.current)
            animationRef.current = null
        }
    }

    const handleFocus = (index: number) => {
        if (!window.matchMedia(previewMediaQuery).matches) return

        setActiveIndex(index)

        const previewWidth = previewRef.current?.offsetWidth ?? 336
        const previewHeight = previewRef.current?.offsetHeight ?? 210
        const keyboardPosition = {
            x: Math.max(
                viewportPadding,
                window.innerWidth -
                    previewWidth -
                    Math.max(32, window.innerWidth * 0.04),
            ),
            y: Math.max(
                viewportPadding,
                (window.innerHeight - previewHeight) / 2,
            ),
        }

        currentPositionRef.current = keyboardPosition
        targetPositionRef.current = keyboardPosition
        writePreviewPosition(keyboardPosition)
    }

    const handleBlur = (event: FocusEvent<HTMLElement>) => {
        if (event.currentTarget.contains(event.relatedTarget)) return

        setActiveIndex(null)
    }

    return (
        <div className="relative">
            <div
                ref={previewRef}
                data-project-preview=""
                aria-hidden="true"
                className="project-floating-preview pointer-events-none fixed left-0 top-0 z-40 will-change-transform"
            >
                <div
                    className={`border-ink-subtle relative aspect-[16/10] w-[min(21rem,28vw)] overflow-hidden rounded-xl border bg-muted shadow-2xl transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none ${
                        activeIndex === null
                            ? "scale-95 opacity-0"
                            : "scale-100 opacity-100"
                    }`}
                >
                    {projects.map((project, index) => (
                        <Image
                            key={project.slug}
                            src={project.cover.src}
                            alt=""
                            fill
                            sizes="(min-width: 1024px) 336px, 1px"
                            className={`object-cover transition-[opacity,filter,transform] duration-300 ease-out motion-reduce:transition-none ${
                                activeIndex === index
                                    ? "scale-100 opacity-100 blur-0"
                                    : "scale-105 opacity-0 blur-sm"
                            }`}
                        />
                    ))}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/15 to-transparent" />
                </div>
            </div>

            <div className="border-ink-subtle border-b">
                {projects.map((project, index) => {
                    const caseStudyAction = project.actions.find(
                        ({ kind }) => kind === "case-study",
                    )
                    const externalActions = project.actions.filter(
                        ({ kind }) => kind !== "case-study",
                    )

                    return (
                        <article
                            key={project.slug}
                            className="group/project border-ink-subtle relative border-t"
                        >
                            {caseStudyAction ? (
                                <Link
                                    href={caseStudyAction.href}
                                    aria-hidden="true"
                                    tabIndex={-1}
                                    className="absolute inset-0 z-10 cursor-pointer rounded-lg"
                                />
                            ) : null}

                            <div className="absolute inset-0 -mx-3 rounded-lg bg-ink/[0.035] opacity-0 transition-[opacity,transform] duration-200 ease-out group-focus-within/project:scale-[1.01] group-focus-within/project:opacity-100 group-hover/project:scale-[1.01] group-hover/project:opacity-100 motion-reduce:transform-none motion-reduce:transition-none sm:-mx-5" />

                            <div className="pointer-events-none relative z-20 grid gap-7 py-9 sm:py-11 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)] lg:gap-16">
                                <div className="grid content-start gap-5">
                                    <div className="grid gap-5 lg:grid-cols-[10rem_1fr] lg:items-start">
                                        <figure className="border-ink-subtle relative aspect-[16/10] overflow-hidden rounded-lg border bg-muted">
                                            <Image
                                                src={project.cover.src}
                                                alt={project.cover.alt}
                                                fill
                                                priority={index === 0}
                                                sizes="(min-width: 1024px) 160px, (min-width: 640px) calc(100vw - 3rem), calc(100vw - 2rem)"
                                                className="object-cover"
                                            />
                                        </figure>

                                        <div className="text-ink-muted flex items-start justify-between gap-5 text-sm">
                                            <span className="font-medium text-signal-dark">
                                                {String(index + 1).padStart(
                                                    2,
                                                    "0",
                                                )}
                                            </span>
                                            <span className="max-w-sm text-right leading-relaxed">
                                                {project.availabilityLabel} ·{" "}
                                                {project.timeframe}
                                            </span>
                                        </div>
                                    </div>

                                    <h3 className="max-w-3xl text-[clamp(2rem,5vw,4.75rem)] font-medium leading-[0.92] tracking-[-0.05em] text-ink">
                                        {caseStudyAction ? (
                                            <Link
                                                href={caseStudyAction.href}
                                                onFocus={() =>
                                                    handleFocus(index)
                                                }
                                                onBlur={handleBlur}
                                                className="focus-ring group/title pointer-events-auto inline-block transition-colors duration-200 hover:text-signal-dark focus-visible:text-signal-dark"
                                            >
                                                <span
                                                    onPointerMove={(event) =>
                                                        handlePointerMove(
                                                            index,
                                                            event,
                                                        )
                                                    }
                                                    onPointerLeave={(event) =>
                                                        handlePointerLeave(
                                                            index,
                                                            event,
                                                        )
                                                    }
                                                >
                                                    {project.title}
                                                </span>
                                            </Link>
                                        ) : (
                                            project.title
                                        )}
                                    </h3>

                                    <p className="text-ink-secondary max-w-2xl text-base leading-relaxed sm:text-lg">
                                        {project.summary}
                                    </p>

                                    {project.cover.caption ? (
                                        <p className="text-ink-muted max-w-2xl text-sm leading-relaxed">
                                            {project.cover.caption}
                                        </p>
                                    ) : null}

                                    {externalActions.length > 0 ? (
                                        <div className="flex flex-wrap gap-x-6 gap-y-3">
                                            {externalActions.map((action) => (
                                                <AnimatedLink
                                                    key={`${action.kind}-${action.href}`}
                                                    href={action.href}
                                                    external
                                                    className="pointer-events-auto inline-flex min-h-11 items-center"
                                                >
                                                    {action.label}
                                                </AnimatedLink>
                                            ))}
                                        </div>
                                    ) : null}
                                </div>

                                <div className="grid content-start gap-6 lg:pt-9">
                                    <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                                        <div>
                                            <dt className="text-ink-muted mb-1 text-xs font-medium uppercase tracking-[0.14em]">
                                                Role
                                            </dt>
                                            <dd className="text-ink-secondary text-sm leading-relaxed">
                                                {project.role}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-ink-muted mb-1 text-xs font-medium uppercase tracking-[0.14em]">
                                                Technology
                                            </dt>
                                            <dd className="text-ink-secondary text-sm leading-relaxed">
                                                {project.stack.join(", ")}
                                            </dd>
                                        </div>
                                    </dl>

                                    <ul
                                        aria-label="Capabilities shown"
                                        className="text-ink-muted flex flex-wrap gap-x-4 gap-y-2 text-sm"
                                    >
                                        {project.capabilities.map((label) => (
                                            <li key={label}>{label}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </article>
                    )
                })}
            </div>
        </div>
    )
}
