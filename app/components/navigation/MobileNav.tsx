"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"

const navItems = [
    { href: "/#work", label: "Work" },
    { href: "/#experience", label: "Experience" },
    { href: "/#about", label: "About" },
    { href: "/benson-craven-resume.pdf", label: "Resume" },
]

export default function MobileNav() {
    const [open, setOpen] = useState(false)
    const triggerRef = useRef<HTMLButtonElement>(null)
    const menuRef = useRef<HTMLElement>(null)

    useEffect(() => {
        if (!open) {
            return
        }

        menuRef.current?.querySelector<HTMLAnchorElement>("a")?.focus()

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== "Escape") {
                return
            }

            event.preventDefault()
            setOpen(false)
            triggerRef.current?.focus()
        }

        document.addEventListener("keydown", handleKeyDown)

        return () => {
            document.removeEventListener("keydown", handleKeyDown)
        }
    }, [open])

    const closeMenuAndRestoreFocus = () => {
        setOpen(false)
        triggerRef.current?.focus()
    }

    return (
        <div className="md:hidden">
            <button
                ref={triggerRef}
                type="button"
                className="focus-ring flex min-h-11 items-center gap-2 border border-ink/50 px-3 text-xs font-medium uppercase tracking-[0.16em]"
                aria-expanded={open}
                aria-controls="mobile-navigation"
                onClick={() => setOpen((current) => !current)}
            >
                <span>{open ? "Close" : "Menu"}</span>
                <span aria-hidden="true" className="text-signal-dark">
                    {open ? "−" : "+"}
                </span>
            </button>
            {open ? (
                <div className="absolute left-4 right-4 top-16 border-y border-ink bg-paper py-4 shadow-[0_20px_40px_rgba(23,23,20,0.08)]">
                    <nav
                        ref={menuRef}
                        id="mobile-navigation"
                        aria-label="Mobile navigation"
                        className="grid gap-1"
                    >
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="focus-ring px-2 py-3 text-xl tracking-tight"
                                onClick={closeMenuAndRestoreFocus}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <a
                            href="mailto:bensoncraven@hotmail.co.uk"
                            className="focus-ring px-2 py-3 text-xl tracking-tight text-signal-dark"
                            onClick={closeMenuAndRestoreFocus}
                        >
                            Email
                        </a>
                    </nav>
                </div>
            ) : null}
        </div>
    )
}
