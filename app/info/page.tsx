"use client"

import {
    useScroll,
    motion,
    useTransform,
    MotionValue,
    easeOut,
} from "framer-motion"
import React, { useRef } from "react"
import Process from "../components/Process"

interface WordProps {
    children: string
    progress: MotionValue<number>
    range: [number, number]
}

const text = "About".split("")

const paragraph =
    "I'm Benson Craven - a British web developer based in Melbourne, Australia. I create forward-thinking web applications based on a knowledge accumulated over the years."

const paragraph2 =
    "My passion lies in web development and through combining user experience, strategy, technology and motion I aspire to create work that resonates deeply with its audience. "

const paragraph3 =
    "I'm always up for discussing new collaborations, don't hesitate to get in touch."

const animation = {
    initial: { y: "100%", opacity: 0 },
    enter: (i: number) => ({
        y: "0",
        opacity: 1,
        transition: {
            duration: 1,
            ease: [0.5, 0.75, 0.9, 1],
            delay: 0.5 + i * 0.1, // Add a stagger effect
        },
    }),
}

const Info: React.FC = () => {
    const container1 = useRef<HTMLParagraphElement>(null)
    const container2 = useRef<HTMLParagraphElement>(null)
    const container3 = useRef<HTMLParagraphElement>(null)

    const { scrollYProgress: scrollYProgress1 } = useScroll({
        target: container1,
        offset: ["start 0.7", "start 0.25"],
    })

    const { scrollYProgress: scrollYProgress2 } = useScroll({
        target: container2,
        offset: ["start 0.6", "start 0.1"],
    })

    const { scrollYProgress: scrollYProgress3 } = useScroll({
        target: container3,
        offset: ["start 0.5", "start 0.1"],
    })

    const words = paragraph.split(" ")
    const words2 = paragraph2.split(" ")
    const words3 = paragraph3.split(" ")

    const aboutOpacity = useTransform(scrollYProgress1, [0, 0.55], [1, 0], {
        ease: easeOut,
    })

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
            <div className="relative flex h-[95vh] flex-col md:h-[100vh]">
                <div className="absolute bottom-0 left-0 right-0 flex justify-center overflow-hidden">
                    {text.map((char, index) => (
                        <motion.span
                            key={index}
                            className="inline-block text-[20rem] uppercase leading-none tracking-tighter mix-blend-difference"
                            variants={animation}
                            initial="initial"
                            animate="enter"
                            custom={index}
                            style={{ opacity: aboutOpacity }}
                        >
                            {char}
                        </motion.span>
                    ))}
                </div>
            </div>

            <div className="mb-14">
                {renderParagraph(words, scrollYProgress1, container1)}
                {renderParagraph(words2, scrollYProgress2, container2)}
                {renderParagraph(words3, scrollYProgress3, container3)}
            </div>
            <Process />
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
