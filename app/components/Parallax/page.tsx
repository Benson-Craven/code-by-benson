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

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        console.log("Page scroll: ", latest)
    })

    const opacity = useTransform(scrollYProgress, [0.77, 0.91], [1, 0])
    const opacityGrid = useTransform(scrollYProgress, [0.6, 0.8], [1, 0])

    return (
        <div
            ref={ref}
            className="z-9 relative mt-0 h-[300vh] w-[100vw] rounded-br-full bg-neutral-100"
        >
            {/* Here is the div where the content will stick the top and the other div can cross over creating the illusion of the text remaining at the bottom of the div */}
            <div className="z-1 sticky bottom-auto top-0 h-[100vh] w-[100vw] overflow-hidden mix-blend-difference">
                <div className="z-3 relative h-full">
                    <div className="flex h-[100vh] w-[100vw] flex-col items-center justify-end">
                        <motion.h2
                            style={{ opacity }}
                            className="z-3 relative mb-16 block max-w-[90vw] shrink grow-0 items-end text-center text-2xl md:text-4xl lg:text-6xl"
                        >
                            Helping brands to stand out in the digital era.
                            Together we will set the new status quo. No
                            nonsense, always on the cutting edge.
                        </motion.h2>
                    </div>
                </div>
            </div>
            {/* Secondary Container with the images below */}
            {/* TODO: need to change the grid formations and see how it looks on mobile */}
            <div className="relative mx-auto mt-[200px] block w-[100vw] px-[30px]">
                <motion.div
                    style={{ opacity: opacityGrid }}
                    className="grid grid-cols-[.75fr_1fr_1fr_1.25fr_1.25fr_1.25fr_1fr_.75fr] gap-0"
                >
                    <div className="col-start-2 row-start-1">
                        <Image
                            src={"/images/akihabara.JPG"}
                            alt="Alt"
                            width={400}
                            height={400}
                        />
                    </div>
                    <div className="col-start-5 row-start-2">
                        <Image
                            src={"/images/akihabara.JPG"}
                            alt="Alt"
                            width={400}
                            height={400}
                        />
                    </div>
                    <div className="col-start-7 row-start-3">
                        <Image
                            src={"/images/akihabara.JPG"}
                            alt="Alt"
                            width={400}
                            height={400}
                        />
                    </div>
                    <div className="col-start-3 row-start-4">
                        <Image
                            src={"/images/akihabara.JPG"}
                            alt="Alt"
                            width={400}
                            height={400}
                        />
                    </div>
                    <div className="col-start-6 row-start-5">
                        <Image
                            src={"/images/akihabara.JPG"}
                            alt="Alt"
                            width={400}
                            height={400}
                        />
                    </div>
                    <div className="col-start-4 row-start-7">
                        <Image
                            src={"/images/akihabara.JPG"}
                            alt="Alt"
                            width={400}
                            height={400}
                        />
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default Parallax
