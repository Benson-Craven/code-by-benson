export default function JsonLd() {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Person",
                    name: "Benson Craven",
                    url: "https://benson.codes",
                    jobTitle: "Frontend Engineer",
                    knowsAbout: [
                        "React",
                        "Next.js",
                        "TypeScript",
                        "Frontend engineering",
                        "Real-time interfaces",
                        "SEO",
                    ],
                    address: {
                        "@type": "PostalAddress",
                        addressLocality: "Cork",
                        addressCountry: "IE",
                    },
                }),
            }}
        />
    )
}
