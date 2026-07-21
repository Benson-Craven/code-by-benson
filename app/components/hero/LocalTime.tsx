"use client"

import { useEffect, useState } from "react"

const formatter = new Intl.DateTimeFormat("en-IE", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Dublin",
    hour12: false,
})

function getLocalTime() {
    return formatter.format(new Date())
}

export default function LocalTime() {
    const [time, setTime] = useState<string | null>(null)

    useEffect(() => {
        const updateTime = () => {
            setTime(getLocalTime())
        }

        updateTime()

        const interval = window.setInterval(updateTime, 60_000)

        return () => window.clearInterval(interval)
    }, [])

    return (
        <span aria-live="off">
            Local time{" "}
            <span className="text-ink-secondary">{time ?? "--:--"}</span>
        </span>
    )
}
