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

    // useMotionValueEvent(scrollYProgress, "change", (latest) => {
    //     console.log("Page scroll: ", latest)
    // })

    return (
        <section
            ref={targetRef}
            className="relative h-[300vh] rounded-bl-[300px] rounded-br-[300px] rounded-tl-full bg-neutral-100"
        >
            <motion.div
                style={{ opacity }}
                className="sticky top-24 border-2 border-blue-500 pl-5 mix-blend-difference"
            >
                <h2 className="text-5xl">Projects</h2>
            </motion.div>
            <div className="sticky top-44 flex h-1/5 flex-col items-start justify-center overflow-hidden border-2 border-red-500">
                <motion.div
                    style={{ x }}
                    className="mb-10 flex flex-row flex-nowrap gap-8 pl-5 mix-blend-normal md:pb-10 md:pl-9"
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
    <div className="flex h-auto w-[250px] flex-col overflow-hidden md:w-[500px]">
        <div className="mb-2">
            <img
                src={card.url}
                alt={card.title}
                className="h-[250px] w-full rounded-lg object-cover transition-transform duration-300 hover:scale-105 md:h-[500px]"
            />
        </div>
        <div className="mt-3 text-black">
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

// <div className="group relative h-[450px] w-[450px] max-w-full overflow-hidden rounded-3xl border-none">
//     <div
//         style={{
//             backgroundImage: `url(${card.url})`,
//             backgroundSize: "cover",
//             backgroundPosition: "center",
//         }}
//         className="absolute inset-0 z-0 transition-transform duration-300 group-hover:scale-110"
//     />

//     <div className=""></div>

//     <div className="absolute inset-0 z-10 grid place-content-center">
//         <p className="rounded-xl bg-gradient-to-br from-white/20 to-white/0 p-8 text-6xl font-black uppercase text-white backdrop-blur-lg">
//             {card.title}
//         </p>
//     </div>
//     <p>Hello</p>
// </div>

// <div className="relative flex h-[500px] w-[560px] flex-col flex-nowrap justify-start gap-6 overflow-x-hidden overflow-y-hidden p-5">
//     <div
//         style={{
//             backgroundImage: `url(${card.url})`,
//             backgroundSize: "cover",
//             backgroundPosition: "center",
//         }}
//         className="absolute inset-0 block cursor-pointer rounded-3xl transition-transform duration-300 hover:scale-110"
//     />
//     <div className="p-4">
//         <h3 className="text-lg font-semibold">{card.title}</h3>
//         <a href="#" className="text-blue-500 hover:underline">
//             View project →
//         </a>
//     </div>
// </div>

{
    /* <div className="flex h-6 w-screen justify-center">
                <h2 className="font-semibold leading-relaxed">SCROLL DOWN</h2>
            </div> */
}
{
    /* <div className="flex items-center justify-start rounded-tr-full px-10">
                <span className="text-3xl md:text-7xl">Projects</span>
            </div> */
}
