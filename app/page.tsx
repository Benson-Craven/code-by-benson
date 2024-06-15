"use client"

import { useEffect } from "react"
import Footer from "./components/Footer"
import HeroSection from "./components/HeroSection"
import Manifesto from "./components/Manifesto/page"
import Projects from "./components/Projects/page"
import Banner from "./components/Banner/page"
import Testimonials from "./components/Testimonials/page"

export default function Home() {
    useEffect(() => {
        ;(async () => {
            const LocomotiveScroll = (await import("locomotive-scroll")).default
            const locomotiveScroll = new LocomotiveScroll()
        })()
    }, [])

    return (
        <main>
            <section>
                <HeroSection />
                <Manifesto />
                <Banner />
                <Projects />
                <Testimonials />
                <Footer />
            </section>
        </main>
    )
}
