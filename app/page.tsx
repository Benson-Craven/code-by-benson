import Footer from "./components/Footer"
import HeroSection from "./components/HeroSection"
import HeroSectionII from "./components/HeroSectionII"
import Manifesto from "./components/Manifesto"
import { Vortex } from "./components/Vortex"

export default function Home() {
    return (
        <main>
            <section>
                {/* <HeroSection /> */}
                <HeroSectionII />
                {/* <Vortex /> */}
                <Manifesto />
                <Footer />
            </section>
        </main>
    )
}
