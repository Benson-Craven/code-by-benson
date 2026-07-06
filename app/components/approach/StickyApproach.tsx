"use client"

import {
    motion,
    type MotionValue,
    useReducedMotion,
    useScroll,
    useTransform,
} from "framer-motion"
import { useRef } from "react"

const items = [
    {
        number: "01",
        title: "Real-time interfaces",
        copy: "Streaming data, derived state and resilient UI behaviour.",
        visual: "market",
    },
    {
        number: "02",
        title: "Production delivery",
        copy: "Deployment, structured data, analytics and ongoing operation.",
        visual: "delivery",
    },
    {
        number: "03",
        title: "Product engineering",
        copy: "Turning complex requirements into interfaces that feel obvious.",
        visual: "product",
    },
]

export default function StickyApproach() {
    const ref = useRef<HTMLElement>(null)
    const reduceMotion = useReducedMotion()
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end end"],
    })

    return (
        <section
            ref={ref}
            className="section-space relative bg-ink text-paper"
        >
            <div className="mx-auto max-w-[1500px]">
                <div className="mb-24 grid gap-6 md:mb-28 md:grid-cols-[0.55fr_1fr]">
                    <p className="text-xs font-medium uppercase tracking-[0.22em] text-signal">
                        Engineering Approach
                    </p>
                    <h2 className="max-w-4xl text-[clamp(2.8rem,7vw,7rem)] font-medium leading-[0.9] tracking-[-0.05em]">
                        Interaction detail backed by production judgement.
                    </h2>
                </div>
                <div className="grid gap-10 lg:grid-cols-[0.78fr_1fr] lg:gap-16">
                    <div className="grid gap-4 lg:sticky lg:top-28 lg:self-start">
                        {items.map((item, index) => (
                            <ApproachItem
                                key={item.title}
                                item={item}
                                index={index}
                                total={items.length}
                                progress={scrollYProgress}
                                reduceMotion={Boolean(reduceMotion)}
                            />
                        ))}
                    </div>
                    <div className="grid gap-6 lg:gap-10">
                        {items.map((item) => (
                            <div
                                key={item.visual}
                                    className="min-h-[330px] border border-paper/14 bg-paper/[0.035] p-5 md:min-h-[430px] md:p-7"
                            >
                                <ApproachVisual visual={item.visual} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

function ApproachItem({
    item,
    index,
    total,
    progress,
    reduceMotion,
}: {
    item: (typeof items)[number]
    index: number
    total: number
    progress: MotionValue<number>
    reduceMotion: boolean
}) {
    const start = index / total
    const end = (index + 1) / total
    const opacity = useTransform(
        progress,
        [start - 0.1, start, end, end + 0.1],
        reduceMotion ? [1, 1, 1, 1] : [0.42, 1, 1, 0.42],
    )
    const x = useTransform(progress, [start, end], reduceMotion ? [0, 0] : [0, 18])

    return (
        <motion.div
            style={{ opacity, x }}
            className="border-t border-paper/18 py-6"
        >
            <div className="mb-3 flex items-center gap-4">
                <span className="text-sm text-signal">{item.number}</span>
                <h3 className="text-3xl font-medium tracking-tight md:text-5xl">
                    {item.title}
                </h3>
            </div>
            <p className="max-w-lg text-lg leading-relaxed text-paper/66">
                {item.copy}
            </p>
        </motion.div>
    )
}

function ApproachVisual({ visual }: { visual: string }) {
    if (visual === "market") {
        return (
            <div className="flex h-full flex-col justify-between">
                <div className="grid gap-2 text-xs uppercase tracking-[0.16em] text-paper/44">
                    <span>Quotes</span>
                    <span>Connection healthy</span>
                </div>
                <div className="grid gap-3">
                    {["EURUSD 1.0832", "BTCUSD 62940.20", "AAPL 214.08"].map(
                        (quote, index) => (
                            <div
                                key={quote}
                                className="approach-ticker flex justify-between border-b border-paper/14 pb-3 text-lg"
                                style={{ animationDelay: `${index * 0.7}s` }}
                            >
                                <span>{quote}</span>
                                <span className="text-signal">+</span>
                            </div>
                        ),
                    )}
                </div>
            </div>
        )
    }

    if (visual === "delivery") {
        return (
            <div className="grid h-full content-between gap-8">
                <div className="flex justify-between text-xs uppercase tracking-[0.16em] text-paper/44">
                    <span>Production</span>
                    <span>Structured data</span>
                </div>
                <div className="grid gap-3">
                    {["Deploy", "Index", "Measure", "Maintain"].map((step) => (
                        <div
                            key={step}
                            className="grid grid-cols-[5rem_1fr] items-center gap-4"
                        >
                            <span className="text-sm text-paper/52">{step}</span>
                            <span className="h-px bg-gradient-to-r from-signal to-paper/12" />
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="grid h-full content-between gap-8">
            <div className="flex justify-between text-xs uppercase tracking-[0.16em] text-paper/44">
                <span>Collection UI</span>
                <span>Filters active</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
                {["Genre", "Year", "Label", "Format", "Condition", "Search"].map(
                    (filter, index) => (
                        <span
                            key={filter}
                            className={`border px-3 py-4 text-sm ${
                                index < 3
                                    ? "border-signal text-signal"
                                    : "border-paper/16 text-paper/54"
                            }`}
                        >
                            {filter}
                        </span>
                    ),
                )}
            </div>
        </div>
    )
}
