import styles from "./redesign.module.css"

export default function FrogTrickArtwork() {
    return (
        <svg
            data-frog-trick-art
            className={styles.frogTrickArt}
            viewBox="0 0 100 105"
            aria-hidden="true"
            focusable="false"
            shapeRendering="crispEdges"
        >
            <path
                data-frog-tongue
                fill="none"
                stroke="#38152c"
                strokeWidth="2.8"
            />
            <path
                data-frog-tongue
                fill="none"
                stroke="#ef5b83"
                strokeWidth="1.6"
            />
            <g data-firefly opacity="0">
                <g className={styles.fireflyGlow}>
                    <rect
                        x="-4"
                        y="-4"
                        width="8"
                        height="8"
                        fill="#65ff57"
                        opacity="0.12"
                    />
                    <rect
                        x="-2.5"
                        y="-2.5"
                        width="5"
                        height="5"
                        fill="#65ff57"
                        opacity="0.25"
                    />
                    <rect
                        x="-1.5"
                        y="-1.5"
                        width="3"
                        height="3"
                        fill="#85ff70"
                    />
                </g>
            </g>
        </svg>
    )
}
