export const PROJECT_DETAIL_SEGMENT = "/projects/"

export type FloodOrigin = {
    left: number
    top: number
    width: number
    height: number
}

export type FloodViewport = {
    width: number
    height: number
}

export type FloodGeometry = {
    x: number
    y: number
    from: number
    to: number
}

// The circle starts at the frog, then grows until it covers the farthest corner.
export function floodGeometry(
    origin: FloodOrigin | null,
    viewport: FloodViewport,
): FloodGeometry {
    const x = origin ? origin.left + origin.width / 2 : 0
    const y = origin ? origin.top + origin.height / 2 : viewport.height
    const from = origin ? Math.max(origin.width, origin.height) / 2 : 0
    const to = Math.max(
        Math.hypot(x, y),
        Math.hypot(viewport.width - x, y),
        Math.hypot(x, viewport.height - y),
        Math.hypot(viewport.width - x, viewport.height - y),
    )

    return { x, y, from, to }
}

export function isProjectDetailPath(pathname: string) {
    return /^\/projects\/[^/]+\/?$/.test(pathname)
}

export function projectSlugFromPath(pathname: string) {
    const match = pathname.match(/^\/projects\/([^/]+)\/?$/)
    return match ? decodeURIComponent(match[1]) : undefined
}

export function projectDetailPath(slug: string) {
    return `${PROJECT_DETAIL_SEGMENT}${slug}`
}

export function projectCoverSelector(slug: string) {
    return `[data-project-cover="${slug}"]`
}

export function projectHeroSelector(slug: string) {
    return `[data-project-hero="${slug}"]`
}

export function projectPageSelector(slug: string) {
    return `[data-project-page="${slug}"]`
}

export function projectIndexSelector(slug: string) {
    return `[data-project-index] ${projectCoverSelector(slug)}`
}

export function isElementVisible(element: Element, viewport: FloodViewport) {
    const rect = element.getBoundingClientRect()
    return (
        rect.bottom > 0 &&
        rect.top < viewport.height &&
        rect.right > 0 &&
        rect.left < viewport.width
    )
}
