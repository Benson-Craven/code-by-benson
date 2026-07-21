export type ShaderRenderingMode = "animated" | "static" | "paused"

type ShaderRenderingConditions = {
    reduceMotion: boolean
    isIntersecting: boolean
    documentVisibility: DocumentVisibilityState
}

export function getShaderRenderingMode({
    reduceMotion,
    isIntersecting,
    documentVisibility,
}: ShaderRenderingConditions): ShaderRenderingMode {
    if (!isIntersecting || documentVisibility !== "visible") {
        return "paused"
    }

    return reduceMotion ? "static" : "animated"
}
