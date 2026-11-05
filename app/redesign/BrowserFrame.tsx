import type { ReactNode } from "react"
import styles from "./redesign.module.css"

type BrowserFrameProps = {
    // A neutral host label keeps the chrome readable without claiming a
    // destination the project does not publish.
    label: string
    children: ReactNode
}

// The reference presents every screenshot inside a small browser chrome with a
// dithered offset shadow, so the work reads as real interface captures rather
// than loose images.
export default function BrowserFrame({ label, children }: BrowserFrameProps) {
    return (
        <div className={styles.caseFrame}>
            <span className={styles.caseFrameShadow} aria-hidden="true" />
            <div className={styles.caseFrameBody}>
                <div className={styles.caseFrameBar} aria-hidden="true">
                    <span className={styles.caseFrameDot} />
                    <span className={styles.caseFrameDot} />
                    <span className={styles.caseFrameDot} />
                    <span className={styles.caseFrameUrl}>{label}</span>
                </div>
                <div className={styles.caseFrameMedia}>{children}</div>
            </div>
        </div>
    )
}
