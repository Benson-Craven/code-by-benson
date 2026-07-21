import Link from "next/link"
import type { ReactNode } from "react"

type AnimatedLinkProps = {
    href: string
    children: ReactNode
    external?: boolean
    emphasis?: "lead" | "supporting"
    className?: string
}

export default function AnimatedLink({
    href,
    children,
    external,
    emphasis = "supporting",
    className = "",
}: AnimatedLinkProps) {
    const opensNewTab = external && href.startsWith("http")
    const emphasisClass =
        emphasis === "lead"
            ? "text-lg font-medium tracking-tight sm:text-xl"
            : "text-sm font-medium"
    const arrowMotionClass = opensNewTab
        ? "group-hover:translate-x-1 group-hover:-translate-y-1 group-focus-visible:translate-x-1 group-focus-visible:-translate-y-1"
        : "group-hover:translate-x-1 group-focus-visible:translate-x-1"
    const content = (
        <span className={`inline-flex items-center gap-2 ${emphasisClass}`}>
            <span>{children}</span>
            <span
                aria-hidden="true"
                className={`inline-block transition-transform duration-200 ease-out motion-reduce:transform-none motion-reduce:transition-none ${arrowMotionClass}`}
            >
                {opensNewTab ? "↗" : "→"}
            </span>
            {opensNewTab ? (
                <span className="sr-only"> (opens in a new tab)</span>
            ) : null}
        </span>
    )

    if (external) {
        return (
            <a
                href={href}
                target={opensNewTab ? "_blank" : undefined}
                rel={opensNewTab ? "noreferrer" : undefined}
                className={`focus-ring group text-ink transition-colors duration-200 hover:text-signal-dark focus-visible:text-signal-dark ${className}`}
            >
                {content}
            </a>
        )
    }

    return (
        <Link
            href={href}
            className={`focus-ring group text-ink transition-colors duration-200 hover:text-signal-dark focus-visible:text-signal-dark ${className}`}
        >
            {content}
        </Link>
    )
}
