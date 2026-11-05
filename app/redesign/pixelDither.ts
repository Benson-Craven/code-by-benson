// A small Bayer-dither renderer for the preview's pixelated project covers.
// The reference site draws covers into a low-resolution canvas, dithers them
// towards the viewport edges, and resolves a cover into a low-colour image
// during the page transition. This module keeps that behaviour deterministic
// so the pure parts can be tested without a browser.

export const PIXEL_INK = 0x0b0b0c
export const PIXEL_BAYER_4 = [
    0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5,
].map((value) => value / 16)

export type PixelGrid = {
    columns: number
    rows: number
    cellSize: number
}

export type PixelCoverSource = {
    columns: number
    rows: number
    cellSize: number
    tint: number
    ink: number
    luminance: Float32Array
    pixelColours: Uint32Array
}

export type PixelCoverOptions = {
    devicePixelRatio?: number
    narrow?: boolean
    progress?: number
}

const HEX_COLOUR = /^#?([0-9a-f]{6})$/i

export function bayerThreshold(column: number, row: number) {
    const x = ((Math.floor(column) % 4) + 4) % 4
    const y = ((Math.floor(row) % 4) + 4) % 4
    return PIXEL_BAYER_4[y * 4 + x]
}

export function parseHexColour(value: string) {
    const match = HEX_COLOUR.exec(value.trim())
    if (!match) return null

    const numeric = Number.parseInt(match[1], 16)
    return {
        red: (numeric >> 16) & 255,
        green: (numeric >> 8) & 255,
        blue: numeric & 255,
    }
}

// Uint32Array colour words are little-endian RGBA on the web platform.
export function packColour(red: number, green: number, blue: number) {
    return (
        ((255 << 24) |
            ((blue & 255) << 16) |
            ((green & 255) << 8) |
            (red & 255)) >>>
        0
    )
}

export function packHexColour(value: string, fallback = PIXEL_INK) {
    const colour = parseHexColour(value)
    return colour
        ? packColour(colour.red, colour.green, colour.blue)
        : packColour(
              (fallback >> 16) & 255,
              (fallback >> 8) & 255,
              fallback & 255,
          )
}

// Match the reference's device-pixel cell size: 2 CSS pixels on large screens
// and a DPR-aware, slightly smaller cell on phones.
export function pixelCellSize(devicePixelRatio: number, narrow: boolean) {
    const ratio =
        Number.isFinite(devicePixelRatio) && devicePixelRatio > 0
            ? devicePixelRatio
            : 1

    return narrow
        ? Math.max(1, Math.round((ratio * 4) / 3) / ratio)
        : Math.max(1, 2)
}

export function pixelGrid(
    width: number,
    height: number,
    cellSize: number,
): PixelGrid {
    const safeCell = Math.max(1, cellSize)

    return {
        columns: Math.max(1, Math.ceil(width / safeCell)),
        rows: Math.max(1, Math.ceil(height / safeCell)),
        cellSize: safeCell,
    }
}

// Stable per-cell noise. It gives the reveal a scattered pixel edge instead of
// a clean linear wipe, without using Math.random on every frame.
export function pixelNoise(column: number, row: number) {
    let value =
        (Math.imul(column | 0, 374761393) + Math.imul(row | 0, 668265263)) >>> 0
    value = Math.imul(value ^ (value >>> 13), 1274126177) >>> 0
    value = (value ^ (value >>> 16)) >>> 0
    return value / 4294967296
}

export function revealProgress(elapsed: number, duration: number) {
    if (duration <= 0) return elapsed >= 0 ? 1 : 0
    const progress = Math.max(0, Math.min(1, elapsed / duration))
    return 1 - Math.pow(1 - progress, 3)
}

export type PixelDirection = "open" | "close"

// The shared cover crossfade is pixelated on the way in and resolved back to
// pixels on the way out.
export function pixelCrossfade(direction: PixelDirection) {
    return direction === "open" ? { from: 1, to: 0 } : { from: 0, to: 1 }
}

export function pixelColour(
    luminance: number,
    threshold: number,
    tint: number,
    ink: number,
) {
    return luminance > threshold ? tint : ink
}

// Bright portfolio screenshots would otherwise resolve to a single tint block.
// Stretching the sampled luminance keeps their layout and type legible in the
// two-colour dither.
export function normaliseLuminance(values: Float32Array) {
    let minimum = 1
    let maximum = 0

    for (let index = 0; index < values.length; index += 1) {
        const value = values[index]
        if (value < minimum) minimum = value
        if (value > maximum) maximum = value
    }

    const range = maximum - minimum
    if (range < 0.04) return values

    const output = new Float32Array(values.length)
    for (let index = 0; index < values.length; index += 1) {
        output[index] = (values[index] - minimum) / range
    }
    return output
}

