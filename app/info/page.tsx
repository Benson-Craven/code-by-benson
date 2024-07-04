"use client"

import { useScroll, motion, useTransform, MotionValue } from "framer-motion"
import React, { useRef } from "react"

const paragraph =
    "Im Benson Craven - a British web developer based in Melbourne, Australia. I create forward-thinking and considered designs based on a knowledge accumulated over 4+ years."

interface WordProps {
    children: string
    progress: MotionValue<number>
    range: [number, number]
}

interface CharProps {
    children: string
    progress: MotionValue<number>
    range: [number, number]
}

const Info: React.FC = () => {
    const container = useRef<HTMLParagraphElement>(null)
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ["start 0.9", "start 0.25"],
    })

    const words = paragraph.split(" ")

    return (
        <section className="bg-neutral-100">
            <div className="flex h-[100vh] flex-col items-center justify-end rounded-bl-full bg-neutral-100 p-0">
                <div className="h-fit">
                    <h1 className="h-fit text-wrap p-0 text-[20vw] uppercase tracking-tight mix-blend-difference">
                        About
                    </h1>
                </div>
            </div>

            <p
                ref={container}
                className="flex w-screen flex-wrap p-10 text-6xl tracking-tight text-black"
            >
                {words.map((word, i) => {
                    const start = i / words.length
                    const end = start + 1 / words.length
                    return (
                        <Word
                            key={i}
                            progress={scrollYProgress}
                            range={[start, end]}
                        >
                            {word}
                        </Word>
                    )
                })}
            </p>
            <div className="h-[50vh] bg-black" />
        </section>
    )
}

const Word: React.FC<WordProps> = ({ children, progress, range }) => {
    const opacity = useTransform(progress, range, [0, 1])
    return (
        <motion.span style={{ opacity }}>
            {children.split("").map((char, i) => (
                <span key={i}>{char}</span>
            ))}
            <span>&nbsp;</span>
        </motion.span>
    )
}

const Char: React.FC<CharProps> = ({ children, progress, range }) => {
    const opacity = useTransform(progress, range, [0, 1])
    return <motion.span style={{ opacity }}>{children}</motion.span>
}

export default Info
