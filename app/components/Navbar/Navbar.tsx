"use client"

import { AnimatePresence, motion } from "framer-motion"
import React, { useEffect, useRef, useState } from "react"
import Burger from "./Burger"
import Stairs from "./Stairs"
import Menu from "./Menu"
import Link from "next/link"

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
            if (prevScrollPos > currentScrollPos) {
                setTop(0) // Show navbar
            } else {
                setTop(-150) // Hide navbar
            }
            setPrevScrollPos(currentScrollPos)

            // Debugging scroll position and top value
            // console.log(
            //     "Scroll progress: " + currentScrollPos + " Top = " + top,
            // )
        }

        window.addEventListener("scroll", handleScroll)

        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, [prevScrollPos, top]) // Include `top` in dependencies

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
            className="fixed z-10 flex w-full justify-between p-10 font-helvetica text-base"
        >
            <Link href="/" scroll={false} className="flex cursor-pointer">
                <div>
                    <p className="mx-2 tracking-tight text-black hover:rotate-180">
                        &copy; Code by Benson
                    </p>
                </div>
            </Link>

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
