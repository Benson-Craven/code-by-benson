import type { Metadata } from "next"
import "./globals.css"
import Navbar from "./components/Navbar/Navbar"
import Footer from "./components/Footer"
import ProgressBar from "./components/ProgressBar"
import JsonLd from "./components/JsonLd"

export const metadata: Metadata = {
    title: {
        default: "Benson Craven — Front & Full-Stack Developer",
        template: "%s | Benson Craven",
    },
    description:
        "British developer based in Cork, building fast, forward-thinking web experiences. Specialising in Next.js, React, and motion-rich interfaces.",
    keywords: [
        "Next.js",
        "React",
        "Full-Stack",
        "Front-End",
        "Web Developer",
        "Cork",
        "TypeScript",
        "Framer Motion",
    ],
    authors: [{ name: "Benson Craven" }],
    creator: "Benson Craven",
    metadataBase: new URL("https://benson.codes"),
    alternates: {
        canonical: "https://benson.codes",
    },
    openGraph: {
        title: "Benson Craven — Front & Full-Stack Developer",
        description:
            "British developer based in Cork, building fast, forward-thinking web experiences.",
        type: "website",
        locale: "en_IE",
        url: "https://benson.codes",
    },
    twitter: {
        card: "summary_large_image",
        title: "Benson Craven — Front & Full-Stack Developer",
        description:
            "British developer based in Cork, building fast, forward-thinking web experiences.",
        images: ["/images/portrait-bnw.JPG"],
    },
    robots: { index: true, follow: true },
    verification: {
        google: "stOsmXJ-oVusLV7JPstzc1DUQPrmt7qGXItLUPGzo5U",
    },
}

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className="scroll-smooth font-satoshi">
            <body className="overflow-x-hidden">
                <JsonLd />
                <Navbar />
                {children}
                <ProgressBar />
                <Footer />
            </body>
        </html>
    )
}
