// The screenshot frames develop as a two-colour pixel silhouette and dissolve
// back to the real image. Speech bubbles now use the same reveal, so the frog's
// dialogue arrives the same way as the project media.

import {
    bayerThreshold,
    packHexColour,
    pixelCellSize,
    pixelDevelopVisible,
    pixelGrid,
} from "./pixelDither"

export type SpeechSilhouette = {
    columns: number
    rows: number
    luminance: Float32Array
    mask: Uint8Array
}

export type SpeechReveal = {
    cancel: () => void
}

const DEVELOP_MS = 420
const RESOLVE_MS = 520
const PAPER = "#fbfbf8"
const INK = "#0b0b0c"

const easeInQuad = (progress: number) => progress * progress
const easeOutQuad = (progress: number) => 1 - (1 - progress) * (1 - progress)

function roundedRect(
    context: CanvasRenderingContext2D,
    width: number,
    height: number,
    radius: number,
) {
    const corner = Math.min(radius, width / 2, height / 2)
    context.beginPath()
    context.moveTo(corner, 0)
    context.lineTo(width - corner, 0)
    context.arcTo(width, 0, width, corner, corner)
    context.lineTo(width, height - corner)
    context.arcTo(width, height, width - corner, height, corner)
    context.lineTo(corner, height)
    context.arcTo(0, height, 0, height - corner, corner)
    context.lineTo(0, corner)
    context.arcTo(0, 0, corner, 0, corner)
    context.closePath()
}

function wrapLines(
    context: CanvasRenderingContext2D,
    text: string,
    maxWidth: number,
) {
    const words = text.split(/\s+/).filter(Boolean)
    const lines: string[] = []
    let current = ""

    for (const word of words) {
        const candidate = current ? `${current} ${word}` : word
        if (!current || context.measureText(candidate).width <= maxWidth) {
            current = candidate
            continue
        }
        lines.push(current)
        current = word
    }

    if (current) lines.push(current)
    return lines
}

// Draws the bubble at the same pixel grid as a screenshot: a paper shape with
// ink glyphs, sampled down to luminance and an alpha mask.
export function buildSpeechSilhouette(
    bubble: HTMLElement,
    width: number,
    height: number,
): SpeechSilhouette | null {
    if (width <= 0 || height <= 0) return null
    const styles = window.getComputedStyle(bubble)
    const grid = pixelGrid(
        width,
        height,
        pixelCellSize(window.devicePixelRatio, window.innerWidth < 768),
    )

    const scratch = document.createElement("canvas")
    scratch.width = grid.columns
    scratch.height = grid.rows
    const context = scratch.getContext("2d", { willReadFrequently: true })
    if (!context) return null

    context.scale(grid.columns / width, grid.rows / height)

    context.fillStyle = PAPER
    roundedRect(
        context,
        width,
        height,
        Number.parseFloat(styles.borderRadius) || 18,
    )
    context.fill()

    const paddingLeft = Number.parseFloat(styles.paddingLeft) || 0
    const paddingRight = Number.parseFloat(styles.paddingRight) || 0
    const paddingTop = Number.parseFloat(styles.paddingTop) || 0
    const fontSize = Number.parseFloat(styles.fontSize) || 16
    const lineHeight = Number.parseFloat(styles.lineHeight) || fontSize * 1.35

    context.fillStyle = INK
    context.font = `${styles.fontStyle} ${styles.fontWeight} ${styles.fontSize} ${styles.fontFamily}`
    context.textBaseline = "alphabetic"

    const lines = wrapLines(
        context,
        bubble.textContent ?? "",
        Math.max(1, width - paddingLeft - paddingRight),
    )
    lines.forEach((line, index) => {
        context.fillText(
            line,
            paddingLeft,
            paddingTop + lineHeight * (index + 0.78),
        )
    })

    const pixels = context.getImageData(0, 0, grid.columns, grid.rows).data
    const luminance = new Float32Array(grid.columns * grid.rows)
    const mask = new Uint8Array(grid.columns * grid.rows)

    for (let index = 0; index < luminance.length; index += 1) {
        const offset = index * 4
        mask[index] = pixels[offset + 3] > 127 ? 1 : 0
        luminance[index] =
            (pixels[offset] * 0.2126 +
                pixels[offset + 1] * 0.7152 +
                pixels[offset + 2] * 0.0722) /
            255
    }

    return {
        columns: grid.columns,
        rows: grid.rows,
        luminance,
        mask,
    }
}

