import gsap from "gsap"
import type { FrogInstance } from "./frogAdapter"
import { frogTrick } from "./frogTreatment"

interface FrogTricksOptions {
    host: HTMLElement
    artwork: SVGSVGElement
    button: HTMLButtonElement
    status: HTMLElement
    footer: HTMLElement
    getFrog: () => FrogInstance | undefined
    reduced: () => boolean
    narrow: () => boolean
    failed: () => boolean
    beforeTrick?: () => void
}

export function createFrogTricks({
    host,
    artwork,
    button,
    status,
    footer,
    getFrog,
    reduced,
    narrow,
    failed,
    beforeTrick,
}: FrogTricksOptions) {
    const firefly = artwork.querySelector<SVGGElement>("[data-firefly]")!
    const tongues = Array.from(
        artwork.querySelectorAll<SVGPathElement>("[data-frog-tongue]"),
    )
    const setMessage = (text: string) => {
        status.textContent = text
    }
    let disposed = false
    let footerSeen = false
    let clicks = 0
    let busy = false
    let caught = false
    const catchState = { reach: 0, returning: false }
    const flight = { x: 78, y: 23 }
    let flightTween: gsap.core.Tween | undefined
    let hop: gsap.core.Timeline | undefined
    function drawCatch() {
        const frog = getFrog()
        if (!frog) return
        const mouth = frog.mouthScreenPos()
        const hostRect = host.getBoundingClientRect()
        const artRect = artwork.getBoundingClientRect()
        if (!artRect.width || !artRect.height) return
        const x =
            ((hostRect.left + mouth.x - artRect.left) / artRect.width) * 100
        const y =
            ((hostRect.top + mouth.y - artRect.top) / artRect.height) * 105
        const tipX = x + (flight.x - x) * catchState.reach
        const tipY = y + (flight.y - y) * catchState.reach
        tongues.forEach((tongue) =>
            tongue.setAttribute(
                "d",
                catchState.reach > 0 ? `M${x} ${y}L${tipX} ${tipY}` : "",
            ),
        )
        if (catchState.returning)
            firefly.setAttribute("transform", `translate(${tipX} ${tipY})`)
    }

    function resetTrick() {
        hop?.kill()
        hop = undefined
        flightTween?.pause()
        artwork.dataset.fluttering = "false"
        busy = false
        button.removeAttribute("aria-disabled")
        catchState.reach = 0
        tongues.forEach((tongue) => tongue.removeAttribute("d"))
        gsap.set(host, { y: 0 })
        gsap.set(firefly, { opacity: caught ? 0 : footerSeen ? 1 : 0 })
    }

    function fly() {
        if (disposed || caught) return
        const rect = artwork.getBoundingClientRect()
        const minX = Math.max(-47.5, ((8 - rect.left) / rect.width) * 100)
        const maxX = Math.min(
            147.5,
            ((innerWidth - 8 - rect.left) / rect.width) * 100,
        )
        const start = { ...flight }
        const end = {
            x: minX + Math.random() * (maxX - minX),
            y: narrow() ? -45 + Math.random() * 90 : -55 + Math.random() * 180,
        }
        const control = {
            x: gsap.utils.clamp(
                minX,
                maxX,
                (start.x + end.x) / 2 + (Math.random() - 0.5) * 60,
            ),
            y: gsap.utils.clamp(
                -55,
                125,
                (start.y + end.y) / 2 + (Math.random() - 0.5) * 60,
            ),
        }
        const progress = { value: 0 }
        flightTween = gsap.to(progress, {
            value: 1,
            duration:
                3.5 +
                Math.hypot(end.x - start.x, end.y - start.y) / 30 +
                Math.random() * 1.5,
            ease: "sine.inOut",
            onUpdate: () => {
                const t = progress.value
                const remaining = 1 - t
                flight.x =
                    remaining ** 2 * start.x +
                    2 * remaining * t * control.x +
                    t ** 2 * end.x
                flight.y =
                    remaining ** 2 * start.y +
                    2 * remaining * t * control.y +
                    t ** 2 * end.y
                firefly.setAttribute(
                    "transform",
                    `translate(${flight.x} ${flight.y})`,
                )
            },
            onComplete: fly,
        })
    }

    function updateFirefly(running: boolean) {
        const rect = footer.getBoundingClientRect()
        const visible = rect.top < innerHeight && rect.bottom > 0
        if (visible && !footerSeen) {
            footerSeen = true
            firefly.setAttribute("transform", "translate(78 23)")
            gsap.set(firefly, { opacity: 1 })
        }
        const flying =
            visible &&
            !document.hidden &&
            !reduced() &&
            running &&
            !caught &&
            !failed()
        artwork.dataset.fluttering = String(flying)
        if (flying) {
            if (flightTween) flightTween.resume()
            else fly()
        } else flightTween?.pause()
        if (hop && busy) {
            if (running && visible) hop.resume()
            else hop.pause()
        }
    }

    function trick() {
        if (busy) return
        beforeTrick?.()
        const frog = getFrog()
        if (clicks >= 4) {
            setMessage("Sighs...")
            return
        }
        if (reduced() || !frog || failed()) {
            setMessage("The frog is resting. Tricks need animation enabled.")
            return
        }
        const action = frogTrick(++clicks)
        setMessage("")
        frog.wake()
        busy = true
        button.setAttribute("aria-disabled", "true")
        const complete = (text: string) => {
            busy = false
            button.removeAttribute("aria-disabled")
            setMessage(text)
            getFrog()?.setAttention(null)
        }
        if (action === "catch") {
            caught = true
            flightTween?.kill()
            artwork.dataset.fluttering = "false"
            catchState.returning = false
            frog.setAttention(-0.5, -0.3)
            hop = gsap
                .timeline({
                    onUpdate: drawCatch,
                    onComplete: () => {
                        tongues.forEach((tongue) => tongue.removeAttribute("d"))
                        gsap.set(firefly, { opacity: 0 })
                        getFrog()?.talk(0.4)
                        complete("Gulp!")
                    },
                })
                .to(
                    catchState,
                    { reach: 1, duration: 0.22, ease: "power2.in" },
                    0.2,
                )
                .set(catchState, { returning: true })
                .to(
                    catchState,
                    { reach: 0, duration: 0.3, ease: "power2.in" },
                    "+=0.08",
                )
            return
        }
        hop = gsap
            .timeline({ onComplete: () => complete("One small hop!") })
            .to(host, { y: -64, duration: 0.26, ease: "power2.out" })
            .to(host, { y: 0, duration: 0.32, ease: "power2.in" })
    }

    button.addEventListener("click", trick)
    return {
        get busy() {
            return busy
        },
        update: updateFirefly,
        reset: resetTrick,
        destroy() {
            disposed = true
            resetTrick()
            flightTween?.kill()
            button.removeEventListener("click", trick)
            gsap.killTweensOf([firefly, catchState])
        },
    }
}