export function preparePixelCover(
    image: HTMLImageElement,
    tint: string,
    width: number,
    height: number,
    {
        devicePixelRatio = 1,
        narrow = false,
    }: Pick<PixelCoverOptions, "devicePixelRatio" | "narrow"> = {},
): PixelCoverSource | null {
    if (width <= 0 || height <= 0) return null
    if (!image.complete || image.naturalWidth <= 0) return null

    const grid = pixelGrid(
        width,
        height,
        pixelCellSize(devicePixelRatio, narrow),
    )
    const scratch = document.createElement("canvas")
    scratch.width = grid.columns
    scratch.height = grid.rows
    const context = scratch.getContext("2d", { willReadFrequently: true })
    if (!context) return null

    context.imageSmoothingEnabled = true
    context.imageSmoothingQuality = "high"

    const scale = Math.max(
        grid.columns / image.naturalWidth,
        grid.rows / image.naturalHeight,
    )
    const drawWidth = image.naturalWidth * scale
    const drawHeight = image.naturalHeight * scale
    context.drawImage(
        image,
        (grid.columns - drawWidth) / 2,
        (grid.rows - drawHeight) / 2,
        drawWidth,
        drawHeight,
    )

    const pixels = context.getImageData(0, 0, grid.columns, grid.rows).data
    const tintRgb = parseHexColour(tint) ?? { red: 11, green: 11, blue: 12 }
    const luminance = new Float32Array(grid.columns * grid.rows)
    for (let index = 0; index < luminance.length; index += 1) {
        const offset = index * 4
        luminance[index] =
            (pixels[offset] * 0.2126 +
                pixels[offset + 1] * 0.7152 +
                pixels[offset + 2] * 0.0722) /
            255
    }

    const levels = 6
    const step = 255 / (levels - 1)
    const quantise = (value: number, dither: number) =>
        Math.max(0, Math.min(255, Math.round((value + dither) / step) * step))
    const pixelColours = new Uint32Array(grid.columns * grid.rows)
    for (let row = 0; row < grid.rows; row += 1) {
        for (let column = 0; column < grid.columns; column += 1) {
            const index = row * grid.columns + column
            const offset = index * 4
            const dither = (bayerThreshold(column, row) - 0.5) * step
            pixelColours[index] = packColour(
                quantise(pixels[offset] * 0.72 + tintRgb.red * 0.28, dither),
                quantise(
                    pixels[offset + 1] * 0.72 + tintRgb.green * 0.28,
                    dither,
                ),
                quantise(
                    pixels[offset + 2] * 0.72 + tintRgb.blue * 0.28,
                    dither,
                ),
            )
        }
    }

    return {
        columns: grid.columns,
        rows: grid.rows,
        cellSize: grid.cellSize,
        tint: packColour(tintRgb.red, tintRgb.green, tintRgb.blue),
        ink: packHexColour("#0b0b0c"),
        luminance: normaliseLuminance(luminance),
        pixelColours,
    }
}

export type PixelSilhouette = {
    columns: number
    rows: number
    cellSize: number
    luminance: Float32Array
}

export type PixelDevelopOptions = {
    devicePixelRatio?: number
    narrow?: boolean
}

// Screenshot reveals on the reference site start as a two-colour pixel
// silhouette that develops in and then dissolves away in the same order,
// handing the frame over to the real image. The silhouette only needs the
// luminance grid, so it skips the tint quantisation used by covers.
export function preparePixelSilhouette(
    image: HTMLImageElement,
    width: number,
    height: number,
    { devicePixelRatio = 1, narrow = false }: PixelDevelopOptions = {},
): PixelSilhouette | null {
    if (width <= 0 || height <= 0) return null
    if (!image.complete || image.naturalWidth <= 0) return null

    const grid = pixelGrid(
        width,
        height,
        pixelCellSize(devicePixelRatio, narrow),
    )
    const scratch = document.createElement("canvas")
    scratch.width = grid.columns
    scratch.height = grid.rows
    const context = scratch.getContext("2d", { willReadFrequently: true })
    if (!context) return null

    context.imageSmoothingEnabled = true
    context.imageSmoothingQuality = "high"

    const scale = Math.max(
        grid.columns / image.naturalWidth,
        grid.rows / image.naturalHeight,
    )
    const drawWidth = image.naturalWidth * scale
    const drawHeight = image.naturalHeight * scale
    context.drawImage(
        image,
        (grid.columns - drawWidth) / 2,
        (grid.rows - drawHeight) / 2,
        drawWidth,
        drawHeight,
    )

    const pixels = context.getImageData(0, 0, grid.columns, grid.rows).data
    const luminance = new Float32Array(grid.columns * grid.rows)
    for (let index = 0; index < luminance.length; index += 1) {
        const offset = index * 4
        luminance[index] =
            (pixels[offset] * 0.2126 +
                pixels[offset + 1] * 0.7152 +
                pixels[offset + 2] * 0.0722) /
            255
    }

    return {
        columns: grid.columns,
        rows: grid.rows,
        cellSize: grid.cellSize,
        luminance,
    }
}

