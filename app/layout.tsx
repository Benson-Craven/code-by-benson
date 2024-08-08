import type { Metadata } from "next"
import "./globals.css"
import Navbar from "./components/Navbar/Navbar"
import Footer from "./components/Footer"
import ProgressBar from "./components/ProgressBar"
import { StrictMode } from "react"

export const metadata: Metadata = {
    title: "Code by Benson",
    description: "Created by Benson Craven",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" className="scroll-smooth font-helvetica">
            <body className="overflow-x-hidden">
                <Navbar />
                {children}
                <ProgressBar />
                <Footer />
            </body>
        </html>
    )
}
