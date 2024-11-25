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

    const x = useTransform(scrollYProgress, [0, 1], ["0", "-100%"])

    const opacity = useTransform(scrollYProgress, [0.8, 1], [1, 0])

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
            className="relative h-[150vh] rounded-bl-[300px] rounded-br-[300px] rounded-tr-full bg-neutral-100 md:h-[300vh]"
        >
            {/* Section Header */}
            <motion.div
                style={{ opacity }}
                className="sticky top-[130px] pl-5 mix-blend-difference md:top-16 md:pl-10"
            >
                <h2 className="text-6xl tracking-tight md:text-7xl">
                    Projects
                </h2>
            </motion.div>

            {/* Horizontal Scrolling Section */}
            <div className="sticky top-1/3 mt-8 flex flex-col items-start justify-center overflow-hidden md:top-44">
                <motion.div
                    style={{ x }}
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="mb-10 flex flex-row flex-nowrap gap-12 pl-5 md:pl-10"
                >
                    {projects.map((project, index) =>
                        project.comingSoon ? (
                            <ComingSoonCard key={`coming-soon-${project.id}`} />
                        ) : (
                            <Card
                                key={project.id}
                                card={project}
                                index={index}
                            />
                        ),
                    )}
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

const ComingSoonCard = () => {
    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 50,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 1.2,
                ease: [0.25, 0.1, 0.25, 1],
            },
        },
    }

    return (
        <motion.div
            variants={cardVariants}
            className="group flex min-h-max flex-col overflow-hidden"
        >
            <div className="relative mb-2 h-[200px] w-[200px] sm:h-[300px] sm:w-[300px] md:h-[400px] md:w-[400px] lg:h-[450px] lg:w-[550px]">
                <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-neutral-200 p-6 transition-all duration-300 group-hover:scale-95">
                    {/* Animated dots */}
                    <div className="flex space-x-2">
                        <div className="h-3 w-3 animate-bounce rounded-full bg-neutral-400 [animation-delay:-0.3s]"></div>
                        <div className="h-3 w-3 animate-bounce rounded-full bg-neutral-400 [animation-delay:-0.15s]"></div>
                        <div className="h-3 w-3 animate-bounce rounded-full bg-neutral-400"></div>
                    </div>
                    <h3 className="mt-6 text-2xl font-medium text-neutral-600">
                        Coming Soon
                    </h3>
                    <p className="mt-4 text-center text-neutral-500">
                        New projects in the works
                    </p>
                </div>
            </div>

            <div className="mt-2 text-black">
                <h3 className="mb-2 text-lg mix-blend-difference sm:text-2xl">
                    Stay Tuned
                </h3>
            </div>
        </motion.div>
    )
}

export default ProjectSection
