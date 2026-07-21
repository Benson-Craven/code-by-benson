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
                        "Accessible frontend engineering",
                        "Product interfaces",
                        "Content architecture",
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
