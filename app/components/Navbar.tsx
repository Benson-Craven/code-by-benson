import Link from "next/link"
import React from "react"

const Navbar = () => {
    return (
        <nav className="fixed top-0 z-10 flex w-full justify-between p-10 font-helvetica text-base text-white mix-blend-difference">
            <Link href="/" scroll={false}>
                <div className="flex cursor-pointer">
                    <p className="mx-2 hover:rotate-180">&copy;</p> Code by
                    Benson
                </div>
            </Link>

            <div className="hidden md:flex md:space-x-10">
                <Link href="/link1">
                    <p className="hover:text-blue-500">Projects</p>
                </Link>
                <Link href="/link2">
                    <p className="hover:text-blue-500">Info</p>
                </Link>
                <Link href="/link3">
                    <p className="hover:text-blue-500">Let's Collaborate</p>
                </Link>
            </div>
        </nav>
    )
}

export default Navbar
