import type { Metadata } from "next"
import "./globals.css"
import Navbar from "./components/Navbar"

export const metadata: Metadata = {
    title: "Code by Benson",
    description: "by Benson Craven",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" className="scroll-smooth font-helvetica">
            <body className="overflow-x-hidden bg-black">
                <Navbar />
                {children}
            </body>
        </html>
    )
}
