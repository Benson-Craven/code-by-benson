"use client"

import React from "react"
import { Vortex } from "./Vortex"
import { motion } from "framer-motion"

interface AnimatedLettersProps {
    title: string
}

const singleLetterAnimation = {
    initial: { y: 400, opacity: 0 },
    animate: (index: number) => ({
        y: 0,
        opacity: 1,
        transition: {
            ease: "easeInOut", // Using a built-in easing function
            duration: 1,
            delay: index * 0.1, // stagger effect
        },
    }),
}

const AnimatedLetters: React.FC<AnimatedLettersProps> = ({ title }) => (
    <motion.span className="row-title" initial="initial" animate="animate">
        {Array.from(title).map((letter, index) => (
            <motion.span
                key={index}
                variants={singleLetterAnimation}
                initial="initial"
                animate="animate"
                custom={index}
            >
                {letter}
            </motion.span>
        ))}
    </motion.span>
)

const HeroSection = () => {
    return (
        <section className="relative min-h-screen overflow-hidden p-4 md:p-8 lg:p-16">
            {/* <Vortex backgroundColor="black" particleCount={150} baseHue={150}> */}
            <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    ease: "easeInOut",
                    duration: 1,
                    delay: 0.6,
                }}
                className="mx-5 my-20 font-helvetica lowercase"
            >
                <h1 className="text-[100px] leading-tight md:text-[100px] lg:text-[187px]">
                    <AnimatedLetters title="Code by Benson" />
                </h1>
                <div className="container mx-auto">
                    <div className="w-full">
                        <p className="p-4 text-justify">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Phasellus imperdiet, nulla et dictum interdum,
                            nisi lorem egestas odio, vitae scelerisque enim
                            ligula venenatis dolor. Maecenas nisl est, ultrices
                            nec congue eget, auctor vitae massa.
                        </p>
                    </div>
                </div>
            </motion.div>
            {/* // </Vortex> */}

            {/* <div className="absolute bottom-20 left-10 w-1/3 bg-blue-500 p-5 font-helvetica text-white">
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aliquam
          voluptatum perspiciatis voluptate. Corrupti magni quisquam voluptates
          voluptatem incidunt error aliquam accusantium perferendis labore in!
          Possimus odit et beatae maxime laboriosam in dolor. Explicabo ratione
          quo labore quaerat possimus aliquid dolor unde aspernatur ipsam,
          voluptatum corrupti asperiores placeat expedita repellat. Ullam?
        </p>
      </div> */}
        </section>
    )
}

export default HeroSection
