"use client"

import { Fragment, useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

function words(text: string) {
    return text.split(" ").map((word, index) => (
        <Fragment key={index}>
            {index > 0 ? " " : null}
            <span data-intro-word>{word}</span>
        </Fragment>
    ))
}

export default function IntroParagraph({ className }: { className?: string }) {
    const paragraphRef = useRef<HTMLParagraphElement>(null)

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger)
        const paragraph = paragraphRef.current!
        const media = gsap.matchMedia()
        let disposed = false

        media.add("(prefers-reduced-motion: no-preference)", () => {
            gsap.fromTo(
                paragraph.querySelectorAll("[data-intro-word]"),
                { opacity: 0.1 },
                {
                    opacity: 1,
                    duration: 1,
                    stagger: 1,
                    ease: "none",
                    scrollTrigger: {
                        trigger: paragraph,
                        start: "top 80%",
                        end: "bottom 50%",
                        scrub: true,
                    },
                },
            )
        })

        void document.fonts.ready.then(() => {
            if (!disposed) ScrollTrigger.refresh()
        })

        return () => {
            disposed = true
            media.revert()
        }
    }, [])

    return (
        <p ref={paragraphRef} className={className}>
            {words(
                "I'm a full-stack developer with a focus on frontend, based in Cork, Ireland. For three years I've built fast, accessible websites, and I care most about",
            )}{" "}
            <em className="font-light not-italic text-preview-blue">
                {words("interactive motion")}
            </em>{" "}
            {words("and")} {words("thoughtful design.")}
        </p>
    )
}
