import React from "react"
import { motion } from "framer-motion"

interface Props {
    openMenu: () => void // Define the type of openMenu
}

const Button: React.FC<Props> = ({ openMenu }) => {
    return (
        <div
            onClick={openMenu}
            className="group fixed right-4 top-4 flex cursor-pointer items-center justify-center rounded-full bg-black p-3 sm:h-[100px] sm:w-[100px]"
        >
            {/* Hover Effect Background */}
            <motion.div
                className="absolute left-0 top-0 z-[-1] h-0 w-full rounded-full bg-[#D3FD50]"
                initial={{ height: "0%" }}
                whileHover={{ height: "100%" }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
            ></motion.div>

            {/* Animated SVG */}
            <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
                width="60"
                height="60"
                className="fill-none"
            >
                {/* Outer Circle */}
                <motion.circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="white"
                    strokeWidth="2"
                    className="transition-all duration-700 group-hover:stroke-[#D3FD50] group-hover:stroke-[3]"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    whileHover={{ pathLength: 0.8 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />

                {/* Animated Lines */}
                <motion.line
                    x1="30"
                    y1="40"
                    x2="70"
                    y2="40"
                    stroke="white"
                    strokeWidth="2"
                    className={
                        "transition-all duration-700 group-hover:stroke-[#D3FD50] group-hover:stroke-[3]"
                    }
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    whileHover={{ pathLength: 0.8 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />
                <motion.line
                    x1="30"
                    y1="50"
                    x2="70"
                    y2="50"
                    stroke="white"
                    strokeWidth="2"
                    className={
                        "transition-all duration-700 group-hover:stroke-[#D3FD50] group-hover:stroke-[3]"
                    }
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    whileHover={{ pathLength: 0.8 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />
                <motion.line
                    x1="30"
                    y1="60"
                    x2="70"
                    y2="60"
                    stroke="white"
                    strokeWidth="2"
                    className={
                        "transition-all duration-700 group-hover:stroke-[#D3FD50] group-hover:stroke-[3]"
                    }
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    whileHover={{ pathLength: 0.8 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />
            </motion.svg>

            {/* Hover Text */}
            <motion.span
                className="absolute left-1/2 top-20 -translate-x-1/2 text-sm text-white opacity-0 transition-opacity group-hover:opacity-100"
                initial={{ y: 10, opacity: 0 }}
                whileHover={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            >
                Open Menu
            </motion.span>
        </div>
    )
}

export default Button
