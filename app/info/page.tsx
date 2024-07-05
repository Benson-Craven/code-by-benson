"use client"

import { useScroll, motion, useTransform, MotionValue } from "framer-motion"
import React, { useRef } from "react"

const paragraph =
    "I'm Benson Craven - a British web developer based in Melbourne, Australia. I create forward-thinking and considered designs based on a knowledge accumulated over 4+ years."

interface WordProps {
    children: string
    progress: MotionValue<number>
    range: [number, number]
}

const Info: React.FC = () => {
    const container1 = useRef<HTMLParagraphElement>(null)
    const container2 = useRef<HTMLParagraphElement>(null)
    const container3 = useRef<HTMLParagraphElement>(null)

    const { scrollYProgress: scrollYProgress1 } = useScroll({
        target: container1,
        offset: ["start 0.9", "start 0.25"],
    })

    const { scrollYProgress: scrollYProgress2 } = useScroll({
        target: container2,
        offset: ["start 0.6", "start 0.1"],
    })

    const { scrollYProgress: scrollYProgress3 } = useScroll({
        target: container3,
        offset: ["start 0.6", "start 0.1"],
    })

    const words = paragraph.split(" ")
    const aboutOpacity = useTransform(scrollYProgress1, [0, 0.6], [1, 0])

    const renderParagraph = (
        words: string[],
        progress: MotionValue<number>,
        container: React.RefObject<HTMLParagraphElement>,
    ) => {
        return (
            <p
                ref={container}
                className="mb-10 ml-10 mt-10 flex w-10/12 flex-wrap text-4xl tracking-tight mix-blend-difference md:text-6xl"
            >
                {words.map((word, i) => {
                    const start = i / words.length
                    const end = start + 1 / words.length
                    return (
                        <Word key={i} progress={progress} range={[start, end]}>
                            {word}
                        </Word>
                    )
                })}
            </p>
        )
    }

    return (
        <section className="relative rounded-bl-full rounded-tr-full bg-neutral-100">
            <div className="relative flex h-[100vh] flex-col justify-end">
                <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                    <motion.h1
                        className="text-wrap text-center text-[30vw] uppercase tracking-tighter mix-blend-difference"
                        style={{ opacity: aboutOpacity }}
                    >
                        About
                    </motion.h1>
                </div>
            </div>

            {renderParagraph(words, scrollYProgress1, container1)}
            {renderParagraph(words, scrollYProgress2, container2)}
            {renderParagraph(words, scrollYProgress3, container3)}
        </section>
    )
}

const Word: React.FC<WordProps> = ({ children, progress, range }) => {
    const opacity = useTransform(progress, range, [0.25, 1])
    return (
        <motion.span style={{ opacity }}>
            {children.split("").map((char, i) => (
                <span key={i}>{char}</span>
            ))}
            <span>&nbsp;</span>
        </motion.span>
    )
}

export default Info