// Both the develop and the resolve pass use a stable per-cell noise offset by
// the row, so the silhouette has a soft, scattered edge at any progress.
export function pixelDevelopVisible(
    column: number,
    row: number,
    columns: number,
    rows: number,
    develop: number,
    resolve: number,
) {
    const noise = (pixelNoise(column, row) + row / Math.max(1, rows)) / 2
    return noise >= resolve && noise < develop
}

export type PixelDevelopPaint = {
    develop: number
    resolve: number
    paper?: string
    ink?: string
}

export function paintDevelopedImage(
    canvas: HTMLCanvasElement,
    silhouette: PixelSilhouette,
    { develop, resolve, paper = "#fbfbf8", ink = "#0b0b0c" }: PixelDevelopPaint,
) {
    const context = canvas.getContext("2d")
    if (!context) return false

    if (canvas.width !== silhouette.columns) canvas.width = silhouette.columns
    if (canvas.height !== silhouette.rows) canvas.height = silhouette.rows

    const image = context.createImageData(silhouette.columns, silhouette.rows)
    const words = new Uint32Array(image.data.buffer)
    const paperWord = packHexColour(paper)
    const inkWord = packHexColour(ink, PIXEL_INK)

    for (let row = 0; row < silhouette.rows; row += 1) {
        for (let column = 0; column < silhouette.columns; column += 1) {
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

            const index = row * silhouette.columns + column
            words[index] =
                silhouette.luminance[index] > bayerThreshold(column, row)
                    ? paperWord
                    : inkWord
        }
    }

    context.putImageData(image, 0, 0)
    return true
}

export type PixelEdgeOptions = {
    rect: {
        left: number
        top: number
        width: number
        height: number
    }
    viewport: {
        width: number
        height: number
    }
    open?: number
}

// The reference grid keeps the real image visible in the middle and dithers
// the cover towards the viewport edges. Hovering or focusing opens the clear
// centre so the image resolves in place.
export function pixelEdgeVisible(
    column: number,
    row: number,
    source: PixelCoverSource,
    { rect, viewport, open = 1 }: PixelEdgeOptions,
) {
    const narrow = viewport.width < 768
    const radiusX = narrow ? viewport.height * 0.3 : viewport.width * 0.7
    const radiusY = narrow ? viewport.height * 0.3 : viewport.height * 0.4
    const noiseScale = narrow ? 1.7 : 1.4
    const originX = (rect.left - viewport.width / 2) / radiusX
    const originY = (rect.top - viewport.height / 2) / radiusY
    const x = originX + (column * source.cellSize) / radiusX
    const y = originY + (row * source.cellSize) / radiusY
    const distance = Math.hypot(x, y)

    return distance > open * (1 + pixelNoise(column, row) * (noiseScale - 1))
}

export function paintPixelatedImage(
    canvas: HTMLCanvasElement,
    source: PixelCoverSource,
    progress = 1,
) {
    const context = canvas.getContext("2d")
    if (!context) return false

    if (canvas.width !== source.columns) canvas.width = source.columns
    if (canvas.height !== source.rows) canvas.height = source.rows

    const image = context.createImageData(source.columns, source.rows)
    const words = new Uint32Array(image.data.buffer)
    const reveal = Math.max(0, Math.min(1, progress))

    if (reveal >= 1) {
        words.set(source.pixelColours)
    } else {
        for (let row = 0; row < source.rows; row += 1) {
            for (let column = 0; column < source.columns; column += 1) {
                const index = row * source.columns + column
                const threshold = bayerThreshold(column, row)
                const noise = (pixelNoise(column, row) + threshold) / 2
                words[index] =
                    noise > reveal ? source.ink : source.pixelColours[index]
            }
        }
    }

    context.putImageData(image, 0, 0)
    return true
}

export function paintPixelEdgeCover(
    canvas: HTMLCanvasElement,
    source: PixelCoverSource,
    options: PixelEdgeOptions,
) {
    const context = canvas.getContext("2d")
    if (!context) return false

    if (canvas.width !== source.columns) canvas.width = source.columns
    if (canvas.height !== source.rows) canvas.height = source.rows

    const image = context.createImageData(source.columns, source.rows)
    const words = new Uint32Array(image.data.buffer)

    for (let row = 0; row < source.rows; row += 1) {
        for (let column = 0; column < source.columns; column += 1) {
            if (!pixelEdgeVisible(column, row, source, options)) continue

            const index = row * source.columns + column
            words[index] = pixelColour(
                source.luminance[index],
                bayerThreshold(column, row),
                source.tint,
                source.ink,
            )
        }
    }

    context.putImageData(image, 0, 0)
    return true
}

export function createPixelatedImageCanvas(
    image: HTMLImageElement,
    tint: string,
    width: number,
    height: number,
    options: PixelCoverOptions = {},
) {
    const source = preparePixelCover(image, tint, width, height, options)
    if (!source) return null

    const canvas = document.createElement("canvas")
    if (!paintPixelatedImage(canvas, source, options.progress ?? 1)) return null
    return canvas
}
