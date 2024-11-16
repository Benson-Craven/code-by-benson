"use client"

import { AnimatePresence, motion } from "framer-motion"
import React, { useEffect, useRef, useState } from "react"
import Burger from "./Burger"
import Stairs from "./Stairs"
import Menu from "./Menu"
import Link from "next/link"
import FlipLink from "../FlipLink"

const Navbar: React.FC = () => {
    const body = useRef<HTMLDivElement>(null)
    const [menuIsOpen, setMenuIsOpen] = useState(false)

    const [prevScrollPos, setPrevScrollPos] = useState<number>(
        typeof window !== "undefined" ? window.scrollY : 0,
    )
    const [top, setTop] = useState<number>(0)

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.scrollY

            if (currentScrollPos === 0) {
                setTop(0) // Always show navbar at the top
            } else if (prevScrollPos > currentScrollPos) {
                setTop(0) // Show navbar when scrolling up
            } else {
                setTop(-150) // Hide navbar when scrolling down
            }

            setPrevScrollPos(currentScrollPos)
        }

        window.addEventListener("scroll", handleScroll)

        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, [prevScrollPos]) // Include `top` in dependencies

    const animation = {
        initial: { y: "-50%", opacity: 0 },
        enter: (i: number) => ({
            y: "0",
            opacity: 1,
            transition: {
                duration: 0.8,
                ease: [0.5, 0.75, 0.9, 1],
                delay: 0.075 * i,
            },
        }),
    }

    return (
        <motion.nav
            ref={body}
            variants={animation}
            initial="initial"
            animate="enter"
            style={{ top: `${top}px`, transition: "top 0.3s" }} // Use inline style for `top`
            className="fixed z-10 flex w-full justify-between p-10 text-base tracking-tight"
        >
            <div className="text-black">
                <FlipLink href="/" hoverText="&copy; Code by Benson">
                    &copy; Code by Benson
                </FlipLink>
            </div>

            <Burger
                openMenu={() => {
                    setMenuIsOpen(true)
                }}
            />
            <AnimatePresence mode="wait">
                {menuIsOpen && (
                    <>
                        <Stairs />
                        <Menu
                            closeMenu={() => {
                                setMenuIsOpen(false)
                            }}
                        />
                    </>
                )}
            </AnimatePresence>
        </motion.nav>
    )
}

export default Navbar
