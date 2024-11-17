"use client"

import React, { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { motion, useInView } from "framer-motion"
import Link from "next/link"
import FlipLink from "./FlipLink"

const phrases = [" Freelance Front End Developer"]

const HeroSection = () => {
    const body = useRef(null)
    const text = "CODE-by-Benson"
    // console.log("text", text);

    const Letter = text.split("")

    // Melbourne
    // const latitude = "-37.81"
    // const longitude = "144.963058"

    // const weather = await fetch(
    //     `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=78049f6f572f9bbb3cd51e3d8faebf54`,
    //     { cache: "no-cache" },
    // ).then((res) => res.json())

    // console.log("Weather info: " + weather)

    const animation = {
        initial: { y: "100%", opacity: 0 },
        enter: (i: number) => ({
            y: "0",
            opacity: 1,
            transition: {
                duration: 1,
                ease: [0.5, 0.75, 0.9, 1],
                delay: 1.05,
            },
        }),
    }

    return (
        <section className="flex min-h-screen w-full flex-col justify-end bg-neutral-100 p-5 text-slate-900 md:rounded-tr-full md:p-10">
            <div className="overflow-hidden">
                <motion.h1
                    ref={body}
                    variants={animation}
                    initial="initial"
                    animate={"enter"}
                    className="mx-4 mb-16 w-4/5 text-xl font-normal tracking-tight text-black md:w-1/2 md:text-4xl"
                >
                    Melbourne based{" "}
                    <Link href={"/info"}>
                        <motion.span
                            className="hidden md:inline-block"
                            whileHover={{ scale: 0.9 }}
                        >
                            <Image
                                src={"/images/portrait.avif"}
                                alt="Portrait"
                                width={30}
                                height={30}
                                className="relative cursor-pointer overflow-hidden rounded-full"
                            />
                        </motion.span>{" "}
                    </Link>
                    developer crafting engaging, human-centered digital
                    experiences for forward-thinking brands
                </motion.h1>
            </div>

            <motion.div
                ref={body}
                variants={animation}
                initial="initial"
                animate={"enter"}
                className="mb-5 flex w-full flex-col justify-between px-5 pb-5 text-sm font-light md:flex-row md:text-base"
            >
                <div>
                    Freelance <br />
                    <FlipLink href="" hoverText="UX Designer">
                        Front End Developer
                    </FlipLink>
                </div>
                <div className="flex space-x-10 py-5 md:py-0">
                    <div>
                        Based in <br />
                        <FlipLink href="" hoverText="Australia">
                            Melbourne
                        </FlipLink>
                    </div>
                    <div>
                        Get in touch
                        <span className="font-normal">
                            <FlipLink href="" hoverText="Say hi! &#9996;">
                                bensoncraven@hotmail.co.uk
                            </FlipLink>
                        </span>
                    </div>
                </div>
            </motion.div>
            {/* <div className="relative flex min-h-screen items-center justify-center bg-black">
                <section className="animate-rotate absolute">
                    {Letter.map((item, index) => (
                        <span
                            key={index}
                            className="absolute top-[-200px] text-lg font-bold text-white"
                            style={{
                                transform: `rotate(${index * 14.5}deg)`,
                                transformOrigin: "0 200px",
                            }}
                        >
                            {item}
                        </span>
                    ))}
                </section>
            </div> */}
        </section>
    )
}

export default HeroSection
