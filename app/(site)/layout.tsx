import type { ReactNode } from "react"
import ProjectTransition from "../redesign/ProjectTransition"
import "../redesign/preview.css"

export default function SiteLayout({ children }: { children: ReactNode }) {
    return (
        <>
            {children}
            <ProjectTransition />
            <p
                id="redesign-route-status"
                className="sr-only"
                role="status"
                aria-live="polite"
            />
        </>
    )
}
