import { Metadata } from "next"
import InfoClient from "./InfoClient"

export const metadata: Metadata = {
    title: "About",
    description:
        "Learn more about Benson Craven, a British front end developer based in Cork, specializing in Next.js, React, and motion-rich interfaces.",
}

export default function InfoPage() {
    return <InfoClient />
}
