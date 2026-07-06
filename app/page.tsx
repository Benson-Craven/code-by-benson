import About from "./components/about/About"
import EngineeringApproach from "./components/approach/EngineeringApproach"
import Experience from "./components/experience/Experience"
import SiteFooter from "./components/footer/SiteFooter"
import Hero from "./components/hero/Hero"
import SiteHeader from "./components/navigation/SiteHeader"
import SelectedWork from "./components/work/SelectedWork"

export default function Home() {
    return (
        <>
            <SiteHeader />
            <main>
                <Hero />
                <SelectedWork />
                <EngineeringApproach />
                <Experience />
                <About />
            </main>
            <SiteFooter />
        </>
    )
}
