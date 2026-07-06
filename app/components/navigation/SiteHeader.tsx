import Link from "next/link"
import MobileNav from "./MobileNav"

const navItems = [
    { href: "#work", label: "Work" },
    { href: "#experience", label: "Experience" },
    { href: "#about", label: "About" },
]

export default function SiteHeader() {
    return (
        <header className="fixed inset-x-0 top-0 z-50 border-b border-ink/10 bg-paper/88 backdrop-blur-sm">
            <div className="relative mx-auto flex h-16 max-w-[1500px] items-center justify-between px-4 sm:px-6 lg:px-10">
                <Link
                    href="/"
                    className="focus-ring text-sm font-medium tracking-tight text-ink"
                >
                    Benson Craven
                </Link>
                <nav
                    aria-label="Primary navigation"
                    className="hidden items-center gap-8 text-sm text-ink/72 md:flex"
                >
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="focus-ring transition-colors duration-300 hover:text-ink"
                        >
                            {item.label}
                        </Link>
                    ))}
                    <a
                        href="https://github.com/Benson-Craven"
                        target="_blank"
                        rel="noreferrer"
                        className="focus-ring text-ink transition-colors duration-300 hover:text-signal"
                    >
                        GitHub ↗
                    </a>
                </nav>
                <MobileNav />
            </div>
        </header>
    )
}
