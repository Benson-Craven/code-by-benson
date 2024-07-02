"use client"

import { useEffect } from "react"
import Footer from "./components/Footer"
import HeroSection from "./components/HeroSection"
import Manifesto from "./components/Manifesto/page"
import Projects from "./components/Projects/page"
import Banner from "./components/Banner/page"
import Testimonials from "./components/Testimonials/page"
import ParallaxSection from "./components/Parallax/page"
import ProgressBar from "./components/ProgressBar/page"
import Lenis from "lenis"

export default function Home() {
    // useEffect(() => {
    //     ;(async () => {
    //         const LocomotiveScroll = (await import("locomotive-scroll")).default
    //         const locomotiveScroll = new LocomotiveScroll()
    //     })()
    // }, [])

    // useEffect(() => {
    //     const lenis = new Lenis()

    //     function raf(time: number) {
    //         lenis.raf(time)

    //         requestAnimationFrame(raf)
    //     }

    //     requestAnimationFrame(raf)
    // }, [])

    return (
        <main>
            <section>
                <HeroSection />
                <ParallaxSection />
                {/* <Manifesto /> */}
                <Banner />
                <Projects />
                {/* <Testimonials /> */}
                <ProgressBar />
                <Footer />
            </section>
        </main>
    )
}
