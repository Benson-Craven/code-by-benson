import type { Metadata } from "next"
import "./globals.css"
import Navbar from "./components/Navbar/Navbar"
import Footer from "./components/Footer"
import ProgressBar from "./components/ProgressBar"
import { StrictMode } from "react"

export const metadata: Metadata = {
    title: "Code by Benson",
    description:
        "Developer crafting elegant web solutions with Next.js, React, and modern web technologies. Transforming innovative ideas into performant, user-centric digital experiences.",
    keywords: [
        "Next.js",
        "React",
        "Full-stack",
        "Web Development",
        "Frontend",
        "JavaScript",
        "TypeScript",
    ],
    openGraph: {
        title: "Benson Craven - Web Developer",
        description:
            "Innovative development bringing ideas to life through cutting-edge web technologies.",
        type: "website",
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" className="scroll-smooth font-satoshi">
            <body className="overflow-x-hidden">
                <Navbar />
                {children}
                <ProgressBar />
                <Footer />
            </body>
        </html>
    )
}
