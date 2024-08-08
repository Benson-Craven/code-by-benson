"use client"

import { motion, useTransform, useScroll } from "framer-motion"
import { useRef } from "react"
import React from "react"

import FlipLink from "./FlipLink"
import projects from "../data/projects"

const ProjectSection: React.FC = () => {
    const targetRef = useRef<HTMLDivElement | null>(null)
    const { scrollYProgress } = useScroll({
        target: targetRef,
    })

    const cardWidth = 100 / projects.length

    const x = useTransform(
        scrollYProgress,
        [0, 1], // Adjust the range to stop at the end of the screen
        ["0%", `-${90 - cardWidth}%`],
    )

    const opacity = useTransform(scrollYProgress, [0.9, 1], [1, 0])

    return (
        <section
            id="project-section"
            ref={targetRef}
            className="relative h-[300vh] rounded-bl-[300px] rounded-br-[300px] rounded-tr-full bg-neutral-100"
        >
            <motion.div
                style={{ opacity }}
                className="sticky top-20 pl-5 mix-blend-difference md:pl-10"
            >
                <h2 className="text-7xl tracking-tight">Projects</h2>
            </motion.div>
            <div className="sticky top-44 mt-8 flex flex-col items-start justify-center overflow-hidden">
                <motion.div
                    style={{ x }}
                    className="mb-10 flex flex-row flex-nowrap gap-12 pl-5 md:pl-10"
                >
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: index < 3 ? 1 : 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 1 }}
                        >
                            <Card card={project} />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}

const Card: React.FC<{ card: CardType }> = ({ card }) => (
    <div className="flex min-h-max flex-col overflow-hidden">
        <div className="mb-2 h-[200px] w-[200px] sm:h-[300px] sm:w-[300px] md:h-[400px] md:w-[400px] lg:h-[450px] lg:w-[550px]">
            <img
                src={card.url}
                alt={card.title}
                className="h-full w-full cursor-help rounded-2xl object-cover transition-transform duration-300 hover:scale-95"
            />
        </div>
        <div className="mt-2 text-black">
            <h3 className="mb-2 text-lg mix-blend-difference sm:text-2xl">
                <FlipLink href="" hoverText="View project &#9757;">
                    {card.title}
                </FlipLink>
            </h3>
        </div>
    </div>
)

export default ProjectSection

type CardType = {
    url: string
    title: string
    id: number
}
