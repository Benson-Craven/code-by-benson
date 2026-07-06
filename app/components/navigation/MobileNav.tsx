"use client"

import Link from "next/link"
import { useState } from "react"

const navItems = [
    { href: "#work", label: "Work" },
    { href: "#experience", label: "Experience" },
    { href: "#about", label: "About" },
]

export default function MobileNav() {
    const [open, setOpen] = useState(false)

    return (
        <div className="md:hidden">
            <button
                type="button"
                className="focus-ring flex min-h-11 items-center gap-2 border border-ink/20 px-3 text-xs font-medium uppercase tracking-[0.16em]"
                aria-expanded={open}
                aria-controls="mobile-navigation"
                onClick={() => setOpen((current) => !current)}
            >
                <span>{open ? "Close" : "Menu"}</span>
                <span aria-hidden="true" className="text-signal">
                    {open ? "−" : "+"}
                </span>
            </button>
            {open ? (
                <div
                    id="mobile-navigation"
                    className="absolute left-4 right-4 top-16 border-y border-ink bg-paper py-4 shadow-[0_20px_40px_rgba(23,23,20,0.08)]"
                >
                    <nav aria-label="Mobile navigation" className="grid gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="focus-ring px-2 py-3 text-xl tracking-tight"
                                onClick={() => setOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <a
                            href="https://github.com/Benson-Craven"
                            target="_blank"
                            rel="noreferrer"
                            className="focus-ring px-2 py-3 text-xl tracking-tight text-signal"
                            onClick={() => setOpen(false)}
                        >
                            GitHub ↗
                        </a>
                    </nav>
                </div>
            ) : null}
        </div>
    )
}
