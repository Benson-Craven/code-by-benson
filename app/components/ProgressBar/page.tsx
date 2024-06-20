"use client"

import { motion, useScroll, useSpring } from "framer-motion"
import React, { useEffect, useState } from "react"

const ProgressBar = () => {
    const { scrollYProgress } = useScroll()

    const [initialized, setInitialized] = useState(false)

    useEffect(() => {
        if (scrollYProgress) {
            setInitialized(true)
        }
    }, [scrollYProgress])

    const scaleX = useSpring(scrollYProgress || 0, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    })

    if (!initialized) {
        return null
    }
    return (
        <motion.div
            className="fixed bottom-[25px] left-0 right-0 h-[5px] bg-white mix-blend-difference"
            style={{ scaleX }}
        />
    )
}

export default ProgressBar
