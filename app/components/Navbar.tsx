import Link from "next/link"
import React from "react"

const Navbar = () => {
    return (
        <nav className="fixed top-0 z-10 flex w-full justify-between p-10 font-helvetica text-xl text-white mix-blend-difference">
            <div>Code by Benson</div>
            <div className="flex space-x-10">
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