export function paintSpeechSilhouette(
    canvas: HTMLCanvasElement,
    silhouette: SpeechSilhouette,
    develop: number,
    resolve: number,
) {
    const context = canvas.getContext("2d")
    if (!context) return false

    if (canvas.width !== silhouette.columns) canvas.width = silhouette.columns
    if (canvas.height !== silhouette.rows) canvas.height = silhouette.rows

    const image = context.createImageData(silhouette.columns, silhouette.rows)
    const words = new Uint32Array(image.data.buffer)
    const paper = packHexColour(PAPER)
    const ink = packHexColour(INK)

    for (let row = 0; row < silhouette.rows; row += 1) {
        for (let column = 0; column < silhouette.columns; column += 1) {
            const index = row * silhouette.columns + column
            if (!silhouette.mask[index]) continue
            if (
                !pixelDevelopVisible(
                    column,
                    row,
                    silhouette.columns,
                    silhouette.rows,
                    develop,
                    resolve,
                )
            )
                continue

            words[index] =
                silhouette.luminance[index] > bayerThreshold(column, row)
                    ? paper
                    : ink
        }
    }

    context.putImageData(image, 0, 0)
    return true
}

// Runs the develop, reveals the real bubble surface, dissolves the pixels and
// reports when the dissolve has finished so the text can follow.
export function revealSpeech(
    canvas: HTMLCanvasElement,
    bubble: HTMLElement,
    onReveal: () => void,
    onSettled: () => void,
): SpeechReveal {
    const width = bubble.offsetWidth
    const height = bubble.offsetHeight
    const silhouette = buildSpeechSilhouette(bubble, width, height)

    if (!silhouette) {
        canvas.hidden = true
        onReveal()
        onSettled()
        return { cancel: () => undefined }
    }

    canvas.style.left = `${bubble.offsetLeft}px`
    canvas.style.top = `${bubble.offsetTop}px`
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    canvas.hidden = false

    let frame = 0
    let phase: "develop" | "resolve" = "develop"
    let resolveStart = 0
    let settled = false
    let cancelled = false
    const startAt = performance.now()

    paintSpeechSilhouette(canvas, silhouette, 0, 0)

    const cancel = () => {
        cancelled = true
        window.cancelAnimationFrame(frame)
        canvas.hidden = true
    }

    const tick = (now: number) => {
        if (cancelled) return

        if (phase === "develop") {
            const progress = Math.min(
                1,
                Math.max(0, now - startAt) / DEVELOP_MS,
            )
            paintSpeechSilhouette(canvas, silhouette, easeInQuad(progress), 0)

            if (progress < 1) {
                frame = window.requestAnimationFrame(tick)
                return
            }

            onReveal()
            phase = "resolve"
            resolveStart = now
            frame = window.requestAnimationFrame(tick)
            return
        }

        const progress = Math.min(1, (now - resolveStart) / RESOLVE_MS)
        paintSpeechSilhouette(canvas, silhouette, 1, easeOutQuad(progress))

        // Bring the real text in while the last pixels clear, so the bubble
        // never sits empty.
        if (!settled && progress >= 0.7) {
            settled = true
            onSettled()
        }

        if (progress < 1) {
            frame = window.requestAnimationFrame(tick)
            return
        }

        canvas.hidden = true
    }

    frame = window.requestAnimationFrame(tick)

    return { cancel }
}
