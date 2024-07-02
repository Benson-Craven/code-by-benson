"use client"

import { AnimatePresence, motion } from "framer-motion"

import React, { useRef, useState } from "react"
import Burger from "./Burger"
import Stairs from "./Stairs"
import Menu from "./Menu"
import Link from "next/link"

const Navbar = () => {
    const body = useRef(null)
    // const isInView = useInView(body, { once: true, margin: "-75%" })
    const [menuIsOpen, setMenuIsOpen] = useState(false)

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
            animate={"enter"}
            className="fixed top-0 z-10 flex w-full justify-between p-10 font-helvetica text-base text-white"
        >
            <Link href="/" scroll={false}>
                <div className="flex cursor-pointer">
                    <p className="mx-2 hover:rotate-180">
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
