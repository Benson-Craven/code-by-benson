"use client"

import {
    motion,
    useMotionValueEvent,
    useScroll,
    useTransform,
} from "framer-motion"
import Image from "next/image"
import React, { useRef } from "react"

const Parallax = () => {
    const ref = useRef(null)

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    })

    // useMotionValueEvent(scrollYProgress, "change", (latest) => {
    //     console.log("Page scroll: ", latest)
    // })

    const opacity = useTransform(scrollYProgress, [0.85, 0.95], [1, 0])
    const opacityGrid = useTransform(scrollYProgress, [0.75, 0.9], [1, 0])

    return (
        <div
            ref={ref}
            className="z-9 relative mt-0 h-[300vh] w-[100vw] rounded-br-full bg-neutral-100 md:h-[450vh]"
        >
            {/* Here is the div where the content will stick the top and the other div can cross over creating the illusion of the text remaining at the bottom of the div */}
            <div className="z-1 sticky bottom-auto top-0 h-[100vh] w-[100vw] overflow-hidden mix-blend-difference">
                <div className="z-3 relative h-full">
                    <div className="flex h-[100vh] w-[100vw] flex-col items-center justify-end pb-5">
                        <motion.h2
                            style={{ opacity }}
                            className="z-3 relative block max-w-[90vw] shrink grow-0 items-end pb-6 text-center text-2xl tracking-tight md:pb-8 md:text-5xl lg:text-6xl"
                        >
                            Empowering businesses to thrive in the digital age.
                            Together, we'll lead the way with straightforward,
                            innovative solutions.
                        </motion.h2>
                    </div>
                </div>
            </div>
            {/* Secondary Container with the images below */}
            {/* TODO: need to change the grid formations and see how it looks on mobile */}
            <div className="relative mx-auto mt-[200px] block h-[200vh] w-[100vw] px-[30px]">
                <motion.div
                    style={{ opacity: opacityGrid }}
                    className="grid w-full grid-cols-6 gap-9 md:grid-cols-8"
                >
                    <div className="col-span-2 col-start-1 row-start-1 md:col-start-6">
                        <Image
                            src={"/images/akihabara.JPG"}
                            alt="Alt"
                            width={400}
                            height={400}
                            className="rounded-xl shadow-md"
                        />
                    </div>
                    <div className="col-span-2 col-start-5 row-start-2 md:col-start-2">
                        <Image
                            src={"/images/herbal.JPG"}
                            alt="Alt"
                            width={400}
                            height={400}
                            className="rounded-xl shadow-md"
                        />
                    </div>
                    <div className="col-span-2 col-start-2 row-start-3 md:col-start-5">
                        <Image
                            src={"/images/cycling.JPG"}
                            alt="Alt"
                            width={400}
                            height={400}
                            className="rounded-xl shadow-md"
                        />
                    </div>
                    <div className="col-span-2 col-start-4 row-start-4 md:col-start-3">
                        <Image
                            src={"/images/portrait-bnw.JPG"}
                            alt="Alt"
                            width={250}
                            height={250}
                            className="rounded-xl shadow-md"
                        />
                    </div>
                    <div className="col-span-2 col-start-2 row-start-6 md:col-start-4">
                        <Image
                            src={"/images/Pic2.JPG"}
                            alt="Alt"
                            width={250}
                            height={250}
                            className="rounded-xl shadow-md"
                        />
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default Parallax
