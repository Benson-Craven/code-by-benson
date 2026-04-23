"use client"

import { motion, useInView, useScroll, useTransform } from "framer-motion"
import React, { useRef, useMemo } from "react"
import Image from "next/image"
import { slideUp } from "./animation"

const Manifesto = () => {
    const phrase =
        "Turning ideas into fast, modern web experiences."
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
            y: sm,
            style: "top-[20vh]  h-[90vh] w-[100vh]",
        },
        {
            y: lg,
            style: "left-[80vw] top-[15vh] h-[40vh] w-[30vh]",
        },
        {
            y: md,
            style: "left-[17.5vw] top-[80vh] h-[25vh] w-[20vh]",
        },
    ]

    return (
        <>
            <div ref={containerRef} className="relative h-screen">
                <div className="relative mt-[20vh] flex w-full justify-center">
                    {images.map(({ y, style }, i) => (
                        <motion.div
                            key={`i_${i}`}
                            style={{ y }}
                            className={`absolute ${style}`}
                        >
                        </motion.div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Manifesto
