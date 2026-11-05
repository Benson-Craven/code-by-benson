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
    // Desktop tucks the flag against the frog so it clears the About copy.
    return (
        <div
            className="preview-flag group/flag pointer-events-none absolute bottom-0 right-[-21%] aspect-[64/130] w-[30%] opacity-0 transition-opacity duration-[400ms] ease-[ease] motion-reduce:transition-none lg:right-[-6%]"
            data-frog-flag
            aria-hidden="true"
        >
            <svg
                className="h-full w-full overflow-visible"
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
                            className="origin-center animate-flag-wave [animation-play-state:paused] group-data-[visible=true]/flag:[animation-play-state:running] motion-reduce:animate-none"
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
