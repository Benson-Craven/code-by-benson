export function heartTreatment(progress: number, index: number) {
    const clamped = Math.max(0, Math.min(1, progress))
    const phase = (clamped * 6 + index / 3) % 1
    const envelope = Math.min(1, clamped * 12, (1 - clamped) * 12)
    return {
        opacity: Math.sin(phase * Math.PI) * envelope,
        yPercent: -phase * 140,
        scale: 0.65 + Math.sin(phase * Math.PI) * 0.45,
    }
}

export function foodTreatment(progress: number, index: number) {
    const start = 0.325 + index * 0.025
    const reveal = Math.max(0, Math.min(1, (progress - start) / 0.075))
    const fade = Math.max(0, Math.min(1, (progress - 0.55) / 0.1))
    return {
        opacity: reveal * (1 - fade),
        yPercent: (1 - reveal) * 25 - fade * 20,
        scale: 0.75 + reveal * 0.25,
    }
}

export function frogTrick(click: number) {
    return click === 1 ? "catch" : click < 5 ? "hop" : "sigh"
}
