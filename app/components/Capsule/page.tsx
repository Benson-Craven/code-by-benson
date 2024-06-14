"use client"

import React, { useEffect, useRef } from "react"
import Matter from "matter-js"

const PhysicsEngine: React.FC = () => {
    const scene = useRef<HTMLDivElement>(null)
    const engine = useRef<Matter.Engine | null>(null)
    const render = useRef<Matter.Render | null>(null)

    useEffect(() => {
        // Create Matter.js engine
        engine.current = Matter.Engine.create()
        render.current = Matter.Render.create({
            element: scene.current!,
            engine: engine.current,
            options: {
                width: window.innerWidth,
                height: window.innerHeight,
                wireframes: false,
                background: "black",
            },
        })

        // Set pointer-events to none to allow scrolling
        render.current.canvas.style.pointerEvents = "none"

        // Create walls
        const walls = [
            Matter.Bodies.rectangle(
                window.innerWidth / 2,
                0,
                window.innerWidth,
                50,
                {
                    isStatic: true,
                },
            ),
            Matter.Bodies.rectangle(
                window.innerWidth / 2,
                window.innerHeight,
                window.innerWidth,
                50,
                {
                    isStatic: true,
                },
            ),
            Matter.Bodies.rectangle(
                0,
                window.innerHeight / 2,
                50,
                window.innerHeight,
                {
                    isStatic: true,
                },
            ),
            Matter.Bodies.rectangle(
                window.innerWidth,
                window.innerHeight / 2,
                50,
                window.innerHeight,
                {
                    isStatic: true,
                },
            ),
        ]

        // Text blocks
        const textBlocks = [
            { text: "Want", color: "#C6EE56" },
            { text: "to", color: "#06D6A0" },
            { text: "say", color: "#1B9AAA" },
            { text: "hi", color: "#EF476F" },
            { text: "?", color: "#FFC43D" },
        ]

        // Calculate block dimensions
        const blockHeight = 250
        const blockPadding = 60
        const fontSize = 150

        // Create blocks
        const blocks = textBlocks.map((block, index) => {
            const blockWidth = block.text.length * fontSize + blockPadding
            return Matter.Bodies.rectangle(
                200 + index * 300,
                200,
                blockWidth,
                blockHeight,
                {
                    restitution: 0.3,
                    density: 0.005,
                    friction: 0.4,
                    chamfer: { radius: 100 },
                    render: {
                        fillStyle: block.color,
                        lineWidth: 0,
                    },
                    label: block.text.toUpperCase(), // Add text as a label
                },
            ) as Matter.Body & { label?: string } // Type annotation for custom label
        })

        // Add all bodies to the world
        Matter.World.add(engine.current!.world, [...walls, ...blocks])

        // Add mouse control
        const mouse = Matter.Mouse.create(render.current!.canvas)
        const mouseConstraint = Matter.MouseConstraint.create(engine.current!, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false,
                },
            },
        })

        Matter.World.add(engine.current!.world, mouseConstraint)

        render.current!.mouse = mouse

        // Custom render to draw text on the blocks
        Matter.Events.on(render.current!, "afterRender", () => {
            const context = render.current!.context
            context.font = `${fontSize}px 'Press Start 2P'`
            context.fillStyle = "white"
            context.textAlign = "center"
            context.textBaseline = "middle"
            blocks.forEach((block) => {
                const { x, y } = block.position
                context.save()
                context.translate(x, y)
                context.rotate(block.angle)
                if (block.label) {
                    context.fillText(block.label, 0, 0)
                }
                context.restore()
            })
        })

        // Add mouse attraction
        Matter.Events.on(engine.current!, "beforeUpdate", () => {
            blocks.forEach((block) => {
                Matter.Body.setVelocity(block, {
                    x: block.velocity.x * 0.95, // Adjust damping factor as needed
                    y: block.velocity.y * 0.95, // Adjust damping factor as needed
                })
                const forceMagnitude = 0.2
                const direction = Matter.Vector.sub(
                    mouse.position,
                    block.position,
                )
                const normalizedDirection = Matter.Vector.normalise(direction)
                const force = Matter.Vector.mult(
                    normalizedDirection,
                    forceMagnitude,
                )
                Matter.Body.applyForce(block, block.position, force)
            })
        })

        // Run the engine and renderer
        Matter.Engine.run(engine.current!)
        Matter.Render.run(render.current!)

        // Handle window resize
        const handleResize = () => {
            if (render.current) {
                Matter.Render.stop(render.current)
                render.current.canvas.width = window.innerWidth
                render.current.canvas.height = window.innerHeight
                Matter.Render.run(render.current)
            }
        }

        window.addEventListener("resize", handleResize)

        // Cleanup on component unmount
        return () => {
            Matter.Render.stop(render.current!)
            Matter.World.clear(engine.current!.world, false)
            Matter.Engine.clear(engine.current!)
            render.current!.canvas.remove()
            render.current!.canvas = null
            render.current = null
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    return (
        <div
            ref={scene}
            className="relative h-[100vh] w-[100vw] overflow-hidden"
        ></div>
    )
}

export default PhysicsEngine
