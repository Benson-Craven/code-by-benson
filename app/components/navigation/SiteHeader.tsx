import Link from "next/link"
import AnimatedThemeToggle from "./AnimatedThemeToggle"
import MobileNav from "./MobileNav"
import SkipLink from "./SkipLink"

const navItems = [
    { href: "/#work", label: "Work" },
    { href: "/#experience", label: "Experience" },
    { href: "/#about", label: "About" },
    { href: "/benson-craven-resume.pdf", label: "Resume" },
]

export default function SiteHeader() {
    return (
        <>
            <SkipLink />
            <header className="bg-paper-translucent fixed inset-x-0 top-0 z-50 border-b border-ink/10 backdrop-blur-sm">
                <div className="relative mx-auto flex h-16 max-w-[1500px] items-center justify-between px-4 sm:px-6 lg:px-10">
                    <Link
                        href="/"
                        className="focus-ring text-sm font-medium tracking-tight text-ink"
                    >
                        Benson Craven
                    </Link>
                    <div className="flex items-center gap-2 md:gap-5">
                        <nav
                            aria-label="Primary navigation"
                            className="text-ink-secondary hidden items-center gap-8 text-sm md:flex"
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
                                href="mailto:bensoncraven@hotmail.co.uk"
                                className="focus-ring text-ink transition-colors duration-300 hover:text-signal-dark"
                            >
                                Email
                            </a>
                        </nav>
                        <AnimatedThemeToggle />
                        <MobileNav />
                    </div>
                </div>
            </header>
        </>
    )
}
