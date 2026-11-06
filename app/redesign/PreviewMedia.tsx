"use client"

import type { PreviewMedia as Media } from "./projectPresentationData"

export default function PreviewMedia({
    media,
    className,
    cover,
}: {
    media: Media
    className: string
    cover?: string
}) {
    const style = { objectPosition: media.position }
    if (
        media.type === "video" ||
        /\.(mp4|webm|ogv)(?:[?#]|$)/i.test(media.src)
    ) {
        return (
            <video
                className={className}
                src={media.src}
                poster={media.poster}
                aria-label={media.alt}
                style={style}
                onCanPlay={(event) => {
                    const video = event.currentTarget
                    video.muted = true
                    video.defaultMuted = true
                    void video.play().catch(() => {
                        // Browser playback restrictions can still require a gesture.
                    })
                }}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
            >
                <a href={media.src}>Open video</a>
            </video>
        )
    }
    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            className={className}
            src={media.src}
            alt={media.alt}
            width={1440}
            height={900}
            loading="lazy"
            data-project-cover={cover}
            style={style}
        />
    )
}
