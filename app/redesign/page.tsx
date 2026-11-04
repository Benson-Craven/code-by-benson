import type { Metadata } from "next"
import Link from "next/link"
import FrogTrickArtwork from "./FrogTrickArtwork"
import FrogPresentation from "./FrogPresentation"
import ProjectPresentations from "./ProjectPresentations"
import IntroParagraph from "./IntroParagraph"
import styles from "./redesign.module.css"

export const metadata: Metadata = {
    title: "Redesign preview",
    description: "Benson Craven, full-stack developer based in Cork, Ireland.",
    robots: { index: false, follow: false },
    alternates: { canonical: "/redesign" },
}

function FrogSlot({ trick = false }: { trick?: boolean }) {
    return (
        <div className={styles.frogSlot} data-frog-slot aria-hidden="true">
            {/* The fallback is rendered from the same procedural rig as the canvas. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src="/frog-mascot/frog-static.png"
                alt=""
                width={320}
                height={336}
            />
            {trick && (
                <>
                    <p
                        className={styles.footerDialogue}
                        data-frog-dialogue
                        hidden
                    />
                    <FrogTrickArtwork />
                </>
            )}
        </div>
    )
}

export default function Redesign() {
    return (
        <div className={styles.preview} data-redesign>
            <a href="#redesign-main" className={styles.skip}>
                Skip to content
            </a>
            <main id="redesign-main" tabIndex={-1}>
                <section
                    className={styles.hero}
                    data-frog-section
                    aria-labelledby="redesign-title"
                >
                    <header className={styles.header}>
                        <Link href="/" className={styles.identity}>
                            <strong>Benson Craven</strong>
                            <span>Full-stack developer</span>
                        </Link>
                        <nav aria-label="Preview navigation">
                            <a href="#contact">Get in touch</a>
                        </nav>
                    </header>
                    <div className={styles.heroBottom}>
                        <h1 id="redesign-title">
                            I build things
                            <br />
                            for the <em>web</em>.
                        </h1>
                        <div className={styles.heroGuide}>
                            <p className={styles.greeting} data-frog-greeting>
                                Hi, I&apos;m Benson&apos;s frog. Scroll down,
                                I&apos;ll show you around.
                            </p>
                            <FrogSlot />
                        </div>
                    </div>
                </section>
                <section
                    id="intro"
                    className={styles.intro}
                    data-frog-section
                    aria-label="About Benson"
                >
                    <IntroParagraph />
                    <FrogSlot />
                </section>
                <ProjectPresentations />
            </main>
            <footer id="contact" className={styles.contact} data-frog-section>
                <div className={styles.contactCopy}>
                    <h2>Got something in mind?</h2>
                    <p>I&apos;m taking on new work</p>
                    <a
                        className={styles.sayHi}
                        href="mailto:bensoncraven@hotmail.co.uk"
                    >
                        Say hi
                    </a>
                </div>
                <div className={styles.footerBottom}>
                    <div className={styles.footerLinks}>
                        <a href="https://www.linkedin.com/in/benson-craven/">
                            LinkedIn
                        </a>
                        <a href="https://github.com/Benson-Craven">GitHub</a>
                        <Link href="/">Benson Codes</Link>
                        <button type="button" data-frog-trick>
                            Do a trick
                        </button>
                        <span
                            data-frog-trick-status
                            role="status"
                            className={styles.trickStatus}
                        />
                    </div>
                    <FrogSlot trick />
                </div>
            </footer>
            <FrogPresentation />
        </div>
    )
}
