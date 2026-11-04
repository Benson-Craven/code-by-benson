export interface FrogInstance {
    canvas: HTMLCanvasElement
    setPaused(paused: boolean): void
    resize(): void
    mouthScreenPos(): { x: number; y: number }
    wake(): void
    talk(duration?: number): void
    setAttention(x: number | null, y?: number): void
    destroy(): void
}
interface FrogModule {
    FrogMascot: new (
        host: HTMLElement,
        options: {
            mode: "pixel"
            fit: "container"
            paused: boolean
            draggable: boolean
        },
    ) => FrogInstance
}

export async function loadFrog(): Promise<FrogModule> {
    // Keep the supplied ES modules and their vendored Three.js outside the app bundle.
    const url = "/frog-mascot/src/frog-mascot.js"
    return import(/* webpackIgnore: true */ url) as Promise<FrogModule>
}

export function createFrog(
    module: FrogModule,
    host: HTMLElement,
): FrogInstance {
    const frog = new module.FrogMascot(host, {
        mode: "pixel",
        fit: "container",
        paused: true,
        draggable: false,
    })
    frog.canvas.style.pointerEvents = "none"
    frog.canvas.style.touchAction = "auto"
    return frog
}
