"use client"

import { motion, useInView, useScroll, useTransform } from "framer-motion"
import React, { useRef, useMemo } from "react"
import Image from "next/image"
import { slideUp } from "./animation"

import Picture1 from "../../../public/images/Pic1.JPG"
import Picture2 from "../../../public/images/Pic2.JPG"
import Picture3 from "../../../public/images/Pic3.JPG"

const Manifesto = () => {
    const phrase =
        "Helping brands to stand out in the digital era. Together we will set the new status quo. No nonsense, always on the cutting edge."
    const descriptionRef = useRef(null)
    const isInView = useInView(descriptionRef, { once: true })

    // Splitting the words into individual words to be animated
    const words = useMemo(() => phrase.split(" "), [phrase])

    // Initialising the parallax effect with Framer motion using the div container as a useRef
    const containerRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    })
    // Different levels of transformation levels for scale of Y progress
    const sm = useTransform(scrollYProgress, [0, 1], [0, -100])
    const md = useTransform(scrollYProgress, [0, 1], [0, -150])
    const lg = useTransform(scrollYProgress, [0, 1], [0, -250])

    // Additional styles for the pictures also, causing differential spacing
    const images = [
        {
            src: Picture1,
            y: sm,
            style: "top-[20vh]  h-[90vh] w-[100vh]",
        },
        {
            src: Picture2,
            y: lg,
            style: "left-[80vw] top-[15vh] h-[40vh] w-[30vh]",
        },
        {
            src: Picture3,
            y: md,
            style: "left-[17.5vw] top-[80vh] h-[25vh] w-[20vh]",
        },
    ]

    return (
        <>
            {/* <div className="flex h-[100vh] items-end justify-center rounded-br-full bg-neutral-100 font-helvetica text-black">
                <div
                    ref={descriptionRef}
                    className="w-2/3 -translate-y-1/2 mix-blend-difference"
                >
                    <p className="text-center text-xl tracking-tight md:text-6xl">
                        {words.map((word, i) => (
                            <span
                                key={word + i}
                                className="relative inline-flex"
                            >
                                <motion.span
                                    variants={slideUp}
                                    custom={i}
                                    animate={isInView ? "open" : "closed"}
                                >
                                    {word}
                                </motion.span>
                                &nbsp;
                            </span>
                        ))}
                    </p>
                </div>
            </div> */}
            <div ref={containerRef} className="relative h-screen">
                <div className="relative mt-[20vh] flex w-full justify-center">
                    {images.map(({ src, y, style }, i) => (
                        <motion.div
                            key={`i_${i}`}
                            style={{ y }}
                            className={`absolute ${style}`}
                        >
                            <Image
                                src={src}
                                alt="image"
                                fill
                                className="object-cover"
                            />
                        </motion.div>
                    ))}
                </div>

                {/* <div className="absolute left-0 top-0 z-10 flex h-full w-full items-center justify-center text-white mix-blend-darken">
                    <h1 className="w-2/3 bg-black bg-clip-text p-10 text-center text-8xl tracking-tight">
                        Melbourne based developer working with clients from all
                        over the world.
                    </h1>
                </div> */}
            </div>
        </>
    )
}

export default Manifesto
