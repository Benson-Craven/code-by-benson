"use client"
import { motion, useTransform, useScroll, useInView } from "framer-motion"
import { useRef } from "react"
import React from "react"
import FlipLink from "./FlipLink"
import projects from "../data/projects"
import Image from "next/image"
import Link from "next/link"

const ProjectSection: React.FC = () => {
    const targetRef = useRef<HTMLDivElement | null>(null)

    const { scrollYProgress } = useScroll({
        target: targetRef,
    })

    const cardWidth = 100 / projects.length

    const x = useTransform(
        scrollYProgress,
        [0, 1],
        ["0%", `-${90 - cardWidth}%`],
    )

    const opacity = useTransform(scrollYProgress, [0.9, 1], [1, 0])

    const containerVariants = {
        hidden: {
            opacity: 0,
        },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3, // Delay between each card
                delayChildren: 0.2, // Initial delay before first card
            },
        },
    }

    return (
        <section
            id="project-section"
            ref={targetRef}
            className="relative h-[300vh] rounded-bl-[300px] rounded-br-[300px] rounded-tr-full bg-neutral-100"
        >
            {/* Section Header */}
            <motion.div
                style={{ opacity }}
                className="sticky top-20 pl-5 mix-blend-difference md:pl-10"
            >
                <h2 className="text-7xl tracking-tight">Projects</h2>
            </motion.div>

            {/* Horizontal Scrolling Section */}
            <div className="sticky top-44 mt-8 flex flex-col items-start justify-center overflow-hidden">
                <motion.div
                    style={{ x }}
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="mb-10 flex flex-row flex-nowrap gap-12 pl-5 md:pl-10"
                >
                    {projects.map((project, index) => (
                        <Card key={project.id} card={project} index={index} />
                    ))}
                </motion.div>
            </div>
        </section>
    )
}

const Card: React.FC<{ card: CardType; index: number }> = ({ card, index }) => {
    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 50,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 1.2, // Longer duration
                ease: [0.25, 0.1, 0.25, 1], // Custom easing curve for smoother motion
            },
        },
    }

    return (
        <motion.div
            variants={cardVariants}
            className="group flex min-h-max flex-col overflow-hidden"
        >
            {/* Image Container */}
            <Link href={card.link} passHref>
                <div className="relative mb-2 h-[200px] w-[200px] sm:h-[300px] sm:w-[300px] md:h-[400px] md:w-[400px] lg:h-[450px] lg:w-[550px]">
                    {/* Placeholder Image */}
                    <Image
                        src={card.url}
                        alt={card.title}
                        fill
                        loading="lazy"
                        className="absolute inset-0 cursor-pointer rounded-2xl object-cover transition-opacity duration-300 group-hover:scale-95 group-hover:opacity-0"
                    />
                    {/* Hover GIF */}
                    <Image
                        src={card.gifUrl}
                        alt={`GIF of ${card.title}`}
                        fill
                        loading="lazy"
                        className="absolute inset-0 cursor-pointer rounded-2xl object-scale-down opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                </div>
            </Link>

            {/* Card Title */}
            <div className="mt-2 text-black">
                <h3 className="mb-2 text-lg mix-blend-difference sm:text-2xl">
                    <FlipLink href="" hoverText="View project">
                        {card.title}
                    </FlipLink>
                </h3>
            </div>
        </motion.div>
    )
}

type CardType = {
    link: string
    url: string
    gifUrl: string
    title: string
    id: number
}

export default ProjectSection
