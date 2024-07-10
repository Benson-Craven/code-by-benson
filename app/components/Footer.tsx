"use client"

import React, { useEffect, useRef } from "react"
import { FaArrowRightLong } from "react-icons/fa6"
import { motion, useAnimation, useInView } from "framer-motion"

const Footer = () => {
    const controls = useAnimation()
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })

    useEffect(() => {
        if (isInView) {
            controls.start((i) => ({
                opacity: 1,
                transition: { delay: Math.random() * 0.9 },
                duration: 300,
            }))
        }
    }, [controls, isInView])

    const sentence = "Let's Collaborate"
    const characters = sentence.split("")

    return (
        <footer className="max-w-screen relative mx-auto flex flex-col flex-nowrap justify-center gap-3 overflow-hidden bg-black px-6 pb-5 pt-20">
            <div className="flex flex-col flex-nowrap gap-6 py-6">
                <div className="relative flex flex-wrap justify-start text-base">
                    <h3 className="text-2xl tracking-tight text-slate-500">
                        Have a project in mind?
                    </h3>
                </div>
                <div className="text-5xl md:text-7xl">
                    <h2 className="flex tracking-tight text-neutral-100">
                        <motion.span
                            animate={{ rotate: [0, 180] }} // Rotate from 0 to 360 degrees
                            transition={{
                                repeat: Infinity, // Loop indefinitely
                                duration: 10, // Duration of one full rotation in seconds
                                ease: "linear", // Use linear easing for a smooth continuous rotation
                            }}
                            className="mr-5"
                        >
                            ✺
                        </motion.span>
                        {characters.map((char, index) => (
                            <motion.span
                                key={index}
                                custom={index}
                                initial={{ opacity: 0 }}
                                animate={controls}
                                className="inline-block"
                            >
                                {char === " " ? "\u00A0" : char}
                            </motion.span>
                        ))}
                    </h2>
                </div>
                <div className="mt-5 flex items-center justify-between">
                    <h4 className="text-lg tracking-tight md:text-3xl">
                        bensoncraven@hotmail.co.uk
                    </h4>

                    <span className="fill-white pr-8">
                        <FaArrowRightLong />
                    </span>
                </div>
                <hr className="my-3 h-px border-0 bg-neutral-100/40" />
                <div
                    ref={ref}
                    className="flex flex-col justify-between text-sm md:flex-row"
                >
                    <div className="flex space-x-5">
                        <h4>Github</h4>
                        <h4>Dribble</h4>
                        <h4>Instagram</h4>
                    </div>
                    <div>
                        <p className="mt-4 text-sm md:mt-0">
                            &copy; Code by Benson
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
