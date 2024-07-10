"use client"

import HeroSection from "./components/HeroSection"
import Projects from "./components/Projects"
import Banner from "./components/Banner"
import ParallaxSection from "./components/Parallax/page"

export default function Home() {
    return (
        <main>
            <section>
                <HeroSection />
                <ParallaxSection />
                <Banner />
                <Projects />
            </section>
        </main>
    )
}
