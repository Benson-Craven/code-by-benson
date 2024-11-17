"use client"

import React, { useEffect, useRef } from "react"
import {
    FaArrowRightLong,
    FaBehance,
    FaDribbble,
    FaGithub,
    FaLinkedin,
} from "react-icons/fa6"
import { motion, useAnimation, useInView } from "framer-motion"
import Link from "next/link"
import FlipLink from "./FlipLink"

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
        <footer className="max-w-screen container relative mx-auto flex flex-col flex-nowrap justify-center gap-3 overflow-hidden bg-black px-6 pb-5 pt-20">
            <div className="flex flex-col flex-nowrap gap-6 py-6">
                <div className="relative flex flex-wrap justify-start text-base">
                    <h3 className="text-xl tracking-tight text-gray-400 md:text-2xl"></h3>
                </div>
                <div className="text-3xl md:text-7xl">
                    <h2 className="flex tracking-tight text-neutral-100">
                        <motion.span
                            animate={{ rotate: [0, 360] }} // Rotate from 0 to 360 degrees
                            transition={{
                                repeat: Infinity, // Loop indefinitely
                                duration: 15, // Duration of one full rotation in seconds
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
                                className="pointer-events-none inline-block"
                            >
                                {char === " " ? "\u00A0" : char}
                            </motion.span>
                        ))}
                    </h2>
                </div>
                <div className="mt-5 flex cursor-pointer items-center justify-between text-lg tracking-tight md:text-3xl">
                    <FlipLink
                        href={"mailto:bensoncraven@hotmail.co.uk"}
                        hoverText="Drop a message &#9996;"
                    >
                        Have a project in mind?
                    </FlipLink>

                    <motion.span
                        whileHover={{ rotate: 180 }}
                        className="fill-white pr-8"
                    >
                        <FaArrowRightLong />
                    </motion.span>
                </div>
                <hr className="my-3 h-px border-0 bg-neutral-100/40" />
                <div
                    ref={ref}
                    className="flex flex-col justify-between text-[2rem] md:flex-row"
                >
                    <div className="flex space-x-5">
                        <FaGithub className="cursor-pointer duration-300 hover:text-[#D3FD50]" />
                        <FaLinkedin className="cursor-pointer duration-300 hover:text-[#D3FD50]" />
                    </div>
                    <div>
                        <Link href={"/"}>
                            <p className="mt-4 text-sm md:mt-0">
                                &copy; Code by Benson
                            </p>
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
