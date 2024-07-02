import React from "react"
import { height, background, mountAnim } from "./anim"
import { motion } from "framer-motion"

// Define Props interface for Stair component
interface StairProps {
    index: number
}

const Stairs: React.FC = () => {
    return (
        <div className="pointer-events-none fixed left-0 top-0 z-10 flex h-screen transition-all duration-1000">
            {[...Array(5)].map((_, index) => (
                <Stair key={index} index={index} />
            ))}
            <Background />
        </div>
    )
}

const Stair: React.FC<StairProps> = ({ index }) => {
    return (
        <motion.div
            variants={height}
            {...mountAnim}
            custom={4 - index}
            className="z-10 h-full w-[20vw] border-2 border-black bg-black"
        />
    )
}

const Background: React.FC = () => {
    return (
        <motion.div
            variants={background}
            {...mountAnim}
            className="absolute z-10 h-full w-full bg-black"
        />
    )
}

export default Stairs
