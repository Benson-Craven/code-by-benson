import type { Metadata } from "next"
import "./globals.css"
import JsonLd from "./components/JsonLd"

export const metadata: Metadata = {
    title: {
        default: "Benson Craven — Frontend Engineer",
        template: "%s | Benson Craven",
    },
    description:
        "Frontend-focused engineer building polished React and TypeScript products, production web platforms and real-time interfaces.",
    keywords: [
        "Next.js",
        "React",
        "Frontend Engineer",
        "Product Engineer",
        "Cork",
        "TypeScript",
        "Real-time Interfaces",
    ],
    authors: [{ name: "Benson Craven" }],
    creator: "Benson Craven",
    metadataBase: new URL("https://benson.codes"),
    alternates: {
        canonical: "https://benson.codes",
    },
    openGraph: {
        title: "Benson Craven — Frontend Engineer",
        description:
            "Frontend-focused engineer building polished React and TypeScript products, production web platforms and real-time interfaces.",
        type: "website",
        locale: "en_IE",
        url: "https://benson.codes",
        siteName: "Benson Craven",
        images: [
            {
                url: "/opengraph-image",
                width: 1200,
                height: 630,
                alt: "Benson Craven — Frontend Engineer",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Benson Craven — Frontend Engineer",
        description:
            "Frontend-focused engineer building polished React and TypeScript products, production web platforms and real-time interfaces.",
        images: ["/opengraph-image"],
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
            <body className="overflow-x-hidden bg-paper text-ink antialiased">
                <JsonLd />
                {children}
            </body>
        </html>
    )
}
