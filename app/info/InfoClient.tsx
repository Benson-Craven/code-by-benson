"use client"

import {
    useScroll,
    motion,
    useTransform,
    MotionValue,
    easeOut,
} from "framer-motion"
import React, { useRef, useMemo } from "react"

interface WordProps {
    children: string
    progress: MotionValue<number>
    range: [number, number]
}

const text = "About".split("")

const paragraph1 =
    "I'm Benson Craven — a British front end developer, recently returned to Europe after three years in Melbourne. Now based in Cork, building fast, forward-thinking web experiences."

const paragraph2 =
    "My passion lies in web development. By combining user experience, strategy, technology, and motion."

const paragraph3 =
    "I'm always open to new collaborations. Don't hesitate to get in touch"

const animation = {
    initial: { y: "100%", opacity: 0 },
    enter: (i: number) => ({
        y: "0",
        opacity: 1,
        transition: {
            duration: 1,
            ease: [0.5, 0.75, 0.9, 1],
            delay: 0.5 + i * 0.1,
        },
    }),
}

const InfoClient: React.FC = () => {
    const mainContainer = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: mainContainer,
        offset: ["start 0.8", "end 0.6"],
    })

    const words1 = useMemo(() => paragraph1.split(" "), [])
    const words2 = useMemo(() => paragraph2.split(" "), [])
    const words3 = useMemo(() => paragraph3.split(" "), [])
    const totalWords = words1.length + words2.length + words3.length

    const aboutOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0], {
        ease: easeOut,
    })

    const renderParagraph = (words: string[], startIndex: number) => {
        return (
            <p className="mb-10 ml-10 mt-10 flex w-10/12 flex-wrap text-4xl tracking-tight mix-blend-difference md:text-6xl">
                {words.map((word, i) => {
                    const globalIndex = startIndex + i
                    const start = globalIndex / totalWords
                    const end = start + 1 / totalWords
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
        )
    }

    return (
        <section className="relative rounded-br-full rounded-tr-full bg-neutral-100 pb-20">
            <div className="relative flex h-[95vh] flex-col md:h-[100vh]">
                <div className="absolute bottom-5 left-0 right-0 flex justify-center overflow-hidden">
                    {text.map((char, index) => (
                        <motion.span
                            key={index}
                            className="inline-block text-[9rem] uppercase leading-none tracking-tighter mix-blend-difference md:text-[20rem]"
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

            <div ref={mainContainer} className="pb-16">
                {renderParagraph(words1, 0)}
                {renderParagraph(words2, words1.length)}
                {renderParagraph(words3, words1.length + words2.length)}
            </div>

            <div className="flex flex-col space-y-12 px-6 py-6 sm:px-8 sm:py-8 md:px-10 md:py-10">
                <div className="flex flex-col space-y-4">
                    <div className="border-t border-gray-300 mix-blend-difference" />
                    <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-start md:space-y-0">
                        <p className="text-lg font-medium text-gray-500">
                            ↳ Services
                        </p>
                        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8 md:gap-x-16">
                            <div className="space-y-1">
                                <p className="font-normal text-white mix-blend-difference">
                                    UX/UI Design <br />
                                    Front-End Development <br />
                                    Graphic Design <br />
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="font-normal text-white mix-blend-difference">
                                    Prototyping & Wireframing <br />
                                    Responsive Web Development <br />
                                    Animation & Motion Graphics
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

const Word: React.FC<WordProps> = ({ children, progress, range }) => {
    const opacity = useTransform(progress, range, [0.25, 1])
    return (
        <motion.span style={{ opacity }}>
            {children}
            <span>&nbsp;</span>
        </motion.span>
    )
}

export default InfoClient
