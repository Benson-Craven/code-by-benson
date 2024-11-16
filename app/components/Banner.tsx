"use client"

import Image, { StaticImageData } from "next/image"
import React, { useRef } from "react"
import akihabara from "../../public/images/akihabara.avif"
import shinjuku from "../../public/images/shinjuku.avif"
import ueno from "../../public/images/ueno.avif"
import { MotionValue, motion, useScroll, useTransform } from "framer-motion"

interface PhraseProps {
    title: string
    src: StaticImageData
}

interface SliderProps {
    title: string
    src: StaticImageData
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
            src: akihabara,
            left: "-65%",
            direction: "left",
        },
        {
            title: "UX Designer",
            src: shinjuku,
            left: "-85%",
            direction: "right",
        },
        {
            title: "Front End Developer",
            src: ueno,
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
            className="relative flex whitespace-nowrap tracking-tight"
            style={{ left, x }}
        >
            {Array(5)
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
            <p className="text-[7.5vw] tracking-tight">{title}</p>
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
