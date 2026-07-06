"use client"

import { motion, useScroll } from "framer-motion"

export default function ScrollProgress() {
    const { scrollYProgress } = useScroll()

    return (
        <motion.div
            aria-hidden="true"
            className="fixed left-0 top-0 z-[80] h-[2px] origin-left bg-signal"
            style={{ scaleX: scrollYProgress, width: "100%" }}
        />
    )
}
