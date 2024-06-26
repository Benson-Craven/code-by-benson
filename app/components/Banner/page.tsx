"use client"

import Image from "next/image"
import React, { useRef } from "react"
import Pic1 from "../../../public/images/Pic1.JPG"
import Pic2 from "../../../public/images/Pic2.JPG"
import Pic3 from "../../../public/images/Pic3.JPG"
import { MotionValue, motion, useScroll, useTransform } from "framer-motion"

interface PhraseProps {
    title: string
    src: string
}

interface SliderProps {
    title: string
    src: string
    left: string
    progress: MotionValue<number>
    direction: string
}

const Banner: React.FC = () => {
    const container = useRef<HTMLDivElement | null>(null)
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ["start end", "end start"],
    })

    const sliders = [
        {
            title: "Front End Developer",
            src: Pic1,
            left: "-65%",
            direction: "left",
        },
        { title: "UX Designer", src: Pic2, left: "-15%", direction: "right" },
        {
            title: "Front End Developer",
            src: Pic3,
            left: "-90%",
            direction: "left",
        },
    ]

    return (
        <main>
            <div
                ref={container}
                className="mb-[20vh] mt-[20vh] overflow-hidden"
            >
                {sliders.map((slider, index) => (
                    <Slider
                        key={index}
                        title={slider.title}
                        src={slider.src}
                        left={slider.left}
                        progress={scrollYProgress}
                        direction={slider.direction}
                    />
                ))}
            </div>
        </main>
    )
}

const Slider: React.FC<SliderProps> = ({
    title,
    src,
    left,
    progress,
    direction,
}) => {
    const dir = direction === "left" ? -1 : 1
    const x = useTransform(progress, [0, 1], [-250 * dir, 250 * dir])

    return (
        <motion.div
            className="relative flex whitespace-nowrap font-helvetica tracking-tight"
            style={{ left, x }}
        >
            {Array(3)
                .fill(0)
                .map((_, index) => (
                    <Phrase key={index} title={title} src={src} />
                ))}
        </motion.div>
    )
}

const Phrase: React.FC<PhraseProps> = ({ title, src }) => {
    return (
        <div className="flex items-center gap-5 px-5">
            <p className="text-[7.5vw]">{title}</p>
            <span className="relative aspect-[4/2] h-[7.5vw] overflow-hidden rounded-full">
                <Image
                    style={{ objectFit: "cover" }}
                    src={src}
                    alt={title}
                    fill
                />
            </span>
        </div>
    )
}

export default Banner
