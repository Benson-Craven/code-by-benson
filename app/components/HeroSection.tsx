"use client"

import React, { useRef } from "react"
import Image from "next/image"
import { motion, useInView } from "framer-motion"

const phrases = [" Freelance Front End Developer"]

const HeroSection = () => {
    const body = useRef(null)
    // const isInView = useInView(body, { once: true, margin: "-75%" })

    const animation = {
        initial: { y: "100%", opacity: 0 },
        enter: (i: number) => ({
            y: "0",
            opacity: 1,
            transition: {
                duration: 0.8,
                ease: [0.5, 0.75, 0.9, 1],
                delay: 0.075 * i,
            },
        }),
    }

    return (
        <section className="flex min-h-screen w-full flex-col justify-end rounded-tr-full bg-neutral-100 p-10 font-helvetica text-slate-900">
            <div className="overflow-hidden">
                <motion.h1
                    ref={body}
                    variants={animation}
                    initial="initial"
                    animate={"enter"}
                    className="mx-4 mb-16 w-1/2 text-xl tracking-tight text-black md:text-4xl"
                >
                    Melbourne based{" "}
                    <span className="hidden md:inline-block">
                        <Image
                            src={"/images/portrait-bnw.JPG"}
                            alt="Portrait"
                            width={30}
                            height={30}
                            className="relative cursor-pointer overflow-hidden rounded-full"
                        />
                    </span>{" "}
                    developer crafting engaging, human-focused digital
                    experiences for a range of forward-thinking brands.
                </motion.h1>
            </div>

            <motion.div
                ref={body}
                variants={animation}
                initial="initial"
                animate={"enter"}
                className="flex w-full flex-col justify-between px-5 pb-5 text-sm font-light md:flex-row md:text-base"
            >
                <div>
                    <p>
                        Freelance <br />
                        Front End Developer
                    </p>
                </div>
                <div className="flex space-x-10 py-5 md:py-0">
                    <p className="md:px-10">
                        Based in <br />
                        Melbourne
                    </p>
                    <p>
                        Get in touch <br />
                        <b className="cursor-pointer">
                            bensoncraven@hotmail.co.uk
                        </b>
                    </p>
                </div>
            </motion.div>
        </section>
    )
}

export default HeroSection
