import styles from "./redesign.module.css"

// Six columns keep the tricolour in order while the flag ripples.
const flagColumns = [
    "#169b62",
    "#169b62",
    "#ffffff",
    "#ffffff",
    "#ff883e",
    "#ff883e",
]

export default function FrogFlag() {
    return (
        <div className={styles.frogFlag} data-frog-flag aria-hidden="true">
            <svg
                viewBox="0 0 64 130"
                focusable="false"
                shapeRendering="crispEdges"
            >
                <rect x="8" width="4" height="130" fill="#0b0b0c" />
                <rect x="6" width="8" height="4" fill="#ffe506" />
                {flagColumns.map((colour, index) => {
                    const x = 12 + index * 8
                    return (
                        <g
                            key={index}
                            className={styles.flagColumn}
                            style={{ animationDelay: `${-index * 0.22}s` }}
                        >
                            <rect
                                x={x}
                                y="10"
                                width="8"
                                height="34"
                                fill="#0b0b0c"
                            />
                            <rect
                                x={x}
                                y="12"
                                width="8"
                                height="30"
                                fill={colour}
                            />
                        </g>
                    )
                })}
            </svg>
        </div>
    )
}
