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
                    jobTitle: "Front & Full-Stack Developer",
                    address: { "@type": "PostalAddress", addressLocality: "Cork", addressCountry: "IE" },
                }),
            }}
        />
    )
}
