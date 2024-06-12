import { motion, useInView } from "framer-motion"
import React, { useRef, useMemo } from "react"
import { slideUp, opacity } from "./animation.js"

const Manifesto = () => {
    const phrase =
        "Helping brands to stand out in the digital era. Together we will set the new status quo. No nonsense, always on the cutting edge."
    const descriptionRef = useRef(null)
    const isInView = useInView(descriptionRef, { once: true })

    const words = useMemo(() => phrase.split(" "), [phrase])

    return (
        <div className="flex h-screen items-center justify-center bg-neutral-100 px-52 font-helvetica text-black">
            <div ref={descriptionRef} className="flex items-center space-x-8">
                {/* Here is where the animation works using the useMemo Hook */}
                <p className="text-xl tracking-tight md:text-4xl">
                    {words.map((word, i) => (
                        <span
                            key={word + i}
                            className="relative inline-flex overflow-hidden"
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
                <div className="flex flex-col items-center justify-center">
                    <motion.p
                        variants={opacity}
                        animate={isInView ? "open" : "closed"}
                        className="text-lg tracking-tight md:text-xl"
                    >
                        The combination of my passion for design, code &
                        interaction positions me in a unique place in the web
                        design world.
                    </motion.p>
                    <button className="mt-10 rounded-full bg-slate-500 px-6 py-4 text-white ring-4 ring-slate-300">
                        About Myself
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Manifesto
