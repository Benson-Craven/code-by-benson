import Link from "next/link"
import type { ReactNode } from "react"

type AnimatedLinkProps = {
    href: string
    children: ReactNode
    external?: boolean
    className?: string
}

export default function AnimatedLink({
    href,
    children,
    external,
    className = "",
}: AnimatedLinkProps) {
    const content = (
        <span className="group/link inline-flex items-center gap-1.5 text-[0.82rem] font-medium uppercase tracking-[0.12em] text-ink transition-colors duration-300 hover:text-signal focus-visible:text-signal">
            <span className="animated-link-label">{children}</span>
            <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover/link:translate-x-1"
            >
                {external ? "↗" : "→"}
            </span>
        </span>
    )

    if (external) {
        return (
            <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className={`focus-ring ${className}`}
            >
                {content}
            </a>
        )
    }

    return (
        <Link href={href} className={`focus-ring ${className}`}>
            {content}
        </Link>
    )
}
