import { motion } from "framer-motion"
import React, { useEffect, useState } from "react"

const DURATION = 0.1
const STAGGER = 0.015

interface FlipLinkProps {
    children: string
    hoverText: string
    href: string
}

const FlipLink = ({ children, hoverText, href }: FlipLinkProps) => {
    return (
        <motion.a
            initial="initial"
            whileHover="hovered"
            href={href}
            className="relative block overflow-hidden whitespace-nowrap"
        >
            <div>
                {children.split("").map((l, i) => (
                    <motion.span
                        variants={{
                            initial: {
                                y: 0,
                            },
                            hovered: {
                                y: "-100%",
                            },
                        }}
                        transition={{
                            duration: DURATION,
                            ease: "easeInOut",
                            delay: STAGGER * i,
                        }}
                        className="inline-block"
                        key={i}
                        style={{ whiteSpace: "pre" }}
                    >
                        {l}
                    </motion.span>
                ))}
            </div>
            <div className="absolute inset-0">
                {hoverText.split("").map((l, i) => (
                    <motion.span
                        variants={{
                            initial: {
                                y: "100%",
                            },
                            hovered: {
                                y: 0,
                            },
                        }}
                        transition={{
                            duration: DURATION,
                            ease: "easeInOut",
                            delay: STAGGER * i,
                        }}
                        className="inline-block"
                        key={i}
                        style={{ whiteSpace: "pre" }}
                    >
                        {l}
                    </motion.span>
                ))}
            </div>
        </motion.a>
    )
}

export default FlipLink
