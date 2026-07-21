import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import JsonLd from "./components/JsonLd"

const siteDescription =
    "Frontend Engineer in Cork building client websites, publishing tools and record-collection software with React, TypeScript and Next.js."

const themeInitScript = `
    (function () {
        try {
            var savedTheme = window.localStorage.getItem("benson-theme");
            var theme = savedTheme === "dark" || savedTheme === "light"
                ? savedTheme
                : "dark";
            var isDark = theme === "dark";

            document.documentElement.classList.toggle("dark", isDark);
            document.documentElement.style.colorScheme = theme;
        } catch (error) {
            document.documentElement.classList.add("dark");
            document.documentElement.style.colorScheme = "dark";
        }
    })();
`

export const metadata: Metadata = {
    title: {
        default: "Benson Craven | Frontend Engineer",
        template: "%s | Benson Craven",
    },
    description: siteDescription,
    keywords: [
        "Next.js",
        "React",
        "Frontend Engineer",
        "Cork",
        "TypeScript",
        "Accessibility",
        "Product Interfaces",
        "Content Architecture",
    ],
    authors: [{ name: "Benson Craven" }],
    creator: "Benson Craven",
    metadataBase: new URL("https://benson.codes"),
    alternates: {
        canonical: "https://benson.codes",
    },
    openGraph: {
        title: "Benson Craven | Frontend Engineer",
        description: siteDescription,
        type: "website",
        locale: "en_IE",
        url: "https://benson.codes",
        siteName: "Benson Craven",
        images: [
            {
                url: "/opengraph-image",
                width: 1200,
                height: 630,
                alt: "Benson Craven, Frontend Engineer",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Benson Craven | Frontend Engineer",
        description: siteDescription,
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
        <html
            lang="en"
            className="scroll-smooth font-satoshi"
            suppressHydrationWarning
        >
            <head>
                <script
                    id="theme-init"
                    dangerouslySetInnerHTML={{ __html: themeInitScript }}
                />
            </head>
            <body className="overflow-x-hidden bg-paper text-ink antialiased">
                <JsonLd />
                {children}
                <Analytics />
            </body>
        </html>
    )
}
