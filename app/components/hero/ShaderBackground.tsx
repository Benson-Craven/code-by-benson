"use client"

import { useEffect, useRef } from "react"

const vertexShader = `
attribute vec2 position;
varying vec2 vUv;

void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
}
`

const fragmentShader = `
precision highp float;

uniform float time;
uniform vec2 resolution;
uniform vec2 pointer;
uniform float intensity;
uniform vec3 colorBackground;
uniform vec3 colorSignal;
uniform vec3 colorDarkSignal;
varying vec2 vUv;

float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
        mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
        mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
        u.y
    );
}

float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 4; i++) {
        value += amplitude * noise(p);
        p = mat2(1.58, -1.08, 1.08, 1.58) * p + 7.13;
        amplitude *= 0.52;
    }
    return value;
}

void main() {
    vec2 uv = vUv;
    vec2 aspect = vec2(resolution.x / resolution.y, 1.0);
    vec2 p = (uv - vec2(0.5)) * aspect;

    vec2 anchor = vec2(0.38 * aspect.x, 0.02);
    vec2 q = p - anchor;
    q.x *= 0.84;
    q.y *= 1.18;

    vec2 pointerPosition = (pointer - vec2(0.5)) * aspect;
    float pointerField = exp(-dot(p - pointerPosition, p - pointerPosition) * 3.2);

    float t = time * 0.085;
    float terrain = fbm(q * 2.25 + vec2(t * 0.48, -t * 0.24));
    float cross = sin((q.x * 8.0 + terrain * 3.0) - t * 2.0) *
                  cos((q.y * 10.0 - terrain * 2.2) + t * 1.5);
    float lines = smoothstep(0.74, 0.96, abs(cross + terrain * 0.42));
    float contour = smoothstep(0.028, 0.0, abs(fract(terrain * 7.0 + q.x * 0.55 + t) - 0.5) - 0.42);

    float rightMask = smoothstep(-0.08, 0.52, uv.x);
    float verticalBreak = 0.72 + 0.18 * sin(uv.y * 13.0 + terrain * 4.0);
    float fieldShape = exp(-dot(q, q * vec2(0.92, 1.75)) * 1.05);
    float asymmetry = smoothstep(0.12, 0.95, fieldShape * rightMask * verticalBreak);

    float signal = (lines * 0.55 + contour * 0.45 + terrain * 0.16) * asymmetry;
    signal += pointerField * 0.12 * asymmetry;
    signal *= intensity;

    float paperGrain = (noise(uv * resolution.xy * 0.34) - 0.5) * 0.018;
    vec3 base = colorBackground + paperGrain;
    vec3 warmSignal = mix(colorDarkSignal, colorSignal, smoothstep(0.18, 0.92, signal));
    vec3 color = mix(base, warmSignal, clamp(signal * 0.7, 0.0, 0.5));
    color -= smoothstep(0.0, 0.55, uv.x) * signal * 0.05;

    gl_FragColor = vec4(color, 1.0);
}
`

type UniformLocations = {
    time: WebGLUniformLocation
    resolution: WebGLUniformLocation
    pointer: WebGLUniformLocation
    intensity: WebGLUniformLocation
    colorBackground: WebGLUniformLocation
    colorSignal: WebGLUniformLocation
    colorDarkSignal: WebGLUniformLocation
}

function createShader(
    gl: WebGLRenderingContext,
    type: number,
    source: string,
) {
    const shader = gl.createShader(type)

    if (!shader) {
        return null
    }

    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader)
        return null
    }

    return shader
}

function createProgram(gl: WebGLRenderingContext) {
    const vertex = createShader(gl, gl.VERTEX_SHADER, vertexShader)
    const fragment = createShader(gl, gl.FRAGMENT_SHADER, fragmentShader)

    if (!vertex || !fragment) {
        return null
    }

    const program = gl.createProgram()

    if (!program) {
        return null
    }

    gl.attachShader(program, vertex)
    gl.attachShader(program, fragment)
    gl.linkProgram(program)
    gl.deleteShader(vertex)
    gl.deleteShader(fragment)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        gl.deleteProgram(program)
        return null
    }

    return program
}

