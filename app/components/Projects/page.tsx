"use client"
import { motion, useTransform, useScroll } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import React from "react"

const ProjectSection: React.FC = () => {
    const targetRef = useRef<HTMLDivElement | null>(null)
    const { scrollYProgress } = useScroll({
        target: targetRef,
    })

    const [isSmallScreen, setIsSmallScreen] = useState(false)

    useEffect(() => {
        const checkScreenSize = () => {
            setIsSmallScreen(window.innerWidth < 768) // Adjust this breakpoint as needed
        }

        checkScreenSize()
        window.addEventListener("resize", checkScreenSize)

        return () => window.removeEventListener("resize", checkScreenSize)
    }, [])

    const cardWidth = 100 / cards.length
    const x = useTransform(
        scrollYProgress,
        [0, 1],
        isSmallScreen ? ["0%", "0%"] : ["0%", `-${100 - cardWidth}%`],
    )

    return (
        <section
            ref={targetRef}
            className={`relative ${isSmallScreen ? "h-auto" : "h-[300vh]"} rounded-bl-[300px] rounded-br-[300px] rounded-tl-full bg-neutral-100`}
        >
            <div className="flex items-center justify-start rounded-tr-full px-10">
                <span className="text-5xl md:text-8xl">Projects</span>
            </div>
            <div className="flex h-6 w-screen justify-center">
                <h2 className="font-semibold leading-relaxed">SCROLL DOWN</h2>
            </div>

            <div
                className={` ${isSmallScreen ? "static mt-20 h-auto overflow-visible" : "sticky top-0 ml-10 h-screen overflow-hidden"} flex items-center`}
            >
                <motion.div
                    style={{ x }}
                    className={`flex gap-8 ${isSmallScreen ? "flex-col items-center justify-center" : "flex-row flex-nowrap"} `}
                >
                    {cards.map((card) => (
                        <Card card={card} key={card.id} />
                    ))}
                </motion.div>
            </div>
        </section>
    )
}

// Modify the Card component to be responsive
const Card: React.FC<{ card: CardType }> = ({ card }) => (
    <div className="group relative h-[450px] w-[450px] max-w-full overflow-hidden rounded-lg border-none">
        <div
            style={{
                backgroundImage: `url(${card.url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
            className="absolute inset-0 z-0 transition-transform duration-300 group-hover:scale-110"
        ></div>
        <div className="absolute inset-0 z-10 grid place-content-center">
            <p className="bg-gradient-to-br from-white/20 to-white/0 p-8 text-6xl font-black uppercase text-white backdrop-blur-lg">
                {card.title}
            </p>
        </div>
        <p>Hello</p>
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
