"use client"
import {
    motion,
    useTransform,
    useScroll,
    useMotionValueEvent,
} from "framer-motion"
import { useRef } from "react"
import React from "react"

const ProjectSection: React.FC = () => {
    const targetRef = useRef<HTMLDivElement | null>(null)
    const { scrollYProgress } = useScroll({
        target: targetRef,
    })

    const cardWidth = 100 / cards.length
    const x = useTransform(
        scrollYProgress,
        [0.1, 1],
        ["0%", `-${100 - cardWidth}%`],
    )
    const opacity = useTransform(scrollYProgress, [0.9, 1], [1, 0])

    return (
        <section
            ref={targetRef}
            className="relative h-[300vh] rounded-bl-[300px] rounded-br-[300px] rounded-tl-full bg-neutral-100"
        >
            <motion.div
                style={{ opacity }}
                className="sticky top-24 mb-8 pl-5 mix-blend-difference md:pl-10"
            >
                <h2 className="text-5xl tracking-tight">Projects</h2>
            </motion.div>
            <div className="sticky top-44 flex flex-col items-start justify-center overflow-hidden">
                <motion.div
                    style={{ x }}
                    className="mb-10 flex flex-row flex-nowrap gap-8 pl-5 md:pl-10"
                >
                    {cards.map((card, index) => (
                        <motion.div
                            key={card.id}
                            initial={{ opacity: index < 3 ? 1 : 0 }} // Adjust this condition based on how many cards are initially in view
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 1 }}
                        >
                            <Card card={card} />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}

const Card: React.FC<{ card: CardType }> = ({ card }) => (
    <div className="flex min-h-max flex-col overflow-hidden">
        <div className="mb-2 h-[200px] w-[200px] sm:h-[300px] sm:w-[300px] md:h-[400px] md:w-[400px] lg:h-[450px] lg:w-[450px]">
            <img
                src={card.url}
                alt={card.title}
                className="h-full w-full rounded-lg object-cover transition-transform duration-300 hover:scale-105"
            />
        </div>
        <div className="mt-2 text-black">
            <h3 className="mb-2 text-lg mix-blend-difference sm:text-2xl">
                {card.title}
            </h3>
            <a
                href="#"
                className="inline-flex items-center text-base mix-blend-difference hover:underline sm:text-xl"
            >
                View project
                <svg
                    className="ml-1 h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            </a>
        </div>
    </div>
)

export default ProjectSection

type CardType = {
    url: string
    title: string
    id: number
}

const cards: CardType[] = [
    {
        url: "/images/Pic1.JPG",
        title: "Project 1",
        id: 1,
    },
    {
        url: "/images/Pic1.JPG",
        title: "Project 2",
        id: 2,
    },
    {
        url: "/images/Pic1.JPG",
        title: "Project 3",
        id: 3,
    },
    {
        url: "/images/Pic1.JPG",
        title: "Project 4",
        id: 4,
    },
    {
        url: "/images/Pic1.JPG",
        title: "Project 5",
        id: 5,
    },
    {
        url: "/images/Pic1.JPG",
        title: "Project 6",
        id: 6,
    },
    {
        url: "/images/Pic1.JPG",
        title: "Project 7",
        id: 7,
    },
]