function getUniforms(
    gl: WebGLRenderingContext,
    program: WebGLProgram,
): UniformLocations | null {
    const time = gl.getUniformLocation(program, "time")
    const resolution = gl.getUniformLocation(program, "resolution")
    const pointer = gl.getUniformLocation(program, "pointer")
    const intensity = gl.getUniformLocation(program, "intensity")
    const colorBackground = gl.getUniformLocation(program, "colorBackground")
    const colorSignal = gl.getUniformLocation(program, "colorSignal")
    const colorDarkSignal = gl.getUniformLocation(program, "colorDarkSignal")

    if (
        !time ||
        !resolution ||
        !pointer ||
        !intensity ||
        !colorBackground ||
        !colorSignal ||
        !colorDarkSignal
    ) {
        return null
    }

    return {
        time,
        resolution,
        pointer,
        intensity,
        colorBackground,
        colorSignal,
        colorDarkSignal,
    }
}

export default function ShaderBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current

        if (!canvas) {
            return
        }

        const gl = canvas.getContext("webgl", {
            alpha: false,
            antialias: false,
            depth: false,
            stencil: false,
            powerPreference: "high-performance",
        })

        if (!gl) {
            canvas.dataset.webgl = "unsupported"
            return
        }

        const program = createProgram(gl)

        if (!program) {
            canvas.dataset.webgl = "unsupported"
            return
        }

        const uniforms = getUniforms(gl, program)

        if (!uniforms) {
            canvas.dataset.webgl = "unsupported"
            return
        }

        const positionLocation = gl.getAttribLocation(program, "position")
        const buffer = gl.createBuffer()

        if (!buffer || positionLocation < 0) {
            canvas.dataset.webgl = "unsupported"
            return
        }

        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        )
        const pointer = { x: 0.74, y: 0.46 }
        const targetPointer = { x: 0.74, y: 0.46 }
        const scrollIntensity = { value: 1 }
        const start = performance.now()
        let width = 0
        let height = 0
        let animationFrame = 0

        gl.useProgram(program)
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
            gl.STATIC_DRAW,
        )
        gl.enableVertexAttribArray(positionLocation)
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
        gl.uniform3f(uniforms.colorBackground, 0.949, 0.937, 0.91)
        gl.uniform3f(uniforms.colorSignal, 1, 0.341, 0.133)
        gl.uniform3f(uniforms.colorDarkSignal, 0.725, 0.18, 0.071)

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
            const nextWidth = Math.max(1, Math.floor(canvas.clientWidth * dpr))
            const nextHeight = Math.max(
                1,
                Math.floor(canvas.clientHeight * dpr),
            )

            if (width !== nextWidth || height !== nextHeight) {
                width = nextWidth
                height = nextHeight
                canvas.width = width
                canvas.height = height
                gl.viewport(0, 0, width, height)
                gl.uniform2f(uniforms.resolution, width, height)
            }
        }

        const updateScrollIntensity = () => {
            const fade = Math.max(0.08, 1 - window.scrollY / 720)
            scrollIntensity.value = fade
        }

        const updatePointer = (event: PointerEvent) => {
            const rect = canvas.getBoundingClientRect()
            targetPointer.x = (event.clientX - rect.left) / rect.width
            targetPointer.y = 1 - (event.clientY - rect.top) / rect.height
        }

        const render = (now: number) => {
            resize()
            pointer.x += (targetPointer.x - pointer.x) * 0.045
            pointer.y += (targetPointer.y - pointer.y) * 0.045

            const elapsed = reduceMotion.matches ? 6 : (now - start) * 0.001
            const motionIntensity = reduceMotion.matches ? 0.45 : 1

            gl.uniform1f(uniforms.time, elapsed)
            gl.uniform2f(uniforms.pointer, pointer.x, pointer.y)
            gl.uniform1f(
                uniforms.intensity,
                scrollIntensity.value * motionIntensity,
            )
            gl.drawArrays(gl.TRIANGLES, 0, 6)

            if (!reduceMotion.matches) {
                animationFrame = window.requestAnimationFrame(render)
            }
        }

        resize()
        updateScrollIntensity()
        render(performance.now())

        window.addEventListener("resize", resize, { passive: true })
        window.addEventListener("scroll", updateScrollIntensity, {
            passive: true,
        })
        window.addEventListener("pointermove", updatePointer, {
            passive: true,
        })

        return () => {
            window.cancelAnimationFrame(animationFrame)
            window.removeEventListener("resize", resize)
            window.removeEventListener("scroll", updateScrollIntensity)
            window.removeEventListener("pointermove", updatePointer)
            gl.deleteBuffer(buffer)
            gl.deleteProgram(program)
        }
    }, [])

    return (
        <div aria-hidden="true" className="shader-shell pointer-events-none">
            <canvas ref={canvasRef} className="h-full w-full" />
        </div>
    )
}
